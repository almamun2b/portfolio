"use client";

import { motion } from "framer-motion";
import { FileText, Sparkles } from "lucide-react";

export default function TermsConditions() {
  const sections = [
    {
      title: "1. Agreement to Terms",
      content: "By accessing this website, you agree to be bound by these Terms and Conditions and agree that you are responsible for compliance with any applicable local laws. If you do not agree with any of these terms, you are prohibited from using or accessing this site.",
    },
    {
      title: "2. Intellectual Property Rights",
      content: "All content, features, and functionality on this website, including but not limited to text, graphics, logos, images, and software, are the exclusive property of Md Abdul Mamun and are protected by international copyright, trademark, and other intellectual property laws.",
    },
    {
      title: "3. User Responsibilities",
      content: "You agree to use this website only for lawful purposes. You are prohibited from using the site to engage in any activity that could damage, disable, or impair the site or interfere with any other party's use of the site.",
    },
    {
      title: "4. Disclaimer",
      content: "The materials on this website are provided on an 'as is' basis. Md Abdul Mamun makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, or fitness for a particular purpose.",
    },
    {
      title: "5. Limitations",
      content: "In no event shall Md Abdul Mamun or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on this website.",
    },
    {
      title: "6. Governing Law",
      content: "Any claim relating to this website shall be governed by the laws of Bangladesh without regard to its conflict of law provisions.",
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
            <FileText size={16} />
            <span>Legal Guidelines</span>
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-8 leading-tight">
            Terms & <span className="text-primary text-glow">Conditions</span>
          </h1>

          <p className="text-xl text-muted-foreground mb-12 leading-relaxed">
            Last updated: February 01, 2026. Please read these terms and conditions carefully before using our service.
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
            <h3 className="text-xl font-bold mb-2">Need clarification?</h3>
            <p className="text-muted-foreground mb-6">
              If you have any questions about these Terms & Conditions, please reach out to us.
            </p>
            <a
              href="/contact-me"
              className="inline-flex items-center justify-center px-8 py-4 rounded-xl bg-primary text-primary-foreground font-bold hover:opacity-90 transition-opacity shadow-lg shadow-primary/20"
            >
              Get in Touch
            </a>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
