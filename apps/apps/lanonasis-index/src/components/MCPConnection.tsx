import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

// Simple Button component for standalone deployment
const Button: React.FC<{
  onClick: () => void;
  disabled?: boolean;
  className?: string;
  children: React.ReactNode;
}> = ({ onClick, disabled, className, children }) => (
  <button
    type="button"
    onClick={onClick}
    disabled={disabled}
    className={`px-4 py-2 rounded-md font-medium transition-colors ${
      disabled 
        ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
        : 'bg-blue-600 hover:bg-blue-700 text-white'
    } ${className || ''}`}
  >
    {children}
  </button>
);

interface ConnectionStatus {
  status: 'connecting' | 'connected' | 'error' | 'disconnected';
  message: string;
}

export const MCPConnection: React.FC = () => {
  const { t } = useTranslation();
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>({
    status: 'disconnected',
    message: t('mcp_connection.not_connected')
  });
  const [apiKey, setApiKey] = useState('');
  const [showInstructions, setShowInstructions] = useState(false);

  const testConnection = async () => {
    if (!apiKey.trim()) {
      setConnectionStatus({
        status: 'error',
        message: 'Please enter your API key'
      });
      return;
    }

    setConnectionStatus({
      status: 'connecting',
      message: 'Testing connection...'
    });

    try {
      const response = await fetch('https://api.lanonasis.com/.netlify/functions/mcp-sse', {
        method: 'GET',
        headers: {
          'X-API-Key': apiKey,
          'Accept': 'text/event-stream'
        }
      });

      if (response.ok) {
        setConnectionStatus({
          status: 'connected',
          message: 'Connection successful! Your API key is valid.'
        });
      } else if (response.status === 401) {
        setConnectionStatus({
          status: 'error',
          message: 'Invalid API key. Please check your key and try again.'
        });
      } else {
        setConnectionStatus({
          status: 'error',
          message: `Connection failed: ${response.status} ${response.statusText}`
        });
      }
    } catch (error) {
      setConnectionStatus({
        status: 'error',
        message: `Connection error: ${error instanceof Error ? error.message : 'Unknown error'}`
      });
    }
  };

  const copyClaudeConfig = () => {
    const config = {
      "mcpServers": {
        "lanonasis-memory": {
          "command": "npx",
          "args": ["-y", "@lanonasis/cli", "mcp", "start"],
          "env": {
            "LANONASIS_API_KEY": apiKey || "your-api-key-here"
          }
        }
      }
    };

    navigator.clipboard.writeText(JSON.stringify(config, null, 2))
      .then(() => {
        // Use a toast notification instead of alert
        const toast = document.createElement('div');
        toast.className = 'fixed bottom-4 right-4 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg z-50';
        toast.textContent = 'Configuration copied to clipboard!';
        document.body.appendChild(toast);
        setTimeout(() => toast.remove(), 3000);
      })
      .catch(() => {
        const toast = document.createElement('div');
        toast.className = 'fixed bottom-4 right-4 bg-red-600 text-white px-6 py-3 rounded-lg shadow-lg z-50';
        toast.textContent = 'Failed to copy to clipboard';
        document.body.appendChild(toast);
        setTimeout(() => toast.remove(), 3000);
      });
  };

  const getApiKey = () => {
    window.open('https://api.lanonasis.com', '_blank');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-purple-800 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-gray-800 to-gray-600 text-white p-8 text-center">
            <h1 className="text-4xl font-bold mb-2">🔗 {t('mcp_connection.title')}</h1>
            <p className="text-xl opacity-90">{t('mcp_connection.subtitle')}</p>
          </div>

          {/* Content */}
          <div className="p-8">
            {/* API Key Section */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">{t('mcp_connection.step1_title')}</h2>
              <p className="text-gray-600 mb-4">
                {t('mcp_connection.step1_description')}
              </p>
              <Button 
                onClick={getApiKey}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium"
              >
                {t('mcp_connection.get_api_key')}
              </Button>
            </div>

            {/* Test Connection */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">2. Test Your Connection</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Enter your API Key:
                  </label>
                  <input
                    type="password"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    placeholder="your-api-key-here"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                <Button 
                  onClick={testConnection}
                  disabled={connectionStatus.status === 'connecting'}
                  className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium disabled:opacity-50"
                >
                  {connectionStatus.status === 'connecting' ? 'Testing...' : 'Test Connection'}
                </Button>

                {/* Connection Status */}
                <div className={`p-4 rounded-lg ${
                  connectionStatus.status === 'connected' ? 'bg-green-100 text-green-800' :
                  connectionStatus.status === 'error' ? 'bg-red-100 text-red-800' :
                  connectionStatus.status === 'connecting' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  <div className="flex items-center">
                    <span className={`w-3 h-3 rounded-full mr-3 ${
                      connectionStatus.status === 'connected' ? 'bg-green-500' :
                      connectionStatus.status === 'error' ? 'bg-red-500' :
                      connectionStatus.status === 'connecting' ? 'bg-yellow-500 animate-pulse' :
                      'bg-gray-500'
                    }`}></span>
                    <span className="font-medium">{connectionStatus.message}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Claude Desktop Setup */}
            {connectionStatus.status === 'connected' && (
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">3. Configure Claude Desktop</h2>
                <p className="text-gray-600 mb-4">
                  Add this configuration to your Claude Desktop MCP settings:
                </p>
                
                <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm overflow-x-auto mb-4">
                  <pre>{JSON.stringify({
                    "mcpServers": {
                      "lanonasis-memory": {
                        "command": "npx",
                        "args": ["-y", "@lanonasis/cli", "mcp", "start"],
                        "env": {
                          "LANONASIS_API_KEY": "<YOUR_API_KEY>"
                        }
                      }
                    }
                  }, null, 2)}</pre>
                </div>

                <Button 
                  onClick={copyClaudeConfig}
                  className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-medium"
                >
                  📋 Copy Configuration
                </Button>
              </div>
            )}

            {/* Instructions Toggle */}
            <div className="mb-8">
              <Button 
                onClick={() => setShowInstructions(!showInstructions)}
                className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg font-medium"
              >
                {showInstructions ? 'Hide' : 'Show'} Detailed Instructions
              </Button>
            </div>

            {/* Detailed Instructions */}
            {showInstructions && (
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-xl font-bold text-gray-800 mb-4">Detailed Setup Instructions</h3>
                
                <div className="space-y-6">
                  <div>
                    <h4 className="font-bold text-gray-700 mb-2">For Claude Desktop:</h4>
                    <ol className="list-decimal list-inside space-y-2 text-gray-600">
                      <li>Open Claude Desktop application</li>
                      <li>Go to Settings → Developer → MCP Servers</li>
                      <li>Add the configuration shown above</li>
                      <li>Restart Claude Desktop</li>
                      <li>You should see "lanonasis-memory" tools available</li>
                    </ol>
                  </div>

                  <div>
                    <h4 className="font-bold text-gray-700 mb-2">For Cursor/Windsurf:</h4>
                    <ol className="list-decimal list-inside space-y-2 text-gray-600">
                      <li>Install the Lanonasis extension from the marketplace</li>
                      <li>Set your API key in extension settings</li>
                      <li>Use Ctrl+Shift+P → "Lanonasis: Connect Memory Service"</li>
                    </ol>
                  </div>

                  <div>
                    <h4 className="font-bold text-gray-700 mb-2">Available MCP Tools:</h4>
                    <ul className="list-disc list-inside space-y-1 text-gray-600">
                      <li><code>create_memory</code> - Create new memories</li>
                      <li><code>search_memories</code> - Search existing memories</li>
                      <li><code>list_memories</code> - List all memories</li>
                      <li><code>update_memory</code> - Update existing memories</li>
                      <li><code>delete_memory</code> - Delete memories</li>
                      <li><code>get_analytics</code> - Get memory usage analytics</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {/* Support */}
            <div className="mt-8 p-6 bg-blue-50 rounded-lg">
              <h3 className="text-xl font-bold text-blue-800 mb-2">Need Help?</h3>
              <p className="text-blue-700 mb-4">
                If you're having trouble connecting, check our documentation or contact support.
              </p>
              <div className="space-x-4">
                <Button 
                  onClick={() => window.open('https://docs.lanonasis.com', '_blank')}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded font-medium"
                >
                  📚 Documentation
                </Button>
                <Button 
                  onClick={() => window.open('mailto:support@lanonasis.com', '_blank')}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded font-medium"
                >
                  ✉️ Contact Support
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MCPConnection;
