"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, XCircle, RefreshCw, Terminal, Play, Shield } from "lucide-react";

export function VerificationPlayground() {
  const [tier, setTier] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);
  const [status, setStatus] = useState<"idle" | "challenging" | "proving" | "verified" | "failed">("idle");
  const [log, setLog] = useState<string[]>([]);
  const [result, setResult] = useState<{
    verified?: boolean;
    nullifier?: string;
    tier?: number;
    proofTimeMs?: number;
    reason?: string;
  } | null>(null);

  const appendLog = (msg: string) => {
    setLog((prev) => [...prev, `[${new Date().toLocaleTimeString()}] ${msg}`]);
  };

  const runVerificationSimulation = async (simulatedSuccess: boolean) => {
    setLoading(true);
    setStatus("challenging");
    setLog([]);
    setResult(null);

    appendLog(`Initializing verification request for Tier ${tier}...`);
    appendLog(`POST /api/v1/challenges { appScope: "playground.demo", requiredTier: ${tier} }`);

    await new Promise((r) => setTimeout(r, 600));
    const challengeId = "ch_" + Math.random().toString(36).substring(2, 10);
    appendLog(`Received challenge: ${challengeId} (expires in 300s)`);

    setStatus("proving");
    appendLog(`Prompting user device authenticator (WebAuthn PRF / Biometric unlock)...`);
    await new Promise((r) => setTimeout(r, 800));

    if (!simulatedSuccess) {
      appendLog(`Hardware response: User cancelled or biometric assertion mismatch.`);
      appendLog(`Verification failed.`);
      setStatus("failed");
      setResult({
        verified: false,
        reason: "Biometric assertion failed: no valid proof generated on hardware.",
      });
      setLoading(false);
      return;
    }

    appendLog(`Hardware unlocked. Generating Semaphore ZK proof against group: verified-humans-tier${tier}`);
    appendLog(`Evaluating Merkle proof for commitment in root 0x73a...f91`);
    await new Promise((r) => setTimeout(r, 700));

    const nullifier = "0x" + Array.from({ length: 16 }, () => Math.floor(Math.random() * 16).toString(16)).join("");
    appendLog(`Proof generated. Submitting payload to POST /api/v1/verify`);
    await new Promise((r) => setTimeout(r, 500));

    appendLog(`Server validated Merkle root, nullifier freshness, and ZK constraints.`);
    setStatus("verified");
    setResult({
      verified: true,
      tier,
      nullifier,
      proofTimeMs: 412,
    });
    setLoading(false);
  };

  return (
    <Card className="border-[#e2e2e2] bg-white">
      <CardHeader>
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <CardTitle className="text-xl flex items-center gap-2">
              <Shield className="h-5 w-5 text-[#3e6ae1]" />
              Live Verification Simulator
            </CardTitle>
            <CardDescription className="text-[#5c5e62]">
              Simulate end-to-end verification through the CyberPlus protocol and zero-knowledge proof engine.
            </CardDescription>
          </div>
          <div className="flex items-center gap-1 bg-[#f4f4f4] p-1 rounded-lg border border-[#e2e2e2]">
            {[1, 2, 3].map((t) => (
              <button
                key={t}
                onClick={() => setTier(t)}
                className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors ${
                  tier === t
                    ? "bg-[#3e6ae1] text-white"
                    : "text-[#5c5e62] hover:text-[#171a20]"
                }`}
              >
                Tier {t}
              </button>
            ))}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="flex flex-wrap items-center gap-3">
          <Button
            onClick={() => runVerificationSimulation(true)}
            disabled={loading}
            className="font-medium"
          >
            {loading && status === "proving" ? (
              <RefreshCw className="h-4 w-4 animate-spin mr-2" />
            ) : (
              <Play className="h-4 w-4 mr-2" />
            )}
            Run Valid Human Proof
          </Button>

          <Button
            variant="outline"
            onClick={() => runVerificationSimulation(false)}
            disabled={loading}
            className="border-[#d0d1d2] text-[#171a20] hover:bg-[#f4f4f4]"
          >
            Simulate Bot / Impostor Failure
          </Button>
        </div>

        {/* Status display */}
        {result && (
          <div
            className={`p-4 rounded-xl border flex items-start gap-3 ${
              result.verified
                ? "bg-emerald-50 border-emerald-300 text-emerald-800"
                : "bg-[#f4f4f4] border-[#d0d1d2] text-[#171a20]"
            }`}
          >
            {result.verified ? (
              <CheckCircle2 className="h-6 w-6 text-emerald-600 shrink-0 mt-0.5" />
            ) : (
              <XCircle className="h-6 w-6 text-[#171a20] shrink-0 mt-0.5" />
            )}
            <div className="space-y-1 text-sm">
              <div className="font-bold text-base flex items-center gap-2">
                {result.verified ? "Verification Succeeded" : "Verification Rejected"}
                {result.tier && <Badge variant="outline">Tier {result.tier} Verified</Badge>}
              </div>
              {result.nullifier && (
                <p className="font-mono text-xs opacity-90">
                  App-Scoped Nullifier: <span className="text-[#171a20] font-bold">{result.nullifier}</span>
                </p>
              )}
              {result.proofTimeMs && (
                <p className="text-xs opacity-75">ZK Proof Generation &amp; Validation: {result.proofTimeMs}ms</p>
              )}
              {result.reason && <p className="text-xs text-[#5c5e62]">{result.reason}</p>}
            </div>
          </div>
        )}

        {/* Terminal logs */}
        <div className="rounded-xl bg-[#f9f9f9] border border-[#e2e2e2] p-4 font-mono text-xs text-[#171a20] min-h-[160px] max-h-[260px] overflow-y-auto">
          <div className="flex items-center gap-2 text-[#5c5e62] border-b border-[#e2e2e2] pb-2 mb-2">
            <Terminal className="h-3.5 w-3.5" />
            <span>protocol_execution.log</span>
          </div>
          {log.length === 0 ? (
            <p className="text-[#8e8e93] italic">Click one of the buttons above to trigger the live protocol trace.</p>
          ) : (
            <div className="space-y-1">
              {log.map((line, i) => (
                <div key={i} className="leading-relaxed">
                  <span className="text-[#3e6ae1]">&gt;</span> {line}
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
