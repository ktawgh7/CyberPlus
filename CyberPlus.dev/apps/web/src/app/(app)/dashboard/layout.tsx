import React from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { Badge } from "@/components/ui/badge";
import {
  Shield,
  Key,
  Smartphone,
  History,
  Settings,
  Building2,
  FileCheck,
  UserCheck,
  ShieldAlert,
} from "lucide-react";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login");
  }

  const profile = user.profile;
  const tier = profile?.tier || 1;
  const status = profile?.status || "NOT_ENROLLED";

  const navItems = [
    { name: "Overview", href: "/dashboard", icon: Shield },
    { name: "Enrollment", href: "/dashboard/enroll", icon: Smartphone },
    { name: "Key Management", href: "/dashboard/key", icon: Key },
    { name: "Connected Apps", href: "/dashboard/apps", icon: FileCheck },
    { name: "Audit & Activity", href: "/dashboard/activity", icon: History },
    { name: "Settings & Security", href: "/dashboard/settings", icon: Settings },
    { name: "Business Organization", href: "/dashboard/business", icon: Building2 },
  ];

  return (
    <div className="pt-24 pb-16 min-h-screen bg-[#f9f9f9] text-[#171a20]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Top Profile Summary Bar */}
        <div className="bg-white border border-[#e2e2e2] rounded-2xl p-6 mb-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xs">
          <div className="flex items-center gap-4">
            <div className="h-14 w-14 rounded-2xl bg-[#3e6ae1]/10 border border-[#3e6ae1]/20 flex items-center justify-center shrink-0">
              <Shield className="h-7 w-7 text-[#3e6ae1]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-[#171a20]">{user.name}</h1>
                <Badge variant="prototype" className="text-[10px]">
                  Prototype
                </Badge>
              </div>
              <p className="text-xs text-[#5c5e62] mt-0.5">{user.email}</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="text-right hidden sm:block">
              <div className="text-[11px] text-[#5c5e62]">Assurance Level</div>
              <div className="font-bold text-sm text-[#171a20]">Tier {tier} Profile</div>
            </div>

            <Badge
              variant={
                status === "ACTIVE"
                  ? "success"
                  : status === "FROZEN"
                  ? "destructive"
                  : status === "PENDING_ACTIVATION"
                  ? "warning"
                  : "secondary"
              }
              className="text-xs py-1 px-3"
            >
              Key Status: {status.replace("_", " ")}
            </Badge>

            {user.role === "OFFICER" && (
              <Link href="/officer">
                <Badge variant="outline" className="cursor-pointer border-[#3e6ae1] text-[#3e6ae1] py-1 px-2.5">
                  Officer Portal →
                </Badge>
              </Link>
            )}

            {user.role === "ADMIN" && (
              <Link href="/admin">
                <Badge variant="outline" className="cursor-pointer border-purple-500 text-purple-600 py-1 px-2.5">
                  Admin Console →
                </Badge>
              </Link>
            )}
          </div>
        </div>

        {/* Dashboard Navigation Tabs */}
        <div className="flex border-b border-[#e2e2e2] mb-8 overflow-x-auto gap-1">
          {navItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="flex items-center gap-2 px-4 py-3 text-sm font-semibold border-b-2 border-transparent hover:text-[#3e6ae1] hover:border-[#3e6ae1] transition-all text-[#5c5e62] whitespace-nowrap"
            >
              <item.icon className="h-4 w-4" />
              <span>{item.name}</span>
            </Link>
          ))}
        </div>

        {/* Page Content */}
        {children}
      </div>
    </div>
  );
}

