"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Download,
  Search,
  RefreshCw,
  Cpu,
  History,
} from "lucide-react";

export default function ActivityAuditPage() {
  const [logs, setLogs] = useState<any[]>([]);
  const [filter, setFilter] = useState("");
  const [verifying, setVerifying] = useState(false);
  const [verificationResult, setVerificationResult] = useState<any>(null);

  const fetchLogs = async () => {
    try {
      const res = await fetch("/api/audit/list");
      const data = await res.json();
      if (data.logs) setLogs(data.logs);
    } catch {
      // Fallback
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const handleVerifyChain = async () => {
    setVerifying(true);
    setVerificationResult(null);
    try {
      const res = await fetch("/api/audit/verify");
      const data = await res.json();
      setVerificationResult(data);
    } catch {
      setVerificationResult({ valid: false, error: "Network or computation error" });
    } finally {
      setVerifying(false);
    }
  };

  const handleExportCSV = () => {
    if (logs.length === 0) return;
    const headers = ["Timestamp", "Action", "Hash", "PrevHash", "Details"];
    const rows = logs.map((l) => [
      new Date(l.timestamp).toISOString(),
      `"${l.action}"`,
      `"${l.hash}"`,
      `"${l.prevHash}"`,
      `"${l.detail.replace(/"/g, '""')}"`,
    ]);
    const csvContent = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `cyberplus-audit-chain-${Date.now()}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const filteredLogs = logs.filter(
    (l) =>
      l.action.toLowerCase().includes(filter.toLowerCase()) ||
      l.detail.toLowerCase().includes(filter.toLowerCase()) ||
      l.hash.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Tamper-Evident Audit Log</h1>
        <p className="text-xs text-muted-foreground mt-1">
          Cryptographically linked SHA-256 hash chain recording every key lifecycle, verification, and governance action.
        </p>
      </div>

      {/* VERIFY CHAIN & EXPORT TOOLBAR */}
      <Card className="border-cyber-200 dark:border-cyber-800 p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Cpu className="h-5 w-5 text-accent-400" />
              <h3 className="font-bold text-base text-foreground">Independent Chain Integrity Verifier</h3>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Recompute SHA-256 hashes across every entry from genesis to head to mathematically prove immutability.
            </p>
          </div>

          <div className="flex flex-wrap gap-2 shrink-0">
            <Button onClick={handleVerifyChain} disabled={verifying} className="font-semibold text-xs">
              {verifying ? <RefreshCw className="mr-2 h-3.5 w-3.5 animate-spin" /> : <ShieldCheck className="mr-2 h-3.5 w-3.5" />}
              {verifying ? "Computing Hashes..." : "Verify Hash Chain"}
            </Button>
            <Button onClick={handleExportCSV} variant="outline" size="sm" className="text-xs">
              <Download className="mr-1.5 h-3.5 w-3.5" /> Export CSV
            </Button>
          </div>
        </div>

        {/* Verification Result Banner */}
        {verificationResult && (
          <div
            className={`mt-4 p-4 rounded-xl border flex items-start gap-3 ${
              verificationResult.valid
                ? "bg-emerald-950/30 border-emerald-500/40 text-emerald-300"
                : "bg-red-950/30 border-red-500/40 text-red-300"
            }`}
          >
            {verificationResult.valid ? (
              <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0 mt-0.5" />
            ) : (
              <XCircle className="h-5 w-5 text-red-400 shrink-0 mt-0.5" />
            )}
            <div className="text-xs space-y-1">
              <div className="font-bold text-sm">
                {verificationResult.valid ? "Audit Chain Intact — 100% Cryptographically Valid" : "Audit Chain Verification Broken!"}
              </div>
              <p>
                {verificationResult.valid
                  ? `Successfully validated all ${verificationResult.totalEntries} entries. Every link matches its predecessor's SHA-256 hash.`
                  : `Broken at entry index ${verificationResult.brokenIndex}. Expected hash ${verificationResult.expectedHash} but got ${verificationResult.computedHash}.`}
              </p>
            </div>
          </div>
        )}
      </Card>

      {/* FILTER SEARCH BAR */}
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-cyber-500" />
          <Input
            placeholder="Search action, detail, or SHA-256 hash..."
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="pl-9 text-xs"
          />
        </div>
      </div>

      {/* AUDIT LOG TABLE */}
      <Card className="border-cyber-200 dark:border-cyber-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-cyber-100 dark:bg-cyber-900/60 border-b border-cyber-200 dark:border-cyber-800 text-cyber-500 font-semibold uppercase text-[10px]">
              <tr>
                <th className="py-3 px-4">Timestamp</th>
                <th className="py-3 px-4">Action</th>
                <th className="py-3 px-4">Entry Hash & PrevHash</th>
                <th className="py-3 px-4">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-cyber-200 dark:divide-cyber-800 font-mono">
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-8 text-center text-muted-foreground font-sans">
                    No matching audit entries found.
                  </td>
                </tr>
              ) : (
                filteredLogs.map((entry) => (
                  <tr key={entry.id} className="hover:bg-cyber-50 dark:hover:bg-cyber-900/40 transition-colors">
                    <td className="py-3 px-4 text-cyber-400 whitespace-nowrap">
                      {new Date(entry.timestamp).toLocaleString()}
                    </td>
                    <td className="py-3 px-4 font-sans font-bold text-foreground">
                      <Badge variant="outline" className="font-mono text-[10px]">
                        {entry.action}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 space-y-0.5">
                      <div className="text-accent-400 font-bold truncate max-w-[220px]" title={entry.hash}>
                        hash: {entry.hash.slice(0, 20)}...
                      </div>
                      <div className="text-[10px] text-cyber-600 truncate max-w-[220px]" title={entry.prevHash}>
                        prev: {entry.prevHash.slice(0, 20)}...
                      </div>
                    </td>
                    <td className="py-3 px-4 text-muted-foreground font-sans max-w-xs truncate text-[11px]" title={entry.detail}>
                      {entry.detail}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

