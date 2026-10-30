import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const logs = await db.auditLog.findMany({
      orderBy: { timestamp: "desc" },
      take: 100,
    });

    return NextResponse.json({ logs });
  } catch (err: any) {
    return NextResponse.json({ error: "Failed to fetch logs" }, { status: 500 });
  }
}

