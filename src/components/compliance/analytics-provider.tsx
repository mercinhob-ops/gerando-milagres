"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Script from "next/script";
import { trackConversionEvent } from "@/lib/meta-conversions";

const PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID;

declare global {
  interface Window {
    fbq: (...args: unknown[]) => void;
    _fbq: unknown;
    trackEvent: (event: string, params?: Record<string, unknown>) => void;
  }
}

export function AnalyticsProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [pixelReady, setPixelReady] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    window.trackEvent = (event: string, params?: Record<string, unknown>) => {
      if (typeof window.fbq === "function") {
        window.fbq("track", event, params);
      }
    };
  }, []);

  useEffect(() => {
    if (!pixelReady) return;
    trackConversionEvent({ eventName: "PageView" });
  }, [pathname, pixelReady]);

  return (
    <>
      {children}
      {PIXEL_ID && (
        <Script
          id="meta-pixel"
          strategy="afterInteractive"
          onLoad={() => setPixelReady(true)}
          dangerouslySetInnerHTML={{
            __html: `
              !function(f,b,e,v,n,t,s)
              {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
              n.callMethod.apply(n,arguments):n.queue.push(arguments)};
              if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
              n.queue=[];t=b.createElement(e);t.async=!0;
              t.src=v;s=b.getElementsByTagName(e)[0];
              s.parentNode.insertBefore(t,s)}(window,document,'script',
              'https://connect.facebook.net/en_US/fbevents.js');
              fbq('init','${PIXEL_ID}');
            `,
          }}
        />
      )}
    </>
  );
}
