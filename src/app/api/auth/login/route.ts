import { handleGoogleLogin } from "@/lib/oauth-login";

export const runtime = "edge";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const origin = `${url.protocol}//${url.host}`;
  return handleGoogleLogin(request, {
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID!,
    GOOGLE_REDIRECT_URI: `${origin}/api/auth/callback`,
    APP_ORIGIN: origin,
  });
}
