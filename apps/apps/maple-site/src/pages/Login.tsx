import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { loginInline, signInWithOAuth } from "@/integrations/auth/gateway";
import { useNavigate } from "react-router-dom";
import mapleLogoImage from "@/assets/maple-logo.png";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await loginInline(email, password);
      // Login successful - redirect to dashboard or home
      navigate("/dashboard");
    } catch (err) {
      setError("Login failed. Please check your credentials and try again.");
      console.error("Login error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 to-sport-blue/10">
      <Card className="w-full max-w-md p-8 space-y-6">
        {/* Logo and Title */}
        <div className="text-center space-y-4">
          <img src={mapleLogoImage} alt="Maple Logo" className="h-16 w-16 mx-auto" />
          <div>
            <h1 className="text-2xl font-bold text-foreground">Welcome Back</h1>
            <p className="text-muted-foreground">Sign in to your Maple account</p>
          </div>
        </div>

        {/* OAuth Options */}
        <div className="space-y-3">
          <Button 
            type="button"
            onClick={() => signInWithOAuth('google')}
            className="w-full bg-red-500 hover:bg-red-600 text-white"
          >
            Continue with Google
          </Button>
          <Button 
            type="button"
            onClick={() => signInWithOAuth('github')}
            className="w-full bg-gray-800 hover:bg-gray-900 text-white"
          >
            Continue with GitHub
          </Button>
        </div>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">
              Or continue with email
            </span>
          </div>
        </div>

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Signing in..." : "Sign In"}
          </Button>
        </form>

        {/* Links */}
        <div className="text-center space-y-2">
          <Button variant="link" className="text-sm">
            Forgot your password?
          </Button>
          <div className="text-sm text-muted-foreground">
            Don't have an account?{" "}
            <Button variant="link" className="text-sm p-0">
              Sign up
            </Button>
          </div>
        </div>

        {/* Back to Home */}
        <div className="text-center">
          <Button variant="outline" onClick={() => navigate("/")}>
            Back to Home
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default Login;