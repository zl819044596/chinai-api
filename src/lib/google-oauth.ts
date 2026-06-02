import { getCookie, serializeCookie } from "./cookie-utils";
import { signSession, verifySession } from "./session";
import { storeSession } from "./session-store";

type Env = {
  DB: D1Database;
  GOOGLE_CLIENT_ID: string;
  GOOGLE_CLIENT_SECRET: string;
  GOOGLE_REDIRECT_URI: string;
  APP_ORIGIN: string;
  SESSION_SECRET: string;
};

export async function handleGoogleCallback(request: Request, env: Env) {
  const url = new URL(request.url);

  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");

  if (!code || !state) {
    return new Response("Missing code or state", { status: 400 });
  }

  // 1. 校验 OAuth state，防 CSRF
  const cookieState = getCookie(request, "oauth_state");
  if (!cookieState || cookieState !== state) {
    return new Response("Invalid OAuth state", { status: 400 });
  }

  // 2. 用 code 换 token
  const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      code,
      client_id: env.GOOGLE_CLIENT_ID,
      client_secret: env.GOOGLE_CLIENT_SECRET,
      redirect_uri: env.GOOGLE_REDIRECT_URI,
      grant_type: "authorization_code",
    }),
  });

  if (!tokenRes.ok) {
    return new Response("Google token exchange failed", { status: 401 });
  }

  const tokenJson = (await tokenRes.json()) as {
    access_token: string;
  };

  // 3. 获取 Google 用户信息
  const userRes = await fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
    headers: {
      Authorization: `Bearer ${tokenJson.access_token}`,
    },
  });

  if (!userRes.ok) {
    return new Response("Google userinfo failed", { status: 401 });
  }

  const googleUser = (await userRes.json()) as {
    id: string;
    email: string;
    name?: string;
    picture?: string;
  };

  // 4. 写 D1：创建或更新用户
  const userId = `usr_${crypto.randomUUID()}`;

  await env.DB.prepare(
    `
    INSERT INTO users (id, email, name, avatar_url, google_id, updated_at)
    VALUES (?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
    ON CONFLICT(email) DO UPDATE SET
      name = excluded.name,
      avatar_url = excluded.avatar_url,
      google_id = excluded.google_id,
      updated_at = CURRENT_TIMESTAMP
  `
  )
    .bind(
      userId,
      googleUser.email,
      googleUser.name ?? null,
      googleUser.picture ?? null,
      googleUser.id
    )
    .run();

  const user = await env.DB.prepare(
    `
    SELECT id, email, plan, credits
    FROM users
    WHERE email = ?
  `
  )
    .bind(googleUser.email)
    .first<{
      id: string;
      email: string;
      plan: string;
      credits: number;
    }>();

  if (!user) {
    return new Response("User upsert failed", { status: 500 });
  }

  // 5. 签 session
  const sessionToken = await signSession(
    {
      user_id: user.id,
      email: user.email,
      plan: user.plan,
      exp: Math.floor(Date.now() / 1000) + 7 * 24 * 60 * 60,
    },
    env.SESSION_SECRET
  );

  // 6. 存储 session 到内存
  await storeSession(sessionToken, {
    user_id: user.id,
    email: user.email,
    plan: user.plan,
  });

  // 7. 返回 token（让上层决定怎么传给前端）
  return {
    token: sessionToken,
    user: {
      id: user.id,
      email: user.email,
      plan: user.plan,
    },
  };
}
