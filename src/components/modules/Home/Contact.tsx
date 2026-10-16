"use client";

import { sendContactEmail } from "@/actions/contact";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { Mail, MapPin, Phone, Send } from "lucide-react";
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

export default function Contact() {
  const form = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      message: "",
    },
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = form;

  const onSubmit = async (values: ContactFormData) => {
    const toastId = toast.loading("Sending message...");
    try {
      const result = await sendContactEmail(values);
      if (result.success) {
        toast.success(result.message, { id: toastId });
        reset();
      } else {
        toast.error(result.message || "Failed to send message.", {
          id: toastId,
        });
      }
    } catch (error) {
      console.error("Failed to send message:", error);
      toast.error("An unexpected error occurred. Please try again later.", {
        id: toastId,
      });
    }
  };

  return (
    <section
      id="contact"
      className="py-16 md:py-24 lg:py-32 relative overflow-hidden"
    >
      <div className="container mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-16 md:mb-24">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-primary font-bold tracking-widest uppercase text-xs md:text-sm mb-4 block"
          >
            Get In Touch
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6"
          >
            Let&apos;s Start a{" "}
            <span className="text-primary">Conversation</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-muted-foreground text-base md:text-lg"
          >
            Whether you have a specific project in mind or just want to say hi,
            feel free to reach out using the form below.
          </motion.p>
        </div>

        <div className="grid lg:grid-cols-5 gap-12 lg:gap-20 max-w-6xl mx-auto">
          {/* Contact Info */}
          <div className="lg:col-span-2 space-y-6">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="p-6 rounded-3xl border border-border/50 bg-card/50 backdrop-blur-sm flex items-center gap-5 hover:border-primary/50 transition-colors duration-300"
            >
              <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                <Mail size={24} />
              </div>
              <div>
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-0.5">
                  Email Me
                </p>
                <p className="text-lg font-semibold">almamun2b@gmail.com</p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="p-6 rounded-3xl border border-border/50 bg-card/50 backdrop-blur-sm flex items-center gap-5 hover:border-primary/50 transition-colors duration-300"
            >
              <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                <Phone size={24} />
              </div>
              <div>
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-0.5">
                  Call Me
                </p>
                <p className="text-lg font-semibold">+880 1610 088 700</p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="p-6 rounded-3xl border border-border/50 bg-card/50 backdrop-blur-sm flex items-center gap-5 hover:border-primary/50 transition-colors duration-300"
            >
              <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                <MapPin size={24} />
              </div>
              <div>
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-0.5">
                  Location
                </p>
                <p className="text-lg font-semibold">Sirajganj, Bangladesh</p>
              </div>
            </motion.div>
          </div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-3 p-8 md:p-12 rounded-[2.5rem] border border-border/50 bg-card/50 backdrop-blur-sm"
          >
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-semibold ml-1">
                    Full Name
                  </label>
                  <input
                    {...register("name")}
                    type="text"
                    placeholder="John Doe"
                    className={`w-full px-5 py-4 rounded-xl bg-background border ${
                      errors.name ? "border-destructive" : "border-border/50"
                    } focus:border-primary outline-none transition-all`}
                  />
                  {errors.name && (
                    <p className="text-xs text-destructive ml-1">
                      {errors.name.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold ml-1">
                    Email Address
                  </label>
                  <input
                    {...register("email")}
                    type="email"
                    placeholder="john@example.com"
                    className={`w-full px-5 py-4 rounded-xl bg-background border ${
                      errors.email ? "border-destructive" : "border-border/50"
                    } focus:border-primary outline-none transition-all`}
                  />
                  {errors.email && (
                    <p className="text-xs text-destructive ml-1">
                      {errors.email.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold ml-1">Subject</label>
                <input
                  {...register("subject")}
                  type="text"
                  placeholder="How can I help you?"
                  className={`w-full px-5 py-4 rounded-xl bg-background border ${
                    errors.subject ? "border-destructive" : "border-border/50"
                  } focus:border-primary outline-none transition-all`}
                />
                {errors.subject && (
                  <p className="text-xs text-destructive ml-1">
                    {errors.subject.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold ml-1">Message</label>
                <textarea
                  {...register("message")}
                  rows={5}
                  placeholder="Tell me about your project..."
                  className={`w-full px-5 py-4 rounded-xl bg-background border ${
                    errors.message ? "border-destructive" : "border-border/50"
                  } focus:border-primary outline-none transition-all resize-none`}
                />
                {errors.message && (
                  <p className="text-xs text-destructive ml-1">
                    {errors.message.message}
                  </p>
                )}
              </div>

              <Button
                size="lg"
                disabled={isSubmitting}
                className="w-full rounded-xl h-14 font-bold text-lg group"
              >
                {isSubmitting ? "Sending..." : "Send Message"}
                <Send
                  size={20}
                  className="ml-2 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform"
                />
              </Button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
