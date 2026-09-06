import * as React from "react";

const VARIANTS = {
  primary:   { background: "var(--ln-gold)",  color: "var(--ln-navy-800)" },
  accent:    { background: "var(--ln-green)", color: "var(--ln-navy-800)" },
  secondary: { background: "var(--ln-navy)",  color: "#fff" },
  outline:   { background: "#fff", color: "var(--ln-navy)", border: "1px solid var(--border-default)" },
  ghost:     { background: "transparent", color: "var(--ln-navy)" },
};

const SIZES = {
  sm: { padding: "7px 12px", fontSize: 12 },
  md: { padding: "10px 18px", fontSize: 14 },
  lg: { padding: "14px 24px", fontSize: 15 },
};

export function Button({ variant = "primary", size = "md", children, onClick, disabled, ...rest }) {
  const [hover, setHover] = React.useState(false);
  const base = VARIANTS[variant] || VARIANTS.primary;
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 8,
        borderRadius: "var(--r-md)",
        fontWeight: 600,
        fontFamily: "var(--font-body)",
        border: "1px solid transparent",
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.5 : 1,
        transition: "all .2s var(--ease-out)",
        transform: hover && !disabled ? "translateY(-1px)" : "none",
        ...SIZES[size],
        ...base,
      }}
      {...rest}
    >
      {children}
    </button>
  );
}
