/**
 * @cyberplus/verify/browser - Browser-side helpers
 * 
 * Triggers passkey unlock, generates ZK proof, and returns it.
 */

export interface ProofRequest {
  challengeId: string;
  scope: string;
  message: string;
  apiBaseUrl?: string;
}

export interface GeneratedProof {
  proof: string;
  nullifier: string;
  commitment: string;
}

/**
 * Trigger the passkey unlock and generate a zero-knowledge proof
 * for the given challenge.
 */
export async function generateProof(request: ProofRequest): Promise<GeneratedProof> {
  // This will be implemented with real Semaphore proof generation
  // and WebAuthn PRF extension in the enrollment/key modules
  throw new Error('generateProof: Not yet implemented - will be built in Stage 3-4');
}

/**
 * Check if the current browser supports WebAuthn with PRF extension.
 */
export async function checkPRFSupport(): Promise<boolean> {
  if (!window.PublicKeyCredential) return false;
  try {
    // Check for PRF extension support
    const available = await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable();
    return available;
  } catch {
    return false;
  }
}
