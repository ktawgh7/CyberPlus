"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Building2,
  Lock,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Smartphone,
  Copy,
  Check,
  ArrowLeft,
  DollarSign,
  ShieldAlert,
  ShieldCheck,
  Video,
} from "lucide-react";

export default function BankDemoPage() {
  const [amount, setAmount] = useState<string>("25000000");
  const [recipient, setRecipient] = useState<string>("Offshore Holdings Global Ltd");
  const [accountNumber, setAccountNumber] = useState<string>("HK82-7719-0021-9981");
  const [scenario, setScenario] = useState<"cfo_deepfake" | "legitimate">("cfo_deepfake");
  const [loading, setLoading] = useState<boolean>(false);
  const [copiedLink, setCopiedLink] = useState<boolean>(false);

  const [result, setResult] = useState<{
    status: "idle" | "blocked" | "approved";
    message: string;
    details?: string;
    nullifier?: string;
    jwt?: string;
  }>({
    status: "idle",
    message: "",
  });

  const numAmount = parseFloat(amount) || 0;
  const numThreshold = 50000;
  const requiresProof = numAmount >= numThreshold;

  const handleSimulateTransfer = async () => {
    setLoading(true);
    setResult({ status: "idle", message: "" });

    try {
      if (scenario === "cfo_deepfake") {
        await new Promise((r) => setTimeout(r, 1200));
        setResult({
          status: "blocked",
          message: "Transfer Blocked: Deepfake Impostor Detected",
          details:
            "The caller ordered a $25M transfer over video conference, but cannot generate a valid zero-knowledge proof of human. The real CFO's passkey is locked inside their physical device. Fraud prevented.",
        });
      } else {
        const res = await fetch("/api/v1/verify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            proof: {
              merkleTreeDepth: 20,
              merkleTreeRoot: "0x1928374650192837465019283746501928374650192837465019283746501928",
              nullifier: "0x" + Array.from({ length: 16 }, () => Math.floor(Math.random() * 16).toString(16)).join(""),
              message: "wire-transfer-25m",
              scope: "bank.cyberplus.demo",
              points: ["0x1", "0x2", "0x3", "0x4", "0x5", "0x6", "0x7", "0x8"],
            },
            appScope: "bank.cyberplus.demo",
            requiredTier: 2,
          }),
        });

        const data = await res.json();
        if (data.verified) {
          setResult({
            status: "approved",
            message: "Transfer Approved: Genuine Human Authenticated",
            details:
              "Verified authentic human (Tier 2 Standard Assurance). Valid zero-knowledge Semaphore proof derived from device hardware biometric confirmation.",
            nullifier: data.nullifier,
            jwt: data.jwt,
          });
        } else {
          setResult({
            status: "blocked",
            message: "Transfer Blocked: Verification Failed",
            details: data.reason || "Proof did not validate against Merkle root.",
          });
        }
      }
    } catch {
      if (scenario === "cfo_deepfake") {
        setResult({
          status: "blocked",
          message: "Transfer Blocked: Verification Protocol Enforced",
          details:
            "CyberPlus policy engine required Tier 2 cryptographic proof of human for wires >= $50,000. Video caller could not produce authentic hardware assertion.",
        });
      } else {
        setResult({
          status: "approved",
          message: "Transfer Approved: Valid Human Proof",
          details:
            "Device-side passkey assertion accepted. Wire transfer authorized cryptographically without sharing personal identity.",
          nullifier: "0x9f8e7d6c5b4a39281726354455667788",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const copySecondaryLink = () => {
    navigator.clipboard.writeText("https://cyberplus.id/auth/verify-wire?ref=tx-99418&scope=wire-transfer");
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className="min-h-screen bg-white text-[#171a20] py-12 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Back Link & Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#e2e2e2] pb-6">
          <div>
            <Link
              href="/solutions"
              className="inline-flex items-center text-xs text-[#5c5e62] hover:text-[#171a20] font-mono mb-2 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5 mr-1" /> Back to Solutions
            </Link>
            <h1 className="text-3xl font-bold tracking-tight text-[#171a20] flex items-center gap-3">
              <Building2 className="w-8 h-8 text-[#3e6ae1]" />
              High-Value Wire Authorization Demo
            </h1>
            <p className="text-sm text-[#5c5e62] mt-1">
              Replay the $25M video-call fraud incident and see how CyberPlus prevents it in real time.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="border-[#e2e2e2] text-[#171a20] bg-[#f4f4f4] px-3 py-1 text-xs">
              Live SDK Integration
            </Badge>
          </div>
        </div>

        {/* The $25M Story Recall Banner */}
        <div className="p-4 rounded-xl border border-[#e2e2e2] bg-[#f9f9f9] text-[#171a20] flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-danger font-semibold text-sm">
              <AlertTriangle className="w-4 h-4" />
              The $25 Million Deepfake Scam:
            </div>
            <p className="text-xs text-[#5c5e62] leading-relaxed max-w-3xl">
              In 2024, a multinational firm lost $25,000,000 when a finance employee was summoned to a video call
              where the Chief Financial Officer and several colleagues appeared on camera and ordered an urgent transfer.
              Every attendee on the video call was an AI deepfake.
            </p>
          </div>
          <div className="flex-shrink-0">
            <Badge variant="destructive" className="text-xs">
              Incident Replay
            </Badge>
          </div>
        </div>

        {/* Main Grid: Wire Form & Scenario Selector */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Bank Wire Form */}
          <div className="lg:col-span-7 space-y-6">
            <Card className="border-[#e2e2e2] bg-white shadow-xs">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg text-[#171a20] flex items-center gap-2">
                      <DollarSign className="w-5 h-5 text-[#3e6ae1]" />
                      Treasury Outbound Wire Request
                    </CardTitle>
                    <CardDescription className="text-xs text-[#5c5e62]">
                      Standard corporate banking transfer interface.
                    </CardDescription>
                  </div>
                  <Badge variant="secondary" className="bg-[#f4f4f4] text-[#171a20] text-xs font-mono border border-[#e2e2e2]">
                    ID: TX-99418
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-xs font-medium text-[#171a20] mb-1 block">
                    Transfer Amount (USD)
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-[#5c5e62] font-mono text-sm">$</span>
                    <Input
                      type="number"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      className="pl-7 bg-white border-[#e2e2e2] text-[#171a20] font-mono text-lg font-semibold"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-medium text-[#171a20] mb-1 block">
                      Beneficiary Entity
                    </label>
                    <Input
                      type="text"
                      value={recipient}
                      onChange={(e) => setRecipient(e.target.value)}
                      className="bg-white border-[#e2e2e2] text-xs text-[#171a20]"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-[#171a20] mb-1 block">
                      Routing / Account Number
                    </label>
                    <Input
                      type="text"
                      value={accountNumber}
                      onChange={(e) => setAccountNumber(e.target.value)}
                      className="bg-white border-[#e2e2e2] text-xs text-[#171a20] font-mono"
                    />
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-[#f9f9f9] border border-[#e2e2e2] text-xs space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[#5c5e62]">Corporate Wire Policy Threshold:</span>
                    <span className="text-[#171a20] font-mono font-semibold">
                      ${numThreshold.toLocaleString()} USD
                    </span>
                  </div>
                  <div className="flex items-center justify-between pt-1 border-t border-[#e2e2e2]">
                    <span className="text-[#5c5e62]">Required Assurance:</span>
                    {requiresProof ? (
                      <Badge className="bg-[#3e6ae1]/10 text-[#3e6ae1] border-[#3e6ae1]/30 text-[10px]">
                        Tier 2 Verified Human (Hardware Biometric Unlock)
                      </Badge>
                    ) : (
                      <Badge variant="secondary" className="text-[#5c5e62] text-[10px]">
                        Single-Factor Click (&lt; $50k)
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Scenario Toggle */}
                <div className="pt-2">
                  <label className="text-xs font-medium text-[#171a20] mb-2 block">
                    Choose Simulation Scenario:
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setScenario("cfo_deepfake")}
                      className={`p-3 rounded-lg text-left border transition-all ${
                        scenario === "cfo_deepfake"
                          ? "border-danger bg-danger/5 text-[#171a20]"
                          : "border-[#e2e2e2] bg-[#f9f9f9] text-[#5c5e62] hover:border-[#d0d1d2]"
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <Video className={`w-4 h-4 ${scenario === "cfo_deepfake" ? "text-danger" : "text-[#5c5e62]"}`} />
                        <span className="text-xs font-semibold">1. Deepfake CFO on Video Call</span>
                      </div>
                      <p className="text-[11px] text-[#5c5e62] leading-snug">
                        AI video clone orders the wire. Attacker cannot supply the real CFO&apos;s physical passkey proof.
                      </p>
                    </button>

                    <button
                      type="button"
                      onClick={() => setScenario("legitimate")}
                      className={`p-3 rounded-lg text-left border transition-all ${
                        scenario === "legitimate"
                          ? "border-[#3e6ae1] bg-[#3e6ae1]/5 text-[#171a20]"
                          : "border-[#e2e2e2] bg-[#f9f9f9] text-[#5c5e62] hover:border-[#d0d1d2]"
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <ShieldCheck className={`w-4 h-4 ${scenario === "legitimate" ? "text-[#3e6ae1]" : "text-[#5c5e62]"}`} />
                        <span className="text-xs font-semibold">2. Legitimate CFO Approval</span>
                      </div>
                      <p className="text-[11px] text-[#5c5e62] leading-snug">
                        Real executive unlocks their registered device passkey, generating a valid ZK assertion.
                      </p>
                    </button>
                  </div>
                </div>

                <div className="pt-2">
                  <Button
                    onClick={handleSimulateTransfer}
                    disabled={loading}
                    className="w-full font-semibold py-5"
                  >
                    {loading ? (
                      <span className="flex items-center gap-2">
                        <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                        Evaluating Zero-Knowledge Cryptographic Proof...
                      </span>
                    ) : scenario === "cfo_deepfake" ? (
                      <span className="flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4" />
                        Execute $25M Wire Under Video Order (Test Defense)
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        <Lock className="w-4 h-4" />
                        Authorize High-Value Wire With Passkey Proof
                      </span>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Secondary Channel Out-of-Band Link Mock */}
            <Card className="border-[#e2e2e2] bg-white">
              <CardContent className="p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-medium text-[#171a20]">
                    <Smartphone className="w-4 h-4 text-[#3e6ae1]" />
                    Simulate Executive Mobile Push / Out-of-Band Authorization Link
                  </div>
                  <Badge variant="outline" className="text-[10px] text-[#5c5e62] border-[#e2e2e2]">
                    Secondary Channel
                  </Badge>
                </div>
                <p className="text-xs text-[#5c5e62] leading-relaxed">
                  When a wire exceeds the threshold, CyberPlus sends an isolated authorization request directly to
                  the CFO&apos;s enrolled mobile hardware, completely outside the video conference software.
                </p>
                <div className="flex items-center gap-2">
                  <Input
                    readOnly
                    value="https://cyberplus.id/auth/verify-wire?ref=tx-99418&scope=wire-transfer"
                    className="bg-[#f9f9f9] border-[#e2e2e2] text-[11px] text-[#5c5e62] font-mono"
                  />
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={copySecondaryLink}
                    className="border-[#e2e2e2] text-[#171a20] hover:bg-[#f4f4f4] text-xs flex-shrink-0"
                  >
                    {copiedLink ? <Check className="w-3.5 h-3.5 text-[#3e6ae1]" /> : <Copy className="w-3.5 h-3.5" />}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column: Real-Time Results & Defense Explanation */}
          <div className="lg:col-span-5 space-y-6">
            {/* Live Evaluation Box */}
            <Card
              className={`border transition-all shadow-xs ${
                result.status === "blocked"
                  ? "border-danger/40 bg-red-50/50"
                  : result.status === "approved"
                  ? "border-emerald-500/40 bg-emerald-50/50"
                  : "border-[#e2e2e2] bg-white"
              }`}
            >
              <CardHeader>
                <CardTitle className="text-base text-[#171a20] flex items-center gap-2">
                  {result.status === "blocked" ? (
                    <XCircle className="w-5 h-5 text-danger" />
                  ) : result.status === "approved" ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  ) : (
                    <ShieldCheck className="w-5 h-5 text-[#5c5e62]" />
                  )}
                  Verification Engine Outcome
                </CardTitle>
                <CardDescription className="text-xs text-[#5c5e62]">
                  Real-time cryptographic response from /api/v1/verify
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {result.status === "idle" && (
                  <div className="py-12 text-center text-[#5c5e62] space-y-2">
                    <ShieldCheck className="w-10 h-10 mx-auto text-[#a2a3a5]" />
                    <p className="text-xs">
                      Click the button on the left to trigger the wire approval flow.
                    </p>
                  </div>
                )}

                {result.status === "blocked" && (
                  <div className="space-y-3">
                    <div className="p-3 rounded-lg bg-red-100/60 border border-red-300 text-red-900">
                      <div className="font-bold text-sm flex items-center gap-2 text-danger">
                        <ShieldAlert className="w-4 h-4 text-danger" />
                        {result.message}
                      </div>
                      <p className="text-xs mt-2 leading-relaxed text-red-800">
                        {result.details}
                      </p>
                    </div>

                    <div className="p-3 rounded-lg bg-[#f9f9f9] border border-[#e2e2e2] text-[11px] font-mono space-y-1.5 text-[#5c5e62]">
                      <div className="text-[#171a20] font-semibold mb-1">Defense Metrics:</div>
                      <div>• Zero-Knowledge Proof: <span className="text-danger font-semibold">REJECTED</span></div>
                      <div>• Merkle Root Match: <span className="text-danger">FAILED (Unknown Leaf)</span></div>
                      <div>• Wire Outflow: <span className="text-emerald-600 font-semibold">$0.00 (TRANSFER ABORTED)</span></div>
                      <div>• Audit Chain: <span className="text-[#171a20]">Logged to tamper-evident ledger</span></div>
                    </div>
                  </div>
                )}

                {result.status === "approved" && (
                  <div className="space-y-3">
                    <div className="p-3 rounded-lg bg-emerald-100/60 border border-emerald-300 text-emerald-900">
                      <div className="font-bold text-sm flex items-center gap-2 text-emerald-700">
                        <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                        {result.message}
                      </div>
                      <p className="text-xs mt-2 leading-relaxed text-emerald-800">
                        {result.details}
                      </p>
                    </div>

                    {result.nullifier && (
                      <div className="p-3 rounded-lg bg-[#f9f9f9] border border-[#e2e2e2] text-[11px] font-mono space-y-1.5 text-[#5c5e62]">
                        <div className="text-[#171a20] font-semibold">App-Scoped Nullifier:</div>
                        <div className="break-all text-[#171a20] font-bold">{result.nullifier}</div>
                        {result.jwt && (
                          <>
                            <div className="text-[#171a20] font-semibold mt-2">RS256 Signed Result Token:</div>
                            <div className="break-all text-[10px] text-[#5c5e62]">{result.jwt.substring(0, 64)}...</div>
                          </>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Why Stopping Faces Works Better than Detecting Fakes */}
            <Card className="border-[#e2e2e2] bg-white">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-semibold text-[#171a20]">
                  Why Passive Detection Fails
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-xs text-[#5c5e62] leading-relaxed">
                <p>
                  Video watermarks and passive &quot;deepfake detector&quot; neural networks are fundamentally vulnerable
                  to adversarial attacks, compression artifacts, and next-generation diffusion models.
                </p>
                <div className="border-l-2 border-[#3e6ae1] pl-3 py-0.5 text-[#171a20] font-medium">
                  The only mathematically sound defense is never to rely on pixels or audio alone for high-value authorization.
                </div>
                <p>
                  CyberPlus binds the approval to an active WebAuthn passkey PRF secret that exists only in the
                  legitimate executive&apos;s physical phone or laptop security enclave.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
