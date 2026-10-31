"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CyberPlusLogo } from "@/components/ui/logo";
import { triggerCalmHomeRefresh } from "@/components/layout/page-transition";

const navigation = [
  { name: "Product", href: "/product" },
  { name: "Solutions", href: "/solutions" },
  { name: "Resources", href: "/resources" },
  { name: "Support", href: "/support" },
  { name: "Pricing", href: "/pricing" },
];

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    document.documentElement.classList.remove("dark");
    try {
      localStorage.removeItem("cyberplus-theme");
    } catch {}
  }, []);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleBrandClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    setIsOpen(false);
    if (
      e.button !== 0 ||
      e.metaKey ||
      e.ctrlKey ||
      e.shiftKey ||
      e.altKey
    ) {
      return;
    }

    if (pathname === "/" || window.location.pathname === "/") {
      e.preventDefault();
      triggerCalmHomeRefresh();
    }
  };

  return (
    <nav
      className={cn(
        "nav-calm-fade fixed top-0 z-50 w-full transition-all duration-200",
        scrolled
          ? "bg-white/95 backdrop-blur-xl border-b border-[#e2e2e2] shadow-xs"
          : "bg-white/85 backdrop-blur-md border-b border-[#eeeeee]"
      )}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-[62px] items-center justify-between">
          {/* Logo — Tesla style sleek typography with exact Shield+ logo */}
          <Link
            href="/"
            prefetch
            onClick={handleBrandClick}
            className="flex items-center gap-2 group"
          >
            <CyberPlusLogo size={41} priority className="h-[40.32px] w-[40.32px]" />
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
                prefetch
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
              <Link href="/pricing" prefetch>
                <Button size="sm" className="rounded-md">
                  Get Started
                </Button>
              </Link>
            </div>

            {/* Mobile menu button */}
            <button
              className="lg:hidden rounded-full p-2 text-[#5c5e62] hover:text-[#171a20] hover:bg-[#f4f4f4] transition-colors"
              onClick={() => setIsOpen((prev) => !prev)}
              aria-label="Toggle menu"
              aria-expanded={isOpen}
            >
              {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen ? (
        <div className="lg:hidden border-b border-[#e2e2e2] bg-white px-4 pt-3 pb-6 space-y-1 shadow-lg animate-in slide-in-from-top-2">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              prefetch
              onClick={() => setIsOpen(false)}
              className={cn(
                "block rounded-lg px-3 py-2 text-base font-medium transition-colors",
                pathname === item.href
                  ? "bg-[#f4f4f4] text-[#171a20] font-semibold"
                  : "text-[#393c41] hover:bg-[#f4f4f4] hover:text-[#171a20]"
              )}
            >
              {item.name}
            </Link>
          ))}
          <div className="pt-4 border-t border-[#e2e2e2] flex flex-col gap-2">
            <Link href="/pricing" prefetch onClick={() => setIsOpen(false)}>
              <Button className="w-full">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      ) : null}
    </nav>
  );
}
