// API Key 生成和验证（内存存储，后续迁移到 D1）

export interface ApiKeyRecord {
  key: string;
  userId: string;
  tier: "free" | "pro" | "business";
  createdAt: number;
  requestsToday: number;
  lastRequest: number;
}

const API_KEYS = new Map<string, ApiKeyRecord>();

export function generateApiKey(userId: string, tier: "free" | "pro" | "business" = "free"): string {
  const key = `chinai_${Buffer.from(crypto.randomUUID()).toString("base64url")}`;
  API_KEYS.set(key, {
    key,
    userId,
    tier,
    createdAt: Date.now(),
    requestsToday: 0,
    lastRequest: 0,
  });
  return key;
}

export function extractApiKey(req: Request): string | null {
  const auth = req.headers.get("authorization");
  if (auth?.startsWith("Bearer ")) {
    return auth.slice(7);
  }
  return null;
}

export function validateApiKey(key: string): { valid: boolean; error?: string; record?: ApiKeyRecord } {
  const record = API_KEYS.get(key);
  if (!record) {
    return { valid: false, error: "Invalid API key" };
  }
  return { valid: true, record };
}

export function checkRateLimit(record: ApiKeyRecord): { allowed: boolean; error?: string; remaining: number } {
  const now = Date.now();
  const dayStart = new Date().setHours(0, 0, 0, 0);

  if (record.lastRequest < dayStart) {
    record.requestsToday = 0;
  }

  const limits = {
    free: 100,
    pro: 1000000,
    business: 5000000,
  };

  const limit = limits[record.tier];

  if (record.requestsToday >= limit) {
    return {
      allowed: false,
      error: `Rate limit exceeded. ${record.tier} tier allows ${limit} requests per day.`,
      remaining: 0,
    };
  }

  record.requestsToday++;
  record.lastRequest = now;

  return {
    allowed: true,
    remaining: limit - record.requestsToday,
  };
}
