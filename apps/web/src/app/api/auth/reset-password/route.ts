import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { hashPassword } from "@/lib/crypto";
import { logAuditEvent } from "@/lib/audit";

const schema = z.object({
  token: z.string().min(1),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.errors[0].message }, { status: 400 });
    }

    const { token, password } = parsed.data;

    const resetToken = await db.resetToken.findUnique({
      where: { token },
      include: { user: true },
    });

    if (!resetToken || resetToken.usedAt || resetToken.expiresAt < new Date()) {
      return NextResponse.json({ error: "Password reset link is invalid or has expired." }, { status: 400 });
    }

    const passwordHash = await hashPassword(password);

    await db.$transaction([
      db.user.update({
        where: { id: resetToken.userId },
        data: {
          passwordHash,
          failedAttempts: 0,
          lockedUntil: null,
        },
      }),
      db.resetToken.update({
        where: { id: resetToken.id },
        data: { usedAt: new Date() },
      }),
      // Invalidate existing sessions for security
      db.session.deleteMany({
        where: { userId: resetToken.userId },
      }),
    ]);

    await logAuditEvent({
      userId: resetToken.userId,
      action: "PASSWORD_RESET_COMPLETED",
      detail: { note: "All prior sessions revoked" },
    });

    return NextResponse.json({ success: true, message: "Password updated successfully. You may now log in." });
  } catch (err: any) {
    console.error("Reset password error:", err);
    return NextResponse.json({ error: "Password reset failed" }, { status: 500 });
  }
}

