"use client";

export const WorkExperience = () => {
  const experiences = [
    {
      role: "Full Stack Engineer",
      company: "Xubitar",
      period: "Jul 2026 – Present",
      description:
        "Building production-grade eCommerce web applications, Shopify-based applications, and inventory management systems with a focus on performance, security, and maintainability.",
      responsibilities: [
        "Design, develop, and maintain eCommerce applications with React, Next.js, Express.js, Node.js, Prisma, and PostgreSQL",
        "Build Shopify apps using the Shopify Admin API, Storefront API, and webhooks",
        "Build inventory management systems — stock tracking, low-stock alerts, purchase/sales flows, and reporting",
        "Build scalable backend services and RESTful APIs for performance, security, and maintainability",
        "Own ongoing maintenance, bug fixes, and performance optimization for live eCommerce applications",
      ],
    },
    {
      role: "Software Engineer",
      company: "Developer eXperience Hub (Devxhub)",
      period: "Mar 2022 – Feb 2026",
      description:
        "Worked nearly 4 years at Devxhub as a Software Engineer specializing in Nuxt.js, Next.js, React, and Vue. Delivered production-grade client projects including a social media archiving system, e-learning platforms, and eCommerce sites.",
      responsibilities: [
        "Delivered user-facing features across Social Media Archiving, LMS, and eCommerce platforms",
        "Implemented REST API integrations covering contracts, auth, error handling, and data fetching",
        "Implemented scalable state management with Redux, Pinia, and Vuex",
        "Built reusable components and consistent UI/UX with Tailwind CSS and Vuetify",
        "Built responsive, accessible, and SEO-optimized UIs with a focus on Core Web Vitals",
        "Collaborated in Agile workflows — stand-ups, sprint planning, and peer code reviews",
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
