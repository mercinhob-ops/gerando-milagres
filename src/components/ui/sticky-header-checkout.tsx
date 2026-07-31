"use client";

import { useEffect } from "react";
import { setStickyHeaderCheckout } from "./sticky-header-store";

export function StickyHeaderCheckout({
  checkoutUrl,
  eventValue,
}: {
  checkoutUrl: string;
  eventValue?: number;
}) {
  useEffect(() => {
    setStickyHeaderCheckout({ checkoutUrl, eventValue });
    return () => setStickyHeaderCheckout(null);
  }, [checkoutUrl, eventValue]);

  return null;
}
