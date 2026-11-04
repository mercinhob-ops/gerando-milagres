"use client";

import { useEffect, useState } from "react";
import { BuyCta, PriceTag } from "./buy-cta";

/**
 * Barra fixa inferior (somente celular) com preço e CTA.
 * Aparece depois que o CTA do hero sai da tela e some quando a oferta ou o
 * CTA final estão visíveis (sem botões duplicados na mesma tela). Respeita a
 * área segura do aparelho; a página reserva espaço no fim para não cobrir o
 * rodapé. Fora da tela fica `inert` (não recebe foco nem leitura).
 */
export function MobileBuyBar({ productName }: { productName: string }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const hero = document.getElementById("hero-cta");
    const hiders = ["oferta", "cta-final"].map((id) => document.getElementById(id)).filter(Boolean) as HTMLElement[];
    if (!hero || typeof IntersectionObserver === "undefined") return;
    const state = new Map<Element, boolean>();
    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) state.set(entry.target, entry.isIntersecting);
      const heroAbove = !state.get(hero) && hero.getBoundingClientRect().bottom < 0;
      const hiderVisible = hiders.some((el) => state.get(el));
      setVisible(heroAbove && !hiderVisible);
    });
    [hero, ...hiders].forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <div
      data-mobile-buy-bar
      data-visible={visible}
      inert={!visible}
      aria-hidden={!visible}
      className={`fixed inset-x-0 bottom-0 z-40 border-t border-nude-dark/60 bg-white/95 px-4 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] shadow-[0_-10px_30px_-18px_rgba(74,46,38,0.45)] backdrop-blur-sm md:hidden motion-safe:transition-transform motion-safe:duration-300 ${
        visible ? "translate-y-0" : "translate-y-full"
      }`}
    >
      <div className="mx-auto flex max-w-md items-center gap-3">
        <div className="min-w-0 flex-1">
          <p className="truncate font-sans text-xs font-semibold text-dark-brown">{productName}</p>
          <PriceTag align="left" size="sm" />
        </div>
        <div className="w-[52%] shrink-0">
          <BuyCta compact />
        </div>
      </div>
    </div>
  );
}
