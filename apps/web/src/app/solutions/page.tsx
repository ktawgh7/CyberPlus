import type { Metadata } from "next";
import Link from "next/link";
import {
  Building2,
  Video,
  Users,
  Heart,
  Star,
  Landmark,
  ArrowRight,
  ShieldAlert,
  CheckCircle2,
  ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Section, SectionHeader } from "@/components/layout/section";
import { PageHeader } from "@/components/layout/page-header";

export const metadata: Metadata = {
  title: "Solutions — Proof of Human by Sector",
  description:
    "See how CyberPlus stops deepfakes, bot swarms, and synthetic fraud across banking, video calls, social platforms, dating, and commerce.",
};

const solutions = [
  {
    icon: Building2,
    badge: "Financial Services",
    title: "Banks & High-Value Transfers",
    scenario:
      "A CFO or finance director gets requested to execute an emergency $25M offshore transfer. Traditional visual and voice cues can easily be faked by real-time neural avatars. With CyberPlus, wire policies enforce that any transfer above a configured threshold requires a Tier 2 or Tier 3 cryptographic proof of human, verified against the executive's physical device.",
    demoUrl: "/demo/bank",
    demoLabel: "Launch Banking Demo",
    tierNeeded: "Tier 2 or Tier 3 Required",
    impact: "Stops 100% of synthetic video call wire scams",
  },
  {
    icon: Video,
    badge: "Enterprise Communications",
    title: "Executive Video Calls & Town Halls",
    scenario:
      "Remote teams and board members regularly convene on Zoom, Teams, or Google Meet. Attackers join with injected synthetic video feeds or cloned voices of corporate leadership. With CyberPlus Call integration, every attendee generates a zero-knowledge proof for that specific room session, displaying a verified human badge alongside their stream.",
    demoUrl: "/demo/call",
    demoLabel: "Launch Video Call Demo",
    tierNeeded: "Tier 1 or Tier 2 Required",
    impact: "Room-scoped nullifiers prevent video call impersonation",
  },
  {
    icon: Users,
    badge: "Social Platforms",
    title: "Social Networks & Public Discourse",
    scenario:
      "Comment threads and political discussions are flooded by automated LLM bot swarms and coordinated troll networks. When platforms integrate the CyberPlus SDK, posting or replying requires a proof of human. Because nullifiers are app-scoped, each user gets exactly one identity per platform — preventing sybil attacks without unmasking real-world names.",
    demoUrl: "/demo/social",
    demoLabel: "Launch Social Network Demo",
    tierNeeded: "Tier 1 Basic",
    impact: "Mathematically enforces one account per unique human",
  },
  {
    icon: Heart,
    badge: "Trust & Safety",
    title: "Dating Applications",
    scenario:
      "Romance scams and catfishing operations utilize AI-generated photo galleries and synthetic persona profiles to manipulate vulnerable users. CyberPlus gives every dating profile a verified human badge. Users know their match is a unique, living human without the dating app ever collecting real government IDs or storing unencrypted photo archives.",
    demoUrl: "/demo/social",
    demoLabel: "View Identity Enforcement Demo",
    tierNeeded: "Tier 1 or Tier 2",
    impact: "Eliminates bot matches and bulk romance farm automation",
  },
  {
    icon: Star,
    badge: "E-Commerce & Marketplaces",
    title: "Marketplaces & Product Reviews",
    scenario:
      "Sellers purchase thousands of fake 5-star ratings or weaponize negative reviews against competitors. By binding the CyberPlus challenge scope to the exact product ID, the system enforces exactly one verified review per real human per product — permanently breaking fake review syndicates.",
    demoUrl: "/demo/reviews",
    demoLabel: "Launch Review Protection Demo",
    tierNeeded: "Tier 1 Basic",
    impact: "Enforces 1 review per product per verified individual",
  },
  {
    icon: Landmark,
    badge: "Public Sector",
    title: "Government & Public Benefit Distribution",
    scenario:
      "Government portals delivering disaster relief or social benefits suffer from automated identity theft and synthetic duplicate applications. CyberPlus Tier 3 anchors in-person center verification with multi-officer sign-off, providing high-assurance single-human distribution while safeguarding citizen privacy.",
    demoUrl: "/officer",
    demoLabel: "View Officer In-Person Flow",
    tierNeeded: "Tier 3 High Assurance",
    impact: "Closes fraud loops on multi-application benefit fraud",
  },
];

export default function SolutionsPage() {
  return (
    <div className="pb-24">
      <PageHeader
        badge="Enterprise & Platform Use Cases"
        title="Stopping Deepfakes Across Every Sector"
        description="Whether protecting $25M financial transactions, restoring integrity to social discussions, or validating video meetings — CyberPlus provides mathematically verifiable proof of presence."
      />

      <Section>
        <div className="space-y-12 max-w-5xl mx-auto">
          {solutions.map((s, idx) => (
            <Card
              key={s.title}
              className="border-cyber-200 dark:border-cyber-800 overflow-hidden hover:border-accent-500/40 transition-all duration-300"
            >
              <div className="grid md:grid-cols-3">
                <div className="p-6 md:p-8 md:col-span-2 flex flex-col justify-between">
                  <div>
                    <div className="flex flex-wrap items-center gap-2 mb-3">
                      <Badge variant="outline">{s.badge}</Badge>
                      <Badge variant="secondary" className="text-xs">
                        {s.tierNeeded}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-3 mb-3">
                      <div className="h-10 w-10 rounded-lg bg-accent-500/10 dark:bg-accent-400/10 flex items-center justify-center shrink-0">
                        <s.icon className="h-5 w-5 text-accent-500 dark:text-accent-400" />
                      </div>
                      <h2 className="text-2xl font-bold">{s.title}</h2>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed mt-4">
                      {s.scenario}
                    </p>
                  </div>

                  <div className="mt-6 pt-6 border-t border-cyber-100 dark:border-cyber-800 flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center gap-2 text-xs font-semibold text-accent-600 dark:text-accent-400">
                      <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                      <span>{s.impact}</span>
                    </div>
                    <Link href={s.demoUrl}>
                      <Button size="sm">
                        {s.demoLabel} <ArrowRight className="ml-1 h-3.5 w-3.5" />
                      </Button>
                    </Link>
                  </div>
                </div>

                <div className="bg-cyber-50 dark:bg-cyber-900/40 p-6 md:p-8 border-t md:border-t-0 md:border-l border-cyber-200 dark:border-cyber-800 flex flex-col justify-center">
                  <div className="space-y-4">
                    <h3 className="text-xs font-bold text-cyber-500 uppercase tracking-wider">
                      Attack Scenario
                    </h3>
                    <div className="p-3 rounded-lg bg-[#f4f4f4] border border-[#d0d1d2] text-xs text-[#393c41]">
                      <span className="font-semibold text-[#171a20] block mb-1">Traditional Failure:</span>
                      Synthetic bot or audio clone tricks human reviewer or visual KYC check.
                    </div>
                    <div className="p-3 rounded-lg bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-500/30 text-xs text-emerald-700 dark:text-emerald-300">
                      <span className="font-semibold block mb-1">CyberPlus Protection:</span>
                      Attacker lacks user&apos;s physical passkey and cannot construct a valid Semaphore ZK proof.
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </Section>
    </div>
  );
}

