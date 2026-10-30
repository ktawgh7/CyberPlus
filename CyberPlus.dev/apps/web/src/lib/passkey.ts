import {
  generateRegistrationOptions,
  verifyRegistrationResponse,
  generateAuthenticationOptions,
  verifyAuthenticationResponse,
  type VerifiedRegistrationResponse,
  type VerifiedAuthenticationResponse,
} from "@simplewebauthn/server";
import { db } from "./db";

const rpName = "CyberPlus";
// Hostname for local dev and production
const rpID = process.env.NODE_ENV === "production" ? "cyberplus.id" : "localhost";
const origin = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

// In-memory challenge store for WebAuthn ceremony
const challengeStore = new Map<string, { challenge: string; expiresAt: number }>();

export function saveChallenge(userId: string, challenge: string) {
  challengeStore.set(userId, {
    challenge,
    expiresAt: Date.now() + 5 * 60 * 1000, // 5 min
  });
}

export function getAndClearChallenge(userId: string): string | null {
  const item = challengeStore.get(userId);
  if (!item || item.expiresAt < Date.now()) {
    challengeStore.delete(userId);
    return null;
  }
  challengeStore.delete(userId);
  return item.challenge;
}

/**
 * Generate registration options with PRF extension enabled and userVerification required.
 */
export async function getPasskeyRegistrationOptions(user: { id: string; email: string; name: string }) {
  const existingPasskeys = await db.passkey.findMany({
    where: { userId: user.id },
  });

  const options = await generateRegistrationOptions({
    rpName,
    rpID,
    userID: new TextEncoder().encode(user.id),
    userName: user.email,
    userDisplayName: user.name,
    attestationType: "none",
    excludeCredentials: existingPasskeys.map((p) => ({
      id: p.credentialId,
      transports: p.transports ? JSON.parse(p.transports) : undefined,
    })),
    authenticatorSelection: {
      residentKey: "preferred",
      userVerification: "required", // Hardware biometric or secure device PIN
      authenticatorAttachment: "platform", // Phone or laptop hardware platform authenticator
    },
    extensions: {
      // PRF extension enabled for cancelable key derivation
      prf: {},
    } as any,
  });

  saveChallenge(user.id, options.challenge);
  return options;
}

/**
 * Verify WebAuthn registration response.
 */
export async function verifyPasskeyRegistration(
  userId: string,
  response: any
): Promise<VerifiedRegistrationResponse> {
  const expectedChallenge = getAndClearChallenge(userId);
  if (!expectedChallenge) {
    throw new Error("Registration challenge expired or not found");
  }

  const verification = await verifyRegistrationResponse({
    response,
    expectedChallenge,
    expectedOrigin: origin,
    expectedRPID: rpID,
    requireUserVerification: true,
  });

  return verification;
}

/**
 * Generate authentication options for passkey login or step-up.
 */
export async function getPasskeyAuthenticationOptions(userId?: string) {
  let allowCredentials: any[] | undefined = undefined;

  if (userId) {
    const userPasskeys = await db.passkey.findMany({ where: { userId } });
    allowCredentials = userPasskeys.map((p) => ({
      id: p.credentialId,
      transports: p.transports ? JSON.parse(p.transports) : undefined,
    }));
  }

  const options = await generateAuthenticationOptions({
    rpID,
    userVerification: "required",
    allowCredentials,
  });

  saveChallenge(userId || "anonymous_auth", options.challenge);
  return options;
}

/**
 * Verify authentication response.
 */
export async function verifyPasskeyAuthentication(
  response: any,
  credential: { credentialId: string; publicKey: Uint8Array; counter: bigint }
): Promise<VerifiedAuthenticationResponse> {
  const expectedChallenge = getAndClearChallenge(response.id || "anonymous_auth");
  if (!expectedChallenge) {
    throw new Error("Authentication challenge expired or not found");
  }

  const verification = await verifyAuthenticationResponse({
    response,
    expectedChallenge,
    expectedOrigin: origin,
    expectedRPID: rpID,
    credential: {
      id: credential.credentialId,
      publicKey: new Uint8Array(credential.publicKey) as any,
      counter: Number(credential.counter),
    },
    requireUserVerification: true,
  });

  return verification;
}

