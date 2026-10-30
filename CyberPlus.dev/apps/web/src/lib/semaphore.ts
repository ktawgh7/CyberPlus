import { Group } from "@semaphore-protocol/group";
import { Identity } from "@semaphore-protocol/identity";
import { db } from "./db";
import { sha256 } from "./crypto";

export interface ZKProofPayload {
  merkleTreeRoot: string;
  nullifier: string;
  message: string;
  scope: string;
  points?: string[];
  proof?: any;
}

/**
 * Get or reconstruct a Semaphore Group for a given tier.
 */
export async function getGroupForTier(tier: number): Promise<Group> {
  const groupName = `verified-humans-tier${tier}`;
  const leaves = await db.groupLeaf.findMany({
    where: { groupName },
    orderBy: { leafIndex: "asc" },
  });

  const commitments = leaves.map((l) => l.commitment);
  const group = new Group(commitments);
  return group;
}

/**
 * Add a new identity commitment to a tier's group and update persisted root.
 */
export async function addCommitmentToTier(commitment: string, tier: number): Promise<string> {
  const groupName = `verified-humans-tier${tier}`;

  // Check if already in group
  const existing = await db.groupLeaf.findUnique({
    where: {
      groupName_commitment: {
        groupName,
        commitment,
      },
    },
  });

  if (existing) {
    const rootRec = await db.groupRoot.findFirst({
      where: { groupName },
      orderBy: { timestamp: "desc" },
    });
    return rootRec?.root || "0";
  }

  // Get current leaf count for index
  const count = await db.groupLeaf.count({ where: { groupName } });

  // Add to DB
  await db.groupLeaf.create({
    data: {
      groupName,
      commitment,
      leafIndex: count,
    },
  });

  // Rebuild group to compute exact cryptographic Merkle root
  const group = await getGroupForTier(tier);
  const rootStr = group.root.toString();

  // Save new root
  await db.groupRoot.create({
    data: {
      groupName,
      root: rootStr,
      depth: group.depth,
      size: group.size,
    },
  });

  return rootStr;
}

/**
 * Remove (revoke) an identity commitment from a tier group.
 */
export async function removeCommitmentFromTier(commitment: string, tier: number): Promise<string> {
  const groupName = `verified-humans-tier${tier}`;

  const leaf = await db.groupLeaf.findUnique({
    where: {
      groupName_commitment: {
        groupName,
        commitment,
      },
    },
  });

  if (!leaf) {
    const rootRec = await db.groupRoot.findFirst({
      where: { groupName },
      orderBy: { timestamp: "desc" },
    });
    return rootRec?.root || "0";
  }

  await db.groupLeaf.delete({
    where: { id: leaf.id },
  });

  // Re-index remaining leaves
  const remaining = await db.groupLeaf.findMany({
    where: { groupName },
    orderBy: { leafIndex: "asc" },
  });

  for (let i = 0; i < remaining.length; i++) {
    if (remaining[i].leafIndex !== i) {
      await db.groupLeaf.update({
        where: { id: remaining[i].id },
        data: { leafIndex: i },
      });
    }
  }

  const group = await getGroupForTier(tier);
  const rootStr = group.root ? group.root.toString() : "0";

  await db.groupRoot.create({
    data: {
      groupName,
      root: rootStr,
      depth: group.depth,
      size: group.size,
    },
  });

  return rootStr;
}

/**
 * Get current public Merkle root for a tier.
 */
export async function getLatestGroupRoot(tier: number): Promise<{
  group: string;
  root: string;
  size: number;
  timestamp: Date;
}> {
  const groupName = `verified-humans-tier${tier}`;
  const record = await db.groupRoot.findFirst({
    where: { groupName },
    orderBy: { timestamp: "desc" },
  });

  if (record) {
    return {
      group: groupName,
      root: record.root,
      size: record.size,
      timestamp: record.timestamp,
    };
  }

  // If no root in DB, compute from leaves
  const group = await getGroupForTier(tier);
  const rootStr = group.root ? group.root.toString() : "0";

  const created = await db.groupRoot.create({
    data: {
      groupName,
      root: rootStr,
      depth: group.depth,
      size: group.size,
    },
  });

  return {
    group: groupName,
    root: created.root,
    size: created.size,
    timestamp: created.timestamp,
  };
}

/**
 * Compute an app-scoped nullifier for a private identity secret and app scope.
 * Guarantees:
 * - Deterministic: same user + same app = same nullifier
 * - Uncorrelatable: same user + different apps = different nullifiers
 */
export function computeNullifier(identitySecret: string, appScope: string): string {
  return "0x" + sha256(`nullifier:${identitySecret}:${appScope}`);
}

