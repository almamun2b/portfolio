"use client";

import { changeUserPassword } from "@/actions/users";
import { DynamicFormField } from "@/components/shared/DynamicFormField";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Eye, EyeOff, Lock, Save } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z
      .string()
      .min(8, "New password must be at least 8 characters")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        "Password must contain at least one uppercase letter, one lowercase letter, and one number"
      ),
    confirmPassword: z.string().min(1, "Please confirm your new password"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "New password and confirm password don't match",
    path: ["confirmPassword"],
  })
  .refine((data) => data.currentPassword !== data.newPassword, {
    message: "New password must be different from current password",
    path: ["newPassword"],
  });

type ChangePasswordFormData = z.infer<typeof changePasswordSchema>;

interface ChangePasswordFormProps {
  userId: string;
}

export function ChangePasswordForm({ userId }: ChangePasswordFormProps) {
  const router = useRouter();
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const form = useForm<ChangePasswordFormData>({
    resolver: zodResolver(changePasswordSchema),
    mode: "onChange",
    reValidateMode: "onChange",
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (values: ChangePasswordFormData) => {
    try {
      const result = await changeUserPassword(userId, {
        currentPassword: values.currentPassword,
        newPassword: values.newPassword,
      });

      if (result && result.success) {
        toast.success("Password changed successfully!");
        form.reset();
        router.push("/profile");
      } else {
        toast.error(
          result?.message || "Failed to change password. Please try again."
        );
      }
    } catch (error) {
      console.error("Failed to change password:", error);
      toast.error("Failed to change password. Please try again later.");
    }
  };

  return (
    <section className="bg-background">
      {/* Header Section */}
      <div className="py-12 text-center">
        <div className="mx-auto container px-4 lg:px-8 max-w-3xl">
          <div className="flex items-center justify-center gap-4 mb-6">
            <Button variant="outline" size="sm" asChild>
              <Link href="/profile">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Profile
              </Link>
            </Button>
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            Change Password
          </h1>
          <p className="mt-6 text-lg leading-8 text-muted-foreground">
            Update your password to keep your account secure. Make sure to use a
            strong password.
          </p>
        </div>
      </div>

      {/* Change Password Form */}
      <div className="pb-32">
        <div className="mx-auto container px-4 lg:px-8 max-w-2xl">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-6 rounded-2xl border bg-card p-8 shadow-sm"
            >
              {/* Current Password */}
              <DynamicFormField
                name="currentPassword"
                label="Current Password *"
                description="Enter your current password to verify your identity"
              >
                {(field) => (
                  <div className="relative">
                    <Input
                      {...field}
                      type={showCurrentPassword ? "text" : "password"}
                      placeholder="Enter your current password"
                      className="pr-10"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() =>
                        setShowCurrentPassword(!showCurrentPassword)
                      }
                    >
                      {showCurrentPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                )}
              </DynamicFormField>

              {/* New Password */}
              <DynamicFormField
                name="newPassword"
                label="New Password *"
                description="Must be at least 8 characters with uppercase, lowercase, and number"
              >
                {(field) => (
                  <div className="relative">
                    <Input
                      {...field}
                      type={showNewPassword ? "text" : "password"}
                      placeholder="Enter your new password"
                      className="pr-10"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                    >
                      {showNewPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                )}
              </DynamicFormField>

              {/* Confirm New Password */}
              <DynamicFormField
                name="confirmPassword"
                label="Confirm New Password *"
                description="Re-enter your new password to confirm"
              >
                {(field) => (
                  <div className="relative">
                    <Input
                      {...field}
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirm your new password"
                      className="pr-10"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                )}
              </DynamicFormField>

              {/* Security Tips */}
              <div className="rounded-lg bg-muted/50 p-4">
                <div className="flex items-start gap-3">
                  <Lock className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div className="space-y-2">
                    <h3 className="font-medium text-sm">
                      Password Security Tips:
                    </h3>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Use at least 8 characters</li>
                      <li>• Include uppercase and lowercase letters</li>
                      <li>• Add numbers and special characters</li>
                      <li>• Avoid using personal information</li>
                      <li>• Don`t reuse passwords from other accounts</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="flex gap-4">
                <Button type="submit" className="flex-1">
                  <Save className="h-4 w-4 mr-2" />
                  Change Password
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  asChild
                  className="flex-1"
                >
                  <Link href="/profile">Cancel</Link>
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </section>
  );
}
