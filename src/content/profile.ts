import type { Education, Profile, Social } from "@/lib/schemas/content";

// Sources: Resume_Software_Engineer_Md_Abdul_Mamun.pdf, the GitHub profile
// README, and the previous portfolio. Keep every fact checkable (PRODUCT.md).

export const profile = {
  name: "Md Abdul Mamun",
  shortName: "Mamun",
  role: "Full-Stack Software Engineer",
  roles: [
    "Full-Stack Software Engineer",
    "React & Next.js Engineer",
    "Node.js & PostgreSQL Developer",
    "Shopify App Developer",
  ],
  pitch:
    "I design, build, and maintain production web apps end to end: React, Next.js, and Vue on the front, Node.js, Express, and PostgreSQL behind them, and Shopify apps that stores run on every day.",
  about: [
    "I'm a full-stack software engineer with over four years of professional experience building scalable, secure, high-performance web applications.",
    "My strongest side is the frontend: React, Next.js, and Vue/Nuxt, with a focus on accessibility, Core Web Vitals, and components a team can keep using. Behind that I build the rest of the system: Node.js and Express services, REST APIs, PostgreSQL with Prisma, MongoDB, webhooks, and third-party integrations.",
    "At Xubitar I build e-commerce systems: Shopify apps, multi-store order fulfilment, and inventory management. Before that I spent four years at Devxhub shipping client products, from a social media archiving system to e-learning and e-commerce platforms.",
  ],
  location: "Sirajganj, Bangladesh",
  timezone: "GMT+6 (Bangladesh Standard Time)",
  email: "almamun2b@gmail.com",
  phone: { display: "+880 1610-088700", href: "tel:+8801610088700" },
  whatsapp: "8801610088700",
  availability: {
    open: true,
    label: "Open to new opportunities",
    detail:
      "Full-time roles (remote or on-site) and contract work on web apps, Shopify apps, and integrations.",
  },
  careerStart: "2022-03",
  resume: {
    href: "/resume.pdf",
    fileName: "Md-Abdul-Mamun-Full-Stack-Software-Engineer.pdf",
  },
  languages: [
    { name: "Bangla", level: "Native" },
    { name: "English", level: "Professional working proficiency" },
  ],
} satisfies Profile;

export const socials = [
  {
    id: "github",
    label: "GitHub",
    handle: "almamun2b",
    href: "https://github.com/almamun2b",
  },
  {
    id: "linkedin",
    label: "LinkedIn",
    handle: "mamun-cse",
    href: "https://www.linkedin.com/in/mamun-cse",
  },
  {
    id: "x",
    label: "X",
    handle: "@almamun2b",
    href: "https://x.com/almamun2b",
  },
  {
    id: "facebook",
    label: "Facebook",
    handle: "almamun2b",
    href: "https://facebook.com/almamun2b",
  },
] satisfies Social[];

export const education = [
  {
    degree: "B.Sc. in Computer Science & Engineering",
    school: "Begum Rokeya University",
    place: "Rangpur, Bangladesh",
    start: "2017",
    end: "2021",
    note: "Core computer science and software engineering: data structures, algorithms, databases, networking, and software design.",
  },
] satisfies Education[];
