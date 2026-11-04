"use client";

import { createContext, useContext } from "react";
import type { FieldErrors } from "@/lib/action-result";

export interface FormState {
  /** Field name -> messages from the last Server Action result. */
  errors: FieldErrors;
  pending: boolean;
}

const FormStateContext = createContext<FormState>({
  errors: {},
  pending: false,
});

export const FormStateProvider = FormStateContext.Provider;

/** Read by fields and the submit button inside an <ActionForm>. */
export function useFormState(): FormState {
  return useContext(FormStateContext);
}
