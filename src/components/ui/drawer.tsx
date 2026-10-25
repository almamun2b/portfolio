"use client";

import type { ReactNode } from "react";
import { Dialog, type DialogProps } from "./dialog";

/**
 * Side panel for create/edit forms: the shared <Dialog> pinned to the right
 * edge, so it keeps the native focus trap, Esc, and focus return. Mount the
 * form inside only while `open`, so it starts clean each time.
 */
export function Drawer({
  size = "md",
  ...props
}: Omit<DialogProps, "side"> & { children: ReactNode }) {
  return <Dialog side="right" size={size} {...props} />;
}
