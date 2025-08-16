/**
 * Admin Testing Panel - Live gateway testing with real API keys
 */

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { 
  Play, 
  RefreshCw, 
  CheckCircle, 
  XCircle, 
  Clock,
  Zap,
  CreditCard,
  Shield,
  Activity,
  TrendingUp,
  Eye,
  Code,
  Sparkles,
  AlertTriangle
} from "lucide-react";
import { cn } from "@/lib/utils";
import { adminService, AdminTestResult } from "@/services/adminService";
import { toast } from "@/hooks/use-toast";

export const AdminTestingPanel = () => {
  const [testResults, setTestResults] = useState<AdminTestResult[]>([]);
  const [testing, setTesting] = useState<Record<string, boolean>>({});
  const [runningHealthCheck, setRunningHealthCheck] = useState(false);
  const [selectedGateway, setSelectedGateway] = useState<string>('stripe');
  const [testMode, setTestMode] = useState<'test' | 'live'>('test');

  const availableGateways = [
    { id: 'stripe', name: 'Stripe', color: 'from-blue-600 to-purple-600' },
    { id: 'paystack', name: 'Paystack', color: 'from-green-600 to-teal-600' },
    { id: 'sayswitch', name: 'SaySwitch', color: 'from-orange-600 to-red-600' },
    { id: 'flutterwave', name: 'Flutterwave', color: 'from-yellow-600 to-orange-600' }
  ];

  const runSingleTest = async (gatewayId: string) => {
    try {
      setTesting(prev => ({ ...prev, [gatewayId]: true }));
      
      const result = await adminService.testGateway(gatewayId, testMode === 'test');
      
      setTestResults(prev => [result, ...prev.filter(r => r.gateway !== gatewayId)]);
      
      toast({
        title: result.success ? "Test Passed" : "Test Failed",
        description: `${gatewayId.toUpperCase()}: ${result.success ? `Response time: ${result.responseTime}ms` : result.error}`,
        variant: result.success ? "default" : "destructive"
      });
    } catch (error) {
      console.error('Test failed:', error);
      toast({
        title: "Test Error",
        description: "Failed to run gateway test",
        variant: "destructive"
      });
    } finally {
      setTesting(prev => ({ ...prev, [gatewayId]: false }));
    }
  };

  const runHealthCheck = async () => {
    try {
      setRunningHealthCheck(true);
      const results = await adminService.runHealthCheck();
      setTestResults(results);
      
      const passedTests = results.filter(r => r.success).length;
      toast({
        title: "Health Check Complete",
        description: `${passedTests}/${results.length} gateways passed health check`,
        variant: passedTests === results.length ? "default" : "destructive"
      });
    } catch (error) {
      console.error('Health check failed:', error);
      toast({
        title: "Health Check Failed",
        description: "Failed to run health check",
        variant: "destructive"
      });
    } finally {
      setRunningHealthCheck(false);
    }
  };

  const getResultColor = (result: AdminTestResult) => {
    if (result.success) return "from-green-600 to-emerald-600";
    return "from-red-600 to-pink-600";
  };

  const getStatusIcon = (result: AdminTestResult) => {
    if (result.success) return <CheckCircle className="h-4 w-4" />;
    return <XCircle className="h-4 w-4" />;
  };

  const formatResponseTime = (ms: number) => {
    if (ms < 1000) return `${ms}ms`;
    return `${(ms / 1000).toFixed(1)}s`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <h3 className="text-2xl font-bold">Live Gateway Testing</h3>
        <p className="text-muted-foreground">
          Test payment gateways with real API keys to verify functionality
        </p>
      </div>

      {/* Warning Alert */}
      <Alert>
        <Shield className="h-4 w-4" />
        <AlertTitle>Testing with Live Keys</AlertTitle>
        <AlertDescription>
          These tests use your configured API keys. Test mode uses test keys, Live mode uses production keys.
        </AlertDescription>
      </Alert>

      {/* Test Controls */}
      <Card className="border-0 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-blue-950/20 dark:via-purple-950/20 dark:to-pink-950/20">
        <CardContent className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-500">
                <Sparkles className="h-4 w-4 text-white" />
              </div>
              <div>
                <h3 className="font-semibold">Testing Controls</h3>
                <p className="text-sm text-muted-foreground">Configure and run gateway tests</p>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Test Mode Selection */}
            <div className="flex items-center gap-3 p-3 rounded-lg bg-white/50 dark:bg-black/20 backdrop-blur-sm">
              <div className="p-2 rounded-full bg-blue-100 dark:bg-blue-900/20">
                <Shield className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">Test Mode</p>
                <div className="flex gap-2 mt-1">
                  <Button
                    size="sm"
                    variant={testMode === 'test' ? "default" : "outline"}
                    onClick={() => setTestMode('test')}
                    className="text-xs"
                  >
                    Test Keys
                  </Button>
                  <Button
                    size="sm"
                    variant={testMode === 'live' ? "default" : "outline"}
                    onClick={() => setTestMode('live')}
                    className="text-xs"
                  >
                    Live Keys
                  </Button>
                </div>
              </div>
            </div>
            
            {/* Health Check */}
            <div className="flex items-center gap-3 p-3 rounded-lg bg-white/50 dark:bg-black/20 backdrop-blur-sm">
              <div className="p-2 rounded-full bg-green-100 dark:bg-green-900/20">
                <Activity className="h-4 w-4 text-green-600 dark:text-green-400" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">All Gateways</p>
                <Button
                  size="sm"
                  onClick={runHealthCheck}
                  disabled={runningHealthCheck}
                  className="mt-1 text-xs"
                >
                  {runningHealthCheck ? (
                    <RefreshCw className="h-3 w-3 mr-1 animate-spin" />
                  ) : (
                    <Play className="h-3 w-3 mr-1" />
                  )}
                  Health Check
                </Button>
              </div>
            </div>
            
            {/* Individual Test */}
            <div className="flex items-center gap-3 p-3 rounded-lg bg-white/50 dark:bg-black/20 backdrop-blur-sm">
              <div className="p-2 rounded-full bg-purple-100 dark:bg-purple-900/20">
                <CreditCard className="h-4 w-4 text-purple-600 dark:text-purple-400" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">Single Gateway</p>
                <div className="flex gap-2 mt-1">
                  <select 
                    value={selectedGateway}
                    onChange={(e) => setSelectedGateway(e.target.value)}
                    className="text-xs rounded border px-2 py-1"
                  >
                    {availableGateways.map(g => (
                      <option key={g.id} value={g.id}>{g.name}</option>
                    ))}
                  </select>
                  <Button
                    size="sm"
                    onClick={() => runSingleTest(selectedGateway)}
                    disabled={testing[selectedGateway]}
                    className="text-xs"
                  >
                    {testing[selectedGateway] ? (
                      <RefreshCw className="h-3 w-3 animate-spin" />
                    ) : (
                      <Play className="h-3 w-3" />
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Test Results */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="text-lg font-semibold">Recent Test Results</h4>
          <Badge variant="secondary" className="gap-1">
            <Clock className="h-3 w-3" />
            {testResults.length} tests
          </Badge>
        </div>

        {testResults.length === 0 ? (
          <Card className="border-2 border-dashed border-muted-foreground/20">
            <CardContent className="p-8 text-center">
              <div className="p-4 rounded-full bg-muted/50 w-fit mx-auto mb-4">
                <Play className="h-6 w-6 text-muted-foreground" />
              </div>
              <h3 className="font-semibold mb-2">No Tests Run Yet</h3>
              <p className="text-sm text-muted-foreground">
                Run a health check or individual gateway test to see results here
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {testResults.map((result, index) => (
              <Card 
                key={`${result.gateway}-${index}`}
                className={cn(
                  "group relative overflow-hidden border-0 bg-gradient-to-br hover:shadow-xl transition-all duration-500 hover:scale-[1.02]",
                  getResultColor(result)
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
                        {getStatusIcon(result)}
                      </div>
                      <div>
                        <h3 className="font-semibold text-white/90 capitalize">{result.gateway}</h3>
                        <p className="text-xs text-white/60">
                          {new Date(result.timestamp).toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                    
                    <Badge 
                      variant="secondary" 
                      className={cn(
                        "text-white border-0 backdrop-blur-sm",
                        result.success 
                          ? "bg-green-500/20 text-green-100" 
                          : "bg-red-500/20 text-red-100"
                      )}
                    >
                      {result.success ? "PASS" : "FAIL"}
                    </Badge>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2 p-2 rounded-lg bg-white/10 backdrop-blur-sm">
                      <TrendingUp className="h-4 w-4 text-white/80" />
                      <div>
                        <p className="text-xs text-white/60">Response Time</p>
                        <p className="text-sm font-medium">{formatResponseTime(result.responseTime)}</p>
                      </div>
                    </div>

                    {result.transactionId && (
                      <div className="flex items-center gap-2 p-2 rounded-lg bg-white/10 backdrop-blur-sm">
                        <Code className="h-4 w-4 text-white/80" />
                        <div>
                          <p className="text-xs text-white/60">Transaction ID</p>
                          <p className="text-sm font-medium font-mono">{result.transactionId}</p>
                        </div>
                      </div>
                    )}

                    {result.error && (
                      <div className="p-2 rounded-lg bg-red-500/20 backdrop-blur-sm">
                        <p className="text-xs text-red-100">{result.error}</p>
                      </div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-2 mt-3">
                    <Button
                      size="sm"
                      variant="secondary"
                      className="flex-1 bg-white/20 hover:bg-white/30 text-white border-0 backdrop-blur-sm"
                      onClick={() => runSingleTest(result.gateway)}
                      disabled={testing[result.gateway]}
                    >
                      {testing[result.gateway] ? (
                        <RefreshCw className="h-3 w-3 mr-1 animate-spin" />
                      ) : (
                        <RefreshCw className="h-3 w-3 mr-1" />
                      )}
                      Retest
                    </Button>
                    <Button
                      size="sm"
                      variant="secondary"
                      className="bg-white/20 hover:bg-white/30 text-white border-0 backdrop-blur-sm px-3"
                    >
                      <Eye className="h-3 w-3" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Quick Test Card for Emergency */}
      <Card className="border-0 bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50 dark:from-red-950/20 dark:via-orange-950/20 dark:to-yellow-950/20">
        <CardContent className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-full bg-gradient-to-r from-red-500 to-orange-500">
                <AlertTriangle className="h-4 w-4 text-white" />
              </div>
              <div>
                <h3 className="font-semibold">Emergency Quick Test</h3>
                <p className="text-sm text-muted-foreground">Fast connectivity check for critical gateways</p>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {['stripe', 'paystack', 'sayswitch'].map(gateway => (
              <Button
                key={gateway}
                variant="outline"
                size="sm"
                onClick={() => runSingleTest(gateway)}
                disabled={testing[gateway]}
                className="gap-2"
              >
                {testing[gateway] ? (
                  <RefreshCw className="h-3 w-3 animate-spin" />
                ) : (
                  <Zap className="h-3 w-3" />
                )}
                {gateway.charAt(0).toUpperCase() + gateway.slice(1)}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};