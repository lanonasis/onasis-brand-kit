import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { logout } from "@/integrations/auth/gateway";
import { useNavigate } from "react-router-dom";
import mapleLogoImage from "@/assets/maple-logo.png";
import { User, LogOut, Calendar, TrendingUp, Trophy } from "lucide-react";

const Dashboard = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkUser = async () => {
      const { data } = await supabase.auth.getSession();
      if (data?.session?.user) {
        setUser(data.session.user);
      } else {
        // No session, redirect to login
        navigate("/login");
      }
      setLoading(false);
    };

    checkUser();
  }, [navigate]);

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <img src={mapleLogoImage} alt="Maple Logo" className="h-16 w-16 mx-auto mb-4 animate-pulse" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect to login
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-background/95 backdrop-blur-md">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <img src={mapleLogoImage} alt="Maple Logo" className="h-8 w-8" />
              <span className="text-xl font-bold text-foreground">Maple Dashboard</span>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <User className="h-4 w-4" />
                <span className="text-sm text-muted-foreground">
                  {user.email}
                </span>
              </div>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Welcome back, {user.email?.split('@')[0]}!
          </h1>
          <p className="text-muted-foreground">
            Here's your Maple dashboard overview
          </p>
        </div>

        {/* Dashboard Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card className="p-6">
            <div className="flex items-center space-x-3 mb-4">
              <TrendingUp className="h-8 w-8 text-primary" />
              <div>
                <h3 className="font-semibold text-foreground">Wealth Management</h3>
                <p className="text-sm text-muted-foreground">Track your financial goals</p>
              </div>
            </div>
            <Button variant="outline" className="w-full">
              View Portfolio
            </Button>
          </Card>

          <Card className="p-6">
            <div className="flex items-center space-x-3 mb-4">
              <Calendar className="h-8 w-8 text-sport-blue" />
              <div>
                <h3 className="font-semibold text-foreground">Appointments</h3>
                <p className="text-sm text-muted-foreground">Manage your bookings</p>
              </div>
            </div>
            <Button variant="outline" className="w-full">
              Schedule Meeting
            </Button>
          </Card>

          <Card className="p-6">
            <div className="flex items-center space-x-3 mb-4">
              <Trophy className="h-8 w-8 text-sport-red" />
              <div>
                <h3 className="font-semibold text-foreground">Sports Updates</h3>
                <p className="text-sm text-muted-foreground">Latest sports insights</p>
              </div>
            </div>
            <Button variant="outline" className="w-full">
              Read Articles
            </Button>
          </Card>
        </div>

        {/* Welcome Message */}
        <Card className="p-8">
          <div className="text-center space-y-4">
            <h2 className="text-2xl font-bold text-foreground">
              🎉 Login Successful!
            </h2>
            <p className="text-lg text-muted-foreground">
              You've successfully logged into your Maple account using the central authentication system.
            </p>
            <div className="bg-primary/10 rounded-lg p-4">
              <p className="text-sm text-foreground">
                <strong>Test Complete:</strong> The login flow is working correctly with the central auth gateway.
                This same authentication system will be used across all Lan Onasis services.
              </p>
            </div>
            <Button onClick={() => navigate("/")} variant="outline">
              Back to Home
            </Button>
          </div>
        </Card>
      </main>
    </div>
  );
};

export default Dashboard;