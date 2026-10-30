import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { Role } from "@prisma/client";

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user || (user.role !== Role.OFFICER && user.role !== Role.ADMIN)) {
      return NextResponse.json({ error: "Officer credentials required" }, { status: 403 });
    }

    const pendingDocs = await db.documentSubmission.findMany({
      where: { status: "PENDING" },
      include: { user: true },
      orderBy: { createdAt: "desc" },
    });

    const pendingAppointments = await db.appointment.findMany({
      where: { status: "CONFIRMED" },
      include: { user: true, location: true },
      orderBy: { dateTime: "asc" },
    });

    const recoveryRequests = await db.recoveryRequest.findMany({
      where: { status: { in: ["PENDING_FIRST_APPROVAL", "PENDING_SECOND_APPROVAL", "ACTIVATION_DELAY"] } },
      include: {
        user: true,
        approvals: {
          include: { officer: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({
      pendingDocs,
      pendingAppointments,
      recoveryRequests,
      currentOfficer: { id: user.id, name: user.name, role: user.role },
    });
  } catch (err: any) {
    return NextResponse.json({ error: "Failed to fetch officer queue" }, { status: 500 });
  }
}

