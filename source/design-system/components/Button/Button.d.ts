import * as React from "react";

export interface ButtonProps {
  /** Visual style. `primary` = gold (corporate/marketing), `accent` = green (product/dashboard). */
  variant?: "primary" | "accent" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  children?: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
}

export function Button(props: ButtonProps): JSX.Element;
