import { cookies } from "next/headers";
import { verifySession } from "@/lib/session";

export const runtime = "edge";

export async function GET() {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("session");

  if (!sessionCookie) {
    return Response.json({ user: null });
  }

  try {
    const payload = await verifySession(sessionCookie.value, process.env.SESSION_SECRET!);
    if (!payload) {
      return Response.json({ user: null });
    }

    return Response.json({
      user: {
        id: payload.user_id,
        email: payload.email,
        plan: payload.plan,
      },
    });
  } catch {
    return Response.json({ user: null });
  }
}
