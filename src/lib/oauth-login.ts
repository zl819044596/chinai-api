import { serializeCookie } from "./cookie-utils";

export async function handleGoogleLogin(request: Request, env: {
  GOOGLE_CLIENT_ID: string;
  GOOGLE_REDIRECT_URI: string;
  APP_ORIGIN: string;
}) {
  const state = crypto.randomUUID();

  const params = new URLSearchParams({
    client_id: env.GOOGLE_CLIENT_ID,
    redirect_uri: env.GOOGLE_REDIRECT_URI,
    response_type: "code",
    scope: "openid email profile",
    state,
    prompt: "select_account",
  });

  const googleUrl = `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;

  const res = new Response(null, {
    status: 302,
    headers: {
      Location: googleUrl,
    },
  });

  res.headers.append(
    "Set-Cookie",
    serializeCookie("oauth_state", state, {
      httpOnly: true,
      secure: true,
      sameSite: "Lax",
      path: "/",
      maxAge: 600,
    })
  );

  return res;
}
