import { cookies } from "next/headers";
import { verifySession } from "@/lib/session";
import { getSession } from "@/lib/session-store";

export const runtime = "edge";

// 从 cookie 或 Authorization header 获取 token
async function getToken(request: Request): Promise<string | null> {
  // 优先从 header 获取
  const auth = request.headers.get("Authorization");
  if (auth?.startsWith("Bearer ")) {
    return auth.slice(7);
  }

  // 再从 cookie 获取
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("session");
  return sessionCookie?.value || null;
}

export async function GET(request: Request) {
  const token = await getToken(request);
  if (!token) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const payload = await verifySession(token, process.env.SESSION_SECRET!);
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
  const token = await getToken(request);
  if (!token) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const payload = await verifySession(token, process.env.SESSION_SECRET!);
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

export async function DELETE(request: Request) {
  const token = await getToken(request);
  if (!token) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const payload = await verifySession(token, process.env.SESSION_SECRET!);
    if (!payload) {
      return Response.json({ error: "Invalid session" }, { status: 401 });
    }

    await (process.env.DB as unknown as D1Database)
      .prepare("DELETE FROM users WHERE id = ?")
      .bind(payload.user_id)
      .run();

    return Response.json({ success: true });
  } catch {
    return Response.json({ error: "Server error" }, { status: 500 });
  }
}
