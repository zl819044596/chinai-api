"use client";

import { useState, useRef } from "react";

export default function Playground() {
  const [model, setModel] = useState("deepseek-chat");
  const [prompt, setPrompt] = useState("");
  const [messages, setMessages] = useState<{role: string; content: string}[]>([]);
  const [loading, setLoading] = useState(false);
  const [stream, setStream] = useState(true);
  const [apiKey, setApiKey] = useState("");
  const abortRef = useRef<AbortController | null>(null);

  const handleSubmit = async () => {
    if (!prompt.trim() || loading) return;

    const userMsg = { role: "user", content: prompt };
    setMessages(prev => [...prev, userMsg]);
    setPrompt("");
    setLoading(true);

    const headers: Record<string, string> = { "Content-Type": "application/json" };
    if (apiKey.trim()) headers["Authorization"] = `Bearer ${apiKey.trim()}`;

    try {
      if (stream) {
        // 流式输出
        abortRef.current = new AbortController();
        const res = await fetch("/api/chat", {
          method: "POST",
          headers,
          body: JSON.stringify({
            model,
            messages: [...messages, userMsg],
            stream: true,
          }),
          signal: abortRef.current.signal,
        });

        if (!res.ok) {
          const err = await res.json().catch(() => ({ error: "Request failed" }));
          setMessages(prev => [...prev, { role: "assistant", content: `Error: ${err.error || res.statusText}` }]);
          setLoading(false);
          return;
        }

        const reader = res.body?.getReader();
        const decoder = new TextDecoder();
        let assistantContent = "";

        setMessages(prev => [...prev, { role: "assistant", content: "" }]);

        while (reader) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value, { stream: true });
          const lines = chunk.split("\n");

          for (const line of lines) {
            if (line.startsWith("data: ")) {
              const data = line.slice(6);
              if (data === "[DONE]") continue;
              try {
                const parsed = JSON.parse(data);
                const delta = parsed.choices?.[0]?.delta?.content;
                if (delta) {
                  assistantContent += delta;
                  setMessages(prev => {
                    const copy = [...prev];
                    copy[copy.length - 1] = { role: "assistant", content: assistantContent };
                    return copy;
                  });
                }
              } catch {
                // ignore parse errors
              }
            }
          }
        }
      } else {
        // 非流式
        const res = await fetch("/api/chat", {
          method: "POST",
          headers,
          body: JSON.stringify({
            model,
            messages: [...messages, userMsg],
            stream: false,
          }),
        });

        const data = await res.json();
        if (!res.ok) {
          setMessages(prev => [...prev, { role: "assistant", content: `Error: ${data.error || res.statusText}` }]);
        } else {
          const content = data.choices?.[0]?.message?.content || JSON.stringify(data);
          setMessages(prev => [...prev, { role: "assistant", content }]);
        }
      }
    } catch (err) {
      if ((err as Error).name === "AbortError") {
        setMessages(prev => [...prev, { role: "assistant", content: "[Cancelled]" }]);
      } else {
        setMessages(prev => [...prev, { role: "assistant", content: `Error: ${(err as Error).message}` }]);
      }
    } finally {
      setLoading(false);
      abortRef.current = null;
    }
  };

  const handleStop = () => {
    abortRef.current?.abort();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <main className="min-h-screen px-6 py-12 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">API Playground</h1>

      {/* API Key */}
      <div className="mb-6">
        <label className="block text-sm text-gray-400 mb-2">
          API Key <span className="text-gray-600">(optional for free tier)</span>
        </label>
        <input
          type="password"
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
          className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 font-mono text-sm"
          placeholder="sk-..."
        />
      </div>

      {/* Model */}
      <div className="mb-6">
        <label className="block text-sm text-gray-400 mb-2">Model</label>
        <select
          value={model}
          onChange={(e) => setModel(e.target.value)}
          className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2"
        >
          <option value="deepseek-chat">DeepSeek-V3</option>
          <option value="qwen-max">Qwen-Max</option>
          <option value="glm-4">GLM-4</option>
        </select>
      </div>

      {/* Stream toggle */}
      <div className="mb-6 flex items-center gap-2">
        <input
          type="checkbox"
          id="stream"
          checked={stream}
          onChange={(e) => setStream(e.target.checked)}
          className="w-4 h-4"
        />
        <label htmlFor="stream" className="text-sm text-gray-400">Stream response</label>
      </div>

      {/* Messages */}
      {messages.length > 0 && (
        <div className="mb-6 space-y-4">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`p-4 rounded-lg ${
                msg.role === "user"
                  ? "bg-gray-800 ml-12"
                  : "bg-gray-900 border border-gray-800 mr-12"
              }`}
            >
              <div className="text-xs text-gray-500 mb-1 uppercase font-semibold">
                {msg.role}
              </div>
              <div className="whitespace-pre-wrap text-sm">{msg.content}</div>
            </div>
          ))}
          {loading && stream && (
            <div className="bg-gray-900 border border-gray-800 mr-12 p-4 rounded-lg">
              <div className="text-xs text-gray-500 mb-1 uppercase font-semibold">assistant</div>
              <div className="flex gap-1">
                <span className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" />
                <span className="w-2 h-2 bg-blue-400 rounded-full animate-bounce [animation-delay:0.1s]" />
                <span className="w-2 h-2 bg-blue-400 rounded-full animate-bounce [animation-delay:0.2s]" />
              </div>
            </div>
          )}
        </div>
      )}

      {/* Input */}
      <div className="flex gap-2">
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyDown={handleKeyDown}
          rows={2}
          className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 resize-none"
          placeholder="Enter your prompt... (Shift+Enter for new line)"
          disabled={loading}
        />
        {loading && stream ? (
          <button
            onClick={handleStop}
            className="bg-red-500 hover:bg-red-600 px-6 py-2 rounded-lg font-semibold"
          >
            Stop
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            disabled={loading || !prompt.trim()}
            className="bg-blue-500 hover:bg-blue-600 disabled:opacity-50 px-6 py-2 rounded-lg font-semibold"
          >
            {loading ? "..." : "Send"}
          </button>
        )}
      </div>
    </main>
  );
}
