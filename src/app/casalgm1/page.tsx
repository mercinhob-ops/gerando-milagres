import type { Metadata } from "next";
import { CasalGm1Content } from "./casalgm1-content";

export const metadata: Metadata = {
  title: "Florescer a Dois — Dra. Camilla Freitas",
  description:
    "Transforme o sonho de vocês em realidade. Descubra os pilares essenciais para vocês conquistarem a gravidez que sempre desejaram.",
  robots: { index: false, follow: false },
};

export default function CasalGm1Page() {
  return <CasalGm1Content />;
}
