"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Shield, CheckCircle2, AlertCircle, RefreshCw } from "lucide-react";

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [status, setStatus] = useState<"verifying" | "success" | "error" | "manual">(
    token ? "verifying" : "manual"
  );
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    if (!token) return;

    const verify = async () => {
      try {
        const res = await fetch("/api/auth/verify-email", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Verification failed");
        setStatus("success");
      } catch (err: any) {
        setStatus("error");
        setErrorMsg(err.message || "Failed to verify email token");
      }
    };

    verify();
  }, [token]);

  return (
    <Card className="border-cyber-200 dark:border-cyber-800 p-6">
      <CardContent className="pt-6 space-y-4">
        {status === "verifying" && (
          <>
            <RefreshCw className="h-12 w-12 text-accent-400 animate-spin mx-auto" />
            <CardTitle className="text-xl">Verifying your email...</CardTitle>
            <p className="text-xs text-muted-foreground">
              Validating your cryptographic single-use email token with CyberPlus.
            </p>
          </>
        )}

        {status === "success" && (
          <>
            <CheckCircle2 className="h-12 w-12 text-emerald-400 mx-auto" />
            <CardTitle className="text-xl text-emerald-300">Email Verified!</CardTitle>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Your email address has been confirmed. You are now authorized to register your biometric passkey and derive your identity key.
            </p>
            <div className="pt-4">
              <Link href="/dashboard/enroll">
                <Button className="w-full">Proceed to Biometric Enrollment</Button>
              </Link>
            </div>
          </>
        )}

        {status === "error" && (
          <>
            <AlertCircle className="h-12 w-12 text-red-400 mx-auto" />
            <CardTitle className="text-xl text-red-300">Verification Failed</CardTitle>
            <p className="text-xs text-red-400 leading-relaxed">{errorMsg}</p>
            <div className="pt-4">
              <Link href="/login">
                <Button variant="outline" className="w-full">Return to Log in</Button>
              </Link>
            </div>
          </>
        )}

        {status === "manual" && (
          <>
            <Shield className="h-12 w-12 text-accent-400 mx-auto" />
            <CardTitle className="text-xl">Check your inbox</CardTitle>
            <p className="text-xs text-muted-foreground leading-relaxed">
              We have dispatched a verification link to your email address. Click the link in that email to proceed to passkey enrollment.
            </p>
            <div className="pt-4">
              <Link href="/login">
                <Button variant="outline" className="w-full">Return to Log in</Button>
              </Link>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}

export default function VerifyEmailPage() {
  return (
    <div className="min-h-screen pt-28 pb-16 flex items-center justify-center px-4">
      <div className="w-full max-w-md text-center">
        <Link href="/" className="inline-flex items-center gap-2 mb-8 group">
          <Shield className="h-8 w-8 text-accent-500 dark:text-accent-400 group-hover:scale-110 transition-transform" />
          <span className="text-2xl font-bold tracking-tight">
            Cyber<span className="text-accent-500 dark:text-accent-400">Plus</span>
          </span>
        </Link>
        <Suspense fallback={<Card className="p-12 text-center text-xs text-muted-foreground">Loading verification state...</Card>}>
          <VerifyEmailContent />
        </Suspense>
      </div>
    </div>
  );
}
