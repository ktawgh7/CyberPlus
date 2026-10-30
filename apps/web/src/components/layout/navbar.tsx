"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Menu, X, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";

const navigation = [
  { name: "Product", href: "/product" },
  { name: "Solutions", href: "/solutions" },
  { name: "Resources", href: "/resources" },
  { name: "Support", href: "/support" },
  { name: "Pricing", href: "/pricing" },
  { name: "Developers", href: "/developers" },
];

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    // Ensure document never has dark mode class and clear stale storage
    document.documentElement.classList.remove("dark");
    try {
      localStorage.removeItem("cyberplus-theme");
    } catch {}

    const checkAuth = async () => {
      try {
        const res = await fetch("/api/auth/me");
        setIsLoggedIn(res.ok);
      } catch {
        setIsLoggedIn(false);
      }
    };
    checkAuth();
  }, []);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    setIsLoggedIn(false);
    window.location.href = "/";
  };

  return (
    <nav
      className={cn(
        "fixed top-0 z-50 w-full transition-all duration-200",
        scrolled
          ? "bg-white/95 backdrop-blur-xl border-b border-[#e2e2e2] shadow-xs"
          : "bg-white/85 backdrop-blur-md border-b border-[#eeeeee]"
      )}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-14 items-center justify-between">
          {/* Logo — Tesla style sleek typography */}
          <Link href="/" className="flex items-center gap-2 group">
            <Shield className="h-6 w-6 text-[#171a20] transition-transform group-hover:scale-105" />
            <span className="text-lg font-bold tracking-tight text-[#171a20]">
              Cyber<span className="text-[#3e6ae1]">Plus</span>
            </span>
          </Link>

          {/* Desktop Navigation — centered like Tesla.com */}
          <div className="hidden lg:flex lg:items-center lg:gap-1">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "rounded-md px-3.5 py-1.5 text-sm font-medium tracking-normal transition-colors",
                  pathname === item.href || pathname.startsWith(item.href + "/")
                    ? "text-[#171a20] font-semibold bg-[#f4f4f4]"
                    : "text-[#393c41] hover:text-[#171a20] hover:bg-[#f4f4f4]"
                )}
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Right side — CTAs */}
          <div className="flex items-center gap-2">
            <div className="hidden sm:flex sm:items-center sm:gap-2">
              {isLoggedIn ? (
                <>
                  <Link href="/dashboard">
                    <Button variant="ghost" size="sm">Dashboard</Button>
                  </Link>
                  <Button variant="ghost" size="sm" onClick={handleLogout}>
                    Log out
                  </Button>
                </>
              ) : (
                <>
                  <Link href="/login">
                    <Button variant="ghost" size="sm">Log in</Button>
                  </Link>
                  <Link href="/signup">
                    <Button size="sm" className="rounded-md">Sign up</Button>
                  </Link>
                </>
              )}
            </div>

            {/* Mobile menu button */}
            <button
              className="lg:hidden rounded-full p-2 text-[#5c5e62] hover:text-[#171a20] hover:bg-[#f4f4f4] transition-colors"
              onClick={() => setIsOpen(!isOpen)}
              aria-label="Toggle menu"
              aria-expanded={isOpen}
            >
              {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {isOpen && (
          <div className="lg:hidden border-t border-[#e2e2e2] bg-white pb-4 pt-2">
            <div className="space-y-1">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "block rounded-md px-3 py-2 text-base font-medium transition-colors",
                    pathname === item.href
                      ? "text-[#171a20] font-semibold bg-[#f4f4f4]"
                      : "text-[#5c5e62] hover:text-[#171a20] hover:bg-[#f4f4f4]"
                  )}
                  onClick={() => setIsOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              <div className="pt-4 space-y-2 px-3 border-t border-[#e2e2e2]">
                {isLoggedIn ? (
                  <>
                    <Link href="/dashboard" className="block">
                      <Button variant="outline" className="w-full" onClick={() => setIsOpen(false)}>
                        Dashboard
                      </Button>
                    </Link>
                    <Button variant="ghost" className="w-full" onClick={handleLogout}>
                      Log out
                    </Button>
                  </>
                ) : (
                  <>
                    <Link href="/login" className="block">
                      <Button variant="outline" className="w-full" onClick={() => setIsOpen(false)}>
                        Log in
                      </Button>
                    </Link>
                    <Link href="/signup" className="block">
                      <Button className="w-full" onClick={() => setIsOpen(false)}>Sign up</Button>
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
