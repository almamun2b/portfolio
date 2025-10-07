"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { signIn } from "next-auth/react";
import { FieldValues, useForm } from "react-hook-form";

// type LoginFormValues = {
//   email: string;
//   password: string;
// };

export default function LoginForm() {
  // const router = useRouter();
  const form = useForm<FieldValues>({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: FieldValues) => {
    try {
      // For Manual Login
      // const res = await login(values);
      // if (res?.id) {
      //   console.log("User logged in:", res);
      //   router.push("/dashboard");
      // } else {
      //   console.log("User login failed:", res);
      // }
      // For NextAuth
      await signIn("credentials", {
        ...values,
        callbackUrl: "/dashboard",
      });
    } catch (error) {
      console.error("User login failed", error);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-background">
      <Card className="space-y-6 w-full max-w-md p-8 rounded-lg shadow-md">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-6 w-full max-w-md"
          >
            <h2 className="text-3xl font-bold text-center">Login</h2>

            {/* Email */}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="Enter your email"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Password */}
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Enter your password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full mt-2 cursor-pointer">
              Login
            </Button>
          </form>
        </Form>
      </Card>
    </div>
  );
}
