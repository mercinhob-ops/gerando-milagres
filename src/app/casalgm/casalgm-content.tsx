"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import Image from "next/image";
import { ChevronDown, Stethoscope, Salad, Sparkles, CheckCircle2, Check } from "lucide-react";
import { trackConversionEvent } from "@/lib/meta-conversions";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/design-system/button";

const CHECKOUT_URL = "https://pay.hotmart.com/D106943069P";
const PRICE_VALUE = 57.9;
const PRODUCT_NAME = "Florescer a Dois";

const TICKER_TEXT = "FLORESCER A DOIS • FERTILIDADE DO CASAL • DRA. CAMILLA FREITAS CRF/PE 4563 • ".repeat(4);

// Fotos reais de casais atendidos pela Dra. Camilla.
const socialProofPhotos = [
  { src: "/images/casal-2.jpg", alt: "Casal atendido pela Dra. Camilla" },
  { src: "/images/casal-3.jpg", alt: "Casal atendido pela Dra. Camilla" },
  { src: "/images/casal-4.jpg", alt: "Casal atendido pela Dra. Camilla" },
  { src: "/images/casal-5.jpg", alt: "Casal atendido pela Dra. Camilla" },
  { src: "/images/casal-1.jpg", alt: "Casal atendido pela Dra. Camilla" },
] as const;

const heroPolaroids = [
  { src: "/images/casal-1.jpg", alt: "Casal atendido pela Dra. Camilla", rotate: -8 },
  { src: "/images/casal-4.jpg", alt: "Casal atendido pela Dra. Camilla", rotate: 6 },
  { src: "/images/casal-1.jpg", alt: "Casal atendido pela Dra. Camilla", rotate: 4 },
] as const;

const forWhoPoints = [
  "Estão tentando engravidar há meses sem resultado",
  "Fizeram exames e ouviram que está tudo normal",
  "Não sabem quais exames os dois precisam fazer",
  "Sentem que o sexo virou obrigação",
  "Querem unir ciência e fé nessa jornada",
] as const;

const howItWorksSteps = [
  {
    number: "1",
    icon: Stethoscope,
    title: "Entender o Corpo",
    desc: "Ciclo, exames e hormônios explicados de forma simples, para vocês entenderem o que está acontecendo.",
  },
  {
    number: "2",
    icon: Salad,
    title: "Preparar Juntos",
    desc: "Alimentação, suplementação e mente — hábitos que os dois constroem lado a lado.",
  },
  {
    number: "3",
    icon: Sparkles,
    title: "Florescer a Dois",
    desc: "Conexão, fé e os próximos passos para caminharem unidos rumo à gravidez.",
  },
] as const;

const timelineWeeks = [
  {
    week: "Semana 1",
    icon: "🔎",
    title: "Entender e Diagnosticar",
    items: ["Conhecer o corpo", "Exames dela e dele", "Guia da fertilidade"],
  },
  {
    week: "Semana 2",
    icon: "🌱",
    title: "Preparar o Corpo e a Mente",
    items: ["Alimentação anti-inflamatória", "Suplementação", "Mente e ansiedade"],
  },
  {
    week: "Semana 3",
    icon: "🌸",
    title: "Florescer Juntos",
    items: ["Movimento físico", "Conexão do casal", "Fé e espiritualidade"],
  },
] as const;

const includedItems = [
  "9 capítulos completos",
  "Guia de exames dela e dele",
  "Protocolo anti-inflamatório",
  "Suplementação educativa",
  "Plano de conexão do casal",
  "Devocional com versículos",
  "Checklist dos próximos passos",
  "Linguagem acessível e acolhedora",
] as const;

const trustBadges = [
  { label: "Garantia 7 dias", color: "bg-success/10 text-success border-success/30" },
  { label: "Acesso imediato", color: "bg-info/10 text-info border-info/30" },
  { label: "PDF completo", color: "bg-salmon/10 text-salmon border-salmon/30" },
  { label: "Compra segura", color: "bg-warning/10 text-warning border-warning/30" },
  { label: "+500 casais", color: "bg-brown/10 text-brown border-brown/30" },
] as const;

const testimonials = [
  {
    names: "Maria e João",
    city: "Recife, PE",
    message:
      "Depois de 8 meses tentando, o guia da Dra. Camilla nos ajudou a entender que fertilidade é coisa de casal mesmo. Fizemos os exames juntos e hoje estamos grávidos!",
  },
  {
    names: "Ana e Pedro",
    city: "São Paulo, SP",
    message:
      'A parte da conexão do casal mudou tudo pra gente. Com a orientação da Dra. Camilla, o sexo deixou de ser "tarefa" e virou encontro de novo.',
  },
  {
    names: "Camila e Rafael",
    city: "Belo Horizonte, MG",
    message:
      "Eu não sabia nem por onde começar com os exames. A Dra. Camilla explicou tudo de um jeito simples e acolhedor no guia. Hoje sabemos exatamente o que fazer.",
  },
  {
    names: "Juliana e Marcos",
    city: "Curitiba, PR",
    message:
      "A parte da fé junto com a ciência foi o que mais tocou a gente. Com o acompanhamento da Dra. Camilla, nos sentimos amparados em cada etapa dessa jornada.",
  },
] as const;

const journeyStages = [
  "Perdidos e Sozinhos",
  "Buscando Respostas",
  "Preparando o Corpo",
  "Florescendo Juntos",
  "Positivo! 🎉",
] as const;
const CURRENT_STAGE_INDEX = 2;

const faqs = [
  {
    question: "Para quem é o Florescer a Dois?",
    answer:
      "Para casais que estão tentando engravidar e querem caminhar juntos nessa jornada — entendendo o corpo um do outro, os exames necessários e como se preparar, com ciência e fé.",
  },
  {
    question: "É um curso ou um ebook?",
    answer:
      "É um guia digital em PDF, com 9 capítulos organizados em 3 semanas de conteúdo. Vocês leem no seu próprio ritmo, no celular ou computador.",
  },
  {
    question: "Como vou receber?",
    answer:
      "Assim que a compra for confirmada, vocês recebem acesso imediato ao material por e-mail, com um link para download do PDF completo.",
  },
  {
    question: "Serve para quem tem SOP ou endometriose?",
    answer:
      "Sim. O guia foi pensado para casais em diferentes contextos de fertilidade. Ele não substitui o acompanhamento médico, mas ajuda vocês a chegarem mais preparados e informados às consultas.",
  },
  {
    question: "E o meu marido precisa ler também?",
    answer:
      "Sim — e essa é a ideia! O Florescer a Dois foi criado justamente para que os dois participem, entendam o papel de cada um nessa jornada e caminhem juntos, não só ela.",
  },
] as const;

export function CasalGmContent() {
  return (
    <div className="overflow-x-hidden">
      <style>{`
        @keyframes casalgm-ticker-scroll {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        @keyframes casalgm-float {
          0%, 100% { transform: translateY(0) rotate(var(--float-rotate, 0deg)); }
          50% { transform: translateY(-10px) rotate(var(--float-rotate, 0deg)); }
        }
      `}</style>

      <HeroSection />
      <TickerBar />
      <FadeInSection>
        <SocialProofSection />
      </FadeInSection>
      <FadeInSection>
        <ForWhoSection />
      </FadeInSection>
      <FadeInSection>
        <HowItWorksSection />
      </FadeInSection>
      <FadeInSection>
        <TimelineSection />
      </FadeInSection>
      <FadeInSection>
        <WhatsIncludedSection />
      </FadeInSection>
      <FadeInSection>
        <TestimonialsSection />
      </FadeInSection>
      <FadeInSection>
        <JourneyRulerSection />
      </FadeInSection>
      <FadeInSection>
        <PricingSection />
      </FadeInSection>
      <FadeInSection>
        <GuaranteeSection />
      </FadeInSection>
      <FadeInSection>
        <FaqSection />
      </FadeInSection>
      <FadeInSection>
        <FinalCtaSection />
      </FadeInSection>
      <FooterSection />
    </div>
  );
}

/* ─────────────────────────── Reusable pieces ─────────────────────────── */

function FadeInSection({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.12 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(28px)",
        transition: "opacity 0.7s ease-out, transform 0.7s ease-out",
      }}
    >
      {children}
    </div>
  );
}

function AnimatedCounter({ target, duration = 1600 }: { target: number; duration?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [count, setCount] = useState(0);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStarted(true);
          observer.disconnect();
        }
      },
      { threshold: 0.6 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!started) return;
    const startTime = performance.now();
    let frameId: number;

    function tick(now: number) {
      const progress = Math.min((now - startTime) / duration, 1);
      setCount(Math.floor(progress * target));
      if (progress < 1) frameId = requestAnimationFrame(tick);
    }

    frameId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameId);
  }, [started, target, duration]);

  return (
    <span ref={ref} data-testid="animated-counter">
      {count}
    </span>
  );
}

function CheckoutCta({ label, className }: { label: string; className?: string }) {
  function handleClick() {
    trackConversionEvent({
      eventName: "InitiateCheckout",
      customData: { value: PRICE_VALUE, currency: "BRL", content_name: PRODUCT_NAME },
    });
  }

  return (
    <a
      href={CHECKOUT_URL}
      target="_blank"
      rel="noopener noreferrer"
      onClick={handleClick}
      className={cn(
        buttonVariants({ variant: "primary", size: "lg" }),
        "bg-salmon hover:bg-salmon/90 shadow-[0_10px_30px_rgba(196,134,122,0.45)] hover:shadow-[0_14px_36px_rgba(196,134,122,0.55)] transition-all duration-200 hover:-translate-y-0.5 inline-flex",
        className
      )}
    >
      {label}
    </a>
  );
}

function Polaroid({
  className,
  rotate,
  src,
  alt,
}: {
  className?: string;
  rotate: number;
  src: string;
  alt: string;
}) {
  return (
    <div
      className={cn("bg-white p-2 pb-6 rounded-sm shadow-2xl", className)}
      style={{ "--float-rotate": `${rotate}deg`, animation: "casalgm-float 5s ease-in-out infinite" } as React.CSSProperties}
    >
      <div className="relative w-full aspect-square rounded-sm overflow-hidden">
        <Image src={src} alt={alt} fill className="object-cover" sizes="120px" />
      </div>
    </div>
  );
}

/* ─────────────────────────────── 1. Hero ─────────────────────────────── */

function HeroSection() {
  return (
    <section
      className="relative overflow-hidden"
      style={{ background: "linear-gradient(160deg, #F0E6DC 0%, #E8D0C0 55%, #F0E6DC 100%)" }}
    >
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute top-[-10%] right-[-8%] w-[40vw] h-[40vw] rounded-full bg-salmon/10 blur-3xl" />
        <div className="absolute bottom-[-8%] left-[-6%] w-[32vw] h-[32vw] rounded-full bg-brown/5 blur-3xl" />
      </div>

      <div className="relative z-10 w-full max-w-6xl mx-auto px-6 pt-14 md:pt-20 pb-14 flex flex-col md:flex-row items-center gap-14">
        {/* Left: copy */}
        <div className="flex-1 text-center md:text-left space-y-6 order-2 md:order-1">
          <p className="font-['Georgia',serif] italic text-lg font-bold text-dark-brown">Gerando Milagres</p>

          <h1 className="font-['Georgia',serif] text-4xl md:text-5xl lg:text-6xl font-bold text-dark-brown leading-[1.1]">
            O PRIMEIRO PASSO PARA VOCÊS ENGRAVIDAREM JUNTOS <span aria-hidden="true">🌸</span>
          </h1>

          <p className="font-sans text-lg md:text-xl text-brown/80 leading-relaxed md:max-w-xl">
            O que vocês fazem antes de tentar pode mudar completamente suas chances.
          </p>

          <div className="flex items-center justify-center md:justify-start gap-3">
            <AvatarStack />
            <p className="font-sans text-sm text-brown/60">+500 casais já começaram essa jornada</p>
          </div>

          <div className="pt-2">
            <CheckoutCta label="Quero começar minha jornada →" className="text-base md:text-lg px-8 py-4" />
          </div>
        </div>

        {/* Right: photo + floating polaroids */}
        <div className="order-1 md:order-2 shrink-0 relative w-full max-w-[300px] md:max-w-[360px]">
          <div className="relative w-full aspect-[4/5]">
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
              sizes="(max-width: 768px) 300px, 360px"
              priority
            />
          </div>

          <Polaroid
            rotate={heroPolaroids[0].rotate}
            src={heroPolaroids[0].src}
            alt={heroPolaroids[0].alt}
            className="absolute -top-6 -left-10 w-24 hidden sm:block"
          />
          <Polaroid
            rotate={heroPolaroids[1].rotate}
            src={heroPolaroids[1].src}
            alt={heroPolaroids[1].alt}
            className="absolute top-1/3 -right-8 w-24 hidden sm:block"
          />
          <Polaroid
            rotate={heroPolaroids[2].rotate}
            src={heroPolaroids[2].src}
            alt={heroPolaroids[2].alt}
            className="absolute -bottom-6 left-6 w-24 hidden sm:block"
          />
        </div>
      </div>
    </section>
  );
}

function AvatarStack() {
  const colors = ["bg-salmon", "bg-brown", "bg-dark-brown", "bg-nude-dark"];
  return (
    <div className="flex -space-x-3" aria-hidden="true">
      {colors.map((color) => (
        <div
          key={color}
          className={cn(
            "w-9 h-9 rounded-full border-2 border-white/80 flex items-center justify-center backdrop-blur-sm",
            color
          )}
        >
          <span className="text-white/90 text-xs" aria-hidden="true">
            💛
          </span>
        </div>
      ))}
    </div>
  );
}

/* ─────────────────────────────── 2. Ticker ─────────────────────────────── */

function TickerBar() {
  return (
    <div
      className="relative border-y border-white/10 py-3 overflow-hidden"
      style={{ background: "linear-gradient(90deg, #4A2E26 0%, #6B4239 100%)" }}
    >
      <div
        className="flex w-max whitespace-nowrap"
        style={{ animation: "casalgm-ticker-scroll 24s linear infinite" }}
      >
        <span className="font-sans text-xs font-semibold tracking-widest text-nude/80 uppercase px-4">
          {TICKER_TEXT}
        </span>
        <span
          className="font-sans text-xs font-semibold tracking-widest text-nude/80 uppercase px-4"
          aria-hidden="true"
        >
          {TICKER_TEXT}
        </span>
      </div>
    </div>
  );
}

/* ────────────────────────── 3. Prova social ────────────────────────── */

function SocialProofSection() {
  return (
    <section className="py-16 px-6 bg-white">
      <div className="max-w-4xl mx-auto text-center">
        <p className="font-['Georgia',serif] text-2xl md:text-3xl font-bold text-dark-brown mb-8 leading-snug">
          <span className="text-salmon">
            <AnimatedCounter target={500} />+
          </span>{" "}
          casais já transformaram sua jornada com a Dra. Camilla
        </p>

        <div className="grid grid-cols-5 gap-3 md:gap-4 mb-6">
          {socialProofPhotos.map((photo) => (
            <div
              key={photo.src}
              className="relative aspect-square rounded-2xl shadow-sm overflow-hidden transition-transform duration-300 hover:scale-105"
            >
              <Image
                src={photo.src}
                alt={photo.alt}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 18vw, 140px"
              />
            </div>
          ))}
        </div>

        <p className="font-sans text-brown/70 text-base md:text-lg italic">Agora é a vez de vocês.</p>
      </div>
    </section>
  );
}

/* ────────────────────────── 4. Para quem é ────────────────────────── */

function ForWhoSection() {
  return (
    <section className="py-20 px-6" style={{ background: "#4A2E26" }}>
      <div className="max-w-2xl mx-auto">
        <h2 className="font-['Georgia',serif] text-3xl md:text-4xl font-bold text-white text-center mb-10 leading-snug">
          Esse guia é para vocês se…
        </h2>
        <ul className="space-y-4">
          {forWhoPoints.map((point) => (
            <li
              key={point}
              className="flex items-start gap-4 rounded-2xl px-5 py-4 border border-white/15 backdrop-blur-sm bg-white/5 transition-colors hover:bg-white/10"
            >
              <span className="shrink-0 w-6 h-6 rounded-full bg-white/15 flex items-center justify-center mt-0.5">
                <Check className="w-4 h-4 text-white" aria-hidden="true" />
              </span>
              <p className="font-sans text-white/90 text-base leading-snug">{point}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/* ────────────────────────── 5. Como funciona ────────────────────────── */

function HowItWorksSection() {
  return (
    <section className="py-20 px-6 bg-cream">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-14">
          <p className="font-sans text-xs font-semibold tracking-widest text-salmon uppercase mb-4">
            Como funciona
          </p>
          <h2 className="font-['Georgia',serif] text-3xl md:text-4xl font-bold text-dark-brown leading-snug">
            Um caminho claro, em 3 etapas
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {howItWorksSteps.map(({ number, icon: Icon, title, desc }) => (
            <div
              key={number}
              className="bg-white rounded-2xl p-7 text-center shadow-sm border border-nude-dark/30 transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
            >
              <p className="font-['Georgia',serif] text-6xl font-bold text-salmon/25 leading-none mb-2">
                {number}
              </p>
              <div className="w-14 h-14 rounded-full bg-salmon/15 flex items-center justify-center mx-auto -mt-10 mb-4 border-4 border-white shadow-sm">
                <Icon className="w-7 h-7 text-salmon" aria-hidden="true" />
              </div>
              <h3 className="font-['Georgia',serif] text-xl font-bold text-dark-brown mb-3">{title}</h3>
              <p className="font-sans text-sm text-gray-600 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ────────────────────────── 6. Cronograma ────────────────────────── */

function TimelineSection() {
  return (
    <section className="py-20 px-6 bg-white">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-14">
          <h2 className="font-['Georgia',serif] text-3xl md:text-4xl font-bold text-dark-brown leading-snug">
            O que vocês vão viver com o guia
          </h2>
          <p className="font-sans text-sm text-gray-500 mt-3">3 semanas de conteúdo, no seu ritmo</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {timelineWeeks.map(({ week, icon, title, items }) => (
            <div
              key={week}
              className="rounded-2xl p-7 shadow-sm border border-nude-dark/30 bg-cream transition-all duration-300 hover:shadow-lg"
            >
              <span className="text-5xl" aria-hidden="true">
                {icon}
              </span>
              <p className="font-sans text-[11px] font-bold text-salmon uppercase tracking-widest mt-4">{week}</p>
              <h3 className="font-['Georgia',serif] text-lg font-bold text-dark-brown mb-4">{title}</h3>
              <ul className="space-y-2.5">
                {items.map((item) => (
                  <li key={item} className="font-sans text-sm text-gray-600 flex items-center gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-salmon shrink-0" aria-hidden="true" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ────────────────────────── 7. O que está incluso ────────────────────────── */

function WhatsIncludedSection() {
  return (
    <section className="py-20 px-6 bg-cream">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="font-['Georgia',serif] text-3xl md:text-4xl font-bold text-dark-brown leading-snug">
            O que está incluso
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-12">
          {includedItems.map((item) => (
            <div
              key={item}
              className="flex items-center gap-3 bg-white rounded-xl px-4 py-3.5 shadow-sm transition-transform duration-200 hover:scale-[1.02]"
            >
              <CheckCircle2 className="w-5 h-5 text-success shrink-0" aria-hidden="true" />
              <p className="font-sans text-sm text-brown/90">{item}</p>
            </div>
          ))}
        </div>

        <div className="flex flex-wrap items-center justify-center gap-2.5">
          {trustBadges.map(({ label, color }) => (
            <span
              key={label}
              className={cn("font-sans text-xs font-semibold border rounded-full px-4 py-1.5", color)}
            >
              {label}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ────────────────────────── 8. Depoimentos ────────────────────────── */

function TestimonialsSection() {
  return (
    <section className="py-20 px-6 bg-white">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <p className="font-sans text-xs font-semibold tracking-widest text-salmon uppercase mb-4">
            Depoimentos
          </p>
          <h2 className="font-['Georgia',serif] text-3xl md:text-4xl font-bold text-dark-brown leading-snug">
            O que casais estão dizendo
          </h2>
          <p className="font-sans text-xs text-gray-400 mt-3">*Depoimentos ilustrativos</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {testimonials.map(({ names, city, message }, i) => (
            <div
              key={names}
              className="bg-white border-l-4 border-salmon rounded-2xl p-6 shadow-sm transition-shadow duration-300 hover:shadow-lg"
              style={{ boxShadow: "0 4px 20px rgba(107,66,57,0.06)" }}
            >
              <p className="font-['Georgia',serif] italic text-gray-700 leading-relaxed mb-4">
                &ldquo;{message}&rdquo;
              </p>
              <div className="flex items-center gap-3">
                <div className="relative w-10 h-10 rounded-full overflow-hidden shrink-0">
                  <Image
                    src={i % 2 === 0 ? "/images/casal-1.jpg" : "/images/casal-5.jpg"}
                    alt="Casal atendido pela Dra. Camilla"
                    fill
                    className="object-cover"
                    sizes="40px"
                  />
                </div>
                <div>
                  <p className="font-sans text-sm font-bold text-dark-brown">{names}</p>
                  <p className="font-sans text-xs text-gray-400">{city}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ────────────────────────── 9. Régua da jornada ────────────────────────── */

function JourneyRulerSection() {
  const columnWidthPct = 100 / journeyStages.length;
  const insetPct = columnWidthPct / 2;

  return (
    <section className="py-20 px-6 bg-nude">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-14">
          <h2 className="font-['Georgia',serif] text-3xl md:text-4xl font-bold text-dark-brown leading-snug">
            Onde vocês estão nessa jornada?
          </h2>
        </div>

        <div className="relative h-9">
          <div
            className="absolute top-1/2 h-2 rounded-full -translate-y-1/2"
            style={{
              left: `${insetPct}%`,
              right: `${insetPct}%`,
              background: "linear-gradient(90deg, #DC2626 0%, #F59E0B 50%, #16A34A 100%)",
            }}
            aria-hidden="true"
          />
          <div
            className="relative grid h-9"
            style={{ gridTemplateColumns: `repeat(${journeyStages.length}, 1fr)` }}
          >
            {journeyStages.map((stage, i) => (
              <div key={stage} className="flex justify-center">
                <div
                  className={cn(
                    "w-9 h-9 rounded-full flex items-center justify-center border-4 border-white shadow-md",
                    i === CURRENT_STAGE_INDEX ? "bg-dark-brown scale-110" : "bg-white"
                  )}
                >
                  {i === CURRENT_STAGE_INDEX && (
                    <span className="w-2.5 h-2.5 rounded-full bg-white" aria-hidden="true" />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid mt-3" style={{ gridTemplateColumns: `repeat(${journeyStages.length}, 1fr)` }}>
          {journeyStages.map((stage, i) => (
            <p
              key={stage}
              className={cn(
                "text-center font-sans text-[11px] md:text-xs leading-tight px-1",
                i === CURRENT_STAGE_INDEX ? "text-dark-brown font-bold" : "text-brown/60"
              )}
            >
              {stage}
            </p>
          ))}
        </div>

        <p className="text-center font-sans text-sm text-brown/70 mt-10 max-w-xl mx-auto">
          Vocês estão prontos para dar o próximo passo. O Florescer a Dois é o empurrão que faltava.
        </p>
      </div>
    </section>
  );
}

/* ────────────────────────── 10. Preço ────────────────────────── */

function PricingSection() {
  return (
    <section className="py-20 px-6" style={{ background: "#EEE4F7" }}>
      <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center gap-10 lg:gap-14">
        <div className="shrink-0 w-full max-w-[220px] md:max-w-[240px]">
          <div className="relative w-full aspect-[3/4] drop-shadow-2xl rounded-2xl overflow-hidden rotate-[-3deg]">
            <Image
              src="/images/florescer-a-dois.png"
              alt="Florescer a Dois — Dra. Camilla Freitas"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 220px, 240px"
            />
          </div>
        </div>

        <div className="flex-1 text-center md:text-left w-full max-w-lg">
          <div className="inline-flex items-center gap-2 bg-white/60 border border-salmon/30 rounded-full px-4 py-1.5 mb-6">
            <span className="w-2 h-2 rounded-full bg-salmon animate-pulse shrink-0" aria-hidden="true" />
            <p className="font-sans text-xs font-bold text-salmon uppercase tracking-widest">
              As vagas para esse guia encerram em breve!
            </p>
          </div>

          <div className="bg-white/70 backdrop-blur-md rounded-3xl p-8 md:p-10 shadow-xl border border-white/60">
            <p className="font-sans text-lg text-gray-400 line-through">DE R$ 97,00</p>

            <p className="font-sans text-sm text-brown/60 font-medium mt-3 mb-1">2x de</p>
            <p className="font-['Georgia',serif] text-6xl font-bold text-salmon leading-none">R$ 28,95</p>

            <span className="inline-block font-sans text-xs font-bold text-success bg-success/10 border border-success/30 rounded-full px-3 py-1 mt-4">
              economize R$ 39,10
            </span>

            <p className="font-sans text-base font-bold text-brown mt-4 uppercase tracking-wide">
              ou R$ 57,90 à vista
            </p>
            <p className="font-sans text-brown/50 text-xs mt-2 mb-8">
              pagamento único · acesso imediato · sem mensalidade
            </p>

            <CheckoutCta label="Quero garantir minha vaga →" className="w-full justify-center text-base" />
          </div>
        </div>
      </div>
    </section>
  );
}

/* ────────────────────────── 11. Garantia ────────────────────────── */

function GuaranteeSection() {
  return (
    <section className="py-20 px-6 bg-white">
      <div className="max-w-2xl mx-auto text-center">
        <div
          className="w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg"
          style={{ background: "linear-gradient(145deg, #F0E6DC, #E8D0C0)" }}
          aria-hidden="true"
        >
          <span className="text-5xl">🏅</span>
        </div>

        <h2 className="font-['Georgia',serif] text-2xl md:text-3xl font-bold text-dark-brown mb-4 leading-snug">
          Garantia de 7 Dias — Sem Riscos
        </h2>

        <p className="font-sans text-gray-600 leading-relaxed max-w-lg mx-auto">
          Se nos primeiros <strong className="text-brown">7 dias</strong> vocês sentirem que o material não é
          para vocês, devolvemos 100% do valor investido. Sem perguntas, sem burocracia — o risco é nosso, o
          florescer é de vocês.
        </p>
      </div>
    </section>
  );
}

/* ────────────────────────── 12. FAQ ────────────────────────── */

function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="py-20 px-6 bg-cream">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="font-['Georgia',serif] text-3xl md:text-4xl font-bold text-dark-brown leading-snug">
            Perguntas frequentes
          </h2>
        </div>

        <div className="bg-white rounded-2xl border border-nude-dark/30 shadow-sm px-6 divide-y divide-nude-dark/30">
          {faqs.map((item, i) => {
            const isOpen = openIndex === i;
            return (
              <div key={item.question}>
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : i)}
                  aria-expanded={isOpen}
                  className="w-full flex items-center justify-between py-5 text-left gap-4 group cursor-pointer"
                >
                  <span className="font-sans font-semibold text-base text-dark-brown group-hover:text-salmon transition-colors">
                    {item.question}
                  </span>
                  <ChevronDown
                    className={cn(
                      "shrink-0 w-5 h-5 text-salmon transition-transform duration-300",
                      isOpen && "rotate-180"
                    )}
                    aria-hidden="true"
                  />
                </button>
                <div
                  className={cn(
                    "grid transition-all duration-300 ease-in-out",
                    isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                  )}
                >
                  <div className="overflow-hidden">
                    <p className="font-sans text-gray-600 leading-relaxed pb-5 pr-8">{item.answer}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ────────────────────────── 13. CTA final ────────────────────────── */

function FinalCtaSection() {
  return (
    <section
      className="py-24 px-6 text-center relative overflow-hidden"
      style={{ background: "linear-gradient(160deg, #4A2E26 0%, #6B4239 100%)" }}
    >
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute top-[-10%] right-[-5%] w-[30vw] h-[30vw] rounded-full bg-salmon/10 blur-3xl" />
        <div className="absolute bottom-[-10%] left-[-5%] w-[28vw] h-[28vw] rounded-full bg-nude/10 blur-3xl" />
      </div>

      <div className="relative z-10 max-w-2xl mx-auto space-y-7">
        <p className="font-sans text-xs font-semibold tracking-widest text-salmon uppercase">Chegou a hora</p>
        <h2 className="font-['Georgia',serif] text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight">
          Não percam mais um ciclo — esse pode ser o de vocês.
        </h2>
        <p className="font-sans text-nude/80 text-lg leading-relaxed max-w-xl mx-auto">
          Corpo, mente, suplementação e fé — tudo o que vocês precisam para caminhar juntos, de mãos dadas,
          rumo à gravidez.
        </p>

        <div className="pt-2">
          <CheckoutCta label="Quero o Florescer a Dois →" className="text-lg px-10 py-5" />
        </div>
      </div>
    </section>
  );
}

/* ────────────────────────── 14. Footer ────────────────────────── */

function FooterSection() {
  function handleBackToTop() {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <footer className="py-12 px-6 text-center" style={{ background: "#4A2E26" }}>
      <div className="max-w-2xl mx-auto space-y-5">
        <a
          href="https://wa.me/5581981396005"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 font-sans text-sm text-nude/80 hover:text-white transition-colors"
        >
          Central de atendimento: contato via WhatsApp +55 (81) 98139-6005
        </a>

        <p className="font-sans text-xs text-nude/50">
          Dra. Camilla Freitas • CRF/PE 4563 • Todos os direitos reservados
        </p>

        <a
          href="/privacidade"
          className="inline-block font-sans text-xs text-nude/60 hover:text-white underline underline-offset-4 transition-colors"
        >
          Política de Privacidade
        </a>

        <div>
          <button
            type="button"
            onClick={handleBackToTop}
            className="inline-flex items-center gap-1.5 font-sans text-xs font-semibold text-white/80 border border-white/20 rounded-full px-4 py-2 hover:bg-white/10 transition-colors"
          >
            Voltar ao topo
          </button>
        </div>
      </div>
    </footer>
  );
}
