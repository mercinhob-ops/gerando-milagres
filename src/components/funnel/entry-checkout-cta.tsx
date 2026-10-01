import { CheckoutCta } from "@/components/marketing/checkout-cta";
import { buttonVariants } from "@/components/design-system/button";
import { cn } from "@/lib/utils";
import { isCheckoutReady, type FunnelProduct } from "@/config/funnels/ciclo-feminino";

/**
 * CTA da página de entrada. Reutiliza o CheckoutCta existente
 * (InitiateCheckout via Pixel + CAPI). Enquanto o checkout do produto não
 * estiver confirmado em src/config/funnels, mostra um botão inativo
 * claramente identificado — nunca cai no checkout global.
 */
export function EntryCheckoutCta({
  product,
  label,
  className,
}: {
  product: FunnelProduct;
  label: string;
  className?: string;
}) {
  if (isCheckoutReady(product)) {
    return (
      <CheckoutCta
        href={product.checkoutUrl}
        value={product.price}
        productName={product.name}
        label={label}
        className={className}
      />
    );
  }

  return (
    <span
      role="button"
      aria-disabled="true"
      data-checkout-pending={product.id}
      title="Checkout Kiwify ainda não configurado em src/config/funnels/ciclo-feminino.ts"
      className={cn(
        buttonVariants({ variant: "primary", size: "lg" }),
        "inline-flex flex-col gap-0.5 cursor-not-allowed bg-salmon/80 hover:bg-salmon/80 outline-2 outline-dashed outline-offset-4 outline-amber-500/70",
        className
      )}
    >
      <span>{label}</span>
      <span className="text-[10px] font-bold uppercase tracking-widest text-white/85">
        Checkout pendente
      </span>
    </span>
  );
}
