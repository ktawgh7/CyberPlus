import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { addCommitmentToTier } from "@/lib/semaphore";
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

    if (!user.emailVerified) {
      return NextResponse.json({ error: "Email must be verified before enrollment" }, { status: 403 });
    }

    const { commitment, isSoftware, emergencyKeySalt } = await req.json();
    if (!commitment) {
      return NextResponse.json({ error: "Missing identity commitment" }, { status: 400 });
    }

    // Get or create profile
    let profile = await db.profile.findUnique({ where: { userId: user.id } });
    if (!profile) {
      profile = await db.profile.create({
        data: {
          userId: user.id,
          tier: 1,
          status: KeyStatus.NOT_ENROLLED,
        },
      });
    }

    // Add commitment to Tier 1 Semaphore group
    const newRoot = await addCommitmentToTier(commitment, 1);

    // Create IdentityKey
    const identityKey = await db.identityKey.create({
      data: {
        profileId: profile.id,
        commitment,
        tier: 1,
        status: KeyStatus.ACTIVE,
        isSoftware: !!isSoftware,
        activatesAt: new Date(), // Immediate for initial enrollment
      },
    });

    await db.keyEvent.create({
      data: {
        keyId: identityKey.id,
        eventType: "ENROLLED",
        detail: `Enrolled into verified-humans-tier1. Root: ${newRoot.substring(0, 16)}...`,
      },
    });

    // Update profile
    await db.profile.update({
      where: { id: profile.id },
      data: {
        status: KeyStatus.ACTIVE,
        tier: 1,
        emergencyKeySalt: emergencyKeySalt || null,
        lastVerifiedAt: new Date(),
      },
    });

    // Create emergency freeze link token and email to user
    const freezeToken = generateToken(32);
    await db.emailToken.create({
      data: {
        userId: user.id,
        token: freezeToken,
        type: TokenType.EMERGENCY_FREEZE,
        expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // Long-lived until key change
      },
    });

    await sendEmergencyFreezeEmail(user.email, freezeToken);

    await logAuditEvent({
      userId: user.id,
      action: "IDENTITY_ENROLLMENT_COMPLETED",
      detail: { commitment: commitment.substring(0, 16) + "...", isSoftware, root: newRoot.substring(0, 16) + "..." },
    });

    return NextResponse.json({
      success: true,
      tier: 1,
      status: KeyStatus.ACTIVE,
      commitment,
      merkleRoot: newRoot,
    });
  } catch (err: any) {
    console.error("Enrollment commitment error:", err);
    return NextResponse.json({ error: err.message || "Failed to register identity commitment" }, { status: 500 });
  }
}

