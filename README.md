# CyberPlus — Proving You Are a Human

> **CyberPlus gives every person a verified "proof of human" profile that bots, deepfakes, and fraudsters cannot copy, without exposing who they are.**

[![CI](https://github.com/cyberplus/cyberplus/actions/workflows/ci.yml/badge.svg)](https://github.com/cyberplus/cyberplus/actions)
[![License: MIT](https://img.shields.io/badge/License-MIT-teal.svg)](LICENSE)
[![Status: MVP Prototype](https://img.shields.io/badge/Status-Fully%20Functional%20MVP-emerald.svg)](https://cyberplus.id)

---

## 1. Executive Overview

### The Problem
- **The $25M Wire Scam:** In 2024, a finance worker joined an urgent video call where the CFO and several corporate colleagues were all present on camera and instructed an outbound wire. Every face and voice on the call was an AI deepfake; $25,000,000 was transferred before the deception was uncovered.
- **Biometric Trust Signals are Broken:** Generative video, voice synthesis, and real-time diffusion models have made impersonating human faces and voices trivial. Traditional authentication built for a world where faking video was expensive is failing across enterprise finance, social networks, dating apps, and online reviews.
- **Detection is a Losing Game:** Passive "deepfake detection" algorithms and watermarks are fundamentally brittle against compression and adversarial models. The only mathematically durable defense is to **stop trusting pixels and audio** and verify a real-time, hardware-backed **cryptographic proof of human presence**.

### The Concept (Four Steps)
1. **Liveness & Biometric Unlock:** Real biometric verification occurs strictly inside the user's personal hardware device (Apple TouchID/FaceID, Android Biometrics, or Windows Hello) via WebAuthn passkeys. CyberPlus never receives or stores raw biometrics.
2. **Cancelable Identity Key:** A high-entropy identity key is deterministically derived from the WebAuthn PRF (Pseudo-Random Function) output combined with a random 256-bit salt via HKDF-SHA256. If a key is compromised, the user simply rotates the salt to generate a brand new key from the same physical biometric without having to "change their body".
3. **Zero-Knowledge Proof of Human:** The derived public commitment is admitted into the Semaphore Merkle group corresponding to the user's assurance tier. Apps verify that a real, active human is present using app-scoped pseudonymous nullifiers that prevent tracking across applications.
4. **Resilient Defense & Recovery:** Keys can be frozen instantly upon suspicion (taking immediate effect on subsequent verification calls). Account recovery strictly enforces a **Two-Officer physical approval rule** with a 48-hour activation delay to prevent SIM swaps or social engineering attacks.

---

## 2. Assurance Tiers

| Tier | Name | Verification Method | Primary Use Cases |
| :--- | :--- | :--- | :--- |
| **Tier 1** | **Basic** | Remote enrollment: Device biometric passkey unlock + Identity document review | Anti-bot social posting, spam reduction, verified reviews |
| **Tier 2** | **Standard** | Tier 1 + In-person biometric & physical document verification at partner hub | Dating app verification, marketplace transactions, standard banking |
| **Tier 3** | **High** | Tier 2 + Certified enrollment center physical anchor & dual officer sign-off | Executive video calls, wires >$50k, treasury sign-offs, recovery anchor |

---

## 3. Real vs. Simulated Prototype Notice

To maintain absolute transparency with incubator reviewers and security researchers, the following table details what is fully real in this codebase versus what is simulated:

| Feature / Subsystem | Status in Prototype | Technical Implementation |
| :--- | :--- | :--- |
| **Authentication & Accounts** | **REAL** | Argon2 password hashing, HTTP-only secure cookie sessions, single-use email tokens, account lockout after repeated failures. |
| **Device Biometric Unlock** | **REAL** | WebAuthn passkeys (`@simplewebauthn/server` + `@simplewebauthn/browser`). Device handles fingerprint/face scan internally. CyberPlus server receives only signed assertions. |
| **Cancelable Key Derivation** | **REAL** | WebAuthn PRF extension with HKDF-SHA256 and renewable 256-bit random salt. Pure client-side derivation; private secret never leaves browser. Fallback: PBKDF2-HMAC-SHA256 (100,000 iterations). |
| **Zero-Knowledge Proofs** | **REAL** | Semaphore Protocol v4 (BabyJubjub curve, Poseidon hashing, Merkle tree commitment sets, app-scoped pseudonymous nullifiers). |
| **Key Governance** | **REAL** | Instant key freeze, unfreeze via passkey challenge, salt rotation, emergency logout freeze, and duress code silent flagging. |
| **Two-Officer Recovery Rule** | **REAL** | Multi-signature database constraint: recovery requires two independent officer accounts to approve; single officer approval is rejected. |
| **Tamper-Evident Audit Log** | **REAL** | Cryptographic hash chain (`hash = SHA-256(content + prevHash)`). Entire chain can be verified on-demand via `/api/audit/verify`. |
| **Public Developer API & SDK** | **REAL** | REST API (`/api/v1/*`), API keys (sandbox & live), RS256 signed result JWTs, HMAC-SHA256 webhook dispatcher, `@cyberplus/verify` SDK package, and standalone widget (`/sdk/widget.js`). |
| **Working Demo Applications** | **REAL** | 4 fully operational demo apps consuming the live SDK: Social feed, Product reviews, Banking wire authorization ($25M scam replay), and WebRTC video call. |
| **Payments Integration** | **REAL** | Stripe Checkout integration in TEST MODE with webhook listener for tier upgrades. |
| **Raw Biometric Capture** | **SIMULATED / ROADMAP** | **NEVER COLLECTED.** CyberPlus never collects, uploads, or stores fingerprints, iris scans, face images, or DNA. There are no camera uploads or file pickers for biometrics. Physical checks appear only as officer-confirmed checklists. |
| **Automated ID Document OCR** | **SIMULATED** | Document submission is reviewed and approved manually by an Officer account in this prototype rather than an automated DMV/passport database lookup. |
| **Independent Security Audit** | **UNAUDITED** | Cryptography and smart contracts have not yet undergone a third-party commercial security audit. |

---

## 4. Seeded Demo Accounts & Credentials

The seed script (`pnpm db:seed`) pre-populates all user roles with deterministic test data:

| Role | Email | Password | Description |
| :--- | :--- | :--- | :--- |
| **Individual User** | `demo@cyberplus.id` | `DemoPassword123!` | Standard enrolled individual with registered passkey, Tier 2 status, active key, and recovery kit. |
| **Business Owner** | `elena@acrobatics.finance` | `BusinessPassword123!` | Admin of *Acrobatics Financial Tech*, with 5 team members, active API keys, webhooks, and custom wire transfer policy. |
| **Verification Officer 1** | `officer1@cyberplus.id` | `OfficerPassword123!` | In-person partner hub officer with access to `/officer` review queues and recovery approval step 1. |
| **Verification Officer 2** | `officer2@cyberplus.id` | `OfficerPassword123!` | Second independent verification officer required to fulfill the mandatory Two-Officer recovery rule. |
| **System Administrator** | `admin@cyberplus.id` | `AdminPassword123!` | Superuser with access to `/admin`, node health, global audit verification, and organization controls. |

*Quick Access:* You can also click **"Continue as demo user"** on the `/login` page to bypass typing credentials.

---

## 5. Quickstart & Installation

### Prerequisites
- Node.js 20.x or higher
- pnpm 12.x (`npm install -g pnpm`)

### Local Setup (SQLite — Zero External Dependencies)

```bash
# 1. Clone repository
git clone https://github.com/cyberplus/cyberplus.git
cd cyberplus

# 2. Install workspace dependencies
pnpm install

# 3. Setup database schema and seed accounts
pnpm db:push
pnpm db:seed

# 4. Run test suite (Vitest)
pnpm test

# 5. Start development server
pnpm dev
```
Open **[http://localhost:3000](http://localhost:3000)** in your browser.

### Docker Compose Setup (PostgreSQL + Mailpit)

For production-like environments or running with PostgreSQL and local Mailpit SMTP:

```bash
# Start PostgreSQL and Mailpit SMTP
docker compose up -d

# Inspect Mailpit web inbox at http://localhost:8025
# Inspect CyberPlus web application at http://localhost:3000
```

---

## 6. Project Architecture & Monorepo Structure

```
cyberplus/
├── apps/
│   └── web/                                # Next.js 15 Full-Stack Web Application
│       ├── prisma/
│       │   ├── schema.prisma               # 30 relational models (SQLite / Postgres)
│       │   └── seed.ts                     # Automated deterministic seed script
│       ├── public/
│       │   └── sdk/widget.js               # Embeddable browser verification widget
│       ├── src/
│       │   ├── app/
│       │   │   ├── (public)/               # Marketing & educational pages (/, /product, /solutions, /pricing, /support, /resources)
│       │   │   ├── (auth)/                 # Auth routes (/login, /signup, /verify-email, /forgot-password)
│       │   │   ├── (app)/dashboard/        # Protected user area (/dashboard, /enroll, /key, /activity, /apps, /business)
│       │   │   ├── (app)/officer/          # Two-officer physical verification & recovery portal
│       │   │   ├── (app)/admin/            # System administration & node inspection
│       │   │   ├── demo/                   # Working demo apps (/demo/social, /demo/reviews, /demo/bank, /demo/call)
│       │   │   └── api/                    # REST endpoints (auth, passkeys, enroll, keys, cron, officer, v1 verification)
│       │   ├── components/                 # Reusable UI component library (Tailwind CSS + Lucide icons)
│       │   └── lib/                        # Core cryptographic & governance modules:
│       │       ├── client-key.ts           # WebAuthn PRF + HKDF + Salt + Semaphore key derivation
│       │       ├── semaphore.ts            # Semaphore v4 Merkle tree management & nullifiers
│       │       ├── audit.ts                # SHA-256 tamper-evident hash-chained audit ledger
│       │       ├── crypto.ts               # Argon2 password hashing & SHA-256 utilities
│       │       ├── passkey.ts              # SimpleWebAuthn server options & registration
│       │       ├── jwt.ts                  # RS256 result token signing & JWKS export
│       │       └── webhooks.ts             # HMAC-SHA256 signature event delivery
│       └── tests/
│           ├── crypto.test.ts              # Unit tests for determinism, salt rotation & PIN fallback
│           └── integration.test.ts         # Integration tests for audit chain, Semaphore roots & 2-officer rule
├── packages/
│   └── verify/                             # Official @cyberplus/verify SDK package
│       ├── src/
│       │   ├── index.ts                    # Node.js server client (verifyResultToken, createChallenge)
│       │   ├── browser.ts                  # Browser WebAuthn PRF & proof execution
│       │   └── widget.ts                   # Widget mounting helpers
│       └── package.json
├── docker-compose.yml                      # Postgres 16 + Mailpit container definition
├── Dockerfile                              # Multi-stage production container build
└── .github/workflows/ci.yml                # Automated CI pipeline
```

---

## 7. Cryptographic Design

### 1. Cancelable Biometric Derivation (HKDF-SHA256)
When a user unlocks their device authenticator, the WebAuthn PRF extension returns a 256-bit high-entropy secret derived from the authenticator's master secret and a domain-specific salt:
$$\text{DerivedSecret} = \text{HKDF-SHA256}(\text{IKM} = \text{PRF\_Output}, \text{Salt} = \text{RenewableSalt}_{256}, \text{Info} = \text{"cyberplus-identity-v1"})$$

- **Cancelability:** If a device or session is compromised, the user triggers key rotation. CyberPlus generates a new random $\text{RenewableSalt}$, permanently revoking the old commitment and calculating a brand new identity commitment from the exact same biometric unlock.
- **PIN Fallback:** For browsers without WebAuthn PRF support, CyberPlus provides a software KDF fallback utilizing PBKDF2-HMAC-SHA256 with 100,000 iterations over user PIN + salt.

### 2. Zero-Knowledge Proof of Human Presence (Semaphore v4)
- **Commitment:** $\text{Commitment} = \text{Poseidon}(\text{IdentitySecret})$
- **Nullifier Generation:** To prevent cross-app tracking while guaranteeing one-human-per-account or one-review-per-person:
$$\text{Nullifier} = \text{Poseidon}(\text{IdentitySecret}, \text{AppScope})$$
- Verifiers obtain proof that the nullifier corresponds to an admitted leaf in the `verified-humans-tierX` Merkle tree without revealing the leaf index or the user's identity.

### 3. Tamper-Evident Hash Chain Audit Log
Every critical system action (enrollment, key rotation, freeze, unfreeze, recovery approval) is appended to a linear hash chain:
$$\text{Hash}_n = \text{SHA-256}(\text{UserId} \parallel \text{Action} \parallel \text{Detail} \parallel \text{Hash}_{n-1})$$
The chain genesis block starts at `00000000...`. Any retroactive database modification breaks the chain and is flagged immediately by `/api/audit/verify`.

---

## 8. Working Demo Applications

| Demo App | URL Path | Description |
| :--- | :--- | :--- |
| **Anti-Bot Social Feed** | `/demo/social` | Demonstrates 1-human-1-account posting using app-scoped nullifiers. Includes a "Simulate Bot Script Attack" button demonstrating instant rejection. |
| **Verified Marketplace Reviews** | `/demo/reviews` | Demonstrates sybil-resistant product reviews where each human can leave exactly 1 review per item without exposing their identity. |
| **$25M Wire Scam Replay** | `/demo/bank` | Replays the CFO video-call fraud scenario. Shows an impostor video call failing cryptographic verification and blocking the wire, alongside legitimate executive passkey approval. |
| **WebRTC Video Call** | `/demo/call` | Multi-participant video conference simulating real-time human verification badges via WebRTC data channel nonces. Unverified callers display deepfake risk warnings. |

---

## 9. Comprehensive List of Placeholders

As mandated by the design brief, CyberPlus never invents metrics, partners, testimonials, or legal guarantees. The following placeholders are explicitly used throughout the codebase:

1. `[TODO: add team]` — Public team & leadership rosters.
2. `[TODO: add sourced market data]` — Deepfake loss statistics pending independent analyst sourcing.
3. `[TODO: add contact email]` — Production enterprise support email.
4. `[TODO: add legal text]` — Binding Terms of Service and Privacy Policy legal agreements.
5. `[TODO: add whitepaper PDF]` — Downloadable cryptographic protocol formal specification whitepaper.
6. `[TODO: set price]` — Dynamic production verifier API usage-based fee schedule.
7. `[TODO: upload production security audit certification]` — Third-party commercial penetration test and audit report.

---

## 10. Verification API Reference

### Create Challenge
```http
POST /api/v1/challenges
Content-Type: application/json
Authorization: Bearer <API_KEY>

{
  "appScope": "finance.treasury.wire",
  "requiredTier": 2
}
```

### Verify Proof
```http
POST /api/v1/verify
Content-Type: application/json
Authorization: Bearer <API_KEY>

{
  "challengeId": "ch_7a9f1...",
  "proof": {
    "merkleTreeRoot": "0x12a9...",
    "nullifier": "0x39b4...",
    "commitment": "0x8fa1..."
  }
}
```

### Response
```json
{
  "verified": true,
  "tier": 2,
  "nullifier": "0x39b4...",
  "resultToken": "eyJhbGciOiJSUzI1NiIs...",
  "requestId": "req_88f91a"
}
```

---

## 11. License
Licensed under the [MIT License](LICENSE).

