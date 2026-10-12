"use client";

import { useEffect, useState, type FormEvent, type ReactNode } from "react";
import Image from "next/image";
import { Check } from "lucide-react";
import { trackConversionEvent } from "@/lib/meta-conversions";
import { submitLead } from "@/lib/submit-lead";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/design-system/button";

// TODO: substituir pelo link real do material
const MATERIAL_TENTANTE2_URL = "#MATERIAL_TENTANTE2_URL";
const WHATSAPP_NUMBER = "5581981396005";
const LEAD_STORAGE_KEY = "tentante2_lead";
const TOTAL_QUESTIONS = 11;
const PREFER_NOT_TO_SAY = "prefiro-nao-dizer";

type QuestionId =
  | "nome"
  | "whatsapp"
  | "idade"
  | "tempoTentando"
  | "exames"
  | "identificado"
  | "marido"
  | "perda"
  | "preocupacao"
  | "inicio"
  | "investimento";

type Answers = Partial<Record<QuestionId, string | string[]>>;

interface Option {
  value: string;
  label: string;
}

interface Question {
  id: QuestionId;
  number: number;
  title: string;
  kind: "text" | "tel" | "single" | "multi";
  options?: readonly Option[];
  placeholder?: string;
  skippable?: boolean;
  showIf?: (answers: Answers) => boolean;
}

const questions: readonly Question[] = [
  { id: "nome", number: 1, title: "Qual é o seu nome completo?", kind: "text", placeholder: "Seu nome completo" },
  { id: "whatsapp", number: 2, title: "Qual é o seu WhatsApp? (ex: 81 99999-9999)", kind: "tel", placeholder: "81 99999-9999" },
  {
    id: "idade",
    number: 3,
    title: "Qual é a sua idade?",
    kind: "single",
    options: [
      { value: "ate-30", label: "Até 30" },
      { value: "31-35", label: "31 a 35" },
      { value: "36-39", label: "36 a 39" },
      { value: "40-mais", label: "40 ou mais" },
    ],
  },
  {
    id: "tempoTentando",
    number: 4,
    title: "Faz quanto tempo que vocês tentam ter um bebê?",
    kind: "single",
    options: [
      { value: "menos-6-meses", label: "Menos de 6 meses" },
      { value: "6-meses-1-ano", label: "6 meses a 1 ano" },
      { value: "1-2-anos", label: "1 a 2 anos" },
      { value: "mais-2-anos", label: "Mais de 2 anos" },
    ],
  },
  {
    id: "exames",
    number: 5,
    title: "Vocês já foram ao médico para ver se tem algum problema?",
    kind: "single",
    options: [
      { value: "normal", label: "Sim, o médico disse que está tudo bem" },
      { value: "encontraram-algo", label: "Sim, encontraram alguma coisa" },
      { value: "nao-fizemos", label: "Ainda não fomos ao médico" },
      { value: "tratamento", label: "Já estou em tratamento médico" },
    ],
  },
  {
    id: "identificado",
    number: 6,
    title: "O que o médico encontrou?",
    kind: "multi",
    options: [
      { value: "sop", label: "Ovário policístico (SOP)" },
      { value: "endometriose", label: "Endometriose" },
      { value: "baixa-reserva", label: "Poucos óvulos (reserva baixa)" },
      { value: "fator-masculino", label: "Problema no esperma do marido" },
      { value: "tireoide", label: "Problema na tireoide" },
      { value: "outro", label: "Outra coisa" },
      { value: PREFER_NOT_TO_SAY, label: "Prefiro não falar" },
    ],
    showIf: (answers) => answers.exames === "encontraram-algo" || answers.exames === "tratamento",
  },
  {
    id: "marido",
    number: 7,
    title: "Seu marido está junto nessa caminhada?",
    kind: "single",
    options: [
      { value: "muito-presente", label: "Sim, ele me apoia muito" },
      { value: "mais-ou-menos", label: "Às vezes sim, às vezes não" },
      { value: "nao-conversamos", label: "A gente ainda não falou muito sobre isso" },
    ],
  },
  {
    id: "perda",
    number: 8,
    title: "Você já perdeu alguma gravidez?",
    kind: "single",
    skippable: true,
    options: [
      { value: "nao", label: "Não" },
      { value: "1-vez", label: "Sim, 1 vez" },
      { value: "2-ou-mais", label: "Sim, 2 ou mais vezes" },
      { value: "prefiro-nao-responder", label: "Prefiro não responder" },
    ],
  },
  {
    id: "preocupacao",
    number: 9,
    title: "O que mais te deixa preocupada?",
    kind: "single",
    skippable: true,
    options: [
      { value: "idade", label: "Minha idade" },
      { value: "nao-sei-investigar", label: "Não saber o que fazer" },
      { value: "tentei-de-tudo", label: "Já fiz muita coisa e nada funcionou" },
      { value: "emocional", label: "Minha cabeça e meu coração" },
      { value: "marido", label: "O meu marido não está muito envolvido" },
    ],
  },
  {
    id: "inicio",
    number: 10,
    title: "Quando você quer dar o próximo passo?",
    kind: "single",
    options: [
      { value: "agora", label: "Agora, quero começar logo" },
      { value: "proximos-meses", label: "Daqui a alguns meses" },
      { value: "pesquisando", label: "Ainda estou pensando" },
    ],
  },
  {
    id: "investimento",
    number: 11,
    title: "Quanto você consegue gastar por mês com sua saúde?",
    kind: "single",
    options: [
      { value: "ate-100", label: "Até R$100" },
      { value: "100-300", label: "Entre R$100 e R$300" },
      { value: "300-600", label: "Entre R$300 e R$600" },
      { value: "acima-600", label: "Acima de R$600" },
    ],
  },
];

const INTRO_STEP = -1;
const LGPD_STEP = questions.length;
const DONE_STEP = questions.length + 1;

interface Tentante2Lead {
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

function isVisible(question: Question, answers: Answers) {
  return !question.showIf || question.showIf(answers);
}

function labelFor(id: QuestionId, value: string) {
  return questions.find((q) => q.id === id)?.options?.find((o) => o.value === value)?.label ?? value;
}

function firstName(fullName: string) {
  return fullName.trim().split(/\s+/)[0];
}

function validate(question: Question, value: string | string[] | undefined): string | null {
  if (question.kind === "text") {
    return typeof value === "string" && value.trim() ? null : "Escreva o seu nome completo.";
  }
  if (question.kind === "tel") {
    const digits = typeof value === "string" ? value.replace(/\D/g, "") : "";
    return digits.length >= 10 && digits.length <= 13 ? null : "Confira o número. Coloque o DDD, como 81 99999-9999.";
  }
  if (question.kind === "multi") {
    return Array.isArray(value) && value.length > 0 ? null : "Toque em pelo menos uma resposta.";
  }
  return value ? null : "Toque em uma resposta para seguir.";
}

function buildLead(answers: Answers): Tentante2Lead {
  const str = (id: QuestionId) => (typeof answers[id] === "string" ? (answers[id] as string) : "");
  const optional = (id: QuestionId) => str(id) || null;
  const identificadoQuestion = questions.find((q) => q.id === "identificado")!;
  const identificado =
    isVisible(identificadoQuestion, answers) && Array.isArray(answers.identificado) ? answers.identificado : [];

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

function buildWhatsAppUrl(lead: Tentante2Lead, strong: boolean) {
  const parts = [
    `Oi, Dra. Camilla! Sou ${lead.nome}.`,
    `A gente tenta ter um bebê faz: ${labelFor("tempoTentando", lead.tempoTentando).toLowerCase()}.`,
  ];
  const identificado = lead.identificado.filter((value) => value !== PREFER_NOT_TO_SAY);
  if (identificado.length > 0) {
    parts.push(`O médico encontrou: ${identificado.map((v) => labelFor("identificado", v)).join(", ")}.`);
  }
  parts.push(
    strong ? "Quero a sua ajuda." : "Peguei o material e quero conversar."
  );
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(parts.join(" "))}`;
}

/* ─────────────────────────── Page ─────────────────────────── */

export function Tentante2Content() {
  const [step, setStep] = useState(INTRO_STEP);
  const [answers, setAnswers] = useState<Answers>({});
  const [lead, setLead] = useState<Tentante2Lead | null>(null);

  function goNext() {
    let next = step + 1;
    while (next < questions.length && !isVisible(questions[next], answers)) next++;
    setStep(next);
  }

  function goBack() {
    let prev = step - 1;
    while (prev >= 0 && !isVisible(questions[prev], answers)) prev--;
    setStep(Math.max(prev, INTRO_STEP));
  }

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
        content_name: "Material Tentante 2",
        tempo_tentando: newLead.tempoTentando,
        inicio: newLead.inicio,
      },
    });

    const label = (id: QuestionId, value: string | null) => (value ? labelFor(id, value) : "Pulou");
    submitLead({
      page: "tentante2",
      name: newLead.nome,
      whatsapp: newLead.whatsapp,
      data: {
        Idade: label("idade", newLead.idade),
        "Tempo tentando": label("tempoTentando", newLead.tempoTentando),
        "Exames de fertilidade": label("exames", newLead.exames),
        "O que foi identificado": newLead.identificado.map((v) => labelFor("identificado", v)),
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

  const currentQuestion = step >= 0 && step < questions.length ? questions[step] : null;
  const progressNumber = currentQuestion ? currentQuestion.number : step === LGPD_STEP ? TOTAL_QUESTIONS : 0;
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
                ← Voltar
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
            {step === INTRO_STEP && <IntroScreen onStart={() => setStep(0)} />}
            {currentQuestion && (
              <QuestionScreen
                question={currentQuestion}
                value={answers[currentQuestion.id]}
                onChange={(value) => setAnswer(currentQuestion.id, value)}
                onNext={goNext}
                onSkip={() => {
                  setAnswer(currentQuestion.id, undefined);
                  goNext();
                }}
              />
            )}
            {step === LGPD_STEP && <LgpdScreen onSubmit={handleSubmit} />}
            {step === DONE_STEP && lead && <FinalScreen lead={lead} />}
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

function IntroScreen({ onStart }: { onStart: () => void }) {
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
        Me conta um pouco sobre você 🌸
      </h1>
      <p className="font-sans text-sm text-brown/80 leading-relaxed mb-8">
        São {TOTAL_QUESTIONS} perguntas rápidas. No final, você ganha um material da Dra. Camilla.
      </p>

      <button type="button" onClick={onStart} className={primaryButtonClassName}>
        Começar →
      </button>
    </div>
  );
}

/* ─────────────────────────── Pergunta ─────────────────────────── */

function QuestionScreen({
  question,
  value,
  onChange,
  onNext,
  onSkip,
}: {
  question: Question;
  value: string | string[] | undefined;
  onChange: (value: string | string[]) => void;
  onNext: () => void;
  onSkip: () => void;
}) {
  const [error, setError] = useState<string | null>(null);
  const titleId = `pergunta-${question.id}`;

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const validationError = validate(question, value);
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
        Pergunta {question.number}
      </p>
      <h2 id={titleId} className="font-['Georgia',serif] text-2xl font-bold text-dark-brown leading-snug mb-2">
        {question.title}
      </h2>
      {question.kind === "multi" && (
        <p className="font-sans text-sm text-brown/70 mb-4">Pode marcar mais de uma.</p>
      )}

      <div className="mt-6 mb-6">
        {(question.kind === "text" || question.kind === "tel") && (
          <input
            aria-labelledby={titleId}
            type={question.kind === "tel" ? "tel" : "text"}
            inputMode={question.kind === "tel" ? "tel" : undefined}
            autoComplete={question.kind === "tel" ? "tel-national" : "name"}
            value={typeof value === "string" ? value : ""}
            onChange={(event) => {
              onChange(event.target.value);
              setError(null);
            }}
            placeholder={question.placeholder}
            className="w-full rounded-xl border-2 border-nude-dark/40 bg-white px-4 py-4 font-sans text-lg text-dark-brown placeholder:text-brown/40 outline-none transition-colors focus:border-salmon"
          />
        )}

        {(question.kind === "single" || question.kind === "multi") && (
          <div role="group" aria-labelledby={titleId} className="space-y-3">
            {question.options!.map((option) => {
              const selected =
                question.kind === "multi"
                  ? Array.isArray(value) && value.includes(option.value)
                  : value === option.value;
              return (
                <button
                  key={option.value}
                  type="button"
                  aria-pressed={selected}
                  onClick={() => {
                    if (question.kind === "multi") {
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
                      question.kind === "multi" ? "rounded" : "rounded-full",
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
        Próximo →
      </button>

      {question.skippable && (
        <button
          type="button"
          onClick={onSkip}
          className="w-full mt-3 py-3 font-sans text-sm font-semibold text-brown/70 hover:text-brown transition-colors"
        >
          Pular
        </button>
      )}
    </form>
  );
}

/* ─────────────────────────── Autorização LGPD ─────────────────────────── */

function LgpdScreen({ onSubmit }: { onSubmit: () => void }) {
  const [accepted, setAccepted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!accepted) return setError("Para ver o material, marque o quadrinho acima.");
    onSubmit();
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <h2 className="font-['Georgia',serif] text-2xl font-bold text-dark-brown leading-snug mb-6">
        Falta só uma coisa
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
        <span className="font-sans text-sm text-dark-brown/90 leading-snug">
          Concordo que a Dra. Camilla pode me chamar no WhatsApp para me ajudar. Meus dados ficam só com ela.
        </span>
      </label>

      {error && (
        <p className="font-sans text-sm text-red-600 mb-4" role="alert">
          {error}
        </p>
      )}

      <button type="submit" className={primaryButtonClassName}>
        Enviar e receber o material →
      </button>
    </form>
  );
}

/* ─────────────────────────── Tela final ─────────────────────────── */

function FinalScreen({ lead }: { lead: Tentante2Lead }) {
  const strong = lead.inicio === "agora" || lead.tempoTentando === "mais-2-anos";
  const whatsappUrl = buildWhatsAppUrl(lead, strong);

  return (
    <div className="text-center">
      <h2 className="font-['Georgia',serif] text-3xl font-bold text-dark-brown mb-3">
        Pronto, {firstName(lead.nome)}! Seu material está aqui 🌸
      </h2>
      <p className="font-sans text-sm text-brown/80 leading-relaxed mb-6">É só tocar no botão abaixo.</p>

      <a
        href={MATERIAL_TENTANTE2_URL}
        target="_blank"
        rel="noopener noreferrer"
        className={cn(primaryButtonClassName, "mb-10")}
      >
        Baixar o material
      </a>

      {strong ? (
        <div className="rounded-2xl bg-salmon px-6 py-8 shadow-[0_10px_30px_rgba(196,134,122,0.45)]">
          <h3 className="font-['Georgia',serif] text-2xl font-bold text-white leading-snug mb-3">
            A Dra. Camilla quer te ajudar! Chama ela no WhatsApp 💛
          </h3>
          <p className="font-sans text-sm text-white/90 leading-relaxed mb-6">
            Toque no botão e mande a sua mensagem. Ela já está escrita.
          </p>
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              buttonVariants({ variant: "primary", size: "lg" }),
              "bg-white text-dark-brown hover:bg-cream w-full justify-center text-base"
            )}
          >
            Chamar a Dra. Camilla no WhatsApp →
          </a>
        </div>
      ) : (
        <div className="rounded-2xl bg-white/70 px-6 py-6">
          <p className="font-sans text-sm text-brown/80 leading-relaxed mb-3">
            Ficou com alguma dúvida? A Dra. Camilla pode te ajudar pelo WhatsApp.
          </p>
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="font-sans text-sm font-semibold text-salmon underline underline-offset-4"
          >
            Chamar no WhatsApp
          </a>
        </div>
      )}
    </div>
  );
}
