import * as React from "react";

/* Semantic text field. Label and help/error text belong to the consuming form;
   use variant="error" with aria-describedby pointing at the error message. */
export function Input({ variant = "default", size = "md", disabled, style, onFocus, onBlur, ...rest }) {
  const [focus, setFocus] = React.useState(false);
  const err = variant === "error";
  return (
    <input
      disabled={disabled}
      aria-invalid={err || undefined}
      onFocus={(e) => { setFocus(true); onFocus && onFocus(e); }}
      onBlur={(e) => { setFocus(false); onBlur && onBlur(e); }}
      style={{
        width: "100%",
        minHeight: size === "sm" ? "var(--control-sm)" : "var(--control-md)",
        padding: "0 12px",
        borderRadius: "var(--r-md)",
        border: `1px solid ${err ? "var(--status-danger)" : focus ? "var(--border-focus)" : "var(--border-default)"}`,
        boxShadow: focus ? (err ? "0 0 0 4px rgba(229,72,77,.16)" : "var(--glow-green)") : "none",
        background: "var(--bg-elevated)",
        color: "var(--fg-1)",
        font: "400 14px/1.5 var(--font-body)",
        outline: "none",
        opacity: disabled ? "var(--disabled-opacity)" : 1,
        cursor: disabled ? "not-allowed" : "text",
        transition: "border-color var(--dur-fast), box-shadow var(--dur-fast)",
        boxSizing: "border-box",
        ...style,
      }}
      {...rest}
    />
  );
}
