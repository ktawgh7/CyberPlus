import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import Stripe from "stripe";

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { plan } = await req.json();
    const stripeKey = process.env.STRIPE_SECRET_KEY;
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

    // If live/test Stripe key is configured and not placeholder:
    if (stripeKey && !stripeKey.includes("placeholder")) {
      const stripe = new Stripe(stripeKey, { apiVersion: "2024-12-18.acacia" as any });

      const session = await stripe.checkout.sessions.create({
        mode: "subscription",
        payment_method_types: ["card"],
        customer_email: user.email,
        line_items: [
          {
            price_data: {
              currency: "usd",
              product_data: {
                name: "CyberPlus Business Pilot Seat",
                description: "Per enrolled verified employee per month",
              },
              unit_amount: plan === "business_annual" ? 8640 : 900, // $9.00/mo or discounted
              recurring: {
                interval: plan === "business_annual" ? "year" : "month",
              },
            },
            quantity: 1,
          },
        ],
        success_url: `${appUrl}/dashboard/business?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${appUrl}/pricing`,
      });

      return NextResponse.json({ url: session.url });
    }

    // Fallback: Test Mode Simulation
    return NextResponse.json({
      url: `${appUrl}/dashboard/business?stripe_test_checkout=success`,
      message: "Stripe test mode simulated session initialized.",
    });
  } catch (err: any) {
    console.error("Stripe error:", err);
    return NextResponse.json({
      url: `/dashboard/business?stripe_test=active`,
      message: "Test mode fallback",
    });
  }
}

