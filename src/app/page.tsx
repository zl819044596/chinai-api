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
    <main className="min-h-screen bg-gradient-to-br from-white via-purple-50 to-blue-50 text-gray-900">
      {/* Header */}
      <header className="px-6 py-4 flex justify-between items-center border-b border-gray-200">
        <Link href="/" className="text-xl font-bold flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-sm font-bold text-white">
            C
          </div>
          <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            ChinaAI API
          </span>
        </Link>
        <div className="flex gap-6 items-center text-sm">
          <Link href="/" className="text-blue-600 font-medium border-b-2 border-blue-600 pb-1">首页</Link>
          <a href="https://chinaiapi.com" className="text-gray-600 hover:text-gray-900 transition">控制台</a>
          <Link href="/docs" className="text-gray-600 hover:text-gray-900 transition">文档</Link>
          <Link href="/about" className="text-gray-600 hover:text-gray-900 transition">关于</Link>
          {user ? (
            <a href="https://chinaiapi.com" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition">
              控制台
            </a>
          ) : (
            <a href="https://chinaiapi.com" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition">
              登录
            </a>
          )}
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="grid md:grid-cols-2 gap-12 items-start">
          
          {/* Left Hero */}
          <div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                ChinaAI API
              </span>
            </h1>
            <p className="text-lg text-gray-700 mb-2 font-medium">
              更强大的模型，更低的价格，更简单的接入
            </p>
            <p className="text-gray-500 mb-8 leading-relaxed">
              致力于为开发者提供快速、便捷的国产大模型 API 调用方案，一站式接入 DeepSeek、通义千问、智谱等顶尖国产 AI 模型。
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <a href="https://chinaiapi.com" className="inline-flex justify-center bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 rounded-xl font-semibold transition">
                开启 AI 新体验
              </a>
              <Link href="/docs" className="inline-flex justify-center border border-gray-300 hover:border-gray-400 px-6 py-3 rounded-xl font-semibold transition">
                API 文档
              </Link>
            </div>

            <p className="text-sm text-gray-400 mb-6">
              已接入 10+ 国产大模型
            </p>

            {/* Model Provider Icons - 强制横排 */}
            <div className="flex flex-row gap-3 flex-wrap">
              {['DeepSeek', 'Qwen', 'GLM', 'Kimi', 'Doubao'].map((name) => (
                <div key={name} className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center text-xs font-bold text-gray-600 border border-gray-200 flex-shrink-0">
                  {name[0]}
                </div>
              ))}
            </div>
          </div>

          {/* Right Quick Start */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
            <h2 className="text-xl font-bold mb-6">快速开始</h2>
            
            <div className="flex gap-4 mb-6 text-sm border-b border-gray-100 pb-4">
              <span className="text-purple-600 font-medium border-b-2 border-purple-600 pb-2">调用接口</span>
              <span className="text-gray-400">直接使用</span>
            </div>

            <div className="space-y-6">
              {/* Step 1 */}
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center font-bold text-sm shrink-0">
                  1
                </div>
                <div>
                  <h3 className="font-semibold mb-1">注册登录</h3>
                  <p className="text-sm text-gray-500">
                    <a href="https://chinaiapi.com" className="text-blue-600 hover:underline">登录</a> 控制台，充值即可使用
                  </p>
                </div>
              </div>

              {/* Step 2 */}
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center font-bold text-sm shrink-0">
                  2
                </div>
                <div>
                  <h3 className="font-semibold mb-1">创建令牌</h3>
                  <p className="text-sm text-gray-500">
                    进入 <a href="https://chinaiapi.com" className="text-blue-600 hover:underline">API 令牌管理</a> 页面创建 API 令牌
                  </p>
                </div>
              </div>

              {/* Step 3 */}
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center font-bold text-sm shrink-0">
                  3
                </div>
                <div>
                  <h3 className="font-semibold mb-1">调用接口</h3>
                  <p className="text-sm text-gray-500 mb-3">
                    使用创建的令牌调用 API
                  </p>
                  <div className="bg-gray-900 rounded-lg p-4 text-sm">
                    <pre className="text-green-400 overflow-x-auto">
{`curl https://chinaiapi.com/v1/chat/completions \\
  -H "Authorization: Bearer sk-xxx" \\
  -d '{
    "model": "deepseek-chat",
    "messages": [{"role":"user","content":"Hello"}]
  }'`}
                    </pre>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="px-6 py-8 text-center text-gray-400 border-t border-gray-200">
        <p>© 2025 ChinaAI API</p>
      </footer>
    </main>
  );
}
