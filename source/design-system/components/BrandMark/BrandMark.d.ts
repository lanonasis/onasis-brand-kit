import * as React from "react";

export interface BrandMarkProps {
  /** "icon" and "monogram" are ink-only vector and swap ink by theme. "tile" is the navy app-icon chip — use only where a chip is required (favicons, app stores, OS launchers). "wordmark" is the full ink-only lockup. */
  variant?: "icon" | "monogram" | "wordmark" | "tile";
  /** "light" = navy ink, for white/light surfaces. "dark" = white ink, for navy/dark surfaces. */
  theme?: "light" | "dark";
  /** Rendered height in px. Icon/monogram/tile are square; wordmark keeps its lockup aspect ratio. */
  size?: number;
  /** Folder containing the raster assets, relative to the consuming page. Used only by "wordmark" and "tile". Default: "assets/logos/" */
  basePath?: string;
  className?: string;
  style?: React.CSSProperties;
  alt?: string;
}

export function BrandMark(props: BrandMarkProps): JSX.Element;
