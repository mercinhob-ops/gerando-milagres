"use client";

import { useEffect } from "react";
import { setStickyHeaderCheckout } from "./sticky-header-store";

export function StickyHeaderCheckout({
  checkoutUrl,
  eventValue,
  onCheckoutClick,
}: {
  checkoutUrl: string;
  eventValue?: number;
  onCheckoutClick?: () => void;
}) {
  useEffect(() => {
    setStickyHeaderCheckout({ checkoutUrl, eventValue, onCheckoutClick });
    return () => setStickyHeaderCheckout(null);
  }, [checkoutUrl, eventValue, onCheckoutClick]);

  return null;
}
