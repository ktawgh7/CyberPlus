"use client";

import React, { useState } from "react";
import Link from "next/link";
import { PageHeader } from "@/components/layout/page-header";
import { Section, SectionHeader } from "@/components/layout/section";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionItem } from "@/components/ui/accordion";
import { ShieldAlert, Send, CheckCircle2, AlertCircle, HelpCircle, LifeBuoy, Key } from "lucide-react";

export default function SupportPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setErrorMsg("");

    try {
      const res = await fetch("/api/support/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, subject, body }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to submit message");
      }
      setStatus("success");
      setName("");
      setEmail("");
      setSubject("");
      setBody("");
    } catch (err: any) {
      setStatus("error");
      setErrorMsg(err.message || "An unexpected error occurred. Please try again.");
    }
  };

  return (
    <div className="pb-24">
      <PageHeader
        badge="Support & Emergency Response"
        title="We're Here to Help"
        description="Have questions about proof-of-human integration or need emergency assistance? Reach our team or trigger an instant key freeze below."
      />

      {/* EMERGENCY COMPROMISE HERO BANNER */}
      <Section className="pt-0">
        <div className="max-w-4xl mx-auto">
          <Card className="border-danger/40 bg-danger/5 dark:bg-danger/10 p-6 md:p-8 glow-accent">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <ShieldAlert className="h-6 w-6 text-danger" />
                  <span className="font-bold text-lg text-danger">Emergency Security Action</span>
                </div>
                <h3 className="text-2xl font-bold text-foreground">
                  Report a Compromised or Stolen Key
                </h3>
                <p className="text-sm text-muted-foreground max-w-xl">
                  If your device was stolen or you suspect unauthorized activity, freeze your identity key immediately. Freezing takes effect on the next verification call.
                </p>
              </div>

              <div className="flex flex-col gap-2 shrink-0">
                <Link href="/dashboard/key">
                  <Button variant="destructive" size="lg" className="w-full">
                    <Key className="mr-2 h-4 w-4" />
                    Instant Key Freeze
                  </Button>
                </Link>
                <Link href="/login?redirect=/dashboard/key">
                  <span className="text-center text-xs text-cyber-400 hover:underline">
                    Logged out? Use emailed emergency link or sign in
                  </span>
                </Link>
              </div>
            </div>
          </Card>
        </div>
      </Section>

      {/* CONTACT FORM & TICKETS */}
      <Section>
        <div className="grid md:grid-cols-2 gap-12 max-w-5xl mx-auto">
          {/* Form */}
          <div>
            <div className="mb-6">
              <h2 className="text-2xl font-bold">Contact Our Security Team</h2>
              <p className="text-sm text-muted-foreground mt-1">
                Submissions are stored in our support database and dispatch email notifications to team inboxes.
              </p>
            </div>

            {status === "success" && (
              <div className="p-4 rounded-xl bg-emerald-950/30 border border-emerald-500/30 text-emerald-300 text-sm flex items-start gap-3 mb-6">
                <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold">Message Delivered Successfully</p>
                  <p className="text-xs text-emerald-400 mt-1">
                    Your inquiry has been logged. A confirmation email has been dispatched to your inbox.
                  </p>
                </div>
              </div>
            )}

            {status === "error" && (
              <div className="p-4 rounded-xl bg-red-950/30 border border-red-500/30 text-red-300 text-sm flex items-start gap-3 mb-6">
                <AlertCircle className="h-5 w-5 text-red-400 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold">Submission Failed</p>
                  <p className="text-xs text-red-400 mt-1">{errorMsg}</p>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold mb-1 text-cyber-400">Your Full Name</label>
                <Input
                  required
                  placeholder="e.g. Elena Rostova"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1 text-cyber-400">Email Address</label>
                <Input
                  required
                  type="email"
                  placeholder="you@domain.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1 text-cyber-400">Subject</label>
                <Input
                  required
                  placeholder="e.g. Enterprise API Question / Partnership Inquiry"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1 text-cyber-400">Message</label>
                <Textarea
                  required
                  rows={4}
                  placeholder="Describe your inquiry or technical question..."
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                />
              </div>

              <Button
                type="submit"
                disabled={status === "loading"}
                className="w-full"
              >
                <Send className="mr-2 h-4 w-4" />
                {status === "loading" ? "Transmitting..." : "Send Secure Message"}
              </Button>
            </form>
          </div>

          {/* Ticket System & Officer Access */}
          <div className="space-y-6 flex flex-col justify-between">
            <Card className="border-cyber-200 dark:border-cyber-800">
              <CardHeader>
                <div className="h-10 w-10 rounded-lg bg-accent-500/10 dark:bg-accent-400/10 flex items-center justify-center mb-2">
                  <LifeBuoy className="h-5 w-5 text-accent-500 dark:text-accent-400" />
                </div>
                <CardTitle className="text-xl">Authenticated Ticket Portal</CardTitle>
                <CardDescription>
                  Logged-in users can track tickets, view encrypted officer responses, and request tier elevation.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground leading-relaxed mb-4">
                  Need dedicated audit trail verification or in-person appointment rescheduling? Open an internal support ticket through your dashboard.
                </p>
                <Link href="/dashboard">
                  <Button variant="outline" className="w-full">
                    Go to Account Dashboard
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="border-cyber-200 dark:border-cyber-800 bg-cyber-900/30">
              <CardHeader>
                <CardTitle className="text-lg">Officer & Admin Helpdesk</CardTitle>
                <CardDescription>
                  For designated enrollment and recovery officers.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground leading-relaxed mb-4">
                  Officers can inspect physical document reviews, manage in-person recovery queues, and approve dual-custody requests.
                </p>
                <Link href="/officer">
                  <Button variant="secondary" size="sm" className="w-full">
                    Enter Officer Portal
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </Section>

      {/* GENERAL SUPPORT FAQ */}
      <Section dark>
        <SectionHeader
          badge="Knowledge Base"
          title="General Support FAQ"
          subtitle="Answers to common questions regarding key management, lost hardware, and privacy."
        />
        <div className="max-w-3xl mx-auto">
          <Accordion>
            <AccordionItem title="What happens if I lose my phone with my passkey?" defaultOpen>
              Because raw biometrics are destroyed and only the hardware assertion is used, a lost phone cannot be remotely duplicated. You can initiate in-person recovery at any certified partner location. Two distinct officers must verify your government credentials before a replacement key is minted.
            </AccordionItem>
            <AccordionItem title="How does the Emergency Freeze link work without logging in?">
              Whenever a key is enrolled or rotated, an HMAC-signed single-use URL is securely dispatched to your verified email. Clicking that link immediately flips your identity key status to FROZEN without requiring authentication, instantly neutralizing any unauthorized attempts.
            </AccordionItem>
            <AccordionItem title="Can an officer view my biometric scans?">
              Never. Officers only inspect your physical government identity document and compare it to the name registered on your profile. Neither CyberPlus nor the officer ever captures, views, or stores photos of your face, fingerprints, or iris.
            </AccordionItem>
            <AccordionItem title="What is a Duress Code?">
              A duress code is a secondary PIN configured in your settings. If an attacker coerces you into rotating or recovering your key, entering this code appears to succeed normally on screen, but silently alerts security officers and trusted contacts in the background.
            </AccordionItem>
          </Accordion>
        </div>
      </Section>
    </div>
  );
}

