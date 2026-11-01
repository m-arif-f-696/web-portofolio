"use client";

import { m } from "motion/react";
import type { ReactNode } from "react";

const EASE = [0.22, 1, 0.36, 1] as const;

type HeroMotionProps = {
  children: ReactNode;
  className: string;
  delay?: number;
  fromY: number;
  x?: string;
};

function HeroMotion({ children, className, delay = 0, fromY, x }: HeroMotionProps) {
  return (
    <m.div
      className={className}
      initial={{ opacity: 0, x, y: fromY }}
      animate={{ opacity: 1, x, y: 0 }}
      transition={{ duration: 0.8, delay, ease: EASE }}
    >
      {children}
    </m.div>
  );
}

export function AnimatedNavbar({ children }: { children: ReactNode }) {
  return <HeroMotion className="navbar backdrop-blur-md" fromY={-120} x="-50%">{children}</HeroMotion>;
}

export function AnimatedHeroPhoto({ children }: { children: ReactNode }) {
  return <HeroMotion className="hero-person" delay={0.3} fromY={160} x="-50%">{children}</HeroMotion>;
}

export function AnimatedHeroSideContent({ children }: { children: ReactNode }) {
  return <HeroMotion className="hero-side-content" delay={0.85} fromY={18}>{children}</HeroMotion>;
}

export function AnimatedHeroActions({ children }: { children: ReactNode }) {
  return <HeroMotion className="hero-actions" delay={0.85} fromY={24} x="-50%">{children}</HeroMotion>;
}
