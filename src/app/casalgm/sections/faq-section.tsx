"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

const faqs = [
  {
    question: "Para quem é o Florescer a Dois?",
    answer:
      "Para casais que estão tentando engravidar e querem caminhar juntos nessa jornada — entendendo o corpo um do outro, os exames necessários e como se preparar, com ciência e fé.",
  },
  {
    question: "É um curso ou um ebook?",
    answer:
      "É um guia digital em PDF, com 9 capítulos organizados em fundamentos, preparação e florescimento. Vocês leem no seu tempo, no celular ou computador.",
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

export function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="py-20 px-6 bg-cream">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="font-['Georgia',serif] text-3xl md:text-4xl font-bold text-dark-brown leading-snug">
            Perguntas frequentes
          </h2>
        </div>

        <div className="bg-white rounded-2xl border border-nude-dark/30 shadow-sm px-6 divide-y divide-nude-dark/30">
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
                  <span className="font-sans font-semibold text-base text-dark-brown group-hover:text-salmon transition-colors">
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
