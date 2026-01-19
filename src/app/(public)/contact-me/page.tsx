"use client";

import { DynamicFormField } from "@/components/shared/DynamicFormField";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { Mail, MapPin, Phone, Send, Sparkles } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email"),
  subject: z.string().min(3, "Subject must be at least 3 characters"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

type ContactFormData = z.infer<typeof contactSchema>;

export default function ContactUs() {
  const form = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    mode: "onChange",
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
      toast.success("Message sent successfully! I'll get back to you soon.");
      form.reset();
    } catch (error) {
      console.error("Failed to send message:", error);
      toast.error("Failed to send message. Please try again later.");
    }
  };

  return (
    <section className="min-h-dvh py-20 lg:py-32 relative overflow-hidden">
      {/* Background Decorative Element */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-primary/10 rounded-full blur-[120px] -z-10" />

      <div className="container mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-start">
          {/* Info Side */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-bold mb-8">
              <Sparkles size={16} />
              <span>Let&apos;s Build Something Together</span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-8 leading-tight">
              Get in <span className="text-primary text-glow">Touch</span> with
              Me
            </h1>

            <p className="text-xl text-muted-foreground mb-12 max-w-xl leading-relaxed">
              Have a project in mind, a question, or just want to say hi?
              I&apos;m always open to discussing new opportunities and creative
              ideas.
            </p>

            <div className="space-y-6 max-w-md">
              <div className="p-6 rounded-3xl border border-border/50 bg-card/40 backdrop-blur-xl flex items-center gap-6 group hover:border-primary/50 transition-all duration-300">
                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shrink-0 group-hover:scale-110 transition-transform">
                  <Mail size={28} />
                </div>
                <div>
                  <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1">
                    Email Me
                  </p>
                  <p className="text-lg font-bold">almamun2b@gmail.com</p>
                </div>
              </div>

              <div className="p-6 rounded-3xl border border-border/50 bg-card/40 backdrop-blur-xl flex items-center gap-6 group hover:border-primary/50 transition-all duration-300">
                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shrink-0 group-hover:scale-110 transition-transform">
                  <Phone size={28} />
                </div>
                <div>
                  <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1">
                    Call Me
                  </p>
                  <p className="text-lg font-bold">+880 1789 XXX XXX</p>
                </div>
              </div>

              <div className="p-6 rounded-3xl border border-border/50 bg-card/40 backdrop-blur-xl flex items-center gap-6 group hover:border-primary/50 transition-all duration-300">
                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shrink-0 group-hover:scale-110 transition-transform">
                  <MapPin size={28} />
                </div>
                <div>
                  <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1">
                    Location
                  </p>
                  <p className="text-lg font-bold">Dhaka, Bangladesh</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Form Side */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="p-8 md:p-12 rounded-[3rem] border border-primary/20 bg-card/40 backdrop-blur-xl shadow-2xl relative overflow-hidden"
          >
            {/* Decorative shapes */}
            <div className="absolute -top-20 -right-20 w-40 h-40 bg-primary/10 rounded-full blur-3xl -z-10" />
            <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-primary/10 rounded-full blur-3xl -z-10" />

            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6 relative z-10"
              >
                <div className="grid md:grid-cols-2 gap-6">
                  <DynamicFormField name="name" label="Full Name">
                    {(field) => (
                      <Input
                        {...field}
                        placeholder="John Doe"
                        className="h-14 px-6 rounded-xl border-border/50 bg-background/50 focus:border-primary transition-all"
                      />
                    )}
                  </DynamicFormField>
                  <DynamicFormField name="email" label="Email Address">
                    {(field) => (
                      <Input
                        {...field}
                        placeholder="john@example.com"
                        className="h-14 px-6 rounded-xl border-border/50 bg-background/50 focus:border-primary transition-all"
                      />
                    )}
                  </DynamicFormField>
                </div>

                <DynamicFormField name="subject" label="Subject">
                  {(field) => (
                    <Input
                      {...field}
                      placeholder="How can I help you?"
                      className="h-14 px-6 rounded-xl border-border/50 bg-background/50 focus:border-primary transition-all"
                    />
                  )}
                </DynamicFormField>

                <DynamicFormField name="message" label="Message">
                  {(field) => (
                    <Textarea
                      {...field}
                      placeholder="Tell me about your project or vision..."
                      className="min-h-[160px] p-6 rounded-xl border-border/50 bg-background/50 focus:border-primary transition-all resize-none"
                    />
                  )}
                </DynamicFormField>

                <Button
                  type="submit"
                  size="lg"
                  className="w-full h-16 rounded-xl text-lg font-bold shadow-lg shadow-primary/20 group"
                >
                  Send Message
                  <Send
                    size={20}
                    className="ml-2 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform"
                  />
                </Button>
              </form>
            </Form>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
