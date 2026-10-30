import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/page-header";
import { Section } from "@/components/layout/section";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = {
  title: "Terms of Service — CyberPlus",
  description: "Terms and conditions governing the CyberPlus prototype and developer APIs.",
};

export default function TermsPage() {
  return (
    <div className="pb-24">
      <PageHeader
        badge="Legal & Terms"
        title="Terms of Service"
        description="Terms and conditions governing access to the CyberPlus prototype, developer SDKs, and verification network."
      />

      <Section className="pt-0">
        <div className="max-w-4xl mx-auto space-y-8">
          <Badge variant="prototype" className="text-xs">
            DRAFT &mdash; Illustrative prototype terms [TODO: add legal text]
          </Badge>

          <Card className="border-cyber-200 dark:border-cyber-800 p-6 space-y-6 text-sm text-muted-foreground leading-relaxed">
            <div>
              <h2 className="text-lg font-bold text-foreground mb-2">1. Prototype License & Intended Use</h2>
              <p>
                CyberPlus is provided as a working technical MVP and prototype for evaluation, testing, and demonstration by incubator reviewers, partners, and developers. It is not currently certified for mission-critical life safety, regulated medical, or national defense deployments without separate mutual agreement.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-bold text-foreground mb-2">2. User Device Responsibilities</h2>
              <p>
                Because CyberPlus operates on zero-knowledge and WebAuthn principles, you are solely responsible for maintaining control of the hardware devices and authenticators you register. If your physical device is compromised or stolen, you must trigger an emergency key freeze through our provided self-service mechanisms or visit a certified partner location for two-officer physical recovery.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-bold text-foreground mb-2">3. Developer API & SDK Usage</h2>
              <p>
                Developers accessing our REST endpoints and npm packages agree to adhere to rate limits, refrain from malicious Sybil simulation attacks against production Merkle groups, and handle app-scoped nullifiers strictly within privacy regulations.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-bold text-foreground mb-2">4. Disclaimers & Limitations</h2>
              <p>
                THE PROTOTYPE AND CRYPTOGRAPHIC CIRCUITS ARE PROVIDED &ldquo;AS IS&rdquo; WITHOUT INDEPENDENT AUDIT WARRANTY. IN NO EVENT SHALL CYBERPLUS BE LIABLE FOR INDIRECT, INCIDENTAL, OR CONSEQUENTIAL DAMAGES ARISING OUT OF THE USE OF OR INABILITY TO USE THE NETWORK.
              </p>
            </div>

            <p className="text-xs text-cyber-500 font-mono pt-4 border-t border-cyber-800">
              [TODO: add legal text &mdash; Contact: [TODO: add contact email]]
            </p>
          </Card>
        </div>
      </Section>
    </div>
  );
}

