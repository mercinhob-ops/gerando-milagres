import { CheckCircle2 } from "lucide-react";

const included = [
  "9 capítulos completos",
  "Guia de exames dela e dele",
  "Protocolo anti-inflamatório",
  "Suplementação educativa",
  "Plano de conexão do casal",
  "Devocional com versículos",
  "Checklist dos próximos passos",
  "Linguagem acessível e acolhedora",
] as const;

const badges = ["Garantia 7 dias", "Acesso imediato", "PDF completo", "Compra segura", "+500 casais"] as const;

export function WhatsIncludedSection() {
  return (
    <section className="py-20 px-6 bg-white">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="font-['Georgia',serif] text-3xl md:text-4xl font-bold text-dark-brown leading-snug">
            O que está incluso
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-12">
          {included.map((item) => (
            <div key={item} className="flex items-center gap-3 bg-cream rounded-xl px-4 py-3.5">
              <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0" aria-hidden="true" />
              <p className="font-sans text-sm text-brown/90">{item}</p>
            </div>
          ))}
        </div>

        <div className="flex flex-wrap items-center justify-center gap-2.5">
          {badges.map((badge) => (
            <span
              key={badge}
              className="font-sans text-xs font-semibold text-brown bg-nude/60 border border-nude-dark/40 rounded-full px-4 py-1.5"
            >
              {badge}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
