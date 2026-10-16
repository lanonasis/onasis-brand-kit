import * as React from "react";

export interface ModalProps {
  open?: boolean;
  /** Required — becomes the dialog's accessible name. */
  title: string;
  /** Explain what changes when the dialog modifies data. */
  description?: string;
  onClose: () => void;
  footer?: React.ReactNode;
  size?: "sm" | "md";
  children?: React.ReactNode;
}

export function Modal(props: ModalProps): JSX.Element;
