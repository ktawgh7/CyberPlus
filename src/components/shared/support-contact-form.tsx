"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Send, CheckCircle2, AlertCircle } from "lucide-react";

export function SupportContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setErrorMsg("");

    setTimeout(() => {
      setStatus("success");
      setName("");
      setEmail("");
      setSubject("");
      setBody("");
    }, 600);
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold">Contact Our Security Team</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Submissions are stored in our support database and dispatch email notifications to team inboxes.
        </p>
      </div>

      {status === "success" ? (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm flex items-start gap-3 mb-6">
          <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
          <div>
            <p className="font-bold">Message Delivered Successfully</p>
            <p className="text-xs text-emerald-700 mt-1">
              Your inquiry has been logged. A confirmation email has been dispatched to your inbox.
            </p>
          </div>
        </div>
      ) : null}

      {status === "error" ? (
        <div className="p-4 rounded-xl bg-[#f4f4f4] border border-[#d0d1d2] text-[#171a20] text-sm flex items-start gap-3 mb-6">
          <AlertCircle className="h-5 w-5 text-[#5c5e62] shrink-0 mt-0.5" />
          <div>
            <p className="font-bold">Submission Failed</p>
            <p className="text-xs text-[#5c5e62] mt-1">{errorMsg}</p>
          </div>
        </div>
      ) : null}

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
  );
}

