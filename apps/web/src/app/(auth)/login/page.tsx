"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Shield, Fingerprint, AlertCircle, ArrowRight, Sparkles } from "lucide-react";
import { CyberPlusLogo } from "@/components/ui/logo";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "/dashboard";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [demoLoading, setDemoLoading] = useState(false);
  const [passkeyLoading, setPasskeyLoading] = useState(false);
  const [error, setError] = useState("");

  const handlePasswordLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Login failed");
      }

      window.location.href = redirect;
    } catch (err: any) {
      setError(err.message || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    setDemoLoading(true);
    setError("");
    try {
      const res = await fetch("/api/auth/demo-login", { method: "POST" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed demo login");
      window.location.href = redirect;
    } catch (err: any) {
      setError(err.message || "Failed to continue as demo user");
    } finally {
      setDemoLoading(false);
    }
  };

  const handlePasskeyLogin = async () => {
    setPasskeyLoading(true);
    setError("");
    try {
      const optRes = await fetch("/api/auth/passkey/login-options", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const options = await optRes.json();
      if (!optRes.ok) throw new Error(options.error || "Passkey login not available for this email");

      const { startAuthentication } = await import("@simplewebauthn/browser");
      const authResult = await startAuthentication({ optionsJSON: options });

      const verifyRes = await fetch("/api/auth/passkey/login-verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, response: authResult }),
      });
      const verifyData = await verifyRes.json();
      if (!verifyRes.ok) throw new Error(verifyData.error || "Passkey verification failed");

      window.location.href = redirect;
    } catch (err: any) {
      setError(err.message || "Passkey authentication failed. Please use password or register a passkey in Dashboard.");
    } finally {
      setPasskeyLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-28 pb-16 flex items-center justify-center px-4 bg-white">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 group">
            <CyberPlusLogo size={36} className="h-9 w-9 group-hover:scale-105 transition-transform" />
            <span className="text-2xl font-bold tracking-tight text-[#171a20]">
              Cyber<span className="text-[#3e6ae1]">Plus</span>
            </span>
          </Link>
          <h1 className="text-2xl font-bold mt-4 text-[#171a20]">Welcome back</h1>
          <p className="text-xs text-[#5c5e62] mt-1">
            Access your proof-of-human profile and key management
          </p>
        </div>

        <Card className="border-[#e2e2e2] bg-white">
          <CardContent className="pt-6 space-y-4">
            {/* DEMO USER QUICK ACCESS */}
            <div className="p-3.5 rounded-xl bg-[#3e6ae1]/10 border border-[#3e6ae1]/20 text-center space-y-2">
              <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-[#3e6ae1]">
                <Sparkles className="h-3.5 w-3.5" />
                <span>Incubator Reviewer Access</span>
              </div>
              <p className="text-[11px] text-[#5c5e62]">
                Skip form entry and explore all features immediately with a seeded test profile.
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={handleDemoLogin}
                disabled={demoLoading}
                className="w-full border-[#3e6ae1]/40 text-[#3e6ae1] hover:bg-[#3e6ae1]/10 font-semibold"
              >
                {demoLoading ? "Logging in..." : "Continue as Demo User"}
              </Button>
            </div>

            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[#e2e2e2]" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-[#5c5e62] font-semibold">Or log in with credentials</span>
              </div>
            </div>

            {error && (
              <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-xs text-red-600 flex items-center gap-2">
                <AlertCircle className="h-4 w-4 shrink-0 text-red-500" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handlePasswordLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold mb-1 text-[#5c5e62]">Email Address</label>
                <Input
                  required
                  type="email"
                  placeholder="alex@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-xs font-semibold text-[#5c5e62]">Password</label>
                  <Link href="/forgot-password" className="text-[11px] text-[#3e6ae1] hover:underline">
                    Forgot password?
                  </Link>
                </div>
                <Input
                  required
                  type="password"
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              <Button type="submit" disabled={loading} className="w-full">
                {loading ? "Signing in..." : "Log in"}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>

              <Button
                type="button"
                variant="secondary"
                onClick={handlePasskeyLogin}
                disabled={passkeyLoading}
                className="w-full"
              >
                <Fingerprint className="mr-2 h-4 w-4 text-[#3e6ae1]" />
                {passkeyLoading ? "Checking passkey..." : "Log in with Biometric Passkey"}
              </Button>
            </form>

            <div className="pt-4 border-t border-[#e2e2e2] flex justify-between text-xs text-[#5c5e62]">
              <Link href="/verify-email" className="hover:text-[#3e6ae1]">
                Resend verification?
              </Link>
              <span>
                Don&apos;t have an account?{" "}
                <Link href="/signup" className="text-[#3e6ae1] font-semibold hover:underline">
                  Sign up
                </Link>
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen pt-28 pb-16 flex items-center justify-center text-xs text-muted-foreground">Loading login...</div>}>
      <LoginForm />
    </Suspense>
  );
}
