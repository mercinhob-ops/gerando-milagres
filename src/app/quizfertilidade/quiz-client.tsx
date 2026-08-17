"use client";

import { useState, type FormEvent, type ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronRight, Sparkles } from "lucide-react";
import { trackConversionEvent } from "@/lib/meta-conversions";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/design-system/button";

const CASALGM_URL = "/casalgm";
const TOTAL_QUESTIONS = 5;

/* ─────────────────────────── Conteúdo do quiz ─────────────────────────── */

type Question = {
  id: "time_trying" | "exams" | "worry" | "partner" | "need";
  question: string;
  options: { value: string; label: string }[];
};

const QUESTIONS: Question[] = [
  {
    id: "time_trying",
    question: "Há quanto tempo vocês tentam engravidar?",
    options: [
      { value: "lt6m", label: "Menos de 6 meses" },
      { value: "6m_1y", label: "6 meses a 1 ano" },
      { value: "1_2y", label: "1 a 2 anos" },
      { value: "gt2y", label: "Mais de 2 anos" },
    ],
  },
  {
    id: "exams",
    question: "Vocês já fizeram exames de fertilidade?",
    options: [
      { value: "both", label: "Sim, os dois" },
      { value: "her", label: "Só ela" },
      { value: "him", label: "Só ele" },
      { value: "none", label: "Ainda não fizemos" },
    ],
  },
  {
    id: "worry",
    question: "O que mais preocupa vocês?",
    options: [
      { value: "where_to_start", label: "Não saber por onde começar" },
      { value: "diagnosis", label: "Ter diagnóstico (SOP, endometriose, miomas)" },
      { value: "age", label: "A questão da idade" },
      { value: "tried_everything", label: "Já tentamos tudo e nada funcionou" },
    ],
  },
  {
    id: "partner",
    question: "Como está a participação do parceiro?",
    options: [
      { value: "very_present", label: "Muito presente" },
      { value: "supports_unsure", label: "Apoia, mas não sabe como ajudar" },
      { value: "not_talked", label: "Ainda não conversamos muito" },
      { value: "want_more_together", label: "Gostaríamos de fazer mais juntos" },
    ],
  },
  {
    id: "need",
    question: "O que vocês mais precisam agora?",
    options: [
      { value: "understand_body", label: "Entender como o corpo funciona" },
      { value: "practical_plan", label: "Ter um plano prático" },
      { value: "connection", label: "Melhorar conexão e intimidade" },
      { value: "science_faith", label: "Unir ciência e fé" },
    ],
  },
];

type Answers = Partial<Record<Question["id"], string>>;

const BULLETS_BY_TIME: Record<string, string> = {
  lt6m: "Vocês ainda estão no início — o momento certo para organizar o processo antes que a ansiedade tome conta.",
  "6m_1y":
    "Entre 6 meses e 1 ano tentando é o momento ideal para investigar com calma, sem alarme e sem perder tempo.",
  "1_2y":
    "Depois de 1 a 2 anos tentando, o corpo e a mente do casal já pedem um plano mais estruturado — não só mais tentativas.",
  gt2y: "Mais de 2 anos tentando pode significar que faltou um passo importante: entender o que realmente está acontecendo, juntos.",
};

const BULLETS_BY_WORRY: Record<string, string> = {
  where_to_start:
    "Não saber por onde começar é o maior ladrão de tempo nessa jornada — vocês precisam de um caminho claro, não de mais informação solta.",
  diagnosis:
    "Diagnósticos como SOP, endometriose ou miomas pedem um plano específico de preparo do corpo — não só desejo de engravidar.",
  age: "A questão da idade pesa mais na cabeça do que deveria — com o preparo certo, o tempo pode estar mais a favor de vocês do que parece.",
  tried_everything:
    "Quando parece que 'já tentamos tudo', geralmente falta alinhar corpo, mente e casal na mesma direção — não mais uma tentativa isolada.",
};

const BULLETS_BY_NEED: Record<string, string> = {
  understand_body:
    "Entender como o corpo de vocês dois funciona muda a forma como cada tentativa é feita — de adivinhação para direção.",
  practical_plan:
    "Vocês não precisam de mais teoria, precisam de um plano prático que os dois consigam seguir juntos, semana a semana.",
  connection:
    "Reconectar como casal — não só como parceiros de tentativa — é a parte que muitos pulam e sentem falta depois.",
  science_faith:
    "Unir ciência e fé é exatamente o que falta para vocês caminharem com confiança, sem abrir mão de nenhum dos dois.",
};

function buildDiagnosisBullets(answers: Answers): string[] {
  return [
    BULLETS_BY_TIME[answers.time_trying ?? ""] ?? BULLETS_BY_TIME.lt6m,
    BULLETS_BY_WORRY[answers.worry ?? ""] ?? BULLETS_BY_WORRY.where_to_start,
    BULLETS_BY_NEED[answers.need ?? ""] ?? BULLETS_BY_NEED.understand_body,
  ];
}

function firstNameOf(fullName: string): string {
  const trimmed = fullName.trim();
  const first = trimmed.split(/\s+/)[0] ?? "";
  return first.charAt(0).toUpperCase() + first.slice(1);
}

/* ─────────────────────────────── Estado ─────────────────────────────── */

type Screen = "intro" | "question" | "capture" | "result";

export function QuizClient() {
  const [screen, setScreen] = useState<Screen>("intro");
  const [questionIndex, setQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [formError, setFormError] = useState<string | null>(null);

  const stepKey = screen === "question" ? `question-${questionIndex}` : screen;

  function goToIntroCta() {
    setScreen("question");
    setQuestionIndex(0);
  }

  function selectOption(questionId: Question["id"], value: string) {
    setAnswers((current) => ({ ...current, [questionId]: value }));

    window.setTimeout(() => {
      const nextIndex = questionIndex + 1;
      if (nextIndex < TOTAL_QUESTIONS) {
        setQuestionIndex(nextIndex);
      } else {
        setScreen("capture");
      }
    }, 180);
  }

  function goBack() {
    if (screen !== "question") return;
    if (questionIndex === 0) {
      setScreen("intro");
      return;
    }
    setQuestionIndex((i) => i - 1);
  }

  function handleCaptureSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmedName = name.trim();
    const trimmedEmail = email.trim();

    if (trimmedName.length < 2) {
      setFormError("Digite seu nome, por favor.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      setFormError("Digite um e-mail válido.");
      return;
    }

    setFormError(null);
    trackConversionEvent({
      eventName: "Lead",
      customData: { content_name: "Quiz Fertilidade — Florescer a Dois" },
    });
    setScreen("result");
  }

  const currentQuestion = QUESTIONS[questionIndex];
  const bullets = buildDiagnosisBullets(answers);
  const displayName = firstNameOf(name) || "Vocês";

  return (
    <main
      className="min-h-screen"
      style={{ background: "linear-gradient(160deg, #F0E6DC 0%, #E8D0C0 55%, #F0E6DC 100%)" }}
    >
      <style>{`
        @keyframes quiz-fade-step {
          from { opacity: 0; transform: translateY(14px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      {screen === "question" && (
        <ProgressBar current={questionIndex + 1} total={TOTAL_QUESTIONS} onBack={goBack} />
      )}

      <div className="w-full max-w-xl mx-auto px-6 py-12 md:py-16">
        <FadeStep stepKey={stepKey}>
          {screen === "intro" && <IntroScreen onStart={goToIntroCta} />}

          {screen === "question" && currentQuestion && (
            <QuestionScreen question={currentQuestion} onSelect={selectOption} />
          )}

          {screen === "capture" && (
            <CaptureScreen
              name={name}
              email={email}
              error={formError}
              onNameChange={setName}
              onEmailChange={setEmail}
              onSubmit={handleCaptureSubmit}
            />
          )}

          {screen === "result" && <ResultScreen displayName={displayName} bullets={bullets} />}
        </FadeStep>
      </div>
    </main>
  );
}

/* ─────────────────────────── Peças reutilizáveis ─────────────────────────── */

function FadeStep({ children, stepKey }: { children: ReactNode; stepKey: string }) {
  return (
    <div key={stepKey} style={{ animation: "quiz-fade-step 0.4s ease-out" }}>
      {children}
    </div>
  );
}

function ProgressBar({
  current,
  total,
  onBack,
}: {
  current: number;
  total: number;
  onBack: () => void;
}) {
  const percent = (current / total) * 100;

  return (
    <div className="w-full max-w-xl mx-auto px-6 pt-8">
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={onBack}
          aria-label="Voltar"
          className="shrink-0 font-sans text-sm text-brown/60 hover:text-salmon transition-colors cursor-pointer"
        >
          ←
        </button>
        <div className="flex-1 h-2 rounded-full bg-white/60 overflow-hidden">
          <div
            className="h-full rounded-full bg-salmon transition-all duration-500 ease-out"
            style={{ width: `${percent}%` }}
          />
        </div>
      </div>
      <p className="font-sans text-xs text-brown/60 mt-2 text-right">
        Pergunta {current} de {total}
      </p>
    </div>
  );
}

/* ─────────────────────────────── Telas ─────────────────────────────── */

function IntroScreen({ onStart }: { onStart: () => void }) {
  return (
    <div className="text-center space-y-7">
      <p className="font-['Georgia',serif] italic text-lg font-bold text-dark-brown">Gerando Milagres</p>

      <div className="relative w-full max-w-[260px] aspect-[4/5] mx-auto">
        <div
          className="absolute inset-[6%] rounded-full blur-2xl"
          style={{ background: "radial-gradient(circle, rgba(196,134,122,0.35) 0%, rgba(196,134,122,0) 70%)" }}
          aria-hidden="true"
        />
        <Image
          src="/images/camilla-zap2.jpg"
          alt="Dra. Camilla Freitas"
          fill
          className="object-cover object-top rounded-[2.5rem] shadow-2xl relative"
          sizes="260px"
          priority
        />
      </div>

      <h1 className="font-['Georgia',serif] text-3xl md:text-4xl font-bold text-dark-brown leading-[1.15]">
        Descubra o que pode estar impedindo vocês de engravidarem
      </h1>

      <p className="font-sans text-base md:text-lg text-brown/80 leading-relaxed max-w-md mx-auto">
        Responda 5 perguntas rápidas e receba um diagnóstico personalizado para o seu casal.
      </p>

      <div className="pt-2">
        <button
          type="button"
          onClick={onStart}
          className={cn(
            buttonVariants({ variant: "primary", size: "lg" }),
            "bg-salmon hover:bg-salmon/90 shadow-[0_10px_30px_rgba(196,134,122,0.45)] hover:shadow-[0_14px_36px_rgba(196,134,122,0.55)] transition-all duration-200 hover:-translate-y-0.5 w-full sm:w-auto px-8 py-4 text-base md:text-lg cursor-pointer"
          )}
        >
          Quero descobrir agora →
        </button>
      </div>
    </div>
  );
}

function QuestionScreen({
  question,
  onSelect,
}: {
  question: Question;
  onSelect: (questionId: Question["id"], value: string) => void;
}) {
  return (
    <div className="space-y-6">
      <h2 className="font-['Georgia',serif] text-2xl md:text-3xl font-bold text-dark-brown leading-snug text-center">
        {question.question}
      </h2>

      <div className="space-y-3">
        {question.options.map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() => onSelect(question.id, option.value)}
            className="group w-full flex items-center justify-between gap-3 rounded-2xl border-2 border-nude-dark/40 bg-white px-5 py-4 text-left font-sans text-base text-dark-brown shadow-sm transition-all duration-200 hover:border-salmon hover:bg-salmon/5 hover:-translate-y-0.5 hover:shadow-md cursor-pointer"
          >
            <span>{option.label}</span>
            <ChevronRight
              className="w-5 h-5 text-salmon shrink-0 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200"
              aria-hidden="true"
            />
          </button>
        ))}
      </div>
    </div>
  );
}

function CaptureScreen({
  name,
  email,
  error,
  onNameChange,
  onEmailChange,
  onSubmit,
}: {
  name: string;
  email: string;
  error: string | null;
  onNameChange: (value: string) => void;
  onEmailChange: (value: string) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
}) {
  return (
    <div className="text-center space-y-7">
      <div
        className="w-16 h-16 rounded-full flex items-center justify-center mx-auto shadow-md"
        style={{ background: "linear-gradient(145deg, #F0E6DC, #E8D0C0)" }}
        aria-hidden="true"
      >
        <Sparkles className="w-8 h-8 text-salmon" />
      </div>

      <h2 className="font-['Georgia',serif] text-2xl md:text-3xl font-bold text-dark-brown leading-snug">
        Quase lá! Para onde enviamos seu diagnóstico?
      </h2>

      <form onSubmit={onSubmit} className="space-y-4 text-left max-w-sm mx-auto">
        <div className="space-y-1.5">
          <label htmlFor="quiz-name" className="font-sans text-sm font-semibold text-brown/80">
            Nome
          </label>
          <input
            id="quiz-name"
            type="text"
            autoComplete="name"
            value={name}
            onChange={(event) => onNameChange(event.target.value)}
            placeholder="Seu nome"
            className="w-full rounded-xl border-2 border-nude-dark/40 bg-white px-4 py-3 font-sans text-base text-dark-brown placeholder:text-brown/40 outline-none transition-colors focus:border-salmon"
          />
        </div>

        <div className="space-y-1.5">
          <label htmlFor="quiz-email" className="font-sans text-sm font-semibold text-brown/80">
            E-mail
          </label>
          <input
            id="quiz-email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(event) => onEmailChange(event.target.value)}
            placeholder="seuemail@exemplo.com"
            className="w-full rounded-xl border-2 border-nude-dark/40 bg-white px-4 py-3 font-sans text-base text-dark-brown placeholder:text-brown/40 outline-none transition-colors focus:border-salmon"
          />
        </div>

        {error && (
          <p className="font-sans text-sm text-red-600" role="alert">
            {error}
          </p>
        )}

        <button
          type="submit"
          className={cn(
            buttonVariants({ variant: "primary", size: "lg" }),
            "bg-salmon hover:bg-salmon/90 shadow-[0_10px_30px_rgba(196,134,122,0.45)] hover:shadow-[0_14px_36px_rgba(196,134,122,0.55)] transition-all duration-200 hover:-translate-y-0.5 w-full justify-center px-8 py-4 text-base md:text-lg cursor-pointer"
          )}
        >
          Ver meu diagnóstico →
        </button>

        <p className="font-sans text-xs text-brown/50 text-center">
          Seus dados estão seguros e não serão compartilhados.
        </p>
      </form>
    </div>
  );
}

function ResultScreen({ displayName, bullets }: { displayName: string; bullets: string[] }) {
  return (
    <div className="text-center space-y-8">
      <span className="inline-flex items-center gap-2 bg-salmon/15 border border-salmon/30 rounded-full px-4 py-1.5 font-sans text-xs font-bold text-salmon uppercase tracking-widest">
        ✨ Seu diagnóstico está pronto!
      </span>

      <h1 className="font-['Georgia',serif] text-3xl md:text-4xl font-bold text-dark-brown leading-tight">
        {displayName}, descobrimos o que pode estar impedindo vocês
      </h1>

      <ul className="space-y-3 text-left bg-white rounded-2xl border border-nude-dark/30 shadow-sm p-6">
        {bullets.map((bullet) => (
          <li key={bullet} className="flex items-start gap-3">
            <span className="shrink-0 w-6 h-6 rounded-full bg-salmon/15 flex items-center justify-center mt-0.5">
              <span className="w-2 h-2 rounded-full bg-salmon" aria-hidden="true" />
            </span>
            <p className="font-sans text-sm md:text-base text-brown/90 leading-relaxed">{bullet}</p>
          </li>
        ))}
      </ul>

      <p className="font-['Georgia',serif] italic text-lg text-dark-brown leading-relaxed max-w-md mx-auto">
        Com base no perfil de vocês, o guia Florescer a Dois foi criado exatamente para casais nessa situação.
      </p>

      <div className="bg-white/70 backdrop-blur-md rounded-3xl p-6 md:p-8 shadow-xl border border-white/60 space-y-6">
        <div className="flex items-center gap-5 text-left">
          <div className="relative w-24 shrink-0 aspect-[3/4] rounded-xl overflow-hidden shadow-lg rotate-[-3deg]">
            <Image
              src="/images/florescer-a-dois.png"
              alt="Florescer a Dois — Dra. Camilla Freitas"
              fill
              className="object-cover"
              sizes="96px"
            />
          </div>
          <div>
            <p className="font-['Georgia',serif] text-lg font-bold text-dark-brown">Florescer a Dois</p>
            <p className="font-sans text-sm text-brown/60 mt-1">Guia completo para casais</p>
            <p className="font-sans text-sm text-brown/60 font-medium mt-3 mb-0.5">2x de</p>
            <p className="font-['Georgia',serif] text-3xl font-bold text-salmon leading-none">R$ 28,95</p>
          </div>
        </div>

        <Link
          href={CASALGM_URL}
          className={cn(
            buttonVariants({ variant: "primary", size: "lg" }),
            "bg-salmon hover:bg-salmon/90 shadow-[0_10px_30px_rgba(196,134,122,0.45)] hover:shadow-[0_14px_36px_rgba(196,134,122,0.55)] transition-all duration-200 hover:-translate-y-0.5 w-full justify-center px-8 py-5 text-base md:text-lg"
          )}
        >
          Quero o Florescer a Dois →
        </Link>
      </div>

      <div className="flex items-center justify-center gap-3 pt-2">
        <div className="relative w-12 h-12 rounded-full overflow-hidden shrink-0 border-2 border-white shadow-md">
          <Image src="/images/camilla-zap.jpg" alt="Dra. Camilla Freitas" fill className="object-cover" sizes="48px" />
        </div>
        <p className="font-sans text-sm text-brown/70">Dra. Camilla Freitas · CRF/PE 4563</p>
      </div>
    </div>
  );
}
