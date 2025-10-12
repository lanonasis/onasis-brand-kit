# MCP OAuth Flow Design

## Overview

This document outlines a unified OAuth 2.0 authentication flow for the Lan Onasis MCP integration that works consistently across terminal, desktop, and mobile environments using HTTPS transport.

## Architecture Components

### 1. OAuth Authorization Server
- **Base URL**: `https://auth.lanonasis.com`
- **Endpoints**:
  - `/oauth/authorize` - Authorization endpoint
  - `/oauth/token` - Token exchange endpoint
  - `/oauth/device` - Device code endpoint (for terminal)
  - `/oauth/callback` - Universal callback handler
  - `/oauth/revoke` - Token revocation

### 2. Client Types

#### Terminal Client
Uses OAuth 2.0 Device Authorization Grant (RFC 8628)
```
┌──────────────┐                                ┌────────────────┐
│   Terminal   │                                │ Auth Server    │
│   Client     │                                │                │
└──────┬───────┘                                └───────┬────────┘
       │                                                │
       │ 1. Request device code                         │
       ├───────────────────────────────────────────────>│
       │                                                │
       │ 2. Device code + verification URL              │
       │<───────────────────────────────────────────────┤
       │                                                │
       │ 3. Display URL to user                         │
       │                                                │
       │ 4. Poll for token                              │
       ├───────────────────────────────────────────────>│
       │                                                │
       │ 5. Access token (when authorized)             │
       │<───────────────────────────────────────────────┤
```

#### Desktop/Mobile Client
Uses OAuth 2.0 Authorization Code Flow with PKCE
```
┌──────────────┐                                ┌────────────────┐
│Desktop/Mobile│                                │ Auth Server    │
│   Client     │                                │                │
└──────┬───────┘                                └───────┬────────┘
       │                                                │
       │ 1. Authorization request + PKCE                │
       ├───────────────────────────────────────────────>│
       │                                                │
       │ 2. Redirect to login                           │
       │<───────────────────────────────────────────────┤
       │                                                │
       │ 3. Authorization code                          │
       │<───────────────────────────────────────────────┤
       │                                                │
       │ 4. Exchange code for token                     │
       ├───────────────────────────────────────────────>│
       │                                                │
       │ 5. Access token                                │
       │<───────────────────────────────────────────────┤
```

## Implementation Details

### 1. Device Code Flow (Terminal)

```typescript
// Terminal OAuth flow implementation
export class TerminalOAuthFlow {
  private readonly clientId = 'lanonasis-mcp-cli';
  private readonly authBaseUrl = 'https://auth.lanonasis.com';
  
  async authenticate(): Promise<TokenResponse> {
    // Step 1: Request device code
    const deviceResponse = await this.requestDeviceCode();
    
    // Step 2: Display verification URL to user
    console.log(`Please visit: ${deviceResponse.verification_uri}`);
    console.log(`Enter code: ${deviceResponse.user_code}`);
    
    // Step 3: Open browser automatically (if possible)
    if (deviceResponse.verification_uri_complete) {
      await this.openBrowser(deviceResponse.verification_uri_complete);
    }
    
    // Step 4: Poll for token
    return await this.pollForToken(deviceResponse.device_code, deviceResponse.interval);
  }
  
  private async requestDeviceCode(): Promise<DeviceCodeResponse> {
    const response = await fetch(`${this.authBaseUrl}/oauth/device`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        client_id: this.clientId,
        scope: 'mcp:read mcp:write api_keys:manage'
      })
    });
    
    return await response.json();
  }
  
  private async pollForToken(deviceCode: string, interval: number): Promise<TokenResponse> {
    while (true) {
      await new Promise(resolve => setTimeout(resolve, interval * 1000));
      
      const response = await fetch(`${this.authBaseUrl}/oauth/token`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          grant_type: 'urn:ietf:params:oauth:grant-type:device_code',
          device_code: deviceCode,
          client_id: this.clientId
        })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        return data;
      }
      
      if (data.error === 'authorization_pending') {
        continue; // Keep polling
      }
      
      throw new Error(data.error_description || 'Authentication failed');
    }
  }
  
  private async openBrowser(url: string): Promise<void> {
    const open = process.platform === 'darwin' ? 'open' : 
                 process.platform === 'win32' ? 'start' : 'xdg-open';
    
    try {
      await exec(`${open} "${url}"`);
    } catch (e) {
      // Fallback to manual opening
    }
  }
}
```

### 2. Desktop/Mobile Flow

```typescript
// Desktop/Mobile OAuth flow implementation
export class DesktopOAuthFlow {
  private readonly clientId = 'lanonasis-mcp-desktop';
  private readonly authBaseUrl = 'https://auth.lanonasis.com';
  private readonly redirectUri = 'lanonasis://oauth/callback';
  
  async authenticate(): Promise<TokenResponse> {
    // Step 1: Generate PKCE challenge
    const codeVerifier = this.generateCodeVerifier();
    const codeChallenge = await this.generateCodeChallenge(codeVerifier);
    
    // Step 2: Build authorization URL
    const authUrl = this.buildAuthorizationUrl(codeChallenge);
    
    // Step 3: Open browser/webview
    const authCode = await this.openAuthWindow(authUrl);
    
    // Step 4: Exchange code for token
    return await this.exchangeCodeForToken(authCode, codeVerifier);
  }
  
  private buildAuthorizationUrl(codeChallenge: string): string {
    const params = new URLSearchParams({
      client_id: this.clientId,
      response_type: 'code',
      redirect_uri: this.redirectUri,
      scope: 'mcp:read mcp:write api_keys:manage',
      code_challenge: codeChallenge,
      code_challenge_method: 'S256',
      state: this.generateState()
    });
    
    return `${this.authBaseUrl}/oauth/authorize?${params}`;
  }
  
  private async exchangeCodeForToken(code: string, codeVerifier: string): Promise<TokenResponse> {
    const response = await fetch(`${this.authBaseUrl}/oauth/token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        grant_type: 'authorization_code',
        code: code,
        client_id: this.clientId,
        redirect_uri: this.redirectUri,
        code_verifier: codeVerifier
      })
    });
    
    return await response.json();
  }
}
```

### 3. Web Authorization Interface

```typescript
// Web interface for OAuth authorization
export const OAuthAuthorizationPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const searchParams = useSearchParams();
  const navigate = useNavigate();
  
  const clientId = searchParams.get('client_id');
  const redirectUri = searchParams.get('redirect_uri');
  const state = searchParams.get('state');
  const userCode = searchParams.get('user_code'); // For device flow
  
  const handleAuthorize = async () => {
    setLoading(true);
    
    try {
      // Check if user is logged in
      const { user } = await supabase.auth.getUser();
      
      if (!user) {
        // Redirect to login with return URL
        navigate('/auth/login', { 
          state: { returnTo: window.location.href } 
        });
        return;
      }
      
      // Create or retrieve API key for MCP
      const apiKey = await createMCPApiKey(user.id);
      
      if (userCode) {
        // Device flow: Associate code with user
        await associateDeviceCode(userCode, user.id, apiKey);
        
        // Show success message
        return <DeviceAuthSuccess />;
      } else {
        // Authorization code flow: Redirect back
        const authCode = await generateAuthCode(user.id, clientId, apiKey);
        
        const callbackUrl = new URL(redirectUri);
        callbackUrl.searchParams.set('code', authCode);
        callbackUrl.searchParams.set('state', state);
        
        window.location.href = callbackUrl.toString();
      }
    } catch (error) {
      console.error('Authorization error:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold">Authorize MCP Access</h2>
          <p className="mt-2 text-gray-600">
            {clientId} wants to access your Lan Onasis account
          </p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="font-semibold mb-4">This application will be able to:</h3>
          <ul className="space-y-2 text-sm">
            <li className="flex items-start">
              <CheckIcon className="mr-2 text-green-500" />
              Read and write memory entries
            </li>
            <li className="flex items-start">
              <CheckIcon className="mr-2 text-green-500" />
              Manage API keys on your behalf
            </li>
            <li className="flex items-start">
              <CheckIcon className="mr-2 text-green-500" />
              Access MCP services
            </li>
          </ul>
        </div>
        
        <div className="flex space-x-4">
          <button
            onClick={handleAuthorize}
            disabled={loading}
            className="flex-1 bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
          >
            {loading ? 'Authorizing...' : 'Authorize'}
          </button>
          <button
            onClick={() => window.close()}
            className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded hover:bg-gray-400"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};
```

### 4. Unified Token Storage

```typescript
// Cross-platform token storage
export class TokenStorage {
  private readonly storageKey = 'lanonasis_mcp_tokens';
  
  async store(tokens: TokenResponse): Promise<void> {
    if (this.isNode()) {
      // Terminal: Use system keychain
      await keytar.setPassword('lanonasis-mcp', 'tokens', JSON.stringify(tokens));
    } else if (this.isElectron()) {
      // Desktop: Use secure storage
      await window.electronAPI.secureStore.set(this.storageKey, tokens);
    } else if (this.isMobile()) {
      // Mobile: Use secure storage plugin
      await SecureStorage.set(this.storageKey, JSON.stringify(tokens));
    } else {
      // Web: Use encrypted localStorage
      const encrypted = await this.encrypt(JSON.stringify(tokens));
      localStorage.setItem(this.storageKey, encrypted);
    }
  }
  
  async retrieve(): Promise<TokenResponse | null> {
    let tokenString: string | null = null;
    
    if (this.isNode()) {
      tokenString = await keytar.getPassword('lanonasis-mcp', 'tokens');
    } else if (this.isElectron()) {
      tokenString = await window.electronAPI.secureStore.get(this.storageKey);
    } else if (this.isMobile()) {
      tokenString = await SecureStorage.get(this.storageKey);
    } else {
      const encrypted = localStorage.getItem(this.storageKey);
      if (encrypted) {
        tokenString = await this.decrypt(encrypted);
      }
    }
    
    return tokenString ? JSON.parse(tokenString) : null;
  }
  
  async clear(): Promise<void> {
    if (this.isNode()) {
      await keytar.deletePassword('lanonasis-mcp', 'tokens');
    } else if (this.isElectron()) {
      await window.electronAPI.secureStore.delete(this.storageKey);
    } else if (this.isMobile()) {
      await SecureStorage.remove(this.storageKey);
    } else {
      localStorage.removeItem(this.storageKey);
    }
  }
}
```

### 5. MCP Client with OAuth

```typescript
// Unified MCP client with OAuth support
export class MCPClient {
  private tokenStorage: TokenStorage;
  private authFlow: OAuthFlow;
  
  constructor() {
    this.tokenStorage = new TokenStorage();
    
    // Select appropriate auth flow based on platform
    if (this.isTerminal()) {
      this.authFlow = new TerminalOAuthFlow();
    } else {
      this.authFlow = new DesktopOAuthFlow();
    }
  }
  
  async connect(): Promise<void> {
    // Check for existing tokens
    let tokens = await this.tokenStorage.retrieve();
    
    if (!tokens || this.isTokenExpired(tokens)) {
      // Initiate OAuth flow
      tokens = await this.authFlow.authenticate();
      await this.tokenStorage.store(tokens);
    }
    
    // Use access token for MCP connection
    this.accessToken = tokens.access_token;
    await this.establishMCPConnection();
  }
  
  private async establishMCPConnection(): Promise<void> {
    // Connect to MCP with OAuth token
    this.ws = new WebSocket('wss://mcp.lanonasis.com/ws', {
      headers: {
        'Authorization': `Bearer ${this.accessToken}`
      }
    });
    
    // Or for SSE
    this.eventSource = new EventSource('https://mcp.lanonasis.com/sse', {
      headers: {
        'Authorization': `Bearer ${this.accessToken}`
      }
    });
  }
  
  async makeRequest(method: string, params: any): Promise<any> {
    const response = await fetch('https://mcp.lanonasis.com/api', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ method, params })
    });
    
    if (response.status === 401) {
      // Token expired, re-authenticate
      await this.connect();
      return this.makeRequest(method, params);
    }
    
    return response.json();
  }
}
```

## Server Implementation

### 1. OAuth Endpoints (Supabase Edge Functions)

```typescript
// /oauth/device endpoint
export async function handleDeviceCode(req: Request): Promise<Response> {
  const { client_id, scope } = await req.json();
  
  // Validate client
  if (!isValidClient(client_id)) {
    return new Response(JSON.stringify({ error: 'invalid_client' }), { status: 400 });
  }
  
  // Generate device code and user code
  const deviceCode = generateSecureToken();
  const userCode = generateUserCode(); // e.g., "ABCD-1234"
  
  // Store in temporary storage
  await storeDeviceCode({
    device_code: deviceCode,
    user_code: userCode,
    client_id,
    scope,
    expires_at: Date.now() + 600000, // 10 minutes
    status: 'pending'
  });
  
  return new Response(JSON.stringify({
    device_code: deviceCode,
    user_code: userCode,
    verification_uri: 'https://auth.lanonasis.com/device',
    verification_uri_complete: `https://auth.lanonasis.com/device?user_code=${userCode}`,
    expires_in: 600,
    interval: 5
  }));
}

// /oauth/authorize endpoint
export async function handleAuthorize(req: Request): Promise<Response> {
  const url = new URL(req.url);
  const params = Object.fromEntries(url.searchParams);
  
  // Validate parameters
  const validation = validateAuthRequest(params);
  if (!validation.valid) {
    return new Response(validation.error, { status: 400 });
  }
  
  // Check if user is authenticated
  const { user } = await supabase.auth.getUser();
  if (!user) {
    // Redirect to login
    return Response.redirect(`/auth/login?return_to=${encodeURIComponent(req.url)}`);
  }
  
  // Show authorization page
  return new Response(await renderAuthorizationPage(params, user));
}

// /oauth/token endpoint
export async function handleToken(req: Request): Promise<Response> {
  const data = await req.json();
  
  if (data.grant_type === 'urn:ietf:params:oauth:grant-type:device_code') {
    // Handle device code flow
    return handleDeviceToken(data);
  } else if (data.grant_type === 'authorization_code') {
    // Handle authorization code flow
    return handleAuthCodeToken(data);
  } else if (data.grant_type === 'refresh_token') {
    // Handle refresh token
    return handleRefreshToken(data);
  }
  
  return new Response(JSON.stringify({ error: 'unsupported_grant_type' }), { status: 400 });
}
```

### 2. Database Schema

```sql
-- OAuth clients table
CREATE TABLE oauth_clients (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  client_id VARCHAR(255) UNIQUE NOT NULL,
  client_name VARCHAR(255) NOT NULL,
  client_type VARCHAR(50) NOT NULL, -- 'public' or 'confidential'
  redirect_uris TEXT[] DEFAULT '{}',
  allowed_scopes TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- OAuth device codes table
CREATE TABLE oauth_device_codes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  device_code VARCHAR(255) UNIQUE NOT NULL,
  user_code VARCHAR(20) UNIQUE NOT NULL,
  client_id VARCHAR(255) NOT NULL,
  scope TEXT,
  user_id UUID REFERENCES auth.users(id),
  status VARCHAR(20) DEFAULT 'pending', -- pending, authorized, expired
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- OAuth authorization codes table
CREATE TABLE oauth_auth_codes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code VARCHAR(255) UNIQUE NOT NULL,
  client_id VARCHAR(255) NOT NULL,
  user_id UUID NOT NULL REFERENCES auth.users(id),
  redirect_uri TEXT,
  scope TEXT,
  code_challenge TEXT,
  code_challenge_method VARCHAR(10),
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- OAuth tokens table
CREATE TABLE oauth_tokens (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  access_token VARCHAR(255) UNIQUE NOT NULL,
  refresh_token VARCHAR(255) UNIQUE,
  token_type VARCHAR(50) DEFAULT 'Bearer',
  client_id VARCHAR(255) NOT NULL,
  user_id UUID NOT NULL REFERENCES auth.users(id),
  scope TEXT,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_device_codes_user_code ON oauth_device_codes(user_code);
CREATE INDEX idx_device_codes_status ON oauth_device_codes(status);
CREATE INDEX idx_auth_codes_code ON oauth_auth_codes(code);
CREATE INDEX idx_tokens_access_token ON oauth_tokens(access_token);
CREATE INDEX idx_tokens_refresh_token ON oauth_tokens(refresh_token);
```

## Security Considerations

1. **PKCE Required**: All public clients must use PKCE
2. **Token Rotation**: Refresh tokens are rotated on use
3. **Secure Storage**: Platform-specific secure storage for tokens
4. **HTTPS Only**: All communication over HTTPS
5. **CORS**: Strict CORS policies for OAuth endpoints
6. **Rate Limiting**: Prevent brute force attacks
7. **Token Expiry**: Short-lived access tokens (1 hour)
8. **Scope Validation**: Strict scope checking

## User Experience

### Terminal Flow
```
$ lanonasis-mcp connect
Authenticating with Lan Onasis...

Please visit: https://auth.lanonasis.com/device
Enter code: ABCD-1234

Opening browser... (or visit the URL manually)

Waiting for authorization...
✓ Successfully authenticated!
✓ API key stored securely

You can now use MCP commands.
```

### Desktop/Mobile Flow
```
1. User clicks "Connect to Lan Onasis"
2. Browser/WebView opens to auth page
3. User logs in (if needed)
4. User sees permission request
5. User clicks "Authorize"
6. App receives token automatically
7. User sees "Connected successfully!"
```

## Integration Examples

### CLI Tool
```bash
# First time setup
$ npm install -g @lanonasis/cli
$ lanonasis auth login
# Opens browser for OAuth flow
✓ Authenticated successfully!

# Using MCP
$ lanonasis mcp create-memory "My important note"
✓ Memory created successfully
```

### Desktop App
```typescript
// In Electron app
const mcp = new MCPClient();

async function connectToLanonasis() {
  try {
    await mcp.connect(); // Handles OAuth flow
    console.log('Connected to Lan Onasis MCP');
    
    // Now use MCP
    const memories = await mcp.searchMemories('project notes');
  } catch (error) {
    console.error('Connection failed:', error);
  }
}
```

### Mobile App
```swift
// In iOS app
let mcpClient = MCPClient()

func connectToLanonasis() {
    mcpClient.authenticate { result in
        switch result {
        case .success(let token):
            // Store token securely
            KeychainService.store(token)
            // Use MCP
            self.loadMemories()
        case .failure(let error):
            // Handle error
            self.showError(error)
        }
    }
}
```

## Migration Path

1. **Phase 1**: Implement OAuth server endpoints
2. **Phase 2**: Update CLI to use device flow
3. **Phase 3**: Update desktop apps to use auth code flow
4. **Phase 4**: Deprecate API key authentication
5. **Phase 5**: Full OAuth-only access

This design ensures a consistent, secure, and user-friendly authentication experience across all platforms while maintaining the flexibility needed for different environments.