import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { validateApiKey } from "@/lib/api-auth";
import { getLatestGroupRoot } from "@/lib/semaphore";
import { signResultToken } from "@/lib/jwt";
import { dispatchWebhook } from "@/lib/webhooks";
import { logAuditEvent } from "@/lib/audit";
import { checkRateLimit } from "@/lib/rate-limit";
import { KeyStatus } from "@prisma/client";

const schema = z.object({
  challengeId: z.string().min(1),
  proof: z.any(), // Semaphore ZK proof or JSON proof object
});

export async function POST(req: NextRequest) {
  const requestId = "req_" + Math.random().toString(36).substring(2, 10);
  try {
    const ip = req.headers.get("x-forwarded-for") || "127.0.0.1";
    const userAgent = req.headers.get("user-agent") || "unknown";
    const rl = checkRateLimit(`verify_${ip}`, { limit: 120, windowMs: 60000 });
    if (!rl.allowed) {
      return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429 });
    }

    const auth = await validateApiKey(req);
    const body = await req.json().catch(() => ({}));
    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid verification payload" }, { status: 400 });
    }

    const { challengeId, proof } = parsed.data;

    // Fetch challenge
    const challenge = await db.challenge.findUnique({
      where: { id: challengeId },
      include: { apiKey: { include: { org: true } } },
    });

    if (!challenge) {
      return NextResponse.json({
        verified: false,
        reason: "Challenge not found or invalid",
        requestId,
      }, { status: 404 });
    }

    if (challenge.usedAt) {
      return NextResponse.json({
        verified: false,
        reason: "Challenge has already been consumed (replay attack prevented)",
        requestId,
      }, { status: 400 });
    }

    if (challenge.expiresAt < new Date()) {
      return NextResponse.json({
        verified: false,
        reason: "Verification challenge has expired",
        requestId,
      }, { status: 400 });
    }

    // Inspect proof payload
    let nullifier = proof?.nullifier || ("0x" + Math.random().toString(36).substring(2, 18));
    const submittedRoot = proof?.merkleTreeRoot;

    // Check if the proof was generated using a FROZEN or REVOKED key
    if (proof?.commitment) {
      const existingKey = await db.identityKey.findUnique({
        where: { commitment: proof.commitment },
      });

      if (existingKey && (existingKey.status === KeyStatus.FROZEN || existingKey.status === KeyStatus.REVOKED)) {
        // Log attack attempt with coarse region
        await db.attackAttempt.create({
          data: {
            keyId: existingKey.id,
            appId: challenge.appScope,
            region: ip.includes("127.") ? "Local Dev (Subnet)" : "US-East (Virginia)",
            userAgent,
            attemptType: existingKey.status === KeyStatus.FROZEN ? "FROZEN_KEY_USE" : "REVOKED_KEY_USE",
          },
        });

        await logAuditEvent({
          userId: null,
          action: "ATTACK_ATTEMPT_LOGGED",
          detail: {
            status: existingKey.status,
            appId: challenge.appScope,
            attemptType: "BLOCKED_FROZEN_KEY",
          },
        });

        if (challenge.apiKey?.orgId) {
          await dispatchWebhook(challenge.apiKey.orgId, "verification.failed", {
            challengeId,
            reason: `Attempt to verify with ${existingKey.status} key. Blocked.`,
          });
        }

        return NextResponse.json({
          verified: false,
          tier: challenge.requiredTier,
          nullifier: null,
          reason: `Identity key is currently ${existingKey.status}. Verification rejected.`,
          requestId,
        }, { status: 403 });
      }
    }

    // Check tier root
    const tier = challenge.requiredTier;
    const currentRootInfo = await getLatestGroupRoot(tier);

    // Verify Merkle root matches active or recent root
    // In prototype, if proof has merkleTreeRoot, ensure it matches current root
    if (submittedRoot && submittedRoot !== currentRootInfo.root) {
      // Allow if valid leaf exists in tier
      const rootExists = await db.groupRoot.findFirst({
        where: {
          groupName: `verified-humans-tier${tier}`,
          root: submittedRoot,
        },
      });

      if (!rootExists) {
        return NextResponse.json({
          verified: false,
          reason: `Proof evaluated against stale or unverified Merkle root for Tier ${tier}`,
          requestId,
        }, { status: 400 });
      }
    }

    // Check nullifier freshness for appScope
    const existingNullifier = await db.nullifier.findUnique({
      where: { nullifierHash: nullifier },
    });

    if (existingNullifier && existingNullifier.appScope === challenge.appScope) {
      // Nullifier already recorded for this appScope
      // Note: for feed apps, this means this human already has a profile;
      // for 1-time actions (like product reviews), it signals duplication.
    } else {
      await db.nullifier.create({
        data: {
          nullifierHash: nullifier,
          appScope: challenge.appScope,
          tier,
        },
      });
    }

    // Sign result token (JWT signed by CyberPlus RS256 JWKS)
    const signedToken = await signResultToken({
      sub: nullifier,
      scope: challenge.appScope,
      tier,
      verified: true,
      challengeId: challenge.id,
    });

    // Mark challenge consumed
    await db.challenge.update({
      where: { id: challenge.id },
      data: { usedAt: new Date() },
    });

    // Record verification event
    await db.verificationEvent.create({
      data: {
        challengeId: challenge.id,
        verified: true,
        tier,
        nullifierHash: nullifier,
        signedToken,
      },
    });

    // Increment usage record if authenticated by an organization
    const orgId = challenge.apiKey?.orgId || auth?.org.id;
    if (orgId) {
      const today = new Date().toISOString().split("T")[0];
      await db.usageRecord.upsert({
        where: { orgId_date: { orgId, date: today } },
        create: {
          orgId,
          date: today,
          verificationsCount: 1,
          sandboxCount: auth?.mode === "SANDBOX" ? 1 : 0,
        },
        update: {
          verificationsCount: { increment: 1 },
          sandboxCount: auth?.mode === "SANDBOX" ? { increment: 1 } : undefined,
        },
      });

      await dispatchWebhook(orgId, "verification.succeeded", {
        challengeId,
        tier,
        nullifier,
        appScope: challenge.appScope,
      });
    }

    await logAuditEvent({
      userId: null,
      action: "VERIFICATION_SUCCEEDED",
      detail: { challengeId, tier, appScope: challenge.appScope, nullifierMasked: nullifier.slice(0, 10) + "..." },
    });

    return NextResponse.json({
      verified: true,
      tier,
      nullifier,
      signedToken,
      requestId,
    });
  } catch (err: any) {
    console.error("Verification endpoint error:", err);
    return NextResponse.json({
      verified: false,
      reason: err.message || "Internal verification engine failure",
      requestId,
    }, { status: 500 });
  }
}

