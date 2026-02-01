"use client";

import { motion } from "framer-motion";
import { Award, Calendar, GraduationCap } from "lucide-react";

export default function Education() {
  return (
    <section
      id="education"
      className="py-16 md:py-24 lg:py-32 bg-muted/30 relative overflow-hidden"
    >
      <div className="container mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-16 md:mb-24">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-primary font-bold tracking-widest uppercase text-xs md:text-sm mb-4 block"
          >
            Academic
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6"
          >
            Educational <span className="text-primary">Background</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-muted-foreground text-base md:text-lg"
          >
            A strong academic foundation in Computer Science and Engineering.
          </motion.p>
        </div>

        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative p-8 md:p-12 rounded-[2.5rem] border border-border/50 bg-card/50 backdrop-blur-sm overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -z-10" />

            <div className="flex flex-col md:flex-row gap-8 md:items-center justify-between">
              <div className="flex gap-6 items-start">
                <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                  <GraduationCap size={32} />
                </div>
                <div>
                  <h3 className="text-2xl md:text-3xl font-bold mb-2">
                    B. Sc (Engineering)
                  </h3>
                  <p className="text-primary font-bold text-lg mb-1">
                    Computer Science & Engineering
                  </p>
                  <p className="text-muted-foreground font-medium text-lg">
                    Begum Rokeya University, Rangpur
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="hidden items-center gap-3 p-4 rounded-2xl bg-background shadow-sm border border-border/50">
                  <Award className="text-primary" size={24} />
                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">
                      Result
                    </p>
                    <p className="text-lg font-black italic">CGPA 2.84</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-4 rounded-2xl bg-background shadow-sm border border-border/50">
                  <Calendar className="text-primary" size={24} />
                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">
                      Pass. Year
                    </p>
                    <p className="text-lg font-black italic">2017/2021</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-12 p-6 rounded-2xl bg-primary/5 border border-primary/10">
              <p className="text-muted-foreground text-sm italic text-center">
                Completed undergraduate studies with a focus on core engineering
                principles and software architecture.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
