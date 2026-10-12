import type { Metadata } from "next";
import { GestanteContent } from "./gestante-content";

export const metadata: Metadata = {
  title: "Alimentação na Gestação — Dra. Camilla Freitas",
  description:
    "O seu bebê muda a cada trimestre. A sua alimentação também deveria. Receba o material da Dra. Camilla sobre alimentação na gestação.",
  robots: { index: false, follow: false },
};

export default function GestantePage() {
  return <GestanteContent />;
}
