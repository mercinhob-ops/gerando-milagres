"use client";

import { useId, useRef, useState, type KeyboardEvent } from "react";
import { Check, FileText } from "lucide-react";

export interface DemoStep {
  title: string;
  text: string;
  points: readonly string[];
  /** Nome e estado do material de apoio, vindos da configuração central. */
  material: { name: string; ready: boolean } | null;
}

/**
 * Demonstração das etapas do guia em abas (padrão WAI-ARIA Tabs):
 * setas, Home e End movem o foco e ativam a etapa.
 */
export function StepsDemo({
  steps,
  panelLabel,
  materialLabel,
  pendingLabel,
  readyLabel,
}: {
  steps: readonly DemoStep[];
  panelLabel: string;
  materialLabel: string;
  pendingLabel: string;
  readyLabel: string;
}) {
  const base = useId();
  const [active, setActive] = useState(0);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const step = steps[active];

  function select(index: number) {
    const next = (index + steps.length) % steps.length;
    setActive(next);
    tabs.current[next]?.focus();
  }

  function onKeyDown(event: KeyboardEvent<HTMLButtonElement>) {
    const moves: Record<string, number> = {
      ArrowRight: active + 1,
      ArrowDown: active + 1,
      ArrowLeft: active - 1,
      ArrowUp: active - 1,
      Home: 0,
      End: steps.length - 1,
    };
    if (event.key in moves) {
      event.preventDefault();
      select(moves[event.key]);
    }
  }

  return (
    <div className="md:grid md:grid-cols-[0.9fr_1.1fr] md:gap-6">
      <div
        role="tablist"
        aria-label="Etapas do guia"
        className="-mx-4 flex snap-x gap-2 overflow-x-auto px-4 pb-2 sm:mx-0 sm:px-0 md:flex-col md:overflow-visible md:pb-0"
      >
        {steps.map((item, i) => {
          const selected = i === active;
          return (
            <button
              key={item.title}
              ref={(el) => {
                tabs.current[i] = el;
              }}
              type="button"
              role="tab"
              id={`${base}-tab-${i}`}
              aria-selected={selected}
              aria-controls={`${base}-panel`}
              tabIndex={selected ? 0 : -1}
              onClick={() => setActive(i)}
              onKeyDown={onKeyDown}
              className={`flex min-h-12 shrink-0 snap-start items-center gap-3 rounded-2xl px-4 py-3 text-left font-sans text-sm font-semibold motion-safe:transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#6B4F7A] md:w-full md:text-[15px] ${
                selected ? "bg-dark-brown text-white" : "bg-white text-dark-brown ring-1 ring-nude-dark/50 hover:ring-[#B9A6C4]"
              }`}
            >
              <span
                aria-hidden="true"
                className={`font-display text-base font-bold ${selected ? "text-[#E8D0C0]" : "text-[#A66458]"}`}
              >
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="whitespace-nowrap md:whitespace-normal">{item.title}</span>
            </button>
          );
        })}
      </div>

      <div
        role="tabpanel"
        id={`${base}-panel`}
        aria-labelledby={`${base}-tab-${active}`}
        tabIndex={0}
        data-step-panel={active + 1}
        className="mt-4 rounded-3xl bg-white p-5 shadow-[0_18px_44px_-24px_rgba(74,46,38,0.35)] ring-1 ring-nude-dark/40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#6B4F7A] sm:p-7 md:mt-0"
      >
        <p className="font-sans text-xs font-semibold uppercase tracking-[0.16em] text-[#6B4F7A]">
          Etapa {active + 1} de {steps.length}
        </p>
        <h3 className="mt-2 font-display text-2xl font-bold leading-snug text-dark-brown md:text-[1.75rem]">{step.title}</h3>
        <p className="mt-3 font-sans text-[15px] leading-relaxed text-brown">{step.text}</p>
        <p className="mt-5 font-sans text-xs font-semibold uppercase tracking-[0.14em] text-brown">{panelLabel}</p>
        <ul className="mt-2.5 space-y-2.5">
          {step.points.map((point) => (
            <li key={point} className="flex items-start gap-2.5 font-sans text-[15px] leading-snug text-dark-brown">
              <Check className="mt-0.5 h-4 w-4 shrink-0 text-[#A66458]" aria-hidden="true" />
              {point}
            </li>
          ))}
        </ul>
        {step.material && (
          <div className="mt-6 flex items-center gap-3 rounded-2xl bg-cream px-4 py-3">
            <FileText className="h-5 w-5 shrink-0 text-brown" aria-hidden="true" />
            <p className="min-w-0 flex-1 font-sans text-sm leading-snug text-dark-brown">
              <span className="block text-xs text-brown">{materialLabel}</span>
              {step.material.name}
            </p>
            <span className="shrink-0 rounded-full bg-white px-2.5 py-0.5 font-sans text-xs font-semibold text-brown">
              {step.material.ready ? readyLabel : pendingLabel}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
