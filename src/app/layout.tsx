import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { WhatsAppButton } from "@/components/ui/whatsapp-button";
import { AnalyticsProvider } from "@/components/compliance/analytics-provider";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const playfairDisplay = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Gerando Milagres — Prepare seu corpo para gerar vida",
  description:
    "Programa de 3 meses criado pela farmacêutica Camilla para mulheres que querem preparar o corpo para engravidar naturalmente. Ciência, suplementação e humanização.",
  openGraph: {
    title: "Gerando Milagres",
    description: "Prepare seu corpo para ser um ambiente mais fértil e preparado para gerar vida.",
    type: "website",
    locale: "pt_BR",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      className={`${inter.variable} ${playfairDisplay.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-white text-gray-900">
        <AnalyticsProvider>
          {children}
          <WhatsAppButton />
        </AnalyticsProvider>
      </body>
    </html>
  );
}
