"use client";

import { useEffect, useState, type FormEvent, type ReactNode } from "react";
import Image from "next/image";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/design-system/button";

/*
 * Peças visuais dos questionários "uma pergunta por tela" (/tentantes,
 * /tentante2, /gestante). Só apresentação: textos, regras e dados vêm de
 * quem usa. Mudanças de design aqui refletem em todos os questionários.
 */

export const primaryButtonClassName = cn(
  buttonVariants({ variant: "primary", size: "lg" }),
  "bg-salmon hover:bg-salmon/90 w-full justify-center text-base"
);

export interface QuizOption {
  value: string;
  label: string;
}

export function firstName(fullName: string) {
  return fullName.trim().split(/\s+/)[0];
}

/** Substitui marcadores {chave} no texto. */
export function fill(template: string, vars: Record<string, string | number>) {
  return template.replace(/\{(\w+)\}/g, (match, key: string) => (key in vars ? String(vars[key]) : match));
}

/* ─────────────────────────── Moldura (fundo, progresso, rodapé) ─────────────────────────── */

export function QuizShell({
  stepKey,
  showChrome,
  progress,
  total,
  backLabel,
  onBack,
  children,
}: {
  stepKey: number;
  showChrome: boolean;
  progress: number;
  total: number;
  backLabel: string;
  onBack: () => void;
  children: ReactNode;
}) {
  return (
    <div
      className="min-h-dvh overflow-x-hidden flex flex-col"
      style={{ background: "linear-gradient(160deg, #F0E6DC 0%, #E8D0C0 100%)" }}
    >
      {showChrome && (
        <header className="sticky top-0 z-10 px-5 pt-4 pb-3 bg-cream/90 backdrop-blur-sm">
          <div className="max-w-md mx-auto">
            <div className="flex items-center justify-between mb-2">
              <button
                type="button"
                onClick={onBack}
                className="font-sans text-sm text-brown/60 hover:text-brown transition-colors"
              >
                {backLabel}
              </button>
              <span className="font-sans text-xs font-semibold text-brown/70">
                {progress}/{total}
              </span>
            </div>
            <div
              className="h-2 w-full rounded-full bg-nude overflow-hidden"
              role="progressbar"
              aria-label="Progresso do questionário"
              aria-valuemin={0}
              aria-valuemax={total}
              aria-valuenow={progress}
            >
              <div
                className="h-full rounded-full bg-salmon transition-all duration-500 ease-out"
                style={{ width: `${(progress / total) * 100}%` }}
              />
            </div>
          </div>
        </header>
      )}

      <main className="flex-1 flex items-center justify-center px-5 py-10">
        <div className="max-w-md w-full">
          <Fade key={stepKey}>{children}</Fade>
        </div>
      </main>

      <footer className="px-6 py-6 text-center">
        <p className="font-sans text-xs text-brown/50">
          © 2026 Gerando Milagres · Dra. Camilla Freitas · CRF/PE 4563
        </p>
      </footer>
    </div>
  );
}

function Fade({ children }: { children: ReactNode }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const frame = requestAnimationFrame(() => setVisible(true));
    return () => cancelAnimationFrame(frame);
  }, []);

  return (
    <div
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(12px)",
        transition: "opacity 0.45s ease-out, transform 0.45s ease-out",
      }}
    >
      {children}
    </div>
  );
}

/* ─────────────────────────── Tela inicial ─────────────────────────── */

export function QuizIntro({
  imageSrc,
  title,
  subtitle,
  startLabel,
  onStart,
}: {
  imageSrc: string;
  title: string;
  subtitle: string;
  startLabel: string;
  onStart: () => void;
}) {
  return (
    <div className="text-center">
      <p className="font-['Georgia',serif] italic text-sm font-bold text-dark-brown mb-1">Gerando Milagres</p>
      <p className="font-sans text-xs font-semibold text-brown/60 uppercase tracking-widest mb-6">
        Dra. Camilla Freitas · CRF/PE 4563
      </p>

      <div className="relative w-32 h-32 rounded-full overflow-hidden mx-auto mb-6 shadow-md">
        <Image src={imageSrc} alt="Dra. Camilla Freitas" fill priority className="object-cover object-top" sizes="128px" />
      </div>

      <h1 className="font-['Georgia',serif] text-2xl md:text-3xl font-bold text-dark-brown leading-snug mb-3">
        {title}
      </h1>
      <p className="font-sans text-sm text-brown/80 leading-relaxed mb-8">{subtitle}</p>

      <button type="button" onClick={onStart} className={primaryButtonClassName}>
        {startLabel}
      </button>
    </div>
  );
}

/* ─────────────────────────── Pergunta ─────────────────────────── */

export function QuizQuestion({
  id,
  kind,
  eyebrow,
  title,
  hint,
  placeholder,
  options = [],
  exclusiveValues = [],
  value,
  validate,
  nextLabel,
  skipLabel,
  onChange,
  onNext,
  onSkip,
}: {
  id: string;
  kind: "text" | "tel" | "single" | "multi";
  eyebrow: string;
  title: string;
  /** Texto de apoio exibido só em perguntas de seleção múltipla. */
  hint?: string;
  placeholder?: string;
  options?: readonly QuizOption[];
  /** Na seleção múltipla, opções que desmarcam todas as outras (ex.: "Prefiro não dizer"). */
  exclusiveValues?: readonly string[];
  value: string | string[] | undefined;
  validate: (value: string | string[] | undefined) => string | null;
  nextLabel: string;
  /** Quando informado, a pergunta pode ser pulada. */
  skipLabel?: string;
  onChange: (value: string | string[]) => void;
  onNext: () => void;
  onSkip?: () => void;
}) {
  const [error, setError] = useState<string | null>(null);
  const titleId = `pergunta-${id}`;

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const validationError = validate(value);
    if (validationError) return setError(validationError);
    setError(null);
    onNext();
  }

  function toggleMulti(optionValue: string) {
    const current = Array.isArray(value) ? value : [];
    if (current.includes(optionValue)) {
      onChange(current.filter((v) => v !== optionValue));
    } else if (exclusiveValues.includes(optionValue)) {
      onChange([optionValue]);
    } else {
      onChange([...current.filter((v) => !exclusiveValues.includes(v)), optionValue]);
    }
    setError(null);
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <p className="font-sans text-xs font-semibold text-salmon uppercase tracking-widest mb-2">{eyebrow}</p>
      <h2 id={titleId} className="font-['Georgia',serif] text-2xl font-bold text-dark-brown leading-snug mb-2">
        {title}
      </h2>
      {kind === "multi" && hint && <p className="font-sans text-sm text-brown/70 mb-4">{hint}</p>}

      <div className="mt-6 mb-6">
        {(kind === "text" || kind === "tel") && (
          <input
            aria-labelledby={titleId}
            type={kind === "tel" ? "tel" : "text"}
            inputMode={kind === "tel" ? "tel" : undefined}
            autoComplete={kind === "tel" ? "tel-national" : "name"}
            value={typeof value === "string" ? value : ""}
            onChange={(event) => {
              onChange(event.target.value);
              setError(null);
            }}
            placeholder={placeholder}
            className="w-full rounded-xl border-2 border-nude-dark/40 bg-white px-4 py-4 font-sans text-lg text-dark-brown placeholder:text-brown/40 outline-none transition-colors focus:border-salmon"
          />
        )}

        {(kind === "single" || kind === "multi") && (
          <div role="group" aria-labelledby={titleId} className="space-y-3">
            {options.map((option) => {
              const selected =
                kind === "multi" ? Array.isArray(value) && value.includes(option.value) : value === option.value;
              return (
                <button
                  key={option.value}
                  type="button"
                  aria-pressed={selected}
                  onClick={() => {
                    if (kind === "multi") {
                      toggleMulti(option.value);
                    } else {
                      onChange(option.value);
                      setError(null);
                    }
                  }}
                  className={cn(
                    "w-full flex items-center gap-3 rounded-2xl border-2 px-5 py-4 text-left font-sans text-base transition-all duration-150",
                    selected
                      ? "border-salmon bg-salmon/10 text-dark-brown font-semibold shadow-sm"
                      : "border-white bg-white text-dark-brown hover:border-salmon/50"
                  )}
                >
                  <span
                    aria-hidden="true"
                    className={cn(
                      "shrink-0 w-5 h-5 flex items-center justify-center border-2 transition-colors",
                      kind === "multi" ? "rounded" : "rounded-full",
                      selected ? "bg-salmon border-salmon" : "border-nude-dark/60"
                    )}
                  >
                    {selected && <Check className="w-3.5 h-3.5 text-white" />}
                  </span>
                  {option.label}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {error && (
        <p className="font-sans text-sm text-red-600 mb-4" role="alert">
          {error}
        </p>
      )}

      <button type="submit" className={primaryButtonClassName}>
        {nextLabel}
      </button>

      {skipLabel && onSkip && (
        <button
          type="button"
          onClick={onSkip}
          className="w-full mt-3 py-3 font-sans text-sm font-semibold text-brown/70 hover:text-brown transition-colors"
        >
          {skipLabel}
        </button>
      )}
    </form>
  );
}

/* ─────────────────────────── Autorização LGPD ─────────────────────────── */

export function QuizLgpd({
  title,
  consent,
  submitLabel,
  errorMessage,
  onSubmit,
}: {
  title: string;
  consent: string;
  submitLabel: string;
  errorMessage: string;
  onSubmit: () => void;
}) {
  const [accepted, setAccepted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!accepted) return setError(errorMessage);
    onSubmit();
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <h2 className="font-['Georgia',serif] text-2xl font-bold text-dark-brown leading-snug mb-6">{title}</h2>

      <label className="flex items-start gap-3 cursor-pointer rounded-2xl bg-white px-5 py-4 mb-6">
        <input
          type="checkbox"
          checked={accepted}
          onChange={(event) => {
            setAccepted(event.target.checked);
            setError(null);
          }}
          className="mt-0.5 w-5 h-5 shrink-0 accent-salmon"
        />
        <span className="font-sans text-sm text-dark-brown/90 leading-snug">{consent}</span>
      </label>

      {error && (
        <p className="font-sans text-sm text-red-600 mb-4" role="alert">
          {error}
        </p>
      )}

      <button type="submit" className={primaryButtonClassName}>
        {submitLabel}
      </button>
    </form>
  );
}

/* ─────────────────────────── Tela final ─────────────────────────── */

export interface QuizFinalTexts {
  title: string;
  subtitle: string;
  download: string;
  strongTitle: string;
  strongText: string;
  strongButton: string;
  lightText: string;
  lightLink: string;
}

export function QuizFinal({
  texts,
  title,
  materialUrl,
  whatsappUrl,
  strong,
}: {
  texts: QuizFinalTexts;
  /** Título já com o nome preenchido. */
  title: string;
  materialUrl: string;
  whatsappUrl: string;
  strong: boolean;
}) {
  return (
    <div className="text-center">
      <h2 className="font-['Georgia',serif] text-3xl font-bold text-dark-brown mb-3">{title}</h2>
      <p className="font-sans text-sm text-brown/80 leading-relaxed mb-6">{texts.subtitle}</p>

      <a href={materialUrl} target="_blank" rel="noopener noreferrer" className={cn(primaryButtonClassName, "mb-10")}>
        {texts.download}
      </a>

      {strong ? (
        <div className="rounded-2xl bg-salmon px-6 py-8 shadow-[0_10px_30px_rgba(196,134,122,0.45)]">
          <h3 className="font-['Georgia',serif] text-2xl font-bold text-white leading-snug mb-3">{texts.strongTitle}</h3>
          <p className="font-sans text-sm text-white/90 leading-relaxed mb-6">{texts.strongText}</p>
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              buttonVariants({ variant: "primary", size: "lg" }),
              "bg-white text-dark-brown hover:bg-cream w-full justify-center text-base"
            )}
          >
            {texts.strongButton}
          </a>
        </div>
      ) : (
        <div className="rounded-2xl bg-white/70 px-6 py-6">
          <p className="font-sans text-sm text-brown/80 leading-relaxed mb-3">{texts.lightText}</p>
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="font-sans text-sm font-semibold text-salmon underline underline-offset-4"
          >
            {texts.lightLink}
          </a>
        </div>
      )}
    </div>
  );
}
