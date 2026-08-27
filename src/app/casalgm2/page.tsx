import type { Metadata } from "next";
import { CasalGm2Content } from "./casalgm2-content";

export const metadata: Metadata = {
  title: "Flourishing Together — Dr. Camilla Freitas",
  description:
    "The first step to getting pregnant together. A practical, warm guide for couples dreaming of pregnancy — body, mind, supplementation, and faith, walking side by side.",
  robots: { index: false, follow: false },
};

export default function CasalGm2Page() {
  return <CasalGm2Content />;
}
