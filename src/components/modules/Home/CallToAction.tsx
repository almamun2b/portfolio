import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";

export default function CallToAction() {
  return (
    <section className="py-20 bg-muted/30">
      <Card className="container mx-auto text-center max-w-2xl bg-background p-10">
        <CardTitle className="text-3xl mb-4">
          Do you have a project idea? <br /> Let’s discuss your project!
        </CardTitle>
        <CardDescription className="text-muted-foreground mb-8">
          I`m always open to discussing new projects and creative ideas. Let`s
          connect and build something amazing together.
        </CardDescription>
        <CardFooter className="flex justify-center gap-4">
          <Button size="lg" asChild>
            <Link href="/contact-me">Contact Me</Link>
          </Button>
          <Button size="lg" asChild variant="outline">
            <Link href="/mamun.pdf" download>
              Download CV
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </section>
  );
}
