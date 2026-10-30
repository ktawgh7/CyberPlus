import { NextResponse } from "next/server";
import { getCurrentUser, destroySession } from "@/lib/auth";
import { db } from "@/lib/db";
import { removeCommitmentFromTier } from "@/lib/semaphore";
import { logAuditEvent } from "@/lib/audit";
import { KeyStatus } from "@prisma/client";

export async function POST() {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    // 1. Remove all active commitments from Semaphore trees
    const profile = await db.profile.findUnique({
      where: { userId: user.id },
      include: { identityKeys: true },
    });

    if (profile) {
      for (const k of profile.identityKeys) {
        if (k.status === KeyStatus.ACTIVE) {
          await removeCommitmentFromTier(k.commitment, k.tier);
        }
      }
    }

    // 2. Log anonymized tombstone into audit ledger
    await logAuditEvent({
      userId: null,
      action: "ACCOUNT_DELETED_PERMANENTLY",
      detail: { anonymizedUserId: user.id.slice(0, 8) + "...", reason: "User self-service deletion" },
    });

    // 3. Delete user record (cascades sessions, passkeys, profile, etc.)
    await db.user.delete({
      where: { id: user.id },
    });

    await destroySession();

    return NextResponse.json({ success: true, message: "Account purged permanently" });
  } catch (err: any) {
    console.error("Account deletion error:", err);
    return NextResponse.json({ error: "Failed to delete account" }, { status: 500 });
  }
}

