import { Identity } from "@semaphore-protocol/identity";

export interface DerivedIdentityKey {
  commitment: string;
  saltHex: string;
  isSoftware: boolean;
  derivedSecretHex: string;
}

export interface RecoveryKit {
  version: string;
  createdAt: string;
  saltHex: string;
  isSoftware: boolean;
  commitment: string;
  notes: string;
}

/**
 * Generate a random high-entropy device-side salt (32 bytes = 256 bits).
 */
export function generateDeviceSalt(): Uint8Array {
  const salt = new Uint8Array(32);
  crypto.getRandomValues(salt);
  return salt;
}

export function bytesToHex(bytes: Uint8Array): string {
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export function hexToBytes(hex: string): Uint8Array {
  const clean = hex.startsWith("0x") ? hex.slice(2) : hex;
  const bytes = new Uint8Array(clean.length / 2);
  for (let i = 0; i < clean.length; i += 2) {
    bytes[i / 2] = parseInt(clean.substring(i, i + 2), 16);
  }
  return bytes;
}

/**
 * Derive identity secret via HKDF-SHA256 from input bytes (PRF output or PIN) and salt.
 * Formula: secret = HKDF-SHA256(PRF, salt, info="cyberplus:identity:v1")
 */
export async function deriveKeyWithHKDF(
  ikmBytes: Uint8Array,
  saltBytes: Uint8Array,
  infoString = "cyberplus:identity:v1"
): Promise<Uint8Array> {
  const baseKey = await crypto.subtle.importKey(
    "raw",
    ikmBytes as any,
    "HKDF",
    false,
    ["deriveBits"]
  );

  const derivedBits = await crypto.subtle.deriveBits(
    {
      name: "HKDF",
      hash: "SHA-256",
      salt: saltBytes as any,
      info: new TextEncoder().encode(infoString),
    },
    baseKey,
    256 // 32 bytes
  );

  return new Uint8Array(derivedBits);
}

/**
 * Fallback key derivation from PIN using PBKDF2 (100,000 iterations, SHA-256).
 */
export async function deriveKeyFromPIN(
  pin: string,
  saltBytes: Uint8Array
): Promise<Uint8Array> {
  const pinBytes = new TextEncoder().encode(pin);
  const baseKey = await crypto.subtle.importKey(
    "raw",
    pinBytes as any,
    "PBKDF2",
    false,
    ["deriveBits"]
  );

  const pbkdf2Bits = await crypto.subtle.deriveBits(
    {
      name: "PBKDF2",
      salt: saltBytes as any,
      iterations: 100000,
      hash: "SHA-256",
    },
    baseKey,
    256
  );

  // Run through HKDF info pipeline for standard consistency
  return deriveKeyWithHKDF(new Uint8Array(pbkdf2Bits), saltBytes);
}

/**
 * Create a full Semaphore Identity and public commitment from PRF bytes or PIN.
 */
export async function createCancelableIdentity(options: {
  prfBytes?: Uint8Array;
  pin?: string;
  saltBytes?: Uint8Array;
}): Promise<DerivedIdentityKey> {
  const salt = options.saltBytes || generateDeviceSalt();
  let derivedSecretBytes: Uint8Array;
  let isSoftware = false;

  if (options.prfBytes) {
    derivedSecretBytes = await deriveKeyWithHKDF(options.prfBytes, salt);
  } else if (options.pin) {
    derivedSecretBytes = await deriveKeyFromPIN(options.pin, salt);
    isSoftware = true;
  } else {
    // Generate fresh high-entropy random key if hardware PRF simulation
    const randomEntropy = new Uint8Array(32);
    crypto.getRandomValues(randomEntropy);
    derivedSecretBytes = await deriveKeyWithHKDF(randomEntropy, salt);
  }

  const derivedSecretHex = bytesToHex(derivedSecretBytes);
  // Construct real Semaphore Identity
  const identity = new Identity(derivedSecretHex);
  const commitment = identity.commitment.toString();

  return {
    commitment,
    saltHex: bytesToHex(salt),
    isSoftware,
    derivedSecretHex,
  };
}

/**
 * Construct recovery kit JSON payload for safe client-side download.
 */
export function buildRecoveryKit(identityKey: DerivedIdentityKey): RecoveryKit {
  return {
    version: "cyberplus:recovery:v1",
    createdAt: new Date().toISOString(),
    saltHex: identityKey.saltHex,
    isSoftware: identityKey.isSoftware,
    commitment: identityKey.commitment,
    notes: "Store this recovery kit securely. It contains your device salt backup. It NEVER contains raw biometrics.",
  };
}

