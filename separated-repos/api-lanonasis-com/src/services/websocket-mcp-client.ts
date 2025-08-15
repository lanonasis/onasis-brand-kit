/**
 * Enhanced WebSocket MCP Client for Lanonasis
 * Production-ready implementation with security, heartbeat, and full MCP protocol support
 */

// WebSocket MCP Client - no Supabase dependency needed

export interface MCPMessage {
  jsonrpc: '2.0';
  id?: string | number;
  method?: string;
  params?: Record<string, unknown>;
  result?: unknown;
  error?: {
    code: number;
    message: string;
    data?: unknown;
  };
}

export interface ConnectionOptions {
  apiKey: string;
  endpoint?: string;
  reconnectAttempts?: number;
  reconnectDelay?: number;
  heartbeatInterval?: number;
  maxPayloadSize?: number;
  timeout?: number;
}

export interface ConnectionState {
  sessionId: string;
  connectedAt: Date;
  lastActivity: Date;
  isAuthenticated: boolean;
  capabilities?: Record<string, unknown>;
}

export class EnhancedWebSocketMCPClient {
  private ws: WebSocket | null = null;
  private apiKey: string;
  private endpoint: string;
  private reconnectAttempts: number;
  private reconnectDelay: number;
  private heartbeatInterval: number;
  private maxPayloadSize: number;
  private timeout: number;
  private currentReconnectAttempt: number = 0;
  private messageQueue: MCPMessage[] = [];
  private messageHandlers: Map<string | number, (response: MCPMessage) => void> = new Map();
  private timeoutHandlers: Map<string | number, NodeJS.Timeout> = new Map();
  private heartbeatTimer: NodeJS.Timeout | null = null;
  private isAlive: boolean = false;
  private connectionState: ConnectionState | null = null;
  private logger: Console;
  private eventHandlers: {
    onOpen?: (event: Event) => void;
    onClose?: (event: CloseEvent) => void;
    onError?: (event: Event) => void;
    onMessage?: (message: MCPMessage) => void;
    onAuthenticated?: (state: ConnectionState) => void;
  } = {};

  constructor(options: ConnectionOptions) {
    this.apiKey = options.apiKey;
    this.endpoint = options.endpoint || 'wss://dashboard.lanonasis.com/mcp/sse';
    this.reconnectAttempts = options.reconnectAttempts || 3;
    this.reconnectDelay = options.reconnectDelay || 1000;
    this.heartbeatInterval = options.heartbeatInterval || 30000; // 30 seconds
    this.maxPayloadSize = options.maxPayloadSize || 1024 * 1024; // 1MB
    this.timeout = options.timeout || 30000; // 30 seconds
    this.logger = console;
    
    // Validate API key format
    if (!this.apiKey || !this.apiKey.startsWith('sk-')) {
      throw new Error('Invalid API key format. Must start with "sk-"');
    }
  }

  connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        // Add API key to WebSocket headers (preferred) or URL as fallback
        const url = new URL(this.endpoint);
        url.searchParams.set('api_key', this.apiKey);
        
        this.ws = new WebSocket(url.toString());
        
        // Initialize heartbeat state
        this.isAlive = true;

        this.ws.onopen = async (event) => {
          this.logger.info('Enhanced WebSocket MCP connection established');
          this.currentReconnectAttempt = 0;
          this.startHeartbeat();
          
          // Initialize MCP protocol
          try {
            await this.initializeMCP();
            this.flushMessageQueue();
            this.eventHandlers.onOpen?.(event);
            resolve();
          } catch (error) {
            this.logger.error('MCP initialization failed:', error);
            reject(error);
          }
        };

        this.ws.onmessage = (event) => {
          try {
            // Update activity timestamp
            if (this.connectionState) {
              this.connectionState.lastActivity = new Date();
            }
            
            // Size check to prevent DoS
            if (event.data.length > this.maxPayloadSize) {
              this.logger.warn('Message too large, dropping', { size: event.data.length });
              return;
            }
            
            const message: MCPMessage = JSON.parse(event.data);
            
            // Basic JSON-RPC schema validation
            if (!message.jsonrpc || message.jsonrpc !== '2.0') {
              this.logger.warn('Invalid JSON-RPC message format');
              return;
            }
            
            // Handle pong responses for heartbeat
            if (message.method === 'pong') {
              this.isAlive = true;
              return;
            }
            
            // Handle response to specific request
            if (message.id && this.messageHandlers.has(message.id)) {
              const handler = this.messageHandlers.get(message.id);
              handler?.(message);
              this.messageHandlers.delete(message.id);
              
              // Clear associated timeout
              const timeout = this.timeoutHandlers.get(message.id);
              if (timeout) {
                clearTimeout(timeout);
                this.timeoutHandlers.delete(message.id);
              }
            }
            
            // Handle general messages
            this.eventHandlers.onMessage?.(message);
            
          } catch (error) {
            this.logger.error('Error processing message:', error);
            this.sendError(null, -32700, 'Parse error');
          }
        };

        this.ws.onerror = (event) => {
          this.logger.error('WebSocket error:', event);
          this.eventHandlers.onError?.(event);
          reject(new Error('WebSocket connection failed'));
        };

        this.ws.onclose = (event) => {
          this.logger.info('WebSocket closed:', event.code, event.reason);
          this.cleanup();
          this.eventHandlers.onClose?.(event);
          
          // Attempt reconnection if not a deliberate close
          if (event.code !== 1000 && this.currentReconnectAttempt < this.reconnectAttempts) {
            this.reconnect();
          }
        };

      } catch (error) {
        reject(error);
      }
    });
  }

  private reconnect(): void {
    this.currentReconnectAttempt++;
    console.log(`Reconnection attempt ${this.currentReconnectAttempt}/${this.reconnectAttempts}`);
    
    setTimeout(() => {
      this.connect().catch((error) => {
        console.error('Reconnection failed:', error);
      });
    }, this.reconnectDelay * this.currentReconnectAttempt);
  }

  private flushMessageQueue(): void {
    while (this.messageQueue.length > 0) {
      const message = this.messageQueue.shift();
      if (message) {
        this.send(message);
      }
    }
  }

  send(message: MCPMessage): Promise<MCPMessage> {
    return new Promise((resolve, reject) => {
      // Ensure JSON-RPC 2.0 compliance
      if (!message.jsonrpc) {
        message.jsonrpc = '2.0';
      }
      
      if (!message.id) {
        message.id = this.generateId();
      }

      // Store handler for response
      this.messageHandlers.set(message.id, (response) => {
        if (response.error) {
          reject(new Error(response.error.message || 'Unknown error'));
        } else {
          resolve(response);
        }
      });

      if (this.ws && this.ws.readyState === WebSocket.OPEN) {
        try {
          const payload = JSON.stringify(message);
          
          // Check payload size
          if (payload.length > this.maxPayloadSize) {
            reject(new Error(`Message too large: ${payload.length} bytes (max: ${this.maxPayloadSize})`));
            return;
          }
          
          this.ws.send(payload);
          this.logger.debug('Message sent:', { id: message.id, method: message.method });
        } catch (error) {
          this.logger.error('Error sending message:', error);
          reject(error);
        }
      } else {
        // Queue message if not connected
        this.messageQueue.push(message);
        if (!this.ws || this.ws.readyState === WebSocket.CLOSED) {
          this.connect().catch(reject);
        }
      }

      // Timeout handling with proper cleanup
      const timeoutId = setTimeout(() => {
        if (this.messageHandlers.has(message.id!)) {
          this.messageHandlers.delete(message.id!);
          this.timeoutHandlers.delete(message.id!);
          reject(new Error('Request timeout'));
        }
      }, this.timeout);
      
      // Store timeout for cleanup
      this.timeoutHandlers.set(message.id, timeoutId);
    });
  }

  private async initializeMCP(): Promise<void> {
    const response = await this.send({
      jsonrpc: '2.0',
      method: 'initialize',
      params: {
        protocolVersion: '2024-11-05',
        capabilities: {
          tools: {
            listChanged: true
          },
          resources: {
            subscribe: true,
            listChanged: true
          }
        },
        clientInfo: {
          name: 'lanonasis-websocket-client',
          version: '1.0.0'
        }
      }
    });
    
    // Create connection state
    this.connectionState = {
      sessionId: this.generateSessionId(),
      connectedAt: new Date(),
      lastActivity: new Date(),
      isAuthenticated: true,
      capabilities: response.result && typeof response.result === 'object' ? (response.result as Record<string, unknown>).capabilities as Record<string, unknown> | undefined : undefined
    };
    
    if (this.connectionState) {
      this.logger.info('MCP protocol initialized', {
        sessionId: this.connectionState.sessionId,
        capabilities: this.connectionState.capabilities
      });
      
      this.eventHandlers.onAuthenticated?.(this.connectionState);
    }
  }
  
  async initialize(): Promise<MCPMessage> {
    if (!this.connectionState) {
      throw new Error('Not connected. Call connect() first.');
    }
    
    return {
      jsonrpc: '2.0',
      result: {
        protocolVersion: '2024-11-05',
        capabilities: this.connectionState.capabilities,
        serverInfo: {
          name: 'lanonasis-mcp-server',
          version: '1.0.0'
        }
      }
    };
  }

  async listTools(): Promise<MCPMessage> {
    return this.send({
      jsonrpc: '2.0',
      method: 'tools/list'
    });
  }

  async callTool(name: string, args: Record<string, unknown>): Promise<unknown> {
    const response = await this.send({
      jsonrpc: '2.0',
      method: 'tools/call',
      params: {
        name,
        arguments: args
      }
    });
    return response.result;
  }

  ping(): void {
    this.send({ jsonrpc: '2.0', method: 'ping' });
  }

  close(): void {
    this.cleanup();
    if (this.ws) {
      this.ws.close(1000, 'Client closing connection');
      this.ws = null;
    }
  }
  
  private cleanup(): void {
    if (this.heartbeatTimer) {
      clearInterval(this.heartbeatTimer);
      this.heartbeatTimer = null;
    }
    
    // Clear all pending timeouts
    this.timeoutHandlers.forEach(timeout => clearTimeout(timeout));
    this.timeoutHandlers.clear();
    
    // Clear message handlers
    this.messageHandlers.clear();
    
    this.connectionState = null;
    this.isAlive = false;
  }
  
  private startHeartbeat(): void {
    this.heartbeatTimer = setInterval(() => {
      if (!this.isAlive) {
        this.logger.info('Heartbeat failed, terminating connection');
        if (this.ws) {
        this.ws.close();
      }
        return;
      }
      
      this.isAlive = false;
      this.ping();
    }, this.heartbeatInterval);
  }
  
  private sendError(id: string | number | null, code: number, message: string): void {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({
        jsonrpc: '2.0',
        id,
        error: {
          code,
          message
        }
      }));
    }
  }

  isConnected(): boolean {
    return this.ws !== null && this.ws.readyState === WebSocket.OPEN;
  }

  on(event: 'open', handler: (event: Event) => void): void;
  on(event: 'close', handler: (event: CloseEvent) => void): void;
  on(event: 'error', handler: (event: Event) => void): void;
  on(event: 'message', handler: (message: MCPMessage) => void): void;
  on(event: 'open' | 'close' | 'error' | 'message', handler: unknown): void {
    switch (event) {
      case 'open':
        this.eventHandlers.onOpen = handler as (event: Event) => void;
        break;
      case 'close':
        this.eventHandlers.onClose = handler as (event: CloseEvent) => void;
        break;
      case 'error':
        this.eventHandlers.onError = handler as (event: Event) => void;
        break;
      case 'message':
        this.eventHandlers.onMessage = handler as (message: MCPMessage) => void;
        break;
    }
  }

  private generateId(): string {
    return `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
  
  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
  
  getConnectionState(): ConnectionState | null {
    return this.connectionState;
  }
  
  getSessionId(): string | null {
    return this.connectionState?.sessionId || null;
  }
}