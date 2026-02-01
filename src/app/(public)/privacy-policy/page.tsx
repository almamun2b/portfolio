"use client";

import { motion } from "framer-motion";
import { ShieldCheck, Sparkles } from "lucide-react";

export default function PrivacyPolicy() {
  const sections = [
    {
      title: "1. Introduction",
      content: "Welcome to Md Abdul Mamun's Portfolio. We respect your privacy and are committed to protecting your personal data. This privacy policy will inform you about how we look after your personal data when you visit our website and tell you about your privacy rights and how the law protects you.",
    },
    {
      title: "2. Information We Collect",
      content: "We may collect, use, store and transfer different kinds of personal data about you which we have grouped together as follows: Identity Data (name), Contact Data (email address, telephone number), and Technical Data (IP address, browser type and version, time zone setting and location).",
    },
    {
      title: "3. How We Use Your Information",
      content: "We will only use your personal data when the law allows us to. Most commonly, we will use your personal data in the following circumstances: To provide and maintain our service, to notify you about changes to our service, and to provide customer support.",
    },
    {
      title: "4. Data Security",
      content: "We have put in place appropriate security measures to prevent your personal data from being accidentally lost, used or accessed in an unauthorized way, altered or disclosed. In addition, we limit access to your personal data to those employees, agents, contractors and other third parties who have a business need to know.",
    },
    {
      title: "5. Cookies",
      content: "You can set your browser to refuse all or some browser cookies, or to alert you when websites set or access cookies. If you disable or refuse cookies, please note that some parts of this website may become inaccessible or not function properly.",
    },
    {
      title: "6. Your Legal Rights",
      content: "Under certain circumstances, you have rights under data protection laws in relation to your personal data, including the right to request access, correction, erasure, restriction, transfer, or to object to processing.",
    },
  ];

  return (
    <section className="min-h-dvh py-20 lg:py-32 relative overflow-hidden">
      {/* Background Decorative Element */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-primary/10 rounded-full blur-[120px] -z-10" />

      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-bold mb-8">
            <ShieldCheck size={16} />
            <span>Privacy Matters</span>
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-8 leading-tight">
            Privacy <span className="text-primary text-glow">Policy</span>
          </h1>

          <p className="text-xl text-muted-foreground mb-12 leading-relaxed">
            Last updated: February 01, 2026. This Privacy Policy describes our policies and procedures on the collection, use and disclosure of your information.
          </p>

          <div className="space-y-12">
            {sections.map((section, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="p-8 rounded-[2rem] border border-border/50 bg-card/40 backdrop-blur-xl hover:border-primary/30 transition-all duration-300"
              >
                <h2 className="text-2xl font-bold mb-4 text-foreground">
                  {section.title}
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  {section.content}
                </p>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="mt-16 p-8 rounded-[2rem] bg-primary/5 border border-primary/10 text-center"
          >
            <Sparkles className="mx-auto mb-4 text-primary" size={32} />
            <h3 className="text-xl font-bold mb-2">Have questions?</h3>
            <p className="text-muted-foreground mb-6">
              If you have any questions about this Privacy Policy, you can contact us.
            </p>
            <a
              href="/contact-me"
              className="inline-flex items-center justify-center px-8 py-4 rounded-xl bg-primary text-primary-foreground font-bold hover:opacity-90 transition-opacity shadow-lg shadow-primary/20"
            >
              Contact Me
            </a>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
