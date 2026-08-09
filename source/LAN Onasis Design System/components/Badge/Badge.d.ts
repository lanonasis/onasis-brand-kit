import * as React from "react";

export interface BadgeProps {
  /** Semantic tone. */
  tone?: "success" | "info" | "warning" | "danger" | "neutral" | "gold";
  children?: React.ReactNode;
  dot?: boolean;
}

export function Badge(props: BadgeProps): JSX.Element;
