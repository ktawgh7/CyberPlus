import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { addCommitmentToTier } from "@/lib/semaphore";
import { logAuditEvent } from "@/lib/audit";
import { AppointmentStatus, Role } from "@prisma/client";

export async function POST(req: NextRequest) {
  try {
    const officer = await getCurrentUser();
    if (!officer || (officer.role !== Role.OFFICER && officer.role !== Role.ADMIN)) {
      return NextResponse.json({ error: "Officer credentials required" }, { status: 403 });
    }

    const { appointmentId, checks, notes } = await req.json();
    const appt = await db.appointment.findUnique({
      where: { id: appointmentId },
      include: {
        user: {
          include: {
            profile: {
              include: {
                identityKeys: {
                  where: { status: "ACTIVE" },
                  take: 1,
                },
              },
            },
          },
        },
      },
    });

    if (!appt) return NextResponse.json({ error: "Appointment not found" }, { status: 404 });

    const targetTier = appt.tier || 2;
    const user = appt.user;
    const activeKey = user.profile?.identityKeys[0];

    // Upgrade tier in profile
    await db.profile.update({
      where: { id: user.profile!.id },
      data: { tier: targetTier },
    });

    // If user has an active commitment, add to target tier Semaphore group!
    if (activeKey) {
      await addCommitmentToTier(activeKey.commitment, targetTier);
      await db.identityKey.update({
        where: { id: activeKey.id },
        data: { tier: targetTier },
      });
    }

    // Mark appointment completed
    await db.appointment.update({
      where: { id: appointmentId },
      data: {
        status: AppointmentStatus.COMPLETED,
        completedBy: officer.name,
        notes: notes || "In-person physical verification completed.",
      },
    });

    await logAuditEvent({
      userId: user.id,
      action: `TIER${targetTier}_IN_PERSON_OFFICER_VERIFIED`,
      detail: {
        officerId: officer.id,
        officerName: officer.name,
        targetTier,
        checklistConfirmed: checks,
      },
    });

    return NextResponse.json({
      success: true,
      message: `User elevated to Tier ${targetTier} by Officer ${officer.name}`,
    });
  } catch (err: any) {
    console.error("Officer verify appointment error:", err);
    return NextResponse.json({ error: "Failed to verify appointment" }, { status: 500 });
  }
}

