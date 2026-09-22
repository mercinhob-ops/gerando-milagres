import type { Metadata } from "next";
import { CasalGm3Content } from "./casalgm3-content";

export const metadata: Metadata = {
  title: "Checklist da Fertilidade Masculina — Dra. Camilla Freitas",
  description:
    "Marque os hábitos que fazem parte do seu dia a dia hoje e descubra o que pode estar afetando a fertilidade masculina.",
  robots: { index: false, follow: false },
};

export default function CasalGm3Page() {
  return <CasalGm3Content />;
}
