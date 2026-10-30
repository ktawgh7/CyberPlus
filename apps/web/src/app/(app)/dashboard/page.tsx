import React from "react";
import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ShieldCheck,
  Key,
  Clock,
  ArrowRight,
  AlertTriangle,
  Smartphone,
  CheckCircle2,
  Lock,
  Activity,
  Layers,
} from "lucide-react";

export default async function DashboardOverviewPage() {
  const user = await getCurrentUser();
  if (!user) return null;

  const profile = user.profile;
  const activeKey = profile?.identityKeys?.[0];
  const passkeysCount = await db.passkey.count({ where: { userId: user.id } });
  const connectedApps = await db.connectedApp.findMany({
    where: { userId: user.id },
    take: 3,
    orderBy: { connectedAt: "desc" },
  });
  const recentAudit = await db.auditLog.findMany({
    where: { userId: user.id },
    take: 4,
    orderBy: { timestamp: "desc" },
  });

  const isEnrolled = profile?.status === "ACTIVE";
  const isFrozen = profile?.status === "FROZEN";

  return (
    <div className="space-y-8">
      {/* ACTION BANNER */}
      {!user.emailVerified && (
        <div className="p-4 rounded-xl border border-amber-500/30 bg-amber-950/20 text-amber-300 text-sm flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-amber-400 shrink-0" />
            <span>Please verify your email address to unlock passkey enrollment.</span>
          </div>
          <Link href="/verify-email">
            <Button size="sm" variant="outline" className="border-amber-400 text-amber-400">
              Verify Email
            </Button>
          </Link>
        </div>
      )}

      {isFrozen && (
        <div className="p-4 rounded-xl border border-red-500/40 bg-red-950/30 text-red-300 text-sm flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-red-400 shrink-0" />
            <span>Your identity key is currently FROZEN. All proof requests are failing.</span>
          </div>
          <Link href="/dashboard/key">
            <Button size="sm" variant="destructive">
              Manage / Unfreeze Key
            </Button>
          </Link>
        </div>
      )}

      {/* 3 STATS CARDS */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-cyber-200 dark:border-cyber-800">
          <CardHeader className="pb-2">
            <CardDescription className="text-xs">Assurance Tier</CardDescription>
            <CardTitle className="text-2xl font-bold flex items-center gap-2">
              <Layers className="h-5 w-5 text-accent-400" />
              Tier {profile?.tier || 1}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">
              {profile?.tier === 3
                ? "Certified Center High Assurance"
                : profile?.tier === 2
                ? "Partner In-Person Verified"
                : "Remote Device Biometric (Tier 1)"}
            </p>
          </CardContent>
        </Card>

        <Card className="border-cyber-200 dark:border-cyber-800">
          <CardHeader className="pb-2">
            <CardDescription className="text-xs">Identity Key Status</CardDescription>
            <CardTitle className="text-2xl font-bold flex items-center gap-2">
              <Key className="h-5 w-5 text-accent-400" />
              {profile?.status ? profile.status.replace("_", " ") : "Not Enrolled"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">
              {activeKey ? `Active Commitment: ${activeKey.commitment.slice(0, 8)}...` : "Enroll passkey to activate"}
            </p>
          </CardContent>
        </Card>

        <Card className="border-cyber-200 dark:border-cyber-800">
          <CardHeader className="pb-2">
            <CardDescription className="text-xs">Device Authenticators</CardDescription>
            <CardTitle className="text-2xl font-bold flex items-center gap-2">
              <Smartphone className="h-5 w-5 text-accent-400" />
              {passkeysCount} Passkey{passkeysCount !== 1 ? "s" : ""}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">
              Hardware WebAuthn platform keys
            </p>
          </CardContent>
        </Card>

        <Card className="border-cyber-200 dark:border-cyber-800">
          <CardHeader className="pb-2">
            <CardDescription className="text-xs">Last Verified</CardDescription>
            <CardTitle className="text-2xl font-bold flex items-center gap-2">
              <Clock className="h-5 w-5 text-accent-400" />
              {profile?.lastVerifiedAt ? "Recent" : "Never"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">
              {profile?.lastVerifiedAt
                ? new Date(profile.lastVerifiedAt).toLocaleDateString()
                : "No verifications logged yet"}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* RECOMMENDED NEXT ACTION */}
      <Card className="border-accent-500/30 dark:border-accent-500/30 bg-gradient-to-r from-accent-500/10 via-transparent to-transparent p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <Badge variant="outline" className="text-xs mb-1">Recommended Next Step</Badge>
            <h3 className="text-xl font-bold text-foreground">
              {!isEnrolled
                ? "Complete Your Proof-of-Human Enrollment"
                : profile?.tier === 1
                ? "Upgrade to Tier 2 with In-Person Partner Verification"
                : "Test Your Key in the Working Demo Apps"}
            </h3>
            <p className="text-xs text-muted-foreground max-w-xl">
              {!isEnrolled
                ? "Unlock your device biometric scanner to derive your cancelable Semaphore identity key."
                : profile?.tier === 1
                ? "Book a 5-minute appointment at a partner location to unlock high-value wire transfers and sensitive actions."
                : "Simulate banking approvals, social post anti-bot proofs, and review duplication blocks."}
            </p>
          </div>

          <Link href={!isEnrolled ? "/dashboard/enroll" : profile?.tier === 1 ? "/dashboard/enroll" : "/demo/bank"}>
            <Button size="lg" className="shrink-0">
              {!isEnrolled ? "Begin Enrollment Flow" : profile?.tier === 1 ? "Book In-Person Check" : "Launch Demo Apps"}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </Card>

      {/* CONNECTED APPS & RECENT ACTIVITY */}
      <div className="grid md:grid-cols-2 gap-8">
        {/* Connected Apps Card */}
        <Card className="border-cyber-200 dark:border-cyber-800">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Connected Applications</CardTitle>
              <Link href="/dashboard/apps" className="text-xs text-accent-400 hover:underline">
                View All →
              </Link>
            </div>
            <CardDescription className="text-xs">
              Websites and applications that have verified your proof of human.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {connectedApps.length === 0 ? (
              <p className="text-xs text-muted-foreground py-4 text-center">
                No apps connected yet. Try the demo apps or integrate via SDK.
              </p>
            ) : (
              <div className="space-y-3">
                {connectedApps.map((app) => (
                  <div key={app.id} className="p-3 rounded-lg bg-cyber-100 dark:bg-cyber-900/60 border border-cyber-200 dark:border-cyber-800 flex justify-between items-center text-xs">
                    <div>
                      <div className="font-semibold text-foreground">{app.appName}</div>
                      <div className="font-mono text-[10px] text-cyber-500">
                        Pseudonym: {app.pseudonymousId}
                      </div>
                    </div>
                    <Badge variant="success" className="text-[10px]">Verified Human</Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Activity Card */}
        <Card className="border-cyber-200 dark:border-cyber-800">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Recent Audit Activity</CardTitle>
              <Link href="/dashboard/activity" className="text-xs text-accent-400 hover:underline">
                Audit Chain →
              </Link>
            </div>
            <CardDescription className="text-xs">
              Tamper-evident SHA-256 hash-chained security ledger.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {recentAudit.length === 0 ? (
              <p className="text-xs text-muted-foreground py-4 text-center">
                No audit events recorded yet.
              </p>
            ) : (
              <div className="space-y-3">
                {recentAudit.map((log) => (
                  <div key={log.id} className="p-3 rounded-lg bg-cyber-100 dark:bg-cyber-900/60 border border-cyber-200 dark:border-cyber-800 text-xs">
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-bold text-foreground">{log.action}</span>
                      <span className="text-[10px] text-cyber-500">
                        {new Date(log.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                    <div className="font-mono text-[10px] text-accent-400 truncate">
                      hash: {log.hash.slice(0, 24)}...
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

