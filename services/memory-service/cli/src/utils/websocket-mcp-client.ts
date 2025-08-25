/**
 * WebSocket MCP Client for Enterprise Connections
 * Connects to mcp.lanonasis.com WebSocket server for real-time MCP operations
 */

import WebSocket from 'ws';
import { EventEmitter } from 'events';
import chalk from 'chalk';

export interface MCPParams {
  [key: string]: unknown;
}

export interface MCPResult {
  [key: string]: unknown;
}

export interface MCPError {
  code: number;
  message: string;
  data?: unknown;
}

export interface MCPMessage {
  id?: string;
  type: 'request' | 'response' | 'notification' | 'error';
  method?: string;
  params?: MCPParams;
  result?: MCPResult;
  error?: MCPError;
}

export interface WebSocketMCPClientOptions {
  url?: string;
  apiKey: string;
  reconnectInterval?: number;
  maxReconnectAttempts?: number;
  timeout?: number;
}

export class WebSocketMCPClient extends EventEmitter {
  private ws: WebSocket | null = null;
  private url: string;
  private apiKey: string;
  private reconnectInterval: number;
  private maxReconnectAttempts: number;
  private timeout: number;
  private reconnectAttempts = 0;
  private isConnected = false;
  private messageId = 0;
  private pendingRequests: Map<string, { resolve: (value: MCPResult) => void; reject: (reason: Error) => void; timeout?: NodeJS.Timeout }> = new Map();

  constructor(options: WebSocketMCPClientOptions) {
    super();
    this.url = options.url || 'wss://mcp.lanonasis.com/mcp';
    this.apiKey = options.apiKey;
    this.reconnectInterval = options.reconnectInterval || 5000;
    this.maxReconnectAttempts = options.maxReconnectAttempts || 10;
    this.timeout = options.timeout || 30000;
  }

  async connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        this.ws = new WebSocket(this.url, {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'X-API-Key': this.apiKey
          }
        });

        this.ws.on('open', () => {
          this.isConnected = true;
          this.reconnectAttempts = 0;
          this.emit('connected');
          
          // Send initialize message
          this.sendRequest('initialize', {
            protocolVersion: '2024-11-05',
            capabilities: {
              roots: { listChanged: true },
              sampling: {}
            },
            clientInfo: {
              name: '@lanonasis/cli',
              version: '1.2.0'
            }
          }).then(() => {
            resolve();
          }).catch(reject);
        });

        this.ws.on('message', (data: WebSocket.Data) => {
          try {
            const message: MCPMessage = JSON.parse(data.toString()) as MCPMessage;
            this.handleMessage(message);
          } catch (error) {
            console.error(chalk.red('Failed to parse WebSocket message:'), error);
          }
        });

        this.ws.on('close', (code: number, reason: Buffer) => {
          this.isConnected = false;
          this.emit('disconnected', { code, reason: reason.toString() });
          
          if (this.reconnectAttempts < this.maxReconnectAttempts) {
            this.reconnectAttempts++;
            console.log(chalk.yellow(`WebSocket disconnected. Reconnecting... (${this.reconnectAttempts}/${this.maxReconnectAttempts})`));
            setTimeout(() => this.connect(), this.reconnectInterval);
          } else {
            console.error(chalk.red('Max reconnection attempts reached. Connection failed.'));
            this.emit('error', new Error('Max reconnection attempts reached'));
          }
        });

        this.ws.on('error', (error: Error) => {
          console.error('Failed to parse message:', error instanceof Error ? error.message : 'Unknown error');
          this.emit('error', error);
          reject(error);
        });

        // Connection timeout
        setTimeout(() => {
          if (!this.isConnected) {
            reject(new Error('WebSocket connection timeout'));
          }
        }, this.timeout);

      } catch (error) {
        reject(error);
      }
    });
  }

  private handleMessage(message: MCPMessage): void {
    if (message.id && this.pendingRequests.has(message.id)) {
      const pending = this.pendingRequests.get(message.id);
      if (pending) {
        clearTimeout(pending.timeout);
        this.pendingRequests.delete(message.id);

        if (message.type === 'error' || message.error) {
          pending.reject(new Error(message.error?.message || 'Unknown error'));
        } else {
          pending.resolve(message.result as MCPResult);
        }
      }
    } else if (message.type === 'notification') {
      this.emit('notification', message);
    }
  }

  async sendRequest(method: string, params?: MCPParams): Promise<MCPResult> {
    if (!this.isConnected) {
      throw new Error('WebSocket not connected');
    }

    return new Promise<MCPResult>((resolve, reject) => {
      const id = `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      const request = {
        id,
        type: 'request' as const,
        method,
        params: params || {}
      };

      const timeout = setTimeout(() => {
        this.pendingRequests.delete(id);
        reject(new Error(`Request timeout: ${method}`));
      }, this.timeout);

      this.pendingRequests.set(id, { resolve, reject, timeout });
      
      if (this.ws?.readyState === WebSocket.OPEN) {
        this.ws.send(JSON.stringify(request));
      } else {
        this.pendingRequests.delete(id);
        clearTimeout(timeout);
        reject(new Error('WebSocket not connected'));
      }
    });
  }

  async listTools(): Promise<MCPResult> {
    const result = await this.sendRequest('tools/list');
    return result;
  }

  async callTool(name: string, arguments_: MCPParams = {}): Promise<MCPResult> {
    const result = await this.sendRequest('tools/call', { name, arguments: arguments_ });
    return result;
  }

  async deleteMemory(id: string): Promise<MCPResult> {
    return this.callTool('delete_memory', { id });
  }

  async searchMemories(args: MCPParams): Promise<MCPResult> {
    return this.callTool('search_memories', args);
  }

  async listResources(): Promise<MCPResult> {
    const result = await this.sendRequest('resources/list');
    return result;
  }

  async getMemories(query?: string): Promise<MCPResult> {
    const result = await this.sendRequest('resources/read', { uri: query });
    return result;
  }

  disconnect(): void {
    if (this.ws) {
      this.isConnected = false;
      this.ws.close();
      this.ws = null;
    }
    
    // Clear all pending requests
    for (const [, pending] of this.pendingRequests) {
      clearTimeout(pending.timeout);
      pending.reject(new Error('Connection closed'));
    }
    this.pendingRequests.clear();
  }

  getConnectionStatus(): {
    connected: boolean;
    url: string;
    reconnectAttempts: number;
    pendingRequests: number;
  } {
    return {
      connected: this.isConnected,
      url: this.url,
      reconnectAttempts: this.reconnectAttempts,
      pendingRequests: this.pendingRequests.size
    };
  }
}
