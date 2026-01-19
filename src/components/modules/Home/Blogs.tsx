"use client";

import { Button } from "@/components/ui/button";
import { BlogsResponse } from "@/types";
import { motion, Variants } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { BlogCard } from "../Blogs/blog-card";

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut",
    },
  },
};

export const Blogs = ({ blogsData }: { blogsData: BlogsResponse }) => {
  const { data } = blogsData;

  return (
    <section id="blogs" className="py-24 bg-muted/30">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
          <div className="max-w-2xl text-center md:text-left">
            <motion.span
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-primary font-bold tracking-widest uppercase text-sm mb-4 block"
            >
              Latest Insights
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-4xl md:text-5xl font-bold mb-6"
            >
              New From The <span className="text-primary">Blog</span>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-muted-foreground text-lg"
            >
              Industry trends, technical tutorials, and my journey through the
              world of software engineering.
            </motion.p>
          </div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="flex justify-center md:justify-end"
          >
            <Button
              size="lg"
              className="rounded-xl px-8 bg-primary hover:bg-primary/90 text-white font-bold h-12 group"
              asChild
            >
              <Link href="/blog">
                Explore All Posts
                <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
          </motion.div>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {data.posts.map((blog) => (
            <motion.div key={blog.id} variants={itemVariants}>
              <BlogCard
                image={blog.image}
                title={blog.title}
                description={blog.description}
                tags={blog.tags}
                category={blog.category}
                createdAt={blog.createdAt}
                author={blog.author}
                slug={blog.slug}
              />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};
