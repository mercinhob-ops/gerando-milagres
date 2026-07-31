import type { Metadata } from "next";
import Image from "next/image";
import {
  Lock,
  Shield,
  Sparkles,
  HeartHandshake,
  CalendarHeart,
  FlaskConical,
  Salad,
  Pill,
  Brain,
  Dumbbell,
  MessageCircleHeart,
  BookHeart,
  Church,
} from "lucide-react";
import { CheckoutCta } from "./checkout-cta";
import { StickyHeaderCheckout } from "@/components/ui/sticky-header-checkout";

export const metadata: Metadata = {
  title: "Florescer a Dois — Dra. Camilla Freitas",
  description:
    "Um guia prático e acolhedor para casais que sonham engravidar juntos — corpo, mente, suplementação e fé, caminhando lado a lado rumo à gravidez.",
  robots: { index: false, follow: false },
};

const identification = [
  "Vocês estão tentando engravidar e a jornada está pesada",
  "Querem entender como o corpo de cada um funciona",
  "Não sabem quais exames os dois precisam fazer",
  "Sentem que o sexo virou obrigação e a conexão esfriou",
  "Querem caminhar juntos com fé e ciência",
] as const;

const chapters = [
  {
    number: "01",
    icon: HeartHandshake,
    title: "Fertilidade é Coisa de Casal",
    desc: "Por que engravidar não é responsabilidade só dela — e como vocês dois entram juntos nessa jornada, desde o primeiro passo.",
  },
  {
    number: "02",
    icon: CalendarHeart,
    title: "Guia da Fertilidade",
    desc: "Ciclo menstrual, janela fértil e produção espermática explicados de um jeito simples, para vocês entenderem o corpo um do outro.",
  },
  {
    number: "03",
    icon: FlaskConical,
    title: "Exames Dela e Dele",
    desc: "Dela: AMH, FSH, TSH, vitamina D, ferritina. Dele: espermograma, fragmentação de DNA, zinco, selênio. O que pedir e por quê.",
  },
  {
    number: "04",
    icon: Salad,
    title: "Equilibrando o Corpo",
    desc: "Alimentação anti-inflamatória, hidratação, sono e manejo do estresse — hábitos que os dois podem construir juntos.",
  },
  {
    number: "05",
    icon: Pill,
    title: "Suplementação Inteligente",
    desc: "Os nutrientes mais importantes para ela e para ele, para conversarem com propriedade na consulta com o especialista.",
  },
  {
    number: "06",
    icon: Brain,
    title: "Transformando a Mente",
    desc: "Mentalidade, ansiedade e esperança — como cuidar da cabeça de vocês dois em meio à espera.",
  },
  {
    number: "07",
    icon: Dumbbell,
    title: "Ativando o Corpo",
    desc: "Movimento físico equilibrado como aliado da fertilidade — sem excessos, sem sedentarismo.",
  },
  {
    number: "08",
    icon: MessageCircleHeart,
    title: "Revitalizando o Casal",
    desc: "Conexão emocional, intimidade e comunicação — para o sexo voltar a ser encontro, não tarefa.",
  },
  {
    number: "09",
    icon: Church,
    title: "Devocional Final",
    desc: "Fé, tempo de Deus e oração em casal. “Para tudo há uma ocasião certa, e há tempo para todo propósito debaixo do céu.” — Eclesiastes 3:1",
  },
  {
    number: "10",
    icon: BookHeart,
    title: "Fechamento",
    desc: "Um convite para continuar essa jornada com acompanhamento próximo do Gerando Milagres.",
  },
] as const;

export default function CasalGmPage() {
  return (
    <div className="overflow-x-hidden">
      <StickyHeaderCheckout
        checkoutUrl="https://pay.hotmart.com/D106943069P"
        eventValue={57.9}
      />

      {/* ─── HERO ───────────────────────────────────────────────────── */}
      <section
        className="relative overflow-hidden"
        style={{
          background: "linear-gradient(160deg, #4A2E26 0%, #6B4239 60%, #8B5E52 100%)",
        }}
      >
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
          <div className="absolute top-[-10%] right-[-8%] w-[40vw] h-[40vw] rounded-full bg-salmon/10 blur-3xl" />
          <div className="absolute bottom-[-8%] left-[-6%] w-[32vw] h-[32vw] rounded-full bg-nude/10 blur-3xl" />
        </div>

        <div className="relative z-10 w-full max-w-6xl mx-auto px-6 py-16 md:py-24 flex flex-col md:flex-row items-center gap-12">

          {/* Text */}
          <div className="flex-1 text-center md:text-left space-y-7 order-2 md:order-1">
            <span className="inline-block font-sans text-xs font-semibold tracking-widest text-salmon uppercase">
              Dra. Camilla Freitas · CRF/PE 4563
            </span>

            <div>
              <p className="font-sans text-nude/70 text-sm font-semibold tracking-widest uppercase mb-3">
                Apresenta
              </p>
              <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-none tracking-tight">
                FLORESCER<br />
                <span className="text-salmon">A DOIS</span>
              </h1>
            </div>

            <p className="font-sans text-lg md:text-xl text-nude/90 leading-relaxed md:max-w-xl">
              Um guia prático e acolhedor para casais que sonham
              engravidar juntos.
            </p>

            <div className="space-y-3">
              <CheckoutCta
                label="Quero o guia agora →"
                className="text-base md:text-lg px-8 py-4"
              />
              <div className="flex items-center gap-2 justify-center md:justify-start">
                <Lock className="w-3.5 h-3.5 text-nude/50" aria-hidden="true" />
                <p className="font-sans text-xs text-nude/60">
                  R$&nbsp;57,90 à vista · Acesso imediato
                </p>
              </div>
            </div>
          </div>

          {/* Product image */}
          <div className="order-1 md:order-2 shrink-0 w-full max-w-[300px] md:max-w-[360px] lg:max-w-[420px]">
            <div className="relative w-full aspect-[3/4] drop-shadow-2xl rounded-2xl overflow-hidden">
              <Image
                src="/images/florescer-a-dois.png"
                alt="Florescer a Dois — Dra. Camilla Freitas"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 300px, (max-width: 1024px) 360px, 420px"
                priority
              />
            </div>
          </div>

        </div>
      </section>

      {/* ─── IDENTIFICAÇÃO ─────────────────────────────────────────── */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <p className="font-sans text-xs font-semibold tracking-widest text-salmon uppercase mb-4">
              Esse guia é para vocês se…
            </p>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-dark-brown leading-snug">
              Vocês se reconhecem em alguma dessas situações?
            </h2>
          </div>

          <ul className="space-y-4 mb-12">
            {identification.map((point, i) => (
              <li
                key={i}
                className="flex items-start gap-4 bg-cream rounded-2xl px-5 py-4"
              >
                <span
                  className="w-6 h-6 rounded-full bg-salmon/20 text-salmon font-bold text-sm flex items-center justify-center shrink-0 mt-0.5"
                  aria-hidden="true"
                >
                  ✦
                </span>
                <p className="font-sans text-brown/90 leading-snug text-sm md:text-base">
                  {point}
                </p>
              </li>
            ))}
          </ul>

          <div className="rounded-3xl border-l-4 border-salmon bg-cream px-7 py-7 space-y-3">
            <p className="font-sans text-xs font-semibold tracking-widest text-salmon uppercase">
              Uma verdade que ninguém contou a vocês
            </p>
            <p className="font-display italic text-xl md:text-2xl text-dark-brown leading-relaxed">
              Fertilidade não é fardo de uma pessoa só. É jornada de casal.
            </p>
            <p className="font-sans text-brown/80 text-base leading-relaxed">
              Florescer a Dois existe para que vocês caminhem lado a lado
              — entendendo o corpo um do outro, cuidando da conexão e
              confiando no tempo de Deus.
            </p>
          </div>
        </div>
      </section>

      {/* ─── CAPÍTULOS ─────────────────────────────────────────────── */}
      <section className="py-20 px-6 bg-cream">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-14">
            <p className="font-sans text-xs font-semibold tracking-widest text-salmon uppercase mb-4">
              O que está incluso
            </p>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-dark-brown leading-snug">
              10 capítulos para vocês{" "}
              <em className="not-italic text-salmon">florescerem juntos</em>
            </h2>
            <p className="font-sans text-gray-600 mt-4 text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
              Um caminho completo — corpo, mente, suplementação, conexão
              e fé — para o casal caminhar unido rumo à gravidez.
            </p>
          </div>

          <div className="space-y-4">
            {chapters.map(({ number, icon: Icon, title, desc }) => (
              <div
                key={number}
                className="bg-white rounded-2xl p-6 flex items-start gap-5 shadow-sm border border-nude-dark/30"
              >
                <div className="shrink-0 flex flex-col items-center gap-1.5">
                  <span className="font-display text-2xl font-bold text-salmon leading-none">
                    {number}
                  </span>
                  <div className="w-8 h-8 rounded-full bg-salmon/10 flex items-center justify-center">
                    <Icon className="w-4 h-4 text-salmon" aria-hidden="true" />
                  </div>
                </div>
                <div>
                  <p className="font-sans font-bold text-dark-brown text-base mb-1">
                    {title}
                  </p>
                  <p className="font-sans text-gray-500 text-sm leading-relaxed">
                    {desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <CheckoutCta
              label="Quero o Florescer a Dois →"
              className="text-base md:text-lg px-8 py-4"
            />
          </div>
        </div>
      </section>

      {/* ─── DRA. CAMILLA ───────────────────────────────────────────── */}
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
              <h2 className="font-display text-3xl md:text-4xl font-bold text-dark-brown leading-snug">
                Dra. Camilla Freitas
              </h2>
            </div>

            <div className="space-y-4">
              <p className="font-display italic text-base md:text-lg text-gray-700 leading-relaxed">
                Sou farmacêutica especializada em saúde feminina e
                fertilidade natural. Ao longo dos últimos anos, acompanhei
                centenas de casais que estavam tentando engravidar — e
                percebi que a fertilidade raramente é tratada como o que
                realmente é: uma jornada de dois.
              </p>
              <p className="font-display italic text-base md:text-lg text-gray-700 leading-relaxed">
                Florescer a Dois nasceu para unir vocês nesse processo —
                com ciência, cuidado e fé, caminhando lado a lado até
                o milagre acontecer.
              </p>
            </div>

            <div className="border-l-4 border-salmon pl-5 py-1 space-y-1 text-left">
              <p className="font-sans font-semibold text-brown">Camilla Freitas</p>
              <p className="font-sans text-xs font-semibold tracking-wide text-salmon uppercase">
                Farmacêutica · CRF/PE 4563
              </p>
              <p className="font-sans text-sm text-gray-600 leading-relaxed mt-2">
                Especializada em saúde feminina, suplementação clínica e
                preparação do casal para a jornada da fertilidade.
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* ─── PREÇO ─────────────────────────────────────────────────── */}
      <section className="py-20 px-6 bg-cream">
        <div className="max-w-lg mx-auto text-center">
          <p className="font-sans text-xs font-semibold tracking-widest text-salmon uppercase mb-6">
            Investimento
          </p>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-dark-brown mb-3 leading-snug">
            Cuidado de casal pelo valor de uma fração de uma consulta.
          </h2>
          <p className="font-sans text-gray-500 text-sm mb-10">
            Uma consulta com especialista em fertilidade custa R$&nbsp;550.
            Com o Florescer a Dois, vocês chegam à consulta já caminhando
            juntos e informados.
          </p>

          <div className="bg-white rounded-3xl p-8 md:p-10 shadow-xl border border-nude-dark/40">

            <p className="font-sans text-sm text-brown/60 font-medium mb-1">
              2x de
            </p>
            <p className="font-display text-6xl font-bold text-salmon leading-none mb-3">
              R$&nbsp;28,95
            </p>
            <p className="font-sans text-sm text-brown/60 font-medium mb-1">
              ou à vista
            </p>
            <p className="font-display text-2xl font-semibold text-brown/70 leading-none mb-1">
              R$&nbsp;57,90
            </p>
            <p className="font-sans text-brown/50 text-xs mt-3 mb-8">
              pagamento único · acesso imediato · sem mensalidade
            </p>

            <div className="grid grid-cols-2 gap-3 mb-8">
              {[
                { label: "1 consulta\ncom especialista", value: "R$ 550" },
                { label: "Florescer\na Dois", value: "R$ 57,90", highlight: true },
              ].map(({ label, value, highlight }) => (
                <div
                  key={label}
                  className={`rounded-xl p-3 text-center ${highlight ? "bg-salmon" : "bg-cream border border-nude-dark/40"}`}
                >
                  <p className={`font-sans text-xs leading-tight whitespace-pre-line mb-1 ${highlight ? "text-white/80" : "text-gray-500"}`}>
                    {label}
                  </p>
                  <p className={`font-sans font-bold text-sm ${highlight ? "text-white" : "text-dark-brown"}`}>
                    {value}
                  </p>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-center gap-2 mb-4">
              <Sparkles className="w-4 h-4 text-salmon" aria-hidden="true" />
              <p className="font-sans text-xs text-brown/60">
                10 capítulos completos · acesso imediato após confirmação
              </p>
            </div>

            <CheckoutCta
              label="Quero o Florescer a Dois →"
              className="w-full justify-center text-base"
            />

            <div className="flex items-center justify-center gap-1.5 text-gray-400 mt-4">
              <Lock className="w-3.5 h-3.5" aria-hidden="true" />
              <span className="font-sans text-xs">Pagamento 100% seguro · SSL</span>
            </div>
          </div>
        </div>
      </section>

      {/* ─── GARANTIA ──────────────────────────────────────────────── */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-2xl mx-auto">
          <div className="flex flex-col md:flex-row items-center gap-10">

            <div className="shrink-0 flex flex-col items-center">
              <div
                className="relative w-40 h-40 rounded-full flex flex-col items-center justify-center shadow-lg"
                style={{ background: "linear-gradient(145deg, #F0E6DC, #E8D0C0)" }}
                aria-label="Garantia de 7 dias"
                role="img"
              >
                <div className="absolute inset-0 rounded-full border-4 border-salmon/40" />
                <div className="absolute inset-3 rounded-full border border-salmon/25" />
                <Shield className="w-8 h-8 text-salmon mb-1" aria-hidden="true" />
                <span className="font-display text-3xl font-bold text-brown leading-none">7</span>
                <span className="font-sans text-xs font-bold text-salmon uppercase tracking-widest">dias</span>
              </div>
              <p className="font-sans text-xs text-gray-400 mt-3 text-center">Garantia incondicional</p>
            </div>

            <div className="text-center md:text-left space-y-4">
              <p className="font-sans text-xs font-semibold tracking-widest text-salmon uppercase">
                Sem risco para vocês
              </p>
              <h2 className="font-display text-2xl md:text-3xl font-semibold text-dark-brown leading-snug">
                Experimentem sem medo. A garantia é nossa.
              </h2>
              <p className="font-sans text-gray-600 leading-relaxed">
                Se nos primeiros{" "}
                <strong className="text-brown">7 dias</strong> vocês
                sentirem que o material não é para vocês — devolvemos
                100% do valor.{" "}
                <span className="font-semibold text-brown">
                  Sem perguntas. Sem burocracia.
                </span>
              </p>
              <p className="font-display italic text-salmon text-lg">
                &ldquo;O risco é nosso. O florescer é de vocês.&rdquo;
              </p>
              <p className="font-sans text-sm text-gray-500">
                Basta enviar um e-mail em até 7 dias após a compra.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* ─── CTA FINAL ─────────────────────────────────────────────── */}
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
            Chegou a hora
          </p>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight">
            Parem de caminhar sozinhos.<br />
            <em className="not-italic text-salmon">Floresçam a dois.</em>
          </h2>
          <p className="font-sans text-nude/80 text-lg leading-relaxed max-w-xl mx-auto">
            Corpo, mente, suplementação e fé — tudo o que vocês precisam
            para caminhar juntos, de mãos dadas, rumo à gravidez.
          </p>

          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-5 py-2">
            <span className="w-2 h-2 rounded-full bg-salmon animate-pulse shrink-0" aria-hidden="true" />
            <span className="font-sans text-xs font-semibold text-nude/80 uppercase tracking-widest">
              Acesso imediato após a confirmação
            </span>
          </div>

          <div className="pt-2 space-y-4">
            <CheckoutCta
              label="Quero o Florescer a Dois →"
              className="text-lg px-10 py-5"
            />
            <p className="font-sans text-xs text-nude/40">
              R$&nbsp;57,90 à vista · Garantia de 7 dias · Pagamento seguro
            </p>
          </div>
        </div>
      </section>

    </div>
  );
}
