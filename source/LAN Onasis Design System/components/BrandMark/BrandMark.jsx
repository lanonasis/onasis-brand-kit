import * as React from "react";

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

const INK = { light: "#1B365D", dark: "#FFFFFF" };
const ACCENT = "#00D4AA";

const RASTER = {
  wordmark: { light: "wordmark-lockup-on-light.png", dark: "wordmark-lockup-on-dark.png" },
  tile: { light: "app-icon-256.png", dark: "app-icon-256.png" },
};

/* Letter-L paths — shared by icon and monogram. Verbatim from icon-only.svg. */
const L_PATHS = [
  "M60 60H130V350H60z",
  "M60 310H225V380H60zM45 60H145V82H45z",
  "M205 350H225V380H205z",
];

/*
 * Gear outline followed by the globe circle expressed as two arcs, as a
 * single compound path. With fill-rule="evenodd" the circle becomes a hole.
 * Arc form avoids <circle>, so the whole aperture survives as one `d`.
 */
const GEAR_WITH_APERTURE =
  "M 0,-95 L 18,-88 L 35,-105 L 55,-95 L 62,-75 L 85,-70 L 88,-48 L 72,-32 L 80,-10 L 65,5 L 42,0 L 30,20 L 8,20 L -5,5 L -28,10 L -45,-8 L -38,-30 L -55,-48 L -52,-70 L -30,-78 L -22,-98 Z " +
  "M 0,-87 A 52,52 0 1,0 0,17 A 52,52 0 1,0 0,-87 Z";

const GRIDLINES =
  "M0-87 0 17M-52-35 52-35M-44-55Q0-62 44-55M-44-15Q0-8 44-15M-20-80Q0-84 20-80M-20 10Q0 14 20 10";

/* Circuit nodes: [cx, cy, connector-path] — verbatim from icon-only.svg. */
const NODES = [
  [100, -35, "M88-35 100-35"],
  [72, -112, "M55-95 72-112"],
  [72, 42, "M55 22 72 42"],
];

function IconGlyph({ ink, size, alt }) {
  return (
    <svg
      viewBox="0 0 500 500"
      width={size}
      height={size}
      role="img"
      aria-label={alt}
      style={{ display: "block" }}
    >
      <g fill={ink}>
        {L_PATHS.map((d) => (
          <path key={d} d={d} />
        ))}
      </g>
      <path stroke={ink} strokeWidth="8" strokeLinecap="round" d="M255 70 255 390" />
      <g transform="translate(370, 220)">
        <path d={GEAR_WITH_APERTURE} fill={ink} fillRule="evenodd" />
        <g stroke={ink} strokeWidth="2.5" fill="none">
          <circle cy="-35" r="52" />
          <path d={GRIDLINES} />
        </g>
        <g fill={ink}>
          {NODES.map(([cx, cy, d]) => (
            <React.Fragment key={d}>
              <circle cx={cx} cy={cy} r="8" />
              <path stroke={ink} strokeWidth="3" d={d} />
            </React.Fragment>
          ))}
        </g>
      </g>
      <circle cx="455" cy="68" r="28" fill={ACCENT} />
    </svg>
  );
}

/* Monogram: the serif L alone, viewBox cropped to its bounds. */
function MonogramGlyph({ ink, size, alt }) {
  return (
    <svg
      viewBox="40 55 190 330"
      width={size}
      height={size}
      role="img"
      aria-label={alt}
      style={{ display: "block" }}
    >
      <g fill={ink}>
        {L_PATHS.map((d) => (
          <path key={d} d={d} />
        ))}
      </g>
    </svg>
  );
}

export function BrandMark({
  variant = "icon",
  theme = "light",
  size = 32,
  basePath = "assets/logos/",
  className = "",
  style = {},
  alt = "LAN Onasis",
}) {
  const ink = INK[theme] || INK.light;

  if (variant === "icon" || variant === "monogram") {
    const Glyph = variant === "icon" ? IconGlyph : MonogramGlyph;
    return (
      <span className={className} style={{ display: "inline-block", lineHeight: 0, ...style }}>
        <Glyph ink={ink} size={size} alt={alt} />
      </span>
    );
  }

  const file = (RASTER[variant] || RASTER.tile)[theme];
  return (
    <img
      src={basePath + file}
      alt={alt}
      className={className}
      style={{
        height: size,
        width: variant === "wordmark" ? size / 0.62 : size,
        objectFit: "contain",
        display: "block",
        ...style,
      }}
    />
  );
}
