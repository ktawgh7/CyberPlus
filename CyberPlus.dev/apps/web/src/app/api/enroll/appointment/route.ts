import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { sendAppointmentConfirmationEmail } from "@/lib/email";
import { logAuditEvent } from "@/lib/audit";
import { AppointmentStatus } from "@prisma/client";

export async function GET() {
  try {
    const locations = await db.location.findMany({
      where: { active: true },
      orderBy: { country: "asc" },
    });

    const user = await getCurrentUser();
    let appointments: any[] = [];
    if (user) {
      appointments = await db.appointment.findMany({
        where: { userId: user.id },
        include: { location: true },
        orderBy: { dateTime: "desc" },
      });
    }

    return NextResponse.json({ locations, appointments });
  } catch (err: any) {
    return NextResponse.json({ error: "Failed to fetch appointment metadata" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }

    const { locationId, dateTime, tier } = await req.json();
    if (!locationId || !dateTime) {
      return NextResponse.json({ error: "Location and date/time are required" }, { status: 400 });
    }

    const location = await db.location.findUnique({ where: { id: locationId } });
    if (!location) {
      return NextResponse.json({ error: "Location not found" }, { status: 404 });
    }

    const appointmentDate = new Date(dateTime);

    const appointment = await db.appointment.create({
      data: {
        userId: user.id,
        locationId,
        dateTime: appointmentDate,
        tier: tier || 2,
        status: AppointmentStatus.CONFIRMED,
      },
    });

    await sendAppointmentConfirmationEmail(user.email, location.name, appointmentDate);

    await logAuditEvent({
      userId: user.id,
      action: "IN_PERSON_APPOINTMENT_BOOKED",
      detail: { location: location.name, date: appointmentDate.toISOString(), targetTier: tier || 2 },
    });

    return NextResponse.json({ success: true, appointment });
  } catch (err: any) {
    console.error("Booking error:", err);
    return NextResponse.json({ error: "Failed to book appointment" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }

    const { appointmentId } = await req.json();
    const appt = await db.appointment.findUnique({ where: { id: appointmentId } });

    if (!appt || appt.userId !== user.id) {
      return NextResponse.json({ error: "Appointment not found" }, { status: 404 });
    }

    await db.appointment.update({
      where: { id: appointmentId },
      data: { status: AppointmentStatus.CANCELLED },
    });

    await logAuditEvent({
      userId: user.id,
      action: "APPOINTMENT_CANCELLED",
      detail: { appointmentId },
    });

    return NextResponse.json({ success: true, message: "Appointment cancelled" });
  } catch (err: any) {
    return NextResponse.json({ error: "Failed to cancel appointment" }, { status: 500 });
  }
}

