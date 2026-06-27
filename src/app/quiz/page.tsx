import type { Metadata } from "next";
import { QuizClient } from "./quiz-client";

export const metadata: Metadata = {
  title: "Quiz de Fertilidade — Dra. Camilla Freitas",
  description:
    "Descubra o que pode estar impedindo sua gravidez. Responda 10 perguntas e receba uma recomendação personalizada.",
  robots: { index: false, follow: false },
};

export default function QuizPage() {
  return <QuizClient />;
}
