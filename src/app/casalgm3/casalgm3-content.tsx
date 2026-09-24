"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Check } from "lucide-react";
import { trackConversionEvent } from "@/lib/meta-conversions";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/design-system/button";

const PRICE_VALUE = 57.9;
const PRODUCT_NAME = "Florescer a Dois";

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

const benefits = [
  "Entender como o corpo dele e o dela funcionam juntos para gerar vida",
  "Saber quais exames os dois precisam fazer e o que cada resultado significa",
  "Ter um protocolo anti-inflamatório que os dois conseguem seguir no dia a dia",
  "Melhorar a alimentação, o sono e o estresse — os fatores que mais impactam a fertilidade do casal",
  "Reconectar a intimidade do casal nessa jornada, tirando o peso da obrigação",
  "Unir ciência e fé — preparar o corpo e fortalecer a esperança juntos",
] as const;

export function CasalGm3Content() {
  return (
    <div className="overflow-x-hidden bg-white">
      <HeaderSection />
      <ChecklistSection />
      <BenefitsCtaSection />
      <FooterSection />
    </div>
  );
}

/* ─────────────────────────────── Header ─────────────────────────────── */

function HeaderSection() {
  return (
    <header
      className="px-6 pt-10 pb-8 md:pt-14 md:pb-10 text-center"
      style={{ background: "linear-gradient(160deg, #F0E6DC 0%, #E8D0C0 100%)" }}
    >
      <p className="font-['Georgia',serif] italic text-sm font-bold text-dark-brown mb-1">Gerando Milagres</p>
      <p className="font-sans text-xs font-semibold text-brown/60 uppercase tracking-widest mb-6">
        Dra. Camilla Freitas · CRF/PE 4563
      </p>

      <div className="relative w-28 h-28 rounded-full overflow-hidden mx-auto mb-6 shadow-md">
        <Image
          src="/images/camilla-zap2.jpg"
          alt="Dra. Camilla Freitas"
          fill
          className="object-cover object-top"
          sizes="112px"
        />
      </div>

      <h1 className="font-['Georgia',serif] text-2xl md:text-3xl font-bold text-dark-brown leading-snug max-w-xl mx-auto">
        Checklist da Fertilidade Masculina
      </h1>
    </header>
  );
}

/* ─────────────────────────────── Passo 2 — Checklist ─────────────────────────────── */

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
        <div className="bg-salmon/10 border border-salmon/25 rounded-2xl px-6 py-5 mb-8">
          <p className="font-sans text-sm text-dark-brown leading-relaxed">
            <span aria-hidden="true">🔬</span> Espermatozoides levam cerca de 90 dias para se formar. O que
            muda hoje, o corpo reflete lá na frente.
          </p>
        </div>

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

/* ─────────────────────────────── Passo 3 — CTA final ─────────────────────────────── */

function BenefitsCtaSection() {
  function handleCtaClick() {
    trackConversionEvent({
      eventName: "InitiateCheckout",
      customData: { value: PRICE_VALUE, currency: "BRL", content_name: PRODUCT_NAME },
    });
  }

  return (
    <section className="px-6 py-12 md:py-16 bg-[#F8F8F8]">
      <div className="max-w-lg mx-auto text-center">
        <h2 className="font-['Georgia',serif] text-2xl md:text-3xl font-bold text-dark-brown leading-snug mb-4">
          Você acabou de ver o mapa completo. Mas o caminho é diferente pra cada casal.
        </h2>

        <p className="font-sans text-brown/70 leading-relaxed mb-8">
          Saber que existem hábitos que impactam a fertilidade dele é uma coisa. Saber como os dois ajustam
          isso juntos, na rotina de vocês, sem estresse e com direção certa, é outra.
        </p>

        <ul className="space-y-3 text-left mb-10">
          {benefits.map((benefit) => (
            <li key={benefit} className="flex items-start gap-3">
              <Check className="w-5 h-5 text-salmon shrink-0 mt-0.5" aria-hidden="true" />
              <span className="font-sans text-sm text-dark-brown/90 leading-snug">{benefit}</span>
            </li>
          ))}
        </ul>

        <div className="rounded-2xl px-6 py-6 mb-10" style={{ background: "#9C5B4E" }}>
          <p className="font-['Georgia',serif] text-base md:text-lg font-semibold text-white leading-relaxed">
            Tentar montar esse quebra-cabeça sozinhos, sem direção, logo na fase mais decisiva da preparação
            do casal, é um risco que vocês não precisam correr. Existe um caminho mais seguro.
          </p>
        </div>

        <div className="flex flex-col items-center gap-3 mb-8">
          <div className="relative w-20 h-20 rounded-full overflow-hidden shadow-sm">
            <Image
              src="/images/camilla-zap2.jpg"
              alt="Dra. Camilla Freitas"
              fill
              className="object-cover object-top"
              sizes="80px"
            />
          </div>
          <p className="font-sans text-sm font-bold text-dark-brown">
            Dra. Camilla Freitas — Farmacêutica especialista em fertilidade natural · CRF/PE 4563
          </p>
          <p className="font-sans text-sm text-brown/70">
            Já ajudou mais de 500 casais a prepararem o corpo e conquistarem a gravidez
          </p>
        </div>

        <Link
          href="/casalgm1"
          onClick={handleCtaClick}
          className={cn(
            buttonVariants({ variant: "primary", size: "lg" }),
            "bg-salmon hover:bg-salmon/90 shadow-[0_10px_30px_rgba(196,134,122,0.45)] hover:shadow-[0_14px_36px_rgba(196,134,122,0.55)] transition-all duration-200 hover:-translate-y-0.5 w-full justify-center text-base md:text-lg px-8 py-4"
          )}
        >
          Quero conhecer o caminho →
        </Link>
      </div>
    </section>
  );
}

/* ─────────────────────────────── Footer ─────────────────────────────── */

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
