import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { generateToken, sha256 } from "@/lib/crypto";
import { ApiKeyMode, OrgRole } from "@prisma/client";

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const membership = await db.membership.findFirst({
      where: { userId: user.id },
    });

    if (!membership) return NextResponse.json({ keys: [] });

    const keys = await db.apiKey.findMany({
      where: { orgId: membership.orgId },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({
      keys: keys.map((k) => ({
        id: k.id,
        name: k.name,
        prefix: k.prefix,
        mode: k.mode,
        revokedAt: k.revokedAt,
        createdAt: k.createdAt,
      })),
    });
  } catch (err: any) {
    return NextResponse.json({ error: "Failed to fetch keys" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const membership = await db.membership.findFirst({
      where: { userId: user.id },
    });

    if (!membership || membership.role === OrgRole.MEMBER) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const { name, mode } = await req.json();
    const keyMode = mode === "LIVE" ? ApiKeyMode.LIVE : ApiKeyMode.SANDBOX;
    const prefix = keyMode === "LIVE" ? "cp_live_" : "cp_test_";

    const secretPart = generateToken(24);
    const rawKey = `${prefix}${secretPart}`;
    const keyHash = sha256(rawKey);

    const apiKey = await db.apiKey.create({
      data: {
        orgId: membership.orgId,
        name: name || "API Key",
        prefix,
        keyHash,
        mode: keyMode,
      },
    });

    return NextResponse.json({
      success: true,
      apiKey: rawKey,
      name: apiKey.name,
      mode: apiKey.mode,
      note: "Save this key now. It will never be displayed again.",
    });
  } catch (err: any) {
    return NextResponse.json({ error: "Failed to create API key" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { keyId } = await req.json();
    await db.apiKey.update({
      where: { id: keyId },
      data: { revokedAt: new Date() },
    });

    return NextResponse.json({ success: true, message: "API key revoked" });
  } catch (err: any) {
    return NextResponse.json({ error: "Failed to revoke key" }, { status: 500 });
  }
}

