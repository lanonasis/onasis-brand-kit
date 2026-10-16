import * as React from "react";

export interface SelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, "size"> {
  variant?: "default" | "error";
  size?: "sm" | "md";
  children?: React.ReactNode;
}

export function Select(props: SelectProps): JSX.Element;
