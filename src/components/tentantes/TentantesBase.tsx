"use client";

import { useState } from "react";
import { trackConversionEvent } from "@/lib/meta-conversions";
import { submitLead } from "@/lib/submit-lead";
import { fill, firstName, QuizFinal, QuizIntro, QuizLgpd, QuizQuestion, QuizShell, type QuizFinalTexts } from "@/components/quiz/quiz-ui";

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
  final: QuizFinalTexts;
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
  const strong = lead ? isStrongInvite(lead) : false;
  const questionCopy = currentRule ? texts.questions[currentRule.id] : null;

  return (
    <QuizShell
      stepKey={step}
      showChrome={step !== INTRO_STEP && step !== DONE_STEP}
      progress={progressNumber}
      total={TOTAL_QUESTIONS}
      backLabel={texts.nav.back}
      onBack={goBack}
    >
      {step === INTRO_STEP && (
        <QuizIntro
          imageSrc="/images/camilla-zap2.jpg"
          title={texts.intro.title}
          subtitle={fill(texts.intro.subtitle, { total: TOTAL_QUESTIONS })}
          startLabel={texts.intro.start}
          onStart={() => setStep(0)}
        />
      )}
      {currentRule && (
        <QuizQuestion
          id={currentRule.id}
          kind={currentRule.kind}
          eyebrow={fill(texts.nav.questionLabel, { numero: step + 1 })}
          title={questionCopy!.title}
          hint={texts.nav.multiHint}
          placeholder={questionCopy && "placeholder" in questionCopy ? questionCopy.placeholder : undefined}
          options={
            isChoice(currentRule.id)
              ? OPTION_VALUES[currentRule.id].map((value) => ({
                  value,
                  label: labelFor(texts, currentRule.id as ChoiceQuestionId, value),
                }))
              : []
          }
          exclusiveValues={[PREFER_NOT_TO_SAY]}
          value={answers[currentRule.id]}
          validate={(value) => validate(currentRule, value, texts.errors)}
          nextLabel={texts.nav.next}
          skipLabel={currentRule.skippable ? texts.nav.skip : undefined}
          onChange={(value) => setAnswer(currentRule.id, value)}
          onNext={goNext}
          onSkip={() => {
            setAnswer(currentRule.id, undefined);
            goNext();
          }}
        />
      )}
      {step === LGPD_STEP && (
        <QuizLgpd
          title={texts.lgpd.title}
          consent={texts.lgpd.consent}
          submitLabel={texts.lgpd.submit}
          errorMessage={texts.errors.lgpd}
          onSubmit={handleSubmit}
        />
      )}
      {step === DONE_STEP && lead && (
        <QuizFinal
          texts={texts.final}
          title={fill(texts.final.title, { nome: firstName(lead.nome) })}
          materialUrl={config.materialUrl}
          whatsappUrl={buildWhatsAppUrl(texts, lead, strong)}
          strong={strong}
        />
      )}
    </QuizShell>
  );
}
