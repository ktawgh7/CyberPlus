import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { logAuditEvent } from "@/lib/audit";
import { RecoveryStatus, Role } from "@prisma/client";

export async function POST(req: NextRequest) {
  try {
    const officer = await getCurrentUser();
    if (!officer || (officer.role !== Role.OFFICER && officer.role !== Role.ADMIN)) {
      return NextResponse.json({ error: "Officer credentials required" }, { status: 403 });
    }

    const { requestId, notes } = await req.json();

    const request = await db.recoveryRequest.findUnique({
      where: { id: requestId },
      include: {
        approvals: true,
        user: true,
      },
    });

    if (!request) {
      return NextResponse.json({ error: "Recovery request not found" }, { status: 404 });
    }

    // Crucial Two-Officer Enforcement Rules:
    // 1. Officer cannot approve their own account recovery
    if (request.userId === officer.id) {
      return NextResponse.json({ error: "Conflict of interest: You cannot approve your own recovery" }, { status: 403 });
    }

    // 2. The same officer cannot approve both steps
    const priorApproval = request.approvals.find((a) => a.officerId === officer.id);
    if (priorApproval) {
      return NextResponse.json({
        error: "Two-Officer Rule Violation: You have already signed this recovery. A second, distinct officer must provide the second approval.",
      }, { status: 403 });
    }

    const approvalCount = request.approvals.length;

    if (approvalCount === 0) {
      // First approval
      await db.$transaction([
        db.recoveryApproval.create({
          data: {
            requestId: request.id,
            officerId: officer.id,
            step: 1,
            notes: notes || "First officer physical inspection passed.",
          },
        }),
        db.recoveryRequest.update({
          where: { id: request.id },
          data: { status: RecoveryStatus.PENDING_SECOND_APPROVAL },
        }),
      ]);

      await logAuditEvent({
        userId: request.userId,
        action: "RECOVERY_FIRST_OFFICER_APPROVED",
        detail: {
          requestId: request.id,
          officerId: officer.id,
          officerName: officer.name,
          step: 1,
        },
      });

      return NextResponse.json({
        success: true,
        step: 1,
        status: RecoveryStatus.PENDING_SECOND_APPROVAL,
        message: "First officer approval recorded. Awaiting second officer sign-off.",
      });
    } else if (approvalCount === 1) {
      // Second approval completes the two-person rule!
      // Enforce 48-hour activation delay
      const activatesAt = new Date(Date.now() + 48 * 60 * 60 * 1000);

      await db.$transaction([
        db.recoveryApproval.create({
          data: {
            requestId: request.id,
            officerId: officer.id,
            step: 2,
            notes: notes || "Second officer independent verification passed.",
          },
        }),
        db.recoveryRequest.update({
          where: { id: request.id },
          data: {
            status: RecoveryStatus.ACTIVATION_DELAY,
            activatesAt,
          },
        }),
      ]);

      await logAuditEvent({
        userId: request.userId,
        action: "RECOVERY_SECOND_OFFICER_APPROVED",
        detail: {
          requestId: request.id,
          officerId: officer.id,
          officerName: officer.name,
          step: 2,
          activatesAt: activatesAt.toISOString(),
          twoOfficerRuleSatisfied: true,
        },
      });

      return NextResponse.json({
        success: true,
        step: 2,
        status: RecoveryStatus.ACTIVATION_DELAY,
        activatesAt: activatesAt.toISOString(),
        message: "Dual-officer approval complete! 48-hour activation delay initiated.",
      });
    } else {
      return NextResponse.json({ error: "Recovery request already fully approved" }, { status: 400 });
    }
  } catch (err: any) {
    console.error("Approve recovery error:", err);
    return NextResponse.json({ error: "Failed to approve recovery" }, { status: 500 });
  }
}

