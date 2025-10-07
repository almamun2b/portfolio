import { Card, CardContent } from "@/components/ui/card";

const stats = [
  { label: "Experience", value: "3+" },
  { label: "Projects Completed", value: "30+" },
  { label: "Happy Clients", value: "20+" },
  { label: "Technologies", value: "10+" },
];

export default function Stats() {
  return (
    <section className="py-16 px-6 w-full max-w-7xl mx-auto">
      <div className="container mx-auto grid gap-6 sm:grid-cols-2 md:grid-cols-4">
        {stats.map((stat, idx) => (
          <Card
            key={idx}
            className="group rounded-2xl shadow-sm border bg-background hover:shadow-xl transition"
          >
            <CardContent className="p-6 text-center">
              <p className="text-3xl font-bold text-primary group-hover:scale-130 transition-all duration-150 ease-in-out">
                {stat.value}
              </p>
              <p className="mt-2 text-sm text-muted-foreground">{stat.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
