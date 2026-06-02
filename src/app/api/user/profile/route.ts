import { cookies } from "next/headers";
import { verifySession } from "@/lib/session";

export const runtime = "edge";

export async function GET() {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("session");
  if (!sessionCookie) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const payload = await verifySession(sessionCookie.value, process.env.SESSION_SECRET!);
    if (!payload) {
      return Response.json({ error: "Invalid session" }, { status: 401 });
    }

    const user = await (process.env.DB as unknown as D1Database)
      .prepare("SELECT id, email, name, avatar_url, plan, credits, created_at FROM users WHERE id = ?")
      .bind(payload.user_id)
      .first();

    if (!user) {
      return Response.json({ error: "User not found" }, { status: 404 });
    }

    return Response.json({ user });
  } catch {
    return Response.json({ error: "Server error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("session");
  if (!sessionCookie) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const payload = await verifySession(sessionCookie.value, process.env.SESSION_SECRET!);
    if (!payload) {
      return Response.json({ error: "Invalid session" }, { status: 401 });
    }

    const body = await request.json() as { name?: string };
    const { name } = body;

    if (!name || name.trim().length < 1 || name.trim().length > 50) {
      return Response.json({ error: "Name must be 1-50 characters" }, { status: 400 });
    }

    await (process.env.DB as unknown as D1Database)
      .prepare("UPDATE users SET name = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?")
      .bind(name.trim(), payload.user_id)
      .run();

    return Response.json({ success: true });
  } catch {
    return Response.json({ error: "Server error" }, { status: 500 });
  }
}

export async function DELETE() {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("session");
  if (!sessionCookie) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const payload = await verifySession(sessionCookie.value, process.env.SESSION_SECRET!);
    if (!payload) {
      return Response.json({ error: "Invalid session" }, { status: 401 });
    }

    await (process.env.DB as unknown as D1Database)
      .prepare("DELETE FROM users WHERE id = ?")
      .bind(payload.user_id)
      .run();

    const res = Response.json({ success: true });
    res.headers.append("Set-Cookie", "session=; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=0");
    return res;
  } catch {
    return Response.json({ error: "Server error" }, { status: 500 });
  }
}
