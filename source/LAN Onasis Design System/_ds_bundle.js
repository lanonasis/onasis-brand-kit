/* @ds-bundle: {"format":4,"namespace":"LANOnasisDesignSystem_320289","components":[{"name":"Badge","sourcePath":"components/Badge/Badge.jsx"},{"name":"BrandMark","sourcePath":"components/BrandMark/BrandMark.jsx"},{"name":"Button","sourcePath":"components/Button/Button.jsx"},{"name":"Card","sourcePath":"components/Card/Card.jsx"},{"name":"L0Mark","sourcePath":"components/L0Mark/L0Mark.jsx"}],"sourceHashes":{"components/Badge/Badge.jsx":"49ec7b74deaa","components/BrandMark/BrandMark.jsx":"b4371408f27a","components/Button/Button.jsx":"f59251efc5cf","components/Card/Card.jsx":"0063ff3bf68a","components/L0Mark/L0Mark.jsx":"de1758ac7f7f","ui_kits/dashboard/ChartCard.jsx":"63c38fecea25","ui_kits/dashboard/KpiRow.jsx":"6cc8afba0343","ui_kits/dashboard/MemoriesTable.jsx":"c806644a815f","ui_kits/dashboard/Modal.jsx":"6e3ab3c11caa","ui_kits/dashboard/SettingsPane.jsx":"b046e43527e2","ui_kits/dashboard/Sidebar.jsx":"a3f1fcc773aa","ui_kits/dashboard/TopBar.jsx":"e260a92138f1","ui_kits/web/CtaBlock.jsx":"6b96c0320ba0","ui_kits/web/EcosystemBand.jsx":"99d4c5e5d548","ui_kits/web/Footer.jsx":"5462d5b6c38d","ui_kits/web/Hero.jsx":"d89eef857a3a","ui_kits/web/Nav.jsx":"f22deb4f68ca","ui_kits/web/ProductGrid.jsx":"d7d1657f65ab","ui_kits/web/SplitFeature.jsx":"1e87e403f32e","ui_kits/web/TrustStrip.jsx":"0ff1e4948a66"},"inlinedExternals":[],"unexposedExports":[]} */

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
const VARIANTS = {
  primary: {
    background: "var(--ln-gold)",
    color: "var(--ln-navy-800)"
  },
  accent: {
    background: "var(--ln-green)",
    color: "var(--ln-navy-800)"
  },
  secondary: {
    background: "var(--ln-navy)",
    color: "#fff"
  },
  outline: {
    background: "#fff",
    color: "var(--ln-navy)",
    border: "1px solid var(--border-default)"
  },
  ghost: {
    background: "transparent",
    color: "var(--ln-navy)"
  }
};
const SIZES = {
  sm: {
    padding: "7px 12px",
    fontSize: 12
  },
  md: {
    padding: "10px 18px",
    fontSize: 14
  },
  lg: {
    padding: "14px 24px",
    fontSize: 15
  }
};
function Button({
  variant = "primary",
  size = "md",
  children,
  onClick,
  disabled,
  ...rest
}) {
  const [hover, setHover] = React.useState(false);
  const base = VARIANTS[variant] || VARIANTS.primary;
  return /*#__PURE__*/React.createElement("button", _extends({
    onClick: onClick,
    disabled: disabled,
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    style: {
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
      ...base
    }
  }, rest), children);
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

// ui_kits/dashboard/Modal.jsx
try { (() => {
/* global React */

function Modal({
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
window.Modal = Modal;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/dashboard/Modal.jsx", error: String((e && e.message) || e) }); }

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

__ds_ns.L0Mark = __ds_scope.L0Mark;

})();
