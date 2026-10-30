import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/layout/page-header";
import { Section, SectionHeader } from "@/components/layout/section";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, BookOpen } from "lucide-react";

export const metadata: Metadata = {
  title: "Protocol Glossary — CyberPlus",
  description:
    "Plain-language definitions of technical terms used across the CyberPlus architecture and zero-knowledge identity protocols.",
};

const terms = [
  {
    term: "Cancelable Biometric",
    category: "Cryptography",
    definition:
      "A digital security key derived from your physical traits that can be changed or replaced at any time without changing your physical body. If a key is compromised, rotating the salt generates a new key from the same biometric.",
  },
  {
    term: "Zero-Knowledge Proof (ZKP)",
    category: "Zero-Knowledge",
    definition:
      "A cryptographic method by which one party (the prover) can prove to another party (the verifier) that a given statement is true, without conveying any information apart from the fact that the statement is true.",
  },
  {
    term: "Nullifier",
    category: "Privacy / Semaphore",
    definition:
      "A deterministic cryptographic output created during zero-knowledge proof generation that is unique to a specific user and a specific app (scope). It prevents double-actions or multiple accounts on that app, while ensuring no two apps receive the same value.",
  },
  {
    term: "WebAuthn PRF Extension",
    category: "Hardware Security",
    definition:
      "The Pseudo-Random Function extension for WebAuthn. It allows a hardware platform authenticator (like TouchID, FaceID, or Windows Hello) to compute a high-entropy secret from an input salt upon user biometric verification.",
  },
  {
    term: "HKDF (HMAC-based Key Derivation Function)",
    category: "Cryptography",
    definition:
      "A standards-based key derivation function (RFC 5869) that expands pseudo-random keys into cryptographically strong output keys using HMAC-SHA256.",
  },
  {
    term: "Merkle Tree",
    category: "Data Structures",
    definition:
      "A tree of cryptographic hashes where every leaf represents an enrolled human's public commitment, and the top hash (Merkle root) cryptographically summarizes the entire set of verified humans.",
  },
  {
    term: "Duress Code",
    category: "Physical Security",
    definition:
      "A secondary PIN or credential that, when entered under physical coercion, appears to succeed normally on screen while silently triggering emergency security alerts across the administrative and officer networks.",
  },
  {
    term: "Activation Delay",
    category: "Governance",
    definition:
      "A mandatory 48-hour waiting period enforced after key rotation or two-officer recovery before the new key becomes active. It gives the legitimate account owner time to detect and freeze an unauthorized recovery.",
  },
  {
    term: "Two-Officer Rule",
    category: "Governance",
    definition:
      "A strict security control requiring two distinct, authenticated officers to independently inspect credentials and approve an in-person account recovery before a new key can be issued.",
  },
  {
    term: "Tamper-Evident Hash Chain",
    category: "Auditability",
    definition:
      "An append-only audit log where each entry contains a SHA-256 hash of its own data combined with the hash of the preceding entry. If any historical entry is altered, all subsequent hashes become mathematically invalid.",
  },
];

export default function GlossaryPage() {
  return (
    <div className="pb-24">
      <PageHeader
        badge="Protocol Reference"
        title="CyberPlus Terminology Glossary"
        description="Clear, non-jargon explanations of the cryptographic, mathematical, and operational concepts behind proof-of-human systems."
      >
        <Link href="/resources" className="inline-flex items-center text-sm text-cyber-400 hover:text-accent-400">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to all resources
        </Link>
      </PageHeader>

      <Section>
        <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {terms.map((item) => (
            <Card key={item.term} className="border-cyber-200 dark:border-cyber-800">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between mb-1">
                  <Badge variant="outline" className="text-xs">
                    {item.category}
                  </Badge>
                </div>
                <CardTitle className="text-lg font-bold text-foreground">
                  {item.term}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {item.definition}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </Section>
    </div>
  );
}

