"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Shield, ArrowLeft, Mail, CheckCircle2 } from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      setSubmitted(true);
    } catch {
      setSubmitted(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-28 pb-16 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 group">
            <Shield className="h-8 w-8 text-accent-500 dark:text-accent-400 group-hover:scale-110 transition-transform" />
            <span className="text-2xl font-bold tracking-tight">
              Cyber<span className="text-accent-500 dark:text-accent-400">Plus</span>
            </span>
          </Link>
          <h1 className="text-2xl font-bold mt-4">Reset password</h1>
          <p className="text-xs text-muted-foreground mt-1">
            Enter your registered email address to receive a secure reset link.
          </p>
        </div>

        <Card className="border-cyber-200 dark:border-cyber-800">
          <CardContent className="pt-6">
            {submitted ? (
              <div className="text-center space-y-4 py-4">
                <CheckCircle2 className="h-12 w-12 text-emerald-400 mx-auto" />
                <CardTitle className="text-lg">Check Your Email</CardTitle>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  If <strong className="text-foreground">{email}</strong> exists in our records, a secure single-use reset link has been dispatched.
                </p>
                <div className="pt-4">
                  <Link href="/login">
                    <Button variant="outline" className="w-full">Return to Log in</Button>
                  </Link>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold mb-1 text-cyber-400">Email Address</label>
                  <Input
                    required
                    type="email"
                    placeholder="you@domain.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>

                <Button type="submit" disabled={loading} className="w-full">
                  <Mail className="mr-2 h-4 w-4" />
                  {loading ? "Sending link..." : "Send Reset Link"}
                </Button>

                <div className="text-center pt-2">
                  <Link href="/login" className="text-xs text-muted-foreground hover:text-accent-400 inline-flex items-center">
                    <ArrowLeft className="mr-1 h-3.5 w-3.5" /> Back to Log in
                  </Link>
                </div>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

