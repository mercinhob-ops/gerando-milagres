"use client";

import { useState, useEffect, useSyncExternalStore } from "react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { siteConfig } from "@/lib/env";
import { buttonVariants } from "@/components/design-system/button";
import { trackConversionEvent } from "@/lib/meta-conversions";
import {
  getStickyHeaderCheckout,
  getStickyHeaderCheckoutServerSnapshot,
  subscribeStickyHeaderCheckout,
} from "./sticky-header-store";

export function StickyHeader({
  checkoutUrl,
  eventValue,
}: {
  checkoutUrl?: string;
  eventValue?: number;
} = {}) {
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);
  const registeredCheckout = useSyncExternalStore(
    subscribeStickyHeaderCheckout,
    getStickyHeaderCheckout,
    getStickyHeaderCheckoutServerSnapshot
  );

  useEffect(() => {
    function onScroll() {
      setVisible(window.scrollY > 300);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const resolved = checkoutUrl
    ? { checkoutUrl, eventValue }
    : (registeredCheckout ?? { checkoutUrl: siteConfig.checkoutUrl, eventValue: undefined });

  function handleClick() {
    if (resolved.eventValue === undefined) return;
    trackConversionEvent({
      eventName: "InitiateCheckout",
      customData: { value: resolved.eventValue, currency: "BRL" },
    });
  }

  if (pathname?.startsWith("/quizfertilidade") || pathname?.startsWith("/casalgm1")) return null;

  return (
    <header
      aria-label="Navegação rápida"
      className={cn(
        "fixed top-0 inset-x-0 z-50 bg-white/95 backdrop-blur-sm border-b border-[#D4B5A0]/60 shadow-sm",
        "transition-transform duration-300 ease-in-out",
        visible ? "translate-y-0" : "-translate-y-full"
      )}
    >
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
        {/* Logo */}
        <span className="font-display text-lg font-bold text-[#6B4239] italic shrink-0">
          Gerando Milagres
        </span>

        {/* CTA */}
        <a
          href={resolved.checkoutUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={handleClick}
          className={cn(
            buttonVariants({ variant: "primary", size: "sm" }),
            "inline-flex shrink-0"
          )}
          tabIndex={visible ? 0 : -1}
        >
          <span className="hidden sm:inline">Quero preparar meu corpo</span>
          <span className="sm:hidden">Começar agora</span>
        </a>
      </div>
    </header>
  );
}
