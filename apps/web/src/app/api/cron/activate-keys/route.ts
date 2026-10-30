import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { addCommitmentToTier } from "@/lib/semaphore";
import { logAuditEvent } from "@/lib/audit";
import { KeyStatus } from "@prisma/client";

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization");
    const secret = process.env.CRON_SECRET || "cyberplus-cron-internal-secret-token";

    if (authHeader !== `Bearer ${secret}`) {
      return NextResponse.json({ error: "Unauthorized cron trigger" }, { status: 401 });
    }

    const now = new Date();

    // Find all keys whose 48-hour delay has elapsed
    const pendingKeys = await db.identityKey.findMany({
      where: {
        status: KeyStatus.PENDING_ACTIVATION,
        activatesAt: { lte: now },
      },
      include: { profile: true },
    });

    let activatedCount = 0;

    for (const key of pendingKeys) {
      // Add commitment to tier group
      await addCommitmentToTier(key.commitment, key.tier);

      await db.identityKey.update({
        where: { id: key.id },
        data: { status: KeyStatus.ACTIVE },
      });

      await db.profile.update({
        where: { id: key.profileId },
        data: { status: KeyStatus.ACTIVE },
      });

      await db.keyEvent.create({
        data: {
          keyId: key.id,
          eventType: "ACTIVATED",
          detail: "48-hour activation delay elapsed. Key is now active and generating proofs.",
        },
      });

      await logAuditEvent({
        userId: key.profile.userId,
        action: "KEY_ACTIVATION_DELAY_COMPLETED",
        detail: { keyId: key.id, tier: key.tier },
      });

      activatedCount++;
    }

    return NextResponse.json({
      success: true,
      evaluatedAt: now.toISOString(),
      activatedKeys: activatedCount,
    });
  } catch (err: any) {
    console.error("Cron activation error:", err);
    return NextResponse.json({ error: "Failed to evaluate key activations" }, { status: 500 });
  }
}

