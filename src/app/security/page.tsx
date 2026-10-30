import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/layout/page-header";
import { Section, SectionHeader } from "@/components/layout/section";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ShieldAlert,
  Lock,
  RotateCw,
  Key,
  Users2,
  FileCheck2,
  Clock,
  AlertTriangle,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Security Architecture — CyberPlus",
  description: "Comprehensive overview of CyberPlus cryptographic defense-in-depth and security models.",
};

export default function SecurityPage() {
  return (
    <div className="pb-24">
      <PageHeader
        badge="Zero-Trust Architecture"
        title="Security & Cryptographic Design"
        description="How CyberPlus delivers unforgeable proof-of-human assurance while defending against compromised endpoints, coerced users, and internal threats."
      />

      <Section className="pt-0">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* AUDIT NOTICE */}
          <div className="p-4 rounded-xl border border-amber-500/30 bg-amber-950/20 text-amber-300 text-xs flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-amber-400 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <span className="font-bold text-sm text-amber-200">Prototype Security Disclosure</span>
              <p>
                The cryptography implemented in this prototype has not been independently audited. This release demonstrates the architectural viability and user flows of WebAuthn PRF key derivation, cancelable biometrics, and Semaphore zero-knowledge proofs.
              </p>
            </div>
          </div>

          {/* DEFENSE-IN-DEPTH MATRIX */}
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="border-cyber-200 dark:border-cyber-800">
              <CardHeader>
                <Lock className="h-6 w-6 text-accent-400 mb-2" />
                <CardTitle className="text-lg">WebAuthn PRF Extension</CardTitle>
              </CardHeader>
              <CardContent className="text-xs text-muted-foreground leading-relaxed space-y-2">
                <p>
                  Identity secrets are derived directly on the client machine using WebAuthn&apos;s Pseudo-Random Function extension, bound to the user&apos;s physical biometric unlock (TouchID, FaceID, Windows Hello).
                </p>
                <p>
                  No private keys or identity secrets are ever sent to CyberPlus servers. In browsers without PRF support, a memory-hard client-side PIN KDF serves as an explicit fallback labeled &ldquo;software-protected&rdquo;.
                </p>
              </CardContent>
            </Card>

            <Card className="border-cyber-200 dark:border-cyber-800">
              <CardHeader>
                <RotateCw className="h-6 w-6 text-accent-400 mb-2" />
                <CardTitle className="text-lg">Cancelable Identity Keys</CardTitle>
              </CardHeader>
              <CardContent className="text-xs text-muted-foreground leading-relaxed space-y-2">
                <p>
                  Raw biometrics cannot be changed. CyberPlus keys solve this by combining the PRF output with a high-entropy device-side salt:
                </p>
                <code className="block bg-[#f4f4f4] border border-[#e2e2e2] p-2 rounded text-[#171a20]">
                  secret = HKDF-SHA256(PRF, salt, &ldquo;cyberplus:identity:v1&rdquo;)
                </code>
                <p>
                  Rotating the salt creates an entirely uncorrelated Semaphore identity and removes the old commitment from the group.
                </p>
              </CardContent>
            </Card>

            <Card className="border-cyber-200 dark:border-cyber-800">
              <CardHeader>
                <Users2 className="h-6 w-6 text-accent-400 mb-2" />
                <CardTitle className="text-lg">Two-Officer Physical Recovery</CardTitle>
              </CardHeader>
              <CardContent className="text-xs text-muted-foreground leading-relaxed space-y-2">
                <p>
                  To eliminate single-point-of-failure insider threats and remote SIM-swap vulnerabilities, account recovery cannot be performed remotely.
                </p>
                <p>
                  The user must present government credentials in person at a verified location. Two distinct authenticated officers must independently verify credentials and submit approvals. The database transaction strictly rejects recovery requests approved by only one officer.
                </p>
              </CardContent>
            </Card>

            <Card className="border-cyber-200 dark:border-cyber-800">
              <CardHeader>
                <Clock className="h-6 w-6 text-accent-400 mb-2" />
                <CardTitle className="text-lg">48-Hour Activation Delay</CardTitle>
              </CardHeader>
              <CardContent className="text-xs text-muted-foreground leading-relaxed space-y-2">
                <p>
                  All key rotations and recovery approvals enter a mandatory 48-hour activation delay before the new key can generate valid proofs.
                </p>
                <p>
                  During this window, immediate emergency freeze alerts are sent to all trusted contacts and registered communication channels, allowing genuine owners to halt unauthorized takeovers.
                </p>
              </CardContent>
            </Card>

            <Card className="border-cyber-200 dark:border-cyber-800">
              <CardHeader>
                <ShieldAlert className="h-6 w-6 text-danger mb-2" />
                <CardTitle className="text-lg">Duress Code Safeguard</CardTitle>
              </CardHeader>
              <CardContent className="text-xs text-muted-foreground leading-relaxed space-y-2">
                <p>
                  Users can configure a duress code in settings. If coerced into authenticating or requesting recovery, entering the duress code displays normal success screens while quietly triggering urgent notifications across internal officer networks and trusted emergency contacts.
                </p>
              </CardContent>
            </Card>

            <Card className="border-cyber-200 dark:border-cyber-800">
              <CardHeader>
                <FileCheck2 className="h-6 w-6 text-accent-400 mb-2" />
                <CardTitle className="text-lg">Tamper-Evident Hash Chain</CardTitle>
              </CardHeader>
              <CardContent className="text-xs text-muted-foreground leading-relaxed space-y-2">
                <p>
                  All security events are appended to a cryptographic hash chain:
                </p>
                <code className="block bg-[#f4f4f4] border border-[#e2e2e2] p-2 rounded text-[#171a20]">
                  hash = SHA-256(content + prevHash)
                </code>
                <p>
                  The application layer enforces append-only semantics. An independent verification utility recomputes the chain to detect any data manipulation.
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="text-center pt-8">
            <Link href="/how-the-prototype-works">
              <Button size="lg">Review Prototype Operational Status</Button>
            </Link>
          </div>
        </div>
      </Section>
    </div>
  );
}

