import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const userCount = await db.user.count();
    const verifiedHumanCount = await db.identityKey.count({ where: { status: "ACTIVE" } });

    return NextResponse.json({
      status: "ok",
      version: "0.1.0-prototype",
      circuitsLoaded: true,
      protocol: "Semaphore v4 / WebAuthn PRF",
      stats: {
        enrolledUsers: userCount,
        verifiedHumansActive: verifiedHumanCount,
      },
      timestamp: new Date().toISOString(),
    });
  } catch (err: any) {
    return NextResponse.json({ status: "error", message: err.message }, { status: 500 });
  }
}

