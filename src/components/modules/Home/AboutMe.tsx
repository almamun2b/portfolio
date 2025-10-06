import mamun from "@/assets/mamun.png";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";

export default function AboutMe() {
  return (
    <section id="about" className="py-20">
      <div className="container mx-auto grid md:grid-cols-2 gap-12 items-center">
        {/* Image Section */}
        <div className="flex justify-center">
          <Card className="overflow-hidden rounded-2xl shadow-sm">
            <CardContent className="p-0">
              <Image
                src={mamun} // replace with your image path
                alt="Md Abdul Mamun"
                width={400}
                height={450}
                className="object-cover"
              />
            </CardContent>
          </Card>
        </div>

        {/* Text Section */}
        <div>
          <h2 className="text-3xl font-bold mb-4">About Me</h2>
          <p className="text-muted-foreground leading-relaxed mb-6">
            I am <span className="font-semibold">Md Abdul Mamun</span>, a
            passionate <span className="font-semibold">Frontend Developer</span>{" "}
            with{" "}
            <span className="font-semibold">
              3+ years of professional experience
            </span>{" "}
            building modern and scalable applications. I specialize in{" "}
            <span className="font-semibold">
              React.js, Next.js, Nuxt.js, and Astro.js
            </span>
            .
          </p>
          <p className="text-muted-foreground leading-relaxed mb-6">
            Alongside frontend expertise, I have hands-on knowledge in backend
            technologies such as{" "}
            <span className="font-semibold">
              Express.js, Node.js, MongoDB (Mongoose), and Prisma with
              PostgreSQL
            </span>{" "}
            through personal projects. My goal is to build seamless digital
            experiences that delight users and solve real-world problems.
          </p>

          {/* Buttons */}
          <div className="flex gap-4">
            <Button variant="default" asChild>
              <Link href="/contact-me">Contact Me</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/mamun.pdf" download>
                Download CV
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
