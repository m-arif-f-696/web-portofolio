import { env } from "@/lib/env";

export const siteUrl = (
  env.SITE_URL ||
  (env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${env.VERCEL_PROJECT_PRODUCTION_URL}`
    : env.VERCEL_URL
      ? `https://${env.VERCEL_URL}`
      : "https://ariffarhan.dev")
).replace(/\/+$/, "");

