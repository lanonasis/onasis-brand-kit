# OAuth Setup Guide for Lan Onasis

## Overview

Lan Onasis uses OAuth 2.0 for secure authentication across all platforms. This guide covers setting up OAuth providers in Supabase and configuring the authentication flow.

## Supported OAuth Providers

Currently configured providers:
- ✅ Google
- ✅ GitHub  
- ✅ LinkedIn
- ✅ Discord
- 🔜 Apple (coming soon)
- 🔜 Microsoft (coming soon)
- 🔜 Twitter/X (coming soon)

## Supabase OAuth Configuration

### 1. Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable Google+ API
4. Create OAuth 2.0 credentials:
   - Application type: Web application
   - Authorized redirect URIs:
     ```
     https://mxtsdgkwzjzlttpotole.supabase.co/auth/v1/callback
     ```
5. Copy Client ID and Client Secret
6. In Supabase Dashboard → Authentication → Providers → Google:
   - Enable Google provider
   - Add Client ID and Client Secret
   - Save

### 2. GitHub OAuth Setup

1. Go to GitHub Settings → Developer settings → OAuth Apps
2. Click "New OAuth App"
3. Fill in:
   - Application name: `Lan Onasis`
   - Homepage URL: `https://lanonasis.com`
   - Authorization callback URL:
     ```
     https://mxtsdgkwzjzlttpotole.supabase.co/auth/v1/callback
     ```
4. Copy Client ID and Client Secret
5. In Supabase Dashboard → Authentication → Providers → GitHub:
   - Enable GitHub provider
   - Add Client ID and Client Secret
   - Save

### 3. LinkedIn OAuth Setup

1. Go to [LinkedIn Developers](https://www.linkedin.com/developers/)
2. Create a new app
3. Add OAuth 2.0 settings:
   - Redirect URLs:
     ```
     https://mxtsdgkwzjzlttpotole.supabase.co/auth/v1/callback
     ```
4. Request access to "Sign In with LinkedIn using OpenID Connect"
5. Copy Client ID and Client Secret
6. In Supabase Dashboard → Authentication → Providers → LinkedIn:
   - Enable LinkedIn provider
   - Add Client ID and Client Secret
   - Save

### 4. Discord OAuth Setup

1. Go to [Discord Developer Portal](https://discord.com/developers/applications)
2. Create a new application
3. Go to OAuth2 → General
4. Add redirect:
   ```
   https://mxtsdgkwzjzlttpotole.supabase.co/auth/v1/callback
   ```
5. Copy Client ID and Client Secret
6. In Supabase Dashboard → Authentication → Providers → Discord:
   - Enable Discord provider
   - Add Client ID and Client Secret
   - Save

## Application OAuth Flow Configuration

### Environment Variables

Add to your `.env` files:

```env
# Supabase Configuration
VITE_SUPABASE_URL=https://mxtsdgkwzjzlttpotole.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here

# OAuth Redirect URLs (for different environments)
VITE_OAUTH_REDIRECT_URL=http://localhost:5173/dashboard  # Development
# VITE_OAUTH_REDIRECT_URL=https://api.lanonasis.com/dashboard  # Production
```

### Redirect URL Configuration

For each environment, configure the appropriate redirect URLs:

#### Development
- Supabase redirect: `http://localhost:5173/dashboard`
- MCP OAuth: `http://localhost:5173/oauth/authorize`
- Device flow: `http://localhost:5173/device`

#### Production
- Supabase redirect: `https://api.lanonasis.com/dashboard`
- MCP OAuth: `https://api.lanonasis.com/oauth/authorize`
- Device flow: `https://api.lanonasis.com/device`

### Implementing OAuth in Your App

#### 1. Social Login Buttons

```typescript
import { supabase } from '@/integrations/supabase/client';

const handleSocialLogin = async (provider: 'google' | 'github' | 'linkedin' | 'discord') => {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo: `${window.location.origin}/dashboard`,
      scopes: provider === 'github' ? 'read:user user:email' : undefined,
    }
  });

  if (error) {
    console.error('OAuth error:', error);
  }
};
```

#### 2. Handle OAuth Callbacks

The `useAuth` hook automatically handles OAuth callbacks and creates user profiles:

```typescript
// In useAuth.tsx
supabase.auth.onAuthStateChange(async (event, session) => {
  if (event === 'SIGNED_IN' && session?.user) {
    // OAuth users may not have a profile yet
    if (session.user.app_metadata.provider !== 'email') {
      await createProfileForOAuthUser(session.user);
    }
  }
});
```

#### 3. MCP OAuth Flow

For MCP clients (CLI, extensions, etc.):

```typescript
import { MCPClient } from '@lanonasis/oauth-client';

const mcp = new MCPClient({
  clientId: 'lanonasis-mcp-cli'
});

// This will trigger OAuth flow if not authenticated
await mcp.connect();
```

## Testing OAuth Flows

### 1. Test Social Login

1. Start the development server:
   ```bash
   cd apps/lanonasis-maas/dashboard
   bun run dev
   ```

2. Navigate to `/auth/login`

3. Click on any social provider button

4. Complete the OAuth flow

5. Verify redirect to dashboard

### 2. Test MCP OAuth (Terminal)

1. Run the example CLI:
   ```bash
   bun run examples/cli-oauth-example.ts
   ```

2. Follow the device code flow:
   - Visit the URL shown
   - Enter the code
   - Authorize access

3. Verify the CLI receives the token

### 3. Test MCP OAuth (Desktop)

1. Use the OAuth client in your Electron app:
   ```typescript
   const mcp = new MCPClient({
     clientId: 'lanonasis-mcp-desktop',
     redirectUri: 'lanonasis://oauth/callback'
   });
   
   await mcp.connect();
   ```

2. The browser window should open automatically

3. Complete authorization

4. Verify the app receives the token

## Troubleshooting

### Common Issues

1. **"Redirect URL mismatch"**
   - Ensure the redirect URL in your app matches exactly what's configured in the OAuth provider
   - Check for trailing slashes and protocol (http vs https)

2. **"Invalid client"**
   - Verify Client ID and Secret are correctly copied
   - Ensure the OAuth provider is enabled in Supabase

3. **"User already registered"**
   - This happens when an email is used with multiple providers
   - Enable "Allow duplicate emails" in Supabase Auth settings

4. **Profile not created for OAuth users**
   - The `useAuth` hook should automatically create profiles
   - Check the profiles table RLS policies allow insert for authenticated users

### Debug Mode

Enable debug logging:

```typescript
// In your app
const { data, error } = await supabase.auth.signInWithOAuth({
  provider: 'google',
  options: {
    redirectTo: window.location.origin + '/dashboard',
    queryParams: {
      debug: 'true'
    }
  }
});
```

## Security Considerations

1. **Always use HTTPS in production**
   - OAuth providers require secure redirect URLs
   - Tokens should only be transmitted over HTTPS

2. **Validate redirect URLs**
   - Only allow redirects to your domains
   - Implement strict redirect URL validation

3. **Scope limitations**
   - Request only necessary scopes
   - Review provider documentation for scope options

4. **Token storage**
   - Use secure storage methods (keychain, encrypted storage)
   - Never store tokens in plain text

5. **PKCE for public clients**
   - All public clients (SPA, mobile, desktop) must use PKCE
   - The OAuth client library handles this automatically

## Next Steps

1. **Add more providers**: Follow the same pattern to add Microsoft, Apple, Twitter
2. **Customize UI**: Update the AuthForm component with your branding
3. **Add MFA**: Enable two-factor authentication for enhanced security
4. **Monitor usage**: Set up analytics to track OAuth usage patterns