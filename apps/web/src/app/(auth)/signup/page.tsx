"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, AlertCircle, ArrowRight, CheckCircle2 } from "lucide-react";
import { CyberPlusLogo } from "@/components/ui/logo";

export default function SignupPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [accountType, setAccountType] = useState<"INDIVIDUAL" | "BUSINESS">("INDIVIDUAL");
  const [terms, setTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  // Password strength evaluation
  const getPasswordStrength = (pass: string) => {
    let score = 0;
    if (pass.length >= 8) score++;
    if (/[A-Z]/.test(pass)) score++;
    if (/[0-9]/.test(pass)) score++;
    if (/[^A-Za-z0-9]/.test(pass)) score++;
    return score;
  };

  const strength = getPasswordStrength(password);
  const strengthLabels = ["Weak", "Fair", "Good", "Strong"];
  const strengthColors = ["bg-red-500", "bg-amber-500", "bg-[#3e6ae1]", "bg-emerald-500"];

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (!terms) {
      setError("You must accept the terms of service");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, accountType, terms }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Signup failed");
      }

      setSuccess(true);
    } catch (err: any) {
      setError(err.message || "Failed to create account");
    } finally {
      setLoading(false);
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
          <h1 className="text-2xl font-bold mt-4 text-[#171a20]">Create your profile</h1>
          <p className="text-xs text-[#5c5e62] mt-1">
            Prove you are human across any service without exposing who you are.
          </p>
        </div>

        {success ? (
          <Card className="border-emerald-500/30 bg-emerald-50/50 text-center p-6">
            <CardContent className="pt-6 space-y-4">
              <CheckCircle2 className="h-12 w-12 text-emerald-500 mx-auto" />
              <CardTitle className="text-xl text-emerald-600">Account Created!</CardTitle>
              <p className="text-sm text-[#5c5e62] leading-relaxed">
                We&apos;ve sent an email verification link to <strong className="text-[#171a20]">{email}</strong>. Please check your inbox to verify your email before enrolling your passkey.
              </p>
              <div className="pt-4 space-y-2">
                <Link href="/login">
                  <Button className="w-full">Proceed to Log in</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="border-[#e2e2e2] bg-white">
            <CardHeader className="pb-4">
              <div className="flex rounded-lg bg-[#f4f4f4] p-1 mb-2">
                <button
                  type="button"
                  onClick={() => setAccountType("INDIVIDUAL")}
                  className={`flex-1 text-xs py-1.5 font-medium rounded-md transition-all ${
                    accountType === "INDIVIDUAL"
                      ? "bg-white text-[#171a20] shadow-xs"
                      : "text-[#5c5e62] hover:text-[#171a20]"
                  }`}
                >
                  Individual (Free)
                </button>
                <button
                  type="button"
                  onClick={() => setAccountType("BUSINESS")}
                  className={`flex-1 text-xs py-1.5 font-medium rounded-md transition-all ${
                    accountType === "BUSINESS"
                      ? "bg-white text-[#171a20] shadow-xs"
                      : "text-[#5c5e62] hover:text-[#171a20]"
                  }`}
                >
                  Business / Organization
                </button>
              </div>
            </CardHeader>

            <CardContent>
              {error && (
                <div className="p-3 mb-4 rounded-lg bg-red-500/10 border border-red-500/30 text-xs text-red-600 flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 shrink-0 text-red-500" />
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={handleSignup} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold mb-1 text-[#5c5e62]">Full Name</label>
                  <Input
                    required
                    placeholder="e.g. Maya Chen"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold mb-1 text-[#5c5e62]">Email Address</label>
                  <Input
                    required
                    type="email"
                    placeholder="maya@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold mb-1 text-[#5c5e62]">Password</label>
                  <Input
                    required
                    type="password"
                    placeholder="••••••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  {password && (
                    <div className="mt-2 space-y-1">
                      <div className="flex gap-1 h-1.5 w-full bg-[#e2e2e2] rounded-full overflow-hidden">
                        {[0, 1, 2, 3].map((step) => (
                          <div
                            key={step}
                            className={`flex-1 transition-all ${
                              step < strength ? strengthColors[strength - 1] : "bg-transparent"
                            }`}
                          />
                        ))}
                      </div>
                      <div className="text-[10px] text-[#5c5e62] text-right">
                        Strength: {strengthLabels[strength - 1] || "Too weak"}
                      </div>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold mb-1 text-[#5c5e62]">Confirm Password</label>
                  <Input
                    required
                    type="password"
                    placeholder="••••••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </div>

                <div className="flex items-start gap-2 pt-2">
                  <input
                    type="checkbox"
                    id="terms"
                    required
                    checked={terms}
                    onChange={(e) => setTerms(e.target.checked)}
                    className="mt-1 rounded border-[#e2e2e2] text-[#3e6ae1] focus:ring-[#3e6ae1]"
                  />
                  <label htmlFor="terms" className="text-xs text-[#5c5e62] leading-snug">
                    I agree to the{" "}
                    <Link href="/terms" className="text-[#3e6ae1] hover:underline">
                      Terms of Service
                    </Link>{" "}
                    and acknowledge the{" "}
                    <Link href="/privacy" className="text-[#3e6ae1] hover:underline">
                      Privacy Policy
                    </Link>
                    .
                  </label>
                </div>

                <Button type="submit" disabled={loading} className="w-full mt-4">
                  {loading ? "Creating Profile..." : "Sign up"}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </form>

              <div className="mt-6 pt-6 border-t border-[#e2e2e2] text-center text-xs text-[#5c5e62]">
                Already have an account?{" "}
                <Link href="/login" className="text-[#3e6ae1] font-semibold hover:underline">
                  Log in
                </Link>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
