export const runtime = "edge";

export default function Docs() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-white via-purple-50 to-blue-50 text-gray-900">
      <header className="px-6 py-4 flex justify-between items-center border-b border-gray-200">
        <a href="/" className="text-xl font-bold flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-sm font-bold text-white">
            C
          </div>
          <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            ChinaAI API
          </span>
        </a>
        <div className="flex gap-6 items-center text-sm">
          <a href="/" className="text-gray-600 hover:text-gray-900 transition">首页</a>
          <a href="/docs" className="text-blue-600 font-medium border-b-2 border-blue-600 pb-1">文档</a>
          <a href="/about" className="text-gray-600 hover:text-gray-900 transition">关于</a>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-6 py-12">
        <h1 className="text-3xl font-bold mb-8">API 文档</h1>

        <section className="mb-12">
          <h2 className="text-xl font-semibold mb-4 text-purple-600">基础信息</h2>
          <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-4 shadow-sm">
            <div>
              <p className="text-gray-500 text-sm mb-1">API 地址</p>
              <code className="bg-gray-100 px-3 py-2 rounded-lg text-sm block text-gray-800">https://chinaiapi.com/v1</code>
            </div>
            <div>
              <p className="text-gray-500 text-sm mb-1">认证方式</p>
              <code className="bg-gray-100 px-3 py-2 rounded-lg text-sm block text-gray-800">Authorization: Bearer 你的令牌</code>
            </div>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-xl font-semibold mb-4 text-purple-600">Chat Completions</h2>
          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
            <p className="text-gray-500 text-sm mb-3">完全兼容 OpenAI 格式</p>
            <pre className="bg-gray-900 p-4 rounded-lg text-sm overflow-x-auto text-green-400">
{`curl https://chinaiapi.com/v1/chat/completions \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer 你的令牌" \\
  -d '{
    "model": "deepseek-chat",
    "messages": [
      {"role": "user", "content": "Hello"}
    ]
  }'`}
            </pre>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-xl font-semibold mb-4 text-purple-600">支持的模型</h2>
          <div className="grid gap-3">
            {[
              { model: "deepseek-chat", name: "DeepSeek-V4-Flash" },
              { model: "deepseek-reasoner", name: "DeepSeek-R1" },
              { model: "qwen-max", name: "通义千问-Max" },
              { model: "qwen-plus", name: "通义千问-Plus" },
              { model: "glm-4", name: "智谱 GLM-4" },
            ].map((m) => (
              <div key={m.model} className="bg-white border border-gray-200 rounded-lg px-4 py-3 flex justify-between shadow-sm">
                <code className="text-sm text-gray-800">{m.model}</code>
                <span className="text-gray-500 text-sm">{m.name}</span>
              </div>
            ))}
          </div>
        </section>
      </div>

      <footer className="px-6 py-8 text-center text-gray-400 border-t border-gray-200">
        <p>© 2025 ChinaAI API</p>
      </footer>
    </main>
  );
}
