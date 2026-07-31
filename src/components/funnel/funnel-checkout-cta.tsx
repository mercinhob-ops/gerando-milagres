"use client";

import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/design-system/button";
import { trackConversionEvent } from "@/lib/meta-conversions";

export function FunnelCheckoutCta({
  href,
  label,
  value,
  contentName,
}: {
  href: string;
  label: string;
  value?: number;
  contentName: string;
}) {
  function handleClick() {
    if (value === undefined) return;
    trackConversionEvent({
      eventName: "InitiateCheckout",
      customData: { value, currency: "BRL", content_name: contentName },
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
        "w-full justify-center text-center"
      )}
    >
      {label}
    </a>
  );
}
