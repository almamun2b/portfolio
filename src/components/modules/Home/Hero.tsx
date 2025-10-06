"use client";

import mamun from "@/assets/mamun.png";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative min-h-[90vh] flex flex-col lg:flex-row items-center justify-between gap-12 px-8">
      {/* Left Content */}
      <div className="w-full md:w-1/2 text-center lg:text-left">
        <h1 className="text-4xl sm:text-6xl font-bold tracking-tight">
          Hi, I’m <span className="text-primary">Md Abdul Mamun</span>
        </h1>

        <p className="mt-4 max-w-xl text-lg text-muted-foreground">
          A passionate Software Engineer with 3+ years of experience building
          modern, scalable, and user-friendly applications using{" "}
          <span className="font-medium">Next.js, Nuxt.js, Astro.js</span>, and
          more.
        </p>

        <div className="mt-8 flex flex-wrap gap-4 justify-center lg:justify-start">
          {/* email to  */}
          <Button size="lg" asChild className="rounded-xl shadow-sm">
            <Link href="mailto:almamun2b@gmail.com" target="_blank">
              Say Hello
            </Link>
          </Button>

          <Button
            size="lg"
            asChild
            variant="outline"
            className="rounded-xl shadow-sm"
          >
            <Link href="/contact">Contact Me</Link>
          </Button>
        </div>
      </div>

      {/* Right Image */}
      <div className="w-full md:w-1/2 flex justify-center">
        <div className="relative w-64 h-64 sm:w-96 sm:h-96 rounded-full overflow-hidden shadow-lg border border-border">
          <Image
            src={mamun}
            alt="Md Abdul Mamun"
            fill
            className="object-cover"
            priority
          />
        </div>
      </div>
    </section>
  );
}
