"use client";

import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ArrowRight, Mail, Sparkles } from "lucide-react";
import Link from "next/link";

export default function CallToAction() {
  return (
    <section className="py-16 md:py-20 relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full -z-10">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-primary/20 rounded-full blur-[120px] opacity-50" />
      </div>

      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative group p-8 md:p-14 lg:p-16 rounded-[2.5rem] border border-primary/20 bg-card/40 backdrop-blur-xl overflow-hidden shadow-2xl"
        >
          {/* Decorative shapes inside the card */}
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary/10 rounded-full blur-3xl group-hover:scale-110 transition-transform duration-700" />
          <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-primary/10 rounded-full blur-3xl group-hover:scale-110 transition-transform duration-700" />

          <div className="relative z-10 max-w-3xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-xs md:text-sm font-bold mb-6"
            >
              <Sparkles size={16} />
              <span>Available for New Opportunities</span>
            </motion.div>

            <h2 className="text-3xl md:text-5xl font-bold mb-6 leading-tight">
              Let&apos;s Build Something{" "}
              <span className="text-primary text-glow">Extraordinary</span>{" "}
              Together
            </h2>

            <p className="text-lg text-muted-foreground mb-10 max-w-2xl mx-auto">
              Ready to turn your vision into reality? Whether you have a
              specific project in mind or just want to say hi, I&apos;m all
              ears.
            </p>

            <div className="flex flex-wrap justify-center gap-4 md:gap-6">
              <Button
                size="lg"
                className="rounded-xl px-8 md:px-10 h-14 text-base md:text-lg font-bold shadow-lg shadow-primary/20 group/btn"
                asChild
              >
                <Link href="/contact-me">
                  Contact Me
                  <ArrowRight className="ml-2 group-hover/btn:translate-x-1 transition-transform" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="rounded-xl px-8 md:px-10 h-14 text-base md:text-lg font-bold border-2 hover:bg-primary/5 group/btn"
                asChild
              >
                <Link href="/mamun.pdf" target="_blank">
                  <Mail className="mr-2" size={20} />
                  Get My Resume
                </Link>
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
