/**
 * Admin Dashboard - Main admin interface with tabbed navigation
 */

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { 
  Shield, 
  Settings,
  Activity,
  AlertTriangle,
  CreditCard,
  Bot,
  BarChart3,
  Users,
  LogOut,
  Crown,
  Sparkles,
  Flag
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { adminService } from "@/services/adminService";
import { toast } from "@/hooks/use-toast";

// Import admin components
import { AdminMonitoring } from "./AdminMonitoring";
import { AdminGatewayManager } from "./AdminGatewayManager";
import { AdminTestingPanel } from "./AdminTestingPanel";
import { AdminEscalationCenter } from "./AdminEscalationCenter";
import { AdminMCPManager } from "./AdminMCPManager";
import { AdminFeatureFlags } from "./AdminFeatureFlags";

export const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    checkAdminAccess();
  }, [user]);

  const checkAdminAccess = async () => {
    try {
      setLoading(true);
      
      if (!user?.email) {
        setIsAdmin(false);
        return;
      }

      // Check if user is pre-approved admin
      const isPreApproved = adminService.isPreApprovedAdmin(user.email);
      const hasAdminAccess = await adminService.isAdmin();
      
      setIsAdmin(isPreApproved || hasAdminAccess);
      
      if (!isPreApproved && !hasAdminAccess) {
        toast({
          title: "Access Denied",
          description: "You don't have admin privileges for this system",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Failed to verify admin access:', error);
      setIsAdmin(false);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      toast({
        title: "Logged Out",
        description: "You have been successfully logged out"
      });
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Verifying admin access...</p>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <div className="p-4 rounded-full bg-red-100 dark:bg-red-900/20 w-fit mx-auto mb-4">
              <Shield className="h-8 w-8 text-red-600 dark:text-red-400" />
            </div>
            <h2 className="text-xl font-semibold mb-2">Access Denied</h2>
            <p className="text-muted-foreground mb-6">
              You don't have permission to access the admin dashboard.
            </p>
            <Button onClick={handleLogout} className="w-full">
              <LogOut className="h-4 w-4 mr-2" />
              Return to Login
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600">
              <Crown className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Admin Dashboard</h1>
              <p className="text-muted-foreground">
                Welcome back, {user?.name || user?.email} • VortexCore Admin
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <Badge variant="secondary" className="gap-1">
              <Sparkles className="h-3 w-3" />
              Super Admin
            </Badge>
            <Button variant="outline" onClick={handleLogout} className="gap-2">
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>

        {/* Pre-approved Admin Notice */}
        {user?.email && adminService.isPreApprovedAdmin(user.email) && (
          <Alert className="mb-6">
            <Shield className="h-4 w-4" />
            <AlertTitle>Pre-approved Admin Access</AlertTitle>
            <AlertDescription>
              You have been granted pre-approved admin access via Supabase configuration. 
              Full system privileges are enabled for your account.
            </AlertDescription>
          </Alert>
        )}

        {/* Admin Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-6 lg:w-fit lg:grid-cols-6">
            <TabsTrigger value="overview" className="gap-2">
              <BarChart3 className="h-4 w-4" />
              <span className="hidden sm:inline">Overview</span>
            </TabsTrigger>
            <TabsTrigger value="gateways" className="gap-2">
              <CreditCard className="h-4 w-4" />
              <span className="hidden sm:inline">Gateways</span>
            </TabsTrigger>
            <TabsTrigger value="testing" className="gap-2">
              <Activity className="h-4 w-4" />
              <span className="hidden sm:inline">Testing</span>
            </TabsTrigger>
            <TabsTrigger value="escalations" className="gap-2">
              <AlertTriangle className="h-4 w-4" />
              <span className="hidden sm:inline">Issues</span>
            </TabsTrigger>
            <TabsTrigger value="mcp" className="gap-2">
              <Bot className="h-4 w-4" />
              <span className="hidden sm:inline">MCP</span>
            </TabsTrigger>
            <TabsTrigger value="features" className="gap-2">
              <Flag className="h-4 w-4" />
              <span className="hidden sm:inline">Features</span>
            </TabsTrigger>
          </TabsList>

          {/* Tab Content */}
          <TabsContent value="overview" className="space-y-6">
            <AdminMonitoring />
          </TabsContent>

          <TabsContent value="gateways" className="space-y-6">
            <AdminGatewayManager />
          </TabsContent>

          <TabsContent value="testing" className="space-y-6">
            <AdminTestingPanel />
          </TabsContent>

          <TabsContent value="escalations" className="space-y-6">
            <AdminEscalationCenter />
          </TabsContent>

          <TabsContent value="mcp" className="space-y-6">
            <AdminMCPManager />
          </TabsContent>

          <TabsContent value="features" className="space-y-6">
            <AdminFeatureFlags />
          </TabsContent>
        </Tabs>

        {/* Footer */}
        <div className="mt-12 pt-6 border-t border-muted-foreground/20">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Shield className="h-4 w-4" />
              <span>VortexCore Admin Panel • Onasis Ecosystem</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>Connected to: Supabase, Onasis Gateway, MCP Servers</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};