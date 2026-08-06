import type { Metadata } from "next";
import { StickyHeaderCheckout } from "@/components/ui/sticky-header-checkout";
import { CasalGmContent } from "./casalgm-content";

export const metadata: Metadata = {
  title: "Florescer a Dois — Dra. Camilla Freitas",
  description:
    "O primeiro passo para vocês engravidarem juntos. Um guia prático e acolhedor para casais que sonham engravidar — corpo, mente, suplementação e fé, caminhando lado a lado.",
  robots: { index: false, follow: false },
};

export default function CasalGmPage() {
  return (
    <>
      <StickyHeaderCheckout checkoutUrl="https://pay.hotmart.com/D106943069P" eventValue={57.9} />
      <CasalGmContent />
    </>
  );
}
