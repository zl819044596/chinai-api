import { handleGoogleCallback } from "@/lib/google-oauth";
import { serializeCookie } from "@/lib/cookie-utils";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const origin = `${url.protocol}//${url.host}`;

  const result = await handleGoogleCallback(request, {
    DB: process.env.DB as unknown as D1Database,
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID!,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET!,
    GOOGLE_REDIRECT_URI: `${origin}/api/auth/callback`,
    APP_ORIGIN: origin,
    SESSION_SECRET: process.env.SESSION_SECRET!,
  });

  // 如果返回的是 Response（错误情况），直接返回
  if (result instanceof Response) {
    return result;
  }

  // 写 cookie，后续请求自动带 session
  const data = result as { token: string; user: any };

  const res = new Response(null, {
    status: 302,
    headers: {
      Location: `${origin}/dashboard`,
    },
  });

  res.headers.append(
    "Set-Cookie",
    serializeCookie("session", data.token, {
      httpOnly: true,
      secure: true,
      sameSite: "Lax",
      path: "/",
      maxAge: 7 * 24 * 60 * 60,
    })
  );

  // 同时清空 oauth_state cookie
  res.headers.append(
    "Set-Cookie",
    serializeCookie("oauth_state", "", {
      httpOnly: true,
      secure: true,
      sameSite: "Lax",
      path: "/",
      maxAge: 0,
    })
  );

  return res;
}
