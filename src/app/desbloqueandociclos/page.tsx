import type { Metadata } from "next";
import Image from "next/image";
import { CheckCircle2, Lock, Sparkles } from "lucide-react";
import { StickyHeaderCheckout } from "@/components/ui/sticky-header-checkout";
import { FadeInSection } from "@/components/marketing/fade-in-section";
import { Ticker } from "@/components/marketing/ticker";
import { CheckoutCta } from "@/components/marketing/checkout-cta";
import { TestimonialsGrid } from "@/components/marketing/testimonials-grid";
import { FaqAccordion } from "@/components/marketing/faq-accordion";
import { GuaranteeSection } from "@/components/marketing/guarantee-section";
import { PremiumFooter } from "@/components/marketing/premium-footer";

const CHECKOUT_URL = "https://pay.kiwify.com.br/AQyRq5m";
const PRICE_VALUE = 67;
const PRODUCT_NAME = "Desbloqueando Ciclos";

export const metadata: Metadata = {
  title: "Desbloqueando Ciclos — Dra. Camilla Freitas",
  description:
    "Programa para mulheres que querem regularizar o ciclo menstrual e preparar o corpo para a fertilidade com ciência e cuidado.",
  robots: { index: false, follow: false },
};

const identification = [
  "Seu ciclo vem quando quer — e isso te deixa perdida sobre o que está acontecendo no seu corpo",
  "Já tentou de tudo para regularizar o ciclo e nada pareceu funcionar de verdade",
  "Sente que o seu corpo não coopera com você",
  "Tem dúvidas se o ciclo irregular está afetando suas chances de engravidar",
  "Quer entender o próprio corpo antes de continuar tentando no escuro",
] as const;

const included = [
  "Protocolo de regularização do ciclo em 30 dias",
  "Guia de alimentação anti-inflamatória",
  "Checklist dos sinais do seu ciclo",
  "Suplementação para equilíbrio hormonal",
  "Rotina de sono e manejo do estresse",
  "Devocional de acompanhamento diário",
  "Linguagem acessível e acolhedora",
  "Acesso imediato em PDF",
] as const;

const testimonials = [
  {
    names: "Priscila Andrade",
    city: "Campina Grande, PB",
    message:
      "Meu ciclo sempre foi uma incógnita. Com o protocolo da Dra. Camilla, em duas semanas já sentia diferença. Hoje entendo meu corpo de um jeito que nunca tinha entendido.",
  },
  {
    names: "Bruna Cavalcanti",
    city: "Caruaru, PE",
    message:
      "Eu não sabia nem quando esperar meu período. O guia da Dra. Camilla me deu clareza e um passo a passo real para seguir.",
  },
  {
    names: "Karla Menezes",
    city: "Petrolina, PE",
    message:
      "O checklist dos sinais do ciclo mudou minha relação com meu corpo. Recomendo demais para quem se sente perdida como eu me sentia.",
  },
  {
    names: "Talita Freire",
    city: "Vitória de Santo Antão, PE",
    message:
      "Simples, direto e acolhedor. A Dra. Camilla explica tudo de um jeito que qualquer mulher consegue entender e aplicar.",
  },
] as const;

const faqs = [
  {
    question: "O Desbloqueando Ciclos é para mim se meu ciclo é muito irregular?",
    answer:
      "Sim. O programa foi desenvolvido justamente para mulheres com ciclos irregulares que querem entender o próprio corpo e criar uma rotina que favoreça a regularização.",
  },
  {
    question: "É um curso ou um ebook?",
    answer:
      "É um guia digital em PDF com protocolo prático de 30 dias. Você acompanha no seu próprio ritmo, no celular ou computador.",
  },
  {
    question: "Como vou receber?",
    answer:
      "Assim que a compra for confirmada, você recebe acesso imediato ao material por e-mail, com link para download do PDF completo.",
  },
  {
    question: "Isso substitui acompanhamento médico?",
    answer:
      "Não. O material é educativo e te ajuda a entender melhor o seu ciclo, mas não substitui o acompanhamento do seu ginecologista ou especialista em fertilidade.",
  },
  {
    question: "Como funciona a garantia?",
    answer:
      "Você tem 7 dias de garantia incondicional. Se sentir que o material não é para você, basta enviar um e-mail dentro desse prazo e devolvemos 100% do valor.",
  },
] as const;

export default function DesbloqueandoCiclosPage() {
  return (
    <div className="overflow-x-hidden">
      <StickyHeaderCheckout checkoutUrl={CHECKOUT_URL} eventValue={PRICE_VALUE} />

      {/* ─── HERO ───────────────────────────────────────────────────── */}
      <section
        className="relative overflow-hidden"
        style={{ background: "linear-gradient(160deg, #F0E6DC 0%, #E8D0C0 55%, #F0E6DC 100%)" }}
      >
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
          <div className="absolute top-[-8%] right-[-6%] w-[36vw] h-[36vw] rounded-full bg-salmon/20 blur-3xl" />
          <div className="absolute bottom-[-6%] left-[-8%] w-[30vw] h-[30vw] rounded-full bg-nude/70 blur-3xl" />
        </div>

        <div className="relative z-10 w-full max-w-6xl mx-auto px-6 pt-16 pb-14 flex flex-col md:flex-row items-center gap-12">
          <div className="flex-1 text-center md:text-left space-y-6">
            <span className="inline-block font-sans text-xs font-semibold tracking-widest text-salmon uppercase">
              Dra. Camilla Freitas · CRF/PE 4563
            </span>

            <h1 className="font-['Georgia',serif] text-4xl md:text-5xl lg:text-6xl font-bold text-dark-brown leading-tight">
              DESBLOQUEANDO <span className="text-salmon">CICLOS</span>
            </h1>

            <p className="font-sans text-lg md:text-xl text-brown/80 leading-relaxed md:max-w-lg">
              Um programa para mulheres que querem regularizar o ciclo
              menstrual e preparar o corpo para a fertilidade — com
              protocolos científicos e suporte humano.
            </p>

            <div className="pt-2 flex flex-col sm:flex-row gap-3 items-center justify-center md:justify-start">
              <CheckoutCta
                href={CHECKOUT_URL}
                value={PRICE_VALUE}
                productName={PRODUCT_NAME}
                label="Quero desbloquear meu ciclo →"
              />
              <p className="font-sans text-xs text-brown/50">Garantia de 7 dias · Acesso imediato</p>
            </div>
          </div>

          <div className="hidden md:block relative w-[320px] lg:w-[380px] h-[440px] lg:h-[500px] rounded-3xl overflow-hidden shadow-2xl shrink-0">
            <Image
              src="/images/camilla-zap.jpg"
              alt="Dra. Camilla Freitas — especialista em fertilidade"
              fill
              className="object-cover object-top"
              sizes="(max-width: 1024px) 320px, 380px"
              priority
            />
          </div>
        </div>
      </section>

      <Ticker text="DESBLOQUEANDO CICLOS • DRA. CAMILLA FREITAS CRF/PE 4563 •" />

      {/* ─── IDENTIFICAÇÃO ─────────────────────────────────────────── */}
      <FadeInSection>
        <section className="py-20 px-6 bg-white">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12">
              <p className="font-sans text-xs font-semibold tracking-widest text-salmon uppercase mb-4">
                Isso é para você se…
              </p>
              <h2 className="font-['Georgia',serif] text-3xl md:text-4xl font-bold text-dark-brown leading-snug">
                Você reconhece alguma dessas situações?
              </h2>
            </div>

            <ul className="space-y-4">
              {identification.map((point) => (
                <li key={point} className="flex items-start gap-4 bg-cream rounded-2xl px-5 py-4">
                  <span
                    className="w-6 h-6 rounded-full bg-salmon/20 text-salmon font-bold text-sm flex items-center justify-center shrink-0 mt-0.5"
                    aria-hidden="true"
                  >
                    ✦
                  </span>
                  <p className="font-sans text-brown/90 leading-snug text-sm md:text-base">{point}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </FadeInSection>

      {/* ─── O QUE ESTÁ INCLUSO ────────────────────────────────────── */}
      <FadeInSection>
        <section className="py-20 px-6" style={{ background: "#4A2E26" }}>
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="font-['Georgia',serif] text-3xl md:text-4xl font-bold text-white leading-snug">
                O que está incluso
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {included.map((item) => (
                <div
                  key={item}
                  className="flex items-center gap-3 rounded-xl px-4 py-3.5 border border-white/15 backdrop-blur-sm bg-white/5 transition-colors hover:bg-white/10"
                >
                  <CheckCircle2 className="w-5 h-5 text-salmon shrink-0" aria-hidden="true" />
                  <p className="font-sans text-sm text-white/90">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </FadeInSection>

      {/* ─── DEPOIMENTOS ───────────────────────────────────────────── */}
      <FadeInSection>
        <section className="py-20 px-6 bg-nude">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12">
              <p className="font-sans text-xs font-semibold tracking-widest text-salmon uppercase mb-4">
                Depoimentos
              </p>
              <h2 className="font-['Georgia',serif] text-3xl md:text-4xl font-bold text-dark-brown leading-snug">
                Quem já desbloqueou o próprio ciclo
              </h2>
              <p className="font-sans text-xs text-gray-500 mt-3">*Depoimentos ilustrativos</p>
            </div>
            <TestimonialsGrid testimonials={testimonials} />
          </div>
        </section>
      </FadeInSection>

      {/* ─── PREÇO ─────────────────────────────────────────────────── */}
      <FadeInSection>
        <section className="py-20 px-6 bg-white">
          <div className="max-w-lg mx-auto text-center">
            <p className="font-sans text-xs font-semibold tracking-widest text-salmon uppercase mb-6">
              Investimento
            </p>
            <h2 className="font-['Georgia',serif] text-3xl md:text-4xl font-bold text-dark-brown mb-3 leading-snug">
              Entenda o seu ciclo pelo valor de um cafezinho por semana.
            </h2>

            <div className="bg-cream rounded-3xl p-8 md:p-10 shadow-xl border border-nude-dark/40 mt-8">
              <p className="font-sans text-sm text-brown/60 font-medium mb-1">2x de</p>
              <p className="font-['Georgia',serif] text-6xl font-bold text-salmon leading-none mb-3">
                R$&nbsp;33,50
              </p>
              <p className="font-sans text-sm text-brown/60 font-medium mb-1">ou à vista</p>
              <p className="font-['Georgia',serif] text-2xl font-semibold text-brown/70 leading-none mb-1">
                R$&nbsp;67
              </p>
              <p className="font-sans text-brown/50 text-xs mt-3 mb-8">
                pagamento único · acesso imediato · sem mensalidade
              </p>

              <div className="flex items-center justify-center gap-2 mb-4">
                <Sparkles className="w-4 h-4 text-salmon" aria-hidden="true" />
                <p className="font-sans text-xs text-brown/60">Acesso imediato após a confirmação</p>
              </div>

              <CheckoutCta
                href={CHECKOUT_URL}
                value={PRICE_VALUE}
                productName={PRODUCT_NAME}
                label="Quero desbloquear meu ciclo →"
                className="w-full justify-center text-base"
              />

              <div className="flex items-center justify-center gap-1.5 text-gray-400 mt-4">
                <Lock className="w-3.5 h-3.5" aria-hidden="true" />
                <span className="font-sans text-xs">Pagamento 100% seguro · SSL</span>
              </div>
            </div>
          </div>
        </section>
      </FadeInSection>

      {/* ─── GARANTIA ──────────────────────────────────────────────── */}
      <FadeInSection>
        <GuaranteeSection
          description={
            <>
              Se nos primeiros <strong className="text-brown">7 dias</strong> você
              sentir que o material não é para você — devolvemos 100% do valor.{" "}
              <span className="font-semibold text-brown">Sem perguntas. Sem burocracia.</span>
            </>
          }
          quote="O risco é meu. O ciclo é seu."
        />
      </FadeInSection>

      {/* ─── FAQ ───────────────────────────────────────────────────── */}
      <FadeInSection>
        <section className="py-20 px-6 bg-cream">
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-10">
              <h2 className="font-['Georgia',serif] text-3xl md:text-4xl font-bold text-dark-brown leading-snug">
                Perguntas frequentes
              </h2>
            </div>
            <FaqAccordion items={faqs} />
          </div>
        </section>
      </FadeInSection>

      {/* ─── CTA FINAL ─────────────────────────────────────────────── */}
      <FadeInSection>
        <section
          className="py-24 px-6 text-center relative overflow-hidden"
          style={{ background: "linear-gradient(160deg, #4A2E26 0%, #6B4239 100%)" }}
        >
          <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
            <div className="absolute top-[-10%] right-[-5%] w-[30vw] h-[30vw] rounded-full bg-salmon/10 blur-3xl" />
            <div className="absolute bottom-[-10%] left-[-5%] w-[28vw] h-[28vw] rounded-full bg-nude/10 blur-3xl" />
          </div>
          <div className="relative z-10 max-w-2xl mx-auto space-y-7">
            <p className="font-sans text-xs font-semibold tracking-widest text-salmon uppercase">
              Dra. Camilla Freitas ao seu lado
            </p>
            <h2 className="font-['Georgia',serif] text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight">
              Pare de tentar entender seu corpo sozinha.
              <br />
              <em className="not-italic text-salmon">Desbloqueie seu ciclo.</em>
            </h2>
            <p className="font-sans text-nude/80 text-lg leading-relaxed max-w-xl mx-auto">
              Um protocolo simples, científico e acolhedor para você entender
              o seu corpo e dar o próximo passo com clareza.
            </p>
            <div className="pt-2">
              <CheckoutCta
                href={CHECKOUT_URL}
                value={PRICE_VALUE}
                productName={PRODUCT_NAME}
                label="Quero desbloquear meu ciclo →"
                className="text-lg px-10 py-5"
              />
            </div>
            <p className="font-sans text-xs text-nude/40">
              Garantia de 7 dias · Acesso imediato · Pagamento seguro
            </p>
          </div>
        </section>
      </FadeInSection>

      <PremiumFooter whatsappMessage="Olá! Tenho interesse no Desbloqueando Ciclos da Dra. Camilla Freitas 🌸" />
    </div>
  );
}
