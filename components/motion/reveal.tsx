"use client";

import { m } from "motion/react";
import type { ReactNode } from "react";

type RevealProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
  hero?: boolean;
};

export function Reveal({ children, className, delay = 0, hero = false }: RevealProps) {
  return (
    <m.div
      className={className}
      initial={{ opacity: hero ? 1 : 0, y: hero ? 12 : 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
      viewport={{ once: true, amount: 0.15 }}
    >
      {children}
    </m.div>
  );
}
