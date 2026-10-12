"use client";

import { useEffect, useState, type FormEvent, type ReactNode } from "react";
import Image from "next/image";
import { trackConversionEvent } from "@/lib/meta-conversions";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/design-system/button";

// TODO: substituir pelo link real do material
const MATERIAL_URL = "#MATERIAL_URL";
const WHATSAPP_NUMBER = "5581981396005";
const LEAD_STORAGE_KEY = "gestante_lead";

type Trimestre = "1º" | "2º" | "3º";
type SimNao = "sim" | "nao";

interface GestanteLead {
  nome: string;
  whatsapp: string;
  trimestre: Trimestre;
  restricaoAlimentar: SimNao;
  diabetesGestacional: SimNao;
  bariatrica: SimNao;
  querAvaliacao: SimNao;
  lgpd: true;
  origem: string | null;
  capturedAt: string;
}

export function GestanteContent() {
  const [lead, setLead] = useState<GestanteLead | null>(null);

  return (
    <div className="overflow-x-hidden bg-white">
      <HeroSection />
      <AboutSection />
      {lead ? (
        <RevealOnMount>
          <SuccessSection lead={lead} />
        </RevealOnMount>
      ) : (
        <QuestionnaireSection onSubmitted={setLead} />
      )}
      <FooterSection />
    </div>
  );
}

/* ─────────────────────────── Reusable pieces ─────────────────────────── */

function RevealOnMount({ children }: { children: ReactNode }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const frame = requestAnimationFrame(() => setVisible(true));
    return () => cancelAnimationFrame(frame);
  }, []);

  return (
    <div
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(16px)",
        transition: "opacity 0.6s ease-out, transform 0.6s ease-out",
      }}
    >
      {children}
    </div>
  );
}

function firstName(fullName: string) {
  return fullName.trim().split(/\s+/)[0];
}

function buildWhatsAppUrl(message: string) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

/* ─────────────────────────────── 1 — Chamada ─────────────────────────────── */

function HeroSection() {
  return (
    <section
      className="px-6 pt-12 pb-14 text-center"
      style={{ background: "linear-gradient(160deg, #F0E6DC 0%, #E8D0C0 100%)" }}
    >
      <div className="max-w-md mx-auto">
        <p className="font-['Georgia',serif] italic text-sm font-bold text-dark-brown mb-1">Gerando Milagres</p>
        <p className="font-sans text-xs font-semibold text-brown/60 uppercase tracking-widest mb-8">
          Dra. Camilla Freitas · CRF/PE 4563
        </p>

        <h1 className="font-['Georgia',serif] text-3xl md:text-4xl font-bold text-dark-brown leading-snug mb-4">
          O seu bebê muda a cada trimestre. A sua alimentação também deveria.
        </h1>

        <p className="font-sans text-base text-brown/80 leading-relaxed mb-8">
          Receba gratuitamente o material da Dra. Camilla com o que comer em cada fase da gestação.
        </p>

        <a
          href="#questionario"
          className={cn(
            buttonVariants({ variant: "primary", size: "lg" }),
            "bg-salmon hover:bg-salmon/90 w-full justify-center text-base"
          )}
        >
          Quero receber o material →
        </a>
      </div>
    </section>
  );
}

/* ─────────────────────────── 2 — Sobre a Dra. Camilla ─────────────────────────── */

function AboutSection() {
  return (
    <section className="px-6 py-12 md:py-16 bg-nude/40">
      <div className="max-w-md mx-auto text-center">
        <div className="relative w-32 h-32 rounded-full overflow-hidden mx-auto mb-5 shadow-md">
          <Image
            src="/images/camilla-zap.jpg"
            alt="Dra. Camilla Freitas"
            fill
            className="object-cover object-top"
            sizes="128px"
          />
        </div>
        <h2 className="font-['Georgia',serif] text-2xl font-bold text-dark-brown mb-1">Dra. Camilla Freitas</h2>
        <p className="font-sans text-xs font-semibold text-brown/70 uppercase tracking-widest mb-4">
          Farmacêutica · CRF/PE 4563
        </p>
        <p className="font-sans text-sm text-brown/80 leading-relaxed">
          Criadora do Gerando Milagres, acompanha mulheres e casais da preparação para a gravidez à gestação.
        </p>
      </div>
    </section>
  );
}

/* ─────────────────────────────── 3 — Questionário ─────────────────────────────── */

const inputClassName =
  "w-full rounded-xl border-2 border-nude-dark/40 bg-white px-4 py-3 font-sans text-base text-dark-brown placeholder:text-brown/40 outline-none transition-colors focus:border-salmon";

function OptionGroup<T extends string>({
  name,
  legend,
  options,
  value,
  onChange,
}: {
  name: string;
  legend: string;
  options: readonly { value: T; label: string }[];
  value: T | null;
  onChange: (value: T) => void;
}) {
  return (
    <fieldset className="space-y-2">
      <legend className="font-sans text-sm font-semibold text-brown/80 mb-2">{legend}</legend>
      <div className={cn("grid gap-2", options.length === 3 ? "grid-cols-3" : "grid-cols-2")}>
        {options.map((option) => {
          const selected = value === option.value;
          return (
            <label
              key={option.value}
              className={cn(
                "flex items-center justify-center text-center rounded-xl border-2 px-3 py-3 cursor-pointer font-sans text-sm font-semibold transition-colors has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-salmon/50",
                selected
                  ? "border-salmon bg-salmon text-white"
                  : "border-nude-dark/40 bg-white text-dark-brown hover:border-salmon/60"
              )}
            >
              <input
                type="radio"
                name={name}
                value={option.value}
                checked={selected}
                onChange={() => onChange(option.value)}
                className="sr-only"
              />
              {option.label}
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}

const simNaoOptions = [
  { value: "sim", label: "Sim" },
  { value: "nao", label: "Não" },
] as const;

const trimestreOptions = [
  { value: "1º", label: "1º" },
  { value: "2º", label: "2º" },
  { value: "3º", label: "3º" },
] as const;

const avaliacaoOptions = [
  { value: "sim", label: "Sim, quero avaliação" },
  { value: "nao", label: "Não por enquanto" },
] as const;

function QuestionnaireSection({ onSubmitted }: { onSubmitted: (lead: GestanteLead) => void }) {
  const [nome, setNome] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [trimestre, setTrimestre] = useState<Trimestre | null>(null);
  const [restricaoAlimentar, setRestricaoAlimentar] = useState<SimNao | null>(null);
  const [diabetesGestacional, setDiabetesGestacional] = useState<SimNao | null>(null);
  const [bariatrica, setBariatrica] = useState<SimNao | null>(null);
  const [querAvaliacao, setQuerAvaliacao] = useState<SimNao | null>(null);
  const [lgpd, setLgpd] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmedNome = nome.trim();
    const whatsappDigits = whatsapp.replace(/\D/g, "");

    if (!trimmedNome) return setError("Digite seu nome completo, por favor.");
    if (whatsappDigits.length < 10 || whatsappDigits.length > 13)
      return setError("Digite um WhatsApp válido, com DDD.");
    if (!trimestre) return setError("Selecione o seu trimestre atual.");
    if (!restricaoAlimentar) return setError("Responda se você tem alguma restrição alimentar.");
    if (!diabetesGestacional) return setError("Responda se você tem diabetes gestacional.");
    if (!bariatrica) return setError("Responda se você fez cirurgia bariátrica.");
    if (!querAvaliacao) return setError("Responda se quer uma avaliação individual com a Dra. Camilla.");
    if (!lgpd) return setError("Para continuar, autorize o uso dos seus dados conforme a LGPD.");

    setError(null);

    const origem = new URLSearchParams(window.location.search).get("origem");
    const lead: GestanteLead = {
      nome: trimmedNome,
      whatsapp: whatsappDigits,
      trimestre,
      restricaoAlimentar,
      diabetesGestacional,
      bariatrica,
      querAvaliacao,
      lgpd: true,
      origem: origem?.trim() || null,
      capturedAt: new Date().toISOString(),
    };

    try {
      window.localStorage.setItem(LEAD_STORAGE_KEY, JSON.stringify(lead));
    } catch {
      // localStorage indisponível (modo privado, etc.) — não bloqueia o fluxo
    }

    trackConversionEvent({
      eventName: "Lead",
      customData: {
        content_name: "Material Alimentação por Trimestre",
        trimestre,
        quer_avaliacao: querAvaliacao === "sim",
        ...(lead.origem ? { origem: lead.origem } : {}),
      },
    });

    onSubmitted(lead);
  }

  return (
    <section
      id="questionario"
      className="px-6 py-12 md:py-16 scroll-mt-4"
      style={{ background: "linear-gradient(160deg, #F0E6DC 0%, #E8D0C0 100%)" }}
    >
      <div className="max-w-md mx-auto">
        <h2 className="font-['Georgia',serif] text-2xl font-bold text-dark-brown text-center leading-snug mb-2">
          Receba o seu material
        </h2>
        <p className="font-sans text-sm text-brown/70 text-center leading-relaxed mb-8">
          Responda 7 perguntas rápidas para a Dra. Camilla conhecer você.
        </p>

        <form onSubmit={handleSubmit} noValidate className="space-y-6 bg-white rounded-2xl shadow-sm p-6">
          <div className="space-y-1.5">
            <label htmlFor="gestante-nome" className="font-sans text-sm font-semibold text-brown/80">
              Nome completo
            </label>
            <input
              id="gestante-nome"
              type="text"
              autoComplete="name"
              value={nome}
              onChange={(event) => setNome(event.target.value)}
              placeholder="Seu nome completo"
              className={inputClassName}
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="gestante-whatsapp" className="font-sans text-sm font-semibold text-brown/80">
              WhatsApp (com DDD)
            </label>
            <input
              id="gestante-whatsapp"
              type="tel"
              inputMode="tel"
              autoComplete="tel-national"
              value={whatsapp}
              onChange={(event) => setWhatsapp(event.target.value)}
              placeholder="(81) 99999-9999"
              className={inputClassName}
            />
          </div>

          <OptionGroup
            name="trimestre"
            legend="Em qual trimestre você está?"
            options={trimestreOptions}
            value={trimestre}
            onChange={setTrimestre}
          />
          <OptionGroup
            name="restricao"
            legend="Você tem alguma restrição alimentar?"
            options={simNaoOptions}
            value={restricaoAlimentar}
            onChange={setRestricaoAlimentar}
          />
          <OptionGroup
            name="diabetes"
            legend="Você tem diabetes gestacional?"
            options={simNaoOptions}
            value={diabetesGestacional}
            onChange={setDiabetesGestacional}
          />
          <OptionGroup
            name="bariatrica"
            legend="Você fez cirurgia bariátrica?"
            options={simNaoOptions}
            value={bariatrica}
            onChange={setBariatrica}
          />
          <OptionGroup
            name="avaliacao"
            legend="Você quer uma avaliação individual com a Dra. Camilla?"
            options={avaliacaoOptions}
            value={querAvaliacao}
            onChange={setQuerAvaliacao}
          />

          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={lgpd}
              onChange={(event) => setLgpd(event.target.checked)}
              className="mt-0.5 w-5 h-5 shrink-0 accent-salmon"
            />
            <span className="font-sans text-sm text-dark-brown/90 leading-snug">
              Autorizo o uso dos meus dados conforme a LGPD
            </span>
          </label>

          {error && (
            <p className="font-sans text-sm text-red-600" role="alert">
              {error}
            </p>
          )}

          <button
            type="submit"
            className={cn(
              buttonVariants({ variant: "primary", size: "lg" }),
              "bg-salmon hover:bg-salmon/90 w-full justify-center text-base"
            )}
          >
            Quero receber o material →
          </button>
        </form>
      </div>
    </section>
  );
}

/* ─────────────────────────────── 4 — Após envio ─────────────────────────────── */

function SuccessSection({ lead }: { lead: GestanteLead }) {
  const nome = firstName(lead.nome);
  const wantsEvaluation = lead.querAvaliacao === "sim";

  const whatsappUrl = buildWhatsAppUrl(
    wantsEvaluation
      ? `Olá, Dra. Camilla! Sou ${lead.nome}, estou no ${lead.trimestre} trimestre da gestação e quero fazer uma avaliação individual com você.`
      : `Olá, Dra. Camilla! Sou ${lead.nome}, estou no ${lead.trimestre} trimestre e baixei o material de alimentação na gestação.`
  );

  return (
    <section
      id="questionario"
      className="px-6 py-12 md:py-16"
      style={{ background: "linear-gradient(160deg, #F0E6DC 0%, #E8D0C0 100%)" }}
    >
      <div className="max-w-md mx-auto text-center">
        <h2 className="font-['Georgia',serif] text-3xl font-bold text-dark-brown mb-3">Pronto, {nome}!</h2>
        <p className="font-sans text-sm text-brown/80 leading-relaxed mb-6">
          O seu material sobre alimentação por trimestre já está liberado.
        </p>

        <a
          href={MATERIAL_URL}
          target="_blank"
          rel="noopener noreferrer"
          className={cn(
            buttonVariants({ variant: "primary", size: "lg" }),
            "bg-salmon hover:bg-salmon/90 w-full justify-center text-base mb-10"
          )}
        >
          Baixar o material
        </a>

        {wantsEvaluation ? (
          <div className="rounded-2xl bg-dark-brown px-6 py-8 shadow-lg">
            <h3 className="font-['Georgia',serif] text-2xl font-bold text-white leading-snug mb-3">
              Vamos olhar o seu caso juntas?
            </h3>
            <p className="font-sans text-sm text-cream/90 leading-relaxed mb-6">
              Você pediu uma avaliação individual. Me chama no WhatsApp para a gente começar.
            </p>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                buttonVariants({ variant: "primary", size: "lg" }),
                "bg-salmon hover:bg-salmon/90 w-full justify-center text-base shadow-[0_10px_30px_rgba(196,134,122,0.45)]"
              )}
            >
              Quero minha avaliação no WhatsApp →
            </a>
          </div>
        ) : (
          <div className="rounded-2xl bg-white/70 px-6 py-6">
            <p className="font-sans text-sm text-brown/80 leading-relaxed mb-3">
              Se surgir alguma dúvida durante a gestação, você pode falar com a Dra. Camilla no WhatsApp.
            </p>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="font-sans text-sm font-semibold text-salmon underline underline-offset-4"
            >
              Falar no WhatsApp
            </a>
          </div>
        )}
      </div>
    </section>
  );
}

/* ─────────────────────────────── Footer ─────────────────────────────── */

function FooterSection() {
  return (
    <footer className="px-6 py-10 text-center bg-white border-t border-gray-100">
      <p className="font-sans text-xs text-brown/60 mb-1">
        © 2026 Gerando Milagres · Dra. Camilla Freitas · CRF/PE 4563
      </p>
      <p className="font-sans text-xs text-brown/40">
        Este material é educativo e não substitui acompanhamento profissional
      </p>
    </footer>
  );
}
