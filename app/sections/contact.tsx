"use client";

import { useActionState } from "react";
import { sendContactMessage } from "./contact-actions";
import type { ContactFormState } from "./contact-schema";
import { ASSET_PATH, SectionTitle } from "./shared";

const socialLinks = [
  // ["98583.svg", "X"],
  ["01784.svg", "LinkedIn", "https://www.linkedin.com/in/muhamad-arif-farhan-15804a377/"],
  ["7565e.svg", "Instagram", "https://www.instagram.com/marif._.farhan?obrf=M3RiNXRyb3BncGEy"],
  ["06369.svg", "GitHub", "https://github.com/m-arif-f-696/"],
  // ["d0b6f.svg", "Telegram"],
] as const;

export function ContactSection() {
  const [state, formAction, isPending] = useActionState<ContactFormState, FormData>(
    sendContactMessage,
    { status: "idle" },
  );

  return (
    <section className="contact" id="contact">
      <SectionTitle eyebrow="/ Get in Touch">Contact</SectionTitle>
      <form action={formAction}>
        <div className="honeypot" aria-hidden="true">
          <label>
            Website
            <input name="website" tabIndex={-1} autoComplete="off" />
          </label>
        </div>
        <label>
          Name
          <input name="name" placeholder="Your name" required />
        </label>
        <label>
          Email
          <input name="email" type="email" placeholder="your@email.com" required />
        </label>
        <label>
          Message
          <textarea name="message" placeholder="Your message..." required />
        </label>
        <button type="submit" disabled={isPending}>
          {isPending ? "Sending..." : "Send a message"}
        </button>
        {state.status === "success" && <p role="status" className="text-center mt-4">Message sent successfully.</p>}
        {state.status === "error" && (
          <p role="alert">{state.message}</p>
        )}
      </form>
      <div className="socials">
        {socialLinks.map(([icon, label, href]) => (
          <a href={href} target="_blank" rel="noopener noreferrer" aria-label={label} key={label}>
            <img src={`${ASSET_PATH}/${icon}`} alt="" />
          </a>
        ))}
      </div>
    </section>
  );
}
