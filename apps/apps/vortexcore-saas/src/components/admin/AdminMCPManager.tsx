/**
 * Admin MCP Manager - Manage Model Context Protocol servers and AI integrations
 */

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { 
  Bot, 
  Server, 
  Zap,
  Shield,
  Activity,
  Database,
  Cloud,
  Key,
  Plus,
  Settings,
  RefreshCw,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Brain,
  Sparkles,
  Layers,
  Code,
  ExternalLink,
  Terminal,
  Cpu,
  CreditCard
} from "lucide-react";
import { cn } from "@/lib/utils";
import { adminService } from "@/services/adminService";
import { toast } from "@/hooks/use-toast";

interface MCPServer {
  id: string;
  name: string;
  type: 'local' | 'remote' | 'cloud';
  status: 'connected' | 'disconnected' | 'error';
  version: string;
  capabilities: string[];
  config: {
    endpoint?: string;
    apiKey?: string;
    model?: string;
    maxTokens?: number;
  };
  stats: {
    totalRequests: number;
    avgResponseTime: number;
    errorRate: number;
    lastUsed: string;
  };
  enabled: boolean;
}

interface MCPIntegration {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: 'payment' | 'database' | 'api' | 'utility' | 'ai';
  status: 'active' | 'inactive' | 'pending';
  requiredPermissions: string[];
}

export const AdminMCPManager = () => {
  const [servers, setServers] = useState<MCPServer[]>([]);
  const [integrations, setIntegrations] = useState<MCPIntegration[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddServer, setShowAddServer] = useState(false);

  useEffect(() => {
    loadMCPData();
  }, []);

  const loadMCPData = async () => {
    try {
      setLoading(true);
      const data = await adminService.getMCPServers();
      setServers(data.servers || []);
      setIntegrations(data.integrations || []);
    } catch (error) {
      console.error('Failed to load MCP data:', error);
      toast({
        title: "Error",
        description: "Failed to load MCP configurations",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const toggleServer = async (serverId: string, enabled: boolean) => {
    try {
      const success = await adminService.updateMCPServer(serverId, { enabled });
      
      if (success) {
        setServers(prev => prev.map(s => 
          s.id === serverId ? { ...s, enabled } : s
        ));
        
        toast({
          title: "MCP Server Updated",
          description: `${serverId} ${enabled ? 'enabled' : 'disabled'} successfully`,
        });
      }
    } catch (error) {
      console.error('Failed to toggle MCP server:', error);
      toast({
        title: "Error",
        description: "Failed to update MCP server",
        variant: "destructive"
      });
    }
  };

  const restartServer = async (serverId: string) => {
    try {
      const success = await adminService.restartMCPServer(serverId);
      
      if (success) {
        toast({
          title: "Server Restarting",
          description: `${serverId} is being restarted...`,
        });
        
        // Refresh after a delay
        setTimeout(loadMCPData, 3000);
      }
    } catch (error) {
      console.error('Failed to restart MCP server:', error);
      toast({
        title: "Error",
        description: "Failed to restart MCP server",
        variant: "destructive"
      });
    }
  };

  const getServerColor = (server: MCPServer) => {
    if (!server.enabled) return "from-gray-400 to-gray-500";
    if (server.status === 'error') return "from-red-600 to-pink-600";
    if (server.status === 'disconnected') return "from-yellow-600 to-orange-600";
    
    const colors = {
      'claude-mcp': "from-purple-600 to-indigo-600",
      'onasis-gateway': "from-blue-600 to-cyan-600",
      'pica-integration': "from-green-600 to-teal-600",
      'context7-docs': "from-orange-600 to-red-600",
      'sequential-thinking': "from-pink-600 to-purple-600"
    };
    
    return colors[server.id as keyof typeof colors] || "from-gray-600 to-gray-700";
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'connected': return <CheckCircle className="h-4 w-4" />;
      case 'disconnected': return <XCircle className="h-4 w-4" />;
      case 'error': return <AlertTriangle className="h-4 w-4" />;
      default: return <Activity className="h-4 w-4" />;
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'payment': return <CreditCard className="h-4 w-4" />;
      case 'database': return <Database className="h-4 w-4" />;
      case 'api': return <Cloud className="h-4 w-4" />;
      case 'ai': return <Brain className="h-4 w-4" />;
      default: return <Layers className="h-4 w-4" />;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <h3 className="text-2xl font-bold">MCP Management</h3>
        <p className="text-muted-foreground">
          Manage Model Context Protocol servers and AI integrations
        </p>
      </div>

      {/* Pre-approved Admins Notice */}
      <Alert>
        <Shield className="h-4 w-4" />
        <AlertTitle>Pre-approved Admin Access</AlertTitle>
        <AlertDescription>
          The following admin emails have pre-approved access via Supabase: 
          info@lanonasis.com, info@seftechub.com, thelanonasis@gmail.com
        </AlertDescription>
      </Alert>

      {/* MCP Servers Overview */}
      <Card className="border-0 bg-gradient-to-br from-purple-50 via-violet-50 to-indigo-50 dark:from-purple-950/20 dark:via-violet-950/20 dark:to-indigo-950/20">
        <CardContent className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-full bg-gradient-to-r from-purple-500 to-indigo-500">
                <Bot className="h-4 w-4 text-white" />
              </div>
              <div>
                <h3 className="font-semibold">MCP Servers</h3>
                <p className="text-sm text-muted-foreground">Connected AI and integration servers</p>
              </div>
            </div>
            <Button onClick={() => setShowAddServer(true)} className="gap-2">
              <Plus className="h-4 w-4" />
              Add Server
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-3 p-3 rounded-lg bg-white/50 dark:bg-black/20 backdrop-blur-sm">
              <div className="p-2 rounded-full bg-green-100 dark:bg-green-900/20">
                <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-sm font-medium">Active Servers</p>
                <p className="text-2xl font-bold">{servers.filter(s => s.status === 'connected').length}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 p-3 rounded-lg bg-white/50 dark:bg-black/20 backdrop-blur-sm">
              <div className="p-2 rounded-full bg-blue-100 dark:bg-blue-900/20">
                <Cpu className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-sm font-medium">Total Integrations</p>
                <p className="text-2xl font-bold">{integrations.length}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* MCP Servers Grid */}
      <div className="space-y-4">
        <h4 className="text-lg font-semibold">Connected MCP Servers</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {servers.map((server) => (
            <Card 
              key={server.id}
              className={cn(
                "group relative overflow-hidden border-0 bg-gradient-to-br hover:shadow-xl transition-all duration-500 hover:scale-[1.02]",
                getServerColor(server)
              )}
            >
              {/* Background Pattern */}
              <div className="absolute inset-0 bg-black/10 dark:bg-white/5" />
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-white/10 rounded-full blur-xl" />
              <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-white/5 rounded-full blur-lg" />
              
              <CardContent className="relative p-6 text-white">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-white/20 backdrop-blur-sm">
                      <Server className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-white/90 text-lg">{server.name}</h3>
                      <p className="text-xs text-white/60">v{server.version} • {server.type}</p>
                    </div>
                  </div>
                  
                  <Badge 
                    variant="secondary" 
                    className={cn(
                      "text-white border-0 backdrop-blur-sm",
                      server.status === 'connected' ? "bg-green-500/20 text-green-100" :
                      server.status === 'disconnected' ? "bg-yellow-500/20 text-yellow-100" :
                      "bg-red-500/20 text-red-100"
                    )}
                  >
                    {getStatusIcon(server.status)}
                    <span className="ml-1 capitalize">{server.status}</span>
                  </Badge>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="flex items-center gap-2 p-2 rounded-lg bg-white/10 backdrop-blur-sm">
                    <Zap className="h-4 w-4 text-white/80" />
                    <div>
                      <p className="text-xs text-white/60">Requests</p>
                      <p className="text-sm font-medium">{server.stats.totalRequests.toLocaleString()}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 p-2 rounded-lg bg-white/10 backdrop-blur-sm">
                    <Activity className="h-4 w-4 text-white/80" />
                    <div>
                      <p className="text-xs text-white/60">Avg Response</p>
                      <p className="text-sm font-medium">{server.stats.avgResponseTime}ms</p>
                    </div>
                  </div>
                </div>

                {/* Capabilities */}
                <div className="mb-4">
                  <p className="text-xs text-white/60 mb-2">Capabilities</p>
                  <div className="flex flex-wrap gap-1">
                    {server.capabilities.slice(0, 3).map((cap, idx) => (
                      <Badge 
                        key={idx}
                        variant="secondary" 
                        className="bg-white/20 text-white border-0 backdrop-blur-sm text-xs"
                      >
                        {cap}
                      </Badge>
                    ))}
                    {server.capabilities.length > 3 && (
                      <Badge 
                        variant="secondary" 
                        className="bg-white/20 text-white border-0 backdrop-blur-sm text-xs"
                      >
                        +{server.capabilities.length - 3} more
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Configuration */}
                <div className="space-y-3">
                  {/* Enable/Disable Toggle */}
                  <div className="flex items-center justify-between p-3 rounded-lg bg-white/10 backdrop-blur-sm">
                    <div className="flex items-center gap-2">
                      <Shield className="h-4 w-4 text-white/80" />
                      <span className="text-sm font-medium">Server Enabled</span>
                    </div>
                    <Switch
                      checked={server.enabled}
                      onCheckedChange={(checked) => toggleServer(server.id, checked)}
                      className="data-[state=checked]:bg-white/30"
                    />
                  </div>

                  {/* Config Details */}
                  {server.config.endpoint && (
                    <div className="p-3 rounded-lg bg-white/10 backdrop-blur-sm">
                      <div className="flex items-center gap-2 mb-1">
                        <Terminal className="h-4 w-4 text-white/80" />
                        <span className="text-xs font-medium text-white/80">Endpoint</span>
                      </div>
                      <p className="text-xs text-white/90 font-mono truncate">{server.config.endpoint}</p>
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-2 mt-4">
                  <Button
                    size="sm"
                    variant="secondary"
                    className="flex-1 bg-white/20 hover:bg-white/30 text-white border-0 backdrop-blur-sm"
                    onClick={() => restartServer(server.id)}
                  >
                    <RefreshCw className="h-3 w-3 mr-1" />
                    Restart
                  </Button>
                  <Button
                    size="sm"
                    variant="secondary"
                    className="flex-1 bg-white/20 hover:bg-white/30 text-white border-0 backdrop-blur-sm"
                  >
                    <Settings className="h-3 w-3 mr-1" />
                    Configure
                  </Button>
                  <Button
                    size="sm"
                    variant="secondary"
                    className="bg-white/20 hover:bg-white/30 text-white border-0 backdrop-blur-sm px-3"
                  >
                    <ExternalLink className="h-3 w-3" />
                  </Button>
                </div>

                {/* Last Used */}
                <div className="absolute top-4 right-4 text-xs text-white/40">
                  Last used: {server.stats.lastUsed}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Available Integrations */}
      <Card className="border-0 bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 dark:from-green-950/20 dark:via-emerald-950/20 dark:to-teal-950/20">
        <CardContent className="p-6">
          <div className="flex items-center gap-2 mb-6">
            <div className="p-2 rounded-full bg-gradient-to-r from-green-500 to-teal-500">
              <Layers className="h-4 w-4 text-white" />
            </div>
            <div>
              <h3 className="font-semibold">Available Integrations</h3>
              <p className="text-sm text-muted-foreground">MCP-powered integrations and capabilities</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {integrations.map((integration) => (
              <div 
                key={integration.id}
                className="flex items-start gap-3 p-4 rounded-lg bg-white/50 dark:bg-black/20 backdrop-blur-sm hover:shadow-md transition-all"
              >
                <div className={cn(
                  "p-2 rounded-lg",
                  integration.status === 'active' ? "bg-green-100 dark:bg-green-900/20" :
                  integration.status === 'pending' ? "bg-yellow-100 dark:bg-yellow-900/20" :
                  "bg-gray-100 dark:bg-gray-900/20"
                )}>
                  {getCategoryIcon(integration.category)}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-medium">{integration.name}</h4>
                    <Badge 
                      variant="secondary" 
                      className={cn(
                        "text-xs",
                        integration.status === 'active' ? "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-300" :
                        integration.status === 'pending' ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-300" :
                        "bg-gray-100 text-gray-700 dark:bg-gray-900/20 dark:text-gray-300"
                      )}
                    >
                      {integration.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">{integration.description}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <Code className="h-3 w-3 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">
                      {integration.requiredPermissions.join(', ')}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* AI Model Configuration */}
      <Card className="border-0 bg-gradient-to-br from-pink-50 via-rose-50 to-red-50 dark:from-pink-950/20 dark:via-rose-950/20 dark:to-red-950/20">
        <CardContent className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <div className="p-2 rounded-full bg-gradient-to-r from-pink-500 to-red-500">
              <Brain className="h-4 w-4 text-white" />
            </div>
            <div>
              <h3 className="font-semibold">AI Model Configuration</h3>
              <p className="text-sm text-muted-foreground">Configure AI models and context windows</p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <Button variant="outline" className="gap-2 justify-start">
              <Sparkles className="h-4 w-4 text-purple-500" />
              Claude Settings
            </Button>
            <Button variant="outline" className="gap-2 justify-start">
              <Key className="h-4 w-4 text-blue-500" />
              API Keys
            </Button>
            <Button variant="outline" className="gap-2 justify-start">
              <Database className="h-4 w-4 text-green-500" />
              Context Store
            </Button>
            <Button variant="outline" className="gap-2 justify-start">
              <Activity className="h-4 w-4 text-orange-500" />
              Usage Analytics
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};