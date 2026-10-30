"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  ShieldAlert,
  Users2,
  FileCheck2,
  Calendar,
  CheckCircle2,
  AlertTriangle,
  AlertCircle,
  Clock,
  Sparkles,
  ArrowRight,
  Shield,
  UserCheck,
} from "lucide-react";

export default function OfficerPortalPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [statusMsg, setStatusMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  // In-person checklist state
  const [checkedHologram, setCheckedHologram] = useState(false);
  const [checkedPhotoMatch, setCheckedPhotoMatch] = useState(false);
  const [checkedNoBiometricStored, setCheckedNoBiometricStored] = useState(false);

  const fetchQueue = async () => {
    try {
      const res = await fetch("/api/officer/queue");
      const d = await res.json();
      if (res.ok) setData(d);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchQueue();
  }, []);

  const handleVerifyAppointment = async (apptId: string) => {
    if (!checkedHologram || !checkedPhotoMatch || !checkedNoBiometricStored) {
      alert("Please complete and confirm all items on the physical inspection checklist.");
      return;
    }
    setLoading(true);
    setStatusMsg("");
    setErrorMsg("");
    try {
      const res = await fetch("/api/officer/verify-appointment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          appointmentId: apptId,
          checks: { checkedHologram, checkedPhotoMatch, checkedNoBiometricStored },
        }),
      });
      const resData = await res.json();
      if (!res.ok) throw new Error(resData.error || "Verification failed");
      setStatusMsg("Appointment verified! Citizen elevated to new tier.");
      setCheckedHologram(false);
      setCheckedPhotoMatch(false);
      setCheckedNoBiometricStored(false);
      await fetchQueue();
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to verify appointment");
    } finally {
      setLoading(false);
    }
  };

  const handleApproveRecovery = async (requestId: string) => {
    setLoading(true);
    setStatusMsg("");
    setErrorMsg("");
    try {
      const res = await fetch("/api/officer/approve-recovery", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ requestId }),
      });
      const resData = await res.json();
      if (!res.ok) throw new Error(resData.error || "Recovery approval failed");
      setStatusMsg(resData.message || "Approval recorded successfully.");
      await fetchQueue();
    } catch (err: any) {
      setErrorMsg(err.message || "Approval rejected");
    } finally {
      setLoading(false);
    }
  };

  const handleFastForward = async (requestId: string) => {
    setLoading(true);
    try {
      const res = await fetch("/api/officer/fast-forward", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ requestId }),
      });
      const resData = await res.json();
      if (!res.ok) throw new Error(resData.error);
      setStatusMsg("Fast-forward complete. Recovered key is now ACTIVE.");
      await fetchQueue();
    } catch (err: any) {
      setErrorMsg(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-24 pb-16 min-h-screen bg-[#f9f9f9] text-[#171a20]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header */}
        <div className="bg-white border border-[#e2e2e2] rounded-2xl p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-xl bg-purple-500/10 flex items-center justify-center shrink-0">
              <UserCheck className="h-6 w-6 text-purple-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold">Officer Verification Portal</h1>
                <Badge variant="outline" className="text-xs">Dual-Custody Mode</Badge>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">
                Logged in as: <strong className="text-foreground">{data?.currentOfficer?.name}</strong> ({data?.currentOfficer?.role})
              </p>
            </div>
          </div>

          <Link href="/dashboard">
            <Button variant="outline" size="sm">
              Return to User Dashboard
            </Button>
          </Link>
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

        <Tabs defaultValue="recovery">
          <TabsList className="grid grid-cols-3 max-w-md">
            <TabsTrigger value="recovery">
              Recovery ({data?.recoveryRequests?.length || 0})
            </TabsTrigger>
            <TabsTrigger value="appointments">
              Appointments ({data?.pendingAppointments?.length || 0})
            </TabsTrigger>
            <TabsTrigger value="documents">
              Documents ({data?.pendingDocs?.length || 0})
            </TabsTrigger>
          </TabsList>

          {/* TAB 1: TWO-OFFICER RECOVERY REQUESTS */}
          <TabsContent value="recovery" className="space-y-6">
            <div className="p-4 rounded-xl bg-purple-950/20 border border-purple-500/30 text-xs text-purple-200 flex items-start gap-3">
              <Users2 className="h-5 w-5 text-purple-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-sm">Two-Person Rule Server-Side Enforcement</span>
                <p className="mt-1 leading-relaxed text-cyber-300">
                  Account recovery cannot be completed by one officer alone. A minimum of two distinct authenticated officers must physically inspect credentials and sign. If the applicant used their duress PIN, the duress flag will be visible below.
                </p>
              </div>
            </div>

            <div className="space-y-4">
              {(!data?.recoveryRequests || data.recoveryRequests.length === 0) ? (
                <Card className="border-cyber-200 dark:border-cyber-800 p-8 text-center text-xs text-muted-foreground">
                  No pending recovery requests in queue.
                </Card>
              ) : (
                data.recoveryRequests.map((req: any) => {
                  const approvals = req.approvals || [];
                  const firstOfficer = approvals[0]?.officer;
                  const isFirstApproved = approvals.length >= 1;
                  const isSecondApproved = approvals.length >= 2;
                  const amITheApprover = approvals.some((a: any) => a.officerId === data.currentOfficer?.id);

                  return (
                    <Card key={req.id} className="border-cyber-200 dark:border-cyber-800 p-6 space-y-4">
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-bold text-base">{req.user?.name}</h3>
                            <span className="text-xs text-muted-foreground">({req.user?.email})</span>
                            {req.duressTriggered && (
                              <Badge variant="destructive" className="flex items-center gap-1">
                                <AlertTriangle className="h-3 w-3" /> DURESS SIGNAL DETECTED
                              </Badge>
                            )}
                          </div>
                          <p className="text-xs text-cyber-400 mt-1 font-mono">
                            Request ID: {req.id} • Created: {new Date(req.createdAt).toLocaleString()}
                          </p>
                        </div>
                        <Badge variant={req.status === "ACTIVATION_DELAY" ? "warning" : "default"}>
                          {req.status}
                        </Badge>
                      </div>

                      {/* Approval Status Grid */}
                      <div className="grid sm:grid-cols-2 gap-3 text-xs">
                        <div className={`p-3 rounded-xl border ${isFirstApproved ? "border-emerald-500/40 bg-emerald-950/20 text-emerald-300" : "border-cyber-800 bg-cyber-900/40"}`}>
                          <div className="font-bold mb-1 flex items-center gap-1.5">
                            {isFirstApproved ? <CheckCircle2 className="h-4 w-4 text-emerald-400" /> : <Clock className="h-4 w-4 text-cyber-500" />}
                            <span>Officer Approval #1</span>
                          </div>
                          <p className="text-muted-foreground">
                            {isFirstApproved ? `Signed by ${firstOfficer?.name}` : "Awaiting first officer signature"}
                          </p>
                        </div>

                        <div className={`p-3 rounded-xl border ${isSecondApproved ? "border-emerald-500/40 bg-emerald-950/20 text-emerald-300" : "border-cyber-800 bg-cyber-900/40"}`}>
                          <div className="font-bold mb-1 flex items-center gap-1.5">
                            {isSecondApproved ? <CheckCircle2 className="h-4 w-4 text-emerald-400" /> : <Clock className="h-4 w-4 text-cyber-500" />}
                            <span>Officer Approval #2 (Two-Person Rule)</span>
                          </div>
                          <p className="text-muted-foreground">
                            {isSecondApproved ? `Signed by ${approvals[1]?.officer?.name}` : "Requires distinct second officer"}
                          </p>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="pt-2 flex flex-wrap items-center gap-3">
                        {req.status !== "ACTIVATION_DELAY" && req.status !== "COMPLETED" && (
                          <Button
                            onClick={() => handleApproveRecovery(req.id)}
                            disabled={loading || amITheApprover}
                            size="sm"
                          >
                            {amITheApprover ? "You already signed (Awaiting 2nd Officer)" : "Approve & Sign Recovery Step"}
                          </Button>
                        )}

                        {req.status === "ACTIVATION_DELAY" && (
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => handleFastForward(req.id)}
                            disabled={loading}
                            className="text-xs"
                          >
                            <Sparkles className="mr-1.5 h-3.5 w-3.5 text-accent-400" />
                            Fast-Forward 48h Delay (Demo Only)
                          </Button>
                        )}
                      </div>
                    </Card>
                  );
                })
              )}
            </div>
          </TabsContent>

          {/* TAB 2: IN-PERSON APPOINTMENTS & PHYSICAL CHECKLIST */}
          <TabsContent value="appointments" className="space-y-6">
            <div className="space-y-4">
              {(!data?.pendingAppointments || data.pendingAppointments.length === 0) ? (
                <Card className="border-cyber-200 dark:border-cyber-800 p-8 text-center text-xs text-muted-foreground">
                  No confirmed appointments currently pending.
                </Card>
              ) : (
                data.pendingAppointments.map((appt: any) => (
                  <Card key={appt.id} className="border-cyber-200 dark:border-cyber-800 p-6 space-y-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold text-base">{appt.user?.name}</h3>
                          <Badge variant="outline">Target: Tier {appt.tier}</Badge>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                          Location: <strong>{appt.location?.name}</strong> ({appt.location?.city})
                        </p>
                        <p className="text-xs text-cyber-400 mt-0.5">
                          Scheduled: {new Date(appt.dateTime).toLocaleString()}
                        </p>
                      </div>
                      <Badge variant="secondary">Confirmed Booking</Badge>
                    </div>

                    {/* Physical ID Inspection Checklist */}
                    <div className="p-4 rounded-xl bg-[#f9f9f9] border border-[#e2e2e2] space-y-3">
                      <div className="text-xs font-bold text-foreground">
                        In-Person Officer Verification Checklist:
                      </div>
                      <div className="space-y-2 text-xs">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={checkedHologram}
                            onChange={(e) => setCheckedHologram(e.target.checked)}
                            className="rounded border-cyber-700 bg-cyber-900 text-accent-400"
                          />
                          <span>Inspected physical government document (Passport/ID) & confirmed holographic security features</span>
                        </label>

                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={checkedPhotoMatch}
                            onChange={(e) => setCheckedPhotoMatch(e.target.checked)}
                            className="rounded border-cyber-700 bg-cyber-900 text-accent-400"
                          />
                          <span>Verified candidate physical appearance matches photo & legal name in person</span>
                        </label>

                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={checkedNoBiometricStored}
                            onChange={(e) => setCheckedNoBiometricStored(e.target.checked)}
                            className="rounded border-cyber-700 bg-cyber-900 text-accent-400"
                          />
                          <span>Confirmed NO biometric camera uploads or fingerprint images were captured or stored</span>
                        </label>
                      </div>
                    </div>

                    <Button
                      onClick={() => handleVerifyAppointment(appt.id)}
                      disabled={loading}
                      size="sm"
                    >
                      <CheckCircle2 className="mr-2 h-4 w-4" />
                      Complete In-Person Check & Elevate to Tier {appt.tier}
                    </Button>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>

          {/* TAB 3: DOCUMENT SUBMISSIONS */}
          <TabsContent value="documents" className="space-y-6">
            <Card className="border-cyber-200 dark:border-cyber-800 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-mono">
                  <thead className="bg-cyber-100 dark:bg-cyber-900/60 border-b border-cyber-200 dark:border-cyber-800 text-cyber-500 uppercase text-[10px] font-sans">
                    <tr>
                      <th className="py-3 px-4">User</th>
                      <th className="py-3 px-4">Doc Type</th>
                      <th className="py-3 px-4">Doc Number</th>
                      <th className="py-3 px-4">Country</th>
                      <th className="py-3 px-4">Submitted</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-cyber-200 dark:divide-cyber-800 font-sans">
                    {(!data?.pendingDocs || data.pendingDocs.length === 0) ? (
                      <tr>
                        <td colSpan={5} className="py-8 text-center text-muted-foreground text-xs">
                          No pending document submissions in queue.
                        </td>
                      </tr>
                    ) : (
                      data.pendingDocs.map((doc: any) => (
                        <tr key={doc.id} className="hover:bg-cyber-50 dark:hover:bg-cyber-900/40">
                          <td className="py-3 px-4 font-bold text-foreground">
                            {doc.fullName} ({doc.user?.email})
                          </td>
                          <td className="py-3 px-4">{doc.docType}</td>
                          <td className="py-3 px-4 font-mono text-accent-400">{doc.docNumber}</td>
                          <td className="py-3 px-4">{doc.country}</td>
                          <td className="py-3 px-4 text-cyber-500">
                            {new Date(doc.createdAt).toLocaleDateString()}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

