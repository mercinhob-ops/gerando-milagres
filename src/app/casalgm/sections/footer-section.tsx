"use client";

import Link from "next/link";
import { MessageCircle, ArrowUp } from "lucide-react";
import { createWhatsappUrl, siteConfig } from "@/lib/env";

export function FooterSection() {
  function handleBackToTop() {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <footer className="py-12 px-6 bg-dark-brown text-center">
      <div className="max-w-2xl mx-auto space-y-5">
        <a
          href={createWhatsappUrl("Olá! Tenho uma dúvida sobre o Florescer a Dois.")}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 font-sans text-sm text-nude/80 hover:text-white transition-colors"
        >
          <MessageCircle className="w-4 h-4" aria-hidden="true" />
          Central de atendimento: contato via WhatsApp {formatPhone(siteConfig.whatsappNumber)}
        </a>

        <p className="font-sans text-xs text-nude/50">
          Dra. Camilla Freitas • CRF/PE 4563 • Todos os direitos reservados
        </p>

        <Link
          href="/privacidade"
          className="inline-block font-sans text-xs text-nude/60 hover:text-white underline underline-offset-4 transition-colors"
        >
          Política de Privacidade
        </Link>

        <div>
          <button
            type="button"
            onClick={handleBackToTop}
            className="inline-flex items-center gap-1.5 font-sans text-xs font-semibold text-white/80 border border-white/20 rounded-full px-4 py-2 hover:bg-white/10 transition-colors"
          >
            <ArrowUp className="w-3.5 h-3.5" aria-hidden="true" />
            Voltar ao topo
          </button>
        </div>
      </div>
    </footer>
  );
}

function formatPhone(digits: string) {
  const match = digits.match(/^(\d{2})(\d{2})(\d{4,5})(\d{4})$/);
  if (!match) return digits;
  const [, country, ddd, prefix, suffix] = match;
  return `+${country} (${ddd}) ${prefix}-${suffix}`;
}
