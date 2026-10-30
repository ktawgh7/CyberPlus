import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { verifyPasskeyRegistration } from "@/lib/passkey";
import { db } from "@/lib/db";
import { logAuditEvent } from "@/lib/audit";

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }

    const body = await req.json();
    const verification = await verifyPasskeyRegistration(user.id, body.response);

    if (!verification.verified || !verification.registrationInfo) {
      return NextResponse.json({ error: "Passkey verification failed" }, { status: 400 });
    }

    const { credential } = verification.registrationInfo;

    // Check if PRF extension was supported/returned in client extension results
    const prfSupported = !!(body.response?.clientExtensionResults?.prf?.enabled);

    await db.passkey.create({
      data: {
        userId: user.id,
        credentialId: credential.id,
        publicKey: Buffer.from(credential.publicKey),
        counter: BigInt(credential.counter),
        transports: credential.transports ? JSON.stringify(credential.transports) : null,
        prfSupported,
      },
    });

    await logAuditEvent({
      userId: user.id,
      action: "PASSKEY_REGISTERED",
      detail: { credentialId: credential.id, prfSupported },
    });

    return NextResponse.json({
      success: true,
      verified: true,
      prfSupported,
    });
  } catch (err: any) {
    console.error("Passkey register verify error:", err);
    return NextResponse.json({ error: err.message || "Failed to verify passkey" }, { status: 500 });
  }
}

