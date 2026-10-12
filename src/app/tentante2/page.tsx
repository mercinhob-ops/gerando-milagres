import type { Metadata } from "next";
import { Tentante2Content } from "./tentante2-content";

export const metadata: Metadata = {
  title: "Me conta um pouco sobre você — Dra. Camilla Freitas",
  description: "Responda perguntas rápidas e ganhe um material da Dra. Camilla Freitas.",
  robots: { index: false, follow: false },
};

export default function Tentante2Page() {
  return <Tentante2Content />;
}
