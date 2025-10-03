"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Globe, Mail, MapPin, Phone, User } from "lucide-react";
import Link from "next/link";

export const PersonalInfo = () => {
  return (
    <section className="py-12">
      <h2 className="text-2xl font-semibold mb-8 text-center">
        Personal Information
      </h2>

      <Card className="max-w-4xl mx-auto shadow-md hover:shadow-lg transition-shadow">
        <CardHeader>
          <CardTitle className="text-xl">About Me</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6 text-gray-700 dark:text-gray-300">
            {/* Left Column */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <User className="w-5 h-5 text-primary" />
                <span className="font-medium">Md Abdul Mamun</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-primary" />
                <a href="mailto:mamun@example.com" className="hover:underline">
                  mamun@example.com
                </a>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-primary" />
                <a href="tel:+8801610088700" className="hover:underline">
                  +8801610088700
                </a>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-primary" />
                <span>Dhaka, Bangladesh</span>
              </div>
              <div className="flex items-center gap-3">
                <Globe className="w-5 h-5 text-primary" />
                <Link href="/" className="hover:underline">
                  mamun.dev
                </Link>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-medium">Status:</span>
                <Badge variant="secondary">Available for Work</Badge>
              </div>
            </div>
          </div>

          {/* Skills Highlight */}
          <div className="mt-6">
            <h3 className="text-lg font-medium mb-3">Key Skills</h3>
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary">Next.js</Badge>
              <Badge variant="secondary">React.js</Badge>
              <Badge variant="secondary">Nuxt.js</Badge>
              <Badge variant="secondary">Astro.js</Badge>
              <Badge variant="secondary">TailwindCSS</Badge>
              <Badge variant="secondary">MongoDB</Badge>
              <Badge variant="secondary">Prisma</Badge>
              <Badge variant="secondary">Express.js</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </section>
  );
};
