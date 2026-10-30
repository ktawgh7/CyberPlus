import type { Metadata } from "next";
import Link from "next/link";
import {
  Shield,
  Key,
  Fingerprint,
  RotateCw,
  Lock,
  FileCheck,
  Check,
  X,
  ArrowRight,
  ShieldAlert,
  Cpu,
  EyeOff,
  Dna,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Section, SectionHeader } from "@/components/layout/section";
import { PageHeader } from "@/components/layout/page-header";
import { VerificationPlayground } from "@/components/shared/verification-playground";

export const metadata: Metadata = {
  title: "Product — How CyberPlus Works",
  description:
    "Explore CyberPlus architecture: cancelable biometrics, zero-knowledge proofs, multi-tier assurance, and cryptographic proof of human.",
};

const techCards = [
  {
    icon: RotateCw,
    plainExplanation: "A digital security key derived from your physical traits that can be changed or replaced at any time without changing your physical body.",
    term: "Cancelable Biometrics",
    detail: "During enrollment, WebAuthn PRF and HKDF-SHA256 blend your hardware biometric confirmation with a renewable device salt. If your device is lost or compromised, rotating the salt produces an entirely new key commitment while keeping your body unchanged.",
  },
  {
    icon: EyeOff,
    plainExplanation: "A mathematical method allowing you to prove you belong to a verified group of humans without revealing your name, email, or any identifying detail.",
    term: "Zero-Knowledge Proofs (Semaphore)",
    detail: "Using the Semaphore zero-knowledge protocol, your device generates cryptographic proofs that prove group membership. Apps receive a mathematically sound 'yes', plus a distinct pseudonymous nullifier per app so you cannot be tracked across different websites.",
  },
  {
    icon: Dna,
    plainExplanation: "We never ask for, process, or store raw biological data such as face scans, fingerprint images, iris maps, or genetic sequences.",
    term: "No Raw Biometrics or DNA Stored",
    detail: "Your device's biometric scanner (TouchID, FaceID, Windows Hello) handles biometric authentication locally inside secure hardware. CyberPlus only receives the signed WebAuthn assertion and a cryptographic public commitment.",
  },
  {
    icon: Fingerprint,
    plainExplanation: "Real-time verification that an actual living person is present at the physical device rather than a recording or synthetic media bot.",
    term: "Liveness & Hardware Device Unlock",
    detail: "WebAuthn requires physical user presence and user verification (biometric or platform PIN). Deepfake video streams and synthetic voice bots executing remotely cannot satisfy the local platform authenticator hardware challenge.",
  },
];

const tiers = [
  {
    tier: "Tier 1",
    name: "Basic",
    target: "Social networks, forums, review platforms",
    enrollment: "Remote enrollment in under 2 minutes",
    checks: [
      { name: "Device biometric unlock (Passkey / WebAuthn)", included: true },
      { name: "Identity document check (Name & number verification)", included: true },
      { name: "In-person partner verification", included: false },
      { name: "Certified-center verification & recovery anchor", included: false },
      { name: "High-value wire transfers (over $10k)", included: false },
    ],
  },
  {
    tier: "Tier 2",
    name: "Standard",
    target: "Dating apps, fintech apps, sensitive accounts",
    enrollment: "Tier 1 + verified in-person at partner location",
    checks: [
      { name: "Device biometric unlock (Passkey / WebAuthn)", included: true },
      { name: "Identity document check (Name & number verification)", included: true },
      { name: "In-person partner verification", included: true },
      { name: "Certified-center verification & recovery anchor", included: false },
      { name: "High-value wire transfers (over $10k)", included: false },
    ],
    highlight: true,
  },
  {
    tier: "Tier 3",
    name: "High Assurance",
    target: "Executive video calls, wire transfers, government",
    enrollment: "Tier 2 + certified-center verification & 2-officer recovery",
    checks: [
      { name: "Device biometric unlock (Passkey / WebAuthn)", included: true },
      { name: "Identity document check (Name & number verification)", included: true },
      { name: "In-person partner verification", included: true },
      { name: "Certified-center verification & recovery anchor", included: true },
      { name: "High-value wire transfers (over $10k)", included: true },
    ],
  },
];

export default function ProductPage() {
  return (
    <div className="pb-24">
      <PageHeader
        badge="Technology & Architecture"
        title="Cryptographic Proof of Human"
        description="Stop trusting vulnerable faces and voices. CyberPlus replaces easily faked biometric signals with cancelable cryptographic keys and zero-knowledge proofs."
      >
        <div className="flex flex-wrap justify-center gap-4">
          <Link href="/dashboard/enroll">
            <Button size="lg">Start Enrollment Flow</Button>
          </Link>
          <Link href="/how-the-prototype-works">
            <Button variant="outline" size="lg">How Prototype Works</Button>
          </Link>
        </div>
      </PageHeader>

      {/* CORE PILLARS */}
      <Section>
        <SectionHeader
          badge="Core Mechanics"
          title="Engineered for Zero Data Exposure"
          subtitle="How CyberPlus delivers verified human assurance without ever harvesting your biometrics."
        />

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {techCards.map((card, i) => (
            <Card key={i} className="border-cyber-200 dark:border-cyber-800 flex flex-col justify-between">
              <CardHeader>
                <div className="h-12 w-12 rounded-xl bg-accent-500/10 dark:bg-accent-400/10 flex items-center justify-center mb-4">
                  <card.icon className="h-6 w-6 text-accent-500 dark:text-accent-400" />
                </div>
                <div className="text-xs font-semibold text-accent-500 dark:text-accent-400 uppercase tracking-wider mb-1">
                  Plain Language First
                </div>
                <p className="text-base font-medium text-foreground mb-3 italic">
                  &ldquo;{card.plainExplanation}&rdquo;
                </p>
                <CardTitle className="text-xl text-foreground font-bold">
                  {card.term}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {card.detail}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </Section>

      {/* THREE ASSURANCE TIERS COMPARISON */}
      <Section dark>
        <SectionHeader
          badge="Assurance Model"
          title="Three Tiers of Verified Humanity"
          subtitle="Choose the appropriate assurance level for every interaction, from everyday forum posts to high-value executive wire authorizations."
        />

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {tiers.map((t) => (
            <Card
              key={t.tier}
              className={`flex flex-col justify-between ${
                t.highlight
                  ? "border-accent-500 dark:border-accent-400 glow-accent relative"
                  : "border-cyber-200 dark:border-cyber-800"
              }`}
            >
              <div>
                {t.highlight && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <Badge>Recommended Baseline</Badge>
                  </div>
                )}
                <CardHeader>
                  <div className="text-xs font-bold text-accent-500 dark:text-accent-400">{t.tier}</div>
                  <CardTitle className="text-2xl font-bold">{t.name}</CardTitle>
                  <p className="text-xs text-muted-foreground mt-1">{t.target}</p>
                  <div className="mt-3 text-xs font-medium text-cyber-600 dark:text-cyber-300 bg-cyber-100 dark:bg-cyber-800/60 p-2 rounded-lg">
                    {t.enrollment}
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  {t.checks.map((chk, idx) => (
                    <div key={idx} className="flex items-start gap-2.5 text-xs">
                      {chk.included ? (
                        <Check className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                      ) : (
                        <X className="h-4 w-4 text-cyber-400 shrink-0 mt-0.5" />
                      )}
                      <span className={chk.included ? "text-foreground" : "text-muted-foreground line-through opacity-70"}>
                        {chk.name}
                      </span>
                    </div>
                  ))}
                </CardContent>
              </div>

              <div className="p-6 pt-0">
                <Link href="/dashboard/enroll">
                  <Button variant={t.highlight ? "default" : "outline"} className="w-full">
                    Enroll at {t.name}
                  </Button>
                </Link>
              </div>
            </Card>
          ))}
        </div>
      </Section>

      {/* SECURITY DESIGN SECTION */}
      <Section>
        <SectionHeader
          badge="Defense in Depth"
          title="Security & Governance Architecture"
          subtitle="Engineered for threat scenarios: compromised devices, coerced users, and rogue insiders."
        />

        <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          <Card className="border-cyber-200 dark:border-cyber-800">
            <CardHeader>
              <ShieldAlert className="h-8 w-8 text-danger mb-2" />
              <CardTitle className="text-lg">Instant Freeze on Suspicion</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground space-y-2">
              <p>
                Freeze keys immediately from your dashboard, the officer portal, or via single-use signed emergency links delivered to your inbox.
              </p>
              <p>
                Every subsequent verification attempt against a frozen key is blocked instantly and logged into the Attack Attempts audit ledger.
              </p>
            </CardContent>
          </Card>

          <Card className="border-cyber-200 dark:border-cyber-800">
            <CardHeader>
              <Cpu className="h-8 w-8 text-accent-500 dark:text-accent-400 mb-2" />
              <CardTitle className="text-lg">Tamper-Evident Hash Chain</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground space-y-2">
              <p>
                Every lifecycle event (enrollment, key rotation, freeze, recovery approval) is hashed into an append-only SHA-256 cryptographic chain.
              </p>
              <p>
                Anyone can independently verify the chain integrity at any time. Any modification to past history breaks the chain validation.
              </p>
            </CardContent>
          </Card>

          <Card className="border-cyber-200 dark:border-cyber-800">
            <CardHeader>
              <Lock className="h-8 w-8 text-accent-500 mb-2" />
              <CardTitle className="text-lg">Two-Officer Recovery Rule</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground space-y-2">
              <p>
                Key recovery cannot be performed remotely or by a single operator. Two distinct authenticated officers must physically inspect credentials and co-sign.
              </p>
              <p>
                Recovered keys observe a strict 48-hour activation delay, allowing the genuine owner time to intercept unauthorized recovery requests.
              </p>
            </CardContent>
          </Card>
        </div>
      </Section>

      {/* LIVE VERIFICATION PLAYGROUND */}
      <Section dark id="playground">
        <SectionHeader
          badge="Interactive Sandbox"
          title="Embedded Verification Playground"
          subtitle="Test how a verifier app requests a challenge, inspects zero-knowledge proofs, and validates authentic humans."
        />
        <div className="max-w-4xl mx-auto">
          <VerificationPlayground />
        </div>
      </Section>
    </div>
  );
}

