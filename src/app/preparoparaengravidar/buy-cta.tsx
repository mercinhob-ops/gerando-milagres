import { EntryCheckoutCta } from "@/components/funnel/entry-checkout-cta";
import { formatPrice, isCheckoutReady } from "@/config/funnels/ciclo-feminino";
import {
  PRICE_IS_PROVISIONAL,
  preparoParaEngravidarFunnel as funnel,
} from "@/config/funnels/preparo-para-engravidar";
import { preparoParaEngravidarContent as c } from "./content";

const product = funnel.product;
export const PRICE = formatPrice(product.price);
export const CHECKOUT_READY = isCheckoutReady(product);

/**
 * CTA de compra único da página (hero, oferta, final e barra do celular).
 * Ativa sozinho quando a configuração central receber o link oficial da
 * Kiwify (`checkoutReady`); até lá, botão desativado sem link.
 */
export function BuyCta({
  className = "",
  compact = false,
}: {
  className?: string;
  /** Versão curta para a barra fixa do celular. */
  compact?: boolean;
}) {
  if (!CHECKOUT_READY) {
    return (
      <button
        type="button"
        disabled
        data-checkout-pending
        className={`flex min-h-12 w-full cursor-not-allowed items-center justify-center rounded-full bg-[#E8D0C0] px-5 py-3 text-center font-sans text-[15px] font-semibold text-dark-brown ${className}`}
      >
        {compact ? c.buyBar.unavailableLabel : c.hero.unavailableLabel}
      </button>
    );
  }
  return (
    <EntryCheckoutCta
      product={product}
      funnelSlug={funnel.slug}
      label={compact ? "Quero o guia" : c.hero.ctaLabel}
      className={`min-h-12 w-full justify-center px-5 py-3 text-[13px] uppercase tracking-wide sm:text-sm ${className}`}
    />
  );
}

/** Preço vindo da configuração central, sempre identificado enquanto for provisório. */
export function PriceTag({
  light = false,
  align = "right",
  size = "lg",
}: {
  light?: boolean;
  align?: "left" | "right" | "center";
  size?: "lg" | "sm";
}) {
  return (
    <div className={align === "right" ? "text-right" : align === "center" ? "text-center" : "text-left"}>
      <p
        data-price
        className={`font-display font-bold leading-none ${size === "lg" ? "text-[1.75rem]" : "text-xl"} ${light ? "text-white" : "text-dark-brown"}`}
      >
        {PRICE}
      </p>
      {PRICE_IS_PROVISIONAL && (
        <p data-price-provisional className={`mt-1 font-sans text-xs ${light ? "text-[#E8D0C0]" : "text-brown"}`}>
          {c.hero.provisionalPrice}
        </p>
      )}
    </div>
  );
}
