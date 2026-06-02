// API Key 生成和验证
// MVP 阶段用内存存储，上线后切 D1

export interface ApiKeyRecord {
  key: string;
  userId: string;
  tier: "free" | "pro" | "business";
  createdAt: number;
  requestsToday: number;
  lastReset: number; // timestamp of last daily reset
}

// 内存存储（MVP）
const keyStore = new Map<string, ApiKeyRecord>();

// 简单的 key 前缀
const KEY_PREFIX = "chinai_";

export function generateApiKey(userId: string, tier: ApiKeyRecord["tier"] = "free"): string {
  const random = Array.from(crypto.getRandomValues(new Uint8Array(32)))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
  const key = `${KEY_PREFIX}${random}`;

  const now = Date.now();
  keyStore.set(key, {
    key,
    userId,
    tier,
    createdAt: now,
    requestsToday: 0,
    lastReset: now,
  });

  return key;
}

export function getApiKeyRecord(key: string): ApiKeyRecord | undefined {
  return keyStore.get(key);
}

export function validateApiKey(key: string): { valid: boolean; record?: ApiKeyRecord; error?: string } {
  if (!key || !key.startsWith(KEY_PREFIX)) {
    return { valid: false, error: "Invalid API key format" };
  }

  const record = keyStore.get(key);
  if (!record) {
    return { valid: false, error: "API key not found" };
  }

  // 检查是否需要重置日计数
  const now = Date.now();
  const dayMs = 24 * 60 * 60 * 1000;
  if (now - record.lastReset > dayMs) {
    record.requestsToday = 0;
    record.lastReset = now;
  }

  return { valid: true, record };
}

// 限流检查
const TIER_LIMITS: Record<ApiKeyRecord["tier"], number> = {
  free: 100,
  pro: 1000000, // 1M tokens (simplified to requests for MVP)
  business: 5000000, // 5M tokens
};

export function checkRateLimit(record: ApiKeyRecord): { allowed: boolean; remaining: number; error?: string } {
  const limit = TIER_LIMITS[record.tier];

  if (record.tier === "free") {
    // Free 按请求数限流
    if (record.requestsToday >= limit) {
      return {
        allowed: false,
        remaining: 0,
        error: `Free tier limit reached (${limit} requests/day). Upgrade to continue.`,
      };
    }
    record.requestsToday++;
    return { allowed: true, remaining: limit - record.requestsToday };
  }

  // Pro/Business 按 token 数限流（MVP 简化为请求数）
  record.requestsToday++;
  return { allowed: true, remaining: Math.max(0, limit - record.requestsToday) };
}

// 从请求头提取 API Key
export function extractApiKey(req: Request): string | null {
  const auth = req.headers.get("Authorization");
  if (auth?.startsWith("Bearer ")) {
    return auth.slice(7);
  }
  return null;
}
