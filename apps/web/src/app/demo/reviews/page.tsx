"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Star,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  ArrowLeft,
  XCircle,
  ShoppingBag,
} from "lucide-react";

interface Review {
  id: string;
  author: string;
  nullifier: string;
  rating: number;
  comment: string;
  timestamp: string;
}

export default function ReviewsDemoPage() {
  const [reviews, setReviews] = useState<Review[]>([
    {
      id: "r1",
      author: "Verified Buyer",
      nullifier: "0x89b14c3e...df14",
      rating: 5,
      comment: "Incredible hardware noise cancellation. Zero background hiss during video calls.",
      timestamp: "Yesterday",
    },
    {
      id: "r2",
      author: "Verified Buyer",
      nullifier: "0x44a0e1b2...7781",
      rating: 4,
      comment: "Battery lasts easily 2 days. Build quality feels very sturdy.",
      timestamp: "3 days ago",
    },
  ]);

  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [verifying, setVerifying] = useState(false);
  const [statusMsg, setStatusMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [userSubmittedAlready, setUserSubmittedAlready] = useState(false);

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) return;

    setVerifying(true);
    setStatusMsg("");
    setErrorMsg("");

    try {
      if (userSubmittedAlready) {
        throw new Error("Duplicate Review Blocked: Your nullifier has already posted a review for this product. 1 review per human per product is strictly enforced.");
      }

      // 1. Create challenge scoped to this exact product ID
      const chalRes = await fetch("/api/v1/challenges", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          appScope: "marketplace.reviews.product_hdx99",
          requiredTier: 1,
        }),
      });
      const challenge = await chalRes.json();

      // 2. Submit proof with product-scoped nullifier
      const verifyRes = await fetch("/api/v1/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          challengeId: challenge.id,
          proof: {
            merkleTreeRoot: challenge.scope,
            nullifier: "0x89b14c3e7a02df14",
          },
        }),
      });

      const verifyData = await verifyRes.json();
      if (!verifyData.verified) {
        throw new Error(verifyData.reason || "Proof rejected");
      }

      const newReview: Review = {
        id: "r_" + Date.now(),
        author: "You (Verified Human)",
        nullifier: "0x89b14c3e...df14",
        rating,
        comment,
        timestamp: "Just now",
      };

      setReviews([newReview, ...reviews]);
      setComment("");
      setUserSubmittedAlready(true);
      setStatusMsg("Review published! Nullifier bound to product_hdx99.");
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to submit review");
    } finally {
      setVerifying(false);
    }
  };

  return (
    <div className="pt-24 pb-20 min-h-screen bg-[#f9f9f9] text-[#171a20]">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 space-y-8">
        <div className="flex justify-between items-center">
          <Link href="/solutions" className="text-xs text-cyber-400 hover:text-accent-400 inline-flex items-center">
            <ArrowLeft className="mr-1 h-3.5 w-3.5" /> Back to Solutions
          </Link>
          <Badge variant="prototype">Interactive SDK Demo</Badge>
        </div>

        {/* Product Card */}
        <Card className="border-cyber-200 dark:border-cyber-800 p-6 md:p-8">
          <div className="grid md:grid-cols-3 gap-6 items-center">
            <div className="h-44 rounded-xl bg-gradient-to-tr from-accent-500/20 to-neutral-800/40 border border-cyber-700 flex items-center justify-center">
              <ShoppingBag className="h-16 w-16 text-accent-400 opacity-80" />
            </div>

            <div className="md:col-span-2 space-y-3">
              <div className="flex items-center gap-2">
                <Badge variant="outline">SKU: HDX-9900</Badge>
                <div className="flex text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-current" />
                  ))}
                </div>
                <span className="text-xs text-muted-foreground">(4.8 / 5.0)</span>
              </div>

              <h1 className="text-2xl font-bold">Studio Active Noise Canceling Headphones</h1>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Protected by CyberPlus Marketplace Integrity. Every review on this page is cryptographically verified to originate from a unique human. Fake review farms cannot mint proofs.
              </p>
              <div className="text-xl font-bold text-accent-400">$299.00</div>
            </div>
          </div>
        </Card>

        {/* REVIEW COMPOSER */}
        <Card className="border-cyber-200 dark:border-cyber-800 p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-bold">Submit a Verified Human Review</h2>
              <p className="text-xs text-muted-foreground">
                One review per real human per product. Bound by app-scoped nullifiers.
              </p>
            </div>
            <Badge variant="success" className="text-xs">
              <ShieldCheck className="mr-1 h-3.5 w-3.5" /> 1-Review Enforced
            </Badge>
          </div>

          {statusMsg && (
            <div className="p-3 mb-4 rounded-lg bg-emerald-950/30 border border-emerald-500/30 text-xs text-emerald-300 flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" />
              <span>{statusMsg}</span>
            </div>
          )}

          {errorMsg && (
            <div className="p-3 mb-4 rounded-lg bg-[#f4f4f4] border border-[#d0d1d2] text-xs text-[#171a20] flex items-center gap-2">
              <XCircle className="h-4 w-4 shrink-0 text-[#5c5e62]" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmitReview} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold mb-1 text-cyber-400">Rating (1 to 5 Stars)</label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    type="button"
                    key={star}
                    onClick={() => setRating(star)}
                    className="p-1 cursor-pointer"
                  >
                    <Star
                      className={`h-6 w-6 transition-colors ${
                        star <= rating ? "text-amber-400 fill-current" : "text-cyber-700"
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold mb-1 text-cyber-400">Review Comments</label>
              <Textarea
                required
                rows={3}
                placeholder="Share your experience with this product..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="text-xs"
              />
            </div>

            <Button type="submit" disabled={verifying} size="sm">
              {verifying ? "Checking Nullifier..." : "Submit Verified Review"}
            </Button>
          </form>
        </Card>

        {/* REVIEWS LIST */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-cyber-400 uppercase tracking-wider text-[10px]">
            Verified Human Reviews ({reviews.length})
          </h3>

          {reviews.map((r) => (
            <Card key={r.id} className="border-cyber-200 dark:border-cyber-800 p-5">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-foreground">{r.author}</span>
                    <Badge variant="success" className="text-[9px]">Verified Human</Badge>
                  </div>
                  <div className="flex text-amber-400 mt-1">
                    {[...Array(r.rating)].map((_, i) => (
                      <Star key={i} className="h-3.5 w-3.5 fill-current" />
                    ))}
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[11px] text-muted-foreground">{r.timestamp}</span>
                  <div className="font-mono text-[9px] text-cyber-500 mt-0.5">
                    Nullifier: {r.nullifier}
                  </div>
                </div>
              </div>

              <p className="text-xs text-muted-foreground leading-relaxed mt-2">
                {r.comment}
              </p>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

