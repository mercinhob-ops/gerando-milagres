"use client";

import { useEffect, useState } from "react";

const VERSES = [
  {
    text: "Porque eu sei os planos que tenho para vocês, diz o Senhor, planos de prosperar e não de causar dano, planos de dar a vocês esperança e um futuro.",
    reference: "Jeremias 29:11",
  },
  {
    text: "Mas os que esperam no Senhor renovarão as suas forças.",
    reference: "Isaías 40:31",
  },
  {
    text: "Para Deus nada é impossível.",
    reference: "Lucas 1:37",
  },
  {
    text: "Ele é o Deus que realiza o impossível.",
    reference: "Salmos 77:14",
  },
  {
    text: "Todo tempo tem o seu propósito.",
    reference: "Eclesiastes 3:1",
  },
];

const ROTATE_MS = 6000;
const FADE_MS = 400;

export function VerseCarousel() {
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const rotate = window.setInterval(() => {
      setVisible(false);
      window.setTimeout(() => {
        setIndex((current) => (current + 1) % VERSES.length);
        setVisible(true);
      }, FADE_MS);
    }, ROTATE_MS);

    return () => window.clearInterval(rotate);
  }, []);

  const verse = VERSES[index];

  return (
    <div
      className="rounded-2xl bg-nude border border-salmon/30 shadow-[0_4px_12px_rgba(107,66,57,0.06)] px-5 py-4 text-center"
      aria-live="polite"
    >
      <span className="text-xl" aria-hidden="true">
        🕊️
      </span>
      <p
        className="font-['Georgia',serif] italic text-brown text-sm md:text-base leading-relaxed mt-1.5 transition-opacity duration-300"
        style={{ opacity: visible ? 1 : 0 }}
      >
        &ldquo;{verse.text}&rdquo;
      </p>
      <p
        className="font-sans text-xs font-semibold text-salmon mt-2 transition-opacity duration-300"
        style={{ opacity: visible ? 1 : 0 }}
      >
        {verse.reference}
      </p>
    </div>
  );
}
