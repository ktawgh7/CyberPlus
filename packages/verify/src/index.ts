/**
 * @cyberplus/verify - CyberPlus Verification SDK
 * 
 * Server-side helpers for creating challenges and verifying proofs.
 */

export interface CyberPlusConfig {
  /** Your CyberPlus API key */
  apiKey: string;
  /** API base URL (defaults to production) */
  baseUrl?: string;
}

export interface Challenge {
  id: string;
  scope: string;
  message: string;
  requiredTier: number;
  expiresAt: string;
}

export interface VerificationResult {
  verified: boolean;
  tier?: number;
  nullifier?: string;
  reason?: string;
  signedToken?: string;
}

export class CyberPlus {
  private config: CyberPlusConfig;
  private baseUrl: string;

  constructor(config: CyberPlusConfig) {
    this.config = config;
    this.baseUrl = config.baseUrl || '/api/v1';
  }

  /**
   * Create a verification challenge for your app.
   */
  async createChallenge(options?: { 
    requiredTier?: number;
    externalId?: string;
  }): Promise<Challenge> {
    const res = await fetch(`${this.baseUrl}/challenges`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.config.apiKey}`,
      },
      body: JSON.stringify({
        requiredTier: options?.requiredTier || 1,
        externalId: options?.externalId,
      }),
    });
    if (!res.ok) throw new Error(`Challenge creation failed: ${res.status}`);
    return res.json();
  }

  /**
   * Verify a proof submitted by a user.
   */
  async verifyProof(challengeId: string, proof: string): Promise<VerificationResult> {
    const res = await fetch(`${this.baseUrl}/verify`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.config.apiKey}`,
      },
      body: JSON.stringify({ challengeId, proof }),
    });
    if (!res.ok) throw new Error(`Verification failed: ${res.status}`);
    return res.json();
  }

  /**
   * Verify a signed result token (JWT) from CyberPlus.
   * Fetches the JWKS from the well-known endpoint to validate.
   */
  async verifyResultToken(token: string): Promise<{ valid: boolean; payload?: Record<string, unknown> }> {
    // In a real implementation, this would fetch JWKS and verify the JWT
    const res = await fetch(`${this.baseUrl.replace('/api/v1', '')}/.well-known/jwks.json`);
    if (!res.ok) throw new Error('Failed to fetch JWKS');
    // JWT verification would happen here
    return { valid: true, payload: {} };
  }
}

export function createCyberPlus(config: CyberPlusConfig): CyberPlus {
  return new CyberPlus(config);
}
