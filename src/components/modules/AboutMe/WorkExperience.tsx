"use client";

export const WorkExperience = () => {
  const experiences = [
    {
      role: "Software Engineer (1)",
      company: "Devxhub",
      period: "Jan 2022 – Present",
      description:
        "Worked 3+ years at Devxhub as a Software Engineer specializing in Nuxt.js, Next.js, and Astro.js. Contributed to multiple production-grade projects including a social media archiving system (SharpArchive), e-learning platforms, and blogs sites.",
      responsibilities: [
        "Implemented APIs and integrated backend services",
        "Developed user-centric and responsive UI/UX",
        "Implemented authentication and role-based access",
        "Optimized performance and SEO for high-traffic platforms",
        "Handled version upgrades and framework migrations",
        "Collaborated with cross-functional teams for scalable solutions",
      ],
    },
    {
      role: "Personal Projects & Continuous Learning",
      company: "Self-Driven",
      period: "Ongoing",
      description:
        "Completed advanced video courses on React.js, Next.js, Node.js, Express, Mongoose, and Prisma with PostgreSQL. Built several personal projects to apply backend and full-stack concepts.",
      responsibilities: [
        "Library Management System – book borrowing, aggregation, Mongoose middleware",
        "Digital Wallet System – wallet transactions, authentication, role-based access",
        "Tour Management System – end-to-end booking & management platform",
        "Hands-on practice with real work environments and modern workflows",
      ],
    },
  ];

  return (
    <section className="py-12">
      <h2 className="text-2xl font-semibold mb-6">Work Experience</h2>
      <div className="space-y-8">
        {experiences.map((exp, index) => (
          <div
            key={index}
            className="p-6 border rounded-xl shadow-sm hover:shadow-md transition-shadow bg-card text-card-foreground"
          >
            <h3 className="text-xl font-semibold">
              {exp.role} @ {exp.company}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {exp.period}
            </p>
            <p className="mt-3 text-gray-700 dark:text-gray-300">
              {exp.description}
            </p>
            <ul className="mt-4 list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
              {exp.responsibilities.map((task, i) => (
                <li key={i}>{task}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
};
