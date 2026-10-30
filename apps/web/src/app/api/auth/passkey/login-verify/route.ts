import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { createSession } from "@/lib/auth";
import { verifyPasskeyAuthentication } from "@/lib/passkey";
import { logAuditEvent } from "@/lib/audit";

export async function POST(req: NextRequest) {
  try {
    const { response } = await req.json();
    if (!response || !response.id) {
      return NextResponse.json({ error: "Missing authentication payload" }, { status: 400 });
    }

    const passkey = await db.passkey.findUnique({
      where: { credentialId: response.id },
      include: { user: true },
    });

    if (!passkey) {
      return NextResponse.json({ error: "Unrecognized passkey credential" }, { status: 401 });
    }

    const verification = await verifyPasskeyAuthentication(response, {
      credentialId: passkey.credentialId,
      publicKey: passkey.publicKey,
      counter: passkey.counter,
    });

    if (!verification.verified) {
      return NextResponse.json({ error: "Passkey biometric assertion invalid" }, { status: 401 });
    }

    // Update counter and lastUsed
    await db.passkey.update({
      where: { id: passkey.id },
      data: {
        counter: BigInt(verification.authenticationInfo.newCounter),
        lastUsedAt: new Date(),
      },
    });

    await createSession(passkey.userId);

    await logAuditEvent({
      userId: passkey.userId,
      action: "LOGIN_PASSKEY_SUCCESS",
      detail: { credentialId: passkey.credentialId },
    });

    return NextResponse.json({
      success: true,
      verified: true,
      user: {
        id: passkey.user.id,
        name: passkey.user.name,
        email: passkey.user.email,
        role: passkey.user.role,
      },
    });
  } catch (err: any) {
    console.error("Passkey login verify error:", err);
    return NextResponse.json({ error: err.message || "Passkey login failed" }, { status: 500 });
  }
}

