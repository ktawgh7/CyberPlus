import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { generateToken } from "@/lib/crypto";

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const membership = await db.membership.findFirst({
      where: { userId: user.id },
    });

    if (!membership) return NextResponse.json({ webhooks: [], deliveries: [] });

    const webhooks = await db.webhook.findMany({
      where: { orgId: membership.orgId },
    });

    const deliveries = await db.webhookDelivery.findMany({
      where: { webhook: { orgId: membership.orgId } },
      orderBy: { createdAt: "desc" },
      take: 20,
    });

    return NextResponse.json({ webhooks, deliveries });
  } catch (err: any) {
    return NextResponse.json({ error: "Failed to fetch webhooks" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const membership = await db.membership.findFirst({
      where: { userId: user.id },
    });

    if (!membership || membership.role === "MEMBER") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const { url, events } = await req.json();
    if (!url) return NextResponse.json({ error: "Webhook URL required" }, { status: 400 });

    const secret = `whsec_${generateToken(24)}`;

    const webhook = await db.webhook.create({
      data: {
        orgId: membership.orgId,
        url,
        secret,
        events: events || "verification.succeeded,verification.failed,key.frozen,key.rotated",
        active: true,
      },
    });

    return NextResponse.json({ success: true, webhook, secret });
  } catch (err: any) {
    return NextResponse.json({ error: "Failed to create webhook" }, { status: 500 });
  }
}

