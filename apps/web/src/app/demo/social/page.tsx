"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Users,
  MessageSquare,
  Send,
  ShieldCheck,
  Bot,
  AlertCircle,
  CheckCircle2,
  Sparkles,
  ArrowLeft,
  XCircle,
} from "lucide-react";

interface Post {
  id: string;
  author: string;
  nullifier: string;
  content: string;
  timestamp: string;
  tier: number;
}

export default function SocialDemoPage() {
  const [posts, setPosts] = useState<Post[]>([
    {
      id: "p1",
      author: "Alex V.",
      nullifier: "0x39a1f8b4...1278",
      content: "Finally, a social network where 100% of the comments are verified unique humans. No LLM bots, no coordinated astroturfing farm.",
      timestamp: "10 mins ago",
      tier: 2,
    },
    {
      id: "p2",
      author: "Elena R.",
      nullifier: "0x7c92b1a4...9941",
      content: "The best part is that the platform has no idea who I am in the real world. My nullifier proves I'm one real person without doxxing me.",
      timestamp: "25 mins ago",
      tier: 2,
    },
  ]);

  const [newContent, setNewContent] = useState("");
  const [verifying, setVerifying] = useState(false);
  const [statusMsg, setStatusMsg] = useState("");
  const [botError, setBotError] = useState("");

  const handlePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newContent.trim()) return;

    setVerifying(true);
    setStatusMsg("");
    setBotError("");

    try {
      // 1. Create verification challenge for app scope 'demo.social.feed'
      const chalRes = await fetch("/api/v1/challenges", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          appScope: "demo.social.feed",
          requiredTier: 1,
        }),
      });
      const challenge = await chalRes.json();

      // 2. Client-side proof simulation against real verification endpoint
      const verifyRes = await fetch("/api/v1/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          challengeId: challenge.id,
          proof: {
            merkleTreeRoot: challenge.scope,
            nullifier: "0x39a1f8b4c2e91278", // Alex's nullifier for this app
          },
        }),
      });

      const verifyData = await verifyRes.json();
      if (!verifyData.verified) {
        throw new Error(verifyData.reason || "Proof verification rejected");
      }

      const newPost: Post = {
        id: "p_" + Date.now(),
        author: "You (Verified Human)",
        nullifier: verifyData.nullifier.slice(0, 10) + "..." + verifyData.nullifier.slice(-4),
        content: newContent,
        timestamp: "Just now",
        tier: verifyData.tier || 1,
      };

      setPosts([newPost, ...posts]);
      setNewContent("");
      setStatusMsg("Zero-Knowledge proof validated! Post published.");
    } catch (err: any) {
      setBotError(err.message || "Verification failed");
    } finally {
      setVerifying(false);
    }
  };

  const handleBotAttackSimulation = async () => {
    setBotError("");
    setStatusMsg("");
    setVerifying(true);
    try {
      // Attempting to post without a valid passkey or with a fake nullifier
      const chalRes = await fetch("/api/v1/challenges", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          appScope: "demo.social.feed",
          requiredTier: 1,
        }),
      });
      const challenge = await chalRes.json();

      // Fake bot script sending fake proof
      const verifyRes = await fetch("/api/v1/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          challengeId: challenge.id,
          proof: {
            merkleTreeRoot: "0x_fake_bot_tree_root",
            nullifier: "0x_bot_swarm_script",
            commitment: "9988776655443322110099887766554433221100998877665544332211001122", // Simulated frozen/invalid key
          },
        }),
      });

      const data = await verifyRes.json();
      if (!data.verified) {
        setBotError(`BOT ATTACK REJECTED: ${data.reason}. Synthetic bot could not produce valid Semaphore proof.`);
      }
    } catch {
      setBotError("Bot script rejected: Verification handshake failed.");
    } finally {
      setVerifying(false);
    }
  };

  return (
    <div className="pt-24 pb-20 min-h-screen bg-[#f9f9f9] text-[#171a20]">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 space-y-8">
        {/* Navigation & Header */}
        <div className="flex justify-between items-center">
          <Link href="/solutions" className="text-xs text-cyber-400 hover:text-accent-400 inline-flex items-center">
            <ArrowLeft className="mr-1 h-3.5 w-3.5" /> Back to Solutions
          </Link>
          <Badge variant="prototype">Interactive SDK Demo</Badge>
        </div>

        <div>
          <div className="flex items-center gap-2 mb-1">
            <Users className="h-6 w-6 text-accent-400" />
            <h1 className="text-2xl font-bold tracking-tight">CyberPulse Social Feed</h1>
          </div>
          <p className="text-xs text-muted-foreground">
            A bot-free public feed. Every post requires a valid zero-knowledge proof of human. Enforces 1 account per human per platform.
          </p>
        </div>

        {/* POST COMPOSER */}
        <Card className="border-cyber-200 dark:border-cyber-800 p-6">
          <form onSubmit={handlePost} className="space-y-4">
            <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
              <span className="font-semibold text-foreground">Compose Human Post</span>
              <span className="text-[11px] text-accent-400 flex items-center gap-1">
                <ShieldCheck className="h-3.5 w-3.5" /> Proof of Human Required
              </span>
            </div>

            <Textarea
              required
              rows={3}
              placeholder="What's happening? (Posting will trigger cryptographic proof verification)..."
              value={newContent}
              onChange={(e) => setNewContent(e.target.value)}
              className="text-xs"
            />

            {statusMsg && (
              <div className="p-3 rounded-lg bg-emerald-950/30 border border-emerald-500/30 text-xs text-emerald-300 flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" />
                <span>{statusMsg}</span>
              </div>
            )}

            {botError && (
              <div className="p-3 rounded-lg bg-[#f4f4f4] border border-[#d0d1d2] text-xs text-[#171a20] flex items-center gap-2">
                <XCircle className="h-4 w-4 shrink-0 text-[#5c5e62]" />
                <span>{botError}</span>
              </div>
            )}

            <div className="flex flex-wrap justify-between items-center gap-3 pt-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleBotAttackSimulation}
                disabled={verifying}
                className="border-[#d0d1d2] text-[#171a20] hover:bg-[#f4f4f4] text-xs"
              >
                <Bot className="mr-1.5 h-3.5 w-3.5" /> Simulate Bot Script Attack
              </Button>

              <Button type="submit" disabled={verifying} size="sm">
                <Send className="mr-1.5 h-3.5 w-3.5" />
                {verifying ? "Generating ZK Proof..." : "Verify & Post"}
              </Button>
            </div>
          </form>
        </Card>

        {/* FEED POSTS */}
        <div className="space-y-4">
          <h2 className="text-sm font-bold text-cyber-400 uppercase tracking-wider text-[10px]">
            Verified Feed Activity
          </h2>

          {posts.map((post) => (
            <Card key={post.id} className="border-cyber-200 dark:border-cyber-800 p-5">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-foreground">{post.author}</span>
                    <Badge variant="success" className="text-[9px] py-0 px-1.5">
                      Verified Human (Tier {post.tier})
                    </Badge>
                  </div>
                  <div className="font-mono text-[10px] text-cyber-500 mt-0.5">
                    Nullifier: {post.nullifier}
                  </div>
                </div>
                <span className="text-[11px] text-muted-foreground">{post.timestamp}</span>
              </div>

              <p className="text-xs text-muted-foreground leading-relaxed mt-3">
                {post.content}
              </p>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

