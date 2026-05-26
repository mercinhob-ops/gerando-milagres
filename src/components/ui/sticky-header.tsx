"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { siteConfig } from "@/lib/env";
import { buttonVariants } from "@/components/design-system/button";

export function StickyHeader() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    function onScroll() {
      setVisible(window.scrollY > 300);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

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
          href={siteConfig.checkoutUrl}
          target="_blank"
          rel="noopener noreferrer"
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
