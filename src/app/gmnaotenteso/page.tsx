import type { Metadata } from "next";
import Image from "next/image";
import { CheckCircle2, Shield, BookOpen, Sparkles, Gift, Users, MessageCircle } from "lucide-react";
import { CheckoutCta } from "./checkout-cta";

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

const modules = [
  { topic: "Fertilidade", desc: "Como preparar o corpo para a gestação — do ciclo aos marcadores" },
  { topic: "Alimentação fértil", desc: "O que comer para criar um ambiente anti-inflamatório e favorável" },
  { topic: "Suplementação", desc: "O que tomar, em que dosagem e quando — baseado em evidências" },
  { topic: "Saúde intestinal", desc: "A conexão entre o intestino e a sua fertilidade" },
  { topic: "Ovulação", desc: "Como entender, identificar e otimizar o seu ciclo" },
  { topic: "SOP", desc: "Protocolo específico para Síndrome dos Ovários Policísticos" },
  { topic: "Endometriose", desc: "Estratégias práticas para quem convive com a endometriose" },
  { topic: "Miomas", desc: "O que você precisa saber e como manejar sem se desesperar" },
] as const;

const included = [
  "Material rico em informações e protocolos que a Dra. Camilla utiliza com suas pacientes",
  "Conteúdo atualizado regularmente com novos temas",
  "Orientações práticas e aplicáveis a partir do primeiro acesso",
  "Estratégias baseadas em literatura científica de fertilidade",
  "Acesso via plataforma exclusiva, disponível onde você estiver",
] as const;

export default function GmNaoTenteSoPage() {
  return (
    <div className="overflow-x-hidden">

      {/* ─── HERO ───────────────────────────────────────────────────── */}
      <section
        className="relative min-h-[100svh] flex items-center"
        style={{
          background: "linear-gradient(160deg, #F0E6DC 0%, #E8D0C0 55%, #ffffff 100%)",
        }}
      >
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
          <div className="absolute top-[-8%] right-[-6%] w-[36vw] h-[36vw] rounded-full bg-salmon/20 blur-3xl" />
          <div className="absolute bottom-[-6%] left-[-8%] w-[30vw] h-[30vw] rounded-full bg-nude/70 blur-3xl" />
        </div>

        <div className="relative z-10 w-full max-w-6xl mx-auto px-6 py-20 flex flex-col md:flex-row items-center gap-12">

          {/* Text */}
          <div className="flex-1 text-center md:text-left space-y-6">
            <span className="inline-block font-sans text-xs font-semibold tracking-widest text-salmon uppercase">
              Gerando Milagres · Acompanhamento com a Dra. Camilla
            </span>

            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-dark-brown leading-tight tracking-tight">
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
              <CheckoutCta label="Quero começar agora →" />
              <p className="font-sans text-xs text-brown/50">
                Garantia de 7 dias · Acesso imediato
              </p>
            </div>
          </div>

          {/* Photo */}
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

      {/* ─── PROBLEMA ──────────────────────────────────────────────── */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <p className="font-sans text-xs font-semibold tracking-widest text-salmon uppercase mb-4">
              Você se reconhece aqui?
            </p>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-dark-brown leading-snug">
              Tentar sozinha tem um custo alto.
            </h2>
            <p className="font-sans text-gray-600 mt-4 text-base md:text-lg leading-relaxed">
              Não é falta de esforço. É falta de direção — de alguém que
              entende o seu corpo e te diz exatamente o que fazer.
            </p>
          </div>

          <ul className="space-y-4">
            {problems.map((p, i) => (
              <li
                key={i}
                className="flex items-start gap-4 bg-cream rounded-2xl px-5 py-4"
              >
                <span
                  className="w-6 h-6 rounded-full bg-salmon/20 text-salmon font-bold text-sm flex items-center justify-center shrink-0 mt-0.5"
                  aria-hidden="true"
                >
                  ×
                </span>
                <p className="font-sans text-brown/90 leading-snug text-sm md:text-base">
                  {p}
                </p>
              </li>
            ))}
          </ul>

          <div className="mt-10 rounded-2xl border-l-4 border-salmon pl-6 py-2">
            <p className="font-display italic text-lg md:text-xl text-brown leading-relaxed">
              &ldquo;Com o acompanhamento certo, cada mês que passa vira um passo a
              mais em direção ao seu milagre — não mais um mês perdido.&rdquo;
            </p>
            <p className="font-sans text-sm text-salmon mt-3 font-semibold">
              — Dra. Camilla Freitas
            </p>
          </div>
        </div>
      </section>

      {/* ─── CONTEÚDOS ─────────────────────────────────────────────── */}
      <section className="py-20 px-6 bg-cream">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-14">
            <p className="font-sans text-xs font-semibold tracking-widest text-salmon uppercase mb-4">
              O que você vai receber
            </p>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-dark-brown leading-snug">
              Protocolos e materiais sobre o que{" "}
              <em className="not-italic text-salmon">realmente importa</em>{" "}
              para a sua fertilidade
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {modules.map(({ topic, desc }) => (
              <div
                key={topic}
                className="bg-white rounded-2xl p-5 flex items-start gap-4 shadow-sm border border-nude-dark/30"
              >
                <div className="w-9 h-9 rounded-full bg-salmon/10 flex items-center justify-center shrink-0">
                  <BookOpen className="w-4 h-4 text-salmon" aria-hidden="true" />
                </div>
                <div>
                  <p className="font-sans font-semibold text-dark-brown text-sm">
                    {topic}
                  </p>
                  <p className="font-sans text-gray-500 text-xs mt-0.5 leading-relaxed">
                    {desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <p className="text-center font-sans text-sm text-brown/60 mt-8 italic">
            + novos conteúdos adicionados regularmente conforme os temas mais
            pedidos pelas mulheres do programa
          </p>
        </div>
      </section>

      {/* ─── CAMILLA ───────────────────────────────────────────────── */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row gap-10 lg:gap-16 items-center">

          {/* Photo */}
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

          {/* Text */}
          <div className="flex-1 space-y-6 text-center md:text-left">
            <div>
              <p className="font-sans text-xs font-semibold tracking-widest text-salmon uppercase mb-4">
                Quem está ao seu lado
              </p>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-dark-brown leading-snug">
                Dra. Camilla Freitas
              </h2>
            </div>

            <div className="space-y-4">
              <p className="font-display italic text-base md:text-lg text-gray-700 leading-relaxed">
                Sou farmacêutica especializada em saúde feminina e fertilidade
                natural. Nos últimos anos, acompanhei mais de 500 mulheres que
                queriam engravidar e não sabiam por onde começar.
              </p>
              <p className="font-display italic text-base md:text-lg text-gray-700 leading-relaxed">
                O que aprendi nessa jornada é que a maioria das mulheres não
                precisa de mais informação — precisa de orientação. De alguém
                que diga com clareza o que fazer com o próprio corpo.
              </p>
            </div>

            <div className="border-l-4 border-salmon pl-5 py-1 space-y-1 text-left">
              <p className="font-sans font-semibold text-brown">
                Camilla Freitas
              </p>
              <p className="font-sans text-xs font-semibold tracking-wide text-salmon uppercase">
                Farmacêutica · CRF/PE 4563
              </p>
              <p className="font-sans text-sm text-gray-600 leading-relaxed mt-2">
                Especializada em saúde feminina, suplementação clínica e
                preparação do corpo para gestação saudável.
                Mais de 500 mulheres acompanhadas.
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* ─── O QUE ESTÁ INCLUSO ────────────────────────────────────── */}
      <section
        className="py-20 px-6"
        style={{ background: "linear-gradient(160deg, #4A2E26 0%, #6B4239 100%)" }}
      >
        <div className="max-w-2xl mx-auto text-center">
          <p className="font-sans text-xs font-semibold tracking-widest text-salmon uppercase mb-4">
            Tudo que você recebe
          </p>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-white leading-snug mb-3">
            Orientação especializada onde quer que você esteja
          </h2>
          <p className="font-sans text-nude/80 text-base mb-10">
            Acesse pelo celular, tablet ou computador — no seu ritmo, quando quiser.
          </p>

          <ul className="space-y-3 text-left mb-6">
            {included.map((item, i) => (
              <li key={i} className="flex items-start gap-3">
                <CheckCircle2
                  className="w-5 h-5 text-salmon shrink-0 mt-0.5"
                  aria-hidden="true"
                />
                <span className="font-sans text-nude/90 text-sm md:text-base leading-snug">
                  {item}
                </span>
              </li>
            ))}
          </ul>

          {/* WhatsApp group — destaque visual */}
          <div className="mb-10 rounded-2xl border border-white/20 bg-white/10 p-5 flex items-start gap-4 text-left">
            <div className="w-10 h-10 rounded-full bg-green-400/20 flex items-center justify-center shrink-0">
              <Users className="w-5 h-5 text-green-300" aria-hidden="true" />
            </div>
            <div className="space-y-1">
              <p className="font-sans font-semibold text-white text-sm">
                Grupo Exclusivo no WhatsApp
              </p>
              <p className="font-sans text-nude/80 text-xs leading-relaxed">
                Faça parte de um grupo exclusivo com outras mulheres que estão
                nessa mesma jornada. Compartilhe vivências, tire dúvidas e se
                sinta acolhida por quem entende o que você está passando.
                Acesso liberado apenas para quem garantir a vaga —
                as vagas são limitadas.
              </p>
            </div>
          </div>

          <CheckoutCta
            label="Quero ter acesso →"
            className="w-full sm:w-auto justify-center"
          />
        </div>
      </section>

      {/* ─── BÔNUS ─────────────────────────────────────────────────── */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-10">
            <p className="font-sans text-xs font-semibold tracking-widest text-salmon uppercase mb-4">
              Bônus exclusivo
            </p>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-dark-brown leading-snug">
              O que vem junto com o seu acesso
            </h2>
          </div>

          <div className="relative rounded-3xl overflow-hidden border-2 border-salmon/30 shadow-lg">
            {/* Accent bar */}
            <div className="h-1.5 w-full bg-gradient-to-r from-salmon via-nude-dark to-salmon" />

            <div className="p-8 md:p-10 bg-cream">
              <div className="flex items-start gap-5">
                <div className="w-14 h-14 rounded-2xl bg-salmon/15 flex items-center justify-center shrink-0">
                  <Gift className="w-7 h-7 text-salmon" aria-hidden="true" />
                </div>
                <div className="space-y-3">
                  <div>
                    <span className="inline-block font-sans text-xs font-bold tracking-widest text-salmon uppercase mb-2">
                      Bônus incluído
                    </span>
                    <h3 className="font-display text-xl md:text-2xl font-bold text-dark-brown leading-snug">
                      Pack de Infusões de Chás para Fertilidade
                    </h3>
                  </div>
                  <p className="font-sans text-gray-600 text-sm md:text-base leading-relaxed">
                    Descubra as infusões de chás utilizadas nos protocolos da
                    Dra. Camilla que potencializam sua fertilidade em até 10x.
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

      {/* ─── PREÇO ─────────────────────────────────────────────────── */}
      <section className="py-20 px-6 bg-cream">
        <div className="max-w-lg mx-auto text-center">
          <p className="font-sans text-xs font-semibold tracking-widest text-salmon uppercase mb-6">
            Investimento
          </p>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-dark-brown mb-3 leading-snug">
            Acompanhamento de especialista por menos que uma consulta particular.
          </h2>
          <p className="font-sans text-gray-500 text-sm mb-10">
            Enquanto uma consulta com especialista custa R$&nbsp;550, você tem
            acesso a todo o conteúdo e protocolos da Dra. Camilla por apenas
            uma fração disso.
          </p>

          <div className="bg-white rounded-3xl p-8 md:p-10 shadow-xl border border-nude-dark/40">

            <div className="flex items-baseline justify-center gap-2 mb-1">
              <span className="font-sans text-lg text-brown/60 font-medium">por apenas</span>
            </div>
            <div className="flex items-end justify-center gap-1 mb-1">
              <span className="font-display text-7xl md:text-8xl font-bold text-dark-brown leading-none">
                R$&nbsp;35
              </span>
            </div>
            <p className="font-sans text-brown/60 text-sm mb-8">ao mês</p>

            {/* Value anchors — 2 colunas */}
            <div className="grid grid-cols-2 gap-3 mb-8">
              {[
                { label: "1 consulta\ncom especialista", value: "R$ 550" },
                { label: "Gerando\nMilagres", value: "R$ 35/mês", highlight: true },
              ].map(({ label, value, highlight }) => (
                <div
                  key={label}
                  className={`rounded-xl p-3 text-center ${highlight ? "bg-salmon text-white" : "bg-cream border border-nude-dark/40"}`}
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

            <div className="flex items-center justify-center gap-2 mb-3">
              <Sparkles className="w-4 h-4 text-salmon" aria-hidden="true" />
              <p className="font-sans text-xs text-brown/60">
                Acesso imediato após a confirmação
              </p>
            </div>

            <CheckoutCta
              label="Quero começar agora →"
              className="w-full justify-center"
            />
          </div>
        </div>
      </section>

      {/* ─── GARANTIA ──────────────────────────────────────────────── */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-2xl mx-auto">
          <div className="flex flex-col md:flex-row items-center gap-10">

            {/* Badge */}
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

            {/* Text */}
            <div className="text-center md:text-left space-y-4">
              <p className="font-sans text-xs font-semibold tracking-widest text-salmon uppercase">
                Sem risco para você
              </p>
              <h2 className="font-display text-2xl md:text-3xl font-semibold text-dark-brown leading-snug">
                Experimente sem medo. A garantia é nossa.
              </h2>
              <p className="font-sans text-gray-600 leading-relaxed">
                Se nos primeiros <strong className="text-brown">7 dias</strong> você
                sentir que o conteúdo não é para você — devolvemos 100% do valor.{" "}
                <span className="font-semibold text-brown">Sem perguntas. Sem burocracia.</span>
              </p>
              <p className="font-display italic text-salmon text-lg">
                &ldquo;O risco é meu. O acompanhamento é seu.&rdquo;
              </p>
              <p className="font-sans text-sm text-gray-500">
                Basta enviar um e-mail em até 7 dias após o acesso.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* ─── URGÊNCIA ──────────────────────────────────────────────── */}
      <section className="py-10 px-6 bg-white">
        <div className="max-w-2xl mx-auto">
          <div className="rounded-2xl border-2 border-salmon/30 bg-cream px-6 py-5 flex items-start gap-4">
            <div className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center shrink-0 mt-0.5">
              <MessageCircle className="w-5 h-5 text-green-600" aria-hidden="true" />
            </div>
            <div className="space-y-1">
              <p className="font-sans font-bold text-dark-brown text-sm">
                Vagas limitadas — Grupo Exclusivo no WhatsApp
              </p>
              <p className="font-sans text-gray-600 text-xs leading-relaxed">
                Quem garantir o acesso agora entra diretamente no grupo com
                outras mulheres que estão nessa mesma jornada — para
                compartilhar vivências, tirar dúvidas e se sentir acolhida
                por quem entende o que você está passando.
                <span className="font-semibold text-brown"> As vagas são limitadas.</span>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── CTA FINAL ─────────────────────────────────────────────── */}
      <section
        className="py-24 px-6 text-center"
        style={{ background: "linear-gradient(160deg, #F0E6DC 0%, #E8D0C0 100%)" }}
      >
        <div className="max-w-2xl mx-auto space-y-6">
          <p className="font-sans text-xs font-semibold tracking-widest text-salmon uppercase">
            Dra. Camilla Freitas ao seu lado
          </p>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-dark-brown leading-tight">
            O próximo mês pode ser diferente.<br />
            <em className="not-italic text-salmon">Você escolhe.</em>
          </h2>
          <p className="font-sans text-brown/70 text-lg leading-relaxed max-w-xl mx-auto">
            Mais de 500 mulheres já escolheram parar de tentar sozinhas e
            passar a ter orientação especializada ao seu lado.
          </p>
          <div className="pt-2">
            <CheckoutCta
              label="Quero começar agora →"
              className="text-lg px-10 py-5"
            />
          </div>
          <p className="font-sans text-xs text-brown/40">
            Garantia de 7 dias · Acesso imediato · Pagamento seguro
          </p>
        </div>
      </section>

    </div>
  );
}
