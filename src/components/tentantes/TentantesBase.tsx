"use client";

import { useEffect, useState, type FormEvent, type ReactNode } from "react";
import Image from "next/image";
import { Check } from "lucide-react";
import { trackConversionEvent } from "@/lib/meta-conversions";
import { submitLead } from "@/lib/submit-lead";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/design-system/button";

/*
 * Questionário "uma pergunta por tela" compartilhado por /tentantes e /tentante2.
 * Todo o COMPORTAMENTO (ordem, regras, validação, P6 condicional, convite forte,
 * Lead, envio ao Supabase) vive aqui. Cada rota passa só DADOS: textos,
 * link do material e identificadores — mudanças aqui refletem nas duas.
 *
 * Textos aceitam marcadores: {total}, {numero}, {nome}, {tempo}, {itens}.
 */

const WHATSAPP_NUMBER = "5581981396005";
const PREFER_NOT_TO_SAY = "prefiro-nao-dizer";

/** Valores das opções (gravados no localStorage). Os rótulos vêm de cada rota. */
const OPTION_VALUES = {
  idade: ["ate-30", "31-35", "36-39", "40-mais"],
  tempoTentando: ["menos-6-meses", "6-meses-1-ano", "1-2-anos", "mais-2-anos"],
  exames: ["normal", "encontraram-algo", "nao-fizemos", "tratamento"],
  identificado: ["sop", "endometriose", "baixa-reserva", "fator-masculino", "tireoide", "outro", PREFER_NOT_TO_SAY],
  marido: ["muito-presente", "mais-ou-menos", "nao-conversamos"],
  perda: ["nao", "1-vez", "2-ou-mais", "prefiro-nao-responder"],
  preocupacao: ["idade", "nao-sei-investigar", "tentei-de-tudo", "emocional", "marido"],
  inicio: ["agora", "proximos-meses", "pesquisando"],
  investimento: ["ate-100", "100-300", "300-600", "acima-600"],
} as const;

type ChoiceQuestionId = keyof typeof OPTION_VALUES;
type TextQuestionId = "nome" | "whatsapp";
type QuestionId = TextQuestionId | ChoiceQuestionId;

type Answers = Partial<Record<QuestionId, string | string[]>>;

interface QuestionRule {
  id: QuestionId;
  kind: "text" | "tel" | "single" | "multi";
  skippable?: boolean;
  showIf?: (answers: Answers) => boolean;
}

const QUESTION_RULES: readonly QuestionRule[] = [
  { id: "nome", kind: "text" },
  { id: "whatsapp", kind: "tel" },
  { id: "idade", kind: "single" },
  { id: "tempoTentando", kind: "single" },
  { id: "exames", kind: "single" },
  {
    id: "identificado",
    kind: "multi",
    showIf: (answers) => answers.exames === "encontraram-algo" || answers.exames === "tratamento",
  },
  { id: "marido", kind: "single" },
  { id: "perda", kind: "single", skippable: true },
  { id: "preocupacao", kind: "single", skippable: true },
  { id: "inicio", kind: "single" },
  { id: "investimento", kind: "single" },
];

const TOTAL_QUESTIONS = QUESTION_RULES.length;
const INTRO_STEP = -1;
const LGPD_STEP = QUESTION_RULES.length;
const DONE_STEP = QUESTION_RULES.length + 1;

/* ─────────────────────────── Configuração por rota ─────────────────────────── */

type TextQuestionCopy = { title: string; placeholder: string };
type ChoiceQuestionCopy<K extends ChoiceQuestionId> = {
  title: string;
  options: Record<(typeof OPTION_VALUES)[K][number], string>;
};

export interface TentantesTexts {
  intro: { title: string; subtitle: string; start: string };
  nav: { back: string; next: string; skip: string; questionLabel: string; multiHint: string };
  questions: { [K in TextQuestionId]: TextQuestionCopy } & { [K in ChoiceQuestionId]: ChoiceQuestionCopy<K> };
  errors: { nome: string; whatsapp: string; single: string; multi: string; lgpd: string };
  lgpd: { title: string; consent: string; submit: string };
  final: {
    title: string;
    subtitle: string;
    download: string;
    strongTitle: string;
    strongText: string;
    strongButton: string;
    lightText: string;
    lightLink: string;
  };
  whatsapp: { greeting: string; tempo: string; identificado: string; strongClosing: string; lightClosing: string };
}

export interface TentantesConfig {
  /** Identificador da página no Supabase (`leads.page`) e no filtro do /admin. */
  page: string;
  storageKey: string;
  contentName: string;
  materialUrl: string;
  texts: TentantesTexts;
}

interface TentantesLead {
  nome: string;
  whatsapp: string;
  idade: string;
  tempoTentando: string;
  exames: string;
  identificado: string[];
  marido: string;
  perda: string | null;
  preocupacao: string | null;
  inicio: string;
  investimento: string;
  lgpd: true;
  capturedAt: string;
}

/* ─────────────────────────── Helpers ─────────────────────────── */

function fill(template: string, vars: Record<string, string | number>) {
  return template.replace(/\{(\w+)\}/g, (match, key: string) => (key in vars ? String(vars[key]) : match));
}

function isVisible(rule: QuestionRule, answers: Answers) {
  return !rule.showIf || rule.showIf(answers);
}

function isChoice(id: QuestionId): id is ChoiceQuestionId {
  return id in OPTION_VALUES;
}

function labelFor(texts: TentantesTexts, id: ChoiceQuestionId, value: string) {
  const options = texts.questions[id].options as Record<string, string>;
  return options[value] ?? value;
}

function firstName(fullName: string) {
  return fullName.trim().split(/\s+/)[0];
}

function validate(rule: QuestionRule, value: string | string[] | undefined, errors: TentantesTexts["errors"]) {
  if (rule.kind === "text") return typeof value === "string" && value.trim() ? null : errors.nome;
  if (rule.kind === "tel") {
    const digits = typeof value === "string" ? value.replace(/\D/g, "") : "";
    return digits.length >= 10 && digits.length <= 13 ? null : errors.whatsapp;
  }
  if (rule.kind === "multi") return Array.isArray(value) && value.length > 0 ? null : errors.multi;
  return value ? null : errors.single;
}

function buildLead(answers: Answers): TentantesLead {
  const str = (id: QuestionId) => (typeof answers[id] === "string" ? (answers[id] as string) : "");
  const optional = (id: QuestionId) => str(id) || null;
  const identificadoRule = QUESTION_RULES.find((rule) => rule.id === "identificado")!;
  const identificado =
    isVisible(identificadoRule, answers) && Array.isArray(answers.identificado) ? answers.identificado : [];

  return {
    nome: str("nome").trim(),
    whatsapp: str("whatsapp").replace(/\D/g, ""),
    idade: str("idade"),
    tempoTentando: str("tempoTentando"),
    exames: str("exames"),
    identificado,
    marido: str("marido"),
    perda: optional("perda"),
    preocupacao: optional("preocupacao"),
    inicio: str("inicio"),
    investimento: str("investimento"),
    lgpd: true,
    capturedAt: new Date().toISOString(),
  };
}

function isStrongInvite(lead: TentantesLead) {
  return lead.inicio === "agora" || lead.tempoTentando === "mais-2-anos";
}

function buildWhatsAppUrl(texts: TentantesTexts, lead: TentantesLead, strong: boolean) {
  const copy = texts.whatsapp;
  const parts = [
    fill(copy.greeting, { nome: lead.nome }),
    fill(copy.tempo, { tempo: labelFor(texts, "tempoTentando", lead.tempoTentando).toLowerCase() }),
  ];
  const identificado = lead.identificado.filter((value) => value !== PREFER_NOT_TO_SAY);
  if (identificado.length > 0) {
    parts.push(
      fill(copy.identificado, { itens: identificado.map((v) => labelFor(texts, "identificado", v)).join(", ") })
    );
  }
  parts.push(strong ? copy.strongClosing : copy.lightClosing);
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(parts.join(" "))}`;
}

/* ─────────────────────────── Page ─────────────────────────── */

export function TentantesBase({ config }: { config: TentantesConfig }) {
  const { texts } = config;
  const [step, setStep] = useState(INTRO_STEP);
  const [answers, setAnswers] = useState<Answers>({});
  const [lead, setLead] = useState<TentantesLead | null>(null);

  function goNext() {
    let next = step + 1;
    while (next < QUESTION_RULES.length && !isVisible(QUESTION_RULES[next], answers)) next++;
    setStep(next);
  }

  function goBack() {
    let prev = step - 1;
    while (prev >= 0 && !isVisible(QUESTION_RULES[prev], answers)) prev--;
    setStep(Math.max(prev, INTRO_STEP));
  }

  function setAnswer(id: QuestionId, value: string | string[] | undefined) {
    setAnswers((prev) => ({ ...prev, [id]: value }));
  }

  function handleSubmit() {
    const newLead = buildLead(answers);

    try {
      window.localStorage.setItem(config.storageKey, JSON.stringify(newLead));
    } catch {
      // localStorage indisponível (modo privado, etc.) — não bloqueia o fluxo
    }

    trackConversionEvent({
      eventName: "Lead",
      customData: {
        content_name: config.contentName,
        tempo_tentando: newLead.tempoTentando,
        inicio: newLead.inicio,
      },
    });

    const label = (id: ChoiceQuestionId, value: string | null) => (value ? labelFor(texts, id, value) : "Pulou");
    submitLead({
      page: config.page,
      name: newLead.nome,
      whatsapp: newLead.whatsapp,
      data: {
        Idade: label("idade", newLead.idade),
        "Tempo tentando": label("tempoTentando", newLead.tempoTentando),
        "Exames de fertilidade": label("exames", newLead.exames),
        "O que foi identificado": newLead.identificado.map((v) => labelFor(texts, "identificado", v)),
        "Marido envolvido": label("marido", newLead.marido),
        "Perda gestacional": label("perda", newLead.perda),
        "Maior preocupação": label("preocupacao", newLead.preocupacao),
        "Quando quer começar": label("inicio", newLead.inicio),
        "Investimento mensal": label("investimento", newLead.investimento),
        "Autorização LGPD": "Sim",
      },
    });

    setLead(newLead);
    setStep(DONE_STEP);
  }

  const currentRule = step >= 0 && step < QUESTION_RULES.length ? QUESTION_RULES[step] : null;
  const progressNumber = currentRule ? step + 1 : step === LGPD_STEP ? TOTAL_QUESTIONS : 0;
  const showChrome = step !== INTRO_STEP && step !== DONE_STEP;

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
                onClick={goBack}
                className="font-sans text-sm text-brown/60 hover:text-brown transition-colors"
              >
                {texts.nav.back}
              </button>
              <span className="font-sans text-xs font-semibold text-brown/70">
                {progressNumber}/{TOTAL_QUESTIONS}
              </span>
            </div>
            <div
              className="h-2 w-full rounded-full bg-nude overflow-hidden"
              role="progressbar"
              aria-label="Progresso do questionário"
              aria-valuemin={0}
              aria-valuemax={TOTAL_QUESTIONS}
              aria-valuenow={progressNumber}
            >
              <div
                className="h-full rounded-full bg-salmon transition-all duration-500 ease-out"
                style={{ width: `${(progressNumber / TOTAL_QUESTIONS) * 100}%` }}
              />
            </div>
          </div>
        </header>
      )}

      <main className="flex-1 flex items-center justify-center px-5 py-10">
        <div className="max-w-md w-full">
          <Fade key={step}>
            {step === INTRO_STEP && <IntroScreen texts={texts} onStart={() => setStep(0)} />}
            {currentRule && (
              <QuestionScreen
                rule={currentRule}
                number={step + 1}
                texts={texts}
                value={answers[currentRule.id]}
                onChange={(value) => setAnswer(currentRule.id, value)}
                onNext={goNext}
                onSkip={() => {
                  setAnswer(currentRule.id, undefined);
                  goNext();
                }}
              />
            )}
            {step === LGPD_STEP && <LgpdScreen texts={texts} onSubmit={handleSubmit} />}
            {step === DONE_STEP && lead && <FinalScreen config={config} lead={lead} />}
          </Fade>
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

/* ─────────────────────────── Reusable pieces ─────────────────────────── */

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

const primaryButtonClassName = cn(
  buttonVariants({ variant: "primary", size: "lg" }),
  "bg-salmon hover:bg-salmon/90 w-full justify-center text-base"
);

/* ─────────────────────────── Tela inicial ─────────────────────────── */

function IntroScreen({ texts, onStart }: { texts: TentantesTexts; onStart: () => void }) {
  return (
    <div className="text-center">
      <p className="font-['Georgia',serif] italic text-sm font-bold text-dark-brown mb-1">Gerando Milagres</p>
      <p className="font-sans text-xs font-semibold text-brown/60 uppercase tracking-widest mb-6">
        Dra. Camilla Freitas · CRF/PE 4563
      </p>

      <div className="relative w-32 h-32 rounded-full overflow-hidden mx-auto mb-6 shadow-md">
        <Image
          src="/images/camilla-zap2.jpg"
          alt="Dra. Camilla Freitas"
          fill
          priority
          className="object-cover object-top"
          sizes="128px"
        />
      </div>

      <h1 className="font-['Georgia',serif] text-2xl md:text-3xl font-bold text-dark-brown leading-snug mb-3">
        {texts.intro.title}
      </h1>
      <p className="font-sans text-sm text-brown/80 leading-relaxed mb-8">
        {fill(texts.intro.subtitle, { total: TOTAL_QUESTIONS })}
      </p>

      <button type="button" onClick={onStart} className={primaryButtonClassName}>
        {texts.intro.start}
      </button>
    </div>
  );
}

/* ─────────────────────────── Pergunta ─────────────────────────── */

function QuestionScreen({
  rule,
  number,
  texts,
  value,
  onChange,
  onNext,
  onSkip,
}: {
  rule: QuestionRule;
  number: number;
  texts: TentantesTexts;
  value: string | string[] | undefined;
  onChange: (value: string | string[]) => void;
  onNext: () => void;
  onSkip: () => void;
}) {
  const [error, setError] = useState<string | null>(null);
  const titleId = `pergunta-${rule.id}`;
  const copy = texts.questions[rule.id];
  const options = isChoice(rule.id)
    ? OPTION_VALUES[rule.id].map((optionValue) => ({ value: optionValue, label: labelFor(texts, rule.id as ChoiceQuestionId, optionValue) }))
    : [];

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const validationError = validate(rule, value, texts.errors);
    if (validationError) return setError(validationError);
    setError(null);
    onNext();
  }

  function toggleMulti(optionValue: string) {
    const current = Array.isArray(value) ? value : [];
    if (current.includes(optionValue)) {
      onChange(current.filter((v) => v !== optionValue));
    } else if (optionValue === PREFER_NOT_TO_SAY) {
      onChange([PREFER_NOT_TO_SAY]);
    } else {
      onChange([...current.filter((v) => v !== PREFER_NOT_TO_SAY), optionValue]);
    }
    setError(null);
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <p className="font-sans text-xs font-semibold text-salmon uppercase tracking-widest mb-2">
        {fill(texts.nav.questionLabel, { numero: number })}
      </p>
      <h2 id={titleId} className="font-['Georgia',serif] text-2xl font-bold text-dark-brown leading-snug mb-2">
        {copy.title}
      </h2>
      {rule.kind === "multi" && <p className="font-sans text-sm text-brown/70 mb-4">{texts.nav.multiHint}</p>}

      <div className="mt-6 mb-6">
        {(rule.kind === "text" || rule.kind === "tel") && (
          <input
            aria-labelledby={titleId}
            type={rule.kind === "tel" ? "tel" : "text"}
            inputMode={rule.kind === "tel" ? "tel" : undefined}
            autoComplete={rule.kind === "tel" ? "tel-national" : "name"}
            value={typeof value === "string" ? value : ""}
            onChange={(event) => {
              onChange(event.target.value);
              setError(null);
            }}
            placeholder={"placeholder" in copy ? copy.placeholder : undefined}
            className="w-full rounded-xl border-2 border-nude-dark/40 bg-white px-4 py-4 font-sans text-lg text-dark-brown placeholder:text-brown/40 outline-none transition-colors focus:border-salmon"
          />
        )}

        {(rule.kind === "single" || rule.kind === "multi") && (
          <div role="group" aria-labelledby={titleId} className="space-y-3">
            {options.map((option) => {
              const selected =
                rule.kind === "multi" ? Array.isArray(value) && value.includes(option.value) : value === option.value;
              return (
                <button
                  key={option.value}
                  type="button"
                  aria-pressed={selected}
                  onClick={() => {
                    if (rule.kind === "multi") {
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
                      rule.kind === "multi" ? "rounded" : "rounded-full",
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
        {texts.nav.next}
      </button>

      {rule.skippable && (
        <button
          type="button"
          onClick={onSkip}
          className="w-full mt-3 py-3 font-sans text-sm font-semibold text-brown/70 hover:text-brown transition-colors"
        >
          {texts.nav.skip}
        </button>
      )}
    </form>
  );
}

/* ─────────────────────────── Autorização LGPD ─────────────────────────── */

function LgpdScreen({ texts, onSubmit }: { texts: TentantesTexts; onSubmit: () => void }) {
  const [accepted, setAccepted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!accepted) return setError(texts.errors.lgpd);
    onSubmit();
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <h2 className="font-['Georgia',serif] text-2xl font-bold text-dark-brown leading-snug mb-6">
        {texts.lgpd.title}
      </h2>

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
        <span className="font-sans text-sm text-dark-brown/90 leading-snug">{texts.lgpd.consent}</span>
      </label>

      {error && (
        <p className="font-sans text-sm text-red-600 mb-4" role="alert">
          {error}
        </p>
      )}

      <button type="submit" className={primaryButtonClassName}>
        {texts.lgpd.submit}
      </button>
    </form>
  );
}

/* ─────────────────────────── Tela final ─────────────────────────── */

function FinalScreen({ config, lead }: { config: TentantesConfig; lead: TentantesLead }) {
  const copy = config.texts.final;
  const strong = isStrongInvite(lead);
  const whatsappUrl = buildWhatsAppUrl(config.texts, lead, strong);

  return (
    <div className="text-center">
      <h2 className="font-['Georgia',serif] text-3xl font-bold text-dark-brown mb-3">
        {fill(copy.title, { nome: firstName(lead.nome) })}
      </h2>
      <p className="font-sans text-sm text-brown/80 leading-relaxed mb-6">{copy.subtitle}</p>

      <a
        href={config.materialUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={cn(primaryButtonClassName, "mb-10")}
      >
        {copy.download}
      </a>

      {strong ? (
        <div className="rounded-2xl bg-salmon px-6 py-8 shadow-[0_10px_30px_rgba(196,134,122,0.45)]">
          <h3 className="font-['Georgia',serif] text-2xl font-bold text-white leading-snug mb-3">
            {copy.strongTitle}
          </h3>
          <p className="font-sans text-sm text-white/90 leading-relaxed mb-6">{copy.strongText}</p>
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              buttonVariants({ variant: "primary", size: "lg" }),
              "bg-white text-dark-brown hover:bg-cream w-full justify-center text-base"
            )}
          >
            {copy.strongButton}
          </a>
        </div>
      ) : (
        <div className="rounded-2xl bg-white/70 px-6 py-6">
          <p className="font-sans text-sm text-brown/80 leading-relaxed mb-3">{copy.lightText}</p>
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="font-sans text-sm font-semibold text-salmon underline underline-offset-4"
          >
            {copy.lightLink}
          </a>
        </div>
      )}
    </div>
  );
}
