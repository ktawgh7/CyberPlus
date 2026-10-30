import { NextResponse } from "next/server";
import { verifyAuditChain } from "@/lib/audit";

export async function GET() {
  try {
    const result = await verifyAuditChain();
    return NextResponse.json(result);
  } catch (err: any) {
    return NextResponse.json({ error: "Audit chain verification failed" }, { status: 500 });
  }
}

