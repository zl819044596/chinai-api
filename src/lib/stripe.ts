// Stripe 配置
// MVP 阶段：创建 Checkout Session，用户支付后 webhook 升级 tier

const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY || "";
const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET || "";

// 价格配置（需要在 Stripe Dashboard 创建对应 Price ID）
export const STRIPE_PRICES: Record<"pro" | "business", string> = {
  pro: process.env.STRIPE_PRICE_PRO || "",
  business: process.env.STRIPE_PRICE_BUSINESS || "",
};

export { STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET };
