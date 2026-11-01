// The third value is an optical size correction: dense, filled marks read
// larger than thin line-art ones at the same box size, so they are nudged
// apart to keep the cloud visually even.
export const skills = [
  ["Node.js", "c0943.svg", 1],
  ["React", "83653.svg", 1.06],
  ["Next.js", "a8f9e.svg", 0.94],
  ["TypeScript", "c8b06.svg", 0.93],
  ["JavaScript", "51e9d.svg", 0.9],
  ["Express", "40b85.svg", 0.97],
  ["Laravel", "825a5.svg", 1.08],
  ["PHP", "d6a27.svg", 1.04],
] as const;

export const projects = [
  {
    title: "Finyon Dashboard",
    category: "Fintech · Product Design",
    description:
      "A fintech dashboard concept with transaction, account, and analytics views.",
    position: "20% 66%",
  },
  {
    title: "Heavenly Real Estate",
    category: "Web Apps · UI/UX Design",
    description:
      "A real estate web app concept focused on property discovery and listing experiences.",
    position: "80% 66%",
  },
  {
    title: "Cluvio Learning Platform",
    category: "EdTech · Mobile Design",
    description:
      "An education platform concept designed for learning journeys and course discovery.",
    position: "20% 82%",
  },
  {
    title: "Trusten M-Banking",
    category: "Fintech · UI System",
    description:
      "A mobile banking concept focused on transactions, balances, and account management.",
    position: "80% 82%",
  },
] as const;

export const navigation = [
  ["Home", "home"],
  ["Skills", "skills"],
  ["Education", "education"],
  // ["Projects", "projects"],
  ["GitHub", "github"],
  ["Contact", "contact"],
] as const;
