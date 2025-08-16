/**
 * Admin Monitoring - Real-time gateway performance overview
 */

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { 
  Activity, 
  TrendingUp, 
  TrendingDown,
  Clock, 
  CreditCard,
  Shield,
  Zap,
  DollarSign,
  Users,
  AlertTriangle,
  CheckCircle,
  RefreshCw,
  Globe,
  Server,
  Sparkles,
  BarChart3
} from "lucide-react";
import { cn } from "@/lib/utils";
import { adminService } from "@/services/adminService";
import { toast } from "@/hooks/use-toast";

interface MonitoringMetrics {
  totalTransactions: number;
  totalVolume: number;
  successRate: number;
  activeGateways: number;
  avgResponseTime: number;
  failedTransactions: number;
  gatewayHealth: {
    gateway: string;
    status: 'online' | 'offline' | 'degraded';
    uptime: string;
    responseTime: number;
    successRate: number;
    lastTransaction: string;
  }[];
  hourlyVolume: number[];
  recentAlerts: {
    id: string;
    type: 'error' | 'warning' | 'info';
    message: string;
    timestamp: string;
    gateway?: string;
  }[];
}

export const AdminMonitoring = () => {
  const [metrics, setMetrics] = useState<MonitoringMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadMetrics();
    const interval = setInterval(loadMetrics, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const loadMetrics = async () => {
    try {
      setLoading(true);
      const data = await adminService.getMonitoringMetrics();
      setMetrics(data);
    } catch (error) {
      console.error('Failed to load monitoring metrics:', error);
      toast({
        title: "Error",
        description: "Failed to load monitoring data",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const refreshMetrics = async () => {
    try {
      setRefreshing(true);
      await loadMetrics();
      toast({
        title: "Refreshed",
        description: "Monitoring data updated successfully"
      });
    } catch (error) {
      console.error('Failed to refresh metrics:', error);
    } finally {
      setRefreshing(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'from-green-600 to-emerald-600';
      case 'degraded': return 'from-yellow-600 to-orange-600';
      case 'offline': return 'from-red-600 to-pink-600';
      default: return 'from-gray-600 to-gray-700';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'online': return <CheckCircle className="h-4 w-4" />;
      case 'degraded': return <AlertTriangle className="h-4 w-4" />;
      case 'offline': return <AlertTriangle className="h-4 w-4" />;
      default: return <Shield className="h-4 w-4" />;
    }
  };

  if (loading && !metrics) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!metrics) return null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-2">
          <h3 className="text-2xl font-bold">System Overview</h3>
          <p className="text-muted-foreground">
            Real-time monitoring of payment gateway performance and health
          </p>
        </div>
        <Button 
          onClick={refreshMetrics} 
          disabled={refreshing}
          variant="outline"
          className="gap-2"
        >
          <RefreshCw className={cn("h-4 w-4", refreshing && "animate-spin")} />
          Refresh
        </Button>
      </div>

      {/* Critical Alerts */}
      {metrics.recentAlerts.filter(a => a.type === 'error').length > 0 && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Critical Issues Detected</AlertTitle>
          <AlertDescription>
            {metrics.recentAlerts.filter(a => a.type === 'error').length} critical alerts require immediate attention.
          </AlertDescription>
        </Alert>
      )}

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Transactions */}
        <Card className="border-0 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-blue-950/20 dark:via-purple-950/20 dark:to-pink-950/20">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-full bg-gradient-to-r from-blue-500 to-purple-500">
                <CreditCard className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Transactions</p>
                <p className="text-2xl font-bold">{metrics.totalTransactions.toLocaleString()}</p>
                <div className="flex items-center gap-1 mt-1">
                  <TrendingUp className="h-3 w-3 text-green-600" />
                  <span className="text-xs text-green-600">+12.5% today</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Success Rate */}
        <Card className="border-0 bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 dark:from-green-950/20 dark:via-emerald-950/20 dark:to-teal-950/20">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-full bg-gradient-to-r from-green-500 to-emerald-500">
                <CheckCircle className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Success Rate</p>
                <p className="text-2xl font-bold">{metrics.successRate}%</p>
                <div className="flex items-center gap-1 mt-1">
                  <TrendingUp className="h-3 w-3 text-green-600" />
                  <span className="text-xs text-green-600">+0.3% today</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Volume */}
        <Card className="border-0 bg-gradient-to-br from-orange-50 via-red-50 to-pink-50 dark:from-orange-950/20 dark:via-red-950/20 dark:to-pink-950/20">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-full bg-gradient-to-r from-orange-500 to-red-500">
                <DollarSign className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Volume (24h)</p>
                <p className="text-2xl font-bold">₦{(metrics.totalVolume / 1000000).toFixed(1)}M</p>
                <div className="flex items-center gap-1 mt-1">
                  <TrendingUp className="h-3 w-3 text-green-600" />
                  <span className="text-xs text-green-600">+8.2% today</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Response Time */}
        <Card className="border-0 bg-gradient-to-br from-purple-50 via-violet-50 to-indigo-50 dark:from-purple-950/20 dark:via-violet-950/20 dark:to-indigo-950/20">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-full bg-gradient-to-r from-purple-500 to-indigo-500">
                <Zap className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Avg Response</p>
                <p className="text-2xl font-bold">{metrics.avgResponseTime}ms</p>
                <div className="flex items-center gap-1 mt-1">
                  <TrendingDown className="h-3 w-3 text-green-600" />
                  <span className="text-xs text-green-600">-15ms today</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Gateway Health Status */}
      <Card className="border-0 bg-gradient-to-br from-slate-50 via-gray-50 to-zinc-50 dark:from-slate-950/20 dark:via-gray-950/20 dark:to-zinc-950/20">
        <CardContent className="p-6">
          <div className="flex items-center gap-2 mb-6">
            <div className="p-2 rounded-full bg-gradient-to-r from-slate-500 to-gray-500">
              <Server className="h-4 w-4 text-white" />
            </div>
            <div>
              <h3 className="font-semibold">Gateway Health Status</h3>
              <p className="text-sm text-muted-foreground">Real-time health monitoring for all payment gateways</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {metrics.gatewayHealth.map((gateway) => (
              <Card 
                key={gateway.gateway}
                className={cn(
                  "group relative overflow-hidden border-0 bg-gradient-to-br hover:shadow-xl transition-all duration-500 hover:scale-[1.02]",
                  getStatusColor(gateway.status)
                )}
              >
                {/* Background Pattern */}
                <div className="absolute inset-0 bg-black/10 dark:bg-white/5" />
                <div className="absolute -top-4 -right-4 w-16 h-16 bg-white/10 rounded-full blur-xl" />
                <div className="absolute -bottom-4 -left-4 w-12 h-12 bg-white/5 rounded-full blur-lg" />
                
                <CardContent className="relative p-4 text-white">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className="p-2 rounded-lg bg-white/20 backdrop-blur-sm">
                        {getStatusIcon(gateway.status)}
                      </div>
                      <div>
                        <h3 className="font-semibold text-white/90 capitalize">{gateway.gateway}</h3>
                        <p className="text-xs text-white/60">Last txn: {gateway.lastTransaction}</p>
                      </div>
                    </div>
                    
                    <Badge 
                      variant="secondary" 
                      className={cn(
                        "text-white border-0 backdrop-blur-sm capitalize",
                        gateway.status === 'online' ? "bg-green-500/20 text-green-100" :
                        gateway.status === 'degraded' ? "bg-yellow-500/20 text-yellow-100" :
                        "bg-red-500/20 text-red-100"
                      )}
                    >
                      {gateway.status}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div className="p-2 rounded-lg bg-white/10 backdrop-blur-sm">
                      <p className="text-xs text-white/60">Uptime</p>
                      <p className="text-sm font-medium">{gateway.uptime}</p>
                    </div>
                    
                    <div className="p-2 rounded-lg bg-white/10 backdrop-blur-sm">
                      <p className="text-xs text-white/60">Response</p>
                      <p className="text-sm font-medium">{gateway.responseTime}ms</p>
                    </div>
                    
                    <div className="p-2 rounded-lg bg-white/10 backdrop-blur-sm col-span-2">
                      <p className="text-xs text-white/60">Success Rate</p>
                      <p className="text-sm font-medium">{gateway.successRate}%</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Alerts */}
      <Card className="border-0 bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50 dark:from-amber-950/20 dark:via-yellow-950/20 dark:to-orange-950/20">
        <CardContent className="p-6">
          <div className="flex items-center gap-2 mb-6">
            <div className="p-2 rounded-full bg-gradient-to-r from-amber-500 to-orange-500">
              <AlertTriangle className="h-4 w-4 text-white" />
            </div>
            <div>
              <h3 className="font-semibold">Recent Alerts</h3>
              <p className="text-sm text-muted-foreground">Latest system notifications and warnings</p>
            </div>
          </div>
          
          <div className="space-y-3">
            {metrics.recentAlerts.length === 0 ? (
              <div className="text-center py-4">
                <CheckCircle className="h-8 w-8 text-green-500 mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">All systems operational - no recent alerts</p>
              </div>
            ) : (
              metrics.recentAlerts.slice(0, 5).map((alert) => (
                <div key={alert.id} className="flex items-start gap-3 p-3 rounded-lg bg-white/50 dark:bg-black/20 backdrop-blur-sm">
                  <div className={cn(
                    "p-1 rounded-full mt-0.5",
                    alert.type === 'error' ? "bg-red-100 dark:bg-red-900/20" :
                    alert.type === 'warning' ? "bg-yellow-100 dark:bg-yellow-900/20" :
                    "bg-blue-100 dark:bg-blue-900/20"
                  )}>
                    <AlertTriangle className={cn(
                      "h-3 w-3",
                      alert.type === 'error' ? "text-red-600 dark:text-red-400" :
                      alert.type === 'warning' ? "text-yellow-600 dark:text-yellow-400" :
                      "text-blue-600 dark:text-blue-400"
                    )} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium">{alert.message}</p>
                      {alert.gateway && (
                        <Badge variant="secondary" className="text-xs">{alert.gateway}</Badge>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">{alert.timestamp}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card className="border-0 bg-gradient-to-br from-gray-50 via-slate-50 to-zinc-50 dark:from-gray-950/20 dark:via-slate-950/20 dark:to-zinc-950/20">
        <CardContent className="p-6">
          <h4 className="font-semibold mb-4">Quick Actions</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <Button variant="outline" className="gap-2 justify-start">
              <RefreshCw className="h-4 w-4 text-blue-500" />
              Restart Services
            </Button>
            <Button variant="outline" className="gap-2 justify-start">
              <BarChart3 className="h-4 w-4 text-green-500" />
              Generate Report
            </Button>
            <Button variant="outline" className="gap-2 justify-start">
              <Users className="h-4 w-4 text-purple-500" />
              View Users
            </Button>
            <Button variant="outline" className="gap-2 justify-start">
              <Globe className="h-4 w-4 text-orange-500" />
              System Logs
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};