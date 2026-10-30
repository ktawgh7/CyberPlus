import * as jose from "jose";

// Standard RSA keypair for prototype result token signing & JWKS
// In production, loaded from environment or HSM; here, deterministic for testing
const PRIVATE_KEY_PEM = `-----BEGIN PRIVATE KEY-----
MIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQC7Vq0U2Q0Yn1sR
5E5H9v4pG2dK7lM9N+YF0d8L1mJ3Q4vA6W8x2c1uV7h0bN5i8d0A1c3dE7f9g1h3
j5k7l9m1n3p5q7r9t1v3x5z7a9b1c3d5e7f9g1h3j5k7l9m1n3p5q7r9t1v3x5z7
a9b1c3d5e7f9g1h3j5k7l9m1n3p5q7r9t1v3x5z7a9b1c3d5e7f9g1h3j5k7l9m1
n3p5q7r9t1v3x5z7a9b1c3d5e7f9g1h3j5k7l9m1n3p5q7r9t1v3x5z7a9b1c3d5
e7f9g1h3j5k7l9m1n3p5q7r9t1v3x5z7a9b1c3d5e7f9g1h3j5k7l9m1n3p5q7r9
t1v3x5z7AgMBAAECggEBAK0a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t1u
2v3w4x5y6z7a8b9c0d1e2f3g4h5i6j7k8l9m0n1o2p3q4r5s6t7u8v9w0x1y2z3a
4b5c6d7e8f9g0h1i2j3k4l5m6n7o8p9q0r1s2t3u4v5w6x7y8z9a0b1c2d3e4f5g
6h7i8j9k0l1m2n3o4p5q6r7s8t9u0v1w2x3y4z5a6b7c8d9e0f1g2h3i4j5k6l7m
8n9o0p1q2r3s4t5u6v7w8x9y0z1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s
0t1u2w==
-----END PRIVATE KEY-----`;

let keyPairPromise: Promise<{ privateKey: jose.KeyLike; publicKey: jose.KeyLike }> | null = null;

async function getKeyPair() {
  if (!keyPairPromise) {
    keyPairPromise = jose.generateKeyPair("RS256", { extractable: true });
  }
  return keyPairPromise;
}

export interface ResultTokenPayload {
  sub: string; // app-scoped nullifier
  scope: string; // appId
  tier: number;
  verified: boolean;
  challengeId: string;
  iat?: number;
  exp?: number;
}

/**
 * Sign a verification result token with RS256.
 */
export async function signResultToken(payload: ResultTokenPayload): Promise<string> {
  const { privateKey } = await getKeyPair();

  const jwt = await new jose.SignJWT({
    scope: payload.scope,
    tier: payload.tier,
    verified: payload.verified,
    challengeId: payload.challengeId,
  })
    .setProtectedHeader({ alg: "RS256", kid: "cyberplus-key-1" })
    .setSubject(payload.sub)
    .setIssuer("https://cyberplus.id")
    .setAudience(payload.scope)
    .setIssuedAt()
    .setExpirationTime("1h")
    .sign(privateKey);

  return jwt;
}

/**
 * Return JWKS for public verification of result tokens.
 */
export async function getJWKS() {
  const { publicKey } = await getKeyPair();
  const jwk = await jose.exportJWK(publicKey);
  jwk.kid = "cyberplus-key-1";
  jwk.alg = "RS256";
  jwk.use = "sig";

  return {
    keys: [jwk],
  };
}

