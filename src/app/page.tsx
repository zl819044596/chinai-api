import Link from "next/link";
import { cookies } from "next/headers";
import { verifySession } from "@/lib/session";

export const runtime = "edge";

async function getUser() {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("session");
  if (!sessionCookie) return null;

  try {
    const payload = await verifySession(sessionCookie.value, process.env.SESSION_SECRET!);
    if (!payload) return null;
    return {
      id: payload.user_id as string,
      email: payload.email as string,
      plan: payload.plan as string,
    };
  } catch {
    return null;
  }
}

export default async function Home() {
  const user = await getUser();

  return (
    <main className="min-h-screen">
      {/* Header */}
      <header className="px-6 py-4 flex justify-between items-center border-b border-gray-800">
        <Link href="/" className="text-xl font-bold">ChinaAI API</Link>
        <div className="flex gap-4 items-center">
          <Link href="/playground" className="text-gray-400 hover:text-white">Playground</Link>
          <Link href="/docs" className="text-gray-400 hover:text-white">Docs</Link>
          {user ? (
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-400">{user.email}</span>
              <span className="text-xs bg-blue-500/20 text-blue-400 px-2 py-1 rounded">
                {user.plan}
              </span>
              <a
                href="/api/auth/logout"
                className="text-sm text-gray-400 hover:text-white"
              >
                Logout
              </a>
            </div>
          ) : (
            <a
              href="/api/auth/login"
              className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded-lg text-sm font-semibold"
            >
              Sign In
            </a>
          )}
        </div>
      </header>

      {/* Hero */}
      <section className="px-6 py-24 text-center">
        <h1 className="text-5xl font-bold mb-6">
          Access Chinese AI Models
          <br />
          <span className="text-blue-400">Without Barriers</span>
        </h1>
        <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
          Unified API for DeepSeek, Qwen, GLM, and more.
          No Chinese phone number. No identity verification. Just works.
        </p>
        <div className="flex gap-4 justify-center">
          <Link
            href="/playground"
            className="bg-blue-500 hover:bg-blue-600 px-8 py-3 rounded-lg font-semibold"
          >
            Try Free
          </Link>
          <Link
            href="/docs"
            className="border border-gray-600 hover:border-gray-400 px-8 py-3 rounded-lg font-semibold"
          >
            Documentation
          </Link>
        </div>
      </section>

      {/* Models */}
      <section className="px-6 py-16 bg-gray-900">
        <h2 className="text-3xl font-bold text-center mb-12">Supported Models</h2>
        <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {[
            { name: "DeepSeek-V3", desc: "Top reasoning, 671B params", price: "$0.50/M tokens" },
            { name: "Qwen-Max", desc: "Alibaba flagship", price: "$0.80/M tokens" },
            { name: "GLM-4", desc: "Zhipu AI general purpose", price: "$0.60/M tokens" },
          ].map((m) => (
            <div key={m.name} className="bg-gray-800 p-6 rounded-xl">
              <h3 className="text-xl font-semibold mb-2">{m.name}</h3>
              <p className="text-gray-400 mb-4">{m.desc}</p>
              <p className="text-blue-400 font-mono">{m.price}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section className="px-6 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">Simple Pricing</h2>
        <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {[
            { name: "Free", price: "$0", tokens: "100 requests/day", cta: "Get Started", tier: null },
            { name: "Pro", price: "$19/mo", tokens: "1M tokens", cta: "Subscribe", tier: "pro" },
            { name: "Business", price: "$49/mo", tokens: "5M tokens", cta: "Subscribe", tier: "business" },
          ].map((p) => (
            <div key={p.name} className={`p-6 rounded-xl border ${p.name === "Pro" ? "border-blue-500 bg-gray-800" : "border-gray-700"}`}>
              <h3 className="text-xl font-semibold mb-2">{p.name}</h3>
              <p className="text-3xl font-bold mb-4">{p.price}</p>
              <p className="text-gray-400 mb-6">{p.tokens}</p>
              {p.tier ? (
                <Link
                  href={`/checkout?tier=${p.tier}`}
                  className="block w-full bg-blue-500 hover:bg-blue-600 py-2 rounded-lg font-semibold text-center"
                >
                  {p.cta}
                </Link>
              ) : (
                <Link
                  href="/playground"
                  className="block w-full bg-blue-500 hover:bg-blue-600 py-2 rounded-lg font-semibold text-center"
                >
                  {p.cta}
                </Link>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 py-8 text-center text-gray-500 border-t border-gray-800">
        <p>© 2025 ChinaAI API. Not affiliated with DeepSeek, Alibaba, or Zhipu AI.</p>
      </footer>
    </main>
  );
}
