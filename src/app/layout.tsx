import { Toaster } from "@/components/ui/sonner";
import AuthProvider from "@/providers/AuthProvider";
import { ThemeProvider } from "@/providers/theme-provider";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://portfolio-mamun.vercel.app"),
  title: "Md Abdul Mamun | Portfolio",
  description:
    "A passionate Software Engineer with 3.5+ years of experience building modern, scalable, and user-friendly applications using Next.js, Nuxt.js, Astro.js, and more.",
  verification: {
    google: "FrEB4FD5CYUogdl7GrnSGBmkcKr7RVWz2hUtWjTFojU",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
          >
            <Toaster richColors position="top-center" />
            {children}
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
