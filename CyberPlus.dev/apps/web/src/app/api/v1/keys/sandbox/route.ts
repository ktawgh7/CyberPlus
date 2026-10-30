import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { generateToken, sha256 } from "@/lib/crypto";
import { ApiKeyMode } from "@prisma/client";

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    let orgId: string | null = null;

    if (user) {
      // Find or create an organization for the user
      const membership = await db.membership.findFirst({
        where: { userId: user.id },
        include: { org: true },
      });

      if (membership) {
        orgId = membership.orgId;
      } else {
        const org = await db.organization.create({
          data: {
            name: `${user.name}'s Sandbox Workspace`,
            slug: `user-${user.id.slice(0, 8)}`,
            memberships: {
              create: {
                userId: user.id,
                role: "OWNER",
              },
            },
          },
        });
        orgId = org.id;
      }
    } else {
      // Fallback: connect to demo organization
      const demoOrg = await db.organization.findFirst();
      orgId = demoOrg?.id || null;
    }

    if (!orgId) {
      return NextResponse.json({ error: "No organization found" }, { status: 400 });
    }

    const rawKey = `cp_test_${generateToken(24)}`;
    const keyHash = sha256(rawKey);

    await db.apiKey.create({
      data: {
        orgId,
        name: "Sandbox Key",
        prefix: "cp_test_",
        keyHash,
        mode: ApiKeyMode.SANDBOX,
      },
    });

    return NextResponse.json({
      apiKey: rawKey,
      mode: "SANDBOX",
      note: "Keep this key secret. It is only shown once.",
    });
  } catch (err: any) {
    console.error("Sandbox key error:", err);
    return NextResponse.json({ error: "Failed to generate sandbox key" }, { status: 500 });
  }
}

