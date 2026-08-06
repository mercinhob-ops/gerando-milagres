import type { Metadata, Viewport } from "next";
import { CicloGmApp } from "./ciclogm-app";

export const metadata: Metadata = {
  title: "CicloGM — Dra. Camilla Freitas",
  description:
    "Registre sua temperatura basal e os sinais do seu ciclo com o CicloGM, ferramenta de autoconhecimento da Dra. Camilla Freitas.",
  robots: { index: false, follow: false },
  manifest: "/ciclogm-manifest.webmanifest",
  applicationName: "CicloGM",
  appleWebApp: {
    capable: true,
    title: "CicloGM",
    statusBarStyle: "default",
  },
};

export const viewport: Viewport = {
  themeColor: "#C4867A",
  width: "device-width",
  initialScale: 1,
};

export default function CicloGmPage() {
  return <CicloGmApp />;
}
