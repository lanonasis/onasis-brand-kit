/**
 * Admin Dashboard for Payment Gateway Management
 */

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { useAdmin } from "@/hooks/useAdmin";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Shield, ArrowLeft, AlertTriangle } from "lucide-react";
import { AdminGatewayManager } from "@/components/admin/AdminGatewayManager";
import { AdminTestingPanel } from "@/components/admin/AdminTestingPanel";
import { AdminEscalationCenter } from "@/components/admin/AdminEscalationCenter";
import { AdminMonitoring } from "@/components/admin/AdminMonitoring";

const AdminDashboard = () => {
  const { user, isLoading: authLoading } = useAuth();
  const { isAdmin, adminUser, loading: adminLoading, checkAdminAccess } = useAdmin();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth/login');
      return;
    }

    if (!adminLoading && !isAdmin) {
      navigate('/dashboard');
      return;
    }
  }, [user, isAdmin, authLoading, adminLoading, navigate]);

  if (authLoading || adminLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </Layout>
    );
  }

  if (!isAdmin) {
    return (
      <Layout>
        <div className="container mx-auto py-8">
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Access Denied</AlertTitle>
            <AlertDescription>
              You don't have admin permissions to access this page.
            </AlertDescription>
          </Alert>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto py-8">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-4">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => navigate('/dashboard')}
              className="gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Dashboard
            </Button>
            <div className="flex items-center gap-2">
              <Shield className="h-6 w-6 text-red-500" />
              <div>
                <h2 className="text-2xl font-bold">Admin Center</h2>
                <p className="text-sm text-muted-foreground">
                  Payment Gateway Management & Monitoring
                </p>
              </div>
            </div>
          </div>
          
          <div className="text-right">
            <p className="text-sm font-medium">{adminUser?.email}</p>
            <p className="text-xs text-muted-foreground capitalize">
              {adminUser?.role?.replace('_', ' ')} Access
            </p>
          </div>
        </div>

        <Alert className="mb-6">
          <Shield className="h-4 w-4" />
          <AlertTitle>Admin Access Detected</AlertTitle>
          <AlertDescription>
            You have elevated permissions for gateway management, testing, and troubleshooting.
            Use these tools responsibly to maintain service quality.
          </AlertDescription>
        </Alert>

        <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-2 md:grid-cols-5 mb-8">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="gateways">Gateway Config</TabsTrigger>
            <TabsTrigger value="testing">Live Testing</TabsTrigger>
            <TabsTrigger value="escalations">Escalations</TabsTrigger>
            <TabsTrigger value="monitoring">Monitoring</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-6">
            <AdminMonitoring />
          </TabsContent>
          
          <TabsContent value="gateways" className="space-y-4">
            <AdminGatewayManager />
          </TabsContent>
          
          <TabsContent value="testing" className="space-y-4">
            <AdminTestingPanel />
          </TabsContent>
          
          <TabsContent value="escalations" className="space-y-4">
            <AdminEscalationCenter />
          </TabsContent>
          
          <TabsContent value="monitoring" className="space-y-4">
            <AdminMonitoring detailed={true} />
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default AdminDashboard;