import { describe, it, expect } from "vitest";
import { createCancelableIdentity, hexToBytes } from "../src/lib/client-key";

describe("Cancelable Key Cryptographic Design", () => {
  it("derives the exact same commitment given the same PRF input and salt (determinism)", async () => {
    const fixedIkm = new Uint8Array(32).fill(7);
    const fixedSalt = new Uint8Array(32).fill(42);

    const key1 = await createCancelableIdentity({
      prfBytes: fixedIkm,
      saltBytes: fixedSalt,
    });

    const key2 = await createCancelableIdentity({
      prfBytes: fixedIkm,
      saltBytes: fixedSalt,
    });

    expect(key1.commitment).toBe(key2.commitment);
    expect(key1.derivedSecretHex).toBe(key2.derivedSecretHex);
  });

  it("produces completely unrelated commitments when the salt is rotated (cancelability)", async () => {
    const fixedIkm = new Uint8Array(32).fill(7); // Same biometric unlock
    const saltA = new Uint8Array(32).fill(1);
    const saltB = new Uint8Array(32).fill(2); // Rotated salt

    const keyA = await createCancelableIdentity({
      prfBytes: fixedIkm,
      saltBytes: saltA,
    });

    const keyB = await createCancelableIdentity({
      prfBytes: fixedIkm,
      saltBytes: saltB,
    });

    // Commitments must be completely different
    expect(keyA.commitment).not.toBe(keyB.commitment);
    expect(keyA.derivedSecretHex).not.toBe(keyB.derivedSecretHex);
    expect(keyA.saltHex).not.toBe(keyB.saltHex);
  });

  it("handles software PIN fallback with 100k iteration KDF", async () => {
    const salt = new Uint8Array(32).fill(99);
    const pin = "123456";

    const keyA = await createCancelableIdentity({
      pin,
      saltBytes: salt,
    });

    const keyB = await createCancelableIdentity({
      pin,
      saltBytes: salt,
    });

    expect(keyA.isSoftware).toBe(true);
    expect(keyA.commitment).toBe(keyB.commitment);

    // Wrong pin produces different commitment
    const keyWrongPin = await createCancelableIdentity({
      pin: "654321",
      saltBytes: salt,
    });
    expect(keyA.commitment).not.toBe(keyWrongPin.commitment);
  });
});

