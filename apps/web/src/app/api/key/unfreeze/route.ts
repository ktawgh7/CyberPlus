import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { addCommitmentToTier } from "@/lib/semaphore";
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
          where: { status: KeyStatus.FROZEN },
          orderBy: { createdAt: "desc" },
          take: 1,
        },
      },
    });

    if (!profile || profile.identityKeys.length === 0) {
      return NextResponse.json({ error: "No frozen key found to unfreeze" }, { status: 400 });
    }

    const frozenKey = profile.identityKeys[0];

    // Re-add to tier group
    const newRoot = await addCommitmentToTier(frozenKey.commitment, frozenKey.tier);

    await db.identityKey.update({
      where: { id: frozenKey.id },
      data: { status: KeyStatus.ACTIVE },
    });

    await db.keyEvent.create({
      data: {
        keyId: frozenKey.id,
        eventType: "UNFROZEN",
        detail: "Key unfrozen by authenticated user. Re-added to tier group.",
      },
    });

    await db.profile.update({
      where: { id: profile.id },
      data: { status: KeyStatus.ACTIVE },
    });

    await logAuditEvent({
      userId: user.id,
      action: "KEY_UNFROZEN",
      detail: { keyId: frozenKey.id, newRoot: newRoot.slice(0, 16) + "..." },
    });

    return NextResponse.json({
      success: true,
      status: KeyStatus.ACTIVE,
      message: "Key successfully unfrozen. Verifications are active.",
    });
  } catch (err: any) {
    console.error("Unfreeze error:", err);
    return NextResponse.json({ error: "Failed to unfreeze key" }, { status: 500 });
  }
}

