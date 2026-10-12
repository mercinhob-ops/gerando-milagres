import type { Metadata } from "next";
import { TentantesContent } from "./tentantes-content";

export const metadata: Metadata = {
  title: "Questionário para Tentantes — Dra. Camilla Freitas",
  description:
    "Responda algumas perguntas rápidas sobre a sua jornada para engravidar e receba o material da Dra. Camilla Freitas.",
  robots: { index: false, follow: false },
};

export default function TentantesPage() {
  return <TentantesContent />;
}
