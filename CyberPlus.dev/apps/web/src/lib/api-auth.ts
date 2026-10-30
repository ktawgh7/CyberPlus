import { NextRequest } from "next/server";
import { db } from "./db";
import { sha256 } from "./crypto";
import { ApiKey, Organization } from "@prisma/client";

export interface AuthenticatedApiKey {
  key: ApiKey;
  org: Organization;
  mode: "SANDBOX" | "LIVE";
}

/**
 * Validate incoming API key from Authorization header.
 * Header format: "Authorization: Bearer cp_test_..." or "Authorization: Bearer cp_live_..."
 */
export async function validateApiKey(req: NextRequest): Promise<AuthenticatedApiKey | null> {
  const authHeader = req.headers.get("authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return null;
  }

  const rawKey = authHeader.replace("Bearer ", "").trim();
  if (!rawKey.startsWith("cp_test_") && !rawKey.startsWith("cp_live_")) {
    return null;
  }

  const keyHash = sha256(rawKey);

  const apiKey = await db.apiKey.findUnique({
    where: { keyHash },
    include: { org: true },
  });

  if (!apiKey || apiKey.revokedAt) {
    return null;
  }

  return {
    key: apiKey,
    org: apiKey.org,
    mode: apiKey.mode,
  };
}

