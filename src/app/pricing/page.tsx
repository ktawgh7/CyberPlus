"use client";

import React, { useState } from "react";
import Link from "next/link";
import { PageHeader } from "@/components/layout/page-header";
import { Section, SectionHeader } from "@/components/layout/section";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionItem } from "@/components/ui/accordion";
import { Check, ArrowRight, ShieldCheck, Zap, Sparkles } from "lucide-react";

export default function PricingPage() {
  const [annual, setAnnual] = useState(false);
  const [checkoutLoading, setCheckoutLoading] = useState(false);

  const handleBusinessCheckout = async () => {
    setCheckoutLoading(true);
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan: annual ? "business_annual" : "business_monthly" }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        // Fallback demo redirect
        alert("Redirecting to Stripe Test Mode Checkout: " + (data.message || "Simulated Session"));
      }
    } catch (e) {
      alert("Stripe Test Mode: Setup required or redirecting to simulated portal.");
    } finally {
      setCheckoutLoading(false);
    }
  };

  return (
    <div className="pb-24">
      <PageHeader
        badge="Illustrative Pilot Pricing"
        title="Simple, Predictable Humanity Verification"
        description="Individual proof-of-human profiles are free forever. Enterprises pay per enrolled employee. Verifier applications pay a low per-verification utility fee."
      >
        <div className="flex items-center justify-center gap-3 mt-4">
          <span className={`text-sm ${!annual ? "font-bold text-foreground" : "text-muted-foreground"}`}>
            Monthly
          </span>
          <button
            onClick={() => setAnnual(!annual)}
            className="w-12 h-6 rounded-full bg-[#e2e2e2] dark:bg-[#222222] p-1 relative transition-colors cursor-pointer"
            aria-label="Toggle billing frequency"
          >
            <div
              className={`w-4 h-4 rounded-full bg-[#3e6ae1] transition-transform ${
                annual ? "translate-x-6" : "translate-x-0"
              }`}
            />
          </button>
          <span className={`text-sm flex items-center gap-1 ${annual ? "font-bold text-foreground" : "text-muted-foreground"}`}>
            Annual <Badge variant="prototype" className="text-[10px]">Save 20%</Badge>
          </span>
        </div>
      </PageHeader>

      {/* PLANS GRID */}
      <Section className="pt-0">
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Individual */}
          <Card className="border-cyber-200 dark:border-cyber-800 flex flex-col justify-between">
            <CardHeader>
              <Badge variant="secondary" className="w-fit mb-2">For Individuals</Badge>
              <CardTitle className="text-2xl font-bold">Individual</CardTitle>
              <div className="mt-4 flex items-baseline gap-1">
                <span className="text-4xl font-extrabold">$0</span>
                <span className="text-sm text-muted-foreground">/ forever</span>
              </div>
              <CardDescription className="text-xs mt-2">
                Your personal proof of human across all integrated apps and websites.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="space-y-2.5 text-xs text-muted-foreground">
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-emerald-500 shrink-0" />
                  <span>Tier 1 Basic (Remote passkey biometric unlock)</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-emerald-500 shrink-0" />
                  <span>Encrypted device-side recovery kit</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-emerald-500 shrink-0" />
                  <span>Instant self-service key freeze & rotation</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-emerald-500 shrink-0" />
                  <span>Unlimited zero-knowledge proofs generated</span>
                </li>
              </ul>
              <div className="pt-6">
                <Link href="/support">
                  <Button variant="outline" className="w-full">Get Started Free</Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Business */}
          <Card className="border-accent-500 dark:border-accent-400 glow-accent relative flex flex-col justify-between">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2">
              <Badge>Most Popular for Teams</Badge>
            </div>
            <CardHeader>
              <Badge variant="outline" className="w-fit mb-2 border-accent-400 text-accent-400">
                For Organizations
              </Badge>
              <CardTitle className="text-2xl font-bold">Business</CardTitle>
              <div className="mt-4 flex items-baseline gap-1">
                <span className="text-4xl font-extrabold">
                  {annual ? "$7.20" : "$9.00"}
                </span>
                <span className="text-sm text-muted-foreground">/ user / mo</span>
              </div>
              <CardDescription className="text-xs mt-2">
                Protect corporate video calls, wire transfers, and internal employee identity.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="space-y-2.5 text-xs text-muted-foreground">
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-emerald-500 shrink-0" />
                  <span className="text-foreground font-medium">Everything in Individual, plus:</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-emerald-500 shrink-0" />
                  <span>Tier 2 & Tier 3 in-person center appointments</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-emerald-500 shrink-0" />
                  <span>Wire transfer protection policy engine</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-emerald-500 shrink-0" />
                  <span>Central organization management & CSV invites</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-emerald-500 shrink-0" />
                  <span>Two-officer in-person physical recovery protocol</span>
                </li>
              </ul>
              <div className="pt-6">
                <Link href="/support">
                  <Button className="w-full font-bold">
                    Start Business Pilot
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Enterprise */}
          <Card className="border-cyber-200 dark:border-cyber-800 flex flex-col justify-between">
            <CardHeader>
              <Badge variant="secondary" className="w-fit mb-2">High Assurance</Badge>
              <CardTitle className="text-2xl font-bold">Enterprise</CardTitle>
              <div className="mt-4 flex items-baseline gap-1">
                <span className="text-3xl font-extrabold">Custom</span>
              </div>
              <CardDescription className="text-xs mt-2">
                Dedicated on-premise verification nodes, certified enrollment centers, and custom SLAs.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="space-y-2.5 text-xs text-muted-foreground">
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-emerald-500 shrink-0" />
                  <span>Custom verification volume commitments</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-emerald-500 shrink-0" />
                  <span>Dedicated officer onboarding & training</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-emerald-500 shrink-0" />
                  <span>White-label SDK & custom JWKS keys</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-emerald-500 shrink-0" />
                  <span>99.99% uptime SLA & 24/7 incident response</span>
                </li>
              </ul>
              <div className="pt-6">
                <Link href="/support">
                  <Button variant="outline" className="w-full">Contact Enterprise Team</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </Section>

      {/* VERIFIER USAGE MODEL */}
      <Section dark>
        <SectionHeader
          badge="Application Developers & Verifiers"
          title="Usage-Based Verification Pricing"
          subtitle="How platforms and applications pay for checking proof-of-human tokens."
        />
        <div className="max-w-4xl mx-auto">
          <Card className="border-cyber-200 dark:border-cyber-800 p-6 md:p-8">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <h3 className="text-xl font-bold mb-2">Developer Utility Model</h3>
                <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                  Building with CyberPlus is free in Sandbox mode. In production, verifier applications purchase verification credits on a simple pay-as-you-go curve.
                </p>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between py-1.5 border-b border-[#e2e2e2]">
                    <span className="text-[#5c5e62]">Sandbox Test Verifications</span>
                    <span className="font-bold text-[#3e6ae1]">Free & Unlimited</span>
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

