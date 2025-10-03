"use client";

import { DynamicFormField } from "@/components/shared/DynamicFormField";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.email("Please enter a valid email"),
  subject: z.string().min(3, "Subject must be at least 3 characters"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

type ContactFormData = z.infer<typeof contactSchema>;

export default function ContactUs() {
  const form = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    mode: "onChange",
    reValidateMode: "onChange",
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      message: "",
    },
  });

  const onSubmit = async (values: ContactFormData) => {
    try {
      console.log("Form Values:", values);

      toast.success("Message sent successfully! We'll get back to you soon.");
      form.reset();
    } catch (error) {
      console.error("Failed to send message:", error);
      toast.error("Failed to send message. Please try again later.");
    }
  };

  return (
    <section className="bg-background">
      {/* Header Section */}
      <div className="py-24 sm:py-32 text-center">
        <div className="mx-auto container px-4 lg:px-8 max-w-3xl">
          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            Contact Me
          </h1>
          <p className="mt-6 text-lg leading-8 text-muted-foreground">
            Have questions or feedback? Fill out the form below and our team
            will respond as quickly as possible.
          </p>
        </div>
      </div>

      {/* Contact Form */}
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
                  <Input {...field} placeholder="Your email address" />
                )}
              </DynamicFormField>

              <DynamicFormField name="subject" label="Subject *">
                {(field) => (
                  <Input {...field} placeholder="Subject of your message" />
                )}
              </DynamicFormField>

              <DynamicFormField name="message" label="Message *">
                {(field) => (
                  <Textarea
                    {...field}
                    placeholder="Write your message here"
                    className="min-h-[120px] resize-y"
                  />
                )}
              </DynamicFormField>

              <Button type="submit" className="w-full">
                Send Message
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </section>
  );
}
