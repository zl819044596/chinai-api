export const runtime = "edge";

export default function About() {
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
          <a href="/docs" className="text-gray-600 hover:text-gray-900 transition">文档</a>
          <a href="/about" className="text-blue-600 font-medium border-b-2 border-blue-600 pb-1">关于</a>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-6 py-16">
        <h1 className="text-3xl font-bold mb-8">关于 ChinaAI API</h1>

        <div className="space-y-6 text-gray-700 leading-relaxed">
          <p>
            ChinaAI API 是一个专注于国产大模型的 API 聚合平台，
            为开发者和企业提供统一、稳定、高性价比的 AI 模型调用服务。
          </p>

          <p>
            我们对接了 DeepSeek、通义千问、智谱 GLM 等国内顶尖 AI 模型，
            通过完全兼容 OpenAI 的接口格式，让你无需适配即可切换使用各种模型。
          </p>

          <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">我们的优势</h2>
          <ul className="space-y-3">
            <li className="flex items-start gap-3">
              <span className="w-6 h-6 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center text-sm mt-0.5">1</span>
              <span>一个密钥调用多个模型，简化开发流程</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="w-6 h-6 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center text-sm mt-0.5">2</span>
              <span>完全兼容 OpenAI 格式，零成本迁移</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="w-6 h-6 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center text-sm mt-0.5">3</span>
              <span>透明定价，按量计费，无隐藏费用</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="w-6 h-6 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center text-sm mt-0.5">4</span>
              <span>全球 CDN 加速，低延迟稳定访问</span>
            </li>
          </ul>

          <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">联系我们</h2>
          <p>
            商务合作：business@chinaiapi.com<br />
            技术支持：support@chinaiapi.com
          </p>
        </div>
      </div>

      <footer className="px-6 py-8 text-center text-gray-400 border-t border-gray-200">
        <p>© 2025 ChinaAI API</p>
      </footer>
    </main>
  );
}
