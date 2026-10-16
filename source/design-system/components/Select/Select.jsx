import * as React from "react";

/* Native select styled to match Input. Native keeps full keyboard and screen-reader behaviour. */
export function Select({ variant = "default", size = "md", disabled, style, children, ...rest }) {
  const [focus, setFocus] = React.useState(false);
  const err = variant === "error";
  return (
    <span style={{ position: "relative", display: "block", width: "100%" }}>
      <select
        disabled={disabled}
        aria-invalid={err || undefined}
        onFocus={(e) => { setFocus(true); rest.onFocus && rest.onFocus(e); }}
        onBlur={(e) => { setFocus(false); rest.onBlur && rest.onBlur(e); }}
        style={{
          width: "100%",
          minHeight: size === "sm" ? "var(--control-sm)" : "var(--control-md)",
          padding: "0 36px 0 12px",
          appearance: "none",
          WebkitAppearance: "none",
          borderRadius: "var(--r-md)",
          border: `1px solid ${err ? "var(--status-danger)" : focus ? "var(--border-focus)" : "var(--border-default)"}`,
          boxShadow: focus ? (err ? "0 0 0 4px rgba(229,72,77,.16)" : "var(--glow-green)") : "none",
          background: "var(--bg-elevated)",
          color: "var(--fg-1)",
          font: "400 14px/1.5 var(--font-body)",
          outline: "none",
          opacity: disabled ? "var(--disabled-opacity)" : 1,
          cursor: disabled ? "not-allowed" : "pointer",
          boxSizing: "border-box",
          ...style,
        }}
        {...rest}
      >
        {children}
      </select>
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true" style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", pointerEvents: "none", color: "var(--fg-3)" }}>
        <path d="m6 9 6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </span>
  );
}
