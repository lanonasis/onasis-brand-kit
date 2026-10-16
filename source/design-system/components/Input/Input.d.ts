import * as React from "react";

export interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size"> {
  /** "error" sets aria-invalid and a danger border — pair with aria-describedby. */
  variant?: "default" | "error";
  size?: "sm" | "md";
}

export function Input(props: InputProps): JSX.Element;
