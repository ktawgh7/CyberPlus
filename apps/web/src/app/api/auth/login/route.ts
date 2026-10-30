import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { verifyPassword } from "@/lib/crypto";
import { createSession } from "@/lib/auth";
import { checkRateLimit } from "@/lib/rate-limit";
import { logAuditEvent } from "@/lib/audit";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

const MAX_FAILED_ATTEMPTS = 5;
const LOCKOUT_MINUTES = 15;

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get("x-forwarded-for") || "127.0.0.1";
    const rl = checkRateLimit(`login_${ip}`, { limit: 15, windowMs: 60000 });
    if (!rl.allowed) {
      return NextResponse.json({ error: "Too many login attempts. Please wait 1 minute." }, { status: 429 });
    }

    const body = await req.json();
    const parsed = loginSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 400 });
    }

    const { email, password } = parsed.data;
    const lowerEmail = email.toLowerCase().trim();

    const user = await db.user.findUnique({
      where: { email: lowerEmail },
      include: { profile: true },
    });

    if (!user) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
    }

    // Check account lockout
    if (user.lockedUntil && user.lockedUntil > new Date()) {
      const waitMinutes = Math.ceil((user.lockedUntil.getTime() - Date.now()) / 60000);
      return NextResponse.json({
        error: `Account is temporarily locked due to repeated failed attempts. Please retry in ${waitMinutes} minutes.`,
      }, { status: 423 });
    }

    const isValid = await verifyPassword(password, user.passwordHash);

    if (!isValid) {
      const failed = user.failedAttempts + 1;
      let lockedUntil: Date | null = null;

      if (failed >= MAX_FAILED_ATTEMPTS) {
        lockedUntil = new Date(Date.now() + LOCKOUT_MINUTES * 60 * 1000);
      }

      await db.user.update({
        where: { id: user.id },
        data: {
          failedAttempts: failed,
          lockedUntil,
        },
      });

      await logAuditEvent({
        userId: user.id,
        action: "LOGIN_FAILED",
        detail: { attempt: failed, locked: lockedUntil !== null },
      });

      if (lockedUntil) {
        return NextResponse.json({
          error: `Maximum login attempts exceeded. Account locked for ${LOCKOUT_MINUTES} minutes.`,
        }, { status: 423 });
      }

      return NextResponse.json({
        error: `Invalid email or password (${MAX_FAILED_ATTEMPTS - failed} attempts remaining)`,
      }, { status: 401 });
    }

    // Reset failed attempts on success
    await db.user.update({
      where: { id: user.id },
      data: { failedAttempts: 0, lockedUntil: null },
    });

    // Create session
    await createSession(user.id);

    await logAuditEvent({
      userId: user.id,
      action: "LOGIN_SUCCESS",
      detail: { ip },
    });

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        emailVerified: user.emailVerified,
      },
    });
  } catch (err: any) {
    console.error("Login error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

