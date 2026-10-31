export interface Article {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  readTime: string;
  publishedAt: string;
  body: string;
}

export const ARTICLES: Article[] = [
  {
    slug: "why-detecting-deepfakes-is-a-losing-game",
    title: "Why Detecting Deepfakes is a Losing Arms Race",
    excerpt: "Detection algorithms can never stay ahead of generative diffusion models and real-time neural avatars. The durable fix is cryptographic proof of physical human presence.",
    category: "Security Philosophy",
    readTime: "4 min read",
    publishedAt: "2026-03-12",
    body: `
# Why Detecting Deepfakes is a Losing Arms Race

For years, security teams have responded to synthetic media with detection tools: neural networks trained to find subtle artifacts in video frames, acoustic inconsistencies in audio tracks, or irregular blinking patterns.

This approach is fundamentally flawed.

### The Asymmetric Cost Curve
In computer vision and generative audio, every detector becomes a training signal for the generator. As soon as a detection algorithm flags an artifact (such as earlobe rendering inconsistencies or unnatural audio compression), generative model architectures incorporate those specific discriminators into their loss functions. Within weeks, the next iteration produces artifacts that completely evade detection.

Generators cost pennies to run. Developing, tuning, and deploying detection pipelines across high-volume video and audio streams requires immense compute, introduces latency, and inevitably suffers from false positives and false negatives.

### Trust Signals Built for an Expensive World Are Breaking
Historically, faces and voices served as reliable proxies for human identity simply because faking a convincing human in real time was prohibitively expensive or technologically impossible. Trust signals in financial wire approvals, executive communications, and customer verification were calibrated for that reality.

Today, real-time voice clones and synchronized neural video avatars are accessible to anyone with a consumer graphics card. The visual and acoustic signals we relied on for identity are broken permanently.

### The Durable Alternative: Cryptographic Proof of Presence
Instead of inspecting pixels and waveforms trying to guess if a face or voice is artificial, the durable fix is cryptographic:
1. Do not ask: *"Does this video look like John?"*
2. Ask instead: *"Can the entity on the other end produce a cryptographic proof that a unique, living human is physically present and unlocking their authenticated device right now?"*

By decoupling human verification from easily replicated media, CyberPlus ends the detection arms race. A synthetic video stream running on a remote command server cannot produce a zero-knowledge proof bound to an authorized employee's physical hardware passkey.
    `,
  },
  {
    slug: "what-is-a-cancelable-biometric",
    title: "What is a Cancelable Biometric?",
    excerpt: "Your fingerprint and iris are permanent. If stolen, you cannot change your body. Cancelable biometrics solve this existential flaw with renewable cryptographic transforms.",
    category: "Cryptography",
    readTime: "5 min read",
    publishedAt: "2026-03-08",
    body: `
# What is a Cancelable Biometric?

A cancelable biometric is a digital security key derived from your physical traits that can be changed, replaced, or revoked at any time without requiring you to change your physical body.

### The Permanent Vulnerability of Raw Biometrics
Traditional biometric systems store template representations of your fingerprint, facial geometry, or iris patterns on a server. If that database is breached, the compromise is catastrophic and irreversible:
- You can change a leaked password.
- You can cancel a stolen credit card.
- You **cannot** change your retinas or print a new set of fingertips.

Once a raw biometric template is compromised, the victim's biometric identity is compromised for life.

### How CyberPlus Implements Cancelable Biometrics
CyberPlus combines three cryptographic mechanisms to ensure that raw biometrics are never stored, transmitted, or permanently tied to a fixed credential:

1. **Hardware-Isolated Verification**: The user's biometric unlock (fingerprint or face scan) occurs strictly inside their phone or laptop's secure element via WebAuthn passkeys. CyberPlus never sees or stores biometric scans.
2. **WebAuthn PRF (Pseudo-Random Function) Extension**: Upon local biometric verification, the authenticator evaluates a pseudo-random function over an input salt, yielding a cryptographically hard secret.
3. **Renewable Device-Side Salting (HKDF)**: In the browser, this secret is combined with a random, high-entropy salt using HKDF-SHA256:
   \`secret = HKDF-SHA256(PRF_output, salt, info="cyberplus:identity:v1")\`
4. **Instant Revocation & Rotation**: If a device is lost or compromised, rotating the salt immediately generates a brand-new identity commitment and removes the old one from the verified human group. The same physical face or fingerprint produces an entirely unrelated identity key.

Cancelable biometrics transform permanent physical features into renewable, privacy-preserving cryptographic assets.
    `,
  },
  {
    slug: "zero-knowledge-proofs-in-plain-language",
    title: "Zero-Knowledge Proofs in Plain Language",
    excerpt: "How to prove you are a verified, unique human without revealing your name, email, or letting websites track you across the internet.",
    category: "Zero-Knowledge",
    readTime: "4 min read",
    publishedAt: "2026-03-01",
    body: `
# Zero-Knowledge Proofs in Plain Language

Imagine showing a bouncer proof that you are over 21 without showing your birth date, your legal name, your home address, or your driver's license number. You prove the statement is true, and the bouncer learns nothing else.

That is the essence of a **zero-knowledge proof (ZKP)**.

### The Problem With Modern Single Sign-On
When you log in with Google, Apple, or government identity systems, the identity provider knows every site you visit. Furthermore, each site learns your email, name, or a persistent identifier that data brokers correlate across the web.

This creates pervasive surveillance, massive honeypots of personal data, and severe tracking risks.

### Enter the Semaphore Protocol
CyberPlus uses Semaphore, an open-source zero-knowledge protocol designed for privacy-preserving group membership and signaling.

Here is how it works under the hood:
1. **The Verified Humans Group**: When you enroll, your identity commitment (a mathematical point) is added to a Merkle tree of verified humans on the CyberPlus network.
2. **Generating a Proof**: When an app asks you to prove you are human, your device generates a ZK proof that proves two statements simultaneously:
   - *"I know the private secret corresponding to one of the commitments in the verified human tree."*
   - *"I am creating this proof specifically for App X with Challenge Y."*
3. **App-Scoped Nullifiers**: To prevent one person from creating multiple accounts or spamming votes, the proof includes a *nullifier hash*. For App X, your key always yields Nullifier A. For App Y, your key yields Nullifier B. The two nullifiers are mathematically unrelated, preventing cross-site correlation while enforcing one-human-one-account locally.

Apps receive certainty that a verified human is present, while your identity remains completely anonymous and private.
    `,
  },
  {
    slug: "how-cyberplus-would-have-stopped-the-25m-wire-scam",
    title: "How CyberPlus Would Have Stopped the $25M Wire Scam",
    excerpt: "A deep dive into the Hong Kong corporate video call scam and how cryptographic authorization stops multi-million dollar neural impersonation in its tracks.",
    category: "Case Studies",
    readTime: "5 min read",
    publishedAt: "2026-02-24",
    body: `
# How CyberPlus Would Have Stopped the $25M Wire Scam

In early 2024, a multinational corporation in Hong Kong fell victim to one of the most sophisticated cyber heists in history. A finance employee joined a multi-person video conference where the company's Chief Financial Officer and several departmental colleagues were present.

All of them were deepfakes.

Over the course of the call, the synthetic CFO instructed the employee to authorize 15 separate transactions totaling $25 million to fraudulent offshore accounts. The employee believed their eyes and ears.

### Where Traditional Controls Broke Down
- **Visual Confidence**: The employee checked the video feed. The visual likeness, gestures, and clothing matched the genuine CFO.
- **Audio Confidence**: The voice clone reproduced cadence, tone, and inflection with astonishing accuracy.
- **Social Proof**: The presence of other "colleagues" on the call silenced hesitation and pressure-tested compliance.

### How CyberPlus Defends the Transaction
If the organization had deployed CyberPlus enterprise verification policies, the heist would have failed at step one:

1. **Policy-Enforced Thresholds**: The enterprise policy engine defines a rule: *Any wire transfer exceeding $50,000 requires Tier 2 or Tier 3 proof of human.*
2. **Out-of-Band Challenge**: When the wire request is initiated, the internal treasury system issues a cryptographic challenge.
3. **The Impostor Cannot Comply**: The fraudsters orchestrating the synthetic video stream do not possess the CFO's physical hardware passkey. Even if they have recorded 1,000 hours of the CFO's speeches, they cannot derive the CFO's device-bound Semaphore secret.
4. **Immediate Transaction Halting**: When the challenge times out or returns an invalid assertion, the treasury software locks the transfer instantly, alerts compliance, and logs the attack attempt.

In an era of ubiquitous deepfakes, visual trust is liability. Only cryptographic assurance survives.
    `,
  },
  {
    slug: "why-recovery-is-the-hardest-part-of-identity-systems",
    title: "Why Recovery is the Hardest Part of Identity Systems",
    excerpt: "Self-sovereign keys are useless if you get permanently locked out when a laptop drops in the ocean. How CyberPlus solves recovery with the two-officer physical anchor.",
    category: "System Design",
    readTime: "4 min read",
    publishedAt: "2026-02-18",
    body: `
# Why Recovery is the Hardest Part of Identity Systems

In computer security, the saying goes: *"Any system can be made secure if you don't care whether the legitimate user can get in."*

Traditional crypto wallets and self-sovereign identity systems suffer from an unforgiving flaw: lose your 24-word seed phrase, and your identity and assets are gone forever. Conversely, centralized systems rely on SMS recovery or automated email resets—channels that SIM-swappers and phishing operators compromise every day.

### The Fundamental Trilemma of Account Recovery
An identity recovery mechanism must achieve three competing objectives:
1. **Accessibility**: A genuine user who lost all their hardware devices must be able to recover their profile.
2. **Sybil Resistance**: A user must not be able to create two active profiles simultaneously through the recovery backdoor.
3. **Attacker Infeasibility**: A remote attacker, phishing syndicate, or rogue insider must not be able to hijack a profile.

### The CyberPlus Recovery Protocol
CyberPlus resolves this challenge through physical anchoring and separation of duties:

- **Strictly In-Person**: Recovery cannot be initiated or completed over email, SMS, or phone. The applicant must appear in person at a verified location with physical government credentials.
- **Two-Officer Rule**: A single employee or officer cannot approve a recovery. Two distinct authenticated officers must physically verify credentials and sign the transaction independently.
- **48-Hour Activation Delay**: Once approved by both officers, the recovered key enters a mandatory 48-hour activation delay. Notice is dispatched to all registered contact channels. If the recovery was malicious, the genuine owner can trigger an instant freeze.
- **Duress Code Safeguard**: If an individual is physically coerced into requesting recovery, entering their duress PIN triggers silent alerts across the officer portal without alerting the coercer.

Recovery is hard because it operates at the intersection of cryptography, human vulnerability, and physical security. CyberPlus treats recovery as a high-security physical protocol.
    `,
  },
  {
    slug: "what-real-world-proof-of-human-looks-like",
    title: "What Real-World Proof of Human Looks Like",
    excerpt: "From remote passkey enrollments to high-assurance corporate anchors: navigating the three assurance tiers of the CyberPlus architecture.",
    category: "Architecture",
    readTime: "3 min read",
    publishedAt: "2026-02-10",
    body: `
# What Real-World Proof of Human Looks Like

Not every digital interaction requires government-grade identity verification. A casual movie review forum does not need the same security rigor as a $10M banking authorization.

CyberPlus structures proof-of-human assurance into three practical, escalating tiers:

### Tier 1: Basic Assurance (Remote)
- **Enrollment**: 2 minutes from any smartphone or modern browser.
- **Requirements**: Email validation, local platform biometric unlock (TouchID, FaceID, Windows Hello) via WebAuthn passkey, and basic document review.
- **Use Cases**: Social networks, forum comment sections, marketplace reviews, dating apps, and sybil-resistant voting.

### Tier 2: Standard Assurance (Partner Verified)
- **Enrollment**: Remote enrollment plus a physical appointment at an authorized partner location.
- **Requirements**: Hardware biometric passkey plus physical document inspection by a trained officer.
- **Use Cases**: Fintech transactions, corporate access controls, verified creator status, and mid-tier financial transfers.

### Tier 3: High Assurance (Certified Center Anchor)
- **Enrollment**: Certified enrollment center verification with physical anchor and dual-officer co-signing.
- **Requirements**: Hardware key, certified center verification, multi-officer signoff, and eligibility for the two-person recovery network.
- **Use Cases**: C-suite communications, executive video calls, high-value wire transfers ($50k+), defense, and government services.

By matching the assurance level to the transaction risk, platforms achieve maximum security with minimal user friction.
    `,
  },
];

