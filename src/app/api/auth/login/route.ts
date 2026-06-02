import { handleGoogleLogin } from "@/lib/oauth-login";

export const runtime = "edge";

export async function GET(request: Request) {
  return handleGoogleLogin(request, {
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID!,
    GOOGLE_REDIRECT_URI: `${process.env.APP_ORIGIN}/api/auth/callback`,
    APP_ORIGIN: process.env.APP_ORIGIN!,
  });
}
