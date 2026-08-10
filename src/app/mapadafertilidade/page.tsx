import type { Metadata } from "next";
import Image from "next/image";
import {
  CheckCircle2,
  Sparkles,
  Lock,
  FileText,
  Search,
  Map,
  Salad,
  FlaskConical,
  ClipboardList,
  BookHeart,
} from "lucide-react";
import { StickyHeaderCheckout } from "@/components/ui/sticky-header-checkout";
import { FadeInSection } from "@/components/marketing/fade-in-section";
import { Ticker } from "@/components/marketing/ticker";
import { CheckoutCta } from "@/components/marketing/checkout-cta";
import { TestimonialsGrid } from "@/components/marketing/testimonials-grid";
import { FaqAccordion } from "@/components/marketing/faq-accordion";
import { GuaranteeSection } from "@/components/marketing/guarantee-section";
import { PremiumFooter } from "@/components/marketing/premium-footer";

const CHECKOUT_URL = "https://pay.kiwify.com.br/5IIyMsr";
const PRICE_VALUE = 197;
const PRODUCT_NAME = "Mapa da Fertilidade";

export const metadata: Metadata = {
  title: "Mapa da Fertilidade — Dra. Camilla Freitas",
  description:
    "Descubra o que está impedindo a sua gravidez. O Mapa da Fertilidade é um guia completo com 6 módulos, diagnóstico personalizado e plano de ação para os próximos 30 dias.",
  robots: { index: false, follow: false },
};

const painPoints = [
  "Está tentando engravidar e só recebe testes negativos",
  "Fez exames e ouviu que “está tudo normal”",
  "Já gastou com suplementos, chás e tratamentos sem resultado",
  "Sente que está perdendo tempo e tem medo da idade",
  "Não sabe o que realmente está impedindo a gravidez",
  "Quer respostas. Quer um plano. Quer clareza.",
] as const;

const modules = [
  {
    number: "01",
    icon: Search,
    title: "Raio-X da Sua Fertilidade",
    desc: "Questionário completo com pontuação e relatório do seu nível de preparação. Você sai sabendo exatamente onde está e o que precisa de atenção.",
  },
  {
    number: "02",
    icon: ClipboardList,
    title: "Os 10 Bloqueios Mais Comuns da Fertilidade",
    desc: "Ovulação inadequada, resistência à insulina, inflamação silenciosa, SOP, endometriose, miomas, deficiências nutricionais, tireoide, fase lútea curta e fator masculino.",
  },
  {
    number: "03",
    icon: FlaskConical,
    title: "Exames que Ninguém Te Explica",
    desc: "AMH, progesterona, FSH, vitamina D, ferritina e muito mais — com o PDF exclusivo Lista de Exames da Tentante para levar à sua consulta.",
  },
  {
    number: "04",
    icon: Salad,
    title: "Plano de Desinflamação em 21 Dias",
    desc: "Alimentação, sono, saúde intestinal, manejo do estresse e checklist diário para criar o ambiente interno favorável à fertilidade.",
  },
  {
    number: "05",
    icon: BookHeart,
    title: "Fertilidade Masculina",
    desc: "Como interpretar o espermograma, fragmentação de DNA, hábitos que afetam a qualidade dos espermatozoides e o que pedir ao urologista.",
  },
  {
    number: "06",
    icon: Map,
    title: "Meu Mapa da Fertilidade",
    desc: "Plano de ação personalizado para os próximos 30 dias — com o passo a passo do que fazer, na ordem certa, baseado no seu raio-X.",
  },
] as const;

const bonuses = [
  { icon: FileText, title: "Planner da Tentante" },
  { icon: BookHeart, title: "Diário da Ovulação" },
  { icon: CheckCircle2, title: "Checklist dos Exames" },
  { icon: Salad, title: "Guia de Alimentação para Fertilidade" },
  { icon: FlaskConical, title: "Guia dos Nutrientes Mais Importantes" },
  { icon: Search, title: "Checklist dos Sinais que Merecem Investigação" },
] as const;

const testimonials = [
  {
    names: "Débora Nunes",
    city: "Natal, RN",
    message:
      "O Raio-X foi um choque de realidade bom. Descobri bloqueios que nenhum exame convencional tinha apontado. A Dra. Camilla explica tudo com uma clareza incrível.",
  },
  {
    names: "Larissa Campos",
    city: "Maceió, AL",
    message:
      "Depois de 2 anos tentando sem direção, o Mapa me deu um plano real de 30 dias. Finalmente sabia por onde começar.",
  },
  {
    names: "Vanessa Rocha",
    city: "Aracaju, SE",
    message:
      "A lista de exames sozinha já valeu o investimento. Levei para minha médica e ela ficou impressionada com o nível de detalhe dos materiais da Dra. Camilla.",
  },
  {
    names: "Tatiane Souza",
    city: "Teresina, PI",
    message:
      "Os bônus são um presente à parte — uso o Planner da Tentante todos os dias. Me sinto muito mais no controle da minha jornada.",
  },
] as const;

const faqs = [
  {
    question: "O Mapa da Fertilidade é para mim se eu estou no começo das tentativas?",
    answer:
      "Sim. Começar com clareza é muito mais eficiente do que tentar sem direção. O Mapa te dá um raio-X do seu ponto de partida e um plano de ação para os primeiros 30 dias — independente de há quanto tempo você está tentando.",
  },
  {
    question: "Preciso ter diagnóstico de SOP, endometriose ou outro problema para aproveitar?",
    answer:
      "Não. O conteúdo foi desenvolvido tanto para quem tem diagnóstico quanto para quem ouviu que está tudo normal e ainda não conseguiu engravidar. Muitos bloqueios à fertilidade não aparecem em exames convencionais — e é exatamente isso que o Mapa investiga.",
  },
  {
    question: "Em quanto tempo terei acesso após a compra?",
    answer:
      "O acesso é imediato. Assim que o pagamento for confirmado você recebe o link direto para o material completo.",
  },
  {
    question: "O Mapa da Fertilidade substitui acompanhamento médico?",
    answer:
      "Não. O Mapa é um material educativo que te ajuda a entender o próprio corpo, identificar possíveis bloqueios e chegar às suas consultas com perguntas melhores. Ele complementa — não substitui — o acompanhamento do seu médico ou especialista.",
  },
  {
    question: "Como funciona a garantia?",
    answer:
      "Você tem 7 dias de garantia incondicional. Se por qualquer motivo sentir que o material não é para você, basta enviar um e-mail dentro desse prazo e devolvemos 100% do valor. Sem perguntas.",
  },
] as const;

export default function MapaDaFertilidadePage() {
  return (
    <div className="overflow-x-hidden">
      <StickyHeaderCheckout checkoutUrl={CHECKOUT_URL} eventValue={PRICE_VALUE} />

      {/* ─── HERO ───────────────────────────────────────────────────── */}
      <section
        className="relative overflow-hidden"
        style={{ background: "linear-gradient(160deg, #4A2E26 0%, #6B4239 60%, #8B5E52 100%)" }}
      >
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
          <div className="absolute top-[-10%] right-[-8%] w-[40vw] h-[40vw] rounded-full bg-salmon/10 blur-3xl" />
          <div className="absolute bottom-[-8%] left-[-6%] w-[32vw] h-[32vw] rounded-full bg-nude/10 blur-3xl" />
        </div>

        <div className="relative z-10 w-full max-w-6xl mx-auto px-6 py-16 md:py-24 flex flex-col md:flex-row items-center gap-12">
          <div className="flex-1 text-center md:text-left space-y-7 order-2 md:order-1">
            <div className="flex items-center gap-3 justify-center md:justify-start">
              <div className="relative w-9 h-9 rounded-full overflow-hidden shrink-0 ring-2 ring-salmon/40">
                <Image
                  src="/images/camilla-zap.jpg"
                  alt="Dra. Camilla Freitas"
                  fill
                  className="object-cover object-top"
                  sizes="36px"
                />
              </div>
              <span className="font-sans text-xs font-semibold tracking-widest text-salmon uppercase">
                Dra. Camilla Freitas · CRF/PE 4563
              </span>
            </div>

            <div>
              <p className="font-sans text-nude/70 text-sm font-semibold tracking-widest uppercase mb-3">
                Apresenta
              </p>
              <h1 className="font-['Georgia',serif] text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-none tracking-tight">
                MAPA DA
                <br />
                <span className="text-salmon">FERTILIDADE</span>
              </h1>
            </div>

            <p className="font-sans text-lg md:text-xl text-nude/90 leading-relaxed md:max-w-xl">
              Você não precisa de mais uma tentativa. Você precisa descobrir
              o que está impedindo as tentativas de funcionarem.
            </p>

            <div className="space-y-3">
              <CheckoutCta
                href={CHECKOUT_URL}
                value={PRICE_VALUE}
                productName={PRODUCT_NAME}
                label="Quero o meu Mapa agora →"
                className="text-base md:text-lg px-8 py-4"
              />
              <div className="flex items-center gap-2 justify-center md:justify-start">
                <Lock className="w-3.5 h-3.5 text-nude/50" aria-hidden="true" />
                <p className="font-sans text-xs text-nude/60">
                  R$&nbsp;197 à vista · ou 10x de R$&nbsp;23,68 · Acesso imediato
                </p>
              </div>
            </div>
          </div>

          <div className="order-1 md:order-2 shrink-0 w-full max-w-[300px] md:max-w-[360px] lg:max-w-[420px]">
            <div className="relative w-full aspect-square drop-shadow-2xl">
              <Image
                src="/images/mapa-fertilidade-produto.png"
                alt="Mapa da Fertilidade — Dra. Camilla Freitas"
                fill
                className="object-contain"
                sizes="(max-width: 768px) 300px, (max-width: 1024px) 360px, 420px"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      <Ticker text="MAPA DA FERTILIDADE • DRA. CAMILLA FREITAS CRF/PE 4563 •" />

      {/* ─── IDENTIFICAÇÃO / DOR ────────────────────────────────────── */}
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

            <ul className="space-y-4 mb-12">
              {painPoints.map((point) => (
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

            <div className="rounded-3xl border-l-4 border-salmon bg-cream px-7 py-7 space-y-3">
              <p className="font-sans text-xs font-semibold tracking-widest text-salmon uppercase">
                Uma verdade que ninguém te contou
              </p>
              <p className="font-['Georgia',serif] italic text-xl md:text-2xl text-dark-brown leading-relaxed">
                Exames normais nem sempre significam fertilidade ideal. Talvez
                exista algo que ninguém investigou ainda.
              </p>
              <p className="font-sans text-brown/80 text-base leading-relaxed">
                Você não precisa continuar tentando no escuro. Você precisa de
                um mapa — e é exatamente isso que este material entrega.
              </p>
            </div>
          </div>
        </section>
      </FadeInSection>

      {/* ─── MÓDULOS ────────────────────────────────────────────────── */}
      <FadeInSection>
        <section className="py-20 px-6 bg-cream">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-14">
              <p className="font-sans text-xs font-semibold tracking-widest text-salmon uppercase mb-4">
                O que está incluso
              </p>
              <h2 className="font-['Georgia',serif] text-3xl md:text-4xl font-bold text-dark-brown leading-snug">
                6 módulos completos para você{" "}
                <em className="not-italic text-salmon">sair do escuro</em>
              </h2>
            </div>

            <div className="space-y-4">
              {modules.map(({ number, icon: Icon, title, desc }) => (
                <div
                  key={number}
                  className="bg-white rounded-2xl p-6 flex items-start gap-5 shadow-sm border border-nude-dark/30 transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5"
                >
                  <div className="shrink-0 flex flex-col items-center gap-1.5">
                    <span className="font-['Georgia',serif] text-2xl font-bold text-salmon leading-none">
                      {number}
                    </span>
                    <div className="w-8 h-8 rounded-full bg-salmon/10 flex items-center justify-center">
                      <Icon className="w-4 h-4 text-salmon" aria-hidden="true" />
                    </div>
                  </div>
                  <div>
                    <p className="font-sans font-bold text-dark-brown text-base mb-1">{title}</p>
                    <p className="font-sans text-gray-500 text-sm leading-relaxed">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </FadeInSection>

      {/* ─── BÔNUS ─────────────────────────────────────────────────── */}
      <FadeInSection>
        <section className="py-20 px-6" style={{ background: "linear-gradient(160deg, #4A2E26 0%, #6B4239 100%)" }}>
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <p className="font-sans text-xs font-semibold tracking-widest text-salmon uppercase mb-4">
                Bônus incluídos
              </p>
              <h2 className="font-['Georgia',serif] text-3xl md:text-4xl font-bold text-white leading-snug">
                Tudo que você recebe além dos 6 módulos
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {bonuses.map(({ icon: Icon, title }) => (
                <div
                  key={title}
                  className="bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl p-5 flex items-start gap-4 transition-colors duration-300 hover:bg-white/15"
                >
                  <div className="w-9 h-9 rounded-full bg-salmon/20 flex items-center justify-center shrink-0">
                    <Icon className="w-4 h-4 text-salmon" aria-hidden="true" />
                  </div>
                  <div>
                    <p className="font-sans font-semibold text-white text-sm leading-snug">{title}</p>
                    <p className="font-sans text-nude/50 text-xs mt-0.5">Incluso sem custo adicional</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-12 text-center">
              <CheckoutCta
                href={CHECKOUT_URL}
                value={PRICE_VALUE}
                productName={PRODUCT_NAME}
                label="Quero o Mapa + todos os bônus →"
                className="text-base md:text-lg px-8 py-4"
              />
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
                Quem já encontrou o próprio Mapa
              </h2>
              <p className="font-sans text-xs text-gray-500 mt-3">*Depoimentos ilustrativos</p>
            </div>
            <TestimonialsGrid testimonials={testimonials} />
          </div>
        </section>
      </FadeInSection>

      {/* ─── DRA. CAMILLA ───────────────────────────────────────────── */}
      <FadeInSection>
        <section className="py-20 px-6 bg-white">
          <div className="max-w-4xl mx-auto flex flex-col md:flex-row gap-10 lg:gap-16 items-center">
            <div className="w-full md:w-[280px] lg:w-[320px] shrink-0">
              <div className="relative w-full aspect-[3/4] rounded-3xl overflow-hidden shadow-xl">
                <Image
                  src="/images/camilla-zap.jpg"
                  alt="Dra. Camilla Freitas, farmacêutica especialista em fertilidade"
                  fill
                  className="object-cover object-top"
                  sizes="(max-width: 768px) 100vw, 320px"
                />
              </div>
            </div>

            <div className="flex-1 space-y-6 text-center md:text-left">
              <div>
                <p className="font-sans text-xs font-semibold tracking-widest text-salmon uppercase mb-4">
                  Quem criou este material
                </p>
                <h2 className="font-['Georgia',serif] text-3xl md:text-4xl font-bold text-dark-brown leading-snug">
                  Dra. Camilla Freitas
                </h2>
              </div>
              <p className="font-['Georgia',serif] italic text-base md:text-lg text-gray-700 leading-relaxed">
                Sou farmacêutica especializada em saúde feminina e fertilidade
                natural. O que percebi é que a maioria das mulheres tinha
                informação de sobra — mas não tinha um mapa. O Mapa da
                Fertilidade nasceu dessa necessidade.
              </p>
              <div className="border-l-4 border-salmon pl-5 py-1 space-y-1 text-left">
                <p className="font-sans font-semibold text-brown">Camilla Freitas</p>
                <p className="font-sans text-xs font-semibold tracking-wide text-salmon uppercase">
                  Farmacêutica · CRF/PE 4563
                </p>
              </div>
            </div>
          </div>
        </section>
      </FadeInSection>

      {/* ─── PREÇO ─────────────────────────────────────────────────── */}
      <FadeInSection>
        <section className="py-20 px-6 bg-cream">
          <div className="max-w-lg mx-auto text-center">
            <p className="font-sans text-xs font-semibold tracking-widest text-salmon uppercase mb-6">
              Investimento
            </p>
            <h2 className="font-['Georgia',serif] text-3xl md:text-4xl font-bold text-dark-brown mb-3 leading-snug">
              Clareza e direção pelo valor de uma fração de uma consulta.
            </h2>
            <p className="font-sans text-gray-500 text-sm mb-10">
              Uma consulta com especialista em fertilidade custa R$&nbsp;550.
              Com o Mapa, você chega à consulta já sabendo o que perguntar.
            </p>

            <div className="bg-white rounded-3xl p-8 md:p-10 shadow-xl border border-nude-dark/40">
              <p className="font-sans text-sm text-brown/60 font-medium mb-1">10x de</p>
              <p className="font-['Georgia',serif] text-6xl font-bold text-salmon leading-none mb-3">
                R$&nbsp;23,68
              </p>
              <p className="font-sans text-sm text-brown/60 font-medium mb-1">ou à vista</p>
              <p className="font-['Georgia',serif] text-2xl font-semibold text-brown/70 leading-none mb-1">
                R$&nbsp;197
              </p>
              <p className="font-sans text-brown/50 text-xs mt-3 mb-8">
                pagamento único · acesso imediato · sem mensalidade
              </p>

              <div className="flex items-center justify-center gap-2 mb-4">
                <Sparkles className="w-4 h-4 text-salmon" aria-hidden="true" />
                <p className="font-sans text-xs text-brown/60">6 módulos + 6 bônus · acesso imediato após confirmação</p>
              </div>

              <CheckoutCta
                href={CHECKOUT_URL}
                value={PRICE_VALUE}
                productName={PRODUCT_NAME}
                label="Quero o Mapa da Fertilidade →"
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
              Se nos primeiros <strong className="text-brown">7 dias</strong> você sentir
              que o material não é para você — devolvemos 100% do valor.{" "}
              <span className="font-semibold text-brown">Sem perguntas. Sem burocracia.</span>
            </>
          }
          quote="O risco é meu. A clareza é sua."
        />
      </FadeInSection>

      {/* ─── FAQ ────────────────────────────────────────────────────── */}
      <FadeInSection>
        <section className="py-20 px-6 bg-cream">
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-12">
              <p className="font-sans text-xs font-semibold tracking-widest text-salmon uppercase mb-4">
                Dúvidas frequentes
              </p>
              <h2 className="font-['Georgia',serif] text-3xl md:text-4xl font-bold text-dark-brown leading-snug">
                Perguntas que talvez você tenha
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
            <p className="font-sans text-xs font-semibold tracking-widest text-salmon uppercase">Chegou a hora</p>
            <h2 className="font-['Georgia',serif] text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight">
              Pare de tentar no escuro.
              <br />
              <em className="not-italic text-salmon">Peça o seu Mapa.</em>
            </h2>
            <p className="font-sans text-nude/80 text-lg leading-relaxed max-w-xl mx-auto">
              Clareza, direção e um plano de 30 dias — tudo que você precisa
              para entender o próprio corpo e dar o próximo passo com segurança.
            </p>

            <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-5 py-2">
              <span className="w-2 h-2 rounded-full bg-salmon animate-pulse shrink-0" aria-hidden="true" />
              <span className="font-sans text-xs font-semibold text-nude/80 uppercase tracking-widest">
                Acesso imediato após a confirmação
              </span>
            </div>

            <div className="pt-2 space-y-4">
              <CheckoutCta
                href={CHECKOUT_URL}
                value={PRICE_VALUE}
                productName={PRODUCT_NAME}
                label="Quero o Mapa da Fertilidade →"
                className="text-lg px-10 py-5"
              />
              <p className="font-sans text-xs text-nude/40">
                R$&nbsp;197 à vista · ou 10x de R$&nbsp;23,68 · Garantia de 7 dias · Pagamento seguro
              </p>
            </div>
          </div>
        </section>
      </FadeInSection>

      <PremiumFooter whatsappMessage="Olá! Tenho interesse no Mapa da Fertilidade da Dra. Camilla Freitas 🌸" />
    </div>
  );
}
