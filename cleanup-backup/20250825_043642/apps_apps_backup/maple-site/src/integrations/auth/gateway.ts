import { supabase } from "@/integrations/supabase/client";

export const AUTH_GATEWAY_URL = (import.meta.env.VITE_AUTH_GATEWAY_URL as string) || "https://api.lanonasis.com";
export const PROJECT_SCOPE = (import.meta.env.VITE_PROJECT_SCOPE as string) || "maple";

function buildUrl(path: string) {
  return `${AUTH_GATEWAY_URL.replace(/\/$/, "")}${path}`;
}

export type ExchangeResponse = {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  token_type: string;
  user: unknown;
};

export async function exchangeCode(code: string): Promise<ExchangeResponse> {
  const res = await fetch(buildUrl("/v1/auth/callback"), {
    method: "POST",
    headers: { 
      "Content-Type": "application/json",
      "x-project-scope": PROJECT_SCOPE
    },
    credentials: 'include',
    body: JSON.stringify({ 
      code,
      project_scope: PROJECT_SCOPE 
    })
  });
  if (!res.ok) {
    throw new Error("OAuth callback failed");
  }
  const data: ExchangeResponse = await res.json();
  const { access_token, refresh_token } = data;
  // Persist Supabase session locally for SPA usage
  const { error } = await supabase.auth.setSession({ access_token, refresh_token });
  if (error) throw error;
  return data;
}

export async function loginInline(email: string, password: string): Promise<ExchangeResponse> {
  // Core Gateway authentication with project scope
  const res = await fetch(buildUrl("/v1/auth/login"), {
    method: "POST",
    headers: { 
      "Content-Type": "application/json",
      "x-project-scope": PROJECT_SCOPE
    },
    credentials: 'include',
    body: JSON.stringify({ 
      email, 
      password,
      project_scope: PROJECT_SCOPE
    })
  });
  if (!res.ok) throw new Error("Login failed");
  const data = await res.json();
  
  // For Core Gateway, we get tokens directly
  if (data.access_token) {
    const { access_token, refresh_token } = data;
    // Persist Supabase session locally for SPA usage
    const { error } = await supabase.auth.setSession({ access_token, refresh_token });
    if (error) throw error;
    return data;
  }
  
  // Fallback to code exchange if needed
  const { code } = data;
  if (!code) throw new Error("No code or token returned");
  return exchangeCode(code);
}

export async function logout(): Promise<void> {
  // Core Gateway logout with project scope
  const { data } = await supabase.auth.getSession();
  const token = data?.session?.access_token;
  if (token) {
    try {
      await fetch(buildUrl("/v1/auth/logout"), {
        method: "POST",
        headers: { 
          "Authorization": `Bearer ${token}`,
          "x-project-scope": PROJECT_SCOPE
        },
        credentials: 'include'
      });
    } catch (_e) {
      // best-effort logout; intentionally ignoring errors
      void 0;
    }
  }
  await supabase.auth.signOut();
}

export function submitGatewayRedirectLogin(email: string, password: string, redirectTo?: string, state?: string) {
  // Use a plain HTML form submit to allow 302 redirect to callback without CORS complications
  const form = document.createElement("form");
  form.method = "POST";
  form.action = buildUrl("/v1/auth/login");
  const append = (name: string, value: string) => {
    const input = document.createElement("input");
    input.type = "hidden";
    input.name = name;
    input.value = value;
    form.appendChild(input);
  };
  append("email", email);
  append("password", password);
  append("project_scope", PROJECT_SCOPE); // Add project scope
  append("redirect_to", redirectTo || `${window.location.origin}/auth/callback`);
  if (state) append("state", state);
  document.body.appendChild(form);
  form.submit();
  document.body.removeChild(form);
}

// OAuth Authentication for Core Gateway
export async function signInWithOAuth(provider: 'google' | 'github' = 'google'): Promise<void> {
  const authUrl = new URL(`${AUTH_GATEWAY_URL}/v1/auth/oauth`);
  authUrl.searchParams.set('provider', provider);
  authUrl.searchParams.set('redirect_uri', `${window.location.origin}/auth/callback`);
  authUrl.searchParams.set('project_scope', PROJECT_SCOPE);
  authUrl.searchParams.set('response_type', 'code');
  
  window.location.href = authUrl.toString();
}
