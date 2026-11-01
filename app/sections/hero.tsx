import { ASSET_PATH, Arrow } from "./shared";
import { navigation } from "./data";
import { NavLinks } from "./nav-links";
import {
  AnimatedHeroActions,
  AnimatedHeroPhoto,
  AnimatedHeroSideContent,
  AnimatedNavbar,
} from "./hero-motion";
import Image from "next/image";

export function HeroSection() {
  return (
    <section className="hero" id="home">
      {/* <img className="hero-texture" src={`${ASSET_PATH}/99682.png`} alt="" /> */}
      <AnimatedNavbar>
        <a className="logo" href="#home" aria-label="Arif, home">
          <img src={`${ASSET_PATH}/3b62e.svg`} alt="" />
        </a>
        <NavLinks items={navigation} />
        <div className="language" aria-label="Language: Indonesian">
          <img src={`${ASSET_PATH}/cdcb1.png`} alt="" />
          <span>IDN</span>
        </div>
      </AnimatedNavbar>
      <div className="hero-titles">
        <h1>Hi I’m Arif</h1>
        <p>Fullstack Web Dev</p>
      </div>
      <AnimatedHeroPhoto>
        <Image
          className="hero-person-image"
          src="/photo/me.png"
          alt="Arif"
          fill
          priority
          sizes="(max-width: 760px) min(150vw, 684px), (max-width: 1100px) min(92vw, 920px), min(79.64vw, 1529px)"
        />
      </AnimatedHeroPhoto>
      <AnimatedHeroSideContent>
        <div className="availability">
          <img src={`${ASSET_PATH}/db561.svg`} alt="" />
          Available for new opportunities
        </div>
        <p className="hero-copy">
          I build fast, scalable web apps — from database to UI.
        </p>
      </AnimatedHeroSideContent>
      <AnimatedHeroActions>
        <a className="button primary" href="#projects">
          View Projects <Arrow />
        </a>
        <a className="button secondary" href="#contact">
          Get in Touch <Arrow />
        </a>
      </AnimatedHeroActions>
    </section>
  );
}
