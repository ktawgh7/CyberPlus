"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { createCancelableIdentity } from "@/lib/client-key";
import {
  Key,
  RotateCw,
  Lock,
  Unlock,
  AlertTriangle,
  History,
  Clock,
  ShieldAlert,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Sparkles,
} from "lucide-react";

export default function KeyManagementPage() {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [statusMsg, setStatusMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [timeRemaining, setTimeRemaining] = useState<string | null>(null);

  const fetchProfile = async () => {
    try {
      const res = await fetch("/api/auth/me");
      const data = await res.json();
      if (data.user?.profile) {
        setProfile(data.user.profile);
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const activeKey = profile?.identityKeys?.[0];
  const isFrozen = profile?.status === "FROZEN";
  const isPending = profile?.status === "PENDING_ACTIVATION";

  // Calculate live activation countdown if pending
  useEffect(() => {
    if (!activeKey?.activatesAt || !isPending) {
      setTimeRemaining(null);
      return;
    }

    const interval = setInterval(() => {
      const target = new Date(activeKey.activatesAt).getTime();
      const diff = target - Date.now();
      if (diff <= 0) {
        setTimeRemaining("Activation Delay Complete — activating...");
        fetchProfile();
      } else {
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        setTimeRemaining(`${hours}h ${minutes}m ${seconds}s remaining`);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [activeKey, isPending]);

  // FREEZE
  const handleFreeze = async () => {
    setLoading(true);
    setStatusMsg("");
    setErrorMsg("");
    try {
      const res = await fetch("/api/key/freeze", { method: "POST" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Freeze failed");
      setStatusMsg("Identity key is now FROZEN. All verification checks will fail.");
      await fetchProfile();
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to freeze key");
    } finally {
      setLoading(false);
    }
  };

  // UNFREEZE
  const handleUnfreeze = async () => {
    setLoading(true);
    setStatusMsg("");
    setErrorMsg("");
    try {
      const res = await fetch("/api/key/unfreeze", { method: "POST" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Unfreeze failed");
      setStatusMsg("Identity key unfrozen successfully. Verifications restored.");
      await fetchProfile();
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to unfreeze key");
    } finally {
      setLoading(false);
    }
  };

  // ROTATE
  const handleRotate = async (fastForward = false) => {
    setLoading(true);
    setStatusMsg("");
    setErrorMsg("");
    try {
      // Derive new Semaphore key client-side with fresh salt
      const newKey = await createCancelableIdentity({});
      const res = await fetch("/api/key/rotate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          newCommitment: newKey.commitment,
          isSoftware: newKey.isSoftware,
          fastForwardDemo: fastForward,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Rotation failed");
      setStatusMsg(
        fastForward
          ? "Key rotated and activated immediately (Demo Fast-Forward)!"
          : "Key rotated! Entering 48-hour activation delay. A new emergency freeze link was emailed."
      );
      await fetchProfile();
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to rotate key");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Identity Key Lifecycle</h1>
        <p className="text-xs text-muted-foreground mt-1">
          Manage, freeze, rotate, or initiate two-officer physical recovery for your proof of human.
        </p>
      </div>

      {statusMsg && (
        <div className="p-4 rounded-xl bg-emerald-950/30 border border-emerald-500/30 text-xs text-emerald-300 flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" />
          <span>{statusMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div className="p-4 rounded-xl bg-red-950/30 border border-red-500/30 text-xs text-red-300 flex items-center gap-2">
          <AlertCircle className="h-4 w-4 shrink-0 text-red-400" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* CURRENT KEY STATUS CARD */}
      <Card className="border-cyber-200 dark:border-cyber-800">
        <CardHeader>
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <CardTitle className="text-xl flex items-center gap-2">
                <Key className="h-5 w-5 text-accent-400" />
                Active Cancelable Key
              </CardTitle>
              <CardDescription className="text-xs">
                Derived via WebAuthn PRF and renewable device salt.
              </CardDescription>
            </div>
            <Badge
              variant={
                isFrozen ? "destructive" : isPending ? "warning" : "success"
              }
              className="text-xs px-3 py-1"
            >
              {profile?.status || "NOT ENROLLED"}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 rounded-xl bg-[#f9f9f9] border border-[#e2e2e2] font-mono text-xs space-y-2">
            <div className="flex justify-between items-center text-cyber-400">
              <span>Public Commitment (Semaphore):</span>
              <span className="text-[10px] text-cyber-500">Tier {profile?.tier || 1}</span>
            </div>
            <p className="text-foreground break-all font-semibold">
              {activeKey?.commitment || "No commitment enrolled"}
            </p>
            {activeKey?.isSoftware && (
              <Badge variant="secondary" className="text-[10px]">
                Software-Protected PIN Fallback
              </Badge>
            )}
          </div>

          {/* 48-Hour Live Countdown Banner */}
          {isPending && timeRemaining && (
            <div className="p-4 rounded-xl bg-amber-950/30 border border-amber-500/40 text-xs text-amber-300 flex items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-amber-400 shrink-0" />
                <div>
                  <span className="font-bold block">48-Hour Activation Delay In Progress</span>
                  <span>{timeRemaining}</span>
                </div>
              </div>
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleRotate(true)}
                className="border-amber-400 text-amber-400 text-xs shrink-0"
              >
                Fast-Forward Delay (Demo Only)
              </Button>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3 pt-2">
            {isFrozen ? (
              <Button onClick={handleUnfreeze} disabled={loading} className="bg-emerald-600 hover:bg-emerald-700">
                <Unlock className="mr-2 h-4 w-4" /> Unfreeze Key (Restore Verifications)
              </Button>
            ) : (
              <Button onClick={handleFreeze} disabled={loading} variant="destructive">
                <Lock className="mr-2 h-4 w-4" /> Instant Freeze Key
              </Button>
            )}

            <Button onClick={() => handleRotate(false)} disabled={loading} variant="outline">
              <RotateCw className="mr-2 h-4 w-4" /> Rotate Key (New Salt)
            </Button>

            <Button
              onClick={() => handleRotate(true)}
              disabled={loading}
              variant="secondary"
              className="text-xs"
            >
              <Sparkles className="mr-1.5 h-3.5 w-3.5" /> Rotate & Fast-Forward (Demo Only)
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* KEY LOST & PHYSICAL RECOVERY PATH */}
      <Card className="border-cyber-200 dark:border-cyber-800 bg-cyber-900/30">
        <CardHeader>
          <div className="flex items-center gap-2">
            <ShieldAlert className="h-5 w-5 text-amber-400" />
            <CardTitle className="text-lg">Lost Your Hardware Device?</CardTitle>
          </div>
          <CardDescription className="text-xs">
            Recovery cannot be completed remotely over SMS or email. It requires physical two-officer in-person dual-custody approval.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-xs text-muted-foreground leading-relaxed">
            If you have lost your laptop or smartphone, do not panic. Your raw biometrics are not stored on our servers. You must visit a partner center with a physical government credential. Two distinct officers must independently verify your document and sign the recovery transaction.
          </p>
          <div className="flex gap-3">
            <Link href="/dashboard/enroll">
              <Button variant="outline" size="sm">
                Book Partner Recovery Visit
              </Button>
            </Link>
            <Link href="/officer">
              <Button variant="ghost" size="sm" className="text-accent-400">
                View Officer Recovery Queue →
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* KEY HISTORY TIMELINE */}
      <Card className="border-cyber-200 dark:border-cyber-800">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <History className="h-4 w-4 text-accent-400" />
              Key History Timeline
            </CardTitle>
            <span className="text-xs text-muted-foreground">Immutable Ledger</span>
          </div>
        </CardHeader>
        <CardContent>
          {profile?.identityKeys?.length === 0 ? (
            <p className="text-xs text-muted-foreground text-center py-4">No key history recorded.</p>
          ) : (
            <div className="space-y-4 border-l-2 border-cyber-800 pl-4 ml-2">
              {profile?.identityKeys?.map((k: any, i: number) => (
                <div key={k.id} className="relative space-y-1">
                  <div className="absolute -left-[21px] top-1 h-2.5 w-2.5 rounded-full bg-accent-400" />
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs text-foreground">
                      Key #{profile.identityKeys.length - i}: {k.status}
                    </span>
                    <Badge variant={k.status === "ACTIVE" ? "success" : "secondary"} className="text-[9px]">
                      Tier {k.tier}
                    </Badge>
                  </div>
                  <p className="font-mono text-[10px] text-cyber-500 break-all">
                    {k.commitment}
                  </p>
                  <p className="text-[10px] text-muted-foreground">
                    Created: {new Date(k.createdAt).toLocaleString()}
                    {k.revokedAt && ` • Revoked: ${new Date(k.revokedAt).toLocaleString()}`}
                  </p>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

