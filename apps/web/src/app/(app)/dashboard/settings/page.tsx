"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Lock,
  ShieldAlert,
  Smartphone,
  Download,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Bell,
  Eye,
  RefreshCw,
} from "lucide-react";

export default function SettingsSecurityPage() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [duressCode, setDuressCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [statusMsg, setStatusMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatusMsg("");
    setErrorMsg("");
    try {
      const res = await fetch("/api/settings/password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Password update failed");
      setStatusMsg("Password updated successfully.");
      setCurrentPassword("");
      setNewPassword("");
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to update password");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveDuressCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatusMsg("");
    setErrorMsg("");
    try {
      const res = await fetch("/api/settings/duress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ duressCode }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Duress code update failed");
      setStatusMsg("Duress security PIN saved.");
      setDuressCode("");
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to update duress code");
    } finally {
      setLoading(false);
    }
  };

  const handleExportData = async () => {
    try {
      const res = await fetch("/api/settings/export");
      const data = await res.json();
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `cyberplus-profile-export-${Date.now()}.json`;
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      alert("Failed to export profile data");
    }
  };

  const handleDeleteAccount = async () => {
    if (!confirm("Are you sure you want to permanently delete your CyberPlus profile? Your active keys will be permanently revoked from the verified-humans network.")) {
      return;
    }
    try {
      const res = await fetch("/api/settings/delete-account", { method: "POST" });
      if (res.ok) {
        alert("Your account has been deleted. Redirecting to home page.");
        window.location.href = "/";
      }
    } catch {
      alert("Failed to delete account");
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Security & Governance Settings</h1>
        <p className="text-xs text-muted-foreground mt-1">
          Configure physical duress codes, update credentials, export records, or delete personal data.
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

      {/* DURESS CODE CARD */}
      <Card className="border-cyber-200 dark:border-cyber-800">
        <CardHeader>
          <div className="flex items-center gap-2">
            <ShieldAlert className="h-5 w-5 text-danger" />
            <CardTitle className="text-lg">Duress Code (Physical Coercion Safeguard)</CardTitle>
          </div>
          <CardDescription className="text-xs">
            A secondary PIN that appears to work normally on screen, but silently flags the action as coerced and alerts internal officers.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSaveDuressCode} className="space-y-4 max-w-md">
            <div>
              <label className="block text-xs font-semibold mb-1 text-cyber-400">Configure 4-Digit Duress PIN</label>
              <Input
                required
                type="password"
                maxLength={6}
                placeholder="e.g. 9999"
                value={duressCode}
                onChange={(e) => setDuressCode(e.target.value)}
              />
            </div>
            <Button type="submit" disabled={loading} size="sm" variant="outline">
              Save Duress Code
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* CHANGE PASSWORD */}
      <Card className="border-cyber-200 dark:border-cyber-800">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Lock className="h-5 w-5 text-accent-400" />
            <CardTitle className="text-lg">Change Password</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleUpdatePassword} className="space-y-4 max-w-md">
            <div>
              <label className="block text-xs font-semibold mb-1 text-cyber-400">Current Password</label>
              <Input
                required
                type="password"
                placeholder="••••••••••••"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold mb-1 text-cyber-400">New Password</label>
              <Input
                required
                type="password"
                placeholder="••••••••••••"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </div>

            <Button type="submit" disabled={loading} size="sm">
              Update Password
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* DATA EXPORT & DANGER ZONE */}
      <div className="grid sm:grid-cols-2 gap-6">
        <Card className="border-cyber-200 dark:border-cyber-800">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Download className="h-4 w-4 text-accent-400" />
              Export My Data
            </CardTitle>
            <CardDescription className="text-xs">
              Download your profile records, connected app metadata, and full audit chain log in JSON format.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={handleExportData} variant="outline" size="sm" className="w-full">
              Download JSON Archive
            </Button>
          </CardContent>
        </Card>

        <Card className="border-danger/30 bg-danger/5">
          <CardHeader>
            <CardTitle className="text-base text-danger flex items-center gap-2">
              <Trash2 className="h-4 w-4" />
              Delete Account & Revoke Key
            </CardTitle>
            <CardDescription className="text-xs">
              Permanently revokes your commitment, wipes personal details, and removes credentials.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={handleDeleteAccount} variant="destructive" size="sm" className="w-full">
              Permanently Delete Account
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

