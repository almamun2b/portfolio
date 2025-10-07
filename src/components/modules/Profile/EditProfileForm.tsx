"use client";

import { updateUserById } from "@/actions/users";
import { DynamicFormField } from "@/components/shared/DynamicFormField";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UpdateUserRequest, User } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Save } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const updateUserSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.email("Please enter a valid email"),
  phone: z.string().min(10, "Phone number must be at least 10 characters"),
  picture: z.string().url("Please enter a valid URL").optional().or(z.literal("")),
});

type UpdateUserFormData = z.infer<typeof updateUserSchema>;

interface EditProfileFormProps {
  user: User;
}

export function EditProfileForm({ user }: EditProfileFormProps) {
  const router = useRouter();
  
  const form = useForm<UpdateUserFormData>({
    resolver: zodResolver(updateUserSchema),
    mode: "onChange",
    reValidateMode: "onChange",
    defaultValues: {
      name: user.name || "",
      email: user.email || "",
      phone: user.phone || "",
      picture: user.picture || "",
    },
  });

  const onSubmit = async (values: UpdateUserFormData) => {
    try {
      // Remove empty picture field if not provided
      const updateData: UpdateUserRequest = {
        name: values.name,
        email: values.email,
        phone: values.phone,
        ...(values.picture && { picture: values.picture }),
      };

      const result = await updateUserById(user.id.toString(), updateData);
      
      if (result && result.success) {
        toast.success("Profile updated successfully!");
        router.push("/profile");
        router.refresh();
      } else {
        toast.error(result?.message || "Failed to update profile. Please try again.");
      }
    } catch (error) {
      console.error("Failed to update profile:", error);
      toast.error("Failed to update profile. Please try again later.");
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
            Edit Profile
          </h1>
          <p className="mt-6 text-lg leading-8 text-muted-foreground">
            Update your personal information and account details
          </p>
        </div>
      </div>

      {/* Edit Form */}
      <div className="pb-32">
        <div className="mx-auto container px-4 lg:px-8 max-w-2xl">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-6 rounded-2xl border bg-card p-8 shadow-sm"
            >
              <DynamicFormField name="name" label="Full Name *">
                {(field) => <Input {...field} placeholder="Your full name" />}
              </DynamicFormField>

              <DynamicFormField name="email" label="Email Address *">
                {(field) => (
                  <Input 
                    {...field} 
                    type="email"
                    placeholder="Your email address" 
                  />
                )}
              </DynamicFormField>

              <DynamicFormField name="phone" label="Phone Number *">
                {(field) => (
                  <Input 
                    {...field} 
                    type="tel"
                    placeholder="Your phone number" 
                  />
                )}
              </DynamicFormField>

              <DynamicFormField 
                name="picture" 
                label="Profile Picture URL"
                description="Optional: Enter a URL for your profile picture"
              >
                {(field) => (
                  <Input 
                    {...field} 
                    type="url"
                    placeholder="https://example.com/your-photo.jpg" 
                  />
                )}
              </DynamicFormField>

              <div className="flex gap-4">
                <Button type="submit" className="flex-1">
                  <Save className="h-4 w-4 mr-2" />
                  Update Profile
                </Button>
                <Button type="button" variant="outline" asChild className="flex-1">
                  <Link href="/profile">
                    Cancel
                  </Link>
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </section>
  );
}
