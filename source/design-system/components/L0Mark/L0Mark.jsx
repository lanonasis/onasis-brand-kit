import * as React from "react";

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

export function L0Mark({
  variant = "circle",
  size = 24,
  meridian = true,
  accent = false,
  className = "",
  style = {},
  alt = "LZero",
}) {
  const isCircle = variant === "circle";
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      role="img"
      aria-label={alt}
      className={className}
      style={{ display: "block", color: "currentColor", ...style }}
    >
      <path
        d={isCircle ? "M6 3v15h8" : "M4 3v14h8"}
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {isCircle ? (
        <circle cx="16.5" cy="13" r="4.5" stroke="currentColor" strokeWidth="2" fill="none" />
      ) : (
        <ellipse cx="16" cy="10" rx="4" ry="5.5" stroke="currentColor" strokeWidth="2" fill="none" />
      )}
      {isCircle && meridian && (
        <path
          d="M16.5 9v8"
          stroke={accent ? ACCENT : "currentColor"}
          strokeWidth="1.5"
          opacity={accent ? 1 : 0.6}
        />
      )}
    </svg>
  );
}
