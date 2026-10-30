import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { hashPassword } from "@/lib/crypto";
import { logAuditEvent } from "@/lib/audit";
import { OrgRole, AccountType } from "@prisma/client";

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const membership = await db.membership.findFirst({
      where: { userId: user.id },
      include: {
        org: {
          include: {
            memberships: {
              include: {
                user: {
                  include: {
                    profile: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!membership) {
      return NextResponse.json({ members: [] });
    }

    const members = membership.org.memberships.map((m) => ({
      id: m.id,
      userId: m.userId,
      name: m.user.name,
      email: m.user.email,
      role: m.role,
      tier: m.user.profile?.tier || 1,
      status: m.user.profile?.status || "NOT_ENROLLED",
      createdAt: m.createdAt,
    }));

    return NextResponse.json({ members, orgName: membership.org.name, plan: membership.org.plan });
  } catch (err: any) {
    return NextResponse.json({ error: "Failed to fetch members" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const membership = await db.membership.findFirst({
      where: { userId: user.id },
      include: { org: true },
    });

    if (!membership || (membership.role !== OrgRole.OWNER && membership.role !== OrgRole.ADMIN)) {
      return NextResponse.json({ error: "Only Org Owner or Admin can invite members" }, { status: 403 });
    }

    const { email, name, role } = await req.json();
    if (!email || !name) {
      return NextResponse.json({ error: "Name and email are required" }, { status: 400 });
    }

    const lowerEmail = email.toLowerCase().trim();
    let targetUser = await db.user.findUnique({ where: { email: lowerEmail } });

    if (!targetUser) {
      const defaultPassword = await hashPassword("WelcomeCyberPlus2026!");
      targetUser = await db.user.create({
        data: {
          name,
          email: lowerEmail,
          passwordHash: defaultPassword,
          accountType: AccountType.BUSINESS,
          emailVerified: true,
          profile: {
            create: {
              tier: 1,
              status: "NOT_ENROLLED",
            },
          },
        },
      });
    }

    // Add membership
    const newMembership = await db.membership.upsert({
      where: { orgId_userId: { orgId: membership.orgId, userId: targetUser.id } },
      create: {
        orgId: membership.orgId,
        userId: targetUser.id,
        role: role || OrgRole.MEMBER,
      },
      update: {
        role: role || OrgRole.MEMBER,
      },
    });

    await logAuditEvent({
      userId: user.id,
      action: "BUSINESS_MEMBER_INVITED",
      detail: { orgId: membership.orgId, invitedEmail: lowerEmail, role: role || OrgRole.MEMBER },
    });

    return NextResponse.json({ success: true, memberId: newMembership.id });
  } catch (err: any) {
    console.error("Invite error:", err);
    return NextResponse.json({ error: "Failed to invite member" }, { status: 500 });
  }
}

