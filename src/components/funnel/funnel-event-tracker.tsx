"use client";

import { useEffect } from "react";
import { trackConversionEvent } from "@/lib/meta-conversions";

export function FunnelEventTracker({
  value,
  contentName,
  currency = "BRL",
}: {
  value: number;
  contentName: string;
  currency?: string;
}) {
  useEffect(() => {
    trackConversionEvent({
      eventName: "InitiateCheckout",
      customData: { value, currency, content_name: contentName },
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
}
