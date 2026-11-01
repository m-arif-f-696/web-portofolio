"use server";

import { headers } from "next/headers";
import { Resend } from "resend";
import { env } from "../../lib/env";
import { contactSchema, type ContactFormState } from "./contact-schema";

const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000;
const RATE_LIMIT_MAX_REQUESTS = 3;
const requestLog = new Map<string, number[]>();

function getClientKey(requestHeaders: Headers): string {
  return requestHeaders.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
}

function isRateLimited(key: string, now: number): boolean {
  const recentRequests = (requestLog.get(key) ?? []).filter(
    (timestamp) => now - timestamp < RATE_LIMIT_WINDOW_MS,
  );

  if (recentRequests.length >= RATE_LIMIT_MAX_REQUESTS) {
    requestLog.set(key, recentRequests);
    return true;
  }

  recentRequests.push(now);
  requestLog.set(key, recentRequests);
  return false;
}

export async function sendContactMessage(
  _previousState: ContactFormState,
  formData: FormData,
): Promise<ContactFormState> {
  const parsed = contactSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    message: formData.get("message"),
    website: formData.get("website"),
  });

  if (!parsed.success) {
    return { status: "error", message: parsed.error.issues[0]?.message ?? "Invalid form data." };
  }

  if (parsed.data.website) {
    return { status: "success" };
  }

  const requestHeaders = await headers();
  if (isRateLimited(getClientKey(requestHeaders), Date.now())) {
    return { status: "error", message: "Too many requests. Please try again later." };
  }

  if (!env.CONTACT_EMAIL || !env.RESEND_API_KEY || !env.RESEND_FROM_EMAIL) {
    return { status: "error", message: "Contact form is not configured yet." };
  }

  const resend = new Resend(env.RESEND_API_KEY);
  const { error } = await resend.emails.send({
    from: env.RESEND_FROM_EMAIL,
    to: [env.CONTACT_EMAIL],
    replyTo: parsed.data.email,
    subject: `Portfolio message from ${parsed.data.name}`,
    text: `Name: ${parsed.data.name}\nEmail: ${parsed.data.email}\n\n${parsed.data.message}`,
  });

  if (error) {
    console.error("Contact email delivery failed:", error.message);
    return { status: "error", message: "Unable to send your message. Please try again later." };
  }

  return { status: "success" };
}
