import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { validateApiKey } from "@/lib/api-auth";
import { generateToken } from "@/lib/crypto";
import { checkRateLimit } from "@/lib/rate-limit";

const schema = z.object({
  appScope: z.string().min(2).default("default.app"),
  requiredTier: z.number().int().min(1).max(3).default(1),
  externalId: z.string().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get("x-forwarded-for") || "127.0.0.1";
    const rl = checkRateLimit(`challenges_${ip}`, { limit: 120, windowMs: 60000 });
    if (!rl.allowed) {
      return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429 });
    }

    // Optional API key validation (falls back to public/sandbox sandbox key for playground and demos)
    const auth = await validateApiKey(req);

    const body = await req.json().catch(() => ({}));
    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.errors[0].message }, { status: 400 });
    }

    const { appScope, requiredTier } = parsed.data;

    // Ephemeral challenge random message (32 hex bytes)
    const randomMessage = "0x" + generateToken(32);
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes validity

    const challenge = await db.challenge.create({
      data: {
        apiKeyId: auth?.key.id || null,
        appScope,
        message: randomMessage,
        requiredTier,
        expiresAt,
      },
    });

    return NextResponse.json({
      id: challenge.id,
      scope: challenge.appScope,
      message: challenge.message,
      requiredTier: challenge.requiredTier,
      expiresAt: challenge.expiresAt.toISOString(),
      mode: auth?.mode || "SANDBOX",
    });
  } catch (err: any) {
    console.error("Challenge creation error:", err);
    return NextResponse.json({ error: "Failed to create challenge" }, { status: 500 });
  }
}

