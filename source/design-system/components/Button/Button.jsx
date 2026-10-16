import * as React from "react";

/*
 * Variants: primary = corporate gold, accent = product green, secondary = navy,
 * outline / ghost use semantic tokens so they follow light/dark theme,
 * danger = destructive. `loading` disables the button and shows a spinner
 * (merged from the TanStack library).
 */
const VARIANTS = {
  primary:   { background: "var(--ln-gold)",  color: "var(--ln-navy-deep)" },
  accent:    { background: "var(--ln-green)", color: "var(--ln-navy-deep)" },
  secondary: { background: "var(--ln-navy)",  color: "var(--ln-white)" },
  outline:   { background: "var(--bg-elevated)", color: "var(--fg-1)", borderColor: "var(--border-default)" },
  ghost:     { background: "transparent", color: "var(--fg-1)" },
  danger:    { background: "var(--status-danger)", color: "var(--ln-white)" },
};

const SIZES = {
  sm:   { minHeight: "var(--control-sm)", padding: "0 12px", fontSize: 12 },
  md:   { minHeight: "var(--control-md)", padding: "0 16px", fontSize: 14 },
  lg:   { minHeight: "var(--control-lg)", padding: "0 24px", fontSize: 15 },
  icon: { width: "var(--control-md)", height: "var(--control-md)", padding: 0, fontSize: 14 },
};

function Spinner() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true" style={{ animation: "ln-spin 1s linear infinite", flexShrink: 0 }}>
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeOpacity="0.3" strokeWidth="3" />
      <path d="M21 12a9 9 0 0 0-9-9" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

export function Button({ variant = "primary", size = "md", loading = false, disabled, type = "button", children, style, ...rest }) {
  const [hover, setHover] = React.useState(false);
  const off = disabled || loading;
  const v = VARIANTS[variant] || VARIANTS.primary;
  return (
    <button
      type={type}
      disabled={off}
      aria-busy={loading || undefined}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
        borderRadius: "var(--r-md)",
        border: "1px solid transparent",
        fontFamily: "var(--font-body)",
        fontWeight: 600,
        lineHeight: 1.2,
        whiteSpace: "nowrap",
        cursor: off ? "not-allowed" : "pointer",
        opacity: off ? "var(--disabled-opacity)" : 1,
        transition: "transform var(--dur-base) var(--ease-out), box-shadow var(--dur-base) var(--ease-out), filter var(--dur-base)",
        transform: hover && !off ? "translateY(-1px)" : "none",
        boxShadow: hover && !off ? "var(--shadow-md)" : "none",
        filter: hover && !off && variant !== "ghost" ? "brightness(0.97)" : "none",
        ...SIZES[size],
        ...v,
        ...(hover && !off && variant === "ghost" ? { background: "var(--bg-muted)" } : null),
        ...style,
      }}
      {...rest}
    >
      {loading && <Spinner />}
      {children}
    </button>
  );
}
