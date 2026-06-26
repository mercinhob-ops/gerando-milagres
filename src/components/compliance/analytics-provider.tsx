"use client";

import { useEffect, useRef } from "react";
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
  const pathname = usePathname();
  const isInitialMount = useRef(true);

  useEffect(() => {
    window.trackEvent = (event: string, params?: Record<string, unknown>) => {
      if (typeof window.fbq === "function") {
        window.fbq("track", event, params);
      }
    };
  }, []);

  // Pula o mount inicial — PageView do primeiro carregamento é disparado
  // diretamente no Script inline abaixo, garantindo que fbq já está disponível.
  // Navegações SPA subsequentes caem aqui via mudança de pathname.
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    trackConversionEvent({ eventName: "PageView" });
  }, [pathname]);

  return (
    <>
      {children}
      {PIXEL_ID && (
        <Script
          id="meta-pixel"
          strategy="afterInteractive"
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
              fbq('track','PageView');
            `,
          }}
        />
      )}
    </>
  );
}
