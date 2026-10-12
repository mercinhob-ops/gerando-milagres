"use client";

import { useState } from "react";
import { trackConversionEvent } from "@/lib/meta-conversions";
import { submitLead } from "@/lib/submit-lead";
import { fill, firstName, QuizFinal, QuizIntro, QuizLgpd, QuizQuestion, QuizShell, type QuizOption } from "@/components/quiz/quiz-ui";

// TODO: substituir pelo link real do material
const MATERIAL_GESTANTE_URL = "#MATERIAL_GESTANTE_URL";
const WHATSAPP_NUMBER = "5581981396005";
const LEAD_STORAGE_KEY = "gestante_lead";
const NENHUMA = "nenhuma";
const PREFIRO_NAO_DIZER = "prefiro-nao-dizer";

type QuestionId =
  | "nome"
  | "whatsapp"
  | "semanas"
  | "primeiraGravidez"
  | "condicoes"
  | "alimentacao"
  | "acompanhamento"
  | "preocupacao";

type Answers = Partial<Record<QuestionId, string | string[]>>;

interface Question {
  id: QuestionId;
  kind: "text" | "tel" | "single" | "multi";
  title: string;
  placeholder?: string;
  options?: readonly QuizOption[];
  skippable?: boolean;
}

const questions: readonly Question[] = [
  { id: "nome", kind: "text", title: "Qual é o seu nome completo?", placeholder: "Seu nome completo" },
  { id: "whatsapp", kind: "tel", title: "Qual é o seu WhatsApp com DDD?", placeholder: "(81) 99999-9999" },
  {
    id: "semanas",
    kind: "single",
    title: "Quantas semanas de gestação você está?",
    options: [
      { value: "1-trimestre", label: "Menos de 12 semanas (1º trimestre)" },
      { value: "2-trimestre", label: "13 a 27 semanas (2º trimestre)" },
      { value: "3-trimestre", label: "28 semanas ou mais (3º trimestre)" },
      { value: "nao-sei", label: "Ainda não sei exatamente" },
    ],
  },
  {
    id: "primeiraGravidez",
    kind: "single",
    title: "É sua primeira gravidez?",
    options: [
      { value: "sim", label: "Sim, primeira vez" },
      { value: "outras", label: "Não, já tive outras gravidezes" },
      { value: "perdas", label: "Tive perdas anteriores" },
    ],
  },
  {
    id: "condicoes",
    kind: "multi",
    title: "Você tem alguma dessas condições?",
    options: [
      { value: "diabetes", label: "Diabetes gestacional" },
      { value: "pressao-alta", label: "Pressão alta na gravidez" },
      { value: "anemia", label: "Anemia" },
      { value: "hiperemese", label: "Enjoo forte (hiperêmese)" },
      { value: "tireoide", label: "Tireoide alterada" },
      { value: NENHUMA, label: "Nenhuma dessas" },
      { value: PREFIRO_NAO_DIZER, label: "Prefiro não dizer" },
    ],
  },
  {
    id: "alimentacao",
    kind: "single",
    title: "Como está sua alimentação hoje?",
    options: [
      { value: "muito-irregular", label: "Muito irregular, como mal" },
      { value: "me-virando", label: "Tô me virando, poderia ser melhor" },
      { value: "razoavel", label: "Razoável, sigo algumas orientações" },
      { value: "boa", label: "Boa, me cuido bastante" },
    ],
  },
  {
    id: "acompanhamento",
    kind: "single",
    title: "Você já tem acompanhamento nutricional na gestação?",
    options: [
      { value: "nunca", label: "Não, nunca tive" },
      { value: "parei", label: "Tive antes mas parei" },
      { value: "sim", label: "Sim, tenho acompanhamento" },
    ],
  },
  {
    id: "preocupacao",
    kind: "single",
    title: "O que mais te preocupa na sua alimentação agora?",
    skippable: true,
    options: [
      { value: "pode-nao-pode", label: "Não saber o que pode e o que não pode comer" },
      { value: "enjoos", label: "Os enjoos me impedem de comer bem" },
      { value: "ganho-peso", label: "Ganho de peso excessivo" },
      { value: "desenvolvimento-bebe", label: "Meu bebê está se desenvolvendo bem?" },
      { value: "sem-orientacao", label: "Não tenho orientação nenhuma" },
    ],
  },
];

const TOTAL_QUESTIONS = questions.length;
const INTRO_STEP = -1;
const LGPD_STEP = questions.length;
const DONE_STEP = questions.length + 1;

/** Trimestre usado na mensagem do WhatsApp e no evento do pixel. */
const TRIMESTRE_POR_SEMANAS: Record<string, string> = {
  "1-trimestre": "1º trimestre",
  "2-trimestre": "2º trimestre",
  "3-trimestre": "3º trimestre",
};

interface GestanteLead {
  nome: string;
  whatsapp: string;
  semanas: string;
  primeiraGravidez: string;
  condicoes: string[];
  alimentacao: string;
  acompanhamento: string;
  preocupacao: string | null;
  lgpd: true;
  origem: string | null;
  capturedAt: string;
}

/* ─────────────────────────── Helpers ─────────────────────────── */

function labelFor(id: QuestionId, value: string) {
  return questions.find((q) => q.id === id)?.options?.find((o) => o.value === value)?.label ?? value;
}

function validate(question: Question, value: string | string[] | undefined): string | null {
  if (question.kind === "text") {
    return typeof value === "string" && value.trim() ? null : "Digite o seu nome completo, por favor.";
  }
  if (question.kind === "tel") {
    const digits = typeof value === "string" ? value.replace(/\D/g, "") : "";
    return digits.length >= 10 && digits.length <= 13 ? null : "Digite um WhatsApp válido, com DDD.";
  }
  if (question.kind === "multi") {
    return Array.isArray(value) && value.length > 0 ? null : "Selecione pelo menos uma opção.";
  }
  return value ? null : "Selecione uma opção para continuar.";
}

function buildLead(answers: Answers): GestanteLead {
  const str = (id: QuestionId) => (typeof answers[id] === "string" ? (answers[id] as string) : "");
  const origem = new URLSearchParams(window.location.search).get("origem");

  return {
    nome: str("nome").trim(),
    whatsapp: str("whatsapp").replace(/\D/g, ""),
    semanas: str("semanas"),
    primeiraGravidez: str("primeiraGravidez"),
    condicoes: Array.isArray(answers.condicoes) ? answers.condicoes : [],
    alimentacao: str("alimentacao"),
    acompanhamento: str("acompanhamento"),
    preocupacao: str("preocupacao") || null,
    lgpd: true,
    origem: origem?.trim() || null,
    capturedAt: new Date().toISOString(),
  };
}

/** Convite forte: alimentação muito irregular, sem acompanhamento ou condição de risco. */
function isStrongInvite(lead: GestanteLead) {
  return (
    lead.alimentacao === "muito-irregular" ||
    lead.acompanhamento === "nunca" ||
    lead.condicoes.includes("diabetes") ||
    lead.condicoes.includes("pressao-alta")
  );
}

function buildWhatsAppUrl(lead: GestanteLead, strong: boolean) {
  const trimestre = TRIMESTRE_POR_SEMANAS[lead.semanas];
  const parts = [
    trimestre
      ? `Olá, Dra. Camilla! Sou ${lead.nome} e estou no ${trimestre} da gestação.`
      : `Olá, Dra. Camilla! Sou ${lead.nome} e estou grávida (ainda não sei exatamente o trimestre).`,
    strong
      ? "Quero ajuda com a minha alimentação na gestação."
      : "Baixei o material sobre alimentação na gestação e gostaria de conversar.",
  ];
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(parts.join(" "))}`;
}

const finalTexts = {
  title: "Pronto, {nome}! 🌸",
  subtitle: "O seu material sobre alimentação na gestação já está liberado.",
  download: "Baixar o material",
  strongTitle: "Vamos olhar o seu caso juntas?",
  strongText: "Pelas suas respostas, a sua alimentação merece atenção agora. Me chama no WhatsApp.",
  strongButton: "Falar com a Dra. Camilla no WhatsApp →",
  lightText: "Se surgir alguma dúvida durante a gestação, você pode falar com a Dra. Camilla no WhatsApp.",
  lightLink: "Falar no WhatsApp",
};

/* ─────────────────────────── Page ─────────────────────────── */

export function GestanteContent() {
  const [step, setStep] = useState(INTRO_STEP);
  const [answers, setAnswers] = useState<Answers>({});
  const [lead, setLead] = useState<GestanteLead | null>(null);

  function setAnswer(id: QuestionId, value: string | string[] | undefined) {
    setAnswers((prev) => ({ ...prev, [id]: value }));
  }

  function handleSubmit() {
    const newLead = buildLead(answers);

    try {
      window.localStorage.setItem(LEAD_STORAGE_KEY, JSON.stringify(newLead));
    } catch {
      // localStorage indisponível (modo privado, etc.) — não bloqueia o fluxo
    }

    trackConversionEvent({
      eventName: "Lead",
      customData: {
        content_name: "Material Alimentação na Gestação",
        trimestre: TRIMESTRE_POR_SEMANAS[newLead.semanas] ?? "não sabe",
        ...(newLead.origem ? { origem: newLead.origem } : {}),
      },
    });

    submitLead({
      page: "gestante",
      name: newLead.nome,
      whatsapp: newLead.whatsapp,
      data: {
        "Semanas de gestação": labelFor("semanas", newLead.semanas),
        "Primeira gravidez": labelFor("primeiraGravidez", newLead.primeiraGravidez),
        Condições: newLead.condicoes.map((v) => labelFor("condicoes", v)),
        "Alimentação hoje": labelFor("alimentacao", newLead.alimentacao),
        "Acompanhamento nutricional": labelFor("acompanhamento", newLead.acompanhamento),
        "Maior preocupação": newLead.preocupacao ? labelFor("preocupacao", newLead.preocupacao) : "Pulou",
        Origem: newLead.origem,
        "Autorização LGPD": "Sim",
      },
    });

    setLead(newLead);
    setStep(DONE_STEP);
  }

  const currentQuestion = step >= 0 && step < questions.length ? questions[step] : null;
  const progress = currentQuestion ? step + 1 : step === LGPD_STEP ? TOTAL_QUESTIONS : 0;
  const strong = lead ? isStrongInvite(lead) : false;

  return (
    <QuizShell
      stepKey={step}
      showChrome={step !== INTRO_STEP && step !== DONE_STEP}
      progress={progress}
      total={TOTAL_QUESTIONS}
      backLabel="← Voltar"
      onBack={() => setStep((prev) => Math.max(prev - 1, INTRO_STEP))}
    >
      {step === INTRO_STEP && (
        <QuizIntro
          imageSrc="/images/camilla-zap.jpg"
          title="O seu bebê muda a cada trimestre. A sua alimentação também deveria."
          subtitle={`Responda ${TOTAL_QUESTIONS} perguntas rápidas e receba o material da Dra. Camilla sobre alimentação na gestação.`}
          startLabel="Começar →"
          onStart={() => setStep(0)}
        />
      )}
      {currentQuestion && (
        <QuizQuestion
          id={currentQuestion.id}
          kind={currentQuestion.kind}
          eyebrow={`Pergunta ${step + 1}`}
          title={currentQuestion.title}
          hint="Você pode marcar mais de uma opção."
          placeholder={currentQuestion.placeholder}
          options={currentQuestion.options}
          exclusiveValues={[NENHUMA, PREFIRO_NAO_DIZER]}
          value={answers[currentQuestion.id]}
          validate={(value) => validate(currentQuestion, value)}
          nextLabel="Próximo →"
          skipLabel={currentQuestion.skippable ? "Pular" : undefined}
          onChange={(value) => setAnswer(currentQuestion.id, value)}
          onNext={() => setStep(step + 1)}
          onSkip={() => {
            setAnswer(currentQuestion.id, undefined);
            setStep(step + 1);
          }}
        />
      )}
      {step === LGPD_STEP && (
        <QuizLgpd
          title="Falta só a sua autorização"
          consent="Autorizo a Dra. Camilla Freitas a entrar em contato comigo pelo WhatsApp informado. Meus dados serão usados apenas para esse fim, conforme a LGPD."
          submitLabel="Enviar e receber o material →"
          errorMessage="Para receber o material, marque a autorização acima."
          onSubmit={handleSubmit}
        />
      )}
      {step === DONE_STEP && lead && (
        <QuizFinal
          texts={finalTexts}
          title={fill(finalTexts.title, { nome: firstName(lead.nome) })}
          materialUrl={MATERIAL_GESTANTE_URL}
          whatsappUrl={buildWhatsAppUrl(lead, strong)}
          strong={strong}
        />
      )}
    </QuizShell>
  );
}
