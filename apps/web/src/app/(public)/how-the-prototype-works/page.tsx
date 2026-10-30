import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/layout/page-header";
import { Section, SectionHeader } from "@/components/layout/section";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle2, XCircle, AlertTriangle, ArrowRight, Shield } from "lucide-react";

export const metadata: Metadata = {
  title: "How the Prototype Works — Real vs Simulated",
  description:
    "Full transparency disclosure: What is functionally real in this CyberPlus MVP build, and what is planned on the future roadmap.",
};

const realItems = [
  {
    title: "Accounts, Sessions & Security",
    desc: "Complete authentication lifecycle with Argon2 password hashing, secure session management, CSRF protection, and email delivery via SMTP (Mailpit locally).",
  },
  {
    title: "Device-Level Biometric Passkeys (WebAuthn)",
    desc: "Real biometric unlock on the user's phone or computer via TouchID, FaceID, or Windows Hello. Raw biometrics never leave the device; CyberPlus receives only the cryptographic assertion.",
  },
  {
    title: "Cancelable Biometric Key Derivation",
    desc: "Keys are derived on the client using the WebAuthn PRF extension combined with a renewable high-entropy salt and HKDF-SHA256. Rotating the salt derives a completely new key from the same physical biometric.",
  },
  {
    title: "Software PIN Fallback for Non-PRF Browsers",
    desc: "For browsers lacking WebAuthn PRF, client-side PBKDF2/Argon2 secret derivation provides a functional fallback labeled 'software-protected'.",
  },
  {
    title: "Real Zero-Knowledge Proofs (Semaphore Protocol)",
    desc: "Real ZK proofs proving membership in the verified-humans Merkle tree without revealing the user's identity, generating unique app-scoped nullifiers to stop Sybil attacks.",
  },
  {
    title: "Key Lifecycle & Governance",
    desc: "Instant freeze, passkey unfreeze, rotation with activation delay, duress codes, and emergency signed freeze links delivered to email.",
  },
  {
    title: "Two-Officer In-Person Recovery Rule",
    desc: "Strictly enforced dual-custody recovery requiring two distinct authenticated officers to physically verify and approve before a replacement key is minted.",
  },
  {
    title: "Tamper-Evident Hash-Chained Audit Log",
    desc: "Append-only SHA-256 hash chain covering all key lifecycle actions with on-demand mathematical verification.",
  },
  {
    title: "Public Developer API & Embeddable SDK",
    desc: "Challenge creation, proof verification, signed result tokens (JWT), JWKS endpoint, HMAC webhooks, and the @cyberplus/verify SDK package.",
  },
  {
    title: "End-to-End Demo Applications",
    desc: "Functional demo apps for social network posting, review site duplicate prevention, banking wire approvals ($25M defense), and peer video calls using the real SDK.",
  },
  {
    title: "Stripe Test Mode Payments",
    desc: "Working Stripe checkout in test mode for business tier subscriptions with webhook handling and plan synchronization.",
  },
];

const notRealItems = [
  {
    title: "No Raw Biometric or DNA Ingestion",
    desc: "The prototype NEVER captures, processes, or uploads face images, fingerprints, iris scans, or DNA. Camera uploads for biometrics do not exist. Future hardware scanners and DNA sequencing are planned roadmap milestones, represented only by officer-confirmed checkboxes in the in-person flow.",
  },
  {
    title: "Identity Document Verification is Officer-Reviewed",
    desc: "In Tier 1, identity document checks consist of structured document-number and name entry reviewed by an officer account in this build, rather than an automated external government ID provider.",
  },
  {
    title: "Unaudited Cryptography",
    desc: "The cryptographic architecture and zero-knowledge circuit implementations have not been independently audited by a third-party security firm.",
  },
  {
    title: "No Inventions or Fake Claims",
    desc: "We do not claim formal government certifications, legal compliance, real institutional customers, venture investors, or awards. Placeholders are clearly marked: [TODO: add team], [TODO: add contact email], [TODO: add legal text], [TODO: add sourced market data].",
  },
];

export default function HowThePrototypeWorksPage() {
  return (
    <div className="pb-24">
      <PageHeader
        badge="Full Transparency Disclosure"
        title="How the Prototype Works"
        description="A clear, honest accounting of what is fully functional in this build and what represents future roadmap items."
      />

      <Section className="pt-0">
        <div className="max-w-5xl mx-auto space-y-12">
          {/* NOTICE BANNER */}
          <div className="p-4 rounded-xl border border-accent-500/30 bg-accent-500/5 text-xs text-cyber-300 flex items-start gap-3">
            <Shield className="h-5 w-5 text-accent-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-foreground text-sm">Reviewer Note</p>
              <p className="mt-1 leading-relaxed">
                Incubator reviewers and security engineers can test the entire lifecycle end-to-end against a real database: sign up, register a passkey, generate zero-knowledge proofs, freeze keys, call the REST API, and test the working demo applications.
              </p>
            </div>
          </div>

          {/* REAL MATRIX */}
          <div>
            <div className="flex items-center gap-2 mb-6">
              <CheckCircle2 className="h-6 w-6 text-emerald-500" />
              <h2 className="text-2xl font-bold">REAL in this Build (End-to-End Functional)</h2>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              {realItems.map((item, i) => (
                <Card key={i} className="border-cyber-200 dark:border-cyber-800">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base text-foreground flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-emerald-500 shrink-0" />
                      {item.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {item.desc}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* NOT REAL / ROADMAP MATRIX */}
          <div>
            <div className="flex items-center gap-2 mb-6">
              <XCircle className="h-6 w-6 text-amber-500" />
              <h2 className="text-2xl font-bold">NOT Real / Future Funded Roadmap</h2>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              {notRealItems.map((item, i) => (
                <Card key={i} className="border-amber-500/20 bg-amber-950/10">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base text-foreground flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-amber-400 shrink-0" />
                      {item.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {item.desc}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          <div className="pt-6 border-t border-cyber-800 flex flex-wrap justify-between items-center gap-4">
            <span className="text-xs text-cyber-500">
              Explore the live prototype features now:
            </span>
            <div className="flex gap-3">
              <Link href="/signup">
                <Button size="sm">Create Test Account</Button>
              </Link>
              <Link href="/developers">
                <Button variant="outline" size="sm">Test Developer API</Button>
              </Link>
            </div>
          </div>
        </div>
      </Section>
    </div>
  );
}

