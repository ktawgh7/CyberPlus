import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { generateToken } from "@/lib/crypto";
import { sendPasswordResetEmail } from "@/lib/email";
import { checkRateLimit } from "@/lib/rate-limit";

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get("x-forwarded-for") || "127.0.0.1";
    const rl = checkRateLimit(`reset_req_${ip}`, { limit: 5, windowMs: 60000 });
    if (!rl.allowed) {
      return NextResponse.json({ error: "Too many reset requests. Please wait." }, { status: 429 });
    }

    const { email } = await req.json();
    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const lowerEmail = email.toLowerCase().trim();
    const user = await db.user.findUnique({ where: { email: lowerEmail } });

    // Always return success to prevent email enumeration attacks
    if (user) {
      const token = generateToken(32);
      const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

      await db.resetToken.create({
        data: {
          userId: user.id,
          token,
          expiresAt,
        },
      });

      await sendPasswordResetEmail(user.email, token);
    }

    return NextResponse.json({
      success: true,
      message: "If that email exists in our system, a password reset link has been dispatched.",
    });
  } catch (err: any) {
    console.error("Forgot password error:", err);
    return NextResponse.json({ error: "Failed to process request" }, { status: 500 });
  }
}

