import * as React from "react";
import * as ReactDOM from "react-dom";

/*
 * Accessible dialog without a Radix dependency: focus moves in on open,
 * Tab is trapped inside, Escape and scrim-click close, focus is restored
 * to the opener on close, background scroll is locked.
 */
const FOCUSABLE = 'a[href],button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])';

export function Modal({ open = true, title, description, onClose, footer, size = "md", children }) {
  const panel = React.useRef(null);
  const ids = React.useRef("ln-modal-" + Math.random().toString(36).slice(2, 8)).current;
  /* Capture the opener during render — before children mount. A child with
     autoFocus grabs focus in its own commit, which runs before this component's
     effect, so reading activeElement in the effect would capture the wrong node. */
  const openerRef = React.useRef(null);
  if (open && !openerRef.current && typeof document !== "undefined") openerRef.current = document.activeElement;

  React.useEffect(() => {
    if (!open) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const node = panel.current;
    /* React doesn't render the autofocus attribute, so respect a child that
       already took focus instead of searching for [autofocus]. */
    if (node && !node.contains(document.activeElement)) {
      const first = node.querySelector(FOCUSABLE);
      (first || node).focus();
    }
    const onKey = (e) => {
      if (e.key === "Escape") { e.stopPropagation(); onClose && onClose(); return; }
      if (e.key !== "Tab" || !node) return;
      const items = [...node.querySelectorAll(FOCUSABLE)];
      if (!items.length) { e.preventDefault(); return; }
      const a = items[0], z = items[items.length - 1];
      if (e.shiftKey && document.activeElement === a) { e.preventDefault(); z.focus(); }
      else if (!e.shiftKey && document.activeElement === z) { e.preventDefault(); a.focus(); }
    };
    document.addEventListener("keydown", onKey, true);
    return () => {
      document.removeEventListener("keydown", onKey, true);
      document.body.style.overflow = prevOverflow;
      const opener = openerRef.current;
      openerRef.current = null;
      if (opener && opener.isConnected && opener.focus) opener.focus();
    };
  }, [open]);

  if (!open) return null;
  return ReactDOM.createPortal(
    <div
      onMouseDown={(e) => { if (e.target === e.currentTarget && onClose) onClose(); }}
      style={{ position: "fixed", inset: 0, zIndex: 1000, background: "var(--overlay)", display: "grid", placeItems: "center", padding: 16, animation: "ln-fade-in var(--dur-base) var(--ease-out)" }}
    >
      <div
        ref={panel}
        role="dialog"
        aria-modal="true"
        aria-labelledby={ids + "-t"}
        aria-describedby={description ? ids + "-d" : undefined}
        tabIndex={-1}
        style={{ width: "100%", maxWidth: size === "sm" ? "var(--modal-width-sm)" : "var(--modal-width)", maxHeight: "85vh", overflow: "auto", background: "var(--bg-elevated)", color: "var(--fg-1)", borderRadius: "var(--r-lg)", border: "1px solid var(--border-subtle)", boxShadow: "var(--shadow-xl)", outline: "none", fontFamily: "var(--font-body)" }}
      >
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12, padding: "20px 22px 0" }}>
          <div>
            <h2 id={ids + "-t"} style={{ margin: 0, font: "700 17px/1.3 var(--font-display)", color: "var(--fg-1)" }}>{title}</h2>
            {description && <p id={ids + "-d"} style={{ margin: "6px 0 0", font: "400 13px/1.55 var(--font-body)", color: "var(--fg-3)" }}>{description}</p>}
          </div>
          <button type="button" aria-label="Close dialog" title="Close" onClick={onClose} style={{ width: 32, height: 32, flexShrink: 0, display: "grid", placeItems: "center", border: 0, borderRadius: "var(--r-sm)", background: "transparent", color: "var(--fg-3)", cursor: "pointer" }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M18 6 6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
          </button>
        </div>
        <div style={{ padding: "18px 22px" }}>{children}</div>
        {footer && <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, padding: "14px 22px", borderTop: "1px solid var(--border-subtle)" }}>{footer}</div>}
      </div>
    </div>,
    document.body
  );
}
