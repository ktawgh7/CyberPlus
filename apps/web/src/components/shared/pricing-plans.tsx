"use client";

import React, { useState } from "react";
import Link from "next/link";
import { PageHeader } from "@/components/layout/page-header";
import { Section } from "@/components/layout/section";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check } from "lucide-react";

export function PricingPlans() {
  const [annual, setAnnual] = useState(false);

  return (
    <>
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
            type="button"
            onClick={() => setAnnual((prev) => !prev)}
            className="w-12 h-6 rounded-full bg-[#e2e2e2] p-1 relative transition-colors cursor-pointer"
            aria-label="Toggle billing frequency"
            aria-pressed={annual}
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
          <Card className="border-cyber-200 flex flex-col justify-between">
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
                  <span>Instant self-service key freeze &amp; rotation</span>
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
          <Card className="border-accent-500 glow-accent relative flex flex-col justify-between">
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
                  <span>Tier 2 &amp; Tier 3 in-person center appointments</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-emerald-500 shrink-0" />
                  <span>Wire transfer protection policy engine</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-emerald-500 shrink-0" />
                  <span>Central organization management &amp; CSV invites</span>
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
          <Card className="border-cyber-200 flex flex-col justify-between">
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
                  <span>Dedicated officer onboarding &amp; training</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-emerald-500 shrink-0" />
                  <span>White-label SDK &amp; custom JWKS keys</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-emerald-500 shrink-0" />
                  <span>99.99% uptime SLA &amp; 24/7 incident response</span>
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
    </>
  );
}

