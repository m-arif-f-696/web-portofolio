"use client";

import { useEffect, useState } from "react";

type NavLinksProps = {
  items: readonly (readonly [label: string, id: string])[];
};

// A section becomes active once its top crosses this line, so the state
// changes while the section is still entering the viewport.
const ACTIVATION_LINE = 0.4;

export function NavLinks({ items }: NavLinksProps) {
  const [activeId, setActiveId] = useState(items[0][1]);

  useEffect(() => {
    const sections = items
      .map(([, id]) => document.getElementById(id))
      .filter((element): element is HTMLElement => element !== null);

    if (sections.length === 0) return;

    let frame = 0;

    const update = () => {
      frame = 0;
      const line = window.innerHeight * ACTIVATION_LINE;
      let current = sections[0].id;

      for (const section of sections) {
        if (section.getBoundingClientRect().top <= line) current = section.id;
      }

      const atPageEnd =
        window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - 2;

      if (atPageEnd) current = sections[sections.length - 1].id;

      setActiveId(current);
    };

    const scheduleUpdate = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", scheduleUpdate, { passive: true });
    window.addEventListener("resize", scheduleUpdate);
    window.addEventListener("hashchange", scheduleUpdate);

    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", scheduleUpdate);
      window.removeEventListener("resize", scheduleUpdate);
      window.removeEventListener("hashchange", scheduleUpdate);
    };
  }, [items]);

  return (
    <div className="nav-links">
      {items.map(([label, id]) => {
        const isActive = id === activeId;

        return (
          <a
            className={isActive ? "active" : undefined}
            href={`#${id}`}
            key={id}
            aria-current={isActive ? "location" : undefined}
          >
            {label}
          </a>
        );
      })}
    </div>
  );
}
