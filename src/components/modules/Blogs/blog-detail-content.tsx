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
    <div className="space-y-8">
      {/* Featured Image */}
      <div className="relative w-full aspect-[1200/600] rounded-lg overflow-hidden">
        <Image
          src={image || "/placeholder.svg"}
          alt={title}
          fill
          className="object-cover"
          priority
        />
      </div>

      {/* Article Content */}
      <div className="prose prose-lg max-w-none">
        <p className="text-xl text-muted-foreground leading-relaxed">
          {description}
        </p>

        <h2>Introduction</h2>
        <p>
          This comprehensive guide will walk you through everything you need to
          know about this topic. Whether you`re a beginner or an experienced
          developer, you`ll find valuable insights and practical tips to enhance
          your skills.
        </p>

        <h2>Key Concepts</h2>
        <p>
          Understanding the fundamental concepts is crucial for mastering any
          technology. In this section, we`ll explore the core principles that
          form the foundation of this topic.
        </p>

        <h3>Getting Started</h3>
        <p>
          Let`s begin by setting up your development environment. Follow these
          steps to ensure you have everything you need to follow along with the
          examples in this article.
        </p>

        <ul>
          <li>Install the necessary tools and dependencies</li>
          <li>Configure your development environment</li>
          <li>Set up your first project</li>
          <li>Verify your installation</li>
        </ul>

        <h3>Best Practices</h3>
        <p>
          Following best practices ensures your code is maintainable, scalable,
          and efficient. Here are some essential guidelines to keep in mind as
          you work on your projects.
        </p>

        <ol>
          <li>Write clean and readable code</li>
          <li>Follow naming conventions</li>
          <li>Document your code properly</li>
          <li>Test your implementations</li>
        </ol>

        <h2>Advanced Techniques</h2>
        <p>
          Once you`ve mastered the basics, it`s time to explore more advanced
          techniques that will take your skills to the next level. These
          strategies are used by professionals to build robust and scalable
          applications.
        </p>

        <h2>Conclusion</h2>
        <p>
          We`ve covered a lot of ground in this article. By now, you should have
          a solid understanding of the topic and be ready to apply these
          concepts in your own projects. Remember to practice regularly and stay
          updated with the latest developments in the field.
        </p>
      </div>
    </div>
  );
}
