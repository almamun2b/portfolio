import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono, Space_Grotesk } from "next/font/google";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { personJsonLd, serializeJsonLd, websiteJsonLd } from "@/lib/jsonld";
import { site } from "@/lib/site";
import { getExperience, getProfile, getSocials } from "@/server/dal/profile";
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

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: site.title, template: `%s · ${site.name}` },
  description: site.description,
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
  alternates: { canonical: "/" },
  openGraph: {
    type: "profile",
    url: "/",
    siteName: site.name,
    title: site.title,
    description: site.description,
    locale: site.locale,
  },
  twitter: {
    card: "summary_large_image",
    title: site.title,
    description: site.description,
    creator: site.twitter,
  },
  verification: { google: site.googleSiteVerification },
};

// Matches --background for the default (dark) theme.
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
