export default function Docs() {
  return (
    <main className="min-h-screen px-6 py-12 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">API Documentation</h1>

      <section className="mb-12">
        <h2 className="text-xl font-semibold mb-4">Base URL</h2>
        <code className="bg-gray-800 px-4 py-2 rounded-lg block">
          https://your-domain.com/api/chat
        </code>
      </section>

      <section className="mb-12">
        <h2 className="text-xl font-semibold mb-4">Authentication</h2>
        <p className="text-gray-400 mb-4">
          Include your API key in the Authorization header:
        </p>
        <pre className="bg-gray-800 p-4 rounded-lg overflow-x-auto text-sm">
{`Authorization: Bearer YOUR_API_KEY`}
        </pre>
      </section>

      <section className="mb-12">
        <h2 className="text-xl font-semibold mb-4">Request Body</h2>
        <pre className="bg-gray-800 p-4 rounded-lg overflow-x-auto text-sm">
{`{
  "model": "deepseek-chat",  // or "qwen-max", "glm-4"
  "messages": [
    { "role": "user", "content": "Hello!" }
  ],
  "stream": false
}`}
        </pre>
      </section>

      <section className="mb-12">
        <h2 className="text-xl font-semibold mb-4">Example (cURL)</h2>
        <pre className="bg-gray-800 p-4 rounded-lg overflow-x-auto text-sm">
{`curl -X POST https://your-domain.com/api/chat \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -d '{
    "model": "deepseek-chat",
    "messages": [{"role": "user", "content": "Explain quantum computing"}]
  }'`}
        </pre>
      </section>

      <section className="mb-12">
        <h2 className="text-xl font-semibold mb-4">Models</h2>
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-gray-700">
              <th className="pb-2">Model</th>
              <th className="pb-2">Context</th>
              <th className="pb-2">Price / 1M tokens</th>
            </tr>
          </thead>
          <tbody className="text-gray-400">
            <tr className="border-b border-gray-800">
              <td className="py-3">deepseek-chat</td>
              <td className="py-3">64K</td>
              <td className="py-3">$0.50</td>
            </tr>
            <tr className="border-b border-gray-800">
              <td className="py-3">qwen-max</td>
              <td className="py-3">32K</td>
              <td className="py-3">$0.80</td>
            </tr>
            <tr>
              <td className="py-3">glm-4</td>
              <td className="py-3">128K</td>
              <td className="py-3">$0.60</td>
            </tr>
          </tbody>
        </table>
      </section>
    </main>
  );
}
