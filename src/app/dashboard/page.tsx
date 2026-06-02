"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function Dashboard() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");

  useEffect(() => {
    fetch("/api/user/profile")
      .then(r => r.json())
      .then(data => {
        if (data.user) {
          setUser(data.user);
          setName(data.user.name || "");
        }
        setLoading(false);
      });
  }, []);

  const handleUpdateName = async () => {
    const res = await fetch("/api/user/profile", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    });
    if (res.ok) {
      alert("Name updated!");
      setUser({ ...user, name });
    } else {
      alert("Update failed");
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure? This will permanently delete your account and all data.")) return;
    const res = await fetch("/api/user/profile", { method: "DELETE" });
    if (res.ok) {
      window.location.href = "/";
    } else {
      alert("Delete failed");
    }
  };

  if (loading) return <main className="min-h-screen flex items-center justify-center"><p>Loading...</p></main>;

  if (!user) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-400 mb-4">Please sign in to view your dashboard</p>
          <a href="/api/auth/login" className="bg-blue-500 hover:bg-blue-600 px-6 py-2 rounded-lg font-semibold">
            Sign In
          </a>
        </div>
      </main>
    );
  }

  const limits: Record<string, { requests: number; tokens: string }> = {
    free: { requests: 100, tokens: "100 req/day" },
    pro: { requests: 1000000, tokens: "1M tokens/mo" },
    business: { requests: 5000000, tokens: "5M tokens/mo" },
  };

  const limit = limits[user.plan] || limits.free;

  return (
    <main className="min-h-screen">
      <header className="px-6 py-4 flex justify-between items-center border-b border-gray-800">
        <Link href="/" className="text-xl font-bold">ChinaAI API</Link>
        <div className="flex gap-4 items-center">
          <Link href="/playground" className="text-gray-400 hover:text-white">Playground</Link>
          <Link href="/docs" className="text-gray-400 hover:text-white">Docs</Link>
          <span className="text-sm text-gray-400">{user.email}</span>
          <span className="text-xs bg-blue-500/20 text-blue-400 px-2 py-1 rounded">{user.plan}</span>
          <a href="/api/auth/logout" className="text-sm text-gray-400 hover:text-white">Logout</a>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-6 py-12">
        <h1 className="text-3xl font-bold mb-8">Dashboard</h1>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gray-800 p-6 rounded-xl">
            <p className="text-gray-400 text-sm mb-1">Email</p>
            <p className="font-semibold">{user.email}</p>
          </div>
          <div className="bg-gray-800 p-6 rounded-xl">
            <p className="text-gray-400 text-sm mb-1">Plan</p>
            <p className="font-semibold capitalize">{user.plan}</p>
          </div>
          <div className="bg-gray-800 p-6 rounded-xl">
            <p className="text-gray-400 text-sm mb-1">Limit</p>
            <p className="font-semibold">{limit.tokens}</p>
          </div>
        </div>

        <div className="bg-gray-800 p-6 rounded-xl mb-8">
          <h2 className="text-xl font-semibold mb-4">Profile</h2>
          <div className="flex gap-3 items-end">
            <div className="flex-1">
              <label className="block text-sm text-gray-400 mb-2">Display Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                maxLength={50}
                className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2"
                placeholder="Your name"
              />
            </div>
            <button
              onClick={handleUpdateName}
              className="bg-blue-500 hover:bg-blue-600 px-6 py-2 rounded-lg font-semibold"
            >
              Update
            </button>
          </div>
        </div>

        <div className="bg-gray-800 p-6 rounded-xl mb-8">
          <h2 className="text-xl font-semibold mb-4">API Key</h2>
          <div className="flex gap-3 items-center">
            <code className="bg-gray-900 px-4 py-2 rounded font-mono text-sm flex-1">
              {user.id?.replace("usr_", "chinai_") || "N/A"}...
            </code>
            <button className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded-lg text-sm font-semibold">
              Copy
            </button>
          </div>
          <p className="text-gray-400 text-sm mt-3">
            Use this key in the Authorization header: Bearer &lt;api-key&gt;
          </p>
        </div>

        <div className="bg-gray-800 p-6 rounded-xl mb-8">
          <h2 className="text-xl font-semibold mb-4">Usage</h2>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Requests Today</span>
                <span>0 / {limit.requests}</span>
              </div>
              <div className="bg-gray-700 h-2 rounded-full overflow-hidden">
                <div className="bg-blue-500 h-full rounded-full" style={{ width: "0%" }} />
              </div>
            </div>
          </div>
        </div>

        {user.plan === "free" && (
          <div className="bg-gray-800 p-6 rounded-xl mb-8">
            <h2 className="text-xl font-semibold mb-4">Upgrade</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="border border-gray-700 p-4 rounded-lg">
                <h3 className="font-semibold mb-2">Pro - $19/mo</h3>
                <p className="text-gray-400 text-sm mb-4">1M tokens per month</p>
                <Link href="/checkout?tier=pro" className="block w-full bg-blue-500 hover:bg-blue-600 py-2 rounded-lg text-center font-semibold">
                  Subscribe
                </Link>
              </div>
              <div className="border border-gray-700 p-4 rounded-lg">
                <h3 className="font-semibold mb-2">Business - $49/mo</h3>
                <p className="text-gray-400 text-sm mb-4">5M tokens per month + priority</p>
                <Link href="/checkout?tier=business" className="block w-full bg-blue-500 hover:bg-blue-600 py-2 rounded-lg text-center font-semibold">
                  Subscribe
                </Link>
              </div>
            </div>
          </div>
        )}

        <div className="bg-gray-800 p-6 rounded-xl border border-red-500/30">
          <h2 className="text-xl font-semibold mb-4 text-red-400">Danger Zone</h2>
          <button
            onClick={handleDelete}
            className="bg-red-500/20 text-red-400 hover:bg-red-500/30 border border-red-500/50 px-6 py-2 rounded-lg font-semibold"
          >
            Delete Account
          </button>
        </div>
      </div>
    </main>
  );
}
