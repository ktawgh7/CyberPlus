import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { createSession } from "@/lib/auth";
import { hashPassword } from "@/lib/crypto";
import { logAuditEvent } from "@/lib/audit";

export async function POST(req: NextRequest) {
  try {
    const demoEmail = "demo@cyberplus.id";
    let user = await db.user.findUnique({
      where: { email: demoEmail },
      include: { profile: true },
    });

    if (!user) {
      // Create seeded demo user if not yet initialized
      const passwordHash = await hashPassword("DemoPassword123!");
      user = await db.user.create({
        data: {
          name: "Alex Vance (Demo User)",
          email: demoEmail,
          passwordHash,
          emailVerified: true,
          accountType: "INDIVIDUAL",
          profile: {
            create: {
              tier: 1,
              status: "NOT_ENROLLED",
            },
          },
        },
        include: { profile: true },
      });
    }

    await createSession(user.id);

    await logAuditEvent({
      userId: user.id,
      action: "DEMO_LOGIN",
      detail: { note: "Reviewer one-click demo access" },
    });

    return NextResponse.json({
      success: true,
      message: "Logged in as demo user",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err: any) {
    console.error("Demo login error:", err);
    return NextResponse.json({ error: "Failed to authenticate demo user" }, { status: 500 });
  }
}

