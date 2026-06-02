import { handleGoogleCallback } from "@/lib/google-oauth";

export const runtime = "edge";

export async function GET(request: Request) {
  const origin = "https://chinai-api.pages.dev";
  return handleGoogleCallback(request, {
    DB: process.env.DB as unknown as D1Database,
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID!,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET!,
    GOOGLE_REDIRECT_URI: `${origin}/api/auth/callback`,
    APP_ORIGIN: origin,
    SESSION_SECRET: process.env.SESSION_SECRET!,
  });
}
