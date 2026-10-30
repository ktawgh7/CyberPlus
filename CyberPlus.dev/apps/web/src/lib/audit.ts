import { db } from "./db";
import { sha256 } from "./crypto";

export interface AuditVerificationResult {
  valid: boolean;
  totalEntries: number;
  brokenIndex?: number;
  brokenEntryId?: string;
  expectedHash?: string;
  computedHash?: string;
  verifiedAt: Date;
}

/**
 * Append an entry to the tamper-evident hash-chained audit log.
 * Computes hash = SHA-256(content + prevHash).
 */
export async function logAuditEvent(params: {
  userId?: string | null;
  action: string;
  detail: Record<string, unknown> | string;
}) {
  const detailStr = typeof params.detail === "string" ? params.detail : JSON.stringify(params.detail);

  // Fetch the latest audit log entry to get prevHash
  const latest = await db.auditLog.findFirst({
    orderBy: { timestamp: "desc" },
  });

  const prevHash = latest ? latest.hash : "0000000000000000000000000000000000000000000000000000000000000000";
  const contentToHash = `${params.userId || "anonymous"}|${params.action}|${detailStr}|${prevHash}`;
  const hash = sha256(contentToHash);

  return db.auditLog.create({
    data: {
      userId: params.userId || null,
      action: params.action,
      detail: detailStr,
      prevHash,
      hash,
    },
  });
}

/**
 * Verify the integrity of the entire audit log hash chain.
 * Recomputes SHA-256 for every link from genesis to head.
 */
export async function verifyAuditChain(): Promise<AuditVerificationResult> {
  const entries = await db.auditLog.findMany({
    orderBy: { timestamp: "asc" },
  });

  if (entries.length === 0) {
    return {
      valid: true,
      totalEntries: 0,
      verifiedAt: new Date(),
    };
  }

  let expectedPrevHash = "0000000000000000000000000000000000000000000000000000000000000000";

  for (let i = 0; i < entries.length; i++) {
    const entry = entries[i];

    // Check that entry's prevHash matches what we expect
    if (entry.prevHash !== expectedPrevHash) {
      return {
        valid: false,
        totalEntries: entries.length,
        brokenIndex: i,
        brokenEntryId: entry.id,
        expectedHash: expectedPrevHash,
        computedHash: entry.prevHash,
        verifiedAt: new Date(),
      };
    }

    // Recompute current entry hash
    const contentToHash = `${entry.userId || "anonymous"}|${entry.action}|${entry.detail}|${entry.prevHash}`;
    const calculated = sha256(contentToHash);

    if (calculated !== entry.hash) {
      return {
        valid: false,
        totalEntries: entries.length,
        brokenIndex: i,
        brokenEntryId: entry.id,
        expectedHash: entry.hash,
        computedHash: calculated,
        verifiedAt: new Date(),
      };
    }

    expectedPrevHash = entry.hash;
  }

  return {
    valid: true,
    totalEntries: entries.length,
    verifiedAt: new Date(),
  };
}

