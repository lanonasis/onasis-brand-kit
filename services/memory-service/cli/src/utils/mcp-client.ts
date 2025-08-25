import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';
import { CallToolResultSchema } from '@modelcontextprotocol/sdk/types.js';
import chalk from 'chalk';
import { CLIConfig } from './config.js';
import * as path from 'path';
import { spawn } from 'child_process';
import { EventSource } from 'eventsource';
import { fileURLToPath } from 'url';
import { output } from './output.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

interface MCPConnectionOptions {
  serverPath?: string;
  serverUrl?: string;
  useRemote?: boolean;
  mode?: 'local' | 'remote' | 'websocket';
}

export class MCPClient {
  private client: Client | null = null;
  private config: CLIConfig;
  private isConnected: boolean = false;
  private sseConnection: EventSource | null = null;
  private wsClient: any = null;

  constructor() {
    this.config = new CLIConfig();
  }

  /**
   * Connect to MCP server (local or remote)
   */
  async connect(options: MCPConnectionOptions = {}): Promise<boolean> {
    try {
      // Support new mode parameter or fallback to legacy useRemote
      const mode: 'local' | 'remote' | 'websocket' = options.mode ?? (options.useRemote ? 'remote' : 'local');
      const useRemote = mode !== 'local';
      
      if (useRemote) {
        if (mode === 'websocket') {
          // WebSocket MCP connection for enterprise users
          const wsUrl = options.serverUrl ?? 'wss://mcp.lanonasis.com/mcp';
          if (!output.isSilent()) {
            output.log(chalk.cyan(`Connecting to WebSocket MCP server at ${wsUrl}...`));
          }
          
          // Initialize WebSocket MCP connection
          await this.initializeWebSocket(wsUrl);
        } else {
          // SSE MCP connection for regular users
          const serverUrl = options.serverUrl ?? this.config.get('mcpServerUrl') ?? 'https://api.lanonasis.com';
          if (!output.isSilent()) {
            output.log(chalk.cyan(`Connecting to remote MCP server at ${serverUrl}...`));
          }
          
          // Initialize SSE connection for real-time updates
          await this.initializeSSE(serverUrl);
        }
        
        this.isConnected = true;
        return true;
      } else {
        // Local MCP server connection
        const serverPath = options.serverPath ?? this.config.get('mcpServerPath') ?? path.join(__dirname, '../../../../onasis-gateway/mcp-server/server.js');
        
        if (!output.isSilent()) {
          output.log(chalk.cyan(`Connecting to local MCP server at ${serverPath}...`));
        }
        
        const transport = new StdioClientTransport({
          command: 'node',
          args: [serverPath]
        });

        this.client = new Client({
          name: '@lanonasis/cli',
          version: '1.0.0'
        }, {
          capabilities: {}
        });

        await this.client.connect(transport);
        this.isConnected = true;
        
        if (!output.isSilent()) {
          output.log(chalk.green('✓ Connected to MCP server'));
        }
        return true;
      }
    } catch (error) {
      if (!output.isSilent()) {
        console.error(chalk.red('Failed to connect to MCP server:'), error);
      }
      this.isConnected = false;
      return false;
    }
  }

  /**
   * Initialize WebSocket MCP connection for enterprise users
   */
  private async initializeWebSocket(wsUrl: string): Promise<void> {
    const { WebSocketMCPClient } = await import('./websocket-mcp-client.js');
    const apiKey = this.config.get('token');
    
    if (!apiKey) {
      throw new Error('API key required for WebSocket MCP connection');
    }
    
    this.wsClient = new WebSocketMCPClient({
      url: wsUrl,
      apiKey: apiKey
    });
    
    await this.wsClient.connect();
    if (!output.isSilent()) {
      output.log(chalk.green('✅ WebSocket MCP connection established'));
    }
  }

  /**
   * Initialize SSE connection for real-time updates
   */
  private async initializeSSE(serverUrl: string): Promise<void> {
    const sseUrl = `${serverUrl}/sse`;
    const token = this.config.get('token');
    
    if (token) {
      // EventSource doesn't support headers directly, append token to URL
      this.sseConnection = new EventSource(`${sseUrl}?token=${encodeURIComponent(token)}`);

      this.sseConnection.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (!output.isSilent() && process.env.CLI_VERBOSE === 'true') {
            output.log(chalk.blue('📡 Real-time update:'), data.type);
          }
        } catch (error) {
          // Ignore parse errors
        }
      };

      this.sseConnection.onerror = (error) => {
        if (!output.isSilent() && process.env.CLI_VERBOSE === 'true') {
          console.error(chalk.yellow('⚠️  SSE connection error (will retry)'));
        }
      };
    }
  }

  /**
   * Disconnect from MCP server
   */
  async disconnect(): Promise<void> {
    if (this.client) {
      await this.client.close();
      this.client = null;
    }
    
    if (this.sseConnection) {
      this.sseConnection.close();
      this.sseConnection = null;
    }
    
    this.isConnected = false;
  }

  /**
   * Call an MCP tool
   */
  async callTool(toolName: string, args: any): Promise<any> {
    if (!this.isConnected) {
      throw new Error('Not connected to MCP server. Run "lanonasis mcp connect" first.');
    }

    const useRemote = this.config.get('mcpUseRemote') ?? false;
    
    if (useRemote) {
      // Remote MCP calls are translated to REST API calls
      return await this.callRemoteTool(toolName, args);
    } else {
      // Local MCP server call
      if (!this.client) {
        throw new Error('MCP client not initialized');
      }

      try {
        const result = await this.client.callTool({
          name: toolName,
          arguments: args
        });

        return result;
      } catch (error) {
        throw new Error(`MCP tool call failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }
  }

  /**
   * Call remote tool via REST API with MCP interface
   */
  private async callRemoteTool(toolName: string, args: any): Promise<any> {
    const apiUrl = this.config.get('apiUrl') ?? 'https://api.lanonasis.com';
    const token = this.config.get('token');

    if (!token) {
      throw new Error('Authentication required. Run "lanonasis auth login" first.');
    }

    // Map MCP tool names to REST API endpoints
    const toolMappings: Record<string, { method: string; endpoint: string; transform?: (args: any) => any }> = {
      'memory_create_memory': {
        method: 'POST',
        endpoint: '/api/v1/memory',
        transform: (args) => args
      },
      'memory_search_memories': {
        method: 'POST',
        endpoint: '/api/v1/memory/search',
        transform: (args) => args
      },
      'memory_get_memory': {
        method: 'GET',
        endpoint: `/api/v1/memory/${args.memory_id}`,
        transform: () => undefined
      },
      'memory_update_memory': {
        method: 'PUT',
        endpoint: `/api/v1/memory/${args.memory_id}`,
        transform: (args) => {
          const { memory_id, ...data } = args;
          return data;
        }
      },
      'memory_delete_memory': {
        method: 'DELETE',
        endpoint: `/api/v1/memory/${args.memory_id}`,
        transform: () => undefined
      },
      'memory_list_memories': {
        method: 'GET',
        endpoint: '/api/v1/memory',
        transform: (args) => args
      }
    };

    const mapping = toolMappings[toolName];
    if (!mapping) {
      throw new Error(`Unknown tool: ${toolName}`);
    }

    try {
      const axios = (await import('axios')).default;
      const response = await axios({
        method: mapping.method,
        url: `${apiUrl}${mapping.endpoint}`,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        data: mapping.transform ? mapping.transform(args) : undefined,
        params: mapping.method === 'GET' ? args : undefined
      });

      return response.data;
    } catch (error: any) {
      throw new Error(`Remote tool call failed: ${error.response?.data?.error || error.message}`);
    }
  }

  /**
   * List available tools
   */
  async listTools(): Promise<Array<{ name: string; description: string }>> {
    if (!this.isConnected) {
      throw new Error('Not connected to MCP server');
    }

    const useRemote = this.config.get('mcpUseRemote') ?? false;
    
    if (useRemote) {
      // Return hardcoded list for remote mode
      return [
        { name: 'memory_create_memory', description: 'Create a new memory entry' },
        { name: 'memory_search_memories', description: 'Search memories using semantic search' },
        { name: 'memory_get_memory', description: 'Get a specific memory by ID' },
        { name: 'memory_update_memory', description: 'Update an existing memory' },
        { name: 'memory_delete_memory', description: 'Delete a memory' },
        { name: 'memory_list_memories', description: 'List all memories with pagination' }
      ];
    } else {
      if (!this.client) {
        throw new Error('MCP client not initialized');
      }

      const tools = await this.client.listTools();
      return tools.tools.map(tool => ({
        name: tool.name,
        description: tool.description || 'No description available'
      }));
    }
  }

  /**
   * Check if connected to MCP server
   */
  isConnectedToServer(): boolean {
    return this.isConnected;
  }

  /**
   * Get connection status details
   */
  getConnectionStatus(): { connected: boolean; mode: string; server?: string } {
    const useRemote = this.config.get('mcpUseRemote') ?? false;
    
    return {
      connected: this.isConnected,
      mode: useRemote ? 'remote' : 'local',
      server: useRemote 
        ? (this.config.get('mcpServerUrl') ?? 'https://api.lanonasis.com')
        : (this.config.get('mcpServerPath') ?? 'local MCP server')
    };
  }
}

// Singleton instance
let mcpClientInstance: MCPClient | null = null;

export function getMCPClient(): MCPClient {
  if (!mcpClientInstance) {
    mcpClientInstance = new MCPClient();
  }
  return mcpClientInstance;
}