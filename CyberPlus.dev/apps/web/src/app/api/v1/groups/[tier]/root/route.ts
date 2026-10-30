import { NextRequest, NextResponse } from "next/server";
import { getLatestGroupRoot } from "@/lib/semaphore";

interface RouteProps {
  params: Promise<{ tier: string }>;
}

export async function GET(req: NextRequest, { params }: RouteProps) {
  try {
    const { tier: tierStr } = await params;
    const tier = parseInt(tierStr, 10);

    if (isNaN(tier) || tier < 1 || tier > 3) {
      return NextResponse.json({ error: "Invalid tier. Supported tiers: 1, 2, 3" }, { status: 400 });
    }

    const rootInfo = await getLatestGroupRoot(tier);

    return NextResponse.json({
      group: rootInfo.group,
      root: rootInfo.root,
      size: rootInfo.size,
      timestamp: rootInfo.timestamp.toISOString(),
    });
  } catch (err: any) {
    return NextResponse.json({ error: "Failed to fetch Merkle root" }, { status: 500 });
  }
}

