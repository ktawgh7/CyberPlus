import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { hashPassword } from "@/lib/crypto";
import { logAuditEvent } from "@/lib/audit";

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { duressCode } = await req.json();
    if (!duressCode || duressCode.length < 4) {
      return NextResponse.json({ error: "Duress code must be at least 4 digits" }, { status: 400 });
    }

    const duressCodeHash = await hashPassword(duressCode);
    await db.user.update({
      where: { id: user.id },
      data: { duressCodeHash },
    });

    await logAuditEvent({
      userId: user.id,
      action: "DURESS_CODE_CONFIGURED",
      detail: { note: "Duress PIN updated silently" },
    });

    return NextResponse.json({ success: true, message: "Duress code saved successfully" });
  } catch (err: any) {
    return NextResponse.json({ error: "Failed to update duress code" }, { status: 500 });
  }
}

