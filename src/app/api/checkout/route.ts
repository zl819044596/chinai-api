import { NextRequest, NextResponse } from "next/server";
import { STRIPE_SECRET_KEY, STRIPE_PRICES } from "@/lib/stripe";

export const runtime = "edge";

export async function POST(req: NextRequest) {
  try {
    const { tier, apiKey } = await req.json();

    if (!tier || !["pro", "business"].includes(tier)) {
      return NextResponse.json({ error: "Invalid tier" }, { status: 400 });
    }

    const priceId = STRIPE_PRICES[tier as "pro" | "business"];
    if (!priceId) {
      return NextResponse.json(
        { error: "Stripe price not configured" },
        { status: 400 }
      );
    }

    // Mock checkout session (no real Stripe key = return mock URL)
    if (!STRIPE_SECRET_KEY) {
      return NextResponse.json({
        url: `/checkout/success?session_id=mock_${tier}_${Date.now()}&tier=${tier}&apiKey=${apiKey || ""}`,
        mock: true,
      });
    }

    // Real Stripe integration
    const stripe = require("stripe")(STRIPE_SECRET_KEY);
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${req.headers.get("origin")}/checkout/success?session_id={CHECKOUT_SESSION_ID}&tier=${tier}&apiKey=${apiKey || ""}`,
      cancel_url: `${req.headers.get("origin")}/pricing`,
      metadata: { tier, apiKey: apiKey || "" },
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}
