"use client";

import { trackConversionEvent } from "@/lib/meta-conversions";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/design-system/button";

export function CheckoutCta({
  href,
  value,
  productName,
  label,
  className,
}: {
  href: string;
  value: number;
  productName: string;
  label: string;
  className?: string;
}) {
  function handleClick() {
    trackConversionEvent({
      eventName: "InitiateCheckout",
      customData: { value, currency: "BRL", content_name: productName },
    });
  }

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onClick={handleClick}
      className={cn(
        buttonVariants({ variant: "primary", size: "lg" }),
        "bg-salmon hover:bg-salmon/90 shadow-[0_10px_30px_rgba(196,134,122,0.45)] hover:shadow-[0_14px_36px_rgba(196,134,122,0.55)] transition-all duration-200 hover:-translate-y-0.5 inline-flex",
        className
      )}
    >
      {label}
    </a>
  );
}
