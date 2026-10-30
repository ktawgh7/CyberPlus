"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ShieldCheck, EyeOff, Trash2, ExternalLink, CheckCircle2 } from "lucide-react";

export default function ConnectedAppsPage() {
  const [apps, setApps] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [statusMsg, setStatusMsg] = useState("");

  const fetchApps = async () => {
    try {
      const res = await fetch("/api/apps/list");
      const data = await res.json();
      if (data.apps) setApps(data.apps);
    } catch {
      // Fallback
    }
  };

  useEffect(() => {
    fetchApps();
  }, []);

  const handleDisconnect = async (appId: string) => {
    setLoading(true);
    setStatusMsg("");
    try {
      const res = await fetch("/api/apps/disconnect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ appId }),
      });
      if (res.ok) {
        setStatusMsg("Application disconnected and session revoked.");
        await fetchApps();
      }
    } catch {
      // Error
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Connected Applications</h1>
        <p className="text-xs text-muted-foreground mt-1">
          Review which third-party applications have verified your proof of human and inspect the app-scoped pseudonymous ID each application sees.
        </p>
      </div>

      {statusMsg && (
        <div className="p-4 rounded-xl bg-emerald-950/30 border border-emerald-500/30 text-xs text-emerald-300 flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" />
          <span>{statusMsg}</span>
        </div>
      )}

      {/* PRIVACY NOTICE */}
      <div className="p-4 rounded-xl bg-accent-500/10 border border-accent-400/20 text-xs text-cyber-300 flex items-start gap-3">
        <EyeOff className="h-5 w-5 text-accent-400 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <span className="font-bold text-foreground">Zero Cross-Site Tracking Guarantee</span>
          <p className="leading-relaxed">
            Each application receives a distinct pseudonymous nullifier derived solely for that app scope. Two different applications can never correlate your activity or merge your profiles. Applications can only see: <strong className="text-foreground">&ldquo;Verified unique human: yes&rdquo;</strong>.
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {apps.length === 0 ? (
          <Card className="border-cyber-200 dark:border-cyber-800 p-8 text-center">
            <p className="text-xs text-muted-foreground">No applications currently connected.</p>
          </Card>
        ) : (
          apps.map((app) => (
            <Card key={app.id} className="border-cyber-200 dark:border-cyber-800">
              <CardContent className="pt-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-base text-foreground">{app.appName}</h3>
                      <Badge variant="outline" className="text-[10px] font-mono">
                        {app.appId}
                      </Badge>
                    </div>

                    <div className="space-y-1 text-xs">
                      <div className="text-muted-foreground">
                        Pseudonymous ID: <code className="font-mono text-accent-400">{app.pseudonymousId}</code>
                      </div>
                      <div className="text-muted-foreground">
                        Data Shared: <span className="font-semibold text-emerald-400">Verified Unique Human: YES</span> (No name, email, or IP)
                      </div>
                      <div className="text-[11px] text-cyber-500">
                        Connected: {new Date(app.connectedAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDisconnect(app.appId)}
                    disabled={loading}
                    className="border-red-500/40 text-danger hover:bg-danger/10 shrink-0 text-xs"
                  >
                    <Trash2 className="mr-1.5 h-3.5 w-3.5" /> Disconnect App
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}

