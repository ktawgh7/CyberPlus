import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const fullData = await db.user.findUnique({
      where: { id: user.id },
      include: {
        profile: {
          include: {
            identityKeys: true,
          },
        },
        passkeys: true,
        connectedApps: true,
        appointments: true,
        documentSubmissions: true,
        auditLogs: true,
      },
    });

    return NextResponse.json({
      exportVersion: "cyberplus:data-export:v1",
      exportedAt: new Date().toISOString(),
      user: {
        id: fullData?.id,
        name: fullData?.name,
        email: fullData?.email,
        accountType: fullData?.accountType,
        profile: fullData?.profile,
        connectedApps: fullData?.connectedApps,
        appointments: fullData?.appointments,
        auditHistory: fullData?.auditLogs,
      },
    });
  } catch (err: any) {
    return NextResponse.json({ error: "Export failed" }, { status: 500 });
  }
}

