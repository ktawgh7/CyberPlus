"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Video,
  Mic,
  MicOff,
  VideoOff,
  PhoneOff,
  ShieldAlert,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Radio,
  Lock,
  ArrowLeft,
  Users,
  Smartphone,
  RefreshCw,
} from "lucide-react";

interface Participant {
  id: string;
  name: string;
  role: string;
  avatarBg: string;
  isDeepfake: boolean;
  verified: boolean;
  tier?: number;
  nullifier?: string;
}

export default function CallDemoPage() {
  const [participants, setParticipants] = useState<Participant[]>([
    {
      id: "cfo",
      name: "Arthur Pendelton",
      role: "Chief Financial Officer (Video Stream)",
      avatarBg: "from-blue-600/30 to-indigo-600/30",
      isDeepfake: true,
      verified: false,
    },
    {
      id: "controller",
      name: "Sarah Lin",
      role: "Corporate Controller",
      avatarBg: "from-emerald-600/30 to-teal-600/30",
      isDeepfake: false,
      verified: true,
      tier: 2,
      nullifier: "0x8a92...41bc",
    },
    {
      id: "treasury",
      name: "Marcus Vance",
      role: "Treasury Operations Director",
      avatarBg: "from-amber-600/30 to-orange-600/30",
      isDeepfake: false,
      verified: true,
      tier: 2,
      nullifier: "0x3e17...88ff",
    },
    {
      id: "self",
      name: "You (Finance Analyst)",
      role: "Wire Verification Officer",
      avatarBg: "from-purple-600/30 to-violet-600/30",
      isDeepfake: false,
      verified: false,
    },
  ]);

  const [micMuted, setMicMuted] = useState(false);
  const [videoDisabled, setVideoDisabled] = useState(false);
  const [challengingCFO, setChallengingCFO] = useState(false);
  const [cfoChallengeResult, setCfoChallengeResult] = useState<string | null>(null);
  const [verifyingSelf, setVerifyingSelf] = useState(false);
  const [callDuration, setCallDuration] = useState("04:12");

  useEffect(() => {
    const timer = setInterval(() => {
      setCallDuration((prev) => {
        const [m, s] = prev.split(":").map(Number);
        const nextSec = s + 1;
        if (nextSec >= 60) {
          return `${String(m + 1).padStart(2, "0")}:00`;
        }
        return `${String(m).padStart(2, "0")}:${String(nextSec).padStart(2, "0")}`;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleChallengeCFO = async () => {
    setChallengingCFO(true);
    setCfoChallengeResult(null);

    await new Promise((r) => setTimeout(r, 1400));

    const cfo = participants.find((p) => p.id === "cfo");
    if (cfo?.isDeepfake) {
      setCfoChallengeResult(
        "FAILED: Video caller failed to present a valid WebAuthn hardware proof. No cryptographic response received from physical enclave. PROBABLE SYNTHETIC AVATAR."
      );
      setParticipants((prev) =>
        prev.map((p) =>
          p.id === "cfo"
            ? { ...p, verified: false }
            : p
        )
      );
    } else {
      setCfoChallengeResult(
        "SUCCESS: Authenticated genuine human presence (Tier 2). Semaphore zero-knowledge proof valid against root 0x73a...f91."
      );
      setParticipants((prev) =>
        prev.map((p) =>
          p.id === "cfo"
            ? { ...p, verified: true, tier: 2, nullifier: "0x44ab...9912" }
            : p
        )
      );
    }
    setChallengingCFO(false);
  };

  const toggleCFOIdentity = () => {
    setParticipants((prev) =>
      prev.map((p) => {
        if (p.id === "cfo") {
          const nextIsDeepfake = !p.isDeepfake;
          return {
            ...p,
            isDeepfake: nextIsDeepfake,
            verified: !nextIsDeepfake,
            nullifier: nextIsDeepfake ? undefined : "0x44ab...9912",
          };
        }
        return p;
      })
    );
    setCfoChallengeResult(null);
  };

  const handleVerifySelf = async () => {
    setVerifyingSelf(true);
    try {
      const res = await fetch("/api/v1/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          proof: {
            merkleTreeDepth: 20,
            merkleTreeRoot: "0x1928374650192837465019283746501928374650192837465019283746501928",
            nullifier: "0x" + Array.from({ length: 16 }, () => Math.floor(Math.random() * 16).toString(16)).join(""),
            message: "webrtc-call-room-419",
            scope: "call.cyberplus.demo",
            points: ["0x1", "0x2", "0x3", "0x4", "0x5", "0x6", "0x7", "0x8"],
          },
          appScope: "call.cyberplus.demo",
          requiredTier: 1,
        }),
      });
      const data = await res.json();
      setParticipants((prev) =>
        prev.map((p) =>
          p.id === "self"
            ? {
                ...p,
                verified: true,
                tier: 1,
                nullifier: data.nullifier ? `${data.nullifier.substring(0, 6)}...${data.nullifier.substring(data.nullifier.length - 4)}` : "0x7c12...55aa",
              }
            : p
        )
      );
    } catch {
      setParticipants((prev) =>
        prev.map((p) =>
          p.id === "self"
            ? {
                ...p,
                verified: true,
                tier: 1,
                nullifier: "0x7c12...55aa",
              }
            : p
        )
      );
    } finally {
      setVerifyingSelf(false);
    }
  };

  const cfo = participants.find((p) => p.id === "cfo");

  return (
    <div className="min-h-screen bg-white text-[#171a20] py-10 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Top Navbar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#e2e2e2] pb-5">
          <div>
            <Link
              href="/solutions"
              className="inline-flex items-center text-xs text-[#5c5e62] hover:text-[#171a20] font-mono mb-2 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5 mr-1" /> Back to Solutions
            </Link>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold tracking-tight text-[#171a20] flex items-center gap-2">
                <Video className="w-6 h-6 text-[#3e6ae1]" />
                Secure Video Conference: Executive Room 419
              </h1>
              <Badge variant="outline" className="border-[#e2e2e2] text-[#171a20] bg-[#f4f4f4] text-xs">
                WebRTC Proof Protocol
              </Badge>
            </div>
            <p className="text-xs text-[#5c5e62] mt-1">
              Live peer-to-peer call demo equipped with CyberPlus real-time cryptographic proof of human badges.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-[#f4f4f4] border border-[#e2e2e2] text-xs text-[#171a20]">
              <Radio className="w-3.5 h-3.5 text-[#3e6ae1] animate-pulse" />
              <span className="font-mono font-bold">{callDuration}</span>
              <span className="text-[#d0d1d2]">|</span>
              <Users className="w-3.5 h-3.5 text-[#5c5e62]" />
              <span>4 Participants</span>
            </div>
          </div>
        </div>

        {/* Video Grid (4 Participants) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {participants.map((p) => {
            const isCFO = p.id === "cfo";
            const isSelf = p.id === "self";

            return (
              <div
                key={p.id}
                className={`relative rounded-xl overflow-hidden aspect-video border transition-all ${
                  isCFO && p.isDeepfake && !p.verified
                    ? "border-danger shadow-[0_0_20px_rgba(232,33,39,0.15)] bg-red-50/20"
                    : p.verified
                    ? "border-emerald-300 bg-white"
                    : "border-[#e2e2e2] bg-[#f9f9f9]"
                }`}
              >
                {/* Simulated Video Feed Canvas */}
                <div
                  className={`w-full h-full bg-[#f9f9f9] flex flex-col items-center justify-center p-6 text-center select-none`}
                >
                  <div className="relative mb-3">
                    <div className="w-20 h-20 rounded-full border border-[#e2e2e2] bg-white flex items-center justify-center text-xl font-bold text-[#171a20] shadow-sm">
                      {p.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </div>
                    {p.verified && (
                      <div className="absolute -bottom-1 -right-1 bg-emerald-500 text-white p-1.5 rounded-full shadow-md">
                        <ShieldCheck className="w-4 h-4" />
                      </div>
                    )}
                    {isCFO && p.isDeepfake && !p.verified && (
                      <div className="absolute -bottom-1 -right-1 bg-danger text-white p-1.5 rounded-full shadow-md animate-bounce">
                        <ShieldAlert className="w-4 h-4" />
                      </div>
                    )}
                  </div>

                  <div className="text-sm font-semibold text-[#171a20] tracking-wide">{p.name}</div>
                  <div className="text-xs text-[#5c5e62] mt-0.5">{p.role}</div>

                  {/* Status Overlay for CFO */}
                  {isCFO && p.isDeepfake && !p.verified && (
                    <div className="mt-4 px-3 py-1.5 rounded-md bg-red-100/70 border border-red-300 text-red-800 text-[11px] font-medium flex items-center gap-1.5">
                      <AlertTriangle className="w-3.5 h-3.5 text-danger flex-shrink-0" />
                      <span>UNVERIFIED CALLER — POSSIBLE SYNTHETIC DEEPFAKE</span>
                    </div>
                  )}

                  {/* Verify button for Self */}
                  {isSelf && !p.verified && (
                    <div className="mt-3">
                      <Button
                        size="sm"
                        onClick={handleVerifySelf}
                        disabled={verifyingSelf}
                        className="bg-[#3e6ae1] hover:bg-[#3457d5] text-white text-xs h-8 font-medium"
                      >
                        {verifyingSelf ? (
                          <span className="flex items-center gap-1.5">
                            <RefreshCw className="w-3 h-3 animate-spin" /> Unlocking Passkey...
                          </span>
                        ) : (
                          <span className="flex items-center gap-1.5">
                            <ShieldCheck className="w-3.5 h-3.5" /> Prove I Am Human
                          </span>
                        )}
                      </Button>
                    </div>
                  )}
                </div>

                {/* Top Corner Badge */}
                <div className="absolute top-3 left-3 z-10">
                  {p.verified ? (
                    <Badge className="bg-emerald-600 text-white text-[10px] font-medium flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-white" />
                      Verified Human (Tier {p.tier || 2})
                    </Badge>
                  ) : isCFO && p.isDeepfake ? (
                    <Badge className="bg-danger text-white border-danger text-[10px] font-semibold flex items-center gap-1 animate-pulse">
                      <ShieldAlert className="w-3 h-3 text-white" />
                      Synthetic Risk Detected
                    </Badge>
                  ) : (
                    <Badge variant="secondary" className="bg-white/90 text-[#5c5e62] border-[#e2e2e2] text-[10px]">
                      Pending Verification
                    </Badge>
                  )}
                </div>

                {/* Nullifier or Info at Bottom */}
                <div className="absolute bottom-3 right-3 z-10 text-[10px] font-mono text-[#5c5e62] bg-white/90 px-2 py-0.5 rounded border border-[#e2e2e2]">
                  {p.nullifier ? `Nullifier: ${p.nullifier}` : "No signed assertion"}
                </div>
              </div>
            );
          })}
        </div>

        {/* Meeting Controls Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl bg-white border border-[#e2e2e2] shadow-xs">
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => setMicMuted(!micMuted)}
              className={`border-[#e2e2e2] text-xs ${micMuted ? "bg-red-50 text-danger border-red-200" : "text-[#171a20]"}`}
            >
              {micMuted ? <MicOff className="w-4 h-4 mr-1.5" /> : <Mic className="w-4 h-4 mr-1.5" />}
              {micMuted ? "Unmute" : "Mute"}
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setVideoDisabled(!videoDisabled)}
              className={`border-[#e2e2e2] text-xs ${videoDisabled ? "bg-red-50 text-danger border-red-200" : "text-[#171a20]"}`}
            >
              {videoDisabled ? <VideoOff className="w-4 h-4 mr-1.5" /> : <Video className="w-4 h-4 mr-1.5" />}
              {videoDisabled ? "Start Video" : "Stop Video"}
            </Button>
          </div>

          {/* Interactive Inspection Controls */}
          <div className="flex items-center gap-3">
            <Button
              size="sm"
              variant="outline"
              onClick={toggleCFOIdentity}
              className="border-[#e2e2e2] text-[#171a20] hover:bg-[#f4f4f4] text-xs"
            >
              Switch CFO: {cfo?.isDeepfake ? "To Legitimate CFO Stream" : "To AI Deepfake Impostor"}
            </Button>

            <Button
              size="sm"
              onClick={handleChallengeCFO}
              disabled={challengingCFO}
              className="font-medium text-xs"
            >
              {challengingCFO ? (
                <span className="flex items-center gap-1.5">
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" /> Challenging CFO Hardware...
                </span>
              ) : (
                <span className="flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5" /> Send Nonce Challenge to CFO
                </span>
              )}
            </Button>

            <Button size="sm" variant="outline" className="border-[#e2e2e2] text-xs text-danger hover:bg-red-50">
              <PhoneOff className="w-4 h-4 mr-1.5" /> Leave
            </Button>
          </div>
        </div>

        {/* Live Challenge Result Alert */}
        {cfoChallengeResult && (
          <div
            className={`p-4 rounded-xl border text-xs leading-relaxed ${
              cfoChallengeResult.startsWith("FAILED")
                ? "bg-red-50 border-red-300 text-red-900"
                : "bg-emerald-50 border-emerald-300 text-emerald-900"
            }`}
          >
            <div className="font-bold mb-1 flex items-center gap-1.5">
              {cfoChallengeResult.startsWith("FAILED") ? (
                <ShieldAlert className="w-4 h-4 text-danger" />
              ) : (
                <CheckCircle2 className="w-4 h-4 text-emerald-700" />
              )}
              WebRTC Challenge Verification Protocol Output:
            </div>
            {cfoChallengeResult}
          </div>
        )}

        {/* Technical Architecture Explanation */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
          <Card className="border-[#e2e2e2] bg-white">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold text-[#171a20] flex items-center gap-2">
                <Radio className="w-4 h-4 text-[#3e6ae1]" /> WebRTC Data Channel
              </CardTitle>
            </CardHeader>
            <CardContent className="text-xs text-[#5c5e62] leading-relaxed">
              CyberPlus does not process video pixels or audio waveforms. Instead, a lightweight WebRTC data channel
              regularly challenges each peer with a fresh cryptographic nonce signed inside the device enclave.
            </CardContent>
          </Card>

          <Card className="border-[#e2e2e2] bg-white">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold text-[#171a20] flex items-center gap-2">
                <Lock className="w-4 h-4 text-[#3e6ae1]" /> Zero Real-World Identity Leak
              </CardTitle>
            </CardHeader>
            <CardContent className="text-xs text-[#5c5e62] leading-relaxed">
              The video platform only verifies that each participant possesses an active, non-frozen CyberPlus human key
              in the verified group. No names, government documents, or raw biometric hashes are exchanged.
            </CardContent>
          </Card>

          <Card className="border-[#e2e2e2] bg-white">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold text-[#171a20] flex items-center gap-2">
                <Smartphone className="w-4 h-4 text-[#3e6ae1]" /> Enclave Hardware Attestation
              </CardTitle>
            </CardHeader>
            <CardContent className="text-xs text-[#5c5e62] leading-relaxed">
              Generative AI running on a rogue server or virtual camera plugin cannot fabricate a WebAuthn PRF assertion.
              Without the physical authenticator device, the deepfake is unmasked instantly.
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
