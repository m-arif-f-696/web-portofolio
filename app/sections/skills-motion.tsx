"use client";

import { m, useInView } from "motion/react";
import type { Transition } from "motion/react";
import { useEffect, useRef, useState } from "react";
import type { CSSProperties, ReactNode } from "react";

const EASE = [0.22, 1, 0.36, 1] as const;

// The heading leads the entrance; every skill then starts at the same moment.
const SKILL_DELAY = 0.35;

const MIN_TRAVEL = 100;
const MAX_TRAVEL = 300;

const SKILL_TRANSITION = {
  type: "spring",
  stiffness: 240,
  damping: 19,
  mass: 0.85,
  delay: SKILL_DELAY,
  opacity: { duration: 0.45, ease: EASE, delay: SKILL_DELAY },
} satisfies Transition;

const INSTANT: Transition = { duration: 0 };

type SkillOffset = { x: number; y: number };

type AnimatedSkillsHeadingProps = {
  children: ReactNode;
};

export function AnimatedSkillsHeading({ children }: AnimatedSkillsHeadingProps) {
  return (
    <m.h2
      initial={{ opacity: 0, y: 64 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.35 }}
      transition={{ duration: 0.65, ease: EASE }}
    >
      {children}
    </m.h2>
  );
}

type AnimatedSkillCloudProps = {
  items: readonly (readonly [name: string, icon: string, scale: number])[];
  assetPath: string;
};

export function AnimatedSkillCloud({ items, assetPath }: AnimatedSkillCloudProps) {
  const cloudRef = useRef<HTMLDivElement>(null);
  const startedRef = useRef(false);
  const inView = useInView(cloudRef, { once: true, amount: 0.2 });
  const [offsets, setOffsets] = useState<SkillOffset[] | null>(null);
  const [started, setStarted] = useState(false);

  // Each chip starts further out along the line from the cloud centre to its
  // final slot, so the entrance works for the desktop scatter and the
  // tablet/mobile grid without hardcoded positions.
  useEffect(() => {
    const cloud = cloudRef.current;
    if (!cloud) return;

    const measure = () => {
      if (startedRef.current) return;

      const cloudRect = cloud.getBoundingClientRect();
      const centerX = cloudRect.left + cloudRect.width / 2;
      const centerY = cloudRect.top + cloudRect.height / 2;
      const chips = cloud.querySelectorAll<HTMLElement>(".skill");

      setOffsets(
        Array.from(chips).map((chip, index) => {
          const rect = chip.getBoundingClientRect();
          const dx = rect.left + rect.width / 2 - centerX;
          const dy = rect.top + rect.height / 2 - centerY;
          const distance = Math.hypot(dx, dy);
          // A chip sitting exactly on the centre still needs a direction.
          const angle =
            distance > 1
              ? Math.atan2(dy, dx)
              : (index / Math.max(chips.length, 1)) * Math.PI * 2;
          const travel = Math.min(MAX_TRAVEL, Math.max(MIN_TRAVEL, distance * 0.6));

          return { x: Math.cos(angle) * travel, y: Math.sin(angle) * travel };
        }),
      );
    };

    measure();
    window.addEventListener("resize", measure);

    return () => window.removeEventListener("resize", measure);
  }, []);

  useEffect(() => {
    if (!inView || !offsets || startedRef.current) return;

    startedRef.current = true;
    setStarted(true);
  }, [inView, offsets]);

  return (
    <div className="skill-cloud" ref={cloudRef}>
      {items.map(([name, icon, scale], index) => {
        const offset = offsets?.[index] ?? { x: 0, y: 0 };

        return (
          <m.div
            className={`skill skill-${index + 1}`}
            key={name}
            initial={false}
            animate={
              started
                ? { opacity: 1, x: 0, y: 0, scale: 1 }
                : { opacity: 0, x: offset.x, y: offset.y, scale: 0.85 }
            }
            transition={started ? SKILL_TRANSITION : INSTANT}
          >
            <span>
              <img
                src={`${assetPath}/${icon}`}
                alt=""
                style={{ "--logo-scale": scale } as CSSProperties}
              />
            </span>
            {name}
          </m.div>
        );
      })}
    </div>
  );
}
