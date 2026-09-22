"use client";

import { useState, type FormEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import { Check } from "lucide-react";
import { trackConversionEvent } from "@/lib/meta-conversions";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/design-system/button";

const PRICE_VALUE = 57.9;
const PRODUCT_NAME = "Florescer a Dois";
const LEAD_STORAGE_KEY = "casalgm3_lead";

const checklistSections = [
  {
    icon: "🌡️",
    title: "Calor e exposição",
    items: [
      "Notebook no colo com frequência",
      "Banho muito quente, sauna ou hidromassagem frequentes",
      "Celular no bolso da calça o dia todo",
      "Cueca/roupa muito justa no dia a dia",
    ],
  },
  {
    icon: "🏃",
    title: "Estilo de vida",
    items: [
      "Fuma (cigarro ou vape)",
      "Bebe álcool mais de 2-3x por semana",
      "Fica muitas horas sentado sem pausas",
      "Ciclismo intenso e frequente (+5h/semana)",
      "Já usou ou usa anabolizantes/hormônios",
    ],
  },
  {
    icon: "😴",
    title: "Sono e estresse",
    items: [
      "Dorme menos de 6-7h por noite",
      "Trabalha em turnos noturnos / sono irregular",
      "Fase de estresse alto (trabalho, financeiro, emocional)",
    ],
  },
  {
    icon: "🥗",
    title: "Alimentação",
    items: [
      "Pouca proteína de qualidade e vegetais no dia a dia",
      "Muito ultraprocessado, fritura e açúcar",
      "Nenhum suplemento antioxidante (zinco, selênio, ômega-3)",
      "Bebe pouca água ao longo do dia",
    ],
  },
  {
    icon: "🏥",
    title: "Saúde geral",
    items: [
      "Acima do peso / circunferência abdominal aumentada",
      "Febre alta ou infecção recente (últimos 3 meses)",
      "Nunca fez um espermograma",
    ],
  },
  {
    icon: "⚗️",
    title: "Desreguladores endócrinos",
    items: [
      "Esquenta comida/bebida em plástico (micro-ondas, garrafinha)",
      "Usa cosméticos sem checar composição (parabenos, ftalatos)",
      "Contato frequente com agrotóxicos, solventes ou metais pesados",
      "Alimentos não-orgânicos sem lavar/descascar bem",
      "Perfume/desodorante convencional todo dia sem saber a composição",
    ],
  },
  {
    icon: "💊",
    title: "Medicamentos e substâncias",
    items: [
      "Finasterida ou outros bloqueadores hormonais",
      "Antidepressivo/ansiolítico/pressão sem saber o efeito na fertilidade",
      "Uso de testosterona exógena/TRT",
      "Anti-inflamatórios com frequência (+1x/semana)",
      "Uso de maconha ou outras drogas recreativas",
    ],
  },
] as const;

const TOTAL_CHECKLIST_ITEMS = checklistSections.reduce((sum, section) => sum + section.items.length, 0);

function firstNameOf(fullName: string): string {
  const trimmed = fullName.trim();
  const first = trimmed.split(/\s+/)[0] ?? "";
  return first.charAt(0).toUpperCase() + first.slice(1);
}

export function CasalGm3Content() {
  return (
    <div className="overflow-x-hidden bg-white">
      <HeaderSection />
      <ChecklistSection />
      <LeadCaptureSection />
      <FooterSection />
    </div>
  );
}

/* ─────────────────────────────── 1. Header ─────────────────────────────── */

function HeaderSection() {
  return (
    <header className="px-6 pt-10 pb-8 md:pt-14 md:pb-10 bg-white">
      <div className="max-w-2xl mx-auto text-center">
        <p className="font-['Georgia',serif] italic text-sm font-bold text-dark-brown mb-1">Gerando Milagres</p>
        <p className="font-sans text-xs font-semibold text-brown/60 uppercase tracking-widest mb-6">
          Dra. Camilla Freitas · CRF/PE 4563
        </p>

        <h1 className="font-['Georgia',serif] text-3xl md:text-4xl font-bold text-dark-brown leading-tight mb-4">
          Checklist da Fertilidade Masculina
        </h1>

        <p className="font-['Georgia',serif] italic text-base text-brown/70 leading-relaxed mb-6 max-w-xl mx-auto">
          Marque os hábitos que fazem parte do seu dia a dia hoje. A maioria é reversível em poucos meses — o
          corpo agradece cada ajuste.
        </p>

        <div className="bg-salmon/10 border border-salmon/25 rounded-2xl px-6 py-5">
          <p className="font-sans text-sm text-dark-brown leading-relaxed">
            <span aria-hidden="true">🔬</span> Espermatozoides levam cerca de 90 dias para se formar por
            completo. Ou seja: o que você muda hoje, o seu corpo reflete lá na frente.
          </p>
        </div>
      </div>
    </header>
  );
}

/* ─────────────────────────────── 2. Checklist ─────────────────────────────── */

function ChecklistSection() {
  const [checkedIds, setCheckedIds] = useState<Set<string>>(() => new Set());

  function toggleItem(id: string) {
    setCheckedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }

  const checkedCount = checkedIds.size;

  return (
    <section className="px-6 py-12 md:py-16 bg-white">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8 rounded-2xl bg-[#F8F8F8] px-6 py-4 text-center">
          <p className="font-sans text-sm font-bold text-dark-brown">
            Você marcou <span className="text-salmon">{checkedCount}</span> de {TOTAL_CHECKLIST_ITEMS} itens
          </p>
        </div>

        {checkedCount >= 3 && (
          <div className="mb-8 rounded-2xl bg-salmon px-6 py-5 text-center">
            <p className="font-sans text-sm md:text-base font-semibold text-white leading-relaxed">
              Você marcou {checkedCount} itens — não é motivo pra pânico, é motivo pra agir com direção certa.
            </p>
          </div>
        )}

        <div className="space-y-8">
          {checklistSections.map((section, sectionIndex) => (
            <div key={section.title}>
              <h2 className="font-['Georgia',serif] text-lg font-bold text-dark-brown mb-3 flex items-center gap-2">
                <span aria-hidden="true">{section.icon}</span> {section.title}
              </h2>
              <div className="space-y-1">
                {section.items.map((item, itemIndex) => {
                  const id = `${sectionIndex}-${itemIndex}`;
                  const isChecked = checkedIds.has(id);
                  return (
                    <label
                      key={id}
                      className={cn(
                        "flex items-start gap-3 rounded-xl px-4 py-3 cursor-pointer transition-colors",
                        isChecked ? "bg-salmon/10" : "hover:bg-[#F8F8F8]"
                      )}
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => toggleItem(id)}
                        className="sr-only"
                      />
                      <span
                        className={cn(
                          "mt-0.5 shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center transition-colors",
                          isChecked ? "bg-salmon border-salmon" : "border-nude-dark/50"
                        )}
                        aria-hidden="true"
                      >
                        {isChecked && <Check className="w-3.5 h-3.5 text-white" />}
                      </span>
                      <span className="font-sans text-sm text-dark-brown/90 leading-snug">{item}</span>
                    </label>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ────────────────────────── 3 & 4. Captura de lead + Resultado/CTA ────────────────────────── */

function LeadCaptureSection() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [leadCaptured, setLeadCaptured] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmedName = name.trim();
    const trimmedEmail = email.trim();

    if (!trimmedName) {
      setError("Digite seu nome, por favor.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      setError("Digite um e-mail válido.");
      return;
    }

    setError(null);

    try {
      window.localStorage.setItem(
        LEAD_STORAGE_KEY,
        JSON.stringify({ name: trimmedName, email: trimmedEmail, capturedAt: new Date().toISOString() })
      );
    } catch {
      // localStorage indisponível (modo privado, etc.) — não bloqueia o fluxo
    }

    trackConversionEvent({
      eventName: "Lead",
      customData: { content_name: "Checklist Fertilidade Masculina" },
    });

    setName(trimmedName);
    setLeadCaptured(true);
  }

  if (leadCaptured) {
    return <ResultCtaCard name={name} />;
  }

  return (
    <section className="px-6 py-12 md:py-16 bg-[#F8F8F8]">
      <div className="max-w-md mx-auto bg-white rounded-2xl shadow-sm p-8">
        <h2 className="font-['Georgia',serif] text-2xl font-bold text-dark-brown text-center mb-2">
          Quer entender por onde começar?
        </h2>
        <p className="font-sans text-sm text-brown/70 text-center mb-6">
          Deixe seu contato e a Dra. Camilla mostra o próximo passo para vocês
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label htmlFor="casalgm3-name" className="font-sans text-sm font-semibold text-brown/80">
              Nome completo
            </label>
            <input
              id="casalgm3-name"
              type="text"
              autoComplete="name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Seu nome completo"
              className="w-full rounded-xl border-2 border-nude-dark/40 bg-white px-4 py-3 font-sans text-base text-dark-brown placeholder:text-brown/40 outline-none transition-colors focus:border-salmon"
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="casalgm3-email" className="font-sans text-sm font-semibold text-brown/80">
              E-mail
            </label>
            <input
              id="casalgm3-email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
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
              "bg-salmon hover:bg-salmon/90 w-full justify-center text-base"
            )}
          >
            Quero saber por onde começar →
          </button>
        </form>

        <p className="font-sans text-xs text-brown/50 text-center mt-4">
          Seus dados estão protegidos pela LGPD
        </p>
      </div>
    </section>
  );
}

function ResultCtaCard({ name }: { name: string }) {
  const displayName = firstNameOf(name) || "Vocês";

  function handleCtaClick() {
    trackConversionEvent({
      eventName: "InitiateCheckout",
      customData: { value: PRICE_VALUE, currency: "BRL", content_name: PRODUCT_NAME },
    });
  }

  return (
    <section className="px-6 py-12 md:py-16 bg-[#F8F8F8]">
      <div className="max-w-lg mx-auto bg-white rounded-2xl shadow-sm p-8 text-center">
        <h2 className="font-['Georgia',serif] text-2xl font-bold text-dark-brown leading-snug mb-4">
          {displayName}, o corpo do seu parceiro pode se preparar muito melhor do que vocês imaginam.
        </h2>

        <p className="font-sans text-brown/70 leading-relaxed mb-8">
          Cada item marcado nesse checklist tem uma explicação e, na maioria dos casos, uma solução. O guia
          Florescer a Dois foi criado exatamente para casais que querem preparar os dois corpos — ela e ele —
          para gerar uma vida saudável.
        </p>

        <div className="bg-[#F8F8F8] rounded-2xl p-6 mb-6">
          <div className="relative w-full max-w-[180px] aspect-[2/3] mx-auto rounded-xl overflow-hidden shadow-md mb-4">
            <Image
              src="/images/florescer-a-dois.png"
              alt="Florescer a Dois — Dra. Camilla Freitas"
              fill
              className="object-cover"
              sizes="180px"
            />
          </div>
          <p className="font-['Georgia',serif] text-lg font-bold text-dark-brown">Florescer a Dois</p>
          <p className="font-sans text-sm text-brown/60 mt-1">2x de R$28,95 ou R$57,90 à vista</p>
        </div>

        <Link
          href="/casalgm1"
          onClick={handleCtaClick}
          className={cn(
            buttonVariants({ variant: "primary", size: "lg" }),
            "bg-salmon hover:bg-salmon/90 shadow-[0_10px_30px_rgba(196,134,122,0.45)] hover:shadow-[0_14px_36px_rgba(196,134,122,0.55)] transition-all duration-200 hover:-translate-y-0.5 w-full justify-center text-base md:text-lg px-8 py-4 mb-6"
          )}
        >
          Quero o Florescer a Dois →
        </Link>

        <div className="flex items-center justify-center gap-3">
          <div className="relative w-12 h-12 rounded-full overflow-hidden shrink-0">
            <Image
              src="/images/camilla-zap.jpg"
              alt="Dra. Camilla Freitas"
              fill
              className="object-cover"
              sizes="48px"
            />
          </div>
          <p className="font-sans text-sm text-brown/70">Dra. Camilla Freitas · CRF/PE 4563</p>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────── 5. Footer ─────────────────────────────── */

function FooterSection() {
  return (
    <footer className="px-6 py-10 text-center bg-white border-t border-gray-100">
      <p className="font-sans text-xs text-brown/60 mb-1">
        © 2026 Gerando Milagres · Dra. Camilla Freitas · CRF/PE 4563
      </p>
      <p className="font-sans text-xs text-brown/40">
        Este material é educativo e não substitui acompanhamento profissional
      </p>
    </footer>
  );
}
