"use client";

import { useState } from "react";
import Image from "next/image";
import { ArrowRight, CheckCircle2, Sparkles } from "lucide-react";
import { trackConversionEvent } from "@/lib/meta-conversions";
import { cn } from "@/lib/utils";

// ─── PERGUNTAS ────────────────────────────────────────────────────────────────

const questions = [
  {
    text: "Qual é a sua idade?",
    options: [
      { label: "Menos de 30 anos", score: 0 },
      { label: "30 a 34 anos", score: 1 },
      { label: "35 a 39 anos", score: 2 },
      { label: "40 anos ou mais", score: 3 },
    ],
  },
  {
    text: "Há quanto tempo você está tentando engravidar?",
    options: [
      { label: "Menos de 6 meses", score: 0 },
      { label: "6 a 12 meses", score: 1 },
      { label: "1 a 2 anos", score: 2 },
      { label: "Mais de 2 anos", score: 3 },
    ],
  },
  {
    text: "Você já teve perdas gestacionais (abortos)?",
    options: [
      { label: "Nunca tive", score: 0 },
      { label: "1 perda", score: 1 },
      { label: "2 perdas", score: 2 },
      { label: "3 ou mais perdas", score: 3 },
    ],
  },
  {
    text: "Você sabe quando ovula?",
    options: [
      { label: "Sim, acompanho com clareza", score: 0 },
      { label: "Acho que sei, mas tenho dúvidas", score: 1 },
      { label: "Não sei ao certo", score: 2 },
      { label: "Não ovulo regularmente", score: 3 },
    ],
  },
  {
    text: "Você tem algum diagnóstico?",
    options: [
      { label: "Nenhum diagnóstico", score: 0 },
      { label: "Não sei / nunca investiguei", score: 1 },
      { label: "Resistência à insulina ou mioma", score: 2 },
      { label: "SOP ou endometriose", score: 3 },
    ],
  },
  {
    text: "O espermograma do seu parceiro está normal?",
    options: [
      { label: "Sim, está normal", score: 0 },
      { label: "Parcialmente alterado", score: 1 },
      { label: "Não sei / ele nunca fez", score: 2 },
      { label: "Não tenho parceiro fixo", score: 2 },
    ],
  },
  {
    text: "Quando você fez seus últimos exames de fertilidade?",
    options: [
      { label: "Nos últimos 6 meses", score: 0 },
      { label: "Há menos de 1 ano", score: 1 },
      { label: "Há mais de 1 ano", score: 2 },
      { label: "Nunca fiz", score: 3 },
    ],
  },
  {
    text: "Qual é sua maior preocupação hoje?",
    options: [
      { label: "Não sei por onde começar a investigar", score: 1 },
      { label: "Tenho medo de ter algum problema escondido", score: 2 },
      { label: "Me preocupo com a minha idade", score: 2 },
      { label: "Já tentei muita coisa e nada funcionou", score: 3 },
    ],
  },
  {
    text: "Como você se sente na sua jornada de fertilidade?",
    options: [
      { label: "Confiante e otimista", score: 0 },
      { label: "Ansiosa, mas com esperança", score: 1 },
      { label: "Frustrada e cansada", score: 2 },
      { label: "Sem esperança, quase desistindo", score: 3 },
    ],
  },
  {
    text: "O que você mais precisa agora?",
    options: [
      { label: "Aprender mais sobre fertilidade", score: 0 },
      { label: "Entender o que investigar", score: 1 },
      { label: "Um plano personalizado para o meu caso", score: 2 },
      { label: "Me sentir acompanhada por alguém especializado", score: 3 },
    ],
  },
] as const;

// ─── RESULTADOS ───────────────────────────────────────────────────────────────

type ResultKey = "D" | "A" | "B" | "C";

const RESULTS: Record<
  ResultKey,
  {
    profile: string;
    headline: string;
    copy: string;
    cta: string;
    url: string;
    product: string;
    price: string;
    numericPrice: number;
  }
> = {
  D: {
    profile: "Buscadora de Conhecimento",
    headline: "Você está no início de uma jornada importante",
    copy: "Você ainda está descobrindo seu corpo e sua fertilidade. O melhor caminho agora é ter acesso a informações de qualidade, num ambiente acolhedor, com mulheres que estão na mesma jornada.",
    cta: "Quero entrar na Comunidade",
    url: "https://pay.kiwify.com.br/OCUj5sd",
    product: "Comunidade Gerando Milagres",
    price: "R$35/mês",
    numericPrice: 35,
  },
  A: {
    profile: "Exploradora da Fertilidade",
    headline: "Existem fatores que você ainda não investigou",
    copy: "Você tem dúvidas importantes e ainda não tem clareza sobre o que pode estar impedindo sua gravidez. O Mapa da Fertilidade vai te mostrar exatamente o que investigar e quais próximos passos seguir.",
    cta: "Quero meu Mapa da Fertilidade",
    url: "https://pay.kiwify.com.br/5IIyMsr",
    product: "Mapa da Fertilidade",
    price: "R$197",
    numericPrice: 197,
  },
  B: {
    profile: "Investigadora Estratégica",
    headline: "Você já tem sinais importantes que precisam de atenção",
    copy: "Seu perfil indica fatores específicos que merecem uma análise estratégica. Uma consulta com a Dra. Camilla pode mudar completamente sua direção e te economizar meses de tentativas.",
    cta: "Quero minha Consulta Estratégica",
    url: "https://wa.me/5581981396005?text=Ol%C3%A1%20Dra.%20Camilla%2C%20fiz%20o%20quiz%20de%20fertilidade%20e%20quero%20marcar%20minha%20Consulta%20Estrat%C3%A9gica%21",
    product: "Consulta Estratégica",
    price: "R$550",
    numericPrice: 550,
  },
  C: {
    profile: "Jornada Avançada",
    headline: "Sua jornada pede um acompanhamento próximo e personalizado",
    copy: "Você já passou por muito. Perdas, diagnósticos, exames, tentativas. Você não precisa mais tentar sozinha — precisa de um plano personalizado e de alguém do seu lado em cada etapa.",
    cta: "Quero meu Plano Personalizado",
    url: "https://wa.me/5581981396005?text=Ol%C3%A1%20Dra.%20Camilla%2C%20fiz%20o%20quiz%20de%20fertilidade%20e%20tenho%20interesse%20no%20Plano%20Semente%21",
    product: "Plano Semente",
    price: "R$997",
    numericPrice: 997,
  },
};

function getResultKey(score: number): ResultKey {
  if (score <= 8) return "D";
  if (score <= 14) return "A";
  if (score <= 20) return "B";
  return "C";
}

// ─── COMPONENTE ───────────────────────────────────────────────────────────────

type Step = "intro" | "questions" | "capture" | "result";

export function QuizClient() {
  const [step, setStep] = useState<Step>("intro");
  const [currentQ, setCurrentQ] = useState(0);
  const [score, setScore] = useState(0);
  const [visible, setVisible] = useState(true);
  const [form, setForm] = useState({ name: "", whatsapp: "", email: "" });
  const [resultKey, setResultKey] = useState<ResultKey>("A");

  function handleAnswer(pts: number) {
    setVisible(false);
    setTimeout(() => {
      const newScore = score + pts;
      if (currentQ === questions.length - 1) {
        setScore(newScore);
        setStep("capture");
      } else {
        setScore(newScore);
        setCurrentQ((q) => q + 1);
      }
      setVisible(true);
    }, 220);
  }

  function handleCapture(e: React.FormEvent) {
    e.preventDefault();
    const key = getResultKey(score);
    trackConversionEvent({
      eventName: "Lead",
      customData: { content_name: "Quiz Fertilidade" },
    });
    setResultKey(key);
    setStep("result");
  }

  function handleCtaClick() {
    const res = RESULTS[resultKey];
    trackConversionEvent({
      eventName: "InitiateCheckout",
      customData: {
        value: res.numericPrice,
        currency: "BRL",
        content_name: res.product,
      },
    });
  }

  // ── INTRO ──────────────────────────────────────────────────────────────────

  if (step === "intro") {
    return (
      <div className="min-h-screen bg-cream flex flex-col items-center justify-center px-4 py-16">
        <div className="max-w-md w-full text-center">
          <div className="inline-flex items-center gap-2 bg-salmon/10 text-salmon px-4 py-1.5 rounded-full text-sm font-semibold mb-6">
            <Sparkles className="w-4 h-4" aria-hidden="true" />
            Quiz gratuito · 3 minutos
          </div>
          <h1 className="font-display text-3xl md:text-4xl font-bold text-dark-brown leading-tight mb-4">
            Descubra o que pode estar impedindo sua gravidez
          </h1>
          <p className="font-sans text-brown/70 text-base leading-relaxed mb-8">
            Responda 10 perguntas e descubra qual é o próximo passo certo para a
            sua jornada de fertilidade — com base no seu perfil único.
          </p>
          <button
            onClick={() => setStep("questions")}
            className="w-full bg-salmon hover:bg-salmon/90 text-white font-semibold text-lg py-4 px-8 rounded-2xl transition-colors flex items-center justify-center gap-2 cursor-pointer"
          >
            Começar agora
            <ArrowRight className="w-5 h-5" aria-hidden="true" />
          </button>
          <p className="font-sans text-brown/50 text-sm mt-4">
            Grátis · Sem cadastro · Resultado imediato
          </p>
        </div>
      </div>
    );
  }

  // ── PERGUNTAS ──────────────────────────────────────────────────────────────

  if (step === "questions") {
    const q = questions[currentQ];
    const progress = ((currentQ + 1) / questions.length) * 100;

    return (
      <div className="min-h-screen bg-cream flex flex-col">
        {/* Barra de progresso */}
        <div className="w-full h-1.5 bg-nude">
          <div
            className="h-full bg-salmon transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
            role="progressbar"
            aria-valuenow={currentQ + 1}
            aria-valuemin={1}
            aria-valuemax={questions.length}
          />
        </div>

        <div className="flex-1 flex flex-col items-center justify-center px-4 py-12">
          <div className="max-w-lg w-full">
            <p className="font-sans text-salmon text-sm font-semibold tracking-wider uppercase mb-5 text-center">
              Pergunta {currentQ + 1} de {questions.length}
            </p>

            <div
              className={cn(
                "transition-opacity duration-200",
                visible ? "opacity-100" : "opacity-0"
              )}
            >
              <h2 className="font-display text-2xl md:text-3xl font-bold text-dark-brown text-center mb-8 leading-snug">
                {q.text}
              </h2>

              <div className="flex flex-col gap-3">
                {q.options.map((opt) => (
                  <button
                    key={opt.label}
                    onClick={() => handleAnswer(opt.score)}
                    className="w-full text-left bg-white border-2 border-nude-dark/40 hover:border-salmon hover:bg-salmon/5 text-dark-brown font-sans font-medium text-base rounded-2xl px-5 py-4 transition-all duration-150 cursor-pointer"
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── CAPTURA ────────────────────────────────────────────────────────────────

  if (step === "capture") {
    return (
      <div className="min-h-screen bg-cream flex flex-col items-center justify-center px-4 py-16">
        <div className="max-w-md w-full">
          <div className="text-center mb-8">
            <div className="w-14 h-14 rounded-full bg-salmon/15 flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-7 h-7 text-salmon" aria-hidden="true" />
            </div>
            <h2 className="font-display text-2xl md:text-3xl font-bold text-dark-brown mb-2">
              Quase lá!
            </h2>
            <p className="font-sans text-brown/70 text-base leading-relaxed">
              Preencha seus dados para receber seu resultado personalizado.
            </p>
          </div>

          <form onSubmit={handleCapture} className="flex flex-col gap-4">
            <div>
              <label
                htmlFor="quiz-name"
                className="block font-sans text-sm font-semibold text-brown mb-1.5"
              >
                Seu nome
              </label>
              <input
                id="quiz-name"
                type="text"
                required
                placeholder="Como posso te chamar?"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full border-2 border-nude-dark/50 focus:border-salmon bg-white rounded-xl px-4 py-3.5 font-sans text-base text-dark-brown placeholder:text-brown/40 outline-none transition-colors"
              />
            </div>
            <div>
              <label
                htmlFor="quiz-whatsapp"
                className="block font-sans text-sm font-semibold text-brown mb-1.5"
              >
                WhatsApp
              </label>
              <input
                id="quiz-whatsapp"
                type="tel"
                required
                placeholder="(00) 00000-0000"
                value={form.whatsapp}
                onChange={(e) => setForm({ ...form, whatsapp: e.target.value })}
                className="w-full border-2 border-nude-dark/50 focus:border-salmon bg-white rounded-xl px-4 py-3.5 font-sans text-base text-dark-brown placeholder:text-brown/40 outline-none transition-colors"
              />
            </div>
            <div>
              <label
                htmlFor="quiz-email"
                className="block font-sans text-sm font-semibold text-brown mb-1.5"
              >
                E-mail
              </label>
              <input
                id="quiz-email"
                type="email"
                required
                placeholder="seu@email.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full border-2 border-nude-dark/50 focus:border-salmon bg-white rounded-xl px-4 py-3.5 font-sans text-base text-dark-brown placeholder:text-brown/40 outline-none transition-colors"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-salmon hover:bg-salmon/90 text-white font-semibold text-lg py-4 px-8 rounded-2xl transition-colors mt-2 flex items-center justify-center gap-2 cursor-pointer"
            >
              Ver meu resultado
              <ArrowRight className="w-5 h-5" aria-hidden="true" />
            </button>
          </form>

          <p className="font-sans text-brown/50 text-xs text-center mt-4">
            Seus dados são protegidos e não serão compartilhados.
          </p>
        </div>
      </div>
    );
  }

  // ── RESULTADO ──────────────────────────────────────────────────────────────

  const res = RESULTS[resultKey];

  return (
    <div className="min-h-screen bg-cream flex flex-col items-center justify-center px-4 py-16">
      <div className="max-w-lg w-full">
        {/* Badge do perfil */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-salmon text-white px-5 py-2 rounded-full text-sm font-bold mb-5 uppercase tracking-wider">
            <Sparkles className="w-4 h-4" aria-hidden="true" />
            Seu perfil: {res.profile}
          </div>
          <h2 className="font-display text-2xl md:text-3xl font-bold text-dark-brown leading-snug mb-4">
            {res.headline}
          </h2>
          <p className="font-sans text-brown/70 text-base leading-relaxed">
            {res.copy}
          </p>
        </div>

        {/* Card da Dra. Camilla */}
        <div className="bg-white rounded-3xl p-5 flex items-center gap-4 mb-5 border border-nude-dark/30 shadow-sm">
          <div className="relative w-16 h-16 shrink-0">
            <Image
              src="/images/camilla-zap.jpg"
              alt="Dra. Camilla Freitas"
              fill
              className="object-cover rounded-full"
              sizes="64px"
            />
          </div>
          <div>
            <p className="font-sans font-bold text-dark-brown text-sm">
              Dra. Camilla Freitas
            </p>
            <p className="font-sans text-brown/60 text-sm leading-relaxed mt-0.5">
              Farmacêutica especialista em fertilidade — preparei este resultado
              pensando exatamente no seu caso.
            </p>
          </div>
        </div>

        {/* CTA */}
        <div className="bg-white rounded-3xl p-6 border border-nude-dark/30 shadow-sm">
          <p className="font-sans text-sm text-brown/60 font-medium mb-1">
            Recomendado para você
          </p>
          <p className="font-display text-xl font-bold text-dark-brown mb-1">
            {res.product}
          </p>
          <p className="font-sans text-salmon font-bold text-lg mb-5">
            {res.price}
          </p>
          <a
            href={res.url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={handleCtaClick}
            className="w-full bg-salmon hover:bg-salmon/90 text-white font-semibold text-lg py-4 px-8 rounded-2xl transition-colors flex items-center justify-center gap-2"
          >
            {res.cta}
            <ArrowRight className="w-5 h-5" aria-hidden="true" />
          </a>
        </div>
      </div>
    </div>
  );
}
