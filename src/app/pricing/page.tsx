import type { Metadata } from "next";
import Link from "next/link";
import { Section, SectionHeader } from "@/components/layout/section";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Accordion, AccordionItem } from "@/components/ui/accordion";
import { PricingPlans } from "@/components/shared/pricing-plans";
import { Zap } from "lucide-react";

export const metadata: Metadata = {
  title: "Pricing — Simple, Predictable Humanity Verification",
  description:
    "Individual proof-of-human profiles are free forever. Explore CyberPlus Business, Enterprise, and usage-based verifier pricing.",
};

export default function PricingPage() {
  return (
    <div className="pb-24">
      <PricingPlans />

      {/* VERIFIER USAGE MODEL */}
      <Section dark>
        <SectionHeader
          badge="Application Developers & Verifiers"
          title="Usage-Based Verification Pricing"
          subtitle="How platforms and applications pay for checking proof-of-human tokens."
        />
        <div className="max-w-4xl mx-auto">
          <Card className="border-cyber-200 p-6 md:p-8">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <h3 className="text-xl font-bold mb-2">Developer Utility Model</h3>
                <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                  Building with CyberPlus is free in Sandbox mode. In production, verifier applications purchase verification credits on a simple pay-as-you-go curve.
                </p>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between py-1.5 border-b border-[#e2e2e2]">
                    <span className="text-[#5c5e62]">Sandbox Test Verifications</span>
                    <span className="font-bold text-[#3e6ae1]">Free &amp; Unlimited</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-[#e2e2e2]">
                    <span className="text-[#5c5e62]">First 5,000 Live Checks / mo</span>
                    <span className="font-bold text-emerald-600">Included</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-[#e2e2e2]">
                    <span className="text-[#5c5e62]">Subsequent Live Verifications</span>
                    <span className="font-bold font-mono text-[#171a20]">[TODO: set price]</span>
                  </div>
                </div>
              </div>
              <div className="p-6 rounded-xl bg-[#f9f9f9] border border-[#e2e2e2] text-center space-y-3">
                <Zap className="h-8 w-8 text-[#3e6ae1] mx-auto" />
                <h4 className="font-bold text-base text-[#171a20]">Custom Integration</h4>
                <p className="text-xs text-[#5c5e62]">
                  Need custom verification limits or high-volume enterprise SLAs? Contact our solutions team.
                </p>
                <Link href="/support">
                  <Button size="sm" className="w-full">
                    Contact Solutions Team
                  </Button>
                </Link>
              </div>
            </div>
          </Card>
        </div>
      </Section>

      {/* PRICING FAQ */}
      <Section>
        <SectionHeader
          badge="FAQ"
          title="Frequently Asked Questions About Pricing"
        />
        <div className="max-w-3xl mx-auto">
          <Accordion>
            <AccordionItem title="Why are individual profiles free forever?" defaultOpen>
              CyberPlus believes every human on earth has an inherent right to prove their unique presence online without paying a toll. We monetize via enterprise employee seats and application verification volume fees, never by charging people to be human.
            </AccordionItem>
            <AccordionItem title="What happens during Stripe Test Mode checkout?">
              In this prototype build, clicking &ldquo;Start Business Pilot&rdquo; communicates with our live test Stripe checkout API route. If live test credentials are configured, it opens the Stripe Test Checkout page; otherwise, it confirms plan selection directly against the database.
            </AccordionItem>
            <AccordionItem title="Do you charge per user or per verification?">
              For organizations securing employees (e.g. video calls, wire approvals), pricing is per enrolled seat. For public websites checking forum commenters or reviews, verifier pricing is utility-based per verification call after the free monthly tier.
            </AccordionItem>
            <AccordionItem title="What if an employee leaves the company?">
              The business administrator can revoke that seat in one click from the business dashboard. The employee retains their personal individual proof-of-human profile, but corporate group affiliations and enterprise permissions are instantly stripped.
            </AccordionItem>
          </Accordion>
        </div>
      </Section>
    </div>
  );
}
