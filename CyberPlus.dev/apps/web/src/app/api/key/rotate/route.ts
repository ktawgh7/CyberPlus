import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { removeCommitmentFromTier, addCommitmentToTier } from "@/lib/semaphore";
import { generateToken } from "@/lib/crypto";
import { sendEmergencyFreezeEmail } from "@/lib/email";
import { logAuditEvent } from "@/lib/audit";
import { KeyStatus, TokenType } from "@prisma/client";

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }

    const { newCommitment, isSoftware, fastForwardDemo } = await req.json();
    if (!newCommitment) {
      return NextResponse.json({ error: "Missing new identity commitment" }, { status: 400 });
    }

    const profile = await db.profile.findUnique({
      where: { userId: user.id },
      include: {
        identityKeys: {
          where: { revokedAt: null },
          orderBy: { createdAt: "desc" },
        },
      },
    });

    if (!profile) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }

    // 1. Revoke existing active or frozen keys
    for (const oldKey of profile.identityKeys) {
      await removeCommitmentFromTier(oldKey.commitment, oldKey.tier);
      await db.identityKey.update({
        where: { id: oldKey.id },
        data: {
          status: KeyStatus.REVOKED,
          revokedAt: new Date(),
        },
      });
      await db.keyEvent.create({
        data: {
          keyId: oldKey.id,
          eventType: "REVOKED",
          detail: "Key revoked due to user key rotation.",
        },
      });
    }

    // 2. 48-hour activation delay (or immediate if fastForwardDemo flag is passed for demo review)
    const activatesAt = fastForwardDemo
      ? new Date()
      : new Date(Date.now() + 48 * 60 * 60 * 1000); // 48h delay

    const initialStatus = fastForwardDemo ? KeyStatus.ACTIVE : KeyStatus.PENDING_ACTIVATION;

    // 3. Create new identity key
    const newKey = await db.identityKey.create({
      data: {
        profileId: profile.id,
        commitment: newCommitment,
        tier: profile.tier,
        status: initialStatus,
        isSoftware: !!isSoftware,
        activatesAt,
      },
    });

    await db.keyEvent.create({
      data: {
        keyId: newKey.id,
        eventType: "ROTATED",
        detail: `New commitment generated. Activates at ${activatesAt.toISOString()}`,
      },
    });

    // If fast-forwarded, add to group immediately
    if (fastForwardDemo) {
      await addCommitmentToTier(newCommitment, profile.tier);
      await db.profile.update({
        where: { id: profile.id },
        data: { status: KeyStatus.ACTIVE },
      });
    } else {
      await db.profile.update({
        where: { id: profile.id },
        data: { status: KeyStatus.PENDING_ACTIVATION },
      });
    }

    // 4. Generate new emergency freeze link token
    const freezeToken = generateToken(32);
    await db.emailToken.create({
      data: {
        userId: user.id,
        token: freezeToken,
        type: TokenType.EMERGENCY_FREEZE,
        expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
      },
    });

    await sendEmergencyFreezeEmail(user.email, freezeToken);

    await logAuditEvent({
      userId: user.id,
      action: "KEY_ROTATION_INITIATED",
      detail: {
        newCommitment: newCommitment.slice(0, 16) + "...",
        activatesAt: activatesAt.toISOString(),
        demoFastForward: !!fastForwardDemo,
      },
    });

    return NextResponse.json({
      success: true,
      keyId: newKey.id,
      status: initialStatus,
      activatesAt: activatesAt.toISOString(),
    });
  } catch (err: any) {
    console.error("Rotation error:", err);
    return NextResponse.json({ error: "Failed to rotate identity key" }, { status: 500 });
  }
}

