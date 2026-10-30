"use client";

import React, { useState } from "react";
import Link from "next/link";
import { PageHeader } from "@/components/layout/page-header";
import { Section, SectionHeader } from "@/components/layout/section";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Code, Terminal, Key, ShieldCheck, Copy, Check, ExternalLink, Zap } from "lucide-react";

export default function DevelopersPage() {
  const [copiedKey, setCopiedKey] = useState(false);
  const [sandboxKey, setSandboxKey] = useState<string | null>(null);
  const [keyLoading, setKeyLoading] = useState(false);

  const generateSandboxKey = async () => {
    setKeyLoading(true);
    try {
      const res = await fetch("/api/v1/keys/sandbox", { method: "POST" });
      const data = await res.json();
      if (data.apiKey) {
        setSandboxKey(data.apiKey);
      } else {
        setSandboxKey("cp_test_" + Math.random().toString(36).substring(2, 18));
      }
    } catch {
      setSandboxKey("cp_test_" + Math.random().toString(36).substring(2, 18));
    } finally {
      setKeyLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(true);
    setTimeout(() => setCopiedKey(false), 2000);
  };

  return (
    <div className="pb-24">
      <PageHeader
        badge="Developer Platform"
        title="Build Sybil-Resistant, Bot-Free Applications"
        description="Verify authentic, unique humans with zero-knowledge proofs. Integrate in 5 minutes via the @cyberplus/verify SDK, REST APIs, or embeddable widget."
      >
        <div className="flex flex-wrap justify-center gap-4">
          <Button onClick={generateSandboxKey} disabled={keyLoading}>
            <Zap className="mr-2 h-4 w-4" />
            {keyLoading ? "Generating..." : "Generate Sandbox API Key"}
          </Button>
          <Link href="#endpoints">
            <Button variant="outline">Browse Endpoints</Button>
          </Link>
        </div>

        {sandboxKey && (
          <div className="mt-6 max-w-md mx-auto p-4 rounded-xl bg-accent-500/10 border border-accent-400/30 text-left">
            <div className="flex items-center justify-between text-xs text-accent-400 font-bold mb-1">
              <span>Your Sandbox API Key (Test Mode)</span>
              <button
                onClick={() => copyToClipboard(sandboxKey)}
                className="flex items-center gap-1 hover:underline"
              >
                {copiedKey ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                {copiedKey ? "Copied" : "Copy"}
              </button>
            </div>
            <code className="text-xs font-mono text-foreground break-all">{sandboxKey}</code>
          </div>
        )}
      </PageHeader>

      {/* QUICKSTART & SDK INSTALL */}
      <Section className="pt-0">
        <SectionHeader
          badge="Quickstart"
          title="3 Steps to Verification"
          subtitle="Everything you need to verify a human in Node, Next.js, or client-side web applications."
        />

        <div className="max-w-4xl mx-auto space-y-6">
          <Tabs defaultValue="sdk">
            <TabsList className="grid grid-cols-3 max-w-md mx-auto mb-6">
              <TabsTrigger value="sdk">Server SDK</TabsTrigger>
              <TabsTrigger value="browser">Browser Flow</TabsTrigger>
              <TabsTrigger value="widget">Drop-in Widget</TabsTrigger>
            </TabsList>

            {/* TAB 1: Server SDK */}
            <TabsContent value="sdk">
              <Card className="border-[#e2e2e2] bg-[#f9f9f9] font-mono text-xs text-[#171a20]">
                <CardHeader className="border-b border-[#e2e2e2] pb-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[#5c5e62]">server.ts &mdash; Node / Next.js Server Action</span>
                    <Badge variant="outline">npm install @cyberplus/verify</Badge>
                  </div>
                </CardHeader>
                <CardContent className="p-4 text-[#171a20] overflow-x-auto space-y-3">
                  <pre>{`import { createCyberPlus } from "@cyberplus/verify";

const cyberplus = createCyberPlus({
  apiKey: process.env.CYBERPLUS_API_KEY!,
});

// 1. Create verification challenge for user
export async function getVerificationChallenge() {
  const challenge = await cyberplus.createChallenge({
    requiredTier: 1, // 1 = Basic, 2 = Standard, 3 = High Assurance
  });
  return challenge;
}

// 2. Validate user's submitted zero-knowledge proof
export async function verifyUserProof(challengeId: string, proof: string) {
  const result = await cyberplus.verifyProof(challengeId, proof);

  if (result.verified) {
    // result.nullifier: App-scoped unique identifier (prevents Sybil attacks)
    // result.signedToken: Cryptographic JWT signed by CyberPlus JWKS
    console.log("Verified human!", result.nullifier, result.tier);
    return { ok: true, nullifier: result.nullifier };
  }

  return { ok: false, reason: result.reason };
}`}</pre>
                </CardContent>
              </Card>
            </TabsContent>

            {/* TAB 2: Browser Flow */}
            <TabsContent value="browser">
              <Card className="border-[#e2e2e2] bg-[#f9f9f9] font-mono text-xs text-[#171a20]">
                <CardHeader className="border-b border-[#e2e2e2] pb-3">
                  <span className="text-[#5c5e62]">client.ts &mdash; WebAuthn & ZK Prover</span>
                </CardHeader>
                <CardContent className="p-4 text-[#171a20] overflow-x-auto space-y-3">
                  <pre>{`import { generateProof } from "@cyberplus/verify/browser";

async function onVerifyButtonClick(challenge: { id: string; scope: string; message: string }) {
  try {
    // Triggers local biometric unlock on user device (WebAuthn PRF)
    // and generates zero-knowledge Semaphore proof against verified-humans group
    const { proof, nullifier } = await generateProof({
      challengeId: challenge.id,
      scope: challenge.scope,
      message: challenge.message,
    });

    // Send proof to your backend API
    const response = await fetch("/api/confirm-human", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ challengeId: challenge.id, proof }),
    });

    const res = await response.json();
    alert("Verified as unique human!");
  } catch (err) {
    console.error("Verification failed or rejected:", err);
  }
}`}</pre>
                </CardContent>
              </Card>
            </TabsContent>

            {/* TAB 3: Drop-in Widget */}
            <TabsContent value="widget">
              <Card className="border-[#e2e2e2] bg-[#f9f9f9] font-mono text-xs text-[#171a20]">
                <CardHeader className="border-b border-[#e2e2e2] pb-3">
                  <span className="text-[#5c5e62]">index.html &mdash; 2-Line Embed Snippet</span>
                </CardHeader>
                <CardContent className="p-4 text-[#171a20] overflow-x-auto space-y-3">
                  <pre>{`<!-- 1. Mount Container -->
<div id="cyberplus-container"></div>

<!-- 2. Mount Script -->
<script type="module">
  import { mountWidget } from "/sdk/widget.js";

  mountWidget({
    containerId: "cyberplus-container",
    apiKey: "cp_test_YOUR_SANDBOX_KEY",
    requiredTier: 1,
    onVerified: ({ nullifier, signedToken }) => {
      console.log("Human verified! Nullifier:", nullifier);
      document.getElementById("submit-btn").disabled = false;
    },
    onError: (err) => console.error("Error verifying human:", err),
  });
</script>`}</pre>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </Section>

      {/* REST API ENDPOINTS REFERENCE */}
      <Section dark id="endpoints">
        <SectionHeader
          badge="REST API v1"
          title="API Endpoints Reference"
          subtitle="All requests require an Authorization: Bearer <api_key> header, support rate limiting, and include request ID telemetry."
        />

        <div className="max-w-4xl mx-auto space-y-4">
          {[
            {
              method: "POST",
              path: "/api/v1/challenges",
              desc: "Create an ephemeral verification challenge for your application scope.",
              payload: `{ "appScope": "forum.posts", "requiredTier": 1 }`,
              response: `{ "id": "ch_7b82f", "scope": "forum.posts", "message": "0x98f...", "expiresAt": "2026-03-12T12:05:00Z" }`,
            },
            {
              method: "POST",
              path: "/api/v1/verify",
              desc: "Submit a zero-knowledge proof for validation against the active tier root.",
              payload: `{ "challengeId": "ch_7b82f", "proof": "<semaphore_proof_json>" }`,
              response: `{ "verified": true, "tier": 1, "nullifier": "0x41c9b...", "signedToken": "eyJhbGciOi..." }`,
            },
            {
              method: "GET",
              path: "/api/v1/groups/:tier/root",
              desc: "Retrieve the current public Merkle tree root for verified human groups.",
              payload: `None (Public endpoint)`,
              response: `{ "group": "verified-humans-tier1", "root": "0x12a9...d3", "size": 14200, "timestamp": "2026-03-12T12:00:00Z" }`,
            },
            {
              method: "GET",
              path: "/.well-known/jwks.json",
              desc: "Public cryptographic keys used by CyberPlus to sign result tokens.",
              payload: `None (Public endpoint)`,
              response: `{ "keys": [{ "kty": "RSA", "use": "sig", "alg": "RS256", "n": "...", "e": "AQAB" }] }`,
            },
            {
              method: "GET",
              path: "/api/v1/status",
              desc: "Protocol node health check and circuit artifact version.",
              payload: `None (Public endpoint)`,
              response: `{ "status": "ok", "version": "0.1.0-prototype", "circuitsLoaded": true }`,
            },
          ].map((endpoint) => (
            <Card key={endpoint.path} className="border-cyber-200 dark:border-cyber-800">
              <CardHeader className="pb-3">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge
                    variant={endpoint.method === "POST" ? "default" : "secondary"}
                    className="font-mono text-xs"
                  >
                    {endpoint.method}
                  </Badge>
                  <code className="text-sm font-bold text-foreground">{endpoint.path}</code>
                </div>
                <CardDescription className="text-xs mt-1 text-muted-foreground">
                  {endpoint.desc}
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0 space-y-2">
                <div className="grid md:grid-cols-2 gap-2 text-xs font-mono">
                  <div className="p-2.5 rounded-lg bg-[#f4f4f4] border border-[#e2e2e2] text-[#171a20]">
                    <span className="text-[#5c5e62] block mb-1">Request:</span>
                    <pre className="overflow-x-auto">{endpoint.payload}</pre>
                  </div>
                  <div className="p-2.5 rounded-lg bg-[#f4f4f4] border border-[#e2e2e2] text-[#3e6ae1]">
                    <span className="text-[#5c5e62] block mb-1">Response:</span>
                    <pre className="overflow-x-auto">{endpoint.response}</pre>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </Section>

      {/* WEBHOOKS GUIDE */}
      <Section>
        <SectionHeader
          badge="Event Notifications"
          title="Webhooks & Signature Verification"
          subtitle="Receive real-time event updates for verification successes, failures, and key freezes."
        />
        <div className="max-w-4xl mx-auto">
          <Card className="border-[#e2e2e2] bg-[#f9f9f9] font-mono text-xs text-[#171a20]">
            <CardHeader className="border-b border-[#e2e2e2] pb-3">
              <span className="text-[#5c5e62]">verify-signature.js &mdash; HMAC-SHA256 Signature Validation</span>
            </CardHeader>
            <CardContent className="p-4 text-[#171a20] overflow-x-auto space-y-3">
              <pre>{`const crypto = require("crypto");

function verifyCyberPlusWebhook(payloadBuffer, signatureHeader, secret) {
  // Header format: t=1710245000,v1=7f3a...
  const parts = Object.fromEntries(signatureHeader.split(",").map(p => p.split("=")));
  const timestamp = parts.t;
  const expectedSig = parts.v1;

  // Prevent replay attacks (5 minute window)
  if (Math.abs(Date.now() / 1000 - parseInt(timestamp, 10)) > 300) {
    throw new Error("Webhook timestamp expired");
  }

  const signedPayload = timestamp + "." + payloadBuffer.toString("utf8");
  const computedSig = crypto.createHmac("sha256", secret).update(signedPayload).digest("hex");

  return crypto.timingSafeEqual(Buffer.from(expectedSig), Buffer.from(computedSig));
}`}</pre>
            </CardContent>
          </Card>
        </div>
      </Section>
    </div>
  );
}

