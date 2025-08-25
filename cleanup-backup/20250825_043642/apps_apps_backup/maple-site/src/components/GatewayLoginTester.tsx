import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { loginInline, submitGatewayRedirectLogin } from "@/integrations/auth/gateway";
import { supabase } from "@/integrations/supabase/client";

export default function GatewayLoginTester() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [sessionInfo, setSessionInfo] = useState<string>("No session");
  const [loading, setLoading] = useState(false);

  async function refreshSessionInfo() {
    const { data } = await supabase.auth.getSession();
    if (data?.session) {
      setSessionInfo(`Session: ${data.session.user?.email || data.session.user?.id}`);
    } else {
      setSessionInfo("No session");
    }
  }

  useEffect(() => {
    refreshSessionInfo();
  }, []);

  return (
    <Card className="p-4 w-[340px] shadow-lg border-primary/30 bg-background/95 backdrop-blur">
      <div className="text-sm font-semibold mb-2">Auth Gateway Tester (DEV)</div>
      <div className="space-y-2 mb-3">
        <Input placeholder="email" value={email} onChange={e => setEmail(e.target.value)} />
        <Input placeholder="password" type="password" value={password} onChange={e => setPassword(e.target.value)} />
      </div>
      <div className="flex gap-2">
        <Button size="sm" disabled={loading} onClick={async () => {
          try {
            setLoading(true);
            await loginInline(email, password);
          } catch (e) {
            console.error(e);
          } finally {
            setLoading(false);
            refreshSessionInfo();
          }
        }}>Inline Sign-in</Button>
        <Button size="sm" variant="outline" onClick={() => {
          submitGatewayRedirectLogin(email, password, `${window.location.origin}/auth/callback`, "/");
        }}>Redirect Sign-in</Button>
      </div>
      <div className="mt-3 text-xs text-muted-foreground break-words">{sessionInfo}</div>
    </Card>
  );
}
