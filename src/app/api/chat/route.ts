import { NextRequest, NextResponse } from "next/server";
import {
  extractApiKey,
  validateApiKey,
  checkRateLimit,
  generateApiKey,
} from "@/lib/auth";

export const runtime = "edge";

// 支持的模型配置
const MODELS: Record<string, { baseURL: string; apiKey: string; mockName: string }> = {
  "deepseek-chat": {
    baseURL: "https://api.deepseek.com/v1",
    apiKey: process.env.DEEPSEEK_API_KEY || "",
    mockName: "DeepSeek-V3",
  },
  "qwen-max": {
    baseURL: "https://dashscope.aliyuncs.com/compatible-mode/v1",
    apiKey: process.env.QWEN_API_KEY || "",
    mockName: "Qwen-Max",
  },
  "glm-4": {
    baseURL: "https://open.bigmodel.cn/api/paas/v4",
    apiKey: process.env.GLM_API_KEY || "",
    mockName: "GLM-4",
  },
};

// Mock 响应（没有 API Key 时用于演示）
function mockResponse(model: string, messages: { role: string; content: string }[]) {
  const lastMsg = messages[messages.length - 1]?.content || "";
  const config = MODELS[model];

  return {
    id: `mock-${Date.now()}`,
    object: "chat.completion",
    created: Math.floor(Date.now() / 1000),
    model,
    choices: [
      {
        index: 0,
        message: {
          role: "assistant",
          content: `[MOCK MODE - ${config?.mockName || model}]\n\nThis is a simulated response. To get real AI responses, add your API key to .env.local:\n\nDEEPSEEK_API_KEY=your_key\nQWEN_API_KEY=your_key\nGLM_API_KEY=your_key\n\nThen restart the dev server.\n\nYour prompt was: "${lastMsg}"`,
        },
        finish_reason: "stop",
      },
    ],
    usage: { prompt_tokens: 10, completion_tokens: 50, total_tokens: 60 },
  };
}

// Mock 流式响应
async function* mockStream(model: string) {
  const config = MODELS[model];
  const text = `[MOCK MODE - ${config?.mockName || model}] This is a simulated streaming response. Add your API keys to .env.local to get real responses.`;
  const words = text.split(" ");

  for (let i = 0; i < words.length; i++) {
    await new Promise((r) => setTimeout(r, 50));
    yield {
      id: `mock-${Date.now()}`,
      object: "chat.completion.chunk",
      created: Math.floor(Date.now() / 1000),
      model,
      choices: [
        {
          index: 0,
          delta: { content: words[i] + " " },
          finish_reason: null,
        },
      ],
    };
  }

  yield {
    id: `mock-${Date.now()}`,
    object: "chat.completion.chunk",
    created: Math.floor(Date.now() / 1000),
    model,
    choices: [{ index: 0, delta: {}, finish_reason: "stop" }],
  };
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { model = "deepseek-chat", messages, stream = false } = body;

    // 验证模型
    const config = MODELS[model];
    if (!config) {
      return NextResponse.json(
        { error: "Model not supported" },
        { status: 400 }
      );
    }

    // API Key 验证 + 限流
    const apiKey = extractApiKey(req);
    let rateLimitHeaders: Record<string, string> = {};

    if (apiKey) {
      const validation = validateApiKey(apiKey);
      if (!validation.valid) {
        return NextResponse.json(
          { error: validation.error },
          { status: 401 }
        );
      }

      const rateCheck = checkRateLimit(validation.record!);
      if (!rateCheck.allowed) {
        return NextResponse.json(
          { error: rateCheck.error },
          { status: 429, headers: { "Retry-After": "86400" } }
        );
      }

      rateLimitHeaders = {
        "X-RateLimit-Remaining": String(rateCheck.remaining),
        "X-RateLimit-Limit": String(
          validation.record!.tier === "free" ? 100 : validation.record!.tier === "pro" ? 1000000 : 5000000
        ),
      };
    }

    // 如果没有配置真实 API Key，返回 Mock 响应
    if (!config.apiKey) {
      if (stream) {
        const encoder = new TextEncoder();
        const iterator = mockStream(model);

        const readable = new ReadableStream({
          async pull(controller) {
            const { done, value } = await iterator.next();
            if (done) {
              controller.close();
              return;
            }
            controller.enqueue(encoder.encode(`data: ${JSON.stringify(value)}\n\n`));
          },
        });

        return new NextResponse(readable, {
          headers: {
            "Content-Type": "text/event-stream",
            "Cache-Control": "no-cache",
            Connection: "keep-alive",
            ...rateLimitHeaders,
          },
        });
      }

      return NextResponse.json(mockResponse(model, messages), { headers: rateLimitHeaders });
    }

    // 转发请求到国内 API
    const response = await fetch(`${config.baseURL}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${config.apiKey}`,
      },
      body: JSON.stringify({
        model,
        messages,
        stream,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      return NextResponse.json(
        { error: `Upstream error: ${error}` },
        { status: response.status }
      );
    }

    // 如果请求 stream，直接透传
    if (stream) {
      return new NextResponse(response.body, {
        headers: {
          "Content-Type": "text/event-stream",
          "Cache-Control": "no-cache",
          Connection: "keep-alive",
          ...rateLimitHeaders,
        },
      });
    }

    // 非 stream，返回 JSON
    const data = await response.json();
    return NextResponse.json(data, { headers: rateLimitHeaders });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}

// 生成 API Key（临时接口，后面做 Dashboard）
export async function GET(req: NextRequest) {
  const tier = (req.nextUrl.searchParams.get("tier") as "free" | "pro" | "business") || "free";
  const key = generateApiKey(`user_${Date.now()}`, tier);

  return NextResponse.json({
    apiKey: key,
    tier,
    note: "Save this key - it won't be shown again",
  });
}
