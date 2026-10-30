import { hash, verify } from "@node-rs/argon2";
import crypto from "crypto";

// Argon2 password hashing options
const ARGON2_OPTIONS = {
  memoryCost: 19456, // 19 MiB
  timeCost: 2,
  outputLen: 32,
  parallelism: 1,
};

/**
 * Hash a plain password using Argon2id.
 */
export async function hashPassword(password: string): Promise<string> {
  return hash(password, ARGON2_OPTIONS);
}

/**
 * Verify a plain password against an Argon2 hash.
 */
export async function verifyPassword(password: string, hashStr: string): Promise<boolean> {
  try {
    return await verify(hashStr, password, ARGON2_OPTIONS);
  } catch {
    return false;
  }
}

/**
 * Generate a secure random token (e.g. for email verify or password reset).
 */
export function generateToken(bytes = 32): string {
  return crypto.randomBytes(bytes).toString("hex");
}

/**
 * Compute SHA-256 hash of a string.
 */
export function sha256(data: string): string {
  return crypto.createHash("sha256").update(data).digest("hex");
}

/**
 * Compute HMAC-SHA256 signature.
 */
export function hmacSha256(data: string, secret: string): string {
  return crypto.createHmac("sha256", secret).update(data).digest("hex");
}

