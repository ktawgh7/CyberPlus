import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ARTICLES } from "@/lib/articles";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calendar, Clock, Shield } from "lucide-react";

interface ArticlePageProps {
  params: Promise<{ slug: string }>;
}

export const dynamicParams = false;

export function generateStaticParams() {
  return ARTICLES.map((article) => ({ slug: article.slug }));
}

export async function generateMetadata({ params }: ArticlePageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = ARTICLES.find((a) => a.slug === slug);
  if (!article) return { title: "Article Not Found | CyberPlus" };

  return {
    title: `${article.title} — CyberPlus`,
    description: article.excerpt,
  };
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params;
  const article = ARTICLES.find((a) => a.slug === slug);

  if (!article) {
    notFound();
  }

  // Convert simple markdown headings and paragraphs into clean HTML elements
  const paragraphs = article.body.trim().split("\n\n");

  return (
    <div className="pt-32 pb-24">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        {/* Back navigation */}
        <Link href="/resources" className="inline-flex items-center text-sm text-cyber-400 hover:text-accent-400 mb-8 transition-colors">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to all resources
        </Link>

        {/* Article header */}
        <div className="space-y-4 border-b border-cyber-200 dark:border-cyber-800 pb-8 mb-8">
          <div className="flex flex-wrap items-center gap-3">
            <Badge variant="outline">{article.category}</Badge>
            <div className="flex items-center text-xs text-muted-foreground gap-1">
              <Calendar className="h-3.5 w-3.5" />
              <span>{article.publishedAt}</span>
            </div>
            <div className="flex items-center text-xs text-muted-foreground gap-1">
              <Clock className="h-3.5 w-3.5" />
              <span>{article.readTime}</span>
            </div>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-foreground leading-tight">
            {article.title}
          </h1>

          <p className="text-lg text-muted-foreground leading-relaxed">
            {article.excerpt}
          </p>
        </div>

        {/* Article content */}
        <div className="prose prose-slate dark:prose-invert max-w-none space-y-6 text-foreground leading-relaxed">
          {paragraphs.map((p, i) => {
            const trimmed = p.trim();
            if (trimmed.startsWith("# ")) {
              return null; // Skip main title since it is in header
            }
            if (trimmed.startsWith("### ")) {
              return (
                <h3 key={i} className="text-2xl font-bold mt-8 mb-4 text-foreground">
                  {trimmed.replace("### ", "")}
                </h3>
              );
            }
            if (trimmed.startsWith("## ")) {
              return (
                <h2 key={i} className="text-3xl font-bold mt-10 mb-4 text-foreground">
                  {trimmed.replace("## ", "")}
                </h2>
              );
            }
            if (trimmed.startsWith("- ") || trimmed.startsWith("1. ")) {
              const lines = trimmed.split("\n");
              return (
                <ul key={i} className="list-disc pl-6 space-y-2 text-muted-foreground">
                  {lines.map((l, j) => (
                    <li key={j} className="leading-relaxed">
                      {l.replace(/^[-*] /, "").replace(/^\d+\. /, "")}
                    </li>
                  ))}
                </ul>
              );
            }
            return (
              <p key={i} className="text-base text-muted-foreground leading-relaxed">
                {trimmed}
              </p>
            );
          })}
        </div>

        {/* Article footer callout */}
        <div className="mt-16 p-8 rounded-2xl border border-accent-500/20 dark:border-accent-400/20 bg-accent-500/5 dark:bg-accent-400/5 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-1">
            <h4 className="font-bold text-lg flex items-center gap-2">
              <Shield className="h-5 w-5 text-accent-500 dark:text-accent-400" />
              Try CyberPlus in action
            </h4>
            <p className="text-sm text-muted-foreground">
              Enroll your passkey to generate real zero-knowledge proofs and experience proof-of-human.
            </p>
          </div>
          <Link href="/pricing">
            <Button size="lg" className="shrink-0">
              Create Free Profile
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

