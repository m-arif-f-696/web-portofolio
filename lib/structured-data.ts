import { siteUrl } from "@/lib/site-url";

export const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Person",
      "@id": `${siteUrl}/#person`,
      name: "Muhamad Arif Farhan",
      alternateName: "Arif",
      jobTitle: "Fullstack Web Developer",
      description:
        "Fullstack Web Developer specializing in Node.js, React, Next.js, TypeScript, and Laravel. Building fast, scalable web apps from database to UI.",
      url: siteUrl,
      image: `${siteUrl}/photo/me.png`,
      sameAs: [
        "https://github.com/m-arif-f-696/",
        "https://www.linkedin.com/in/muhamad-arif-farhan-15804a377/",
        "https://www.instagram.com/marif._.farhan?obrf=M3RiNXRyb3BncGEy",
      ],
      knowsAbout: [
        "Fullstack Web Development",
        "Frontend Development",
        "Backend Development",
        "JavaScript",
        "TypeScript",
        "React",
        "Next.js",
        "Node.js",
        "Express",
        "Laravel",
        "PHP",
        "Web Architecture",
        "REST API",
        "Tailwind CSS",
      ],
      alumniOf: [
        {
          "@type": "EducationalOrganization",
          name: "Universitas Gadjah Mada",
          url: "https://www.ugm.ac.id",
        },
        {
          "@type": "EducationalOrganization",
          name: "SMAN 1 Sindangkasih",
        },
      ],
    },
    {
      "@type": "WebSite",
      "@id": `${siteUrl}/#website`,
      url: siteUrl,
      name: "Arif — Fullstack Web Developer Portfolio",
      description:
        "Official portfolio of Muhamad Arif Farhan (Arif), Fullstack Web Developer.",
      publisher: {
        "@id": `${siteUrl}/#person`,
      },
      inLanguage: ["en", "id"],
    },
    {
      "@type": "ProfilePage",
      "@id": `${siteUrl}/#profilepage`,
      url: siteUrl,
      name: "Arif — Fullstack Web Developer",
      isPartOf: {
        "@id": `${siteUrl}/#website`,
      },
      about: {
        "@id": `${siteUrl}/#person`,
      },
      mainEntity: {
        "@id": `${siteUrl}/#person`,
      },
    },
  ],
};

