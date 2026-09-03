"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import Image from "next/image";
import { ChevronDown, Check, Stethoscope, Salad, Heart, Leaf, ListChecks } from "lucide-react";
import { trackConversionEvent } from "@/lib/meta-conversions";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/design-system/button";

const CHECKOUT_URL = "https://pay.hotmart.com/D106943069P";
const PRICE_VALUE = 57.9;
const PRODUCT_NAME = "Florescer a Dois";

const NAVY = "#1a3a5c";

const heroMosaicPhotos = [
  "/images/casal-1.jpg",
  "/images/casal-2.jpg",
  "/images/casal-3.jpg",
  "/images/casal-4.jpg",
  "/images/casal-5.jpg",
] as const;

const heroVideoEmbeds = [
  { src: "https://www.youtube.com/embed/Xjt5GmfbWNs", title: "Depoimento em vídeo 1", aspectClass: "aspect-[9/16]" },
  { src: "https://www.youtube.com/embed/nH7qzyK77qw", title: "Depoimento em vídeo 2", aspectClass: "aspect-[9/16]" },
  { src: "https://www.youtube.com/embed/ToAvtA1b528", title: "Depoimento em vídeo 3", aspectClass: "aspect-video" },
] as const;

const reflectionQuestions = [
  "Vocês percebem que todo esse esforço está os aproximando da gravidez?",
  "Estão obtendo os resultados que almejam?",
  "Estão mais perto de realizar o sonho de ter um bebê?",
] as const;

const testimonialsB = [
  {
    names: "Ana e Pedro",
    age: 34,
    time: "2 anos tentando",
    photo: "/images/casal-1.jpg",
    message:
      "O Florescer a Dois mudou completamente nossa jornada com a Dra. Camilla. Hoje estamos grávidos e gratos por cada orientação.",
  },
  {
    names: "Carla e Rodrigo",
    age: 31,
    time: "1 ano e meio tentando",
    photo: "/images/casal-2.jpg",
    message:
      "Com o acompanhamento da Dra. Camilla, entendemos exatamente o que faltava. O guia é claro, acolhedor e direto ao ponto.",
  },
  {
    names: "Bianca e Thiago",
    age: 29,
    time: "8 meses tentando",
    photo: "/images/casal-3.jpg",
    message:
      "A Dra. Camilla nos ajudou a unir ciência e fé nessa caminhada. Recomendamos o Florescer a Dois de olhos fechados.",
  },
] as const;

const pillars = [
  {
    icon: Stethoscope,
    title: "Conhecimento do Corpo",
    desc: "Entendam como o corpo de cada um funciona e o que investigar",
  },
  {
    icon: Salad,
    title: "Preparação Conjunta",
    desc: "Alimentação, suplementação e equilíbrio físico e mental juntos",
  },
  {
    icon: Heart,
    title: "Conexão e Fé",
    desc: "Revitalizem a intimidade e fortaleçam a espiritualidade do casal",
  },
] as const;

const bonuses = [
  {
    badge: "BÔNUS 1",
    icon: Leaf,
    title: "Pack de Infusões de Chás para Fertilidade",
    desc: "Infusões utilizadas nos protocolos da Dra. Camilla",
    oldPrice: "R$47,00",
  },
  {
    badge: "BÔNUS 2",
    icon: ListChecks,
    title: "Checklist dos Próximos Passos",
    desc: null,
    oldPrice: "R$27,00",
  },
  {
    badge: "BÔNUS 3",
    icon: Heart,
    title: "Devocional de Fé e Fertilidade",
    desc: null,
    oldPrice: "R$17,00",
  },
] as const;

const includedItemsB = [
  "9 capítulos completos",
  "Guia de exames dela e dele",
  "Protocolo anti-inflamatório",
  "3 bônus exclusivos",
  "Acesso imediato",
] as const;

const paymentBadges = ["VISA", "Mastercard", "Hotmart"] as const;

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

export function CasalGm1Content() {
  return (
    <div className="overflow-x-hidden bg-white">
      <HeroSection />
      <FadeInSection>
        <ReflectionSection />
      </FadeInSection>
      <FadeInSection>
        <AboutSection />
      </FadeInSection>
      <FadeInSection>
        <TestimonialsCardsSection />
      </FadeInSection>
      <FadeInSection>
        <PillarsSection />
      </FadeInSection>
      <FadeInSection>
        <BonusesSection />
      </FadeInSection>
      <FadeInSection>
        <PricingCardSection />
      </FadeInSection>
      <FadeInSection>
        <GuaranteeSection />
      </FadeInSection>
      <FadeInSection>
        <FaqSection />
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
        "bg-gradient-to-r from-salmon to-brown text-white hover:opacity-90 transition-all duration-200 hover:-translate-y-0.5 inline-flex",
        className
      )}
    >
      {label}
    </a>
  );
}

/* ─────────────────────────────── 1. Hero ─────────────────────────────── */

function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-white">
      <div className="absolute inset-0 grid grid-cols-5 pointer-events-none" aria-hidden="true">
        {heroMosaicPhotos.map((src) => (
          <div key={src} className="relative">
            <Image src={src} alt="" fill className="object-cover" sizes="20vw" />
          </div>
        ))}
      </div>
      <div className="absolute inset-0 bg-white/85 pointer-events-none" aria-hidden="true" />

      <div className="relative z-10 max-w-3xl mx-auto px-6 pt-12 pb-16 flex flex-col items-center gap-6 text-center">
        <p className="font-['Georgia',serif] italic text-base font-bold" style={{ color: NAVY }}>
          Gerando Milagres
        </p>

        <h1
          className="font-['Georgia',serif] text-3xl sm:text-4xl md:text-5xl font-bold leading-tight"
          style={{ color: NAVY }}
        >
          Transforme o sonho de vocês em realidade
        </h1>

        <p className="font-sans text-base sm:text-lg text-gray-600 max-w-xl">
          Descubra os pilares essenciais para vocês conquistarem a gravidez que sempre desejaram
        </p>

        <div className="w-full max-w-2xl grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
          {heroVideoEmbeds.map((video, index) => (
            <div
              key={video.src}
              className={cn(
                "relative rounded-2xl overflow-hidden shadow-md",
                video.aspectClass,
                index === 2 && "sm:col-span-2 sm:max-w-md sm:mx-auto sm:w-full"
              )}
            >
              <iframe
                src={video.src}
                title={video.title}
                className="absolute inset-0 w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          ))}
        </div>

        <CheckoutCta label="Quero o Florescer a Dois →" className="text-base md:text-lg px-8 py-4 mt-2" />
      </div>
    </section>
  );
}

/* ─────────────────────────────── 2. Reflexão ─────────────────────────────── */

function ReflectionSection() {
  return (
    <section className="py-20 px-6 bg-white">
      <div className="max-w-4xl mx-auto">
        <p className="font-sans text-xs font-semibold tracking-widest text-salmon uppercase mb-8 text-center md:text-left">
          Agora, pare um momento para refletir...
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-14">
          <div>
            <h2
              className="font-['Georgia',serif] text-2xl md:text-3xl font-bold leading-snug mb-4"
              style={{ color: NAVY }}
            >
              A jornada de vocês está chegando mais perto do positivo?
            </h2>
            <p className="font-sans text-gray-600 leading-relaxed">
              Quanto tempo vocês já dedicaram a tentativas e enfrentaram obstáculos no caminho para realizar o
              sonho de ser pais?
            </p>
          </div>

          <div className="space-y-5">
            {reflectionQuestions.map((question) => (
              <p key={question} className="border-l-4 border-salmon pl-4 py-1 font-sans text-gray-700 leading-snug">
                {question}
              </p>
            ))}
          </div>
        </div>

        <div className="mt-14 rounded-2xl px-6 py-8 md:px-10 md:py-10 text-center" style={{ background: "#9C5B4E" }}>
          <p className="font-['Georgia',serif] text-xl md:text-2xl font-bold text-white leading-snug max-w-2xl mx-auto mb-6">
            Se as respostas forem &ldquo;sim&rdquo; ou &ldquo;queremos muito isso&rdquo;, então a Dra. Camilla está
            aqui para ajudar vocês!
          </p>
          <CheckoutCta
            label="Quero o Florescer a Dois →"
            className="bg-none bg-white text-[#9C5B4E] hover:bg-white/90 text-base px-8 py-4"
          />
        </div>
      </div>
    </section>
  );
}

/* ────────────────────────── 3. Sobre a Dra. Camilla ────────────────────────── */

function AboutSection() {
  return (
    <section className="py-20 px-6 bg-[#F8F8F8]">
      <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center gap-10 md:gap-14">
        <div
          className="shrink-0 relative w-56 h-56 md:w-64 md:h-64 rounded-full p-3"
          style={{ background: "linear-gradient(160deg, #F0E6DC, #E8D0C0)" }}
        >
          <div className="relative w-full h-full rounded-full overflow-hidden shadow-xl">
            <Image
              src="/images/camilla-zap2.jpg"
              alt="Dra. Camilla Freitas"
              fill
              className="object-cover object-top"
              sizes="256px"
            />
          </div>
        </div>

        <div className="flex-1 text-center md:text-left">
          <h2
            className="font-['Georgia',serif] text-2xl md:text-3xl font-bold leading-snug mb-4"
            style={{ color: NAVY }}
          >
            Por que ela pode ajudar vocês nessa jornada?
          </h2>
          <p className="font-sans text-gray-600 leading-relaxed mb-6">
            Farmacêutica especialista em fertilidade natural (CRF/PE 4563), a Dra. Camilla criou o Florescer a
            Dois para casais que querem preparar o corpo com consciência, ciência e fé antes de gerar uma nova
            vida. Já ajudou mais de 500 casais nessa jornada.
          </p>

          <div className="mb-6">
            <p className="font-['Georgia',serif] text-4xl md:text-5xl font-bold text-salmon leading-none">
              +<AnimatedCounter target={500} />
            </p>
            <p className="font-sans text-sm font-semibold text-gray-500 uppercase tracking-wide mt-1">
              Casais ajudados
            </p>
          </div>

          <CheckoutCta label="Quero o Florescer a Dois →" className="text-base px-8 py-4" />
        </div>
      </div>
    </section>
  );
}

/* ────────────────────────── 4. Depoimentos em cards ────────────────────────── */

function TestimonialsCardsSection() {
  return (
    <section className="py-20 px-6 bg-white">
      <div className="max-w-5xl mx-auto">
        <h2
          className="font-['Georgia',serif] text-2xl md:text-3xl font-bold text-center leading-snug mb-12"
          style={{ color: NAVY }}
        >
          Histórias reais de casais que floresceram juntos
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonialsB.map(({ names, age, time, photo, message }) => (
            <div key={names} className="bg-[#F8F8F8] rounded-2xl p-6 shadow-sm">
              <div className="relative w-16 h-16 rounded-full overflow-hidden mx-auto mb-4">
                <Image src={photo} alt="Casal atendido pela Dra. Camilla" fill className="object-cover" sizes="64px" />
              </div>
              <p className="font-sans text-sm font-bold text-center" style={{ color: NAVY }}>
                {names}, {age} anos
              </p>
              <p className="font-sans text-xs text-salmon font-semibold text-center uppercase tracking-wide mb-3">
                {time}
              </p>
              <p className="font-['Georgia',serif] italic text-gray-600 text-sm leading-relaxed text-center">
                &ldquo;{message}&rdquo;
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ────────────────────────── 5. Os 3 pilares ────────────────────────── */

function PillarsSection() {
  return (
    <section className="py-20 px-6 bg-white">
      <div className="max-w-5xl mx-auto">
        <h2
          className="font-['Georgia',serif] text-2xl md:text-3xl font-bold text-center leading-snug mb-12 max-w-2xl mx-auto"
          style={{ color: NAVY }}
        >
          Com o Florescer a Dois vocês vão dominar os 3 pilares da fertilidade do casal
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {pillars.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="relative bg-[#F8F8F8] rounded-2xl p-7 pt-8 overflow-hidden">
              <div className="absolute top-0 inset-x-0 h-1.5 bg-salmon" aria-hidden="true" />
              <div className="w-12 h-12 rounded-full bg-salmon/15 flex items-center justify-center mb-4">
                <Icon className="w-6 h-6 text-salmon" aria-hidden="true" />
              </div>
              <h3 className="font-['Georgia',serif] text-lg font-bold mb-2" style={{ color: NAVY }}>
                {title}
              </h3>
              <p className="font-sans text-sm text-gray-600 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>

        <div className="text-center">
          <CheckoutCta label="Quero o Florescer a Dois →" className="text-base px-8 py-4" />
        </div>
      </div>
    </section>
  );
}

/* ────────────────────────── 6. Bônus ────────────────────────── */

function BonusesSection() {
  return (
    <section className="py-20 px-6 bg-[#F8F8F8]">
      <div className="max-w-5xl mx-auto">
        <h2
          className="font-['Georgia',serif] text-2xl md:text-3xl font-bold text-center leading-snug mb-12"
          style={{ color: NAVY }}
        >
          Recebam conteúdos elaborados pela Dra. Camilla, incluindo:
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {bonuses.map(({ badge, icon: Icon, title, desc, oldPrice }) => (
            <div key={badge} className="bg-green-50 border border-green-100 rounded-2xl p-6 text-center">
              <span className="inline-block font-sans text-[11px] font-bold text-white bg-salmon rounded-full px-3 py-1 uppercase tracking-widest mb-4">
                {badge}
              </span>
              <div className="w-16 h-16 rounded-2xl bg-green-100 flex items-center justify-center mx-auto mb-4">
                <Icon className="w-8 h-8 text-green-700" aria-hidden="true" />
              </div>
              <h3 className="font-['Georgia',serif] text-base font-bold mb-2" style={{ color: NAVY }}>
                {title}
              </h3>
              {desc && <p className="font-sans text-xs text-gray-600 leading-relaxed mb-3">{desc}</p>}
              <p className="font-sans text-sm">
                <span className="text-gray-400 line-through">De {oldPrice}</span>{" "}
                <span className="text-salmon font-bold">por GRÁTIS</span>
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ────────────────────────── 7. Card de preço "Seu Positivo" ────────────────────────── */

function PricingCardSection() {
  return (
    <section className="py-20 px-6 bg-white">
      <div className="max-w-4xl mx-auto">
        <div
          className="bg-white shadow-xl border border-gray-100 p-6 md:p-10 flex flex-col md:flex-row gap-10 md:gap-14"
          style={{ borderRadius: "20px" }}
        >
          <div className="md:w-2/5 shrink-0">
            <div className="relative w-full max-w-[220px] mx-auto aspect-[2/3] rounded-xl overflow-hidden shadow-md mb-6">
              <Image
                src="/images/florescer-a-dois.png"
                alt="Florescer a Dois — Dra. Camilla Freitas"
                fill
                className="object-cover"
                sizes="220px"
              />
            </div>
            <ul className="space-y-3">
              {includedItemsB.map((item) => (
                <li key={item} className="flex items-center gap-2.5 font-sans text-sm text-gray-700">
                  <Check className="w-4 h-4 text-salmon shrink-0" aria-hidden="true" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="flex-1 text-center md:text-left">
            <p className="font-sans text-sm text-gray-400">
              De: <span className="line-through">R$242,00</span>
            </p>
            <p className="font-sans text-sm text-gray-500 font-medium mt-3">Por 2x de</p>
            <p className="font-['Georgia',serif] text-5xl md:text-6xl font-bold text-salmon leading-none">
              R$28,95
            </p>
            <p className="font-sans text-sm text-gray-500 mt-2 mb-8">ou R$57,90 à vista</p>

            <CheckoutCta
              label="QUERO O FLORESCER A DOIS →"
              className="w-full md:w-auto justify-center text-base px-10 py-4"
            />

            <div className="mt-8 flex flex-wrap items-center justify-center md:justify-start gap-x-4 gap-y-2">
              <span className="font-sans text-xs text-gray-500 inline-flex items-center gap-1.5">
                <span aria-hidden="true">🔒</span> Compra Segura
              </span>
              <span className="font-sans text-xs text-gray-500 inline-flex items-center gap-1.5">
                <span aria-hidden="true">🏅</span> Satisfação Garantida
              </span>
              <span className="font-sans text-xs text-gray-500 inline-flex items-center gap-1.5">
                <span aria-hidden="true">🔐</span> Privacidade Protegida
              </span>
            </div>
            <div className="mt-3 flex flex-wrap items-center justify-center md:justify-start gap-2">
              {paymentBadges.map((brand) => (
                <span
                  key={brand}
                  className="font-sans text-[11px] font-bold text-gray-400 border border-gray-200 rounded px-2 py-1"
                >
                  {brand}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ────────────────────────── 8. Garantia ────────────────────────── */

function GuaranteeSection() {
  return (
    <section className="py-20 px-6 bg-white">
      <div className="max-w-2xl mx-auto text-center">
        <div
          className="w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg bg-[#F8F8F8]"
          aria-hidden="true"
        >
          <span className="text-5xl">🏅</span>
        </div>

        <h2 className="font-['Georgia',serif] text-2xl md:text-3xl font-bold mb-4 leading-snug" style={{ color: NAVY }}>
          Garantia de 7 Dias — Sem Riscos
        </h2>

        <p className="font-sans text-gray-600 leading-relaxed max-w-lg mx-auto">
          Se nos primeiros <strong style={{ color: NAVY }}>7 dias</strong> vocês sentirem que o material não é
          para vocês, devolvemos 100% do valor investido. Sem perguntas, sem burocracia — o risco é nosso, o
          florescer é de vocês.
        </p>
      </div>
    </section>
  );
}

/* ────────────────────────── 9. FAQ ────────────────────────── */

function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="py-20 px-6 bg-[#F8F8F8]">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="font-['Georgia',serif] text-2xl md:text-3xl font-bold leading-snug" style={{ color: NAVY }}>
            Perguntas frequentes
          </h2>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm px-6 divide-y divide-gray-200">
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
                  <span
                    className="font-sans font-semibold text-base group-hover:text-salmon transition-colors"
                    style={{ color: NAVY }}
                  >
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

/* ────────────────────────── 10. Footer ────────────────────────── */

function FooterSection() {
  return (
    <footer className="py-10 px-6 text-center bg-white border-t border-gray-100">
      <p className="font-sans text-xs text-gray-500">
        Todos os direitos reservados © Gerando Milagres 2026 · Dra. Camilla Freitas · CRF/PE 4563
      </p>
    </footer>
  );
}
