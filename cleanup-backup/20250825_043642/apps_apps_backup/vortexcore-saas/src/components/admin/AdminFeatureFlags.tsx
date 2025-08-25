/**
 * Admin Feature Flags - Manage experimental and upcoming features
 */

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { 
  Bot, 
  Sparkles, 
  MessageSquare,
  Zap,
  Shield,
  Clock,
  Wand2,
  Brain,
  Settings,
  Star,
  Rocket,
  Code,
  Eye,
  EyeOff,
  Lightbulb,
  Crown,
  Magic,
  Cpu,
  CreditCard
} from "lucide-react";
import { cn } from "@/lib/utils";
import { adminService } from "@/services/adminService";
import { toast } from "@/hooks/use-toast";

interface FeatureFlag {
  id: string;
  name: string;
  description: string;
  category: 'ai' | 'payment' | 'ui' | 'security' | 'integration';
  status: 'coming_soon' | 'beta' | 'enabled' | 'disabled';
  releaseDate?: string;
  enabled: boolean;
  permissions: string[];
  dependencies?: string[];
}

export const AdminFeatureFlags = () => {
  const [features, setFeatures] = useState<FeatureFlag[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFeatureFlags();
  }, []);

  const loadFeatureFlags = async () => {
    try {
      setLoading(true);
      const data = await adminService.getFeatureFlags();
      setFeatures(data || []);
    } catch (error) {
      console.error('Failed to load feature flags:', error);
      toast({
        title: "Error",
        description: "Failed to load feature flags",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const toggleFeature = async (featureId: string, enabled: boolean) => {
    try {
      const success = await adminService.updateFeatureFlag(featureId, { enabled });
      
      if (success) {
        setFeatures(prev => prev.map(f => 
          f.id === featureId ? { ...f, enabled } : f
        ));
        
        toast({
          title: "Feature Updated",
          description: `${featureId} ${enabled ? 'enabled' : 'disabled'} successfully`,
        });
      }
    } catch (error) {
      console.error('Failed to toggle feature:', error);
      toast({
        title: "Error",
        description: "Failed to update feature flag",
        variant: "destructive"
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'coming_soon': return 'from-purple-600 to-pink-600';
      case 'beta': return 'from-yellow-600 to-orange-600';
      case 'enabled': return 'from-green-600 to-emerald-600';
      case 'disabled': return 'from-gray-600 to-gray-700';
      default: return 'from-blue-600 to-cyan-600';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'coming_soon': return <Clock className="h-4 w-4" />;
      case 'beta': return <Lightbulb className="h-4 w-4" />;
      case 'enabled': return <Star className="h-4 w-4" />;
      case 'disabled': return <EyeOff className="h-4 w-4" />;
      default: return <Eye className="h-4 w-4" />;
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'ai': return <Brain className="h-4 w-4" />;
      case 'payment': return <CreditCard className="h-4 w-4" />;
      case 'ui': return <Wand2 className="h-4 w-4" />;
      case 'security': return <Shield className="h-4 w-4" />;
      case 'integration': return <Zap className="h-4 w-4" />;
      default: return <Settings className="h-4 w-4" />;
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
        <h3 className="text-2xl font-bold">Feature Flags</h3>
        <p className="text-muted-foreground">
          Manage experimental features and upcoming releases
        </p>
      </div>

      {/* VortexAI Assistant - Featured Section */}
      <Card className="border-0 bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50 dark:from-purple-950/20 dark:via-pink-950/20 dark:to-indigo-950/20 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-black/5 dark:bg-white/5" />
        <div className="absolute -top-4 -right-4 w-32 h-32 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-full blur-2xl" />
        <div className="absolute -bottom-4 -left-4 w-24 h-24 bg-gradient-to-br from-indigo-400/20 to-purple-400/20 rounded-full blur-xl" />
        
        <CardContent className="relative p-8">
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="p-4 rounded-2xl bg-gradient-to-r from-purple-600 to-pink-600 shadow-lg">
                <Bot className="h-8 w-8 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                    VortexAI Assistant
                  </h2>
                  <Badge 
                    variant="secondary" 
                    className="bg-purple-100 text-purple-700 dark:bg-purple-900/20 dark:text-purple-300 gap-1"
                  >
                    <Crown className="h-3 w-3" />
                    Premium Feature
                  </Badge>
                </div>
                <p className="text-lg text-muted-foreground max-w-2xl">
                  AI-powered assistant to guide and help with any task within the interface. 
                  Just chat naturally and get intelligent assistance for payments, gateways, troubleshooting, and more.
                </p>
              </div>
            </div>
            
            <Badge 
              variant="secondary" 
              className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-purple-700 dark:text-purple-300 border-0 backdrop-blur-sm px-4 py-2"
            >
              <Clock className="h-4 w-4 mr-2" />
              Coming Soon
            </Badge>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            {/* Capability Cards */}
            <div className="flex items-center gap-3 p-4 rounded-xl bg-white/50 dark:bg-black/20 backdrop-blur-sm">
              <div className="p-3 rounded-lg bg-gradient-to-r from-blue-500 to-cyan-500 text-white">
                <MessageSquare className="h-5 w-5" />
              </div>
              <div>
                <p className="font-semibold">Natural Chat Interface</p>
                <p className="text-sm text-muted-foreground">Ask questions in plain English</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 p-4 rounded-xl bg-white/50 dark:bg-black/20 backdrop-blur-sm">
              <div className="p-3 rounded-lg bg-gradient-to-r from-green-500 to-emerald-500 text-white">
                <Zap className="h-5 w-5" />
              </div>
              <div>
                <p className="font-semibold">Smart Automation</p>
                <p className="text-sm text-muted-foreground">Automate complex admin tasks</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 p-4 rounded-xl bg-white/50 dark:bg-black/20 backdrop-blur-sm">
              <div className="p-3 rounded-lg bg-gradient-to-r from-orange-500 to-red-500 text-white">
                <Brain className="h-5 w-5" />
              </div>
              <div>
                <p className="font-semibold">Context Aware</p>
                <p className="text-sm text-muted-foreground">Understands your current workflow</p>
              </div>
            </div>
          </div>

          {/* Features Preview */}
          <div className="p-6 rounded-xl bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800/50 dark:to-gray-900/50 backdrop-blur-sm">
            <h4 className="font-semibold mb-3 flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-purple-600" />
              Planned Features
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                <span>"Help me troubleshoot Paystack errors"</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                <span>"Show me today's failed transactions"</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                <span>"Configure SaySwitch for higher amounts"</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                <span>"Generate performance report for last week"</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                <span>"Add new MCP integration for Flutterwave"</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                <span>"Walk me through the escalation process"</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3 mt-6">
            <Button disabled className="gap-2 bg-gradient-to-r from-purple-600 to-pink-600 opacity-50">
              <Rocket className="h-4 w-4" />
              Available Q1 2025
            </Button>
            <Button variant="outline" className="gap-2">
              <Star className="h-4 w-4" />
              Get Notified
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Other Feature Flags */}
      <div className="space-y-4">
        <h4 className="text-lg font-semibold">Additional Features</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {features.filter(f => f.id !== 'vortex-ai-assistant').map((feature) => (
            <Card 
              key={feature.id}
              className={cn(
                "group relative overflow-hidden border-0 bg-gradient-to-br hover:shadow-xl transition-all duration-500 hover:scale-[1.02]",
                getStatusColor(feature.status)
              )}
            >
              {/* Background Pattern */}
              <div className="absolute inset-0 bg-black/10 dark:bg-white/5" />
              <div className="absolute -top-4 -right-4 w-16 h-16 bg-white/10 rounded-full blur-xl" />
              <div className="absolute -bottom-4 -left-4 w-12 h-12 bg-white/5 rounded-full blur-lg" />
              
              <CardContent className="relative p-6 text-white">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-white/20 backdrop-blur-sm">
                      {getCategoryIcon(feature.category)}
                    </div>
                    <div>
                      <h3 className="font-semibold text-white/90">{feature.name}</h3>
                      <p className="text-xs text-white/60 capitalize">{feature.category}</p>
                    </div>
                  </div>
                  
                  <Badge 
                    variant="secondary" 
                    className="text-white border-0 backdrop-blur-sm bg-white/20"
                  >
                    {getStatusIcon(feature.status)}
                    <span className="ml-1 capitalize">{feature.status.replace('_', ' ')}</span>
                  </Badge>
                </div>

                <p className="text-sm text-white/80 mb-4">{feature.description}</p>

                {feature.releaseDate && (
                  <div className="flex items-center gap-2 mb-4 p-2 rounded-lg bg-white/10 backdrop-blur-sm">
                    <Clock className="h-4 w-4 text-white/80" />
                    <span className="text-xs text-white/80">Expected: {feature.releaseDate}</span>
                  </div>
                )}

                {feature.status !== 'coming_soon' && (
                  <div className="flex items-center justify-between p-3 rounded-lg bg-white/10 backdrop-blur-sm">
                    <span className="text-sm font-medium">Enable Feature</span>
                    <Switch
                      checked={feature.enabled}
                      onCheckedChange={(checked) => toggleFeature(feature.id, checked)}
                      disabled={feature.status === 'coming_soon'}
                      className="data-[state=checked]:bg-white/30"
                    />
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};