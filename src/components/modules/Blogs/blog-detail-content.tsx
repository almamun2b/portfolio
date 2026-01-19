"use client";

import { motion } from "framer-motion";
import Image from "next/image";

interface BlogDetailContentProps {
  image: string;
  title: string;
  description: string;
}

export function BlogDetailContent({
  image,
  title,
  description,
}: BlogDetailContentProps) {
  return (
    <div className="space-y-16">
      {/* Immersive Featured Image */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="relative aspect-16/10 lg:aspect-21/9 overflow-hidden rounded-[2.5rem] border border-border/50 group shadow-2xl"
      >
        <div className="relative w-full h-full">
          <Image
            src={image || "/placeholder.svg"}
            alt={title}
            fill
            className="object-cover transition-transform duration-1000 group-hover:scale-105"
            priority
          />
          {/* Subtle Overlay */}
          <div className="absolute inset-0 bg-linear-to-t from-background/40 to-transparent" />
        </div>
      </motion.div>

      {/* Professional Prose Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="max-w-[800px] mx-auto"
      >
        <div className="prose prose-xl dark:prose-invert prose-headings:font-black prose-headings:tracking-tight prose-p:text-muted-foreground prose-p:leading-[1.8] prose-strong:text-foreground prose-a:text-primary hover:prose-a:underline prose-li:text-muted-foreground prose-img:rounded-3xl max-w-none">
          <p className="text-2xl font-medium text-foreground leading-[1.6] mb-12">
            {description}
          </p>

          <h2>Technical Deep Dive</h2>
          <p>
            In the ever-evolving landscape of software engineering, staying
            ahead means mastering both the broad paradigms and the intricate
            details. This article aims to dismantle complex concepts into
            actionable insights.
          </p>

          <blockquote>
            &quot;Great code is not just written; it&apos;s meticulously crafted
            through iterations of learning and refinement.&quot;
          </blockquote>

          <h2>Core Architecture</h2>
          <p>
            Understanding the underlying structure is paramount. When building
            scalable systems, we focus on modularity, high cohesion, and low
            coupling. This ensures that as the codebase grows, it remains
            maintainable and robust.
          </p>

          <h3>Implementation Strategy</h3>
          <p>
            To successfully deploy these concepts, we recommend a phased
            approach. Start by auditing your current stack, then gradually
            integrate the patterns described below:
          </p>

          <ul>
            <li>Analyze existing bottlenecks and technical debt</li>
            <li>Implement modular design patterns and clean interfaces</li>
            <li>Automate testing and deployment pipelines</li>
            <li>Monitor performance and iterate based on real-world metrics</li>
          </ul>

          <h3>Best Practices & Patterns</h3>
          <p>
            Consistency is the hallmark of professional engineering. Adhering to
            established standards not only improves code quality but also
            facilitates seamless collaboration across teams.
          </p>

          <ol>
            <li>Prioritize readability and self-documenting code</li>
            <li>Maintain a strict separation of concerns</li>
            <li>Leverage type safety and modern tooling</li>
            <li>Commit to continuous integration and delivery</li>
          </ol>

          <h2>Conclusion</h2>
          <p>
            Mastering these techniques represents a significant step forward in
            your journey as an engineer. By combining technical excellence with
            a design-first mindset, you can build digital experiences that are
            truly exceptional. Stay curious, keep building, and never stop
            refining your craft.
          </p>
        </div>
      </motion.div>
    </div>
  );
}
