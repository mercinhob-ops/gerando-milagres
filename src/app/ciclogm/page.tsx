import type { Metadata, Viewport } from "next";
import { CicloGmApp } from "./ciclogm-app";

export const metadata: Metadata = {
  title: "Temperatura Basal — Dra. Camilla Freitas",
  description:
    "Registre sua temperatura basal e os sinais do seu ciclo — ferramenta de autoconhecimento da Dra. Camilla Freitas.",
  robots: { index: false, follow: false },
  manifest: "/ciclogm-manifest.webmanifest",
  applicationName: "Temperatura Basal",
  appleWebApp: {
    capable: true,
    title: "Temp. Basal",
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
