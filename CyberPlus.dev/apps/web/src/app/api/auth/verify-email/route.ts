import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { logAuditEvent } from "@/lib/audit";
import { TokenType } from "@prisma/client";

export async function POST(req: NextRequest) {
  try {
    const { token } = await req.json();
    if (!token) {
      return NextResponse.json({ error: "Missing verification token" }, { status: 400 });
    }

    const emailToken = await db.emailToken.findUnique({
      where: { token },
      include: { user: true },
    });

    if (!emailToken || emailToken.type !== TokenType.VERIFY_EMAIL) {
      return NextResponse.json({ error: "Invalid or expired token" }, { status: 400 });
    }

    if (emailToken.usedAt || emailToken.expiresAt < new Date()) {
      return NextResponse.json({ error: "This verification link has expired or has already been used" }, { status: 400 });
    }

    // Mark user verified and token used
    await db.$transaction([
      db.user.update({
        where: { id: emailToken.userId },
        data: { emailVerified: true },
      }),
      db.emailToken.update({
        where: { id: emailToken.id },
        data: { usedAt: new Date() },
      }),
    ]);

    await logAuditEvent({
      userId: emailToken.userId,
      action: "EMAIL_VERIFIED",
      detail: { email: emailToken.user.email },
    });

    return NextResponse.json({ success: true, message: "Email successfully verified" });
  } catch (err: any) {
    console.error("Email verify error:", err);
    return NextResponse.json({ error: "Verification failed" }, { status: 500 });
  }
}

