"use client";

import { trackConversionEvent } from "@/lib/meta-conversions";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/design-system/button";

const CHECKOUT_URL = "https://pay.hotmart.com/D106943069P";

export function CheckoutCta({
  label,
  className,
}: {
  label: string;
  className?: string;
}) {
  function handleClick() {
    trackConversionEvent({
      eventName: "InitiateCheckout",
      customData: {
        value: 57.9,
        currency: "BRL",
        content_name: "Florescer a Dois",
      },
    });
  }

  return (
    <a
      href={CHECKOUT_URL}
      target="_blank"
      rel="noopener noreferrer"
      onClick={handleClick}
      className={cn(
        buttonVariants({ variant: "primary", size: "lg" }),
        "inline-flex",
        className
      )}
    >
      {label}
    </a>
  );
}
