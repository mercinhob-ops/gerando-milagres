import type { Metadata } from "next";
import { QuizClient } from "./quiz-client";

export const metadata: Metadata = {
  title: "Descubra o que pode estar impedindo vocês de engravidarem — Gerando Milagres",
  description:
    "Responda 5 perguntas rápidas e receba um diagnóstico personalizado para o seu casal, com a Dra. Camilla Freitas.",
  robots: { index: false, follow: false },
};

export default function QuizPage() {
  return <QuizClient />;
}
