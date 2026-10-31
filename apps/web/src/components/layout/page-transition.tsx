"use client";

import React, { useCallback, useEffect, useLayoutEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";

const PRIMARY_ROUTES = [
  "/product",
  "/solutions",
  "/resources",
  "/support",
  "/pricing",
  "/",
];

const SECONDARY_ROUTES = [
  "/how-the-prototype-works",
  "/resources/glossary",
  "/privacy",
  "/terms",
  "/security",
  "/demo/bank",
  "/demo/call",
  "/demo/social",
  "/demo/reviews",
  "/resources/why-detecting-deepfakes-is-a-losing-game",
];

const PREFETCH_TTL_MS = 280_000;

let activeReplayHandler: (() => void) | null = null;

export function triggerCalmHomeRefresh() {
  if (typeof window !== "undefined") {
    if (window.location.hash) {
      window.history.replaceState(null, "", "/");
    }
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }
  if (activeReplayHandler) {
    activeReplayHandler();
  } else if (typeof window !== "undefined") {
    window.dispatchEvent(new Event("cyberplus:home-rise"));
  }
}

export function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);
  const animRef = useRef<Animation | null>(null);
  const prevPathnameRef = useRef(pathname);
  const prefetchedAtRef = useRef<Map<string, number>>(new Map());
  const sessionWarmedRef = useRef(false);

  const warmRoute = useCallback(
    (rawHref: string) => {
      if (!rawHref || typeof window === "undefined") return;
      if (
        rawHref.startsWith("#") ||
        rawHref.startsWith("mailto:") ||
        rawHref.startsWith("tel:")
      ) {
        return;
      }

      let targetPath: string;
      try {
        const parsed = new URL(rawHref, window.location.origin);
        if (parsed.origin !== window.location.origin) return;
        targetPath = parsed.pathname + parsed.search;
      } catch {
        return;
      }

      const now = Date.now();
      const lastPrefetched = prefetchedAtRef.current.get(targetPath);
      if (lastPrefetched && now - lastPrefetched < PREFETCH_TTL_MS) {
        return;
      }

      prefetchedAtRef.current.set(targetPath, now);
      try {
        router.prefetch(targetPath);
      } catch {}
    },
    [router]
  );

  const playCalmRise = useCallback(() => {
    const el = containerRef.current;
    if (!el || typeof el.animate !== "function") return;

    // Clear initial CSS animation so Web Animations API has full control
    el.style.animation = "none";

    if (animRef.current) {
      animRef.current.cancel();
    }

    const anim = el.animate(
      [
        { opacity: 0.12, transform: "translate3d(0, 36px, 0)", offset: 0 },
        { opacity: 0.95, offset: 0.3 },
        { opacity: 1, transform: "translate3d(0, 0, 0)", offset: 1 },
      ],
      {
        duration: 720,
        easing: "cubic-bezier(0.22, 1, 0.36, 1)",
        fill: "none",
      }
    );

    animRef.current = anim;
    anim.onfinish = () => {
      if (animRef.current === anim) {
        animRef.current = null;
      }
    };
  }, []);

  useLayoutEffect(() => {
    // Initial load and browser F5 refresh already play CSS .page-calm-rise from frame 0;
    // only trigger imperative Web Animations rise when pathname actually changes.
    if (prevPathnameRef.current === pathname) {
      return;
    }
    prevPathnameRef.current = pathname;

    if (!window.location.hash) {
      window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    }
    playCalmRise();
  }, [pathname, playCalmRise]);

  useEffect(() => {
    const replay = () => {
      window.scrollTo({ top: 0, left: 0, behavior: "instant" });
      playCalmRise();
    };

    activeReplayHandler = replay;
    window.addEventListener("cyberplus:home-rise", replay);

    const handlePageShow = (event: PageTransitionEvent) => {
      if (event.persisted) {
        playCalmRise();
      }
    };
    window.addEventListener("pageshow", handlePageShow);

    return () => {
      if (activeReplayHandler === replay) {
        activeReplayHandler = null;
      }
      window.removeEventListener("cyberplus:home-rise", replay);
      window.removeEventListener("pageshow", handlePageShow);
    };
  }, [playCalmRise]);

  useEffect(() => {
    // Instant intent prefetching on hover, focus, press, or touch for every link site-wide
    const handleLinkIntent = (event: Event) => {
      const target = event.target;
      if (!(target instanceof Element)) return;
      const anchor = target.closest("a[href]");
      if (!anchor) return;
      const href = anchor.getAttribute("href");
      if (href) {
        warmRoute(href);
      }
    };

    document.addEventListener("pointerover", handleLinkIntent, { passive: true });
    document.addEventListener("pointerdown", handleLinkIntent, { passive: true });
    document.addEventListener("touchstart", handleLinkIntent, { passive: true });
    document.addEventListener("focusin", handleLinkIntent, { passive: true });

    const timers: Array<ReturnType<typeof setTimeout>> = [];

    if (!sessionWarmedRef.current) {
      const currentPath = window.location.pathname;

      // Tier 1: Warm primary navigation routes shortly after first paint (including seeding currentPath for 0ms back-nav in dev)
      const orderedPrimary = [
        ...PRIMARY_ROUTES.filter((r) => r !== currentPath),
        currentPath,
      ];

      orderedPrimary.forEach((route, idx) => {
        timers.push(
          setTimeout(() => {
            sessionWarmedRef.current = true;
            warmRoute(route);
          }, 140 + idx * 180)
        );
      });

      // Tier 2: Gently warm remaining site pages sequentially in idle background
      SECONDARY_ROUTES.forEach((route, idx) => {
        if (route !== currentPath) {
          timers.push(
            setTimeout(() => {
              warmRoute(route);
            }, 1700 + idx * 420)
          );
        }
      });
    }

    return () => {
      document.removeEventListener("pointerover", handleLinkIntent);
      document.removeEventListener("pointerdown", handleLinkIntent);
      document.removeEventListener("touchstart", handleLinkIntent);
      document.removeEventListener("focusin", handleLinkIntent);
      timers.forEach(clearTimeout);
    };
  }, [warmRoute]);

  return (
    <div
      ref={containerRef}
      className="page-calm-rise flex-1 flex flex-col bg-white"
    >
      {children}
    </div>
  );
}
