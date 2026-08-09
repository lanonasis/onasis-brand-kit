import * as React from "react";

export interface CardProps {
  eyebrow?: string;
  title?: string;
  body?: string;
  /** Accent used for the eyebrow / footer link. */
  accent?: "gold" | "green";
  footer?: React.ReactNode;
}

export function Card(props: CardProps): JSX.Element;
