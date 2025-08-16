/**
 * Admin Gateway Manager - Reusing VortexCore design patterns
 */

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { 
  CreditCard, 
  Settings, 
  Eye, 
  EyeOff, 
  Zap,
  AlertTriangle,
  CheckCircle,
  Key,
  TrendingUp,
  Globe,
  Coins,
  Shield,
  MoreHorizontal,
  ExternalLink
} from "lucide-react";
import { cn } from "@/lib/utils";
import { adminService, GatewayConfig } from "@/services/adminService";
import { toast } from "@/hooks/use-toast";

export const AdminGatewayManager = () => {
  const [gateways, setGateways] = useState<GatewayConfig[]>([]);
  const [loading, setLoading] = useState(true);
  const [showApiKeys, setShowApiKeys] = useState<Record<string, boolean>>({});

  useEffect(() => {
    loadGateways();
  }, []);

  const loadGateways = async () => {
    try {
      setLoading(true);
      const configs = await adminService.getGatewayConfigs();
      setGateways(configs);
    } catch (error) {
      console.error('Failed to load gateway configs:', error);
      toast({
        title: "Error",
        description: "Failed to load gateway configurations",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const toggleGateway = async (gatewayId: string, enabled: boolean) => {
    try {
      const success = await adminService.updateGatewayConfig(gatewayId, { enabled });
      
      if (success) {
        setGateways(prev => prev.map(g => 
          g.id === gatewayId ? { ...g, enabled } : g
        ));
        
        toast({
          title: "Gateway Updated",
          description: `${gatewayId.toUpperCase()} ${enabled ? 'enabled' : 'disabled'} successfully`,
        });
      } else {
        toast({
          title: "Update Failed",
          description: "Failed to update gateway configuration",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Failed to toggle gateway:', error);
      toast({
        title: "Error",
        description: "An error occurred while updating the gateway",
        variant: "destructive"
      });
    }
  };

  const toggleTestMode = async (gatewayId: string, testMode: boolean) => {
    try {
      const success = await adminService.updateGatewayConfig(gatewayId, { testMode });
      
      if (success) {
        setGateways(prev => prev.map(g => 
          g.id === gatewayId ? { ...g, testMode } : g
        ));
        
        toast({
          title: "Test Mode Updated",
          description: `${gatewayId.toUpperCase()} switched to ${testMode ? 'test' : 'live'} mode`,
        });
      }
    } catch (error) {
      console.error('Failed to toggle test mode:', error);
      toast({
        title: "Error",
        description: "Failed to update test mode",
        variant: "destructive"
      });
    }
  };

  const toggleApiKeyVisibility = (gatewayId: string) => {
    setShowApiKeys(prev => ({
      ...prev,
      [gatewayId]: !prev[gatewayId]
    }));
  };

  const getGatewayColor = (gateway: GatewayConfig) => {
    if (!gateway.enabled) return "from-gray-400 to-gray-500";
    
    const colors = {
      stripe: "from-blue-600 to-purple-600",
      paystack: "from-green-600 to-teal-600", 
      sayswitch: "from-orange-600 to-red-600",
      flutterwave: "from-yellow-600 to-orange-600",
      wise: "from-indigo-600 to-purple-600",
      paypal: "from-blue-500 to-blue-700"
    };
    
    return colors[gateway.id as keyof typeof colors] || "from-gray-600 to-gray-700";
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
        <h3 className="text-2xl font-bold">Gateway Configuration</h3>
        <p className="text-muted-foreground">
          Manage payment gateway settings, API keys, and routing preferences
        </p>
      </div>

      {/* Warning Alert */}
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Admin Configuration Zone</AlertTitle>
        <AlertDescription>
          Changes to gateway settings affect live payment processing. Use caution when modifying production configurations.
        </AlertDescription>
      </Alert>

      {/* Gateway Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {gateways.map((gateway) => (
          <Card 
            key={gateway.id} 
            className={cn(
              "group relative overflow-hidden border-0 bg-gradient-to-br hover:shadow-xl transition-all duration-500 hover:scale-[1.02]", 
              getGatewayColor(gateway),
              "min-h-[280px]"
            )}
          >
            {/* Background Pattern - Same as VortexCore */}
            <div className="absolute inset-0 bg-black/10 dark:bg-white/5" />
            <div className="absolute -top-4 -right-4 w-24 h-24 bg-white/10 rounded-full blur-xl" />
            <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-white/5 rounded-full blur-lg" />
            
            <CardContent className="relative p-6 text-white">
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-white/20 backdrop-blur-sm">
                    <CreditCard className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white/90 text-lg">{gateway.name}</h3>
                    <p className="text-xs text-white/60">Priority: {gateway.priority}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Badge 
                    variant="secondary" 
                    className={cn(
                      "text-white border-0 backdrop-blur-sm",
                      gateway.status.operational 
                        ? "bg-green-500/20 text-green-100" 
                        : "bg-red-500/20 text-red-100"
                    )}
                  >
                    {gateway.status.operational ? (
                      <><CheckCircle className="h-3 w-3 mr-1" />Online</>
                    ) : (
                      <><AlertTriangle className="h-3 w-3 mr-1" />Offline</>
                    )}
                  </Badge>
                </div>
              </div>

              {/* Status Metrics */}
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="flex items-center gap-2 p-2 rounded-lg bg-white/10 backdrop-blur-sm">
                  <TrendingUp className="h-4 w-4 text-white/80" />
                  <div>
                    <p className="text-xs text-white/60">Uptime</p>
                    <p className="text-sm font-medium">{gateway.status.uptime}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 p-2 rounded-lg bg-white/10 backdrop-blur-sm">
                  <Zap className="h-4 w-4 text-white/80" />
                  <div>
                    <p className="text-xs text-white/60">Error Rate</p>
                    <p className="text-sm font-medium">{gateway.status.errorRate}%</p>
                  </div>
                </div>
              </div>

              {/* Configuration Section */}
              <div className="space-y-3">
                {/* Enable/Disable Toggle */}
                <div className="flex items-center justify-between p-3 rounded-lg bg-white/10 backdrop-blur-sm">
                  <div className="flex items-center gap-2">
                    <Globe className="h-4 w-4 text-white/80" />
                    <span className="text-sm font-medium">Gateway Enabled</span>
                  </div>
                  <Switch
                    checked={gateway.enabled}
                    onCheckedChange={(checked) => toggleGateway(gateway.id, checked)}
                    className="data-[state=checked]:bg-white/30"
                  />
                </div>

                {/* Test Mode Toggle */}
                <div className="flex items-center justify-between p-3 rounded-lg bg-white/10 backdrop-blur-sm">
                  <div className="flex items-center gap-2">
                    <Shield className="h-4 w-4 text-white/80" />
                    <span className="text-sm font-medium">Test Mode</span>
                  </div>
                  <Switch
                    checked={gateway.testMode}
                    onCheckedChange={(checked) => toggleTestMode(gateway.id, checked)}
                    className="data-[state=checked]:bg-yellow-400/50"
                  />
                </div>

                {/* API Keys Section */}
                <div className="p-3 rounded-lg bg-white/10 backdrop-blur-sm">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Key className="h-4 w-4 text-white/80" />
                      <span className="text-sm font-medium">API Keys</span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleApiKeyVisibility(gateway.id)}
                      className="h-6 w-6 p-0 text-white/60 hover:text-white hover:bg-white/10"
                    >
                      {showApiKeys[gateway.id] ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                    </Button>
                  </div>
                  
                  <div className="space-y-1 text-xs">
                    <div className="flex justify-between">
                      <span className="text-white/60">Test:</span>
                      <Badge 
                        variant="secondary" 
                        className={cn(
                          "text-xs px-1 py-0",
                          gateway.apiKeys.test.configured 
                            ? "bg-green-500/20 text-green-100" 
                            : "bg-red-500/20 text-red-100"
                        )}
                      >
                        {gateway.apiKeys.test.configured ? "Configured" : "Missing"}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/60">Live:</span>
                      <Badge 
                        variant="secondary" 
                        className={cn(
                          "text-xs px-1 py-0",
                          gateway.apiKeys.live.configured 
                            ? "bg-green-500/20 text-green-100" 
                            : "bg-red-500/20 text-red-100"
                        )}
                      >
                        {gateway.apiKeys.live.configured ? "Configured" : "Missing"}
                      </Badge>
                    </div>
                    
                    {showApiKeys[gateway.id] && gateway.apiKeys.test.publicKey && (
                      <div className="mt-2 p-2 bg-black/20 rounded text-xs font-mono">
                        Test Key: {gateway.apiKeys.test.publicKey}
                      </div>
                    )}
                  </div>
                </div>

                {/* Fee Information */}
                <div className="flex items-center gap-2 p-2 rounded-lg bg-white/10 backdrop-blur-sm">
                  <Coins className="h-4 w-4 text-white/80" />
                  <div>
                    <p className="text-xs text-white/60">Fees</p>
                    <p className="text-sm font-medium">
                      {gateway.settings.fees.percentage}% + {gateway.settings.fees.fixed} {gateway.settings.fees.currency}
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 mt-4">
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
                  <MoreHorizontal className="h-3 w-3" />
                </Button>
              </div>

              {/* Quick Action Indicator */}
              <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-6 w-6 p-0 text-white/60 hover:text-white hover:bg-white/10"
                >
                  <ExternalLink className="h-3 w-3" />
                </Button>
              </div>

              {/* Test Mode Indicator */}
              {gateway.testMode && (
                <Badge 
                  variant="secondary" 
                  className="absolute top-4 left-4 bg-yellow-500/20 text-yellow-100 border-0 backdrop-blur-sm"
                >
                  <Zap className="h-3 w-3 mr-1" />
                  TEST
                </Badge>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};