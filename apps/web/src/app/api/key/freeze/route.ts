import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { removeCommitmentFromTier } from "@/lib/semaphore";
import { logAuditEvent } from "@/lib/audit";
import { KeyStatus } from "@prisma/client";

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }

    const profile = await db.profile.findUnique({
      where: { userId: user.id },
      include: {
        identityKeys: {
          where: { status: KeyStatus.ACTIVE },
          orderBy: { createdAt: "desc" },
          take: 1,
        },
      },
    });

    if (!profile || profile.identityKeys.length === 0) {
      return NextResponse.json({ error: "No active key found to freeze" }, { status: 400 });
    }

    const activeKey = profile.identityKeys[0];

    // Remove commitment from group tree
    await removeCommitmentFromTier(activeKey.commitment, activeKey.tier);

    // Update key status to FROZEN
    await db.identityKey.update({
      where: { id: activeKey.id },
      data: { status: KeyStatus.FROZEN },
    });

    await db.keyEvent.create({
      data: {
        keyId: activeKey.id,
        eventType: "FROZEN",
        detail: "Identity key frozen immediately by user. Verifications will fail.",
      },
    });

    await db.profile.update({
      where: { id: profile.id },
      data: { status: KeyStatus.FROZEN },
    });

    await logAuditEvent({
      userId: user.id,
      action: "KEY_FROZEN_INSTANTLY",
      detail: { keyId: activeKey.id, commitment: activeKey.commitment.slice(0, 16) + "..." },
    });

    return NextResponse.json({
      success: true,
      status: KeyStatus.FROZEN,
      message: "Key has been frozen immediately. All subsequent verification attempts will be rejected.",
    });
  } catch (err: any) {
    console.error("Freeze error:", err);
    return NextResponse.json({ error: "Failed to freeze key" }, { status: 500 });
  }
}

