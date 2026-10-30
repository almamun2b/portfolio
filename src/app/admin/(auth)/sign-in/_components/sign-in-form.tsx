"use client";

import { LogIn } from "lucide-react";
import { Suspense } from "react";
import { ActionForm } from "@/components/forms/action-form";
import { PasswordField, TextField } from "@/components/forms/form-fields";
import { SubmitButton } from "@/components/forms/submit-button";
import { signInAction } from "@/server/modules/auth/auth.actions";
import { NextField } from "./next-field";

export function SignInForm() {
  return (
    <ActionForm
      action={signInAction}
      className="flex flex-col gap-5"
      aria-label="Sign in"
    >
      <Suspense fallback={null}>
        <NextField />
      </Suspense>
      <TextField
        name="email"
        label="Email"
        type="email"
        autoComplete="username"
        inputMode="email"
        autoFocus
        required
      />
      <PasswordField
        name="password"
        label="Password"
        autoComplete="current-password"
        required
      />
      <SubmitButton pendingLabel="Signing in" size="lg" className="mt-1 w-full">
        <LogIn aria-hidden="true" /> Sign in
      </SubmitButton>
    </ActionForm>
  );
}
