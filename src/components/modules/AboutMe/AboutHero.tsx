import mamun from "@/assets/mamun.png";
import Image from "next/image";

export const AboutHero = () => {
  return (
    <section className="flex flex-col md:flex-row items-center justify-between gap-10 py-16">
      {/* Avatar / Profile Image */}
      <div className="relative w-80 min-w-80 h-80 rounded-full overflow-hidden shadow-lg">
        <Image src={mamun} alt="Md Abdul Mamun" fill className="object-cover" />
      </div>

      {/* Intro Text */}
      <div className="max-w-3xl">
        <h1 className="text-4xl font-bold mb-4">
          I am <span className="text-primary">Md Abdul Mamun</span>
        </h1>
        <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
          A passionate Frontend Developer with{" "}
          <span className="font-semibold">
            3+ years of professional experience
          </span>{" "}
          building modern and scalable applications. I specialize in{" "}
          <span className="font-medium">
            React.js, Next.js, Nuxt.js, and Astro.js
          </span>
          .
        </p>
        <p className="mt-4 text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
          Alongside frontend expertise, I have hands-on knowledge in backend
          technologies such as{" "}
          <span className="font-medium">
            Express.js, Node.js, MongoDB (Mongoose), and Prisma with PostgreSQL
          </span>{" "}
          through personal projects. My goal is to build seamless digital
          experiences that delight users and solve real-world problems.
        </p>
      </div>
    </section>
  );
};
