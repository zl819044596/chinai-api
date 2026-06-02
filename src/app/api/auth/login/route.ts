import { handleGoogleLogin } from "@/lib/oauth-login";

export const runtime = "edge";

export async function GET(request: Request) {
  const origin = "https://chinai-api.pages.dev";
  return handleGoogleLogin(request, {
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID!,
    GOOGLE_REDIRECT_URI: `${origin}/api/auth/callback`,
    APP_ORIGIN: origin,
  });
}
