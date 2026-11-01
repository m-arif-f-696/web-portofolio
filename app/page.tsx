import { ContactSection } from "./sections/contact";
import { Reveal } from "@/components/motion/reveal";
import { EducationSection } from "./sections/education";
import { FooterSection } from "./sections/footer";
import { GithubSection } from "./sections/github";
import { HeroSection } from "./sections/hero";
// import { ProjectsSection } from "./sections/projects";
import { SkillsSection } from "./sections/skills";

export default function HomePage() {
  return (
    <main>
      <HeroSection />
      <SkillsSection />
      <Reveal delay={0.05}><EducationSection /></Reveal>
      {/* <Reveal delay={0.1}><ProjectsSection /></Reveal> */}
      <Reveal delay={0.1}><GithubSection /></Reveal>
      <Reveal delay={0.1}><ContactSection /></Reveal>
      <Reveal><FooterSection /></Reveal>
    </main>
  );
}
