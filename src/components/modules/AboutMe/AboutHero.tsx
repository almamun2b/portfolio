"use client";

import mamun2 from "@/assets/mamun2.png";
import { motion } from "framer-motion";
import Image from "next/image";

export const AboutHero = () => {
  return (
    <section className="relative py-16 lg:py-24 overflow-hidden">
      <div className="container mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Text Section */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="order-2 lg:order-1"
          >
            <span className="text-primary font-bold tracking-widest uppercase text-sm mb-4 block">
              The Journey
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-8 leading-tight">
              I am <span className="text-primary">Md Abdul Mamun</span>
            </h1>
            <div className="space-y-6 text-muted-foreground text-lg leading-relaxed">
              <p>
                A{" "}
                <span className="text-foreground font-semibold">
                  Full-Stack Software Engineer
                </span>{" "}
                with over
                <span className="text-foreground font-semibold">
                  {" "}
                  4+ years of professional experience
                </span>{" "}
                designing, building, and maintaining scalable, secure, and
                high-performance web applications.
              </p>
              <p>
                I specialize in frontend engineering with{" "}
                <span className="text-foreground font-semibold">
                  React, Next.js, and Vue/Nuxt
                </span>
                , crafting seamless digital experiences that balance aesthetic
                beauty with technical precision.
              </p>
              <p>
                Beyond the frontend, I bring strong full-stack capabilities
                across Node.js, Express.js, REST APIs, PostgreSQL, and MongoDB —
                currently building eCommerce and Shopify-based applications at
                Xubitar.
              </p>
            </div>
          </motion.div>

          {/* Image Section */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="order-1 lg:order-2 flex justify-center relative"
          >
            <div className="relative group">
              {/* Decorative background circle */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] md:w-[450px] md:h-[450px] bg-primary/10 rounded-full blur-2xl -z-10 animate-pulse" />

              <div className="relative overflow-hidden rounded-[3rem] border-4 border-background shadow-2xl w-[300px] h-[380px] md:w-[400px] md:h-[500px]">
                <Image
                  src={mamun2}
                  alt="Md Abdul Mamun"
                  fill
                  className="object-cover object-top group-hover:scale-105 transition-all duration-700"
                  priority
                />
                <div className="absolute inset-0 bg-linear-to-t from-background/40 to-transparent" />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
