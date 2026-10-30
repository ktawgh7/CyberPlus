import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { addCommitmentToTier } from "@/lib/semaphore";
import { logAuditEvent } from "@/lib/audit";
import { KeyStatus, RecoveryStatus, Role } from "@prisma/client";

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user || (user.role !== Role.OFFICER && user.role !== Role.ADMIN)) {
      return NextResponse.json({ error: "Officer credentials required" }, { status: 403 });
    }

    const { requestId } = await req.json();
    const request = await db.recoveryRequest.findUnique({
      where: { id: requestId },
      include: { user: { include: { profile: true } } },
    });

    if (!request) return NextResponse.json({ error: "Request not found" }, { status: 404 });

    // Fast-forward delay and activate recovered key
    if (request.newCommitment) {
      await addCommitmentToTier(request.newCommitment, request.user.profile?.tier || 1);

      await db.identityKey.create({
        data: {
          profileId: request.user.profile!.id,
          commitment: request.newCommitment,
          tier: request.user.profile?.tier || 1,
          status: KeyStatus.ACTIVE,
          activatesAt: new Date(),
        },
      });

      await db.profile.update({
        where: { id: request.user.profile!.id },
        data: { status: KeyStatus.ACTIVE },
      });
    }

    await db.recoveryRequest.update({
      where: { id: request.id },
      data: {
        status: RecoveryStatus.COMPLETED,
        activatesAt: new Date(),
      },
    });

    await logAuditEvent({
      userId: request.userId,
      action: "RECOVERY_ACTIVATION_FAST_FORWARDED",
      detail: { officerId: user.id, officerName: user.name, note: "DEMO ONLY fast-forward executed" },
    });

    return NextResponse.json({ success: true, message: "Delay fast-forwarded. Recovered key is now ACTIVE." });
  } catch (err: any) {
    return NextResponse.json({ error: "Failed to fast-forward recovery" }, { status: 500 });
  }
}

