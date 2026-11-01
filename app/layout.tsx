import type { Metadata, Viewport } from "next";
import { MotionProvider } from "@/components/motion/motion-provider";
import { env } from "@/lib/env";
import { siteUrl } from "@/lib/site-url";
import { structuredData } from "@/lib/structured-data";
import "./globals.css";

export const viewport: Viewport = {
  themeColor: "#080614",
  colorScheme: "dark",
};

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Arif — Fullstack Web Developer",
    template: "%s | Arif",
  },
  description:
    "Portfolio of Muhamad Arif Farhan (Arif), a Fullstack Web Developer specializing in Node.js, React, Next.js, TypeScript, and Laravel. Building fast, scalable web apps from database to UI.",
  applicationName: "Arif Portfolio",
  authors: [{ name: "Muhamad Arif Farhan", url: "https://github.com/m-arif-f-696" }],
  creator: "Muhamad Arif Farhan",
  publisher: "Muhamad Arif Farhan",
  keywords: [
    "Muhamad Arif Farhan",
    "Arif Farhan",
    "Arif",
    "Fullstack Web Developer",
    "Web Developer Indonesia",
    "Fullstack Developer",
    "Frontend Developer",
    "Backend Developer",
    "Software Engineer",
    "React Developer",
    "Next.js Developer",
    "TypeScript",
    "Node.js",
    "Laravel",
    "Tailwind CSS",
    "Portfolio",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    siteName: "Arif — Fullstack Web Developer",
    title: "Arif — Fullstack Web Developer",
    description:
      "Fast, scalable web apps from database to UI. Explore projects, skills, and GitHub activity of Muhamad Arif Farhan.",
    images: [
      {
        url: "/photo/me.png",
        width: 1200,
        height: 630,
        alt: "Muhamad Arif Farhan — Fullstack Web Developer",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Arif — Fullstack Web Developer",
    description:
      "Fast, scalable web apps from database to UI. Explore projects, skills, and GitHub activity of Muhamad Arif Farhan.",
    images: ["/photo/me.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: [
      { url: "/favicon/favicon.ico" },
      { url: "/favicon/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [
      { url: "/favicon/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
    shortcut: "/favicon/favicon.ico",
  },
  ...(env.GOOGLE_SITE_VERIFICATION
    ? {
        verification: {
          google: env.GOOGLE_SITE_VERIFICATION,
        },
      }
    : {}),
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </head>
      <body><MotionProvider>{children}</MotionProvider></body>
    </html>
  );
}
