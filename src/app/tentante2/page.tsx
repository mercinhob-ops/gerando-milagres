import type { Metadata } from "next";
import { TentantesBase } from "@/components/tentantes/TentantesBase";
import { tentante2Config } from "./config";

export const metadata: Metadata = {
  title: "Me conta um pouco sobre você — Dra. Camilla Freitas",
  description: "Responda perguntas rápidas e ganhe um material da Dra. Camilla Freitas.",
  robots: { index: false, follow: false },
};

export default function Tentante2Page() {
  return <TentantesBase config={tentante2Config} />;
}
