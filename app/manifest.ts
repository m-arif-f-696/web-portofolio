import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Arif — Fullstack Web Developer",
    short_name: "Arif",
    description:
      "Portfolio of Muhamad Arif Farhan (Arif), a Fullstack Web Developer.",
    start_url: "/",
    display: "standalone",
    background_color: "#080614",
    theme_color: "#080614",
    icons: [
      {
        src: "/favicon/android-chrome-192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/favicon/android-chrome-512x512.png",
        sizes: "512x512",
        type: "image/png",
      },
      {
        src: "/favicon.ico",
        sizes: "any",
        type: "image/x-icon",
      },
    ],
  };
}

