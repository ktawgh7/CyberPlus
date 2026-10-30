import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { logAuditEvent } from "@/lib/audit";

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { appId } = await req.json();
    if (!appId) return NextResponse.json({ error: "Missing appId" }, { status: 400 });

    await db.connectedApp.deleteMany({
      where: {
        userId: user.id,
        appId,
      },
    });

    await logAuditEvent({
      userId: user.id,
      action: "CONNECTED_APP_DISCONNECTED",
      detail: { appId, note: "App session and pseudonym revoked by user" },
    });

    return NextResponse.json({ success: true, message: "App disconnected" });
  } catch (err: any) {
    return NextResponse.json({ error: "Failed to disconnect app" }, { status: 500 });
  }
}

