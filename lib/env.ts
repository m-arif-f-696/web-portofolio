import { z } from "zod";

// Empty strings in .env files should behave like a missing value so the
// portfolio keeps rendering its fallback state instead of crashing the build.
const optionalString = z.preprocess(
  (value) => (typeof value === "string" && value.trim() === "" ? undefined : value),
  z.string().trim().min(1).optional(),
);

const envSchema = z.object({
  GITHUB_USERNAME: optionalString,
  GITHUB_TOKEN: optionalString,
  CONTACT_EMAIL: optionalString,
  RESEND_API_KEY: optionalString,
  RESEND_FROM_EMAIL: optionalString,
  SITE_URL: optionalString,
  GOOGLE_SITE_VERIFICATION: optionalString,
  VERCEL_PROJECT_PRODUCTION_URL: optionalString,
  VERCEL_URL: optionalString,
});

const parsed = envSchema.safeParse({
  GITHUB_USERNAME: process.env.GITHUB_USERNAME,
  GITHUB_TOKEN: process.env.GITHUB_TOKEN,
  CONTACT_EMAIL: process.env.CONTACT_EMAIL,
  RESEND_API_KEY: process.env.RESEND_API_KEY,
  RESEND_FROM_EMAIL: process.env.RESEND_FROM_EMAIL,
  SITE_URL: process.env.SITE_URL ?? process.env.NEXT_PUBLIC_SITE_URL,
  GOOGLE_SITE_VERIFICATION:
    process.env.GOOGLE_SITE_VERIFICATION ??
    process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
  VERCEL_PROJECT_PRODUCTION_URL: process.env.VERCEL_PROJECT_PRODUCTION_URL,
  VERCEL_URL: process.env.VERCEL_URL,
});

if (!parsed.success) {
  throw new Error(`Invalid environment variables: ${parsed.error.message}`);
}

export const env = parsed.data;
