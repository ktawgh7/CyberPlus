import type { Metadata } from "next";
import Link from "next/link";
import {
  Shield,
  Key,
  Fingerprint,
  Lock,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Users,
  Building2,
  Heart,
  Star,
  ArrowRight,
  UserX,
  Video,
  MessageSquare,
  ArrowUp,
  ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Section, SectionHeader } from "@/components/layout/section";

export const metadata: Metadata = {
  title: "CyberPlus — Proving you are a human",
  description:
    "CyberPlus gives every person a verified proof-of-human profile that bots, deepfakes, and fraudsters cannot copy — without exposing who they are.",
};

const steps = [
  {
    icon: Fingerprint,
    title: "Biometric enrollment",
    description:
      "Your device checks your fingerprint or face — the biometric never leaves your phone or laptop. CyberPlus receives only a signed confirmation.",
  },
  {
    icon: Key,
    title: "One hard-to-guess key",
    description:
      "We combine the biometric confirmation with a random secret on your device to create a unique identity key. Raw biometrics are destroyed — only the key remains.",
  },
  {
    icon: Shield,
    title: "Your proof-of-human profile",
    description:
      'Apps ask CyberPlus one question: "Is this a real, unique human?" Your key proves it without revealing who you are.',
  },
  {
    icon: Lock,
    title: "Stay protected",
    description:
      "Your key is cancelable — replace it without changing your body. It freezes the moment you report a problem. Recovery happens only in person with two officers approving.",
  },
];

const solutions = [
  {
    icon: Building2,
    title: "Banks & Finance",
    description: "Stop deepfake impersonation on video calls. Require cryptographic proof before approving large transfers.",
    href: "/demo/bank",
    color: "text-[#3e6ae1]",
  },
  {
    icon: Users,
    title: "Social Networks",
    description: "One person, one account, enforced by math. Bots cannot fake a zero-knowledge proof.",
    href: "/demo/social",
    color: "text-emerald-600",
  },
  {
    icon: Heart,
    title: "Dating Apps",
    description: "Every match is a verified human. No catfishing, no deepfake profiles, no bots swiping.",
    href: "/solutions",
    color: "text-[#3e6ae1]",
  },
  {
    icon: Star,
    title: "Reviews & Marketplaces",
    description: "One review per real person per product. Fake review farms cannot produce valid proofs.",
    href: "/demo/reviews",
    color: "text-amber-600",
  },
];

export default function HomePage() {
  return (
    <div className="bg-white">
      {/* ===== HERO — Pure White Tesla.com Website Style ===== */}
      <section className="relative min-h-[88vh] flex flex-col justify-between pt-28 pb-12 overflow-hidden bg-white border-b border-[#e2e2e2]">
        {/* Subtle geometric grid background */}
        <div className="absolute inset-0 bg-grid opacity-50 pointer-events-none" />
        <div className="absolute top-20 right-1/4 w-96 h-96 bg-[#3e6ae1]/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-20 left-1/4 w-72 h-72 bg-neutral-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-12 sm:pt-20 text-center">
          <Badge variant="prototype" className="mb-6">
            Early-stage prototype
          </Badge>

          {/* Tesla-style bold title */}
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-[#171a20] leading-tight">
            Proving you are a human
          </h1>

          <p className="mt-4 text-lg sm:text-xl text-[#5c5e62] max-w-2xl mx-auto leading-relaxed">
            CyberPlus gives every person a verified &ldquo;proof of human&rdquo; profile
            that bots, deepfakes, and fraudsters cannot copy &mdash; without exposing who they are.
          </p>

          {/* Side-by-side Tesla CTA Buttons: Electric Blue "Order Now" style & White "Learn More" style */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/pricing">
              <Button size="xl" className="min-w-[180px]">
                Try it free
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/product">
              <Button variant="secondary" size="xl" className="min-w-[180px]">
                See how it works
              </Button>
            </Link>
          </div>

          {/* Tesla Carousel Dots */}
          <div className="mt-12 flex items-center justify-center gap-2">
            <span className="h-2 w-2 rounded-full bg-[#171a20]" />
            <span className="h-2 w-2 rounded-full bg-[#d0d1d2]" />
            <span className="h-2 w-2 rounded-full bg-[#d0d1d2]" />
          </div>
        </div>

        {/* Tesla.com Bottom Floating Action / Utility Bar */}
        <div className="relative mx-auto max-w-4xl px-4 mt-8 w-full">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/support"
              className="w-full sm:w-auto inline-flex items-center justify-between sm:justify-start gap-3 px-4 py-2.5 rounded-md bg-[#f4f4f4] hover:bg-[#ebebeb] border border-[#e2e2e2] text-xs font-medium text-[#5c5e62] transition-colors"
            >
              <div className="flex items-center gap-2">
                <MessageSquare className="h-4 w-4 text-[#171a20]" />
                <span>Ask a Question &ldquo;How does zero-knowledge proof work?&rdquo;</span>
              </div>
              <ArrowUp className="h-3.5 w-3.5 text-[#5c5e62]" />
            </Link>

            <Link
              href="/demo/bank"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-md bg-white hover:bg-[#f4f4f4] border border-[#d0d1d2] text-xs font-medium text-[#171a20] transition-colors"
            >
              <ShieldCheck className="h-4 w-4 text-[#3e6ae1]" />
              <span>Test Live Bank Transfer Demo</span>
            </Link>
          </div>
        </div>
      </section>

      {/* ===== THE $25M STORY ===== */}
      <Section dark>
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <Badge variant="secondary" className="mb-4">
              <AlertTriangle className="mr-1 h-3 w-3" />
              Real incident
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#171a20]">
              A finance worker joined a video call. The CFO and colleagues were
              all <span className="text-[#3e6ae1]">deepfakes</span>.
            </h2>
            <p className="mt-4 text-base sm:text-lg text-[#5c5e62] leading-relaxed">
              Result: $25 million wired to fraudsters. Faces and voices used
              to be proof of identity. Voice clones and fake video are now cheap
              and realistic &mdash; trust signals built for a world where faking a
              human was expensive are breaking.
            </p>
            <p className="mt-4 text-sm text-[#5c5e62] leading-relaxed">
              Detecting fakes is a losing arms race. The durable fix is to stop
              trusting faces and voices and instead check a{" "}
              <strong className="text-[#171a20]">cryptographic proof</strong>{" "}
              that a real, unique human is present right now.
            </p>
          </div>
          <div className="relative">
            <div className="rounded-2xl border border-[#e2e2e2] bg-white p-8 shadow-xs">
              <div className="grid grid-cols-2 gap-4 mb-6">
                {["CFO", "Director", "Manager", "Analyst"].map((role) => (
                  <div
                    key={role}
                    className="rounded-xl bg-[#f9f9f9] border border-[#e2e2e2] p-4 text-center"
                  >
                    <UserX className="h-8 w-8 mx-auto text-[#5c5e62] mb-2" />
                    <p className="text-sm font-semibold text-[#171a20]">{role}</p>
                    <Badge variant="secondary" className="mt-1 text-[10px]">
                      DEEPFAKE
                    </Badge>
                  </div>
                ))}
              </div>
              <div className="text-center pt-2">
                <p className="text-3xl font-bold text-[#171a20]">$25,000,000</p>
                <p className="text-xs text-[#5c5e62] mt-1">
                  Wired to fraudsters in Hong Kong
                </p>
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* ===== HOW IT WORKS (4 Steps) ===== */}
      <Section>
        <SectionHeader
          badge="How it works"
          title="Four steps to unforgeable identity"
          subtitle="No raw biometrics stored. No cross-site tracking. One person, one proof."
        />
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, i) => (
            <div key={i} className="relative group">
              <Card className="relative h-full transition-all duration-200 hover:shadow-md hover:border-[#3e6ae1]/40 bg-white">
                <CardContent className="pt-6 text-center">
                  <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-[#3e6ae1]/10 text-[#3e6ae1]">
                    <step.icon className="h-7 w-7 text-[#3e6ae1]" />
                  </div>
                  <div className="text-xs font-bold text-[#3e6ae1] uppercase tracking-wider mb-2">
                    STEP {i + 1}
                  </div>
                  <h3 className="font-bold text-lg text-[#171a20] mb-2">{step.title}</h3>
                  <p className="text-sm text-[#5c5e62] leading-relaxed">
                    {step.description}
                  </p>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      </Section>

      {/* ===== FAKE CFO vs REAL CFO DEMO STRIP ===== */}
      <Section dark>
        <SectionHeader
          badge="Live demo"
          title="Fake CFO vs. Real CFO"
          subtitle="Watch what happens when an impostor tries to authorize a transfer — and when a verified human does."
        />
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Fake CFO */}
          <Card className="border-[#d0d1d2] overflow-hidden bg-white">
            <div className="bg-[#f4f4f4] p-4 flex items-center gap-3 border-b border-[#e2e2e2]">
              <Video className="h-5 w-5 text-[#171a20]" />
              <span className="font-semibold text-[#171a20]">Impostor Call</span>
              <Badge variant="destructive" className="ml-auto text-[10px]">
                DEEPFAKE
              </Badge>
            </div>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <XCircle className="h-5 w-5 text-[#5c5e62] shrink-0 mt-0.5" />
                  <p className="text-sm font-medium text-[#171a20]">
                    &ldquo;Approve the $25M transfer now.&rdquo;
                  </p>
                </div>
                <div className="rounded-lg bg-[#f4f4f4] p-4 border border-[#e2e2e2]">
                  <p className="text-xs font-semibold text-[#5c5e62] mb-1">
                    CyberPlus verification requested…
                  </p>
                  <div className="flex items-center gap-2">
                    <XCircle className="h-4 w-4 text-[#171a20]" />
                    <span className="text-sm font-bold text-[#171a20]">
                      FAILED — No valid proof of human
                    </span>
                  </div>
                </div>
                <div className="rounded-lg bg-[#f4f4f4] p-4 text-xs text-[#5c5e62]">
                  <strong className="text-[#171a20]">Transfer blocked.</strong>{" "}
                  The deepfake cannot produce a cryptographic zero-knowledge proof. The real
                  CFO&apos;s key resides securely on their physical hardware.
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Real CFO */}
          <Card className="border-[#3e6ae1]/40 overflow-hidden bg-white">
            <div className="bg-[#3e6ae1]/10 p-4 flex items-center gap-3 border-b border-[#3e6ae1]/20">
              <Video className="h-5 w-5 text-[#3e6ae1]" />
              <span className="font-semibold text-[#3e6ae1]">
                Verified Call
              </span>
              <Badge className="ml-auto text-[10px] bg-[#3e6ae1]">VERIFIED HUMAN</Badge>
            </div>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-[#3e6ae1] shrink-0 mt-0.5" />
                  <p className="text-sm font-medium text-[#171a20]">
                    &ldquo;Please verify before approving.&rdquo;
                  </p>
                </div>
                <div className="rounded-lg bg-[#3e6ae1]/10 p-4 border border-[#3e6ae1]/20">
                  <p className="text-xs font-semibold text-[#3e6ae1] mb-1">
                    CyberPlus verification requested…
                  </p>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-[#3e6ae1]" />
                    <span className="text-sm font-bold text-[#3e6ae1]">
                      VERIFIED — Unique human, Tier 3
                    </span>
                  </div>
                </div>
                <div className="rounded-lg bg-[#f4f4f4] p-4 text-xs text-[#5c5e62]">
                  <strong className="text-[#171a20]">Transfer approved.</strong>{" "}
                  The real CFO unlocked device biometrics, generating a zero-knowledge
                  Semaphore proof with a unique nullifier.
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </Section>

      {/* ===== SOLUTIONS HIGHLIGHTS ===== */}
      <Section>
        <SectionHeader
          badge="Solutions"
          title="Proof of human for every trust problem"
          subtitle="The same gap hurts banks, social networks, dating apps, and review sites."
        />
        <div className="grid sm:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {solutions.map((s) => (
            <Link key={s.title} href={s.href}>
              <Card className="h-full transition-all duration-200 hover:shadow-md hover:border-[#3e6ae1]/40 cursor-pointer group bg-white">
                <CardContent className="pt-6">
                  <s.icon className={`h-8 w-8 ${s.color} mb-4`} />
                  <h3 className="font-bold text-lg text-[#171a20] mb-2 group-hover:text-[#3e6ae1] transition-colors">
                    {s.title}
                  </h3>
                  <p className="text-sm text-[#5c5e62] leading-relaxed">{s.description}</p>
                  <div className="mt-4 flex items-center gap-1 text-sm font-medium text-[#3e6ae1]">
                    Try the demo <ArrowRight className="h-4 w-4" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </Section>

      {/* ===== PRICING TEASER ===== */}
      <Section dark>
        <SectionHeader
          badge="Pricing"
          title="Start free, scale with confidence"
          subtitle="Illustrative pilot pricing. Individual accounts are always free."
        />
        <div className="grid sm:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {[
            { name: "Individual", price: "Free", desc: "Personal proof-of-human profile", cta: "Sign up free" },
            { name: "Business", price: "$9/user/mo", desc: "Per enrolled employee, billed monthly", cta: "Start trial", featured: true },
            { name: "Enterprise", price: "Contact us", desc: "Custom deployment, SLA, and support", cta: "Get in touch" },
          ].map((plan) => (
            <Card
              key={plan.name}
              className={`bg-white ${plan.featured ? "border-[#3e6ae1] glow-accent relative" : ""}`}
            >
              {plan.featured && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <Badge className="bg-[#3e6ae1] text-white">Most popular</Badge>
                </div>
              )}
              <CardContent className="pt-6 text-center">
                <h3 className="font-bold text-lg text-[#171a20]">{plan.name}</h3>
                <p className="text-3xl font-bold mt-2 text-[#171a20]">{plan.price}</p>
                <p className="text-sm text-[#5c5e62] mt-2">{plan.desc}</p>
                <Link href={plan.name === "Enterprise" ? "/support" : "/signup"}>
                  <Button
                    variant={plan.featured ? "default" : "secondary"}
                    className="mt-6 w-full"
                  >
                    {plan.cta}
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
        <p className="text-center text-xs text-[#5c5e62] mt-6">
          Prices marked &ldquo;Illustrative pilot pricing&rdquo;.{" "}
          <Link href="/pricing" className="text-[#3e6ae1] hover:underline">
            See full pricing →
          </Link>
        </p>
      </Section>

      {/* ===== FINAL CTA ===== */}
      <Section>
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#171a20]">
            Ready to prove you are human?
          </h2>
          <p className="mt-4 text-base sm:text-lg text-[#5c5e62] leading-relaxed">
            Sign up for free, enroll in under two minutes, and start using your
            proof-of-human profile across every app that supports CyberPlus.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/pricing">
              <Button size="xl" className="min-w-[180px]">
                Get started free
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/product">
              <Button variant="secondary" size="xl" className="min-w-[180px]">
                Explore product
              </Button>
            </Link>
          </div>
        </div>
      </Section>
    </div>
  );
}
