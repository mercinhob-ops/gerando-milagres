import type { Metadata } from "next";
import { TentantesBase } from "@/components/tentantes/TentantesBase";
import { tentantesConfig } from "./config";

export const metadata: Metadata = {
  title: "Questionário para Tentantes — Dra. Camilla Freitas",
  description:
    "Responda algumas perguntas rápidas sobre a sua jornada para engravidar e receba o material da Dra. Camilla Freitas.",
  robots: { index: false, follow: false },
};

export default function TentantesPage() {
  return <TentantesBase config={tentantesConfig} />;
}
