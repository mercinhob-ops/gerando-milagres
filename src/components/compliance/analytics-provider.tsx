"use client";

import { useState, useEffect } from "react";
import Script from "next/script";
import { CookieBanner } from "./cookie-banner";

const PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID;
const CONSENT_KEY = "gm_cookie_consent";

declare global {
  interface Window {
    fbq: (...args: unknown[]) => void;
    _fbq: unknown;
    trackEvent: (event: string, params?: Record<string, unknown>) => void;
  }
}

function getInitialConsent(): boolean {
  if (typeof window === "undefined") return false;
  return localStorage.getItem(CONSENT_KEY) === "true";
}

export function AnalyticsProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [consented, setConsented] = useState(getInitialConsent);

  useEffect(() => {
    window.trackEvent = (event: string, params?: Record<string, unknown>) => {
      if (typeof window.fbq === "function") {
        window.fbq("track", event, params);
      }
    };
  }, []);

  function handleConsent() {
    localStorage.setItem(CONSENT_KEY, "true");
    setConsented(true);
  }

  return (
    <>
      {children}
      {!consented && <CookieBanner onAccept={handleConsent} />}
      {consented && PIXEL_ID && (
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
