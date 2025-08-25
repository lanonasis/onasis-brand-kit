import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { exchangeCode } from "@/integrations/auth/gateway";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function AuthCallback() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState<string>("");

  useEffect(() => {
    const code = params.get("code");
    const state = params.get("state");
    if (!code) {
      setStatus("error");
      setMessage("Missing code parameter");
      return;
    }
    (async () => {
      try {
        setStatus("loading");
        await exchangeCode(code);
        setStatus("success");
        // Optional: use `state` to decide destination
        const dest = state && state.startsWith("/") ? state : "/";
        setTimeout(() => navigate(dest, { replace: true }), 600);
      } catch (e: unknown) {
        setStatus("error");
        const err = e instanceof Error ? e : new Error(String(e));
        setMessage(err.message || "Exchange failed");
      }
    })();
  }, [params, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <Card className="w-full max-w-md p-6 text-center">
        {status === "loading" && (
          <>
            <h2 className="text-xl font-semibold mb-2">Signing you in…</h2>
            <p className="text-muted-foreground">Exchanging secure code for a session.</p>
          </>
        )}
        {status === "success" && (
          <>
            <h2 className="text-xl font-semibold mb-2">Success!</h2>
            <p className="text-muted-foreground">You are now signed in. Redirecting…</p>
          </>
        )}
        {status === "error" && (
          <>
            <h2 className="text-xl font-semibold mb-2">Sign-in failed</h2>
            <p className="text-muted-foreground mb-4">{message}</p>
            <Button onClick={() => navigate("/", { replace: true })}>Back to Home</Button>
          </>
        )}
      </Card>
    </div>
  );
}
