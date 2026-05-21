"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import type { FaqItem } from "@/data/faq";

export function FaqAccordion({ items }: { items: readonly FaqItem[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="divide-y divide-nude-dark" role="list">
      {items.map((item, i) => {
        const isOpen = openIndex === i;
        return (
          <div key={i} role="listitem">
            <button
              onClick={() => setOpenIndex(isOpen ? null : i)}
              aria-expanded={isOpen}
              className="w-full flex items-center justify-between py-5 text-left gap-4 group cursor-pointer"
            >
              <span className="font-sans font-semibold text-base md:text-lg text-gray-800 group-hover:text-brown transition-colors">
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
                isOpen
                  ? "grid-rows-[1fr] opacity-100"
                  : "grid-rows-[0fr] opacity-0"
              )}
            >
              <div className="overflow-hidden">
                <p className="font-sans text-gray-600 leading-relaxed pb-5 pr-8">
                  {item.answer}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
