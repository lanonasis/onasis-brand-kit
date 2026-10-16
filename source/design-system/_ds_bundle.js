/* @ds-bundle: {"format":4,"namespace":"LANOnasisDesignSystem_320289","components":[{"name":"Badge","sourcePath":"components/Badge/Badge.jsx"},{"name":"BrandMark","sourcePath":"components/BrandMark/BrandMark.jsx"},{"name":"Button","sourcePath":"components/Button/Button.jsx"},{"name":"Card","sourcePath":"components/Card/Card.jsx"},{"name":"Input","sourcePath":"components/Input/Input.jsx"},{"name":"L0Mark","sourcePath":"components/L0Mark/L0Mark.jsx"},{"name":"Modal","sourcePath":"components/Modal/Modal.jsx"},{"name":"Select","sourcePath":"components/Select/Select.jsx"}],"sourceHashes":{"components/Badge/Badge.jsx":"49ec7b74deaa","components/BrandMark/BrandMark.jsx":"b4371408f27a","components/Button/Button.jsx":"02d7ad1593c6","components/Card/Card.jsx":"0063ff3bf68a","components/Input/Input.jsx":"213c193227b1","components/L0Mark/L0Mark.jsx":"de1758ac7f7f","components/Modal/Modal.jsx":"93b4073e4bb3","components/Select/Select.jsx":"643343dc95df","site/pages-brand.jsx":"cfb9b432b06b","site/pages-build.jsx":"68563f2b461d","site/pages-foundations.jsx":"211862842182","site/shell.jsx":"429b6941999d","site/ui.jsx":"69f768b2d48b","ui_kits/dashboard/ChartCard.jsx":"63c38fecea25","ui_kits/dashboard/DashModal.jsx":"543374e4a25b","ui_kits/dashboard/KpiRow.jsx":"6cc8afba0343","ui_kits/dashboard/MemoriesTable.jsx":"c806644a815f","ui_kits/dashboard/SettingsPane.jsx":"b046e43527e2","ui_kits/dashboard/Sidebar.jsx":"a3f1fcc773aa","ui_kits/dashboard/TopBar.jsx":"e260a92138f1","ui_kits/web/CtaBlock.jsx":"6b96c0320ba0","ui_kits/web/EcosystemBand.jsx":"99d4c5e5d548","ui_kits/web/Footer.jsx":"5462d5b6c38d","ui_kits/web/Hero.jsx":"d89eef857a3a","ui_kits/web/Nav.jsx":"f22deb4f68ca","ui_kits/web/ProductGrid.jsx":"d7d1657f65ab","ui_kits/web/SplitFeature.jsx":"1e87e403f32e","ui_kits/web/TrustStrip.jsx":"0ff1e4948a66"},"inlinedExternals":[],"unexposedExports":[]} */

(() => {

const __ds_ns = (window.LANOnasisDesignSystem_320289 = window.LANOnasisDesignSystem_320289 || {});

const __ds_scope = {};

(__ds_ns.__errors = __ds_ns.__errors || []);

// components/Badge/Badge.jsx
try { (() => {
const TONES = {
  success: {
    bg: "#E5FBF5",
    fg: "#00785F",
    dot: "#00B791"
  },
  info: {
    bg: "#EEF2F8",
    fg: "#1B365D",
    dot: "#1B365D"
  },
  warning: {
    bg: "#FFF3DB",
    fg: "#8A6D00",
    dot: "#F5A623"
  },
  danger: {
    bg: "#FCE6E7",
    fg: "#B5292D",
    dot: "#E5484D"
  },
  neutral: {
    bg: "var(--ln-grey-100)",
    fg: "var(--ln-grey-700)",
    dot: "var(--ln-grey-500)"
  },
  gold: {
    bg: "var(--ln-gold-50)",
    fg: "var(--ln-gold-700)",
    dot: "var(--ln-gold)"
  }
};
function Badge({
  tone = "neutral",
  dot = true,
  children
}) {
  const t = TONES[tone] || TONES.neutral;
  return /*#__PURE__*/React.createElement("span", {
    style: {
      display: "inline-flex",
      alignItems: "center",
      gap: 6,
      padding: "4px 10px",
      borderRadius: "var(--r-pill)",
      fontFamily: "var(--font-body)",
      fontWeight: 600,
      fontSize: 12,
      background: t.bg,
      color: t.fg
    }
  }, dot && /*#__PURE__*/React.createElement("span", {
    style: {
      width: 6,
      height: 6,
      borderRadius: 999,
      background: t.dot,
      flexShrink: 0
    }
  }), children);
}
Object.assign(__ds_scope, { Badge });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/Badge/Badge.jsx", error: String((e && e.message) || e) }); }

// components/BrandMark/BrandMark.jsx
try { (() => {
/*
 * Theme-adaptive brand mark.
 *
 * ── Why this is a component and not copy-paste SVG markup ──────────────
 *
 * Pasting the raw SVG into a .tsx/.jsx file is the single most common way
 * this mark gets scrambled. JSX requires camelCase DOM attributes, so
 * `stroke-width`, `stroke-linecap`, `fill-rule` and `clip-path` are all
 * silently dropped or ignored by React. Strokes then fall back to the SVG
 * default width of 1, the gear/globe linework collapses, and the mark
 * renders thin and mangled. Import this component instead — or, outside
 * React, use assets/logos/brandmark-icon.svg, which is plain markup.
 *
 * ── Why there are no IDs, <defs> or <mask> ─────────────────────────────
 *
 * The globe reads as an aperture in the gear. The obvious implementation
 * is a <mask>, but masks need an id, and ids are the second scrambling
 * vector: they collide when the mark renders more than once on a page,
 * they mismatch between server and client under SSR hydration, and SVGO
 * (via `cleanupIds`) will happily renumber or drop them during a build.
 *
 * So the aperture is cut geometrically instead: the gear outline and the
 * globe circle are one compound path with fill-rule="evenodd", which makes
 * the overlap a genuine hole. No id, no defs, no mask — nothing for a
 * bundler, optimiser or sprite system to rewrite. It also means the mark
 * works in React 16/17 (no useId dependency) and ports to Vue unchanged.
 *
 * ── Disappearing-logo failure modes this guards against ────────────────
 *
 *   1. Ink-only artwork on a matching surface (navy ink on a navy hero).
 *   2. A self-contained chip on a near-identical surface — the navy
 *      app-icon tile (#1B365D) on navy-deep (#0D1C2F) has almost no edge
 *      contrast and reads as a barely-visible smudge.
 *
 * `icon` and `monogram` are ink-only vector and swap ink with `theme`.
 * Geometry is transcribed from assets/logos/icon-only.svg — same viewBox,
 * same path data, same stroke weights, all three circuit nodes, green
 * accent dot intact. Only the ink colour is parameterised.
 *
 * `tile` keeps the navy-chip raster for contexts that require a chip
 * (favicons, app stores, OS launchers, circular social avatars).
 * `wordmark` is the full ink-only lockup and swaps navy-ink / white-ink.
 */

const INK = {
  light: "#1B365D",
  dark: "#FFFFFF"
};
const ACCENT = "#00D4AA";
const RASTER = {
  wordmark: {
    light: "wordmark-lockup-on-light.png",
    dark: "wordmark-lockup-on-dark.png"
  },
  tile: {
    light: "app-icon-256.png",
    dark: "app-icon-256.png"
  }
};

/* Letter-L paths — shared by icon and monogram. Verbatim from icon-only.svg. */
const L_PATHS = ["M60 60H130V350H60z", "M60 310H225V380H60zM45 60H145V82H45z", "M205 350H225V380H205z"];

/*
 * Gear outline followed by the globe circle expressed as two arcs, as a
 * single compound path. With fill-rule="evenodd" the circle becomes a hole.
 * Arc form avoids <circle>, so the whole aperture survives as one `d`.
 */
const GEAR_WITH_APERTURE = "M 0,-95 L 18,-88 L 35,-105 L 55,-95 L 62,-75 L 85,-70 L 88,-48 L 72,-32 L 80,-10 L 65,5 L 42,0 L 30,20 L 8,20 L -5,5 L -28,10 L -45,-8 L -38,-30 L -55,-48 L -52,-70 L -30,-78 L -22,-98 Z " + "M 0,-87 A 52,52 0 1,0 0,17 A 52,52 0 1,0 0,-87 Z";
const GRIDLINES = "M0-87 0 17M-52-35 52-35M-44-55Q0-62 44-55M-44-15Q0-8 44-15M-20-80Q0-84 20-80M-20 10Q0 14 20 10";

/* Circuit nodes: [cx, cy, connector-path] — verbatim from icon-only.svg. */
const NODES = [[100, -35, "M88-35 100-35"], [72, -112, "M55-95 72-112"], [72, 42, "M55 22 72 42"]];
function IconGlyph({
  ink,
  size,
  alt
}) {
  return /*#__PURE__*/React.createElement("svg", {
    viewBox: "0 0 500 500",
    width: size,
    height: size,
    role: "img",
    "aria-label": alt,
    style: {
      display: "block"
    }
  }, /*#__PURE__*/React.createElement("g", {
    fill: ink
  }, L_PATHS.map(d => /*#__PURE__*/React.createElement("path", {
    key: d,
    d: d
  }))), /*#__PURE__*/React.createElement("path", {
    stroke: ink,
    strokeWidth: "8",
    strokeLinecap: "round",
    d: "M255 70 255 390"
  }), /*#__PURE__*/React.createElement("g", {
    transform: "translate(370, 220)"
  }, /*#__PURE__*/React.createElement("path", {
    d: GEAR_WITH_APERTURE,
    fill: ink,
    fillRule: "evenodd"
  }), /*#__PURE__*/React.createElement("g", {
    stroke: ink,
    strokeWidth: "2.5",
    fill: "none"
  }, /*#__PURE__*/React.createElement("circle", {
    cy: "-35",
    r: "52"
  }), /*#__PURE__*/React.createElement("path", {
    d: GRIDLINES
  })), /*#__PURE__*/React.createElement("g", {
    fill: ink
  }, NODES.map(([cx, cy, d]) => /*#__PURE__*/React.createElement(React.Fragment, {
    key: d
  }, /*#__PURE__*/React.createElement("circle", {
    cx: cx,
    cy: cy,
    r: "8"
  }), /*#__PURE__*/React.createElement("path", {
    stroke: ink,
    strokeWidth: "3",
    d: d
  }))))), /*#__PURE__*/React.createElement("circle", {
    cx: "455",
    cy: "68",
    r: "28",
    fill: ACCENT
  }));
}

/* Monogram: the serif L alone, viewBox cropped to its bounds. */
function MonogramGlyph({
  ink,
  size,
  alt
}) {
  return /*#__PURE__*/React.createElement("svg", {
    viewBox: "40 55 190 330",
    width: size,
    height: size,
    role: "img",
    "aria-label": alt,
    style: {
      display: "block"
    }
  }, /*#__PURE__*/React.createElement("g", {
    fill: ink
  }, L_PATHS.map(d => /*#__PURE__*/React.createElement("path", {
    key: d,
    d: d
  }))));
}
function BrandMark({
  variant = "icon",
  theme = "light",
  size = 32,
  basePath = "assets/logos/",
  className = "",
  style = {},
  alt = "LAN Onasis"
}) {
  const ink = INK[theme] || INK.light;
  if (variant === "icon" || variant === "monogram") {
    const Glyph = variant === "icon" ? IconGlyph : MonogramGlyph;
    return /*#__PURE__*/React.createElement("span", {
      className: className,
      style: {
        display: "inline-block",
        lineHeight: 0,
        ...style
      }
    }, /*#__PURE__*/React.createElement(Glyph, {
      ink: ink,
      size: size,
      alt: alt
    }));
  }
  const file = (RASTER[variant] || RASTER.tile)[theme];
  return /*#__PURE__*/React.createElement("img", {
    src: basePath + file,
    alt: alt,
    className: className,
    style: {
      height: size,
      width: variant === "wordmark" ? size / 0.62 : size,
      objectFit: "contain",
      display: "block",
      ...style
    }
  });
}
Object.assign(__ds_scope, { BrandMark });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/BrandMark/BrandMark.jsx", error: String((e && e.message) || e) }); }

// components/Button/Button.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/*
 * Variants: primary = corporate gold, accent = product green, secondary = navy,
 * outline / ghost use semantic tokens so they follow light/dark theme,
 * danger = destructive. `loading` disables the button and shows a spinner
 * (merged from the TanStack library).
 */
const VARIANTS = {
  primary: {
    background: "var(--ln-gold)",
    color: "var(--ln-navy-deep)"
  },
  accent: {
    background: "var(--ln-green)",
    color: "var(--ln-navy-deep)"
  },
  secondary: {
    background: "var(--ln-navy)",
    color: "var(--ln-white)"
  },
  outline: {
    background: "var(--bg-elevated)",
    color: "var(--fg-1)",
    borderColor: "var(--border-default)"
  },
  ghost: {
    background: "transparent",
    color: "var(--fg-1)"
  },
  danger: {
    background: "var(--status-danger)",
    color: "var(--ln-white)"
  }
};
const SIZES = {
  sm: {
    minHeight: "var(--control-sm)",
    padding: "0 12px",
    fontSize: 12
  },
  md: {
    minHeight: "var(--control-md)",
    padding: "0 16px",
    fontSize: 14
  },
  lg: {
    minHeight: "var(--control-lg)",
    padding: "0 24px",
    fontSize: 15
  },
  icon: {
    width: "var(--control-md)",
    height: "var(--control-md)",
    padding: 0,
    fontSize: 14
  }
};
function Spinner() {
  return /*#__PURE__*/React.createElement("svg", {
    width: "14",
    height: "14",
    viewBox: "0 0 24 24",
    fill: "none",
    "aria-hidden": "true",
    style: {
      animation: "ln-spin 1s linear infinite",
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement("circle", {
    cx: "12",
    cy: "12",
    r: "9",
    stroke: "currentColor",
    strokeOpacity: "0.3",
    strokeWidth: "3"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M21 12a9 9 0 0 0-9-9",
    stroke: "currentColor",
    strokeWidth: "3",
    strokeLinecap: "round"
  }));
}
function Button({
  variant = "primary",
  size = "md",
  loading = false,
  disabled,
  type = "button",
  children,
  style,
  ...rest
}) {
  const [hover, setHover] = React.useState(false);
  const off = disabled || loading;
  const v = VARIANTS[variant] || VARIANTS.primary;
  return /*#__PURE__*/React.createElement("button", _extends({
    type: type,
    disabled: off,
    "aria-busy": loading || undefined,
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    style: {
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
      ...(hover && !off && variant === "ghost" ? {
        background: "var(--bg-muted)"
      } : null),
      ...style
    }
  }, rest), loading && /*#__PURE__*/React.createElement(Spinner, null), children);
}
Object.assign(__ds_scope, { Button });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/Button/Button.jsx", error: String((e && e.message) || e) }); }

// components/Card/Card.jsx
try { (() => {
function Card({
  eyebrow,
  title,
  body,
  accent = "gold",
  footer
}) {
  const [hover, setHover] = React.useState(false);
  const accentColor = accent === "green" ? "var(--ln-green-500)" : "var(--ln-gold-600)";
  return /*#__PURE__*/React.createElement("div", {
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    style: {
      background: "#fff",
      border: "1px solid var(--border-subtle)",
      borderRadius: "var(--r-lg)",
      padding: "20px 22px",
      fontFamily: "var(--font-body)",
      boxShadow: hover ? "0 12px 32px rgba(8,18,31,.10), 0 4px 8px rgba(8,18,31,.04)" : "0 1px 3px rgba(8,18,31,.05)",
      transform: hover ? "translateY(-2px)" : "none",
      transition: "all .2s var(--ease-out)",
      maxWidth: 320
    }
  }, eyebrow && /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      fontWeight: 600,
      letterSpacing: "0.12em",
      textTransform: "uppercase",
      color: accentColor,
      marginBottom: 6
    }
  }, eyebrow), title && /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--font-display)",
      fontWeight: 700,
      fontSize: 18,
      color: "var(--ln-navy)",
      marginBottom: 8
    }
  }, title), body && /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 13,
      lineHeight: 1.6,
      color: "var(--fg-2)",
      margin: 0
    }
  }, body), footer && /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 14,
      fontSize: 12,
      color: "var(--fg-3)"
    }
  }, footer));
}
Object.assign(__ds_scope, { Card });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/Card/Card.jsx", error: String((e && e.message) || e) }); }

// components/Input/Input.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/* Semantic text field. Label and help/error text belong to the consuming form;
   use variant="error" with aria-describedby pointing at the error message. */
function Input({
  variant = "default",
  size = "md",
  disabled,
  style,
  ...rest
}) {
  const [focus, setFocus] = React.useState(false);
  const err = variant === "error";
  return /*#__PURE__*/React.createElement("input", _extends({
    disabled: disabled,
    "aria-invalid": err || undefined,
    onFocus: e => {
      setFocus(true);
      rest.onFocus && rest.onFocus(e);
    },
    onBlur: e => {
      setFocus(false);
      rest.onBlur && rest.onBlur(e);
    },
    style: {
      width: "100%",
      minHeight: size === "sm" ? "var(--control-sm)" : "var(--control-md)",
      padding: "0 12px",
      borderRadius: "var(--r-md)",
      border: `1px solid ${err ? "var(--status-danger)" : focus ? "var(--border-focus)" : "var(--border-default)"}`,
      boxShadow: focus ? err ? "0 0 0 4px rgba(229,72,77,.16)" : "var(--glow-green)" : "none",
      background: "var(--bg-elevated)",
      color: "var(--fg-1)",
      font: "400 14px/1.5 var(--font-body)",
      outline: "none",
      opacity: disabled ? "var(--disabled-opacity)" : 1,
      cursor: disabled ? "not-allowed" : "text",
      transition: "border-color var(--dur-fast), box-shadow var(--dur-fast)",
      boxSizing: "border-box",
      ...style
    }
  }, rest));
}
Object.assign(__ds_scope, { Input });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/Input/Input.jsx", error: String((e && e.message) || e) }); }

// components/L0Mark/L0Mark.jsx
try { (() => {
/*
 * L0 / LZero product mark — "L" + "0" as 24px line art.
 *
 * Ported from LanoLogo.tsx (ai-brainbox, in production on
 * lzero-aether-memmory.vercel.app). Two things were reconciled:
 *
 * 1. That file exports two near-duplicate glyphs — `LanoLogo` (ellipse
 *    zero, cy=10) and `L0Logo` (circle zero, cy=13, plus a meridian
 *    stroke). Both are live, so both survive here as `variant`, rather
 *    than unilaterally picking one. `circle` is the default: its zero is
 *    optically centred against the L's descent, and its meridian echoes
 *    the globe meridian in the parent BrandMark, which the ellipse form
 *    does not.
 *
 * 2. The `cn()` / `@/lib/utils` dependency is dropped — this system has
 *    no class-merging utility and the component needs none.
 *
 * Inking is `currentColor` throughout, so it inherits from its parent and
 * needs no `theme` prop, unlike BrandMark. Set `color` on the container.
 *
 * Scale: authored at 24 with stroke-width 2, matching the Lucide stroke
 * convention this system uses for UI icons. Legible 16–40px. Above ~40 the
 * 2px stroke reads thin next to the brand's other marks — use BrandMark.
 */

const ACCENT = "#00D4AA";
function L0Mark({
  variant = "circle",
  size = 24,
  meridian = true,
  accent = false,
  className = "",
  style = {},
  alt = "LZero"
}) {
  const isCircle = variant === "circle";
  return /*#__PURE__*/React.createElement("svg", {
    viewBox: "0 0 24 24",
    width: size,
    height: size,
    fill: "none",
    role: "img",
    "aria-label": alt,
    className: className,
    style: {
      display: "block",
      color: "currentColor",
      ...style
    }
  }, /*#__PURE__*/React.createElement("path", {
    d: isCircle ? "M6 3v15h8" : "M4 3v14h8",
    stroke: "currentColor",
    strokeWidth: "2",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }), isCircle ? /*#__PURE__*/React.createElement("circle", {
    cx: "16.5",
    cy: "13",
    r: "4.5",
    stroke: "currentColor",
    strokeWidth: "2",
    fill: "none"
  }) : /*#__PURE__*/React.createElement("ellipse", {
    cx: "16",
    cy: "10",
    rx: "4",
    ry: "5.5",
    stroke: "currentColor",
    strokeWidth: "2",
    fill: "none"
  }), isCircle && meridian && /*#__PURE__*/React.createElement("path", {
    d: "M16.5 9v8",
    stroke: accent ? ACCENT : "currentColor",
    strokeWidth: "1.5",
    opacity: accent ? 1 : 0.6
  }));
}
Object.assign(__ds_scope, { L0Mark });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/L0Mark/L0Mark.jsx", error: String((e && e.message) || e) }); }

// components/Modal/Modal.jsx
try { (() => {
/*
 * Accessible dialog without a Radix dependency: focus moves in on open,
 * Tab is trapped inside, Escape and scrim-click close, focus is restored
 * to the opener on close, background scroll is locked.
 */
const FOCUSABLE = 'a[href],button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])';
function Modal({
  open = true,
  title,
  description,
  onClose,
  footer,
  size = "md",
  children
}) {
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
    const onKey = e => {
      if (e.key === "Escape") {
        e.stopPropagation();
        onClose && onClose();
        return;
      }
      if (e.key !== "Tab" || !node) return;
      const items = [...node.querySelectorAll(FOCUSABLE)];
      if (!items.length) {
        e.preventDefault();
        return;
      }
      const a = items[0],
        z = items[items.length - 1];
      if (e.shiftKey && document.activeElement === a) {
        e.preventDefault();
        z.focus();
      } else if (!e.shiftKey && document.activeElement === z) {
        e.preventDefault();
        a.focus();
      }
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
  return ReactDOM.createPortal(/*#__PURE__*/React.createElement("div", {
    onMouseDown: e => {
      if (e.target === e.currentTarget && onClose) onClose();
    },
    style: {
      position: "fixed",
      inset: 0,
      zIndex: 1000,
      background: "var(--overlay)",
      display: "grid",
      placeItems: "center",
      padding: 16,
      animation: "ln-fade-in var(--dur-base) var(--ease-out)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    ref: panel,
    role: "dialog",
    "aria-modal": "true",
    "aria-labelledby": ids + "-t",
    "aria-describedby": description ? ids + "-d" : undefined,
    tabIndex: -1,
    style: {
      width: "100%",
      maxWidth: size === "sm" ? "var(--modal-width-sm)" : "var(--modal-width)",
      maxHeight: "85vh",
      overflow: "auto",
      background: "var(--bg-elevated)",
      color: "var(--fg-1)",
      borderRadius: "var(--r-lg)",
      border: "1px solid var(--border-subtle)",
      boxShadow: "var(--shadow-xl)",
      outline: "none",
      fontFamily: "var(--font-body)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "flex-start",
      justifyContent: "space-between",
      gap: 12,
      padding: "20px 22px 0"
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h2", {
    id: ids + "-t",
    style: {
      margin: 0,
      font: "700 17px/1.3 var(--font-display)",
      color: "var(--fg-1)"
    }
  }, title), description && /*#__PURE__*/React.createElement("p", {
    id: ids + "-d",
    style: {
      margin: "6px 0 0",
      font: "400 13px/1.55 var(--font-body)",
      color: "var(--fg-3)"
    }
  }, description)), /*#__PURE__*/React.createElement("button", {
    type: "button",
    "aria-label": "Close dialog",
    title: "Close",
    onClick: onClose,
    style: {
      width: 32,
      height: 32,
      flexShrink: 0,
      display: "grid",
      placeItems: "center",
      border: 0,
      borderRadius: "var(--r-sm)",
      background: "transparent",
      color: "var(--fg-3)",
      cursor: "pointer"
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: "16",
    height: "16",
    viewBox: "0 0 24 24",
    fill: "none",
    "aria-hidden": "true"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M18 6 6 18M6 6l12 12",
    stroke: "currentColor",
    strokeWidth: "2",
    strokeLinecap: "round"
  })))), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "18px 22px"
    }
  }, children), footer && /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "flex-end",
      gap: 10,
      padding: "14px 22px",
      borderTop: "1px solid var(--border-subtle)"
    }
  }, footer))), document.body);
}
Object.assign(__ds_scope, { Modal });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/Modal/Modal.jsx", error: String((e && e.message) || e) }); }

// components/Select/Select.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/* Native select styled to match Input. Native keeps full keyboard and screen-reader behaviour. */
function Select({
  variant = "default",
  size = "md",
  disabled,
  style,
  children,
  ...rest
}) {
  const [focus, setFocus] = React.useState(false);
  const err = variant === "error";
  return /*#__PURE__*/React.createElement("span", {
    style: {
      position: "relative",
      display: "block",
      width: "100%"
    }
  }, /*#__PURE__*/React.createElement("select", _extends({
    disabled: disabled,
    "aria-invalid": err || undefined,
    onFocus: e => {
      setFocus(true);
      rest.onFocus && rest.onFocus(e);
    },
    onBlur: e => {
      setFocus(false);
      rest.onBlur && rest.onBlur(e);
    },
    style: {
      width: "100%",
      minHeight: size === "sm" ? "var(--control-sm)" : "var(--control-md)",
      padding: "0 36px 0 12px",
      appearance: "none",
      WebkitAppearance: "none",
      borderRadius: "var(--r-md)",
      border: `1px solid ${err ? "var(--status-danger)" : focus ? "var(--border-focus)" : "var(--border-default)"}`,
      boxShadow: focus ? err ? "0 0 0 4px rgba(229,72,77,.16)" : "var(--glow-green)" : "none",
      background: "var(--bg-elevated)",
      color: "var(--fg-1)",
      font: "400 14px/1.5 var(--font-body)",
      outline: "none",
      opacity: disabled ? "var(--disabled-opacity)" : 1,
      cursor: disabled ? "not-allowed" : "pointer",
      boxSizing: "border-box",
      ...style
    }
  }, rest), children), /*#__PURE__*/React.createElement("svg", {
    width: "14",
    height: "14",
    viewBox: "0 0 24 24",
    fill: "none",
    "aria-hidden": "true",
    style: {
      position: "absolute",
      right: 12,
      top: "50%",
      transform: "translateY(-50%)",
      pointerEvents: "none",
      color: "var(--fg-3)"
    }
  }, /*#__PURE__*/React.createElement("path", {
    d: "m6 9 6 6 6-6",
    stroke: "currentColor",
    strokeWidth: "2",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  })));
}
Object.assign(__ds_scope, { Select });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/Select/Select.jsx", error: String((e && e.message) || e) }); }

// site/pages-brand.jsx
try { (() => {
/* Overview · Brand · Channels */

/* brand-mark.png carries its own textured-navy field. On a flat navy panel a hard
   seam shows, so it is feathered into the surface with a radial mask. */
const FEATHER = {
  WebkitMaskImage: "radial-gradient(closest-side, #000 80%, transparent 100%)",
  maskImage: "radial-gradient(closest-side, #000 80%, transparent 100%)"
};
function Overview() {
  const Button = ds("Button");
  const BrandMark = ds("BrandMark");
  const tiles = [{
    path: "/brand",
    t: "Brand",
    d: "Three marks, two identities, and which to use where.",
    art: /*#__PURE__*/React.createElement("img", {
      src: "assets/logos/app-icon-128.png",
      width: "56",
      height: "56",
      alt: "",
      style: {
        borderRadius: 12
      }
    })
  }, {
    path: "/colors",
    t: "Colors",
    d: "Navy for trust, gold for distinction, green for momentum.",
    art: ["--ln-navy-deep", "--ln-navy", "--ln-gold", "--ln-green"].map(v => /*#__PURE__*/React.createElement("i", {
      key: v,
      style: {
        width: 34,
        height: 34,
        borderRadius: 8,
        background: `var(${v})`
      }
    }))
  }, {
    path: "/typography",
    t: "Typography",
    d: "A brand serif for the corporate voice, clean sans for product.",
    art: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("span", {
      style: {
        font: "600 40px var(--font-brand)",
        color: "var(--ln-gold-600)"
      }
    }, "Aa"), /*#__PURE__*/React.createElement("span", {
      style: {
        font: "700 40px var(--font-display)",
        color: "var(--fg-1)"
      }
    }, "Aa"))
  }, {
    path: "/components",
    t: "Components",
    d: "Eight production primitives, live and copyable.",
    art: /*#__PURE__*/React.createElement("div", {
      className: "row",
      style: {
        justifyContent: "center"
      }
    }, /*#__PURE__*/React.createElement(Button, {
      size: "sm",
      variant: "accent"
    }, "Create"), /*#__PURE__*/React.createElement(Button, {
      size: "sm",
      variant: "outline"
    }, "Cancel"))
  }, {
    path: "/patterns",
    t: "Patterns",
    d: "Full marketing and dashboard kits built from the system.",
    art: /*#__PURE__*/React.createElement(Icon, {
      name: "panels-top-left",
      size: 34
    })
  }, {
    path: "/channels",
    t: "Channels",
    d: "Email, web and social — sizes and identity per handle.",
    art: /*#__PURE__*/React.createElement(Icon, {
      name: "at-sign",
      size: 34
    })
  }];
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "hero-o"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "eb"
  }, "LAN Onasis design system"), /*#__PURE__*/React.createElement("h1", null, "One identity.", /*#__PURE__*/React.createElement("br", null), "Every experience."), /*#__PURE__*/React.createElement("p", null, "The shared language for everything Lan Onasis ships \u2014 from the corporate wreath on a press release to a status pill in the dashboard."), /*#__PURE__*/React.createElement("div", {
    className: "acts"
  }, /*#__PURE__*/React.createElement(Button, {
    variant: "secondary",
    onClick: () => go("/components")
  }, "Browse components ", /*#__PURE__*/React.createElement(Icon, {
    name: "arrow-right",
    size: 15
  })), /*#__PURE__*/React.createElement(Button, {
    variant: "outline",
    onClick: () => go("/brand")
  }, "Brand guidance"))), /*#__PURE__*/React.createElement("div", {
    className: "ident",
    "aria-label": "The two brand expressions"
  }, /*#__PURE__*/React.createElement("div", {
    className: "corp"
  }, /*#__PURE__*/React.createElement("span", {
    className: "lab"
  }, "01 / CORPORATE"), /*#__PURE__*/React.createElement("div", {
    className: "mid"
  }, /*#__PURE__*/React.createElement("img", {
    src: "assets/logos/brand-mark.png",
    alt: "LAN Onasis gold corporate wreath",
    style: FEATHER
  })), /*#__PURE__*/React.createElement("div", {
    className: "bot"
  }, /*#__PURE__*/React.createElement("span", null, "Navy deep \xD7 Gold"), /*#__PURE__*/React.createElement("span", null, "Formal"))), /*#__PURE__*/React.createElement("div", {
    className: "prod"
  }, /*#__PURE__*/React.createElement("span", {
    className: "lab"
  }, "02 / PRODUCT"), /*#__PURE__*/React.createElement("div", {
    className: "mid"
  }, /*#__PURE__*/React.createElement("div", {
    className: "lock"
  }, /*#__PURE__*/React.createElement(BrandMark, {
    variant: "icon",
    theme: "dark",
    size: 56
  }), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("b", null, "LAN Onasis"), /*#__PURE__*/React.createElement("small", null, "Intelligence, connected.")))), /*#__PURE__*/React.createElement("div", {
    className: "bot"
  }, /*#__PURE__*/React.createElement("span", null, "Navy \xD7 Green"), /*#__PURE__*/React.createElement("span", null, "Efficient"))))), /*#__PURE__*/React.createElement("div", {
    className: "stats"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("b", null, "2"), /*#__PURE__*/React.createElement("span", null, "Brand expressions")), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("b", null, "4"), /*#__PURE__*/React.createElement("span", null, "Type families, self-hosted")), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("b", null, "8"), /*#__PURE__*/React.createElement("span", null, "Exported components")), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("b", null, "6"), /*#__PURE__*/React.createElement("span", null, "Public channels"))), /*#__PURE__*/React.createElement(Sec, {
    title: "Explore"
  }, /*#__PURE__*/React.createElement("div", {
    className: "tiles"
  }, tiles.map(x => /*#__PURE__*/React.createElement("a", {
    key: x.path,
    className: "tile",
    href: "#" + x.path
  }, /*#__PURE__*/React.createElement("div", {
    className: "art"
  }, x.art), /*#__PURE__*/React.createElement("h3", null, x.t, /*#__PURE__*/React.createElement(Icon, {
    name: "arrow-up-right",
    size: 16
  })), /*#__PURE__*/React.createElement("p", null, x.d))))), /*#__PURE__*/React.createElement(Sec, {
    title: "Quick start",
    lead: "Link the stylesheet once, then load the bundle. Every component reads its colours, type and spacing from the tokens."
  }, /*#__PURE__*/React.createElement(Code, {
    code: `<link rel="stylesheet" href="styles.css">\n<script src="_ds_bundle.js"></script>\n\n<script>\n  const { Button, Badge, BrandMark } = window.${NS};\n</script>`
  })));
}
function Brand() {
  const BrandMark = ds("BrandMark");
  const L0Mark = ds("L0Mark");
  const assets = [{
    src: "assets/logos/brand-mark.png",
    name: "Corporate wreath",
    meta: "PNG · 1024² · on navy",
    bg: "var(--surface-corporate)",
    fill: true
  }, {
    src: "assets/logos/lan-onasis-light-logo.png",
    name: "Corporate wreath · light",
    meta: "PNG · 1024² · on white",
    bg: "#FFFFFF",
    fill: true
  }, {
    src: "assets/logos/brand-mark-tagline.png",
    name: "Tagline lockup",
    meta: "PNG · Future · Strategy · Tech",
    bg: "var(--surface-corporate)",
    fill: true
  }, {
    src: "assets/logos/app-icon-512.png",
    name: "Product app icon",
    meta: "PNG · 512² · chip",
    bg: "var(--bg-subtle)"
  }, {
    src: "assets/logos/brandmark-icon.svg",
    name: "Product icon · vector",
    meta: "SVG · currentColor · id-free",
    bg: "var(--bg-subtle)",
    svg: true
  }, {
    src: "assets/imagery/marketing-hero.png",
    name: "Marketing hero",
    meta: "PNG · circuit + globe",
    bg: "var(--surface-corporate)",
    fill: true
  }];
  return /*#__PURE__*/React.createElement(Page, {
    eyebrow: "Brand",
    title: "Marks & identity",
    desc: "Three marks are in use. They aren't interchangeable \u2014 choosing the wrong one is the most common source of brand drift."
  }, /*#__PURE__*/React.createElement(Sec, {
    title: "Mark hierarchy"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "tier"
  }, /*#__PURE__*/React.createElement("div", {
    className: "pv",
    style: {
      background: "var(--surface-corporate)"
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: "assets/logos/brand-mark.png",
    alt: "",
    style: {
      height: "130%",
      ...FEATHER
    }
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h3", null, "Corporate \u2014 the wreath"), /*#__PURE__*/React.createElement("p", null, "Gold spirograph wreath with the serif wordmark. Customers, partners and press: social profiles and covers, email signatures, decks, signage. Pair with ", /*#__PURE__*/React.createElement("code", null, "--ln-gold"), " and ", /*#__PURE__*/React.createElement("code", null, "--font-brand"), ". On white surfaces use the navy-ink light version."))), /*#__PURE__*/React.createElement("div", {
    className: "tier"
  }, /*#__PURE__*/React.createElement("div", {
    className: "pv",
    style: {
      background: "var(--bg-subtle)",
      display: "flex",
      gap: 22,
      justifyContent: "center"
    }
  }, /*#__PURE__*/React.createElement(BrandMark, {
    variant: "icon",
    theme: "light",
    size: 56
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      background: "var(--ln-navy-deep)",
      padding: 12,
      borderRadius: 12,
      display: "inline-flex"
    }
  }, /*#__PURE__*/React.createElement(BrandMark, {
    variant: "icon",
    theme: "dark",
    size: 44
  }))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h3", null, "Product \u2014 the app icon"), /*#__PURE__*/React.createElement("p", null, "Serif L, divider and gear-globe with the green accent dot. Inside the product: app chrome, favicons, launchers. Use ", /*#__PURE__*/React.createElement("code", null, "BrandMark"), " \u2014 its ink swaps with ", /*#__PURE__*/React.createElement("code", null, "theme"), ", so it never vanishes against navy."))), /*#__PURE__*/React.createElement("div", {
    className: "tier"
  }, /*#__PURE__*/React.createElement("div", {
    className: "pv",
    style: {
      background: "var(--bg-subtle)",
      color: "var(--fg-1)",
      display: "flex",
      gap: 22,
      justifyContent: "center"
    }
  }, /*#__PURE__*/React.createElement(L0Mark, {
    size: 48,
    accent: true
  }), /*#__PURE__*/React.createElement(L0Mark, {
    size: 32
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h3", null, "Sub-product \u2014 L0 / LZero"), /*#__PURE__*/React.createElement("p", null, "24px line art, \u201CL\u201D + \u201C0\u201D with a meridian. LZero surfaces only. Inherits ", /*#__PURE__*/React.createElement("code", null, "currentColor"), ". Its source export is named ", /*#__PURE__*/React.createElement("code", null, "LanoLogo"), " \u2014 confirm whether it's the LZero mark before it spreads."))))), /*#__PURE__*/React.createElement(Sec, {
    title: "Approved assets",
    lead: "Original artwork only \u2014 never redraw, recolour or re-letter a mark."
  }, /*#__PURE__*/React.createElement("div", {
    className: "cols-3"
  }, assets.map(a => /*#__PURE__*/React.createElement("div", {
    key: a.name,
    className: "frame asset"
  }, /*#__PURE__*/React.createElement("div", {
    className: "pv",
    style: {
      background: a.bg,
      color: "var(--fg-1)"
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: a.src,
    alt: a.name,
    style: a.fill ? {
      width: "100%",
      height: "100%",
      objectFit: "cover",
      ...(a.bg.includes("corporate") && a.src.includes("brand-mark") ? FEATHER : {})
    } : {
      width: a.svg ? 96 : 110,
      height: "auto"
    }
  })), /*#__PURE__*/React.createElement("div", {
    className: "meta"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("b", null, a.name), /*#__PURE__*/React.createElement("span", null, a.meta)), /*#__PURE__*/React.createElement("a", {
    className: "icon-btn",
    href: a.src,
    download: true,
    "aria-label": "Download " + a.name,
    title: "Download original"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "download",
    size: 16
  }))))))), /*#__PURE__*/React.createElement(Sec, {
    title: "Usage rules"
  }, /*#__PURE__*/React.createElement("ul", {
    className: "rules"
  }, /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("b", null, "Clear space"), " \u2014 at least the height of the \u201CL\u201D on every side."), /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("b", null, "Minimum size"), " \u2014 wreath 120px wide on screen; product icon 16px; below 24px use the tile."), /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("b", null, "Circular crops"), " (social avatars) \u2014 use the navy tile or the wreath on its own field, never ink-only marks."), /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("b", null, "Gold"), " is ", /*#__PURE__*/React.createElement("code", null, "#C9A24B"), ", sampled from the real wreath. The legacy ", /*#__PURE__*/React.createElement("code", null, "#FFD700"), " doesn't appear in the artwork."))), /*#__PURE__*/React.createElement(Sec, {
    title: "Do not use"
  }, /*#__PURE__*/React.createElement("details", {
    className: "dont"
  }, /*#__PURE__*/React.createElement("summary", null, "Seven files in circulation that must not ship"), /*#__PURE__*/React.createElement("ul", null, /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("code", null, "brand-mark-light.png"), ", ", /*#__PURE__*/React.createElement("code", null, "brand-mark-dark.png"), " (also as ", /*#__PURE__*/React.createElement("code", null, "IMG_6961.png"), ", ", /*#__PURE__*/React.createElement("code", null, "IMG_8195.jpeg"), ") \u2014 tiled with logo-generator watermarks."), /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("code", null, "logo-horizontal.svg"), ", ", /*#__PURE__*/React.createElement("code", null, "logo-stacked.svg"), ", ", /*#__PURE__*/React.createElement("code", null, "logo-inverse.svg"), ", ", /*#__PURE__*/React.createElement("code", null, "wordmark-only.svg"), " \u2014 placeholder stubs: a rectangle and Arial text."), /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("code", null, "email-signature-template.svg"), ", ", /*#__PURE__*/React.createElement("code", null, "brand-guidelines.svg"), ", ", /*#__PURE__*/React.createElement("code", null, "brand-applications.svg"), " \u2014 empty image shells; the artwork only exists on the previous host."))), /*#__PURE__*/React.createElement("p", {
    className: "cap",
    style: {
      marginTop: 12
    }
  }, "Full classification in ", /*#__PURE__*/React.createElement("code", null, "ASSET_MANIFEST.md"), ".")));
}
function Channels() {
  const Badge = ds("Badge");
  const rows = [["info@lanonasis.com", "Email signature", "—", "corp", "Wordmark", "absent"], ["www.lanonasis.com", "Marketing site", "Responsive", "corp", "Wordmark", "partial"], ["www.lanonasis.com", "Favicon set", "16 → 512", "prod", "Tile", "partial"], ["@lanonasis · Instagram", "Post · Story", "1080² · 1080×1920", "corp", "Wordmark", "absent"], ["facebook.com/lanonasis", "Cover · Post", "820×312 · 1200×630", "corp", "Wordmark", "absent"], ["company/lan-onasis", "Cover · Post", "1128×191 · 1200×627", "corp", "Wordmark", "absent"], ["@lanonasis · X", "Header · Card", "1500×500 · 1200×675", "corp", "Wordmark", "absent"], ["All social", "Profile avatar", "400×400", "corp", "Tile — circular", "covered"], ["github.com/lanonasis", "Social preview", "1280×640", "prod", "Icon", "absent"]];
  const tone = {
    covered: "success",
    partial: "warning",
    absent: "danger"
  };
  return /*#__PURE__*/React.createElement(Page, {
    eyebrow: "Guidance",
    title: "Channels",
    desc: "Every public Lan Onasis handle, the identity it carries, its exact sizes, and which mark is safe there."
  }, /*#__PURE__*/React.createElement(Sec, {
    title: "Namespace map"
  }, /*#__PURE__*/React.createElement("div", {
    className: "tbl-wrap"
  }, /*#__PURE__*/React.createElement("table", {
    className: "tbl"
  }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", null, "Handle"), /*#__PURE__*/React.createElement("th", null, "Surface"), /*#__PURE__*/React.createElement("th", null, "Size"), /*#__PURE__*/React.createElement("th", null, "Identity"), /*#__PURE__*/React.createElement("th", null, "Mark"), /*#__PURE__*/React.createElement("th", null, "Status"))), /*#__PURE__*/React.createElement("tbody", null, rows.map((r, i) => /*#__PURE__*/React.createElement("tr", {
    key: i
  }, /*#__PURE__*/React.createElement("td", {
    className: "m"
  }, r[0]), /*#__PURE__*/React.createElement("td", null, r[1]), /*#__PURE__*/React.createElement("td", {
    className: "m",
    style: {
      color: "var(--fg-3)"
    }
  }, r[2]), /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement(Badge, {
    tone: r[3] === "corp" ? "gold" : "success",
    dot: false
  }, r[3] === "corp" ? "Corporate" : "Product")), /*#__PURE__*/React.createElement("td", null, r[4]), /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement(Badge, {
    tone: tone[r[5]]
  }, r[5][0].toUpperCase() + r[5].slice(1)))))))), /*#__PURE__*/React.createElement("p", {
    className: "cap",
    style: {
      marginTop: 12
    }
  }, "LinkedIn's slug is ", /*#__PURE__*/React.createElement("code", null, "lan-onasis"), " (hyphenated); every other handle is ", /*#__PURE__*/React.createElement("code", null, "lanonasis"), ". Keep both exactly as written.")), /*#__PURE__*/React.createElement(Sec, {
    title: "Which identity, where",
    lead: "Audience decides. Customers, partners and press see the corporate expression; people using the product see the product expression."
  }, /*#__PURE__*/React.createElement("div", {
    className: "cols-2"
  }, /*#__PURE__*/React.createElement("div", {
    className: "frame frame-b",
    style: {
      background: "var(--surface-corporate)",
      color: "var(--ln-white)",
      border: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "eb",
    style: {
      color: "var(--ln-gold)"
    }
  }, "Corporate"), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      font: "500 15px/1.6 var(--font-body)"
    }
  }, "Gold on navy deep, brand serif, the wreath. Social profiles and covers, email signatures, decks, press, the marketing hero and footer.")), /*#__PURE__*/React.createElement("div", {
    className: "frame frame-b",
    style: {
      background: "var(--surface-product)",
      color: "var(--ln-white)",
      border: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "eb",
    style: {
      color: "var(--ln-green)"
    }
  }, "Product"), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      font: "500 15px/1.6 var(--font-body)"
    }
  }, "Green on navy, Plus Jakarta and Inter, the app icon. App UI, dashboard, docs, changelog, in-product email, repository previews.")))), /*#__PURE__*/React.createElement(Sec, {
    title: "Crop and safe-area rules"
  }, /*#__PURE__*/React.createElement("ul", {
    className: "rules"
  }, /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("b", null, "Profiles crop to a circle."), " Ink-only marks lose their outer strokes \u2014 use the navy tile."), /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("b", null, "LinkedIn and Facebook covers"), " are overlapped by the avatar at lower-left and reflow by breakpoint. Keep ~15% clear on the left; centre or right-align the wordmark."), /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("b", null, "400\xD7400"), " is the safe upload size for every profile; Instagram serves at 320\xD7320."))));
}
Object.assign(window, {
  Overview,
  Brand,
  Channels
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "site/pages-brand.jsx", error: String((e && e.message) || e) }); }

// site/pages-build.jsx
try { (() => {
/* Components · Patterns · Guidelines */

const SITE_COMPONENTS = [{
  id: "button",
  name: "Button",
  tag: "Action"
}, {
  id: "badge",
  name: "Badge",
  tag: "Status"
}, {
  id: "card",
  name: "Card",
  tag: "Container"
}, {
  id: "input",
  name: "Input",
  tag: "Form"
}, {
  id: "select",
  name: "Select",
  tag: "Form"
}, {
  id: "modal",
  name: "Modal",
  tag: "Overlay"
}, {
  id: "brandmark",
  name: "BrandMark",
  tag: "Brand"
}, {
  id: "l0mark",
  name: "L0Mark",
  tag: "Brand"
}];
window.SITE_COMPONENTS = SITE_COMPONENTS;
function Props({
  rows
}) {
  return /*#__PURE__*/React.createElement("table", {
    className: "props"
  }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", null, "Prop"), /*#__PURE__*/React.createElement("th", null, "Type"), /*#__PURE__*/React.createElement("th", null, "Notes"))), /*#__PURE__*/React.createElement("tbody", null, rows.map(r => /*#__PURE__*/React.createElement("tr", {
    key: r[0]
  }, /*#__PURE__*/React.createElement("td", null, r[0]), /*#__PURE__*/React.createElement("td", null, r[1]), /*#__PURE__*/React.createElement("td", null, r[2])))));
}
function Components({
  route
}) {
  const Button = ds("Button"),
    Badge = ds("Badge"),
    Card = ds("Card"),
    Input = ds("Input"),
    Select = ds("Select"),
    Modal = ds("Modal"),
    BrandMark = ds("BrandMark"),
    L0Mark = ds("L0Mark");
  const [open, setOpen] = React.useState(false);
  const [name, setName] = React.useState("");
  const [err, setErr] = React.useState(false);
  const [busy, setBusy] = React.useState(false);
  const [active, setActive] = React.useState(route.sub || "button");
  React.useEffect(() => {
    const obs = new IntersectionObserver(es => es.forEach(e => e.isIntersecting && setActive(e.target.id)), {
      rootMargin: "-90px 0px -70% 0px"
    });
    SITE_COMPONENTS.forEach(c => {
      const el = document.getElementById(c.id);
      el && obs.observe(el);
    });
    return () => obs.disconnect();
  }, []);
  const create = e => {
    e.preventDefault();
    if (!name.trim()) {
      setErr(true);
      return;
    }
    setErr(false);
    setBusy(true);
    setTimeout(() => {
      setBusy(false);
      setOpen(false);
      notify(`Memory “${name.trim()}” created`);
      setName("");
    }, 900);
  };
  const S = {
    button: {
      desc: "Gold for corporate actions, green for product actions, navy for secondary. Danger for destructive. Loading disables and shows a spinner.",
      body: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
        className: "row"
      }, ["primary", "accent", "secondary", "outline", "ghost", "danger"].map(v => /*#__PURE__*/React.createElement("div", {
        key: v,
        className: "vcell"
      }, /*#__PURE__*/React.createElement(Button, {
        variant: v,
        onClick: () => notify(v + " clicked")
      }, v === "danger" ? "Delete" : "Continue"), /*#__PURE__*/React.createElement("span", null, v)))), /*#__PURE__*/React.createElement("div", {
        className: "row"
      }, ["sm", "md", "lg"].map(s => /*#__PURE__*/React.createElement("div", {
        key: s,
        className: "vcell"
      }, /*#__PURE__*/React.createElement(Button, {
        variant: "outline",
        size: s
      }, "Save changes"), /*#__PURE__*/React.createElement("span", null, s))), /*#__PURE__*/React.createElement("div", {
        className: "vcell"
      }, /*#__PURE__*/React.createElement(Button, {
        variant: "outline",
        size: "icon",
        "aria-label": "Settings",
        title: "Settings"
      }, /*#__PURE__*/React.createElement(Icon, {
        name: "settings",
        size: 16
      })), /*#__PURE__*/React.createElement("span", null, "icon"))), /*#__PURE__*/React.createElement("div", {
        className: "row"
      }, /*#__PURE__*/React.createElement("div", {
        className: "vcell"
      }, /*#__PURE__*/React.createElement(Button, {
        variant: "accent",
        loading: true
      }, "Saving"), /*#__PURE__*/React.createElement("span", null, "loading")), /*#__PURE__*/React.createElement("div", {
        className: "vcell"
      }, /*#__PURE__*/React.createElement(Button, {
        variant: "primary",
        disabled: true
      }, "Unavailable"), /*#__PURE__*/React.createElement("span", null, "disabled")))),
      code: `<Button variant="accent" onClick={createWorkspace}>Create workspace</Button>\n<Button variant="danger" loading={deleting}>Delete</Button>\n<Button variant="outline" size="icon" aria-label="Settings">…</Button>`,
      props: [["variant", "primary | accent | secondary | outline | ghost | danger", "Default primary (gold)."], ["size", "sm | md | lg | icon", "icon needs aria-label."], ["loading", "boolean", "Disables + spinner + aria-busy."]]
    },
    badge: {
      desc: "Status pill. Always carries a text label — the dot is reinforcement, never the only signal.",
      body: /*#__PURE__*/React.createElement("div", {
        className: "row"
      }, [["success", "Operational"], ["info", "In review"], ["warning", "Syncing"], ["danger", "Failed"], ["neutral", "Draft"], ["gold", "Enterprise"]].map(([t, l]) => /*#__PURE__*/React.createElement("div", {
        key: t,
        className: "vcell"
      }, /*#__PURE__*/React.createElement(Badge, {
        tone: t
      }, l), /*#__PURE__*/React.createElement("span", null, t)))),
      code: `<Badge tone="success">Operational</Badge>\n<Badge tone="gold" dot={false}>Enterprise</Badge>`,
      props: [["tone", "success | info | warning | danger | neutral | gold", ""], ["dot", "boolean", "Default true."]]
    },
    card: {
      desc: "For repeated entities and framed tools — not for wrapping page sections.",
      body: /*#__PURE__*/React.createElement("div", {
        className: "cols-2"
      }, /*#__PURE__*/React.createElement(Card, {
        accent: "gold",
        eyebrow: "Corporate",
        title: "Connected by design",
        body: "A shared foundation for the next chapter.",
        footer: "Explore the platform \u2192"
      }), /*#__PURE__*/React.createElement(Card, {
        accent: "green",
        eyebrow: "Product",
        title: "Memory as a Service",
        body: "Persistent, queryable memory for AI agents.",
        footer: "Open console \u2192"
      })),
      code: `<Card accent="green" eyebrow="Product" title="Memory as a Service"\n  body="Persistent, queryable memory for AI agents." footer="Open console →" />`,
      props: [["eyebrow / title / body", "string", ""], ["accent", "gold | green", "Colours the eyebrow."], ["footer", "ReactNode", ""]]
    },
    input: {
      desc: "Semantic text field. The label and the help or error text belong to your form.",
      body: /*#__PURE__*/React.createElement("div", {
        className: "cols-3"
      }, /*#__PURE__*/React.createElement("label", {
        className: "field"
      }, "Workspace name", /*#__PURE__*/React.createElement(Input, {
        placeholder: "Acme Africa"
      }), /*#__PURE__*/React.createElement("span", {
        className: "h"
      }, "Lowercase, dashes only.")), /*#__PURE__*/React.createElement("label", {
        className: "field"
      }, "Email", /*#__PURE__*/React.createElement(Input, {
        defaultValue: "ada@",
        variant: "error",
        "aria-describedby": "ex-err"
      }), /*#__PURE__*/React.createElement("span", {
        id: "ex-err",
        className: "e"
      }, "Enter a valid email address.")), /*#__PURE__*/React.createElement("label", {
        className: "field"
      }, "Unavailable", /*#__PURE__*/React.createElement(Input, {
        placeholder: "Locked",
        disabled: true
      }))),
      code: `<label>\n  Email\n  <Input variant="error" aria-describedby="email-err" />\n  <span id="email-err">Enter a valid email address.</span>\n</label>`,
      props: [["variant", "default | error", "error sets aria-invalid."], ["size", "sm | md", ""], ["…rest", "input attributes", "Forwarded."]]
    },
    select: {
      desc: "A native select, so keyboard and screen-reader behaviour come for free.",
      body: /*#__PURE__*/React.createElement("div", {
        className: "cols-3"
      }, /*#__PURE__*/React.createElement("label", {
        className: "field"
      }, "Data region", /*#__PURE__*/React.createElement(Select, null, /*#__PURE__*/React.createElement("option", null, "Lagos \xB7 af-west-1"), /*#__PURE__*/React.createElement("option", null, "Nairobi \xB7 af-east-1"), /*#__PURE__*/React.createElement("option", null, "Paris \xB7 eu-west-3"))), /*#__PURE__*/React.createElement("label", {
        className: "field"
      }, "With error", /*#__PURE__*/React.createElement(Select, {
        variant: "error"
      }, /*#__PURE__*/React.createElement("option", null, "Choose a region"))), /*#__PURE__*/React.createElement("label", {
        className: "field"
      }, "Unavailable", /*#__PURE__*/React.createElement(Select, {
        disabled: true
      }, /*#__PURE__*/React.createElement("option", null, "Region locked")))),
      code: `<Select value={region} onChange={(e) => setRegion(e.target.value)}>\n  <option value="af-west-1">Lagos · af-west-1</option>\n</Select>`,
      props: [["variant", "default | error", ""], ["size", "sm | md", ""]]
    },
    modal: {
      desc: "Traps focus, closes on Escape or scrim click, and returns focus to the opener. Always give it a title, and a description when it changes data.",
      body: /*#__PURE__*/React.createElement("div", {
        className: "row"
      }, /*#__PURE__*/React.createElement(Button, {
        variant: "outline",
        onClick: () => setOpen(true)
      }, "Create a memory"), /*#__PURE__*/React.createElement("span", {
        className: "cap"
      }, "Try Tab, Shift+Tab and Escape.")),
      code: `<Modal open={open} title="Create a memory"\n  description="Adds a new memory to this workspace."\n  onClose={() => setOpen(false)}\n  footer={<Button variant="accent">Create memory</Button>}>\n  …\n</Modal>`,
      props: [["open", "boolean", ""], ["title", "string", "Required — the accessible name."], ["description", "string", ""], ["onClose", "() => void", "Required."], ["footer", "ReactNode", ""], ["size", "sm | md", ""]]
    },
    brandmark: {
      desc: "The product mark, theme-aware. Ink swaps by theme so it never disappears; geometry is id-free so bundlers can't scramble it.",
      split: true,
      light: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(BrandMark, {
        variant: "icon",
        theme: "light",
        size: 44
      }), /*#__PURE__*/React.createElement(BrandMark, {
        variant: "monogram",
        theme: "light",
        size: 32
      }), /*#__PURE__*/React.createElement(BrandMark, {
        variant: "wordmark",
        theme: "light",
        size: 70
      }), /*#__PURE__*/React.createElement(BrandMark, {
        variant: "tile",
        size: 40
      })),
      dark: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(BrandMark, {
        variant: "icon",
        theme: "dark",
        size: 44
      }), /*#__PURE__*/React.createElement(BrandMark, {
        variant: "monogram",
        theme: "dark",
        size: 32
      }), /*#__PURE__*/React.createElement(BrandMark, {
        variant: "wordmark",
        theme: "dark",
        size: 70
      }), /*#__PURE__*/React.createElement(BrandMark, {
        variant: "tile",
        size: 40
      })),
      code: `<BrandMark variant="icon" theme={isDark ? "dark" : "light"} size={32} />\n<BrandMark variant="tile" size={40} />  {/* favicons, circular avatars */}`,
      props: [["variant", "icon | monogram | wordmark | tile", ""], ["theme", "light | dark", "Navy ink / white ink."], ["size", "number", "Height in px."], ["basePath", "string", "Raster folder for wordmark / tile."]]
    },
    l0mark: {
      desc: "The LZero sub-product glyph. Inherits currentColor, so set colour on its container — no theme prop.",
      split: true,
      light: /*#__PURE__*/React.createElement("span", {
        style: {
          color: "var(--ln-navy)",
          display: "flex",
          gap: 18,
          alignItems: "center"
        }
      }, /*#__PURE__*/React.createElement(L0Mark, {
        size: 40
      }), /*#__PURE__*/React.createElement(L0Mark, {
        size: 40,
        accent: true
      }), /*#__PURE__*/React.createElement(L0Mark, {
        size: 40,
        variant: "ellipse"
      }), /*#__PURE__*/React.createElement(L0Mark, {
        size: 24
      })),
      dark: /*#__PURE__*/React.createElement("span", {
        style: {
          color: "#fff",
          display: "flex",
          gap: 18,
          alignItems: "center"
        }
      }, /*#__PURE__*/React.createElement(L0Mark, {
        size: 40
      }), /*#__PURE__*/React.createElement(L0Mark, {
        size: 40,
        accent: true
      }), /*#__PURE__*/React.createElement(L0Mark, {
        size: 40,
        variant: "ellipse"
      }), /*#__PURE__*/React.createElement(L0Mark, {
        size: 24
      })),
      code: `<span style={{ color: "var(--fg-1)" }}>\n  <L0Mark size={24} accent />\n</span>`,
      props: [["variant", "circle | ellipse", "Both ship in production."], ["accent", "boolean", "Green meridian."], ["meridian", "boolean", "circle only."], ["size", "number", "Legible 16–40."]]
    }
  };
  return /*#__PURE__*/React.createElement(Page, {
    eyebrow: "Build",
    title: "Components",
    desc: "Eight exported primitives. Live, themed, and copyable \u2014 the same code your product imports."
  }, /*#__PURE__*/React.createElement("div", {
    className: "cmp",
    style: {
      marginTop: 28
    }
  }, /*#__PURE__*/React.createElement("nav", {
    className: "cmp-nav",
    "aria-label": "Components"
  }, SITE_COMPONENTS.map(c => /*#__PURE__*/React.createElement("a", {
    key: c.id,
    href: "#/components/" + c.id,
    className: active === c.id ? "on" : ""
  }, c.name))), /*#__PURE__*/React.createElement("div", {
    style: {
      minWidth: 0
    }
  }, SITE_COMPONENTS.map(c => {
    const s = S[c.id];
    return /*#__PURE__*/React.createElement("section", {
      key: c.id,
      id: c.id,
      className: "cmp-sec"
    }, /*#__PURE__*/React.createElement("h2", null, c.name, /*#__PURE__*/React.createElement("span", {
      className: "tag"
    }, c.tag)), /*#__PURE__*/React.createElement("p", null, s.desc), s.split ? /*#__PURE__*/React.createElement("div", {
      className: "stage split"
    }, /*#__PURE__*/React.createElement("div", null, s.light), /*#__PURE__*/React.createElement("div", {
      className: "dk"
    }, s.dark)) : /*#__PURE__*/React.createElement("div", {
      className: "stage"
    }, s.body), /*#__PURE__*/React.createElement(Code, {
      code: s.code
    }), /*#__PURE__*/React.createElement(Props, {
      rows: s.props
    }));
  }))), /*#__PURE__*/React.createElement(Modal, {
    open: open,
    title: "Create a memory",
    description: "Adds a new memory to this workspace. You can rename it later.",
    onClose: () => {
      setOpen(false);
      setErr(false);
    },
    footer: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Button, {
      variant: "outline",
      onClick: () => setOpen(false)
    }, "Cancel"), /*#__PURE__*/React.createElement(Button, {
      variant: "accent",
      loading: busy,
      onClick: create
    }, "Create memory"))
  }, /*#__PURE__*/React.createElement("form", {
    onSubmit: create
  }, /*#__PURE__*/React.createElement("label", {
    className: "field"
  }, "Memory name", /*#__PURE__*/React.createElement(Input, {
    value: name,
    onChange: e => setName(e.target.value),
    placeholder: "credit-scoring-v4",
    variant: err ? "error" : "default",
    "aria-describedby": err ? "m-err" : undefined,
    autoFocus: true
  }), err && /*#__PURE__*/React.createElement("span", {
    id: "m-err",
    className: "e"
  }, "A name is required.")))));
}
function Patterns() {
  const Button = ds("Button");
  const kits = [{
    src: "ui_kits/web/index.html",
    t: "Marketing site",
    d: "Nav, hero, product grid, split feature, ecosystem band, CTA, footer."
  }, {
    src: "ui_kits/dashboard/index.html",
    t: "Product dashboard",
    d: "Sidebar, top bar, KPIs, chart, memories table, settings, dialog."
  }];
  return /*#__PURE__*/React.createElement(Page, {
    eyebrow: "Build",
    title: "Patterns",
    desc: "Complete surfaces composed from the system. Open one to click through it."
  }, /*#__PURE__*/React.createElement(Sec, null, /*#__PURE__*/React.createElement("div", {
    className: "cols-2"
  }, kits.map(k => /*#__PURE__*/React.createElement("div", {
    key: k.src,
    className: "frame kit"
  }, /*#__PURE__*/React.createElement("div", {
    className: "pv"
  }, /*#__PURE__*/React.createElement("iframe", {
    src: k.src,
    title: k.t + " preview",
    loading: "lazy",
    tabIndex: -1,
    "aria-hidden": "true"
  })), /*#__PURE__*/React.createElement("div", {
    className: "meta"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h3", null, k.t), /*#__PURE__*/React.createElement("div", {
    className: "cap"
  }, k.d)), /*#__PURE__*/React.createElement("a", {
    href: k.src,
    target: "_blank",
    rel: "noreferrer",
    style: {
      textDecoration: "none"
    }
  }, /*#__PURE__*/React.createElement(Button, {
    variant: "outline",
    size: "sm",
    tabIndex: -1
  }, "Open ", /*#__PURE__*/React.createElement(Icon, {
    name: "external-link",
    size: 14
  })))))))), /*#__PURE__*/React.createElement(Sec, {
    title: "Using patterns",
    lead: "Patterns receive data and callbacks; they are not backends."
  }, /*#__PURE__*/React.createElement("ul", {
    className: "rules"
  }, /*#__PURE__*/React.createElement("li", null, "Specimen numbers (uptime, latency, totals) are examples. Never present them as real."), /*#__PURE__*/React.createElement("li", null, "Marketing hero and footer use the corporate expression; product sections use the product expression."), /*#__PURE__*/React.createElement("li", null, "Copy a pattern's markup and wire it to your own data \u2014 don't import the kit files."))));
}
function Guidelines() {
  return /*#__PURE__*/React.createElement(Page, {
    eyebrow: "Guidance",
    title: "Guidelines",
    desc: "Voice, accessibility, and the rules that keep the mark intact in code."
  }, /*#__PURE__*/React.createElement(Sec, {
    title: "Voice"
  }, /*#__PURE__*/React.createElement("div", {
    className: "dd"
  }, /*#__PURE__*/React.createElement("div", {
    className: "do"
  }, /*#__PURE__*/React.createElement("h4", null, "Do"), /*#__PURE__*/React.createElement("p", null, "\u201CDeploy your first memory in under five minutes.\u201D"), /*#__PURE__*/React.createElement("p", null, "\u201CYour key expires in 4 days. Rotate it.\u201D"), /*#__PURE__*/React.createElement("div", {
    className: "cap"
  }, "Direct, sentence case, \u201Cyou\u201D, specific.")), /*#__PURE__*/React.createElement("div", {
    className: "no"
  }, /*#__PURE__*/React.createElement("h4", null, "Don't"), /*#__PURE__*/React.createElement("p", null, "\u201CLeverage our synergistic AI to revolutionise your stack!\u201D"), /*#__PURE__*/React.createElement("p", null, "\u201COops! Something went wrong \uD83D\uDE2C\u201D"), /*#__PURE__*/React.createElement("div", {
    className: "cap"
  }, "No buzzwords, exclamations, or emoji in product.")))), /*#__PURE__*/React.createElement(Sec, {
    title: "Accessibility"
  }, /*#__PURE__*/React.createElement("ul", {
    className: "rules"
  }, /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("b", null, "Buttons act, links navigate."), " Labels are linked to controls; tabular data uses real tables."), /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("b", null, "Contrast"), " \u2014 4.5:1 for text in both themes. Use semantic foreground tokens on their intended surfaces."), /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("b", null, "Focus"), " stays visible. Never remove outlines."), /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("b", null, "Status"), " is always text, never only a dot or a colour."), /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("b", null, "Motion"), " is never required to understand anything, and reduced-motion disables it."))), /*#__PURE__*/React.createElement(Sec, {
    title: "Rendering the mark in code",
    lead: "Two specific causes scramble the mark. Both are designed out of BrandMark \u2014 these rules matter for any hand-rolled port."
  }, /*#__PURE__*/React.createElement("ul", {
    className: "rules"
  }, /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("b", null, "Never paste raw SVG into JSX."), " React drops ", /*#__PURE__*/React.createElement("code", null, "stroke-width"), ", ", /*#__PURE__*/React.createElement("code", null, "fill-rule"), " and friends; strokes fall back to 1px and the linework mangles."), /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("b", null, "Never give an inline mark an id."), " Masks and clip-paths need ids, which collide, mismatch on hydration, and get rewritten by SVGO."), /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("b", null, "If you run SVGO"), ", disable ", /*#__PURE__*/React.createElement("code", null, "cleanupIds"), ", ", /*#__PURE__*/React.createElement("code", null, "mergePaths"), ", ", /*#__PURE__*/React.createElement("code", null, "convertShapeToPath"), " and ", /*#__PURE__*/React.createElement("code", null, "removeViewBox"), "."), /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("b", null, "Outside React"), ", use ", /*#__PURE__*/React.createElement("code", null, "assets/logos/brandmark-icon.svg"), " \u2014 it inks with ", /*#__PURE__*/React.createElement("code", null, "currentColor"), "."))), /*#__PURE__*/React.createElement(Sec, {
    title: "Token discipline"
  }, /*#__PURE__*/React.createElement("ul", {
    className: "rules"
  }, /*#__PURE__*/React.createElement("li", null, "No raw hex in page code \u2014 every colour, size, radius and shadow comes from a named variable."), /*#__PURE__*/React.createElement("li", null, "Use semantic tokens (", /*#__PURE__*/React.createElement("code", null, "--bg"), ", ", /*#__PURE__*/React.createElement("code", null, "--fg-1"), ", ", /*#__PURE__*/React.createElement("code", null, "--border-default"), ") for chrome so dark theme works."), /*#__PURE__*/React.createElement("li", null, "Never recolour or crop a logo to fit a theme \u2014 choose the right variant instead."))));
}
Object.assign(window, {
  Components,
  Patterns,
  Guidelines,
  SITE_COMPONENTS
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "site/pages-build.jsx", error: String((e && e.message) || e) }); }

// site/pages-foundations.jsx
try { (() => {
/* Colors · Typography · Space & motion · Iconography — all driven by the canonical token file. */

function Colors() {
  const theme = useTheme();
  const tokens = useTokens(theme);
  if (!tokens) return /*#__PURE__*/React.createElement(Page, {
    eyebrow: "Foundations",
    title: "Colors"
  }, /*#__PURE__*/React.createElement("p", {
    className: "cap"
  }, "Loading tokens\u2026"));
  const by = n => tokens.find(t => t.name === n);
  const scale = s => tokens.filter(t => new RegExp(`^--ln-${s}-\\d+$`).test(t.name));
  const core = [["--ln-navy-deep", "Navy deep", "Corporate field"], ["--ln-navy", "Navy", "Product surface"], ["--ln-gold", "Gold", "Corporate accent"], ["--ln-green", "Green", "Product accent"], ["--ln-amber", "Amber", "Marketing wordmark"]];
  const semGroups = [["Surfaces", /^--bg/], ["Text", /^--fg/], ["Borders", /^--border/], ["Status", /^--status/]];
  return /*#__PURE__*/React.createElement(Page, {
    eyebrow: "Foundations",
    title: "Colors",
    desc: "Trust in navy. Distinction in gold. Momentum in green. Click any swatch to copy its token."
  }, /*#__PURE__*/React.createElement(Sec, {
    title: "Brand core"
  }, /*#__PURE__*/React.createElement("div", {
    className: "grid-auto",
    style: {
      gridTemplateColumns: "repeat(auto-fill,minmax(170px,1fr))"
    }
  }, core.map(([n, label, role]) => {
    const t = by(n);
    if (!t) return null;
    return /*#__PURE__*/React.createElement("button", {
      key: n,
      className: "sw",
      onClick: () => copy(`var(${n})`, "Token copied"),
      "aria-label": `Copy ${n}, ${t.value}`
    }, /*#__PURE__*/React.createElement("div", {
      className: "chip",
      style: {
        background: `var(${n})`,
        height: 110
      }
    }), /*#__PURE__*/React.createElement("b", null, label), /*#__PURE__*/React.createElement("span", null, t.value, " \xB7 ", role));
  }))), ["navy", "gold", "green", "grey"].map(s => {
    const steps = scale(s);
    return /*#__PURE__*/React.createElement(Sec, {
      key: s,
      title: s[0].toUpperCase() + s.slice(1) + " scale",
      lead: {
        navy: "Product base at 600, corporate field at 800.",
        gold: "Sampled from the wreath; base at 400. Use 600–700 for gold text on white.",
        green: "Base at 400. Use 700 for green text on white.",
        grey: "Neutral ramp for UI chrome."
      }[s]
    }, /*#__PURE__*/React.createElement("div", {
      className: "ramp",
      style: {
        "--n": steps.length
      }
    }, steps.map(t => /*#__PURE__*/React.createElement("button", {
      key: t.name,
      style: {
        background: `var(${t.name})`,
        color: inkFor(t.value)
      },
      onClick: () => copy(`var(${t.name})`, "Token copied"),
      title: `${t.name} · ${t.value}`
    }, t.name.split("-").pop(), /*#__PURE__*/React.createElement("small", null, t.value.replace("#", ""))))));
  }), /*#__PURE__*/React.createElement(Sec, {
    title: "Semantic tokens",
    lead: "Build interface chrome from these, not the raw palette \u2014 they switch automatically in dark theme."
  }, semGroups.map(([g, re]) => /*#__PURE__*/React.createElement("div", {
    key: g,
    style: {
      marginBottom: 18
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "eb",
    style: {
      margin: "0 0 10px"
    }
  }, g), /*#__PURE__*/React.createElement("div", {
    className: "sem"
  }, tokens.filter(t => re.test(t.name)).map(t => /*#__PURE__*/React.createElement("div", {
    key: t.name,
    role: "button",
    tabIndex: 0,
    style: {
      cursor: "pointer"
    },
    onClick: () => copy(`var(${t.name})`, "Token copied"),
    onKeyDown: e => e.key === "Enter" && copy(`var(${t.name})`, "Token copied")
  }, /*#__PURE__*/React.createElement("i", {
    style: {
      background: `var(${t.name})`
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("b", null, t.name), /*#__PURE__*/React.createElement("span", null, t.value)))))))));
}
function Typography() {
  const fams = [["--font-brand", "Cormorant Garamond", "Corporate wordmarks and lockups only — never product UI text.", "500 · 600 · 700", {
    fontWeight: 600
  }], ["--font-display", "Plus Jakarta Sans", "Product headings.", "400 – 800", {
    fontWeight: 700
  }], ["--font-body", "Inter", "Body copy and interface.", "400 – 700", {
    fontWeight: 400
  }], ["--font-mono", "JetBrains Mono", "Code, IDs, API keys, tabular numbers.", "400 · 500", {
    fontWeight: 400
  }]];
  const scale = [["h-display · 72", {
    font: "800 64px/1.05 var(--font-display)",
    letterSpacing: "-.025em"
  }, "Built for possibility."], ["h1 · 48", {
    font: "700 44px/1.1 var(--font-display)",
    letterSpacing: "-.02em"
  }, "A connected future."], ["h2 · 36", {
    font: "700 34px/1.2 var(--font-display)"
  }, "Intelligence, with purpose."], ["h3 · 30", {
    font: "600 28px/1.3 var(--font-display)"
  }, "One unified platform."], ["h4 · 24", {
    font: "600 22px/1.3 var(--font-display)"
  }, "Your workspace, connected."], ["lede · 20", {
    font: "400 19px/1.6 var(--font-body)",
    color: "var(--fg-2)"
  }, "The infrastructure behind your next idea."], ["body · 16", {
    font: "400 16px/1.65 var(--font-body)",
    color: "var(--fg-2)"
  }, "Build reliable services on a shared foundation, with an audit trail you can query."], ["body-sm · 14", {
    font: "400 14px/1.5 var(--font-body)",
    color: "var(--fg-2)"
  }, "Your latest changes are live."], ["caption · 12", {
    font: "500 12px/1.5 var(--font-body)",
    color: "var(--fg-3)"
  }, "Updated 2 minutes ago"], ["eyebrow · 12", {
    font: "600 12px var(--font-body)",
    textTransform: "uppercase",
    letterSpacing: ".12em",
    color: "var(--ln-green-700)"
  }, "Enterprise infrastructure"], ["mono · 13", {
    font: "400 13px var(--font-mono)",
    color: "var(--fg-1)"
  }, 'memory.query({ region: "af-west-1" })']];
  return /*#__PURE__*/React.createElement(Page, {
    eyebrow: "Foundations",
    title: "Typography",
    desc: "Four self-hosted families with distinct jobs. The serif carries the corporate voice; the sans families do the work in product."
  }, /*#__PURE__*/React.createElement(Sec, {
    title: "Families"
  }, /*#__PURE__*/React.createElement("div", {
    className: "cols-2"
  }, fams.map(([tok, name, role, w, st]) => /*#__PURE__*/React.createElement("div", {
    key: tok,
    className: "fam"
  }, /*#__PURE__*/React.createElement("div", {
    className: "big",
    style: {
      fontFamily: `var(${tok})`,
      ...st,
      color: tok === "--font-brand" ? "var(--ln-gold-600)" : "var(--fg-1)"
    }
  }, "Aa Bb Cc 0123"), /*#__PURE__*/React.createElement("h3", null, name), /*#__PURE__*/React.createElement("div", {
    className: "cap"
  }, role, " \xB7 ", w), /*#__PURE__*/React.createElement("code", {
    style: {
      display: "inline-block",
      marginTop: 8
    }
  }, tok))))), /*#__PURE__*/React.createElement(Sec, {
    title: "Corporate wordmark",
    lead: "The only place wide tracking belongs. Elsewhere letter-spacing stays neutral."
  }, /*#__PURE__*/React.createElement("div", {
    className: "frame frame-b",
    style: {
      background: "var(--surface-corporate)",
      border: 0,
      padding: "32px 28px"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      font: "700 44px/1 var(--font-brand)",
      letterSpacing: ".12em",
      color: "var(--ln-gold)"
    }
  }, "LAN ONASIS"), /*#__PURE__*/React.createElement("div", {
    style: {
      font: "500 13px var(--font-brand)",
      letterSpacing: ".3em",
      color: "var(--ln-gold-200)",
      marginTop: 10
    }
  }, "FUTURE \xB7 STRATEGY \xB7 TECH"))), /*#__PURE__*/React.createElement(Sec, {
    title: "Scale"
  }, scale.map(([k, st, s]) => /*#__PURE__*/React.createElement("div", {
    key: k,
    className: "trow"
  }, /*#__PURE__*/React.createElement("span", {
    className: "cap mono"
  }, k), /*#__PURE__*/React.createElement("div", {
    style: {
      color: "var(--fg-1)",
      ...st
    }
  }, s)))));
}
function Foundations() {
  const theme = useTheme();
  const tokens = useTokens(theme);
  const [go2, setGo2] = React.useState(false);
  if (!tokens) return /*#__PURE__*/React.createElement(Page, {
    eyebrow: "Foundations",
    title: "Space & motion"
  }, /*#__PURE__*/React.createElement("p", {
    className: "cap"
  }, "Loading tokens\u2026"));
  const pick = re => tokens.filter(t => re.test(t.name));
  return /*#__PURE__*/React.createElement(Page, {
    eyebrow: "Foundations",
    title: "Space & motion",
    desc: "A 4-point rhythm, restrained radii, quiet elevation, and motion that never overshoots."
  }, /*#__PURE__*/React.createElement(Sec, {
    title: "Spacing",
    lead: "4-point scale. Sections breathe at 32\u201348; cards pad at 20\u201324."
  }, pick(/^--sp-\d+$/).filter(t => t.value !== "0px").map(t => /*#__PURE__*/React.createElement("div", {
    key: t.name,
    className: "sp-row"
  }, /*#__PURE__*/React.createElement("code", null, t.name), /*#__PURE__*/React.createElement("span", {
    className: "cap mono"
  }, t.value), /*#__PURE__*/React.createElement("i", {
    style: {
      width: `min(100%, var(${t.name}))`
    }
  })))), /*#__PURE__*/React.createElement(Sec, {
    title: "Radii",
    lead: "Controls default to md (8). Larger radii are for containers, not a reason to make every control a pill."
  }, /*#__PURE__*/React.createElement("div", {
    className: "grid-auto"
  }, pick(/^--r-/).map(t => /*#__PURE__*/React.createElement("div", {
    key: t.name
  }, /*#__PURE__*/React.createElement("div", {
    className: "rad",
    style: {
      borderRadius: `var(${t.name})`
    }
  }), /*#__PURE__*/React.createElement("code", null, t.name), /*#__PURE__*/React.createElement("div", {
    className: "cap mono"
  }, t.value))))), /*#__PURE__*/React.createElement(Sec, {
    title: "Elevation",
    lead: "Navy-tinted, never pure black. xs inputs \xB7 sm cards \xB7 md hover \xB7 lg menus \xB7 xl dialogs."
  }, /*#__PURE__*/React.createElement("div", {
    className: "shd-wrap"
  }, /*#__PURE__*/React.createElement("div", {
    className: "grid-auto"
  }, pick(/^--shadow-/).map(t => /*#__PURE__*/React.createElement("div", {
    key: t.name
  }, /*#__PURE__*/React.createElement("div", {
    className: "shd",
    style: {
      boxShadow: `var(${t.name})`
    }
  }), /*#__PURE__*/React.createElement("code", null, t.name)))))), /*#__PURE__*/React.createElement(Sec, {
    title: "Motion",
    lead: "Enter with ease-out; move with ease-in-out. 120 / 200 / 320 ms. Reduced-motion preference disables all transitions."
  }, /*#__PURE__*/React.createElement("div", {
    className: "cols-3"
  }, [["--dur-fast", "--ease-out"], ["--dur-base", "--ease-out"], ["--dur-slow", "--ease-in-out"]].map(([d, e]) => /*#__PURE__*/React.createElement("div", {
    key: d
  }, /*#__PURE__*/React.createElement("div", {
    className: "motion-demo" + (go2 ? " go" : "")
  }, /*#__PURE__*/React.createElement("i", {
    style: {
      transition: `left var(${d}) var(${e})`
    }
  })), /*#__PURE__*/React.createElement("div", {
    className: "cap mono",
    style: {
      marginTop: 8
    }
  }, d, " \xB7 ", e)))), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 16
    }
  }, React.createElement(ds("Button"), {
    variant: "outline",
    size: "sm",
    onClick: () => setGo2(v => !v)
  }, "Play"))));
}
const ICONS = ["rocket", "shield-check", "zap", "globe", "building-2", "users", "trophy", "key-round", "brain", "bar-chart-3", "terminal", "code", "cloud", "lock", "layers", "settings", "database", "activity", "bell", "search", "filter", "plus", "check", "x", "arrow-right", "arrow-up-right", "download", "copy", "external-link", "trending-up", "trending-down", "rotate-cw"];
function Iconography() {
  const Input = ds("Input");
  const [q, setQ] = React.useState("");
  const list = ICONS.filter(n => n.includes(q.trim().toLowerCase()));
  return /*#__PURE__*/React.createElement(Page, {
    eyebrow: "Foundations",
    title: "Iconography",
    desc: "Lucide, outline only, 2px stroke. Navy by default; green only for state or emphasis. Click an icon to copy its name."
  }, /*#__PURE__*/React.createElement("div", {
    className: "search"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "search",
    size: 16
  }), /*#__PURE__*/React.createElement(Input, {
    "aria-label": "Search icons",
    placeholder: "Search icons\u2026",
    value: q,
    onChange: e => setQ(e.target.value)
  })), /*#__PURE__*/React.createElement("div", {
    className: "grid-auto",
    style: {
      gridTemplateColumns: "repeat(auto-fill,minmax(112px,1fr))"
    }
  }, list.map(n => /*#__PURE__*/React.createElement("button", {
    key: n,
    className: "ico",
    onClick: () => copy(n, "Icon name copied")
  }, /*#__PURE__*/React.createElement(Icon, {
    name: n,
    size: 24
  }), /*#__PURE__*/React.createElement("span", null, n)))), !list.length && /*#__PURE__*/React.createElement("p", {
    className: "cap"
  }, "No icons match \u201C", q, "\u201D. The full Lucide set is available \u2014 this is the curated core."), /*#__PURE__*/React.createElement(Sec, {
    title: "Sizes",
    lead: "16 dense UI \xB7 20 default \xB7 24 body \xB7 32 feature."
  }, /*#__PURE__*/React.createElement("div", {
    className: "row",
    style: {
      gap: 28,
      alignItems: "flex-end"
    }
  }, [16, 20, 24, 32].map(s => /*#__PURE__*/React.createElement("div", {
    key: s,
    className: "vcell",
    style: {
      alignItems: "center"
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "shield-check",
    size: s
  }), /*#__PURE__*/React.createElement("span", null, s, "px"))))), /*#__PURE__*/React.createElement(Sec, {
    title: "Rules"
  }, /*#__PURE__*/React.createElement("ul", {
    className: "rules"
  }, /*#__PURE__*/React.createElement("li", null, "Never mix filled and outline icons, or change stroke weight."), /*#__PURE__*/React.createElement("li", null, "Icon-only buttons need an ", /*#__PURE__*/React.createElement("code", null, "aria-label"), " and a ", /*#__PURE__*/React.createElement("code", null, "title"), "."), /*#__PURE__*/React.createElement("li", null, "Never convey status with an icon or colour alone \u2014 pair it with text."))));
}
Object.assign(window, {
  Colors,
  Typography,
  Foundations,
  Iconography
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "site/pages-foundations.jsx", error: String((e && e.message) || e) }); }

// site/shell.jsx
try { (() => {
/* App shell: hash router, sidebar, top bar, command palette, theme. */
const NAV = [{
  group: "Start",
  items: [{
    path: "/",
    label: "Overview",
    icon: "layout-grid"
  }, {
    path: "/brand",
    label: "Brand",
    icon: "badge-check"
  }]
}, {
  group: "Foundations",
  items: [{
    path: "/colors",
    label: "Colors",
    icon: "palette"
  }, {
    path: "/typography",
    label: "Typography",
    icon: "type"
  }, {
    path: "/foundations",
    label: "Space & motion",
    icon: "ruler"
  }, {
    path: "/iconography",
    label: "Iconography",
    icon: "shapes"
  }]
}, {
  group: "Build",
  items: [{
    path: "/components",
    label: "Components",
    icon: "component",
    count: "8"
  }, {
    path: "/patterns",
    label: "Patterns",
    icon: "panels-top-left"
  }]
}, {
  group: "Guidance",
  items: [{
    path: "/channels",
    label: "Channels",
    icon: "at-sign"
  }, {
    path: "/guidelines",
    label: "Guidelines",
    icon: "book-open"
  }]
}];
const FLAT = NAV.flatMap(g => g.items.map(i => ({
  ...i,
  group: g.group
})));
function parseHash() {
  const h = (location.hash || "#/").replace(/^#/, "") || "/";
  const parts = h.split("/").filter(Boolean);
  const path = "/" + (parts[0] || "");
  return {
    path: FLAT.some(i => i.path === path) ? path : "/",
    sub: parts[1] || null
  };
}
function go(path, sub) {
  location.hash = path + (sub ? "/" + sub : "");
}
function useRoute() {
  const [route, setRoute] = React.useState(parseHash);
  React.useEffect(() => {
    const on = () => setRoute(parseHash());
    window.addEventListener("hashchange", on);
    return () => window.removeEventListener("hashchange", on);
  }, []);
  return route;
}

/* Theme: persisted, defaults to the OS preference. */
function initTheme() {
  let t = null;
  try {
    t = localStorage.getItem("ln-ds-theme");
  } catch (e) {}
  if (!t) t = window.matchMedia && matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  document.documentElement.setAttribute("data-theme", t);
}
initTheme();
function toggleTheme() {
  const next = document.documentElement.getAttribute("data-theme") === "dark" ? "light" : "dark";
  document.documentElement.setAttribute("data-theme", next);
  try {
    localStorage.setItem("ln-ds-theme", next);
  } catch (e) {}
}
function Palette({
  onClose
}) {
  const [q, setQ] = React.useState("");
  const [i, setI] = React.useState(0);
  const items = React.useMemo(() => {
    const pages = FLAT.map(p => ({
      label: p.label,
      hint: p.group,
      icon: p.icon,
      run: () => go(p.path)
    }));
    const comps = (window.SITE_COMPONENTS || []).map(c => ({
      label: c.name,
      hint: "Component",
      icon: "component",
      run: () => go("/components", c.id)
    }));
    const acts = [{
      label: "Toggle light / dark theme",
      hint: "Action",
      icon: "sun-moon",
      run: toggleTheme
    }];
    const all = [...pages, ...comps, ...acts];
    const s = q.trim().toLowerCase();
    return s ? all.filter(x => x.label.toLowerCase().includes(s) || x.hint.toLowerCase().includes(s)) : all;
  }, [q]);
  React.useEffect(() => setI(0), [q]);
  const pick = x => {
    onClose();
    setTimeout(x.run, 0);
  };
  const onKey = e => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setI(v => Math.min(v + 1, items.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setI(v => Math.max(v - 1, 0));
    } else if (e.key === "Enter" && items[i]) {
      e.preventDefault();
      pick(items[i]);
    } else if (e.key === "Escape") {
      e.preventDefault();
      onClose();
    }
  };
  return /*#__PURE__*/React.createElement("div", {
    className: "pal-scrim",
    onMouseDown: e => e.target === e.currentTarget && onClose()
  }, /*#__PURE__*/React.createElement("div", {
    className: "pal",
    role: "dialog",
    "aria-modal": "true",
    "aria-label": "Search the design system"
  }, /*#__PURE__*/React.createElement("input", {
    autoFocus: true,
    placeholder: "Jump to a page, component or action\u2026",
    value: q,
    onChange: e => setQ(e.target.value),
    onKeyDown: onKey,
    role: "combobox",
    "aria-expanded": "true",
    "aria-controls": "pal-list",
    "aria-activedescendant": "pal-" + i
  }), /*#__PURE__*/React.createElement("ul", {
    id: "pal-list",
    role: "listbox"
  }, items.map((x, n) => /*#__PURE__*/React.createElement("li", {
    key: x.label + n
  }, /*#__PURE__*/React.createElement("button", {
    id: "pal-" + n,
    role: "option",
    "aria-selected": n === i,
    onMouseEnter: () => setI(n),
    onClick: () => pick(x)
  }, /*#__PURE__*/React.createElement(Icon, {
    name: x.icon,
    size: 16
  }), x.label, /*#__PURE__*/React.createElement("small", null, x.hint)))), !items.length && /*#__PURE__*/React.createElement("li", {
    className: "empty"
  }, "Nothing matches \u201C", q, "\u201D."))));
}
function Shell({
  route,
  children
}) {
  const [open, setOpen] = React.useState(false);
  const [pal, setPal] = React.useState(false);
  const theme = useTheme();
  const cur = FLAT.find(x => x.path === route.path) || FLAT[0];
  const idx = FLAT.indexOf(cur);
  const prev = FLAT[idx - 1],
    next = FLAT[idx + 1];
  React.useEffect(() => {
    const on = e => {
      const typing = /input|textarea|select/i.test(document.activeElement && document.activeElement.tagName);
      if (e.key === "k" && (e.metaKey || e.ctrlKey) || e.key === "/" && !typing) {
        e.preventDefault();
        setPal(true);
      }
    };
    window.addEventListener("keydown", on);
    return () => window.removeEventListener("keydown", on);
  }, []);
  React.useEffect(() => {
    setOpen(false);
  }, [route.path, route.sub]);

  /* Smooth navigation: new page → top; deep link → its section. */
  React.useEffect(() => {
    if (route.sub) {
      const t = setTimeout(() => {
        const el = document.getElementById(route.sub);
        if (el) window.scrollTo({
          top: el.getBoundingClientRect().top + window.scrollY - 76,
          behavior: "smooth"
        });
      }, 60);
      return () => clearTimeout(t);
    }
    window.scrollTo({
      top: 0,
      behavior: "auto"
    });
  }, [route.path, route.sub]);
  return /*#__PURE__*/React.createElement("div", {
    className: "app"
  }, /*#__PURE__*/React.createElement("a", {
    className: "skip",
    href: "#main",
    onClick: e => {
      e.preventDefault();
      document.getElementById("main").focus();
    }
  }, "Skip to content"), /*#__PURE__*/React.createElement("aside", {
    className: "side" + (open ? " open" : ""),
    "aria-label": "Design system navigation"
  }, /*#__PURE__*/React.createElement("a", {
    className: "brand",
    href: "#/"
  }, /*#__PURE__*/React.createElement("img", {
    src: "assets/logos/app-icon-64.png",
    width: "36",
    height: "36",
    alt: "",
    style: {
      borderRadius: "var(--r-md)"
    }
  }), /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement("b", null, "LAN Onasis"), /*#__PURE__*/React.createElement("small", null, "Design system \xB7 v2.0"))), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "side-search",
    onClick: () => setPal(true)
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "search",
    size: 15
  }), "Search", /*#__PURE__*/React.createElement("kbd", null, "\u2318K")), NAV.map(g => /*#__PURE__*/React.createElement("nav", {
    key: g.group,
    "aria-label": g.group
  }, /*#__PURE__*/React.createElement("div", {
    className: "nav-h"
  }, g.group), g.items.map(it => /*#__PURE__*/React.createElement("a", {
    key: it.path,
    className: "nav-a",
    href: "#" + it.path,
    "aria-current": it.path === route.path ? "page" : undefined
  }, /*#__PURE__*/React.createElement(Icon, {
    name: it.icon,
    size: 17
  }), it.label, it.count && /*#__PURE__*/React.createElement("span", {
    className: "n"
  }, it.count))))), /*#__PURE__*/React.createElement("div", {
    className: "side-foot"
  }, "Lan Onasis LLC", /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("a", {
    href: "https://www.lanonasis.com",
    target: "_blank",
    rel: "noreferrer"
  }, "lanonasis.com"), " \xB7 ", /*#__PURE__*/React.createElement("a", {
    href: "https://github.com/lanonasis/onasis-brand-kit",
    target: "_blank",
    rel: "noreferrer"
  }, "GitHub"))), open && /*#__PURE__*/React.createElement("div", {
    className: "scrim-m",
    onClick: () => setOpen(false)
  }), /*#__PURE__*/React.createElement("div", {
    className: "main"
  }, /*#__PURE__*/React.createElement("header", {
    className: "top"
  }, /*#__PURE__*/React.createElement("div", {
    className: "crumbs"
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "icon-btn menu-btn",
    "aria-label": open ? "Close navigation" : "Open navigation",
    "aria-expanded": open,
    onClick: () => setOpen(!open)
  }, /*#__PURE__*/React.createElement(Icon, {
    name: open ? "x" : "menu",
    size: 19
  })), /*#__PURE__*/React.createElement("span", null, cur.group), /*#__PURE__*/React.createElement(Icon, {
    name: "chevron-right",
    size: 14
  }), /*#__PURE__*/React.createElement("b", null, cur.label)), /*#__PURE__*/React.createElement("div", {
    className: "top-r"
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "icon-btn",
    "aria-label": "Search",
    title: "Search (\u2318K)",
    onClick: () => setPal(true)
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "search",
    size: 17
  })), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "icon-btn",
    "aria-label": theme === "dark" ? "Switch to light theme" : "Switch to dark theme",
    title: "Toggle theme",
    onClick: toggleTheme
  }, /*#__PURE__*/React.createElement(Icon, {
    name: theme === "dark" ? "sun" : "moon",
    size: 17
  })), /*#__PURE__*/React.createElement("a", {
    className: "icon-btn",
    href: "https://github.com/lanonasis/onasis-brand-kit",
    target: "_blank",
    rel: "noreferrer",
    "aria-label": "Source on GitHub",
    title: "Source on GitHub"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "github",
    size: 17
  })))), /*#__PURE__*/React.createElement("main", {
    id: "main",
    tabIndex: -1,
    className: "content",
    key: route.path,
    style: {
      outline: "none"
    }
  }, children, /*#__PURE__*/React.createElement("nav", {
    className: "pn",
    "aria-label": "Pagination"
  }, prev && /*#__PURE__*/React.createElement("a", {
    href: "#" + prev.path
  }, /*#__PURE__*/React.createElement("span", null, "\u2190 Previous"), /*#__PURE__*/React.createElement("b", null, prev.label)), next && /*#__PURE__*/React.createElement("a", {
    className: "nx",
    href: "#" + next.path
  }, /*#__PURE__*/React.createElement("span", null, "Next \u2192"), /*#__PURE__*/React.createElement("b", null, next.label)))), /*#__PURE__*/React.createElement("footer", {
    className: "foot"
  }, /*#__PURE__*/React.createElement("span", null, "\xA9 2026 Lan Onasis LLC \xB7 Future \xB7 Strategy \xB7 Tech"), /*#__PURE__*/React.createElement("nav", {
    "aria-label": "Lan Onasis elsewhere"
  }, /*#__PURE__*/React.createElement("a", {
    href: "mailto:info@lanonasis.com"
  }, "info@lanonasis.com"), /*#__PURE__*/React.createElement("a", {
    href: "https://www.linkedin.com/company/lan-onasis",
    target: "_blank",
    rel: "noreferrer"
  }, "LinkedIn"), /*#__PURE__*/React.createElement("a", {
    href: "https://x.com/lanonasis",
    target: "_blank",
    rel: "noreferrer"
  }, "X"), /*#__PURE__*/React.createElement("a", {
    href: "https://instagram.com/lanonasis",
    target: "_blank",
    rel: "noreferrer"
  }, "Instagram"), /*#__PURE__*/React.createElement("a", {
    href: "https://facebook.com/lanonasis",
    target: "_blank",
    rel: "noreferrer"
  }, "Facebook")))), pal && /*#__PURE__*/React.createElement(Palette, {
    onClose: () => setPal(false)
  }), /*#__PURE__*/React.createElement(Toaster, null));
}
Object.assign(window, {
  NAV,
  FLAT,
  go,
  useRoute,
  Shell,
  toggleTheme
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "site/shell.jsx", error: String((e && e.message) || e) }); }

// site/ui.jsx
try { (() => {
/* Shared site primitives. Exported to window at the bottom (Babel scripts don't share scope). */

const NS = "LANOnasisDesignSystem_320289";
/* Read a design-system component; render a calm placeholder if the bundle is still compiling. */
function ds(name) {
  const lib = window[NS] || {};
  return lib[name] || function Pending() {
    return /*#__PURE__*/React.createElement("span", {
      className: "cap",
      style: {
        padding: "8px 12px",
        border: "1px dashed var(--border-default)",
        borderRadius: "var(--r-md)"
      }
    }, name, " is rebuilding \u2014 refresh in a moment");
  };
}

/* Lucide icon, rendered directly from lucide's icon data as React SVG.
   (lucide.createIcons() rescans the whole document on every call, which janked
   theme switches and page changes — this renders each icon once, in React.) */
const iconCache = {};
function iconNode(name) {
  if (iconCache[name] !== undefined) return iconCache[name];
  const L = window.lucide || {};
  const pascal = name.replace(/(^|-)([a-z0-9])/g, (_, __, c) => c.toUpperCase());
  let node = L.icons && L.icons[pascal] || L[pascal] || null;
  if (node && node[0] === "svg") node = node[2];
  iconCache[name] = node;
  return node;
}
const camel = k => k.replace(/-([a-z])/g, (_, c) => c.toUpperCase());
function Icon({
  name,
  size = 18,
  stroke = 2,
  className = "",
  label
}) {
  const node = iconNode(name);
  return /*#__PURE__*/React.createElement("svg", {
    className: "ic " + className,
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: stroke,
    strokeLinecap: "round",
    strokeLinejoin: "round",
    role: label ? "img" : undefined,
    "aria-label": label,
    "aria-hidden": label ? undefined : "true",
    style: {
      flexShrink: 0,
      display: "inline-block"
    }
  }, node && node.map(([tag, attrs], i) => {
    const p = {};
    for (const k in attrs) if (k !== "key") p[camel(k)] = attrs[k];
    return React.createElement(tag, {
      key: i,
      ...p
    });
  }));
}

/* Toast via a window event so any page can announce. */
function notify(msg) {
  window.dispatchEvent(new CustomEvent("ln-toast", {
    detail: msg
  }));
}
function copy(text, label) {
  const done = () => notify((label || "Copied") + " — " + (text.length > 40 ? text.slice(0, 40) + "…" : text));
  if (navigator.clipboard && window.isSecureContext) navigator.clipboard.writeText(text).then(done, () => notify("Copy unavailable in this browser"));else {
    const t = document.createElement("textarea");
    t.value = text;
    t.style.position = "fixed";
    t.style.opacity = "0";
    document.body.appendChild(t);
    t.select();
    try {
      document.execCommand("copy");
      done();
    } catch (e) {
      notify("Copy unavailable in this browser");
    }
    t.remove();
  }
}
function Toaster() {
  const [msg, setMsg] = React.useState(null);
  React.useEffect(() => {
    let t;
    const on = e => {
      setMsg(e.detail);
      clearTimeout(t);
      t = setTimeout(() => setMsg(null), 2200);
    };
    window.addEventListener("ln-toast", on);
    return () => window.removeEventListener("ln-toast", on);
  }, []);
  return msg ? /*#__PURE__*/React.createElement("div", {
    className: "toast",
    role: "status"
  }, /*#__PURE__*/React.createElement("i", null), msg) : /*#__PURE__*/React.createElement("div", {
    className: "sr",
    role: "status"
  });
}

/* Page scaffolding */
function Page({
  eyebrow,
  title,
  desc,
  children
}) {
  React.useEffect(() => {
    document.title = title + " — LAN Onasis Design System";
  }, [title]);
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("header", {
    className: "ph"
  }, eyebrow && /*#__PURE__*/React.createElement("div", {
    className: "eb"
  }, eyebrow), /*#__PURE__*/React.createElement("h1", null, title), desc && /*#__PURE__*/React.createElement("p", null, desc)), children);
}
function Sec({
  id,
  title,
  lead,
  children
}) {
  return /*#__PURE__*/React.createElement("section", {
    className: "sec",
    id: id
  }, title && /*#__PURE__*/React.createElement("h2", null, title), lead && /*#__PURE__*/React.createElement("p", {
    className: "lead"
  }, lead), children);
}
function Code({
  code,
  lang = "jsx"
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "code"
  }, /*#__PURE__*/React.createElement("pre", null, /*#__PURE__*/React.createElement("code", {
    style: {
      background: "none",
      padding: 0,
      color: "inherit",
      fontSize: "inherit"
    }
  }, code)), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "icon-btn",
    "aria-label": "Copy code",
    title: "Copy code",
    onClick: () => copy(code, "Code copied")
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "copy",
    size: 15
  })));
}

/* Tokens are parsed from the canonical stylesheet at runtime, so this site can
   never drift from colors_and_type.css. Values are resolved through computed style,
   which means the dark theme is reflected live. */
let tokenCache = null;
function useTokens(themeKey) {
  const [names, setNames] = React.useState(tokenCache);
  React.useEffect(() => {
    if (tokenCache) return;
    fetch("colors_and_type.css").then(r => r.text()).then(css => {
      const start = css.indexOf(":root");
      const block = css.slice(start, css.indexOf("\n}", start));
      const out = [];
      const re = /--([a-z0-9-]+)\s*:\s*([^;]+);(?:\s*\/\*\s*([^*]*?)\s*\*\/)?/gi;
      let m;
      while (m = re.exec(block)) out.push({
        name: "--" + m[1],
        raw: m[2].trim(),
        note: (m[3] || "").replace(/@kind\s+\w+/, "").trim()
      });
      tokenCache = out;
      setNames(out);
    }).catch(() => setNames([]));
  }, []);
  return React.useMemo(() => {
    if (!names) return null;
    const cs = getComputedStyle(document.documentElement);
    return names.map(t => ({
      ...t,
      value: cs.getPropertyValue(t.name).trim() || t.raw
    }));
  }, [names, themeKey]);
}
function useTheme() {
  const [theme, setThemeState] = React.useState(() => document.documentElement.getAttribute("data-theme") || "light");
  React.useEffect(() => {
    const obs = new MutationObserver(() => setThemeState(document.documentElement.getAttribute("data-theme") || "light"));
    obs.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"]
    });
    return () => obs.disconnect();
  }, []);
  return theme;
}

/* Readable ink for a swatch background */
function inkFor(hex) {
  const h = (hex || "").replace("#", "");
  if (h.length !== 6) return "var(--fg-1)";
  const [r, g, b] = [0, 2, 4].map(i => parseInt(h.slice(i, i + 2), 16) / 255).map(c => c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4));
  const L = 0.2126 * r + 0.7152 * g + 0.0722 * b;
  return L > 0.4 ? "#0D1C2F" : "#FFFFFF";
}
Object.assign(window, {
  NS,
  ds,
  Icon,
  notify,
  copy,
  Toaster,
  Page,
  Sec,
  Code,
  useTokens,
  useTheme,
  inkFor
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "site/ui.jsx", error: String((e && e.message) || e) }); }

// ui_kits/dashboard/ChartCard.jsx
try { (() => {
/* global React */

function ChartCard() {
  React.useEffect(() => {
    window.lucide && window.lucide.createIcons();
  });
  // Generate a smooth synthetic curve
  const W = 760,
    H = 220,
    N = 60;
  const data = Array.from({
    length: N
  }, (_, i) => {
    const t = i / (N - 1);
    return 50 + 30 * Math.sin(t * 6) + 18 * Math.sin(t * 11) + 22 * t * 100 / 100;
  });
  const max = Math.max(...data) + 10;
  const min = Math.min(...data) - 10;
  const range = max - min;
  const xs = data.map((_, i) => i / (N - 1) * W);
  const ys = data.map(v => H - (v - min) / range * H);
  const path = xs.map((x, i) => `${i === 0 ? "M" : "L"}${x.toFixed(1)},${ys[i].toFixed(1)}`).join(" ");
  const area = path + ` L${W},${H} L0,${H} Z`;
  const labels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  return /*#__PURE__*/React.createElement("section", {
    className: "card chart-card"
  }, /*#__PURE__*/React.createElement("header", {
    className: "card-head"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "card-eyebrow"
  }, "Last 7 days"), /*#__PURE__*/React.createElement("h2", {
    className: "card-title"
  }, "Request volume")), /*#__PURE__*/React.createElement("div", {
    className: "seg"
  }, /*#__PURE__*/React.createElement("button", null, "1h"), /*#__PURE__*/React.createElement("button", null, "24h"), /*#__PURE__*/React.createElement("button", {
    "data-active": true
  }, "7d"), /*#__PURE__*/React.createElement("button", null, "30d"))), /*#__PURE__*/React.createElement("div", {
    className: "chart"
  }, /*#__PURE__*/React.createElement("svg", {
    viewBox: `0 0 ${W} ${H}`,
    preserveAspectRatio: "none"
  }, /*#__PURE__*/React.createElement("defs", null, /*#__PURE__*/React.createElement("linearGradient", {
    id: "ag",
    x1: "0",
    x2: "0",
    y1: "0",
    y2: "1"
  }, /*#__PURE__*/React.createElement("stop", {
    offset: "0",
    stopColor: "#00D4AA",
    stopOpacity: "0.32"
  }), /*#__PURE__*/React.createElement("stop", {
    offset: "1",
    stopColor: "#00D4AA",
    stopOpacity: "0"
  }))), [0.25, 0.5, 0.75].map(p => /*#__PURE__*/React.createElement("line", {
    key: p,
    x1: "0",
    x2: W,
    y1: H * p,
    y2: H * p,
    stroke: "rgba(27,54,93,.06)",
    strokeDasharray: "3 3"
  })), /*#__PURE__*/React.createElement("path", {
    d: area,
    fill: "url(#ag)"
  }), /*#__PURE__*/React.createElement("path", {
    d: path,
    fill: "none",
    stroke: "#00D4AA",
    strokeWidth: "2.5"
  }))), /*#__PURE__*/React.createElement("div", {
    className: "chart-x"
  }, labels.map(l => /*#__PURE__*/React.createElement("span", {
    key: l
  }, l))));
}
window.ChartCard = ChartCard;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/dashboard/ChartCard.jsx", error: String((e && e.message) || e) }); }

// ui_kits/dashboard/DashModal.jsx
try { (() => {
/* global React */

function DashModal({
  title,
  children,
  onClose,
  footer
}) {
  React.useEffect(() => {
    window.lucide && window.lucide.createIcons();
    const onEsc = e => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onEsc);
    return () => document.removeEventListener("keydown", onEsc);
  }, [onClose]);
  return /*#__PURE__*/React.createElement("div", {
    className: "scrim",
    onMouseDown: onClose
  }, /*#__PURE__*/React.createElement("div", {
    className: "modal",
    onMouseDown: e => e.stopPropagation()
  }, /*#__PURE__*/React.createElement("header", {
    className: "modal-head"
  }, /*#__PURE__*/React.createElement("h3", null, title), /*#__PURE__*/React.createElement("button", {
    className: "btn-icon-sm",
    onClick: onClose
  }, /*#__PURE__*/React.createElement("i", {
    "data-lucide": "x"
  }))), /*#__PURE__*/React.createElement("div", {
    className: "modal-body"
  }, children), footer && /*#__PURE__*/React.createElement("div", {
    className: "modal-foot"
  }, footer)));
}
window.DashModal = DashModal;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/dashboard/DashModal.jsx", error: String((e && e.message) || e) }); }

// ui_kits/dashboard/KpiRow.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/* global React */

function Sparkline({
  data,
  up
}) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const W = 120,
    H = 32;
  const pts = data.map((v, i) => {
    const x = i / (data.length - 1) * W;
    const y = H - (v - min) / range * (H - 4) - 2;
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  }).join(" ");
  return /*#__PURE__*/React.createElement("svg", {
    className: "sparkline",
    viewBox: `0 0 ${W} ${H}`,
    preserveAspectRatio: "none"
  }, /*#__PURE__*/React.createElement("polyline", {
    points: pts,
    fill: "none",
    stroke: up ? "var(--ln-green-500)" : "var(--status-danger)",
    strokeWidth: "2"
  }));
}
function KpiCard({
  label,
  value,
  unit,
  delta,
  up,
  spark
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "kpi"
  }, /*#__PURE__*/React.createElement("div", {
    className: "kpi-l"
  }, label), /*#__PURE__*/React.createElement("div", {
    className: "kpi-line"
  }, /*#__PURE__*/React.createElement("div", {
    className: "kpi-v"
  }, value, unit && /*#__PURE__*/React.createElement("small", null, unit)), /*#__PURE__*/React.createElement(Sparkline, {
    data: spark,
    up: up
  })), /*#__PURE__*/React.createElement("div", {
    className: "kpi-d " + (up ? "up" : "down")
  }, /*#__PURE__*/React.createElement("i", {
    "data-lucide": up ? "trending-up" : "trending-down"
  }), delta, " ", /*#__PURE__*/React.createElement("span", null, "vs last 7 days")));
}
function KpiRow() {
  React.useEffect(() => {
    window.lucide && window.lucide.createIcons();
  });
  const data = [{
    label: "Requests / 24h",
    value: "8.42",
    unit: "M",
    delta: "+12.4%",
    up: true,
    spark: [12, 14, 13, 16, 18, 17, 22, 24, 28, 26, 30, 34]
  }, {
    label: "P95 latency",
    value: "38",
    unit: "ms",
    delta: "−4.2 ms",
    up: true,
    spark: [48, 46, 44, 45, 42, 40, 41, 39, 40, 38, 38, 37]
  }, {
    label: "Active memories",
    value: "142",
    unit: "k",
    delta: "+1,204",
    up: true,
    spark: [120, 122, 125, 128, 130, 132, 134, 136, 138, 140, 141, 142]
  }, {
    label: "Error rate",
    value: "0.04",
    unit: "%",
    delta: "+0.01%",
    up: false,
    spark: [0.02, 0.03, 0.02, 0.03, 0.04, 0.05, 0.04, 0.04, 0.05, 0.04, 0.04, 0.04]
  }];
  return /*#__PURE__*/React.createElement("div", {
    className: "kpi-grid"
  }, data.map(k => /*#__PURE__*/React.createElement(KpiCard, _extends({
    key: k.label
  }, k))));
}
window.KpiRow = KpiRow;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/dashboard/KpiRow.jsx", error: String((e && e.message) || e) }); }

// ui_kits/dashboard/MemoriesTable.jsx
try { (() => {
/* global React */

const ROWS = [{
  id: "mem_8af3c1",
  name: "credit-scoring-v3",
  region: "af-west-1",
  owner: "Ada O.",
  size: "12.4 MB",
  status: "live",
  updated: "2m ago"
}, {
  id: "mem_7c2e90",
  name: "kyc-doc-extractor",
  region: "af-west-1",
  owner: "Tunde A.",
  size: "3.1 MB",
  status: "live",
  updated: "14m ago"
}, {
  id: "mem_9bd417",
  name: "agent-policy-store",
  region: "af-east-1",
  owner: "Ngozi E.",
  size: "84.0 MB",
  status: "live",
  updated: "1h ago"
}, {
  id: "mem_2fa088",
  name: "merchant-risk-graph",
  region: "af-west-1",
  owner: "Ada O.",
  size: "208.3 MB",
  status: "syncing",
  updated: "3h ago"
}, {
  id: "mem_1ce302",
  name: "doyen-fleet-trips",
  region: "af-east-1",
  owner: "Kemi A.",
  size: "44.7 MB",
  status: "live",
  updated: "1d ago"
}, {
  id: "mem_5dd711",
  name: "legacy-core-banking",
  region: "eu-west-3",
  owner: "Tunde A.",
  size: "1.2 GB",
  status: "paused",
  updated: "3d ago"
}, {
  id: "mem_4ab209",
  name: "support-faq-cache",
  region: "af-west-1",
  owner: "Ngozi E.",
  size: "0.9 MB",
  status: "error",
  updated: "5d ago"
}];
const STATUS = {
  live: {
    c: "ok",
    l: "Live"
  },
  syncing: {
    c: "info",
    l: "Syncing"
  },
  paused: {
    c: "warn",
    l: "Paused"
  },
  error: {
    c: "err",
    l: "Error"
  }
};
function MemoriesTable({
  query
}) {
  React.useEffect(() => {
    window.lucide && window.lucide.createIcons();
  });
  const q = (query || "").toLowerCase();
  const rows = ROWS.filter(r => !q || r.name.includes(q) || r.id.includes(q) || r.owner.toLowerCase().includes(q));
  return /*#__PURE__*/React.createElement("section", {
    className: "card"
  }, /*#__PURE__*/React.createElement("header", {
    className: "card-head"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h2", {
    className: "card-title"
  }, "Memories"), /*#__PURE__*/React.createElement("div", {
    className: "card-sub"
  }, rows.length, " of ", ROWS.length, " shown")), /*#__PURE__*/React.createElement("div", {
    className: "card-actions"
  }, /*#__PURE__*/React.createElement("button", {
    className: "btn btn-outline btn-sm"
  }, /*#__PURE__*/React.createElement("i", {
    "data-lucide": "filter"
  }), "Filter"), /*#__PURE__*/React.createElement("button", {
    className: "btn btn-primary btn-sm"
  }, /*#__PURE__*/React.createElement("i", {
    "data-lucide": "plus"
  }), "New memory"))), /*#__PURE__*/React.createElement("div", {
    className: "tbl-wrap"
  }, /*#__PURE__*/React.createElement("table", {
    className: "tbl"
  }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", null, "Name"), /*#__PURE__*/React.createElement("th", null, "ID"), /*#__PURE__*/React.createElement("th", null, "Region"), /*#__PURE__*/React.createElement("th", null, "Owner"), /*#__PURE__*/React.createElement("th", null, "Size"), /*#__PURE__*/React.createElement("th", null, "Status"), /*#__PURE__*/React.createElement("th", null, "Updated"), /*#__PURE__*/React.createElement("th", null))), /*#__PURE__*/React.createElement("tbody", null, rows.map(r => {
    const s = STATUS[r.status];
    return /*#__PURE__*/React.createElement("tr", {
      key: r.id
    }, /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("div", {
      className: "tbl-name"
    }, r.name)), /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("code", null, r.id)), /*#__PURE__*/React.createElement("td", null, r.region), /*#__PURE__*/React.createElement("td", null, r.owner), /*#__PURE__*/React.createElement("td", {
      className: "tbl-num"
    }, r.size), /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("span", {
      className: "pill pill-" + s.c
    }, /*#__PURE__*/React.createElement("span", {
      className: "pill-dot"
    }), s.l)), /*#__PURE__*/React.createElement("td", {
      className: "tbl-muted"
    }, r.updated), /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("button", {
      className: "tbl-row-action"
    }, /*#__PURE__*/React.createElement("i", {
      "data-lucide": "more-horizontal"
    }))));
  }), rows.length === 0 && /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("td", {
    colSpan: "8",
    className: "tbl-empty"
  }, "No memories match \"", query, "\""))))));
}
window.MemoriesTable = MemoriesTable;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/dashboard/MemoriesTable.jsx", error: String((e && e.message) || e) }); }

// ui_kits/dashboard/SettingsPane.jsx
try { (() => {
/* global React */
const {
  useState
} = React;
function SettingsPane({
  openModal
}) {
  React.useEffect(() => {
    window.lucide && window.lucide.createIcons();
  });
  const [region, setRegion] = useState("af-west-1");
  return /*#__PURE__*/React.createElement("div", {
    className: "settings"
  }, /*#__PURE__*/React.createElement("section", {
    className: "card"
  }, /*#__PURE__*/React.createElement("header", {
    className: "card-head"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h2", {
    className: "card-title"
  }, "API keys"), /*#__PURE__*/React.createElement("div", {
    className: "card-sub"
  }, "Used by your services to call the LAN Onasis platform.")), /*#__PURE__*/React.createElement("button", {
    className: "btn btn-primary btn-sm",
    onClick: openModal
  }, /*#__PURE__*/React.createElement("i", {
    "data-lucide": "plus"
  }), "Generate key")), /*#__PURE__*/React.createElement("ul", {
    className: "key-list"
  }, /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("div", {
    className: "key-name"
  }, "production-af-west"), /*#__PURE__*/React.createElement("code", {
    className: "key-val"
  }, "ln_sk_live_\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u20228a4f"), /*#__PURE__*/React.createElement("span", {
    className: "pill pill-ok"
  }, /*#__PURE__*/React.createElement("span", {
    className: "pill-dot"
  }), "Active"), /*#__PURE__*/React.createElement("button", {
    className: "btn-icon-sm",
    title: "Rotate"
  }, /*#__PURE__*/React.createElement("i", {
    "data-lucide": "rotate-cw"
  }))), /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("div", {
    className: "key-name"
  }, "staging"), /*#__PURE__*/React.createElement("code", {
    className: "key-val"
  }, "ln_sk_test_\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u20222c91"), /*#__PURE__*/React.createElement("span", {
    className: "pill pill-info"
  }, /*#__PURE__*/React.createElement("span", {
    className: "pill-dot"
  }), "Test"), /*#__PURE__*/React.createElement("button", {
    className: "btn-icon-sm",
    title: "Rotate"
  }, /*#__PURE__*/React.createElement("i", {
    "data-lucide": "rotate-cw"
  }))), /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("div", {
    className: "key-name"
  }, "ada@lanonasis.com (personal)"), /*#__PURE__*/React.createElement("code", {
    className: "key-val"
  }, "ln_sk_test_\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022f018"), /*#__PURE__*/React.createElement("span", {
    className: "pill pill-warn"
  }, /*#__PURE__*/React.createElement("span", {
    className: "pill-dot"
  }), "Expires in 4 days"), /*#__PURE__*/React.createElement("button", {
    className: "btn-icon-sm",
    title: "Rotate"
  }, /*#__PURE__*/React.createElement("i", {
    "data-lucide": "rotate-cw"
  }))))), /*#__PURE__*/React.createElement("section", {
    className: "card"
  }, /*#__PURE__*/React.createElement("header", {
    className: "card-head"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h2", {
    className: "card-title"
  }, "Region"), /*#__PURE__*/React.createElement("div", {
    className: "card-sub"
  }, "Data residency for new memories."))), /*#__PURE__*/React.createElement("div", {
    className: "region-grid"
  }, ["af-west-1 · Lagos", "af-east-1 · Nairobi", "eu-west-3 · Paris", "us-east-1 · Virginia"].map(r => {
    const id = r.split(" · ")[0];
    return /*#__PURE__*/React.createElement("label", {
      key: r,
      className: "region-card " + (id === region ? "is-active" : "")
    }, /*#__PURE__*/React.createElement("input", {
      type: "radio",
      name: "region",
      checked: id === region,
      onChange: () => setRegion(id)
    }), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
      className: "region-id"
    }, id), /*#__PURE__*/React.createElement("div", {
      className: "region-loc"
    }, r.split(" · ")[1])), id === region && /*#__PURE__*/React.createElement("i", {
      "data-lucide": "check"
    }));
  }))), /*#__PURE__*/React.createElement("section", {
    className: "card card-danger"
  }, /*#__PURE__*/React.createElement("header", {
    className: "card-head"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h2", {
    className: "card-title"
  }, "Danger zone"), /*#__PURE__*/React.createElement("div", {
    className: "card-sub"
  }, "Irreversible. Requires owner confirmation."))), /*#__PURE__*/React.createElement("div", {
    className: "danger-row"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "danger-l"
  }, "Delete workspace"), /*#__PURE__*/React.createElement("div", {
    className: "danger-d"
  }, "Removes all memories, keys, and audit logs after a 7-day grace period.")), /*#__PURE__*/React.createElement("button", {
    className: "btn btn-danger btn-sm"
  }, "Delete workspace\u2026"))));
}
window.SettingsPane = SettingsPane;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/dashboard/SettingsPane.jsx", error: String((e && e.message) || e) }); }

// ui_kits/dashboard/Sidebar.jsx
try { (() => {
/* global React */

function SidebarItem({
  icon,
  label,
  active,
  badge,
  onClick
}) {
  return /*#__PURE__*/React.createElement("button", {
    className: "sb-item",
    "data-active": active || undefined,
    onClick: onClick
  }, /*#__PURE__*/React.createElement("i", {
    "data-lucide": icon
  }), /*#__PURE__*/React.createElement("span", null, label), badge && /*#__PURE__*/React.createElement("span", {
    className: "sb-badge"
  }, badge));
}
function Sidebar({
  view,
  setView
}) {
  React.useEffect(() => {
    window.lucide && window.lucide.createIcons();
  }, [view]);
  return /*#__PURE__*/React.createElement("aside", {
    className: "sb"
  }, /*#__PURE__*/React.createElement("div", {
    className: "sb-brand"
  }, /*#__PURE__*/React.createElement("img", {
    src: "../../assets/logos/app-icon-64.png",
    alt: ""
  }), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "sb-brand-name"
  }, "VortexCore"), /*#__PURE__*/React.createElement("div", {
    className: "sb-brand-org"
  }, "Lan Onasis \xB7 af-west-1"))), /*#__PURE__*/React.createElement("div", {
    className: "sb-section"
  }, /*#__PURE__*/React.createElement("div", {
    className: "sb-section-h"
  }, "Workspace"), /*#__PURE__*/React.createElement(SidebarItem, {
    icon: "layout-dashboard",
    label: "Overview",
    active: view === "overview",
    onClick: () => setView("overview")
  }), /*#__PURE__*/React.createElement(SidebarItem, {
    icon: "layers",
    label: "Memories",
    badge: "142",
    active: view === "memories",
    onClick: () => setView("memories")
  }), /*#__PURE__*/React.createElement(SidebarItem, {
    icon: "bar-chart-3",
    label: "Analytics"
  }), /*#__PURE__*/React.createElement(SidebarItem, {
    icon: "terminal",
    label: "API explorer"
  })), /*#__PURE__*/React.createElement("div", {
    className: "sb-section"
  }, /*#__PURE__*/React.createElement("div", {
    className: "sb-section-h"
  }, "Platform"), /*#__PURE__*/React.createElement(SidebarItem, {
    icon: "key-round",
    label: "API keys"
  }), /*#__PURE__*/React.createElement(SidebarItem, {
    icon: "users",
    label: "Team"
  }), /*#__PURE__*/React.createElement(SidebarItem, {
    icon: "shield-check",
    label: "Audit log"
  }), /*#__PURE__*/React.createElement(SidebarItem, {
    icon: "settings",
    label: "Settings",
    active: view === "settings",
    onClick: () => setView("settings")
  })), /*#__PURE__*/React.createElement("div", {
    className: "sb-foot"
  }, /*#__PURE__*/React.createElement("div", {
    className: "sb-status"
  }, /*#__PURE__*/React.createElement("span", {
    className: "dot"
  }), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "sb-status-l"
  }, "All systems operational"), /*#__PURE__*/React.createElement("div", {
    className: "sb-status-d"
  }, "99.99% \xB7 trailing 30d")))));
}
window.Sidebar = Sidebar;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/dashboard/Sidebar.jsx", error: String((e && e.message) || e) }); }

// ui_kits/dashboard/TopBar.jsx
try { (() => {
/* global React */

function TopBar({
  title,
  query,
  setQuery
}) {
  React.useEffect(() => {
    window.lucide && window.lucide.createIcons();
  });
  return /*#__PURE__*/React.createElement("header", {
    className: "tb"
  }, /*#__PURE__*/React.createElement("div", {
    className: "tb-l"
  }, /*#__PURE__*/React.createElement("h1", {
    className: "tb-title"
  }, title)), /*#__PURE__*/React.createElement("div", {
    className: "tb-r"
  }, /*#__PURE__*/React.createElement("div", {
    className: "tb-search"
  }, /*#__PURE__*/React.createElement("i", {
    "data-lucide": "search"
  }), /*#__PURE__*/React.createElement("input", {
    placeholder: "Search memories, keys, requests\u2026",
    value: query || "",
    onChange: e => setQuery && setQuery(e.target.value)
  }), /*#__PURE__*/React.createElement("kbd", null, "\u2318K")), /*#__PURE__*/React.createElement("button", {
    className: "tb-icon",
    title: "Region"
  }, /*#__PURE__*/React.createElement("span", {
    className: "tb-region"
  }, /*#__PURE__*/React.createElement("span", {
    className: "dot"
  }), "af-west-1")), /*#__PURE__*/React.createElement("button", {
    className: "tb-icon",
    title: "Notifications"
  }, /*#__PURE__*/React.createElement("i", {
    "data-lucide": "bell"
  }), /*#__PURE__*/React.createElement("span", {
    className: "tb-icon-dot"
  })), /*#__PURE__*/React.createElement("button", {
    className: "tb-avatar",
    title: "Account"
  }, /*#__PURE__*/React.createElement("span", null, "AO"))));
}
window.TopBar = TopBar;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/dashboard/TopBar.jsx", error: String((e && e.message) || e) }); }

// ui_kits/web/CtaBlock.jsx
try { (() => {
/* global React */

function CtaBlock({
  onPrimary
}) {
  return /*#__PURE__*/React.createElement("section", {
    className: "cta-block"
  }, /*#__PURE__*/React.createElement("div", {
    className: "cta-inner"
  }, /*#__PURE__*/React.createElement("h2", {
    className: "h1 h1-on-dark"
  }, "Ready when you are."), /*#__PURE__*/React.createElement("p", {
    className: "lede lede-on-dark"
  }, "A 30-minute walk-through with a solutions engineer. No slides \u2014 just your stack and our platform."), /*#__PURE__*/React.createElement("div", {
    className: "cta-actions"
  }, /*#__PURE__*/React.createElement("button", {
    className: "btn btn-primary btn-lg",
    onClick: onPrimary
  }, "Get a demo"), /*#__PURE__*/React.createElement("a", {
    className: "btn btn-ghost-on-dark btn-lg",
    href: "#"
  }, "Talk to sales"))));
}
window.CtaBlock = CtaBlock;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/web/CtaBlock.jsx", error: String((e && e.message) || e) }); }

// ui_kits/web/EcosystemBand.jsx
try { (() => {
/* global React */

function EcosystemBand() {
  const stats = [{
    v: "99.99%",
    k: "Uptime SLA",
    d: "Trailing 12 mo"
  }, {
    v: "38ms",
    k: "P95 latency",
    d: "af-west-1"
  }, {
    v: "₦12.4B+",
    k: "Processed",
    d: "Annualized"
  }, {
    v: "4",
    k: "Regions",
    d: "Africa + EU edge"
  }];
  return /*#__PURE__*/React.createElement("section", {
    className: "band"
  }, /*#__PURE__*/React.createElement("div", {
    className: "band-inner"
  }, /*#__PURE__*/React.createElement("div", {
    className: "band-head"
  }, /*#__PURE__*/React.createElement("div", {
    className: "eyebrow eyebrow-on-dark"
  }, "Ecosystem"), /*#__PURE__*/React.createElement("h2", {
    className: "h2 h2-on-dark"
  }, "Enterprise-grade", /*#__PURE__*/React.createElement("br", null), "by every measure.")), /*#__PURE__*/React.createElement("div", {
    className: "band-stats"
  }, stats.map(s => /*#__PURE__*/React.createElement("div", {
    className: "band-stat",
    key: s.k
  }, /*#__PURE__*/React.createElement("div", {
    className: "band-stat-v"
  }, s.v), /*#__PURE__*/React.createElement("div", {
    className: "band-stat-k"
  }, s.k), /*#__PURE__*/React.createElement("div", {
    className: "band-stat-d"
  }, s.d))))));
}
window.EcosystemBand = EcosystemBand;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/web/EcosystemBand.jsx", error: String((e && e.message) || e) }); }

// ui_kits/web/Footer.jsx
try { (() => {
/* global React */

function Footer() {
  const cols = [{
    h: "Platform",
    links: ["VortexCore AI", "Memory as a Service", "OnasisGateway", "Pricing"]
  }, {
    h: "Solutions",
    links: ["Financial Services", "Logistics", "Enterprise", "Developers"]
  }, {
    h: "Resources",
    links: ["Docs", "Status", "Changelog", "Blog"]
  }, {
    h: "Company",
    links: ["About", "Customers", "Careers", "Contact"]
  }];
  return /*#__PURE__*/React.createElement("footer", {
    className: "footer"
  }, /*#__PURE__*/React.createElement("div", {
    className: "footer-inner"
  }, /*#__PURE__*/React.createElement("div", {
    className: "footer-brand"
  }, /*#__PURE__*/React.createElement("img", {
    src: "../../assets/logos/wordmark-lockup-on-dark.png",
    alt: "LAN Onasis"
  }), /*#__PURE__*/React.createElement("p", {
    className: "footer-tag"
  }, "Powering Africa's digital future. Enterprise SaaS \u2014 built local, built for scale."), /*#__PURE__*/React.createElement("div", {
    className: "footer-region"
  }, /*#__PURE__*/React.createElement("span", {
    className: "dot"
  }), " All systems operational \xB7 af-west-1")), /*#__PURE__*/React.createElement("div", {
    className: "footer-cols"
  }, cols.map(c => /*#__PURE__*/React.createElement("div", {
    className: "footer-col",
    key: c.h
  }, /*#__PURE__*/React.createElement("div", {
    className: "footer-col-h"
  }, c.h), c.links.map(l => /*#__PURE__*/React.createElement("a", {
    href: "#",
    key: l
  }, l)))))), /*#__PURE__*/React.createElement("div", {
    className: "footer-sub"
  }, /*#__PURE__*/React.createElement("div", null, "\xA9 2026 LAN Onasis. All rights reserved."), /*#__PURE__*/React.createElement("div", {
    className: "footer-sub-links"
  }, /*#__PURE__*/React.createElement("a", {
    href: "#"
  }, "Privacy"), /*#__PURE__*/React.createElement("a", {
    href: "#"
  }, "Terms"), /*#__PURE__*/React.createElement("a", {
    href: "#"
  }, "Security"), /*#__PURE__*/React.createElement("a", {
    href: "#"
  }, "Cookies"))));
}
window.Footer = Footer;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/web/Footer.jsx", error: String((e && e.message) || e) }); }

// ui_kits/web/Hero.jsx
try { (() => {
/* global React */

function Hero({
  onPrimary
}) {
  return /*#__PURE__*/React.createElement("section", {
    className: "hero"
  }, /*#__PURE__*/React.createElement("div", {
    className: "hero-grid"
  }, /*#__PURE__*/React.createElement("div", {
    className: "hero-copy"
  }, /*#__PURE__*/React.createElement("div", {
    className: "eyebrow"
  }, "Africa-built \xB7 Enterprise SaaS"), /*#__PURE__*/React.createElement("h1", {
    className: "display"
  }, "Powering Africa's", /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("span", {
    className: "display-accent"
  }, "digital future.")), /*#__PURE__*/React.createElement("p", {
    className: "lede"
  }, "LAN Onasis builds intelligent, secure, and scalable infrastructure for financial services, logistics, AI, and enterprise platforms. One brand. One stack. Built for the continent."), /*#__PURE__*/React.createElement("div", {
    className: "hero-ctas"
  }, /*#__PURE__*/React.createElement("button", {
    className: "btn btn-primary btn-lg",
    onClick: onPrimary
  }, "Get a demo"), /*#__PURE__*/React.createElement("a", {
    className: "btn btn-outline btn-lg",
    href: "#"
  }, "Read the docs ", /*#__PURE__*/React.createElement("span", {
    className: "arrow"
  }, "\u2192"))), /*#__PURE__*/React.createElement("div", {
    className: "hero-meta"
  }, /*#__PURE__*/React.createElement("span", {
    className: "dot"
  }), /*#__PURE__*/React.createElement("span", null, "SOC 2 Type II \xB7 ISO 27001 \xB7 99.99% uptime SLA"))), /*#__PURE__*/React.createElement("div", {
    className: "hero-art",
    "aria-hidden": "true"
  }, /*#__PURE__*/React.createElement("div", {
    className: "hero-card"
  }, /*#__PURE__*/React.createElement("div", {
    className: "hero-card-head"
  }, /*#__PURE__*/React.createElement("img", {
    src: "../../assets/logos/app-icon-64.png",
    alt: ""
  }), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "hero-card-title"
  }, "VortexCore"), /*#__PURE__*/React.createElement("div", {
    className: "hero-card-sub"
  }, "af-west-1 \xB7 operational")), /*#__PURE__*/React.createElement("span", {
    className: "badge badge-success"
  }, /*#__PURE__*/React.createElement("span", {
    className: "dot-sm"
  }), "Live")), /*#__PURE__*/React.createElement("div", {
    className: "hero-card-grid"
  }, /*#__PURE__*/React.createElement("div", {
    className: "hero-stat"
  }, /*#__PURE__*/React.createElement("div", {
    className: "hero-stat-k"
  }, "Requests / min"), /*#__PURE__*/React.createElement("div", {
    className: "hero-stat-v"
  }, "142,309"), /*#__PURE__*/React.createElement("div", {
    className: "hero-stat-d up"
  }, "+12.4% vs avg")), /*#__PURE__*/React.createElement("div", {
    className: "hero-stat"
  }, /*#__PURE__*/React.createElement("div", {
    className: "hero-stat-k"
  }, "P95 latency"), /*#__PURE__*/React.createElement("div", {
    className: "hero-stat-v"
  }, "38", /*#__PURE__*/React.createElement("small", null, "ms")), /*#__PURE__*/React.createElement("div", {
    className: "hero-stat-d"
  }, "af-west-1"))), /*#__PURE__*/React.createElement("div", {
    className: "hero-spark"
  }, /*#__PURE__*/React.createElement("svg", {
    viewBox: "0 0 280 60",
    preserveAspectRatio: "none"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M0,42 L20,38 L40,40 L60,32 L80,28 L100,30 L120,22 L140,24 L160,18 L180,12 L200,16 L220,8 L240,12 L260,6 L280,4",
    fill: "none",
    stroke: "#00D4AA",
    strokeWidth: "2"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M0,42 L20,38 L40,40 L60,32 L80,28 L100,30 L120,22 L140,24 L160,18 L180,12 L200,16 L220,8 L240,12 L260,6 L280,4 L280,60 L0,60 Z",
    fill: "url(#g)",
    opacity: "0.25"
  }), /*#__PURE__*/React.createElement("defs", null, /*#__PURE__*/React.createElement("linearGradient", {
    id: "g",
    x1: "0",
    x2: "0",
    y1: "0",
    y2: "1"
  }, /*#__PURE__*/React.createElement("stop", {
    offset: "0",
    stopColor: "#00D4AA"
  }), /*#__PURE__*/React.createElement("stop", {
    offset: "1",
    stopColor: "#00D4AA",
    stopOpacity: "0"
  })))))))));
}
window.Hero = Hero;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/web/Hero.jsx", error: String((e && e.message) || e) }); }

// ui_kits/web/Nav.jsx
try { (() => {
/* global React */
const {
  useState
} = React;
function NavLink({
  href,
  children,
  active
}) {
  return /*#__PURE__*/React.createElement("a", {
    href: href,
    className: "nav-link",
    "data-active": active || undefined
  }, children);
}
function Nav({
  onCta
}) {
  const [open, setOpen] = useState(null);
  return /*#__PURE__*/React.createElement("header", {
    className: "nav"
  }, /*#__PURE__*/React.createElement("div", {
    className: "nav-inner"
  }, /*#__PURE__*/React.createElement("a", {
    href: "#",
    className: "nav-brand"
  }, /*#__PURE__*/React.createElement("img", {
    src: "../../assets/logos/app-icon-64.png",
    alt: "LAN Onasis",
    className: "nav-brand-icon"
  }), /*#__PURE__*/React.createElement("span", {
    className: "nav-brand-word"
  }, "LAN ONASIS")), /*#__PURE__*/React.createElement("nav", {
    className: "nav-links"
  }, /*#__PURE__*/React.createElement("div", {
    className: "nav-item",
    onMouseEnter: () => setOpen("products"),
    onMouseLeave: () => setOpen(null)
  }, /*#__PURE__*/React.createElement(NavLink, {
    active: open === "products"
  }, "Products \u25BE"), open === "products" && /*#__PURE__*/React.createElement("div", {
    className: "nav-menu"
  }, /*#__PURE__*/React.createElement("div", {
    className: "nav-menu-col"
  }, /*#__PURE__*/React.createElement("div", {
    className: "nav-menu-eyebrow"
  }, "Platform"), /*#__PURE__*/React.createElement("a", {
    href: "#"
  }, "VortexCore AI"), /*#__PURE__*/React.createElement("a", {
    href: "#"
  }, "Memory as a Service"), /*#__PURE__*/React.createElement("a", {
    href: "#"
  }, "OnasisGateway")), /*#__PURE__*/React.createElement("div", {
    className: "nav-menu-col"
  }, /*#__PURE__*/React.createElement("div", {
    className: "nav-menu-eyebrow"
  }, "Verticals"), /*#__PURE__*/React.createElement("a", {
    href: "#"
  }, "Financial Services"), /*#__PURE__*/React.createElement("a", {
    href: "#"
  }, "Logistics"), /*#__PURE__*/React.createElement("a", {
    href: "#"
  }, "Enterprise")))), /*#__PURE__*/React.createElement(NavLink, null, "Solutions"), /*#__PURE__*/React.createElement(NavLink, null, "Developers"), /*#__PURE__*/React.createElement(NavLink, null, "Customers"), /*#__PURE__*/React.createElement(NavLink, null, "Pricing")), /*#__PURE__*/React.createElement("div", {
    className: "nav-actions"
  }, /*#__PURE__*/React.createElement("a", {
    href: "#",
    className: "nav-link"
  }, "Sign in"), /*#__PURE__*/React.createElement("button", {
    className: "btn btn-primary",
    onClick: onCta
  }, "Get a demo"))));
}
window.Nav = Nav;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/web/Nav.jsx", error: String((e && e.message) || e) }); }

// ui_kits/web/ProductGrid.jsx
try { (() => {
/* global React */

function ProductCard({
  icon,
  eyebrow,
  title,
  body,
  footer,
  onClick
}) {
  return /*#__PURE__*/React.createElement("button", {
    className: "product-card",
    onClick: onClick
  }, /*#__PURE__*/React.createElement("div", {
    className: "product-icon"
  }, /*#__PURE__*/React.createElement("i", {
    "data-lucide": icon
  })), /*#__PURE__*/React.createElement("div", {
    className: "product-eyebrow"
  }, eyebrow), /*#__PURE__*/React.createElement("div", {
    className: "product-title"
  }, title), /*#__PURE__*/React.createElement("p", {
    className: "product-body"
  }, body), /*#__PURE__*/React.createElement("div", {
    className: "product-foot"
  }, footer, " ", /*#__PURE__*/React.createElement("span", {
    className: "arrow"
  }, "\u2192")));
}
function ProductGrid({
  onSelect
}) {
  React.useEffect(() => {
    window.lucide && window.lucide.createIcons();
  });
  return /*#__PURE__*/React.createElement("section", {
    className: "section"
  }, /*#__PURE__*/React.createElement("div", {
    className: "section-inner"
  }, /*#__PURE__*/React.createElement("div", {
    className: "section-head"
  }, /*#__PURE__*/React.createElement("div", {
    className: "eyebrow"
  }, "Platform"), /*#__PURE__*/React.createElement("h2", {
    className: "h2"
  }, "Three products. One unified stack."), /*#__PURE__*/React.createElement("p", {
    className: "lede lede-narrow"
  }, "From compliance-ready AI to a memory layer for your agents to a unified API gateway \u2014 every product shares the same auth, audit, and observability surface.")), /*#__PURE__*/React.createElement("div", {
    className: "product-grid"
  }, /*#__PURE__*/React.createElement(ProductCard, {
    icon: "brain",
    eyebrow: "AI Platform",
    title: "VortexCore AI",
    body: "Compliance-aware business intelligence for enterprise. Credit assessment, risk, and predictive analytics \u2014 built for African markets.",
    footer: "Explore VortexCore",
    onClick: () => onSelect("VortexCore AI")
  }), /*#__PURE__*/React.createElement(ProductCard, {
    icon: "layers",
    eyebrow: "Infrastructure",
    title: "Memory as a Service",
    body: "Persistent, queryable memory for AI agents. Sub-50ms reads in af-west-1, with audit logs and key rotation built in.",
    footer: "Explore MaaS",
    onClick: () => onSelect("Memory as a Service")
  }), /*#__PURE__*/React.createElement(ProductCard, {
    icon: "cloud",
    eyebrow: "Integration",
    title: "OnasisGateway",
    body: "API gateway and workflow automation. One contract for legacy core banking, payments, and your modern microservices.",
    footer: "Explore Gateway",
    onClick: () => onSelect("OnasisGateway")
  }))));
}
window.ProductGrid = ProductGrid;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/web/ProductGrid.jsx", error: String((e && e.message) || e) }); }

// ui_kits/web/SplitFeature.jsx
try { (() => {
/* global React */

function SplitFeature() {
  React.useEffect(() => {
    window.lucide && window.lucide.createIcons();
  });
  return /*#__PURE__*/React.createElement("section", {
    className: "section section-muted"
  }, /*#__PURE__*/React.createElement("div", {
    className: "section-inner split"
  }, /*#__PURE__*/React.createElement("div", {
    className: "split-art"
  }, /*#__PURE__*/React.createElement("div", {
    className: "code-window"
  }, /*#__PURE__*/React.createElement("div", {
    className: "code-window-bar"
  }, /*#__PURE__*/React.createElement("span", {
    className: "cw-dot",
    style: {
      background: "#FF5F56"
    }
  }), /*#__PURE__*/React.createElement("span", {
    className: "cw-dot",
    style: {
      background: "#FFBD2E"
    }
  }), /*#__PURE__*/React.createElement("span", {
    className: "cw-dot",
    style: {
      background: "#27C93F"
    }
  }), /*#__PURE__*/React.createElement("div", {
    className: "cw-title"
  }, "vortex-deploy.sh")), /*#__PURE__*/React.createElement("pre", {
    className: "code-block"
  }, `$ npx @lanonasis/cli deploy
  ↳ Building memory store...     ✓ 2.3s
  ↳ Provisioning af-west-1...    ✓ 4.1s
  ↳ Rotating keys...             ✓ 0.8s
  ↳ Health check...              ✓ 38ms

Deployed to https://api.lanonasis.com
`))), /*#__PURE__*/React.createElement("div", {
    className: "split-copy"
  }, /*#__PURE__*/React.createElement("div", {
    className: "eyebrow"
  }, "Developer experience"), /*#__PURE__*/React.createElement("h2", {
    className: "h2"
  }, "Ship in five minutes.", /*#__PURE__*/React.createElement("br", null), "Audit forever."), /*#__PURE__*/React.createElement("p", {
    className: "lede"
  }, "One CLI, one SDK, one set of credentials. Every call is signed, logged, and queryable \u2014 no separate audit pipeline to wire up."), /*#__PURE__*/React.createElement("ul", {
    className: "checks"
  }, /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("span", {
    className: "check"
  }, /*#__PURE__*/React.createElement("i", {
    "data-lucide": "check"
  })), "Native TypeScript, Python, and Go SDKs"), /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("span", {
    className: "check"
  }, /*#__PURE__*/React.createElement("i", {
    "data-lucide": "check"
  })), "Zero-trust auth with key rotation by default"), /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("span", {
    className: "check"
  }, /*#__PURE__*/React.createElement("i", {
    "data-lucide": "check"
  })), "Full audit trail surfaced in your existing SIEM"), /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("span", {
    className: "check"
  }, /*#__PURE__*/React.createElement("i", {
    "data-lucide": "check"
  })), "Region-pinned data residency (af-west-1, af-east-1)")), /*#__PURE__*/React.createElement("a", {
    href: "#",
    className: "btn btn-secondary"
  }, "Read the integration guide"))));
}
window.SplitFeature = SplitFeature;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/web/SplitFeature.jsx", error: String((e && e.message) || e) }); }

// ui_kits/web/TrustStrip.jsx
try { (() => {
/* global React */

function TrustStrip() {
  const items = ["DOYEN AUTOS", "SOC 2 TYPE II", "ISO 27001", "PCI DSS", "AWS PARTNER", "GDPR"];
  return /*#__PURE__*/React.createElement("section", {
    className: "trust-strip"
  }, /*#__PURE__*/React.createElement("div", {
    className: "trust-inner"
  }, /*#__PURE__*/React.createElement("div", {
    className: "trust-label"
  }, "Trusted by partners across the continent"), /*#__PURE__*/React.createElement("div", {
    className: "trust-row"
  }, items.map(t => /*#__PURE__*/React.createElement("div", {
    className: "trust-item",
    key: t
  }, t)))));
}
window.TrustStrip = TrustStrip;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/web/TrustStrip.jsx", error: String((e && e.message) || e) }); }

__ds_ns.Badge = __ds_scope.Badge;

__ds_ns.BrandMark = __ds_scope.BrandMark;

__ds_ns.Button = __ds_scope.Button;

__ds_ns.Card = __ds_scope.Card;

__ds_ns.Input = __ds_scope.Input;

__ds_ns.L0Mark = __ds_scope.L0Mark;

__ds_ns.Modal = __ds_scope.Modal;

__ds_ns.Select = __ds_scope.Select;

})();
