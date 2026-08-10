import type { Metadata } from "next";
import Image from "next/image";
import { CheckCircle2, Gift, Users, Sparkles } from "lucide-react";
import { StickyHeaderCheckout } from "@/components/ui/sticky-header-checkout";
import { FadeInSection } from "@/components/marketing/fade-in-section";
import { Ticker } from "@/components/marketing/ticker";
import { CheckoutCta } from "@/components/marketing/checkout-cta";
import { TestimonialsGrid } from "@/components/marketing/testimonials-grid";
import { FaqAccordion } from "@/components/marketing/faq-accordion";
import { GuaranteeSection } from "@/components/marketing/guarantee-section";
import { PremiumFooter } from "@/components/marketing/premium-footer";

const CHECKOUT_URL = "https://pay.kiwify.com.br/OCUj5sd";
const PRICE_VALUE = 35;
const PRODUCT_NAME = "Assinatura Gerando Milagres";

export const metadata: Metadata = {
  title: "Gerando Milagres — Você não precisa mais tentar sozinha",
  description:
    "Materiais e protocolos da Dra. Camilla Freitas sobre fertilidade, alimentação, suplementação e preparação do corpo para gestação saudável.",
  robots: { index: false, follow: false },
};

const problems = [
  "Consumindo conteúdo da internet sem saber o que realmente se aplica ao seu caso",
  "Com dúvidas sobre suplementação: o que tomar, quanto e quando",
  "Sem entender direito o que está acontecendo no seu ciclo a cada mês",
  "Ouvindo que “está tudo bem nos exames” mas ainda sem conseguir engravidar",
  "Com medo de estar perdendo tempo sem saber se está fazendo as coisas certas",
] as const;

const included = [
  "Material rico em informações e protocolos que a Dra. Camilla utiliza com suas pacientes",
  "Conteúdo atualizado regularmente com novos temas",
  "Orientações práticas e aplicáveis a partir do primeiro acesso",
  "Estratégias baseadas em literatura científica de fertilidade",
  "Acesso via plataforma exclusiva, disponível onde você estiver",
  "Protocolos para fertilidade, SOP, endometriose e miomas",
  "Guia completo de suplementação e alimentação fértil",
  "Grupo exclusivo no WhatsApp com outras mulheres na jornada",
] as const;

const testimonials = [
  {
    names: "Fernanda Lima",
    city: "Salvador, BA",
    message:
      "Assinei sem saber muito bem o que esperar. Hoje entendo meu ciclo de um jeito que nenhum médico tinha me explicado. A Dra. Camilla mudou minha relação com o meu corpo.",
  },
  {
    names: "Bianca Torres",
    city: "Recife, PE",
    message:
      "O grupo do WhatsApp foi o que mais me ajudou — não me senti mais sozinha nessa jornada. Os protocolos da Dra. Camilla são práticos e fáceis de seguir.",
  },
  {
    names: "Renata Alves",
    city: "Fortaleza, CE",
    message:
      "Tenho SOP e já tinha desistido de entender meus exames. Os materiais da Dra. Camilla me deram clareza que eu não tinha há anos.",
  },
  {
    names: "Patrícia Gomes",
    city: "João Pessoa, PB",
    message:
      "Content atualizado toda semana e sempre muito bem explicado. Sinto que finalmente tenho alguém especialista guiando cada passo.",
  },
] as const;

const faqs = [
  {
    question: "Como funciona a assinatura?",
    answer:
      "Você paga um valor mensal e tem acesso a todos os materiais e protocolos da Dra. Camilla, incluindo o grupo exclusivo no WhatsApp e o bônus de infusões de chás. Pode cancelar quando quiser.",
  },
  {
    question: "Preciso ter diagnóstico de SOP ou endometriose para participar?",
    answer:
      "Não. O conteúdo é para qualquer mulher tentando engravidar, com ou sem diagnóstico. Se você tem SOP, endometriose ou miomas, também há protocolos específicos para o seu caso.",
  },
  {
    question: "Em quanto tempo terei acesso após a compra?",
    answer:
      "O acesso é imediato. Assim que o pagamento for confirmado você recebe o link para a plataforma e o convite do grupo exclusivo no WhatsApp.",
  },
  {
    question: "Os materiais substituem o acompanhamento médico?",
    answer:
      "Não. Os materiais são educativos e te ajudam a entender melhor o seu corpo e a chegar mais preparada às consultas — mas não substituem o acompanhamento do seu médico ou especialista.",
  },
  {
    question: "Como funciona a garantia?",
    answer:
      "Você tem 7 dias de garantia incondicional. Se sentir que não é para você, basta enviar um e-mail dentro desse prazo e devolvemos 100% do valor.",
  },
] as const;

export default function GmNaoTenteSoPage() {
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
              Gerando Milagres · Acompanhamento com a Dra. Camilla
            </span>

            <h1 className="font-['Georgia',serif] text-4xl md:text-5xl lg:text-6xl font-bold text-dark-brown leading-tight">
              Você não precisa mais{" "}
              <em className="not-italic text-salmon">tentar sozinha.</em>
            </h1>

            <p className="font-sans text-lg md:text-xl text-brown/80 leading-relaxed md:max-w-lg">
              Acesse os materiais e protocolos da Dra. Camilla sobre
              fertilidade, alimentação, suplementação e muito mais — com
              quem já acompanhou mais de 500 mulheres nessa jornada.
            </p>

            <div className="flex items-center gap-3 text-sm text-brown/60 justify-center md:justify-start">
              <div className="relative w-10 h-10 rounded-full overflow-hidden shrink-0 ring-2 ring-salmon/40">
                <Image
                  src="/images/camilla-zap2.jpg"
                  alt="Dra. Camilla Freitas"
                  fill
                  className="object-cover object-top"
                  sizes="40px"
                  priority
                />
              </div>
              <span className="font-sans font-medium text-brown">
                Dra. Camilla Freitas — Farmacêutica CRF/PE 4563
              </span>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row gap-3 items-center justify-center md:justify-start">
              <CheckoutCta
                href={CHECKOUT_URL}
                value={PRICE_VALUE}
                productName={PRODUCT_NAME}
                label="Quero começar agora →"
              />
              <p className="font-sans text-xs text-brown/50">Garantia de 7 dias · Acesso imediato</p>
            </div>
          </div>

          <div className="hidden md:block relative w-[340px] lg:w-[400px] h-[460px] lg:h-[540px] rounded-3xl overflow-hidden shadow-2xl shrink-0">
            <Image
              src="/images/camilla-zap2.jpg"
              alt="Dra. Camilla Freitas — especialista em fertilidade"
              fill
              className="object-cover object-top"
              sizes="(max-width: 1024px) 340px, 400px"
              priority
            />
          </div>
        </div>
      </section>

      <Ticker text="GERANDO MILAGRES • ASSINATURA MENSAL • DRA. CAMILLA FREITAS CRF/PE 4563 •" />

      {/* ─── PARA QUEM É ───────────────────────────────────────────── */}
      <FadeInSection>
        <section className="py-20 px-6" style={{ background: "#4A2E26" }}>
          <div className="max-w-2xl mx-auto">
            <h2 className="font-['Georgia',serif] text-3xl md:text-4xl font-bold text-white text-center mb-10 leading-snug">
              Isso é para você se…
            </h2>
            <ul className="space-y-4">
              {problems.map((point) => (
                <li
                  key={point}
                  className="flex items-start gap-4 rounded-2xl px-5 py-4 border border-white/15 backdrop-blur-sm bg-white/5 transition-colors hover:bg-white/10"
                >
                  <span className="shrink-0 w-6 h-6 rounded-full bg-white/15 flex items-center justify-center mt-0.5">
                    <CheckCircle2 className="w-4 h-4 text-white" aria-hidden="true" />
                  </span>
                  <p className="font-sans text-white/90 text-base leading-snug">{point}</p>
                </li>
              ))}
            </ul>
            <div className="mt-10 rounded-2xl border-l-4 border-salmon pl-6 py-2">
              <p className="font-['Georgia',serif] italic text-lg md:text-xl text-white/90 leading-relaxed">
                &ldquo;Com o acompanhamento certo, cada mês que passa vira um passo a
                mais em direção ao seu milagre — não mais um mês perdido.&rdquo;
              </p>
              <p className="font-sans text-sm text-salmon mt-3 font-semibold">— Dra. Camilla Freitas</p>
            </div>
          </div>
        </section>
      </FadeInSection>

      {/* ─── O QUE ESTÁ INCLUSO ────────────────────────────────────── */}
      <FadeInSection>
        <section className="py-20 px-6 bg-nude">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12">
              <p className="font-sans text-xs font-semibold tracking-widest text-salmon uppercase mb-4">
                O que você recebe
              </p>
              <h2 className="font-['Georgia',serif] text-3xl md:text-4xl font-bold text-dark-brown leading-snug">
                Tudo o que você precisa em um só lugar
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {included.map((item) => (
                <div
                  key={item}
                  className="flex items-center gap-3 bg-white rounded-xl px-4 py-3.5 shadow-sm transition-transform duration-200 hover:scale-[1.02]"
                >
                  <CheckCircle2 className="w-5 h-5 text-success shrink-0" aria-hidden="true" />
                  <p className="font-sans text-sm text-brown/90">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </FadeInSection>

      {/* ─── CAMILLA ───────────────────────────────────────────────── */}
      <FadeInSection>
        <section className="py-20 px-6 bg-white">
          <div className="max-w-4xl mx-auto flex flex-col md:flex-row gap-10 lg:gap-16 items-center">
            <div className="w-full md:w-[300px] lg:w-[340px] shrink-0">
              <div className="relative w-full aspect-[3/4] rounded-3xl overflow-hidden shadow-xl">
                <Image
                  src="/images/camilla-zap.jpg"
                  alt="Dra. Camilla Freitas, farmacêutica especialista em fertilidade"
                  fill
                  className="object-cover object-top"
                  sizes="(max-width: 768px) 100vw, 340px"
                />
              </div>
            </div>

            <div className="flex-1 space-y-6 text-center md:text-left">
              <div>
                <p className="font-sans text-xs font-semibold tracking-widest text-salmon uppercase mb-4">
                  Quem está ao seu lado
                </p>
                <h2 className="font-['Georgia',serif] text-3xl md:text-4xl font-bold text-dark-brown leading-snug">
                  Dra. Camilla Freitas
                </h2>
              </div>
              <p className="font-['Georgia',serif] italic text-base md:text-lg text-gray-700 leading-relaxed">
                Sou farmacêutica especializada em saúde feminina e fertilidade
                natural. Nos últimos anos, acompanhei mais de 500 mulheres que
                queriam engravidar e não sabiam por onde começar.
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

      {/* ─── GRUPO WHATSAPP + URGÊNCIA ─────────────────────────────── */}
      <FadeInSection>
        <section
          className="py-20 px-6"
          style={{ background: "linear-gradient(160deg, #4A2E26 0%, #6B4239 100%)" }}
        >
          <div className="max-w-2xl mx-auto text-center">
            <p className="font-sans text-xs font-semibold tracking-widest text-salmon uppercase mb-4">
              Comunidade exclusiva
            </p>
            <h2 className="font-['Georgia',serif] text-3xl md:text-4xl font-bold text-white leading-snug mb-8">
              Você não precisa caminhar sozinha
            </h2>

            <div className="rounded-2xl border border-white/20 bg-white/10 backdrop-blur-md p-6 flex items-start gap-4 text-left">
              <div className="w-11 h-11 rounded-full bg-green-400/20 flex items-center justify-center shrink-0">
                <Users className="w-5 h-5 text-green-300" aria-hidden="true" />
              </div>
              <div className="space-y-2">
                <p className="font-sans font-semibold text-white text-base">Grupo Exclusivo no WhatsApp</p>
                <p className="font-sans text-nude/80 text-sm leading-relaxed">
                  Faça parte de um grupo exclusivo com outras mulheres que estão
                  nessa mesma jornada. Compartilhe vivências, tire dúvidas e se
                  sinta acolhida por quem entende o que você está passando.
                </p>
                <p className="font-sans text-xs font-bold text-salmon uppercase tracking-widest pt-1">
                  Acesso liberado apenas para assinantes · vagas limitadas
                </p>
              </div>
            </div>

            <div className="mt-8">
              <CheckoutCta
                href={CHECKOUT_URL}
                value={PRICE_VALUE}
                productName={PRODUCT_NAME}
                label="Quero fazer parte →"
                className="w-full sm:w-auto justify-center"
              />
            </div>
          </div>
        </section>
      </FadeInSection>

      {/* ─── BÔNUS ─────────────────────────────────────────────────── */}
      <FadeInSection>
        <section className="py-20 px-6 bg-white">
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-10">
              <p className="font-sans text-xs font-semibold tracking-widest text-salmon uppercase mb-4">
                Bônus exclusivo
              </p>
              <h2 className="font-['Georgia',serif] text-3xl md:text-4xl font-bold text-dark-brown leading-snug">
                O que vem junto com o seu acesso
              </h2>
            </div>

            <div className="relative rounded-3xl overflow-hidden border-2 border-salmon/30 shadow-lg transition-shadow duration-300 hover:shadow-xl">
              <div className="h-1.5 w-full bg-gradient-to-r from-salmon via-nude-dark to-salmon" />
              <div className="p-8 md:p-10 bg-cream">
                <div className="flex items-start gap-5">
                  <div className="w-14 h-14 rounded-2xl bg-salmon/15 flex items-center justify-center shrink-0">
                    <Gift className="w-7 h-7 text-salmon" aria-hidden="true" />
                  </div>
                  <div className="space-y-3">
                    <span className="inline-block font-sans text-xs font-bold tracking-widest text-salmon uppercase mb-2">
                      Bônus incluído
                    </span>
                    <h3 className="font-['Georgia',serif] text-xl md:text-2xl font-bold text-dark-brown leading-snug">
                      Pack de Infusões de Chás para Fertilidade
                    </h3>
                    <p className="font-sans text-gray-600 text-sm md:text-base leading-relaxed">
                      Descubra as infusões de chás utilizadas nos protocolos da
                      Dra. Camilla que potencializam sua fertilidade.
                    </p>
                    <div className="flex items-center gap-2 pt-1">
                      <Sparkles className="w-4 h-4 text-salmon shrink-0" aria-hidden="true" />
                      <span className="font-sans text-xs font-semibold text-brown">
                        Incluído sem custo adicional no seu acesso
                      </span>
                    </div>
                  </div>
                </div>
              </div>
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
                O que as assinantes estão dizendo
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
              Acompanhamento de especialista por menos que uma consulta particular.
            </h2>
            <p className="font-sans text-gray-500 text-sm mb-10">
              Enquanto uma consulta com especialista custa R$&nbsp;550, você tem
              acesso a todo o conteúdo e protocolos da Dra. Camilla por apenas
              uma fração disso.
            </p>

            <div className="bg-cream rounded-3xl p-8 md:p-10 shadow-xl border border-nude-dark/40">
              <p className="font-sans text-sm text-brown/60 font-medium mb-1">2x de</p>
              <p className="font-['Georgia',serif] text-6xl font-bold text-salmon leading-none mb-3">
                R$&nbsp;17,50
              </p>
              <p className="font-sans text-sm text-brown/60 font-medium mb-1">ou à vista</p>
              <p className="font-['Georgia',serif] text-2xl font-semibold text-brown/70 leading-none mb-1">
                R$&nbsp;35
              </p>
              <p className="font-sans text-brown/50 text-xs mt-3 mb-8">
                acesso mensal · cancele quando quiser
              </p>

              <div className="flex items-center justify-center gap-2 mb-4">
                <Sparkles className="w-4 h-4 text-salmon" aria-hidden="true" />
                <p className="font-sans text-xs text-brown/60">Acesso imediato após a confirmação</p>
              </div>

              <CheckoutCta
                href={CHECKOUT_URL}
                value={PRICE_VALUE}
                productName={PRODUCT_NAME}
                label="Quero começar agora →"
                className="w-full justify-center"
              />
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
              sentir que o conteúdo não é para você — devolvemos 100% do valor.{" "}
              <span className="font-semibold text-brown">Sem perguntas. Sem burocracia.</span>
            </>
          }
          quote="O risco é meu. O acompanhamento é seu."
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
              O próximo mês pode ser diferente.
              <br />
              <em className="not-italic text-salmon">Você escolhe.</em>
            </h2>
            <p className="font-sans text-nude/80 text-lg leading-relaxed max-w-xl mx-auto">
              Mais de 500 mulheres já escolheram parar de tentar sozinhas e
              passar a ter orientação especializada ao seu lado.
            </p>
            <div className="pt-2">
              <CheckoutCta
                href={CHECKOUT_URL}
                value={PRICE_VALUE}
                productName={PRODUCT_NAME}
                label="Quero começar agora →"
                className="text-lg px-10 py-5"
              />
            </div>
            <p className="font-sans text-xs text-nude/40">
              Garantia de 7 dias · Acesso imediato · Pagamento seguro
            </p>
          </div>
        </section>
      </FadeInSection>

      <PremiumFooter whatsappMessage="Olá! Tenho interesse na assinatura Gerando Milagres da Dra. Camilla Freitas 🌸" />
    </div>
  );
}
