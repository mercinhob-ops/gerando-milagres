"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface FaqEntry {
  question: string;
  answer: string;
}

export function FaqAccordion({ items }: { items: readonly FaqEntry[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="bg-white rounded-2xl border border-nude-dark/30 shadow-sm px-6 divide-y divide-nude-dark/30">
      {items.map((item, i) => {
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
  );
}
