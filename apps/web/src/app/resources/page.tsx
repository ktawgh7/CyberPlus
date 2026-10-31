import type { Metadata } from "next";
import Link from "next/link";
import { ARTICLES } from "@/lib/articles";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Section, SectionHeader } from "@/components/layout/section";
import { PageHeader } from "@/components/layout/page-header";
import { BookOpen, FileText, ArrowRight, ShieldCheck } from "lucide-react";

export const metadata: Metadata = {
  title: "Resources & Articles — CyberPlus",
  description:
    "In-depth research on deepfakes, cancelable biometrics, zero-knowledge proofs, and cryptographic identity recovery.",
};

export default function ResourcesPage() {
  return (
    <div className="pb-24">
      <PageHeader
        badge="Knowledge Base & Research"
        title="Identity Security in the Synthetic Era"
        description="Original essays exploring the physics of identity, zero-knowledge mechanics, cancelable biometric keys, and why detection algorithms fail against modern generative models."
      >
        <div className="flex flex-wrap justify-center gap-4">
          <Link href="/resources/glossary">
            <Button variant="outline" size="sm">
              <BookOpen className="mr-2 h-4 w-4" />
              View Protocol Glossary
            </Button>
          </Link>
          <Link href="/how-the-prototype-works">
            <Button variant="outline" size="sm">
              <ShieldCheck className="mr-2 h-4 w-4" />
              How the Prototype Works
            </Button>
          </Link>
        </div>
      </PageHeader>

      {/* WHITEPAPER CARD */}
      <Section className="pt-0">
        <div className="max-w-5xl mx-auto">
          <Card className="border-accent-500/30 dark:border-accent-500/30 bg-gradient-to-r from-accent-500/10 via-transparent to-transparent p-6 md:p-8">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div className="space-y-2 max-w-2xl">
                <Badge variant="prototype">Academic & Technical Architecture</Badge>
                <h3 className="text-2xl font-bold text-foreground">
                  CyberPlus Protocol Whitepaper v0.9
                </h3>
                <p className="text-sm text-muted-foreground">
                  Mathematical specifications of WebAuthn PRF key derivation, HKDF-SHA256 salting, Semaphore group trees, and two-officer physical recovery thresholds.
                </p>
                <p className="text-xs font-mono text-cyber-500">
                  Status: [TODO: add whitepaper PDF]
                </p>
              </div>
              <Button disabled variant="outline" className="shrink-0 opacity-60">
                <FileText className="mr-2 h-4 w-4" />
                Download PDF [Coming Soon]
              </Button>
            </div>
          </Card>
        </div>
      </Section>

      {/* ARTICLES LIST */}
      <Section>
        <SectionHeader
          badge="Featured Analysis"
          title="Core Research Papers"
          subtitle="All articles are derived strictly from the technical principles and threat scenarios of the CyberPlus architecture."
        />

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {ARTICLES.map((article) => (
            <Link key={article.slug} href={`/resources/${article.slug}`}>
              <Card className="h-full border-cyber-200 dark:border-cyber-800 hover:border-accent-500/40 transition-all duration-300 flex flex-col justify-between group cursor-pointer hover:shadow-lg">
                <CardHeader>
                  <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
                    <Badge variant="secondary" className="text-[10px]">
                      {article.category}
                    </Badge>
                    <span>{article.readTime}</span>
                  </div>
                  <CardTitle className="text-lg font-bold group-hover:text-accent-500 dark:group-hover:text-accent-400 transition-colors leading-snug">
                    {article.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <CardDescription className="text-xs leading-relaxed line-clamp-3 text-muted-foreground">
                    {article.excerpt}
                  </CardDescription>
                  <div className="pt-2 flex items-center text-xs font-semibold text-accent-500 dark:text-accent-400 group-hover:translate-x-1 transition-transform">
                    Read full article <ArrowRight className="ml-1 h-3.5 w-3.5" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </Section>
    </div>
  );
}

