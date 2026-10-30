"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Shield, CheckCircle2, AlertCircle, Lock } from "lucide-react";

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "";

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Password reset failed");
      setSuccess(true);
    } catch (err: any) {
      setError(err.message || "Failed to update password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="border-cyber-200 dark:border-cyber-800">
      <CardContent className="pt-6">
        {success ? (
          <div className="text-center space-y-4 py-4">
            <CheckCircle2 className="h-12 w-12 text-emerald-400 mx-auto" />
            <CardTitle className="text-lg text-emerald-300">Password Updated</CardTitle>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Your password has been changed. All prior active sessions have been invalidated for your security.
            </p>
            <div className="pt-4">
              <Link href="/login">
                <Button className="w-full">Log in with new password</Button>
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleReset} className="space-y-4">
            {error && (
              <div className="p-3 rounded-lg bg-red-950/30 border border-red-500/30 text-xs text-red-300 flex items-center gap-2">
                <AlertCircle className="h-4 w-4 shrink-0 text-red-400" />
                <span>{error}</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold mb-1 text-cyber-400">New Password</label>
              <Input
                required
                type="password"
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold mb-1 text-cyber-400">Confirm New Password</label>
              <Input
                required
                type="password"
                placeholder="••••••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>

            <Button type="submit" disabled={loading} className="w-full">
              <Lock className="mr-2 h-4 w-4" />
              {loading ? "Updating..." : "Save New Password"}
            </Button>
          </form>
        )}
      </CardContent>
    </Card>
  );
}

export default function ResetPasswordPage() {
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
          <h1 className="text-2xl font-bold mt-4">Create New Password</h1>
          <p className="text-xs text-muted-foreground mt-1">
            Choose a secure, unique password for your CyberPlus account.
          </p>
        </div>

        <Suspense fallback={<Card className="p-12 text-center text-xs text-muted-foreground">Loading password reset form...</Card>}>
          <ResetPasswordForm />
        </Suspense>
      </div>
    </div>
  );
}
