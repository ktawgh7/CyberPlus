import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { hashPassword, verifyPassword } from "@/lib/crypto";
import { logAuditEvent } from "@/lib/audit";

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { currentPassword, newPassword } = await req.json();
    if (!currentPassword || !newPassword || newPassword.length < 8) {
      return NextResponse.json({ error: "New password must be at least 8 characters" }, { status: 400 });
    }

    const isValid = await verifyPassword(currentPassword, user.passwordHash);
    if (!isValid) {
      return NextResponse.json({ error: "Current password incorrect" }, { status: 400 });
    }

    const passwordHash = await hashPassword(newPassword);
    await db.user.update({
      where: { id: user.id },
      data: { passwordHash },
    });

    await logAuditEvent({
      userId: user.id,
      action: "PASSWORD_CHANGED",
      detail: { note: "Password updated by user" },
    });

    return NextResponse.json({ success: true, message: "Password updated" });
  } catch (err: any) {
    return NextResponse.json({ error: "Failed to update password" }, { status: 500 });
  }
}

