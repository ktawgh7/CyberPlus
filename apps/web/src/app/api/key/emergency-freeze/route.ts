import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { removeCommitmentFromTier } from "@/lib/semaphore";
import { logAuditEvent } from "@/lib/audit";
import { KeyStatus, TokenType } from "@prisma/client";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const token = searchParams.get("token");

    if (!token) {
      return new NextResponse(
        `<html><body style="font-family:sans-serif;padding:40px;text-align:center;">
          <h2 style="color:#dc2626;">Missing Emergency Freeze Token</h2>
          <p>Please check the link provided in your security notification email.</p>
        </body></html>`,
        { status: 400, headers: { "Content-Type": "text/html" } }
      );
    }

    const emailToken = await db.emailToken.findUnique({
      where: { token },
      include: {
        user: {
          include: {
            profile: {
              include: {
                identityKeys: {
                  where: { status: KeyStatus.ACTIVE },
                },
              },
            },
          },
        },
      },
    });

    if (!emailToken || emailToken.type !== TokenType.EMERGENCY_FREEZE || emailToken.usedAt) {
      return new NextResponse(
        `<html><body style="font-family:sans-serif;padding:40px;text-align:center;">
          <h2 style="color:#dc2626;">Invalid or Expired Freeze Link</h2>
          <p>This emergency freeze link has already been used or has expired.</p>
          <a href="/login">Go to Login</a>
        </body></html>`,
        { status: 400, headers: { "Content-Type": "text/html" } }
      );
    }

    const user = emailToken.user;
    const profile = user.profile;

    if (profile && profile.identityKeys.length > 0) {
      for (const activeKey of profile.identityKeys) {
        await removeCommitmentFromTier(activeKey.commitment, activeKey.tier);
        await db.identityKey.update({
          where: { id: activeKey.id },
          data: { status: KeyStatus.FROZEN },
        });
        await db.keyEvent.create({
          data: {
            keyId: activeKey.id,
            eventType: "EMERGENCY_FROZEN",
            detail: "Emergency single-use link triggered by email recipient without login.",
          },
        });
      }

      await db.profile.update({
        where: { id: profile.id },
        data: { status: KeyStatus.FROZEN },
      });
    }

    // Mark token used
    await db.emailToken.update({
      where: { id: emailToken.id },
      data: { usedAt: new Date() },
    });

    await logAuditEvent({
      userId: user.id,
      action: "EMERGENCY_FREEZE_LINK_EXECUTED",
      detail: { email: user.email, note: "Logged-out emergency freeze executed" },
    });

    return new NextResponse(
      `<html>
        <head><title>Identity Key Frozen | CyberPlus</title></head>
        <body style="font-family:sans-serif;background:#020617;color:#f8fafc;padding:60px 20px;text-align:center;">
          <div style="max-width:540px;margin:0 auto;background:#0f172a;border:1px solid #dc2626;border-radius:16px;padding:36px;">
            <div style="font-size:48px;margin-bottom:16px;">🛑</div>
            <h1 style="color:#ef4444;margin:0 0 12px 0;">IDENTITY KEY FROZEN</h1>
            <p style="color:#94a3b8;line-height:1.6;font-size:14px;">
              Your CyberPlus identity key for <strong>${user.email}</strong> was immediately frozen.
            </p>
            <p style="color:#cbd5e1;line-height:1.6;font-size:13px;background:#1e293b;padding:12px;border-radius:8px;margin:20px 0;">
              All current and future verification attempts across all integrated apps are now blocked instantly.
            </p>
            <a href="/login" style="display:inline-block;background:#0d9488;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:bold;margin-top:12px;">
              Sign in to manage profile or unfreeze
            </a>
          </div>
        </body>
      </html>`,
      { status: 200, headers: { "Content-Type": "text/html" } }
    );
  } catch (err: any) {
    console.error("Emergency freeze error:", err);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

