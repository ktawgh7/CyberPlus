import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/page-header";
import { Section } from "@/components/layout/section";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ShieldCheck, XCircle, CheckCircle2 } from "lucide-react";

export const metadata: Metadata = {
  title: "Privacy Policy — CyberPlus",
  description: "CyberPlus privacy principles and plain-language list of stored vs never-stored data.",
};

export default function PrivacyPage() {
  return (
    <div className="pb-24">
      <PageHeader
        badge="Data Protection & Privacy"
        title="Privacy Policy"
        description="CyberPlus is engineered from first principles so that we cannot track you, harvest your biometrics, or leak your personal data."
      />

      <Section className="pt-0">
        <div className="max-w-4xl mx-auto space-y-8">
          <Badge variant="prototype" className="text-xs">
            DRAFT &mdash; Illustrative prototype policy [TODO: add legal text]
          </Badge>

          {/* WHAT WE STORE VS NEVER STORE */}
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="border-emerald-500/30 bg-emerald-950/10 dark:bg-emerald-950/20">
              <CardContent className="pt-6">
                <div className="flex items-center gap-2 text-emerald-400 font-bold mb-4">
                  <CheckCircle2 className="h-5 w-5" />
                  <span>What We Store</span>
                </div>
                <ul className="space-y-3 text-xs text-muted-foreground leading-relaxed">
                  <li><strong>Account Credentials:</strong> Email address and salted, memory-hard Argon2 password hashes.</li>
                  <li><strong>Cryptographic Public Keys:</strong> WebAuthn credential public keys (for verifying device assertions) and Semaphore identity commitments (public mathematical points).</li>
                  <li><strong>Key Metadata:</strong> Assurance tier (1, 2, or 3), key status (Active, Frozen, Revoked), and creation/activation timestamps.</li>
                  <li><strong>Tamper-Evident Audit Log:</strong> Cryptographically hash-chained timestamps of security actions (enrollments, rotations, freezes).</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-danger/30 bg-danger/5 dark:bg-danger/10">
              <CardContent className="pt-6">
                <div className="flex items-center gap-2 text-danger font-bold mb-4">
                  <XCircle className="h-5 w-5" />
                  <span>What We NEVER Store or Harvest</span>
                </div>
                <ul className="space-y-3 text-xs text-muted-foreground leading-relaxed">
                  <li><strong>No Raw Biometrics:</strong> Never fingerprints, face scans, retinal maps, voice waveforms, or DNA sequences.</li>
                  <li><strong>No Private Identity Secrets:</strong> The private Semaphore secret never leaves your device&apos;s Web Crypto environment.</li>
                  <li><strong>No Cross-Site Tracking:</strong> Because nullifiers are app-scoped, we have no record of which websites or applications you verify against.</li>
                  <li><strong>No Third-Party Analytics:</strong> No tracking cookies, marketing beacons, or data broker integrations.</li>
                </ul>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6 text-sm text-muted-foreground leading-relaxed">
            <h2 className="text-xl font-bold text-foreground">1. Zero-Knowledge Guarantees</h2>
            <p>
              When an application requests a proof of human from CyberPlus, the interaction relies entirely on zero-knowledge cryptography. CyberPlus only validates the mathematical correctness of your proof against the Merkle tree of verified humans. We never see your identity secret, and the verifying app never sees your real-world identity.
            </p>

            <h2 className="text-xl font-bold text-foreground">2. Account Deletion & Anonymization</h2>
            <p>
              Users retain the absolute right to delete their CyberPlus account at any time. Account deletion immediately purges personal email addresses, password hashes, and session tokens from active database stores, permanently revokes the corresponding Semaphore identity commitment, and maintains only an anonymized cryptographic tombstone in the tamper-evident audit ledger to preserve hash-chain mathematical integrity.
            </p>

            <h2 className="text-xl font-bold text-foreground">3. Legal Representation</h2>
            <p className="text-xs text-cyber-500 font-mono">
              [TODO: add legal text & contact details &mdash; contact email: [TODO: add contact email]]
            </p>
          </div>
        </div>
      </Section>
    </div>
  );
}

