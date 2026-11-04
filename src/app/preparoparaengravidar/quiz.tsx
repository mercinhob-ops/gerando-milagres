"use client";

import { useId, useState } from "react";
import { ArrowDown, Check } from "lucide-react";

export interface QuizOption {
  id: string;
  label: string;
  response: string;
}

/**
 * Pergunta de escolha única com resposta acolhedora.
 * Privacidade: a escolha vive só no estado do componente — não é salva,
 * não vai para URL, armazenamento, Pixel, CAPI nem qualquer serviço externo.
 * Acessibilidade: radios nativos (setas do teclado), resposta em região
 * `aria-live` e link para seguir para a próxima seção.
 */
export function Quiz({
  question,
  hint,
  options,
  continueHref,
  continueLabel,
}: {
  question: string;
  hint: string;
  options: readonly QuizOption[];
  continueHref: string;
  continueLabel: string;
}) {
  const name = useId();
  const [selected, setSelected] = useState<string | null>(null);
  const answer = options.find((option) => option.id === selected);

  return (
    <div className="rounded-3xl bg-white p-5 shadow-[0_18px_44px_-24px_rgba(74,46,38,0.35)] ring-1 ring-[#D9CCE0] sm:p-7">
      <fieldset>
        <legend className="font-display text-[1.4rem] font-bold leading-snug text-balance text-dark-brown md:text-[1.75rem]">
          {question}
        </legend>
        <p className="mt-2 font-sans text-xs text-brown">{hint}</p>
        <div className="mt-5 grid gap-2.5 sm:grid-cols-2">
          {options.map((option) => {
            const checked = option.id === selected;
            return (
              <label
                key={option.id}
                data-quiz-option={option.id}
                className={`flex min-h-12 cursor-pointer items-center gap-3 rounded-2xl border px-4 py-3 font-sans text-[15px] leading-snug text-dark-brown motion-safe:transition-colors has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-[#6B4F7A] ${
                  checked ? "border-[#6B4F7A] bg-[#F1EBF4]" : "border-nude-dark/70 bg-white hover:border-[#B9A6C4]"
                }`}
              >
                <input
                  type="radio"
                  name={name}
                  value={option.id}
                  checked={checked}
                  onChange={() => setSelected(option.id)}
                  className="sr-only"
                />
                <span
                  aria-hidden="true"
                  className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border ${
                    checked ? "border-[#6B4F7A] bg-[#6B4F7A]" : "border-nude-dark bg-white"
                  }`}
                >
                  {checked && <Check className="h-3 w-3 text-white" />}
                </span>
                {option.label}
              </label>
            );
          })}
        </div>
      </fieldset>

      <div aria-live="polite" className="empty:hidden">
        {answer && (
          <div data-quiz-response className="mt-5 rounded-2xl bg-[#F1EBF4] p-4 motion-safe:animate-in motion-safe:fade-in sm:p-5">
            <p className="font-sans text-[15px] leading-relaxed text-dark-brown">{answer.response}</p>
            <a
              href={continueHref}
              className="mt-3 inline-flex min-h-11 items-center gap-1.5 font-sans text-sm font-semibold text-[#6B4F7A] underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#6B4F7A]"
            >
              {continueLabel}
              <ArrowDown className="h-4 w-4" aria-hidden="true" />
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
