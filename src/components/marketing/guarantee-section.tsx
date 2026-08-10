import type { ReactNode } from "react";
import { Shield } from "lucide-react";

export function GuaranteeSection({
  title = "Garantia de 7 Dias — Sem Riscos",
  description,
  quote,
}: {
  title?: string;
  description: ReactNode;
  quote?: string;
}) {
  return (
    <section className="py-20 px-6 bg-white">
      <div className="max-w-2xl mx-auto">
        <div className="flex flex-col md:flex-row items-center gap-10">
          <div className="shrink-0 flex flex-col items-center">
            <div
              className="relative w-40 h-40 rounded-full flex flex-col items-center justify-center shadow-lg"
              style={{ background: "linear-gradient(145deg, #F0E6DC, #E8D0C0)" }}
              aria-label="Garantia de 7 dias"
              role="img"
            >
              <div className="absolute inset-0 rounded-full border-4 border-salmon/40" />
              <div className="absolute inset-3 rounded-full border border-salmon/25" />
              <Shield className="w-8 h-8 text-salmon mb-1" aria-hidden="true" />
              <span className="font-['Georgia',serif] text-3xl font-bold text-brown leading-none">7</span>
              <span className="font-sans text-xs font-bold text-salmon uppercase tracking-widest">dias</span>
            </div>
            <p className="font-sans text-xs text-gray-400 mt-3 text-center">Garantia incondicional</p>
          </div>

          <div className="text-center md:text-left space-y-4">
            <p className="font-sans text-xs font-semibold tracking-widest text-salmon uppercase">
              Sem risco para você
            </p>
            <h2 className="font-['Georgia',serif] text-2xl md:text-3xl font-semibold text-dark-brown leading-snug">
              {title}
            </h2>
            <p className="font-sans text-gray-600 leading-relaxed">{description}</p>
            {quote && <p className="font-['Georgia',serif] italic text-salmon text-lg">&ldquo;{quote}&rdquo;</p>}
            <p className="font-sans text-sm text-gray-500">Basta enviar um e-mail em até 7 dias após a compra.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
