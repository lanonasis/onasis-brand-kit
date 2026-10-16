import * as React from "react";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** primary = corporate gold · accent = product green · secondary = navy · outline / ghost follow theme · danger = destructive */
  variant?: "primary" | "accent" | "secondary" | "outline" | "ghost" | "danger";
  /** "icon" is square — always pair with aria-label. */
  size?: "sm" | "md" | "lg" | "icon";
  /** Disables the button and shows a spinner for async actions. */
  loading?: boolean;
  children?: React.ReactNode;
}

export function Button(props: ButtonProps): JSX.Element;
