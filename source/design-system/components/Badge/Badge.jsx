import * as React from "react";

const TONES = {
  success: { bg: "#E5FBF5", fg: "#00785F", dot: "#00B791" },
  info:    { bg: "#EEF2F8", fg: "#1B365D", dot: "#1B365D" },
  warning: { bg: "#FFF3DB", fg: "#8A6D00", dot: "#F5A623" },
  danger:  { bg: "#FCE6E7", fg: "#B5292D", dot: "#E5484D" },
  neutral: { bg: "var(--ln-grey-100)", fg: "var(--ln-grey-700)", dot: "var(--ln-grey-500)" },
  gold:    { bg: "var(--ln-gold-50)", fg: "var(--ln-gold-700)", dot: "var(--ln-gold)" },
};

export function Badge({ tone = "neutral", dot = true, children }) {
  const t = TONES[tone] || TONES.neutral;
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        padding: "4px 10px",
        borderRadius: "var(--r-pill)",
        fontFamily: "var(--font-body)",
        fontWeight: 600,
        fontSize: 12,
        background: t.bg,
        color: t.fg,
      }}
    >
      {dot && (
        <span
          style={{
            width: 6,
            height: 6,
            borderRadius: 999,
            background: t.dot,
            flexShrink: 0,
          }}
        />
      )}
      {children}
    </span>
  );
}
