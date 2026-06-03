import { serializeCookie } from "@/lib/cookie-utils";

export const runtime = "nodejs";

export async function GET() {
  const res = new Response(null, {
    status: 302,
    headers: {
      Location: "/",
    },
  });

  res.headers.append(
    "Set-Cookie",
    serializeCookie("session", "", {
      httpOnly: true,
      secure: true,
      sameSite: "Lax",
      path: "/",
      maxAge: 0,
    })
  );

  return res;
}
