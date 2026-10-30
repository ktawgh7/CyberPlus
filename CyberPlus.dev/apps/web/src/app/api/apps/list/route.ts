import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const apps = await db.connectedApp.findMany({
      where: { userId: user.id },
      orderBy: { connectedAt: "desc" },
    });

    return NextResponse.json({ apps });
  } catch (err: any) {
    return NextResponse.json({ error: "Failed to fetch apps" }, { status: 500 });
  }
}

