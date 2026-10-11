import * as React from "react";

export function Card({ eyebrow, title, body, accent = "gold", footer }) {
  const [hover, setHover] = React.useState(false);
  const accentColor = accent === "green" ? "var(--ln-green-500)" : "var(--ln-gold-600)";
  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        background: "#fff",
        border: "1px solid var(--border-subtle)",
        borderRadius: "var(--r-lg)",
        padding: "20px 22px",
        fontFamily: "var(--font-body)",
        boxShadow: hover
          ? "0 12px 32px rgba(8,18,31,.10), 0 4px 8px rgba(8,18,31,.04)"
          : "0 1px 3px rgba(8,18,31,.05)",
        transform: hover ? "translateY(-2px)" : "none",
        transition: "all .2s var(--ease-out)",
        maxWidth: 320,
      }}
    >
      {eyebrow && (
        <div
          style={{
            fontSize: 11,
            fontWeight: 600,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color: accentColor,
            marginBottom: 6,
          }}
        >
          {eyebrow}
        </div>
      )}
      {title && (
        <div
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 700,
            fontSize: 18,
            color: "var(--ln-navy)",
            marginBottom: 8,
          }}
        >
          {title}
        </div>
      )}
      {body && (
        <p style={{ fontSize: 13, lineHeight: 1.6, color: "var(--fg-2)", margin: 0 }}>
          {body}
        </p>
      )}
      {footer && (
        <div style={{ marginTop: 14, fontSize: 12, color: "var(--fg-3)" }}>{footer}</div>
      )}
    </div>
  );
}
