import * as React from "react";

export interface L0MarkProps {
  /** "circle" = the L0Logo geometry (balanced, meridian accent). "ellipse" = the LanoLogo geometry (typographic zero). Both ship in production today. */
  variant?: "circle" | "ellipse";
  /** Rendered size in px. Authored at 24; stays legible 16–40. Above 40 use BrandMark instead. */
  size?: number;
  /** Show the meridian stroke through the 0. Only meaningful for variant="circle". */
  meridian?: boolean;
  /** Tint the meridian with the brand green instead of inheriting currentColor. */
  accent?: boolean;
  className?: string;
  style?: React.CSSProperties;
  alt?: string;
}

export function L0Mark(props: L0MarkProps): JSX.Element;
