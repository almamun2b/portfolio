import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono, Space_Grotesk } from "next/font/google";
import { motionInitScript } from "@/components/layout/motion-toggle";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { personJsonLd, serializeJsonLd, websiteJsonLd } from "@/lib/jsonld";
import { site, siteDescription } from "@/lib/site";
import {
  getCareerStats,
  getExperience,
  getProfile,
  getSocials,
} from "@/server/dal/profile";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-space-grotesk",
});

// Only used for small labels and code: not worth a preload.
const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-jetbrains-mono",
  preload: false,
});

// Durations ("3 mo"), the years-of-experience figures, and the footer's ©
// year are computed when a page renders. Every page is static, so re-render
// daily (ISR) rather than freezing them at deploy time.
export const revalidate = 86400;

export async function generateMetadata(): Promise<Metadata> {
  const { years } = await getCareerStats();
  const description = siteDescription(years);
  return {
    metadataBase: new URL(site.url),
    title: { default: site.title, template: `%s · ${site.name}` },
    description: description,
    applicationName: site.name,
    authors: [{ name: site.name, url: site.url }],
    creator: site.name,
    keywords: [
      "Md Abdul Mamun",
      "full-stack software engineer",
      "React developer",
      "Next.js developer",
      "Node.js developer",
      "Shopify app developer",
      "PostgreSQL",
      "Bangladesh",
    ],
    // No canonical or og:url here: they'd be inherited by the 404 page. Each
    // page sets its own through pageMetadata().
    openGraph: {
      type: "profile",
      siteName: site.name,
      title: site.title,
      description: description,
      locale: site.locale,
    },
    twitter: {
      card: "summary_large_image",
      title: site.title,
      description: description,
      site: site.twitter,
      creator: site.twitter,
    },
    verification: { google: site.googleSiteVerification },
  };
}

// Matches --background for the default (dark) theme. The theme is a class,
// not a media query, so ThemeToggle updates the meta when it switches.
export const viewport: Viewport = {
  themeColor: "#05090b",
  colorScheme: "dark light",
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const [profile, socials, experience] = await Promise.all([
    getProfile(),
    getSocials(),
    getExperience(),
  ]);
  const fonts = `${inter.variable} ${spaceGrotesk.variable} ${jetbrainsMono.variable}`;

  return (
    <html lang="en" className={`dark ${fonts}`} suppressHydrationWarning>
      <body>
        <script dangerouslySetInnerHTML={{ __html: motionInitScript }} />
        <ThemeProvider>{children}</ThemeProvider>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: serializeJsonLd([
              personJsonLd(profile, socials, experience),
              websiteJsonLd(),
            ]),
          }}
        />
      </body>
    </html>
  );
}
