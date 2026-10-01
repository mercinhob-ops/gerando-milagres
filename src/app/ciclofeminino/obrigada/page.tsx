import type { Metadata } from "next";
import Image from "next/image";
import { BookOpenCheck, LogIn, NotebookPen } from "lucide-react";
import { buttonVariants } from "@/components/design-system/button";
import { cn } from "@/lib/utils";
import { obrigadaContent as c } from "./content";
import { getMembersAreaUrl } from "./config";

export const metadata: Metadata = {
  title: c.meta.title,
  robots: { index: false, follow: false },
};

const serif = "font-['Georgia',serif]";
const darkGradient = { background: "linear-gradient(160deg, #4A2E26 0%, #6B4239 60%, #8B5E52 100%)" };
const stepIcons = [LogIn, BookOpenCheck, NotebookPen] as const;

/**
 * Único próximo passo da página. Usa o mesmo destino configurável nos dois
 * pontos (topo e fechamento). Sem URL confirmada, fica inativo e não aponta
 * para lugar nenhum.
 */
function MembersAreaCta({ className }: { className?: string }) {
  const url = getMembersAreaUrl();
  const base = cn(
    buttonVariants({ variant: "primary", size: "lg" }),
    "w-full sm:w-auto justify-center text-sm md:text-base tracking-wide px-8 py-4 shadow-[0_10px_30px_rgba(196,134,122,0.45)]",
    className
  );

  if (url) {
    return (
      <a href={url} target="_blank" rel="noopener noreferrer" className={base}>
        {c.membersCtaLabel}
      </a>
    );
  }

  return (
    <span
      role="button"
      aria-disabled="true"
      data-members-url-pending="true"
      title="URL da área de membros ainda não configurada em src/app/ciclofeminino/obrigada/config.ts"
      className={cn(
        base,
        "flex-col gap-0.5 cursor-not-allowed bg-salmon/80 hover:bg-salmon/80 outline-2 outline-dashed outline-offset-4 outline-amber-500/70"
      )}
    >
      <span>{c.membersCtaLabel}</span>
      <span className="text-[10px] font-bold uppercase tracking-widest text-white/85">
        Link da área de membros pendente
      </span>
    </span>
  );
}

export default function ObrigadaPage() {
  // Nenhum evento de conversão nesta página. Purchase depende da confirmação
  // da transação pela Kiwify — nunca da visita a esta rota.
  return (
    <div className="overflow-x-hidden">
      {/* ─── 1. HERO ──────────────────────────────────────────────── */}
      <section
        className="px-5 pt-10 pb-12 md:pt-16 md:pb-16 text-center"
        style={{ background: "linear-gradient(180deg, #F0E6DC 0%, #ffffff 100%)" }}
      >
        <div className="max-w-2xl mx-auto space-y-5">
          <span className="inline-flex items-center bg-white border border-salmon/30 rounded-full px-4 py-1.5 shadow-sm">
            <span className="font-sans text-[11px] md:text-xs font-semibold uppercase tracking-widest text-brown">
              {c.hero.eyebrow}
            </span>
          </span>
          <h1 className={`${serif} text-[1.6rem] leading-[1.25] sm:text-3xl md:text-[2.6rem] md:leading-[1.15] font-bold text-dark-brown`}>
            {c.hero.headline}
          </h1>
          <p className="font-sans text-[15px] md:text-lg text-gray-600 leading-relaxed">{c.hero.text}</p>
          <div className="pt-2">
            <MembersAreaCta />
          </div>
        </div>
      </section>

      {/* ─── 2. O QUE FAZER AGORA ─────────────────────────────────── */}
      <section className="px-5 py-12 md:py-16 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className={`${serif} text-2xl md:text-3xl font-bold text-dark-brown text-center mb-8`}>
            {c.nextSteps.heading}
          </h2>
          <ol className="grid gap-3 md:grid-cols-3 md:gap-5">
            {c.nextSteps.steps.map(({ title, text }, i) => {
              const Icon = stepIcons[i] ?? BookOpenCheck;
              return (
                <li key={title} className="bg-cream rounded-2xl p-5 md:p-6 flex md:flex-col gap-4">
                  <div className="relative shrink-0 w-11 h-11 rounded-full bg-white flex items-center justify-center shadow-sm">
                    <Icon className="w-5 h-5 text-salmon" aria-hidden="true" />
                    <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-salmon text-white text-[11px] font-bold flex items-center justify-center">
                      {i + 1}
                    </span>
                  </div>
                  <div>
                    <p className="font-sans font-bold text-dark-brown">{title}</p>
                    <p className="font-sans text-sm text-gray-600 leading-relaxed mt-1">{text}</p>
                  </div>
                </li>
              );
            })}
          </ol>
        </div>
      </section>

      {/* ─── 3. MENSAGEM DA CAMILLA ───────────────────────────────── */}
      <section className="px-5 py-12 md:py-16 bg-cream">
        <div className="max-w-4xl mx-auto md:flex md:items-center md:gap-12">
          <div className="w-full max-w-[240px] md:max-w-none md:w-[300px] mx-auto md:mx-0 shrink-0 mb-8 md:mb-0">
            {/* camilla-profile.jpg: recorte por CSS centralizando a Camilla
                (na foto original ela fica à direita do quadro). */}
            <div className="relative w-full aspect-[4/5] rounded-3xl overflow-hidden shadow-xl">
              <div className="absolute" style={{ width: "190%", height: "270%", left: "-88.7%", top: "-79%" }}>
                <Image
                  src="/images/camilla-profile.jpg"
                  alt="Camilla Freitas"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 460px, 570px"
                />
              </div>
            </div>
          </div>

          <div className="flex-1 text-center md:text-left">
            <h2 className={`${serif} text-2xl md:text-3xl font-bold text-dark-brown leading-snug`}>{c.message.heading}</h2>
            <div className="mt-5 space-y-4">
              {c.message.paragraphs.map((p) => (
                <p key={p} className={`${serif} italic text-base md:text-lg text-gray-700 leading-relaxed`}>
                  “{p}”
                </p>
              ))}
            </div>
            <div className="mt-6 border-l-4 border-salmon pl-4 text-left inline-block">
              <p className="font-sans font-bold text-dark-brown">{c.message.signature.name}</p>
              {c.message.signature.lines.map((line) => (
                <p key={line} className="font-sans text-xs text-brown/70 leading-relaxed">
                  {line}
                </p>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── 4. FECHAMENTO ────────────────────────────────────────── */}
      <section className="px-5 py-14 md:py-20 text-center" style={darkGradient}>
        <div className="max-w-2xl mx-auto space-y-5">
          <h2 className={`${serif} text-2xl md:text-4xl font-bold text-white leading-snug`}>{c.closing.heading}</h2>
          <p className="font-sans text-base md:text-lg text-nude/85 leading-relaxed">{c.closing.text}</p>
          <div className="pt-2">
            <MembersAreaCta />
          </div>
        </div>
      </section>

      {/* Rodapé local, sem canais de contato (o PremiumFooter tem WhatsApp). */}
      <footer className="px-5 py-8 text-center" style={{ background: "#4A2E26" }}>
        <p className="font-sans text-xs text-nude/50">{c.footer}</p>
      </footer>
    </div>
  );
}
