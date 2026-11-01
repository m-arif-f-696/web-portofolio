import { skills } from "./data";
import { ASSET_PATH } from "./shared";
import { AnimatedSkillCloud, AnimatedSkillsHeading } from "./skills-motion";

export function SkillsSection() {
  return (
    <section className="focus" id="skills">
      <p className="serif-label">Hello!</p>
      <AnimatedSkillsHeading>
        My focus is on robust backend engineering, web architecture, and modern technology <span>to craft scalable solutions that solve real problems.</span>
      </AnimatedSkillsHeading>
      <AnimatedSkillCloud items={skills} assetPath={ASSET_PATH} />
    </section>
  );
}
