import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { hashPassword, generateToken } from "@/lib/crypto";
import { sendVerificationEmail } from "@/lib/email";
import { checkRateLimit } from "@/lib/rate-limit";
import { logAuditEvent } from "@/lib/audit";
import { TokenType } from "@prisma/client";

const signupSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  accountType: z.enum(["INDIVIDUAL", "BUSINESS"]).default("INDIVIDUAL"),
  terms: z.boolean().refine((val) => val === true, "You must agree to the Terms of Service"),
});

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get("x-forwarded-for") || "127.0.0.1";
    const rl = checkRateLimit(`signup_${ip}`, { limit: 10, windowMs: 60000 });
    if (!rl.allowed) {
      return NextResponse.json({ error: "Too many requests. Please wait." }, { status: 429 });
    }

    const body = await req.json();
    const parsed = signupSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.errors[0].message }, { status: 400 });
    }

    const { name, email, password, accountType } = parsed.data;
    const lowerEmail = email.toLowerCase().trim();

    // Check if user already exists
    const existing = await db.user.findUnique({ where: { email: lowerEmail } });
    if (existing) {
      return NextResponse.json({ error: "An account with this email already exists" }, { status: 400 });
    }

    const passwordHash = await hashPassword(password);

    // Create user and profile in a transaction
    const user = await db.$transaction(async (tx) => {
      const newUser = await tx.user.create({
        data: {
          name,
          email: lowerEmail,
          passwordHash,
          accountType,
          emailVerified: false,
        },
      });

      await tx.profile.create({
        data: {
          userId: newUser.id,
          tier: 1,
          status: "NOT_ENROLLED",
        },
      });

      return newUser;
    });

    // Create verification token
    const token = generateToken(32);
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    await db.emailToken.create({
      data: {
        userId: user.id,
        token,
        type: TokenType.VERIFY_EMAIL,
        expiresAt,
      },
    });

    // Send verification email
    await sendVerificationEmail(lowerEmail, token);

    await logAuditEvent({
      userId: user.id,
      action: "USER_SIGNUP",
      detail: { email: lowerEmail, accountType },
    });

    return NextResponse.json({
      success: true,
      message: "Account created successfully. Please check your email to verify your account.",
      userId: user.id,
    });
  } catch (err: any) {
    console.error("Signup error:", err);
    return NextResponse.json({ error: "Failed to create account" }, { status: 500 });
  }
}

