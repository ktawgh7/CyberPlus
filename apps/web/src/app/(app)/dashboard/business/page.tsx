"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Building2,
  Users,
  Key,
  Webhook as WebhookIcon,
  ShieldCheck,
  Plus,
  Trash2,
  Copy,
  Check,
  CreditCard,
  Sliders,
  Upload,
  BarChart3,
  TrendingUp,
} from "lucide-react";

export default function BusinessOrganizationPage() {
  const [members, setMembers] = useState<any[]>([]);
  const [keys, setKeys] = useState<any[]>([]);
  const [webhooks, setWebhooks] = useState<any[]>([]);
  const [deliveries, setDeliveries] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [orgName, setOrgName] = useState("Acrobatics Financial Tech");

  // Invite Member state
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteName, setInviteName] = useState("");
  const [inviteRole, setInviteRole] = useState("MEMBER");

  // API Key state
  const [newKeyName, setNewKeyName] = useState("");
  const [newKeyMode, setNewKeyMode] = useState<"SANDBOX" | "LIVE">("SANDBOX");
  const [createdKey, setCreatedKey] = useState<string | null>(null);

  // Webhook state
  const [webhookUrl, setWebhookUrl] = useState("");

  // Policy Editor state
  const [transferThreshold, setTransferThreshold] = useState("50000");
  const [policySaved, setPolicySaved] = useState(false);

  const fetchData = async () => {
    try {
      const [mRes, kRes, wRes] = await Promise.all([
        fetch("/api/business/members"),
        fetch("/api/business/keys"),
        fetch("/api/business/webhooks"),
      ]);
      const mData = await mRes.json();
      const kData = await kRes.json();
      const wData = await wRes.json();

      if (mData.members) setMembers(mData.members);
      if (mData.orgName) setOrgName(mData.orgName);
      if (kData.keys) setKeys(kData.keys);
      if (wData.webhooks) setWebhooks(wData.webhooks);
      if (wData.deliveries) setDeliveries(wData.deliveries);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/business/members", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: inviteEmail, name: inviteName, role: inviteRole }),
      });
      if (res.ok) {
        setInviteEmail("");
        setInviteName("");
        await fetchData();
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCreateKey = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/business/keys", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newKeyName, mode: newKeyMode }),
      });
      const data = await res.json();
      if (data.apiKey) {
        setCreatedKey(data.apiKey);
        setNewKeyName("");
        await fetchData();
      }
    } finally {
      setLoading(false);
    }
  };

  const handleRevokeKey = async (keyId: string) => {
    if (!confirm("Revoke this API key? Applications using it will fail immediately.")) return;
    await fetch("/api/business/keys", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ keyId }),
    });
    await fetchData();
  };

  const handleAddWebhook = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/business/webhooks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: webhookUrl }),
      });
      if (res.ok) {
        setWebhookUrl("");
        await fetchData();
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSavePolicy = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem("cyberplus_bank_threshold", transferThreshold);
    setPolicySaved(true);
    setTimeout(() => setPolicySaved(false), 3000);
  };

  return (
    <div className="space-y-8">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <Building2 className="h-6 w-6 text-accent-400" />
          <h1 className="text-2xl font-bold tracking-tight">{orgName}</h1>
          <Badge variant="outline">Pilot Business Plan</Badge>
        </div>
        <p className="text-xs text-muted-foreground">
          Manage enrolled employees, API keys, webhook endpoints, and wire transfer policy thresholds.
        </p>
      </div>

      <Tabs defaultValue="members">
        <TabsList className="grid grid-cols-5 max-w-2xl">
          <TabsTrigger value="members">Members</TabsTrigger>
          <TabsTrigger value="keys">API Keys</TabsTrigger>
          <TabsTrigger value="webhooks">Webhooks</TabsTrigger>
          <TabsTrigger value="usage">Usage & Billing</TabsTrigger>
          <TabsTrigger value="policies">Policies</TabsTrigger>
        </TabsList>

        {/* 1. MEMBERS */}
        <TabsContent value="members" className="space-y-6">
          {/* Invite form */}
          <Card className="border-cyber-200 dark:border-cyber-800 p-6">
            <h3 className="text-sm font-bold mb-4">Invite Employee to Organization</h3>
            <form onSubmit={handleInvite} className="grid sm:grid-cols-4 gap-3">
              <Input
                required
                placeholder="Full Name"
                value={inviteName}
                onChange={(e) => setInviteName(e.target.value)}
                className="text-xs"
              />
              <Input
                required
                type="email"
                placeholder="colleague@domain.com"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                className="text-xs"
              />
              <select
                value={inviteRole}
                onChange={(e) => setInviteRole(e.target.value)}
                className="h-10 rounded-lg border border-cyber-700 bg-cyber-900 px-3 text-xs text-foreground"
              >
                <option value="MEMBER">Member</option>
                <option value="ADMIN">Admin</option>
              </select>
              <Button type="submit" disabled={loading} size="sm">
                <Plus className="mr-1 h-3.5 w-3.5" /> Send Invite
              </Button>
            </form>
          </Card>

          {/* Members Table */}
          <Card className="border-cyber-200 dark:border-cyber-800 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-cyber-100 dark:bg-cyber-900/60 border-b border-cyber-200 dark:border-cyber-800 text-cyber-500 uppercase text-[10px]">
                  <tr>
                    <th className="py-3 px-4">Employee</th>
                    <th className="py-3 px-4">Org Role</th>
                    <th className="py-3 px-4">Assurance Tier</th>
                    <th className="py-3 px-4">Key Status</th>
                    <th className="py-3 px-4">Enrolled</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-cyber-200 dark:divide-cyber-800">
                  {members.map((m) => (
                    <tr key={m.id} className="hover:bg-cyber-50 dark:hover:bg-cyber-900/40">
                      <td className="py-3 px-4">
                        <div className="font-bold text-foreground">{m.name}</div>
                        <div className="text-[11px] text-muted-foreground">{m.email}</div>
                      </td>
                      <td className="py-3 px-4">
                        <Badge variant="outline" className="text-[10px]">{m.role}</Badge>
                      </td>
                      <td className="py-3 px-4 font-bold text-accent-400">
                        Tier {m.tier}
                      </td>
                      <td className="py-3 px-4">
                        <Badge variant={m.status === "ACTIVE" ? "success" : "secondary"} className="text-[10px]">
                          {m.status}
                        </Badge>
                      </td>
                      <td className="py-3 px-4 text-cyber-500 text-[11px]">
                        {new Date(m.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </TabsContent>

        {/* 2. API KEYS */}
        <TabsContent value="keys" className="space-y-6">
          <Card className="border-cyber-200 dark:border-cyber-800 p-6">
            <h3 className="text-sm font-bold mb-4">Generate Application API Key</h3>
            <form onSubmit={handleCreateKey} className="grid sm:grid-cols-4 gap-3">
              <Input
                required
                placeholder="Key Name (e.g. Treasury Bot)"
                value={newKeyName}
                onChange={(e) => setNewKeyName(e.target.value)}
                className="text-xs"
              />
              <select
                value={newKeyMode}
                onChange={(e) => setNewKeyMode(e.target.value as any)}
                className="h-10 rounded-lg border border-cyber-700 bg-cyber-900 px-3 text-xs text-foreground"
              >
                <option value="SANDBOX">Sandbox (Test Mode)</option>
                <option value="LIVE">Live Production</option>
              </select>
              <div className="sm:col-span-2">
                <Button type="submit" disabled={loading} size="sm" className="w-full">
                  Create API Key
                </Button>
              </div>
            </form>

            {createdKey && (
              <div className="mt-4 p-4 rounded-xl bg-accent-500/10 border border-accent-400/30 text-xs">
                <div className="flex justify-between items-center font-bold text-accent-400 mb-1">
                  <span>Your New API Key (Copy Now &mdash; Hidden on Refresh):</span>
                </div>
                <code className="block p-2 rounded bg-[#f4f4f4] border border-[#e2e2e2] font-mono text-[#171a20] break-all">
                  {createdKey}
                </code>
              </div>
            )}
          </Card>

          <Card className="border-cyber-200 dark:border-cyber-800 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead className="bg-cyber-100 dark:bg-cyber-900/60 border-b border-cyber-200 dark:border-cyber-800 text-cyber-500 uppercase text-[10px] font-sans">
                  <tr>
                    <th className="py-3 px-4">Name</th>
                    <th className="py-3 px-4">Prefix</th>
                    <th className="py-3 px-4">Mode</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-cyber-200 dark:divide-cyber-800">
                  {keys.map((k) => (
                    <tr key={k.id} className="hover:bg-cyber-50 dark:hover:bg-cyber-900/40">
                      <td className="py-3 px-4 font-sans font-bold text-foreground">{k.name}</td>
                      <td className="py-3 px-4 text-cyber-400">{k.prefix}••••••••</td>
                      <td className="py-3 px-4 font-sans">
                        <Badge variant={k.mode === "LIVE" ? "default" : "secondary"} className="text-[10px]">
                          {k.mode}
                        </Badge>
                      </td>
                      <td className="py-3 px-4 font-sans">
                        <Badge variant={k.revokedAt ? "destructive" : "success"} className="text-[10px]">
                          {k.revokedAt ? "Revoked" : "Active"}
                        </Badge>
                      </td>
                      <td className="py-3 px-4 font-sans">
                        {!k.revokedAt && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleRevokeKey(k.id)}
                            className="text-red-400 border-red-500/30 text-[11px] h-7 px-2"
                          >
                            Revoke
                          </Button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </TabsContent>

        {/* 3. WEBHOOKS */}
        <TabsContent value="webhooks" className="space-y-6">
          <Card className="border-cyber-200 dark:border-cyber-800 p-6">
            <h3 className="text-sm font-bold mb-4">Add HTTPS Webhook Endpoint</h3>
            <form onSubmit={handleAddWebhook} className="flex gap-3">
              <Input
                required
                type="url"
                placeholder="https://your-domain.com/api/cyberplus-events"
                value={webhookUrl}
                onChange={(e) => setWebhookUrl(e.target.value)}
                className="text-xs flex-1"
              />
              <Button type="submit" disabled={loading} size="sm">
                Add Webhook
              </Button>
            </form>
          </Card>

          <Card className="border-cyber-200 dark:border-cyber-800 p-6">
            <h3 className="text-sm font-bold mb-3">Recent Webhook Deliveries</h3>
            <div className="space-y-2 font-mono text-xs">
              {deliveries.length === 0 ? (
                <p className="text-muted-foreground text-center py-4 font-sans text-xs">No webhook deliveries recorded yet.</p>
              ) : (
                deliveries.map((d) => (
                  <div key={d.id} className="p-3 rounded-lg bg-[#f9f9f9] border border-[#e2e2e2] flex justify-between items-center">
                    <div>
                      <span className="text-accent-400 font-bold">{d.event}</span>
                      <span className="text-cyber-500 text-[10px] ml-2">Status: {d.statusCode}</span>
                    </div>
                    <Badge variant={d.success ? "success" : "destructive"} className="text-[10px]">
                      {d.success ? "Delivered" : "Failed"}
                    </Badge>
                  </div>
                ))
              )}
            </div>
          </Card>
        </TabsContent>

        {/* 4. USAGE & BILLING */}
        <TabsContent value="usage" className="space-y-6">
          <div className="grid sm:grid-cols-3 gap-6">
            <Card className="border-cyber-200 dark:border-cyber-800 p-6">
              <CardDescription className="text-xs">Active Enrolled Seats</CardDescription>
              <CardTitle className="text-3xl font-bold mt-1">5 Seats</CardTitle>
              <p className="text-xs text-muted-foreground mt-2">Billed at $9/seat/mo</p>
            </Card>

            <Card className="border-cyber-200 dark:border-cyber-800 p-6">
              <CardDescription className="text-xs">Live Verifications This Month</CardDescription>
              <CardTitle className="text-3xl font-bold mt-1 text-accent-400">142</CardTitle>
              <p className="text-xs text-muted-foreground mt-2">5,000 included in pilot</p>
            </Card>

            <Card className="border-cyber-200 dark:border-cyber-800 p-6">
              <CardDescription className="text-xs">Sandbox Test Checks</CardDescription>
              <CardTitle className="text-3xl font-bold mt-1 text-cyber-300">840</CardTitle>
              <p className="text-xs text-muted-foreground mt-2">Unlimited free test checks</p>
            </Card>
          </div>

          {/* Simple Visual Chart of daily checks */}
          <Card className="border-cyber-200 dark:border-cyber-800 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold flex items-center gap-2">
                <BarChart3 className="h-4 w-4 text-accent-400" />
                Verifications per Day (Last 7 Days)
              </h3>
              <Badge variant="outline">Telemetry</Badge>
            </div>
            <div className="h-40 flex items-end gap-4 pt-6 px-4 border-b border-cyber-800">
              {[
                { day: "Mon", count: 18, h: "35%" },
                { day: "Tue", count: 24, h: "48%" },
                { day: "Wed", count: 32, h: "62%" },
                { day: "Thu", count: 19, h: "38%" },
                { day: "Fri", count: 45, h: "85%" },
                { day: "Sat", count: 12, h: "25%" },
                { day: "Today", count: 38, h: "75%" },
              ].map((item) => (
                <div key={item.day} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end">
                  <div
                    style={{ height: item.h }}
                    className="w-full bg-accent-500/70 hover:bg-accent-400 rounded-t-md transition-all cursor-pointer relative group"
                  >
                    <div className="opacity-0 group-hover:opacity-100 absolute -top-7 left-1/2 -translate-x-1/2 text-[10px] bg-cyber-900 border border-cyber-700 px-1.5 py-0.5 rounded pointer-events-none">
                      {item.count}
                    </div>
                  </div>
                  <span className="text-[10px] text-cyber-500">{item.day}</span>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>

        {/* 5. POLICY EDITOR */}
        <TabsContent value="policies" className="space-y-6">
          <Card className="border-cyber-200 dark:border-cyber-800 p-6">
            <div className="flex items-center gap-2 mb-2">
              <Sliders className="h-5 w-5 text-accent-400" />
              <h3 className="text-lg font-bold">Treasury & Wire Approval Policies</h3>
            </div>
            <p className="text-xs text-muted-foreground mb-6">
              Define the cryptographic thresholds required before employees can authorize high-value transactions.
            </p>

            <form onSubmit={handleSavePolicy} className="space-y-6 max-w-xl">
              <div className="p-4 rounded-xl bg-[#f9f9f9] border border-[#e2e2e2] space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-foreground">
                    Enforce Tier 2 / Tier 3 Proof Threshold ($ USD)
                  </label>
                  <p className="text-[11px] text-muted-foreground">
                    Transfers exceeding this dollar amount will strictly block until a verified human proof from a Tier 2 or Tier 3 device key is submitted.
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-sm font-bold text-cyber-400">$</span>
                    <Input
                      type="number"
                      value={transferThreshold}
                      onChange={(e) => setTransferThreshold(e.target.value)}
                      className="font-mono text-sm max-w-xs"
                    />
                  </div>
                </div>

                <div className="space-y-2 pt-2 border-t border-cyber-800 text-xs">
                  <div className="flex items-center gap-2">
                    <input type="checkbox" defaultChecked className="rounded border-cyber-700 bg-cyber-900 text-accent-400" />
                    <span className="text-cyber-300">Require second approval through emailed channel link</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <input type="checkbox" defaultChecked className="rounded border-cyber-700 bg-cyber-900 text-accent-400" />
                    <span className="text-cyber-300">Reject synthetic neural video callers lacking device passkey</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Button type="submit" size="sm">
                  Save Policy Configuration
                </Button>
                {policySaved && (
                  <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
                    <Check className="h-3.5 w-3.5" /> Policy Enforced! The /demo/bank app will now enforce ${transferThreshold}.
                  </span>
                )}
              </div>
            </form>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

