import Image from "next/image";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/design-system/button";
import { CheckCircle2, Lock } from "lucide-react";

interface FunnelPageLayoutProps {
  badge: string;
  headline: string;
  subheadline: string;
  imageSrc: string;
  imageAlt: string;
  benefits: readonly string[];
  price: string;
  priceNote?: string;
  ctaLabel: string;
  ctaHref: string;
  declineLabel: string;
  declineHref: string;
}

export function FunnelPageLayout({
  badge,
  headline,
  subheadline,
  imageSrc,
  imageAlt,
  benefits,
  price,
  priceNote,
  ctaLabel,
  ctaHref,
  declineLabel,
  declineHref,
}: FunnelPageLayoutProps) {
  return (
    <main
      className="min-h-screen"
      style={{ background: "linear-gradient(180deg, #F0E6DC 0%, #ffffff 60%)" }}
    >
      <div className="max-w-5xl mx-auto px-4 py-12 md:py-16">

        {/* Badge */}
        <div className="flex justify-center mb-10">
          <span className="inline-flex items-center gap-2 bg-[#C4867A]/10 border border-[#C4867A]/30 rounded-full px-5 py-2">
            <span className="w-2 h-2 rounded-full bg-[#C4867A] animate-pulse shrink-0" aria-hidden="true" />
            <span className="font-sans text-xs font-semibold text-[#6B4239] uppercase tracking-widest">
              {badge}
            </span>
          </span>
        </div>

        {/* Two-column layout */}
        <div className="flex flex-col md:flex-row gap-12 items-start">

          {/* Left: copy + CTA */}
          <div className="flex-1 space-y-8">

            {/* Headline block */}
            <div className="space-y-4">
              <h1 className="font-display text-3xl md:text-4xl lg:text-5xl text-gray-900 leading-tight">
                {headline}
              </h1>
              <p className="font-sans text-base md:text-lg text-gray-600 leading-relaxed">
                {subheadline}
              </p>
            </div>

            {/* Benefits */}
            <ul className="space-y-3" aria-label="O que está incluído">
              {benefits.map((benefit, i) => (
                <li key={i} className="flex items-start gap-3">
                  <CheckCircle2
                    className="w-5 h-5 text-[#C4867A] shrink-0 mt-0.5"
                    aria-hidden="true"
                  />
                  <span className="font-sans text-gray-700 leading-snug">
                    {benefit}
                  </span>
                </li>
              ))}
            </ul>

            {/* Price + CTA card */}
            <div className="bg-white rounded-2xl border border-[#D4B5A0] shadow-sm p-6 space-y-5">
              <div>
                <p className="font-sans text-xs font-semibold tracking-widest text-[#C4867A] uppercase mb-1">
                  Investimento
                </p>
                <p className="font-display text-5xl font-bold text-[#6B4239] leading-none">
                  {price}
                </p>
                {priceNote && (
                  <p className="font-sans text-sm text-gray-500 mt-2">{priceNote}</p>
                )}
              </div>

              <a
                href={ctaHref}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  buttonVariants({ variant: "primary", size: "lg" }),
                  "w-full justify-center text-center"
                )}
              >
                {ctaLabel}
              </a>

              <div className="flex items-center justify-center gap-1.5 text-gray-400">
                <Lock className="w-3.5 h-3.5" aria-hidden="true" />
                <span className="font-sans text-xs">Pagamento 100% seguro</span>
              </div>
            </div>

            {/* Decline link */}
            <div className="text-center pt-2">
              <a
                href={declineHref}
                className="font-sans text-sm text-gray-400 hover:text-gray-600 underline underline-offset-4 transition-colors"
              >
                {declineLabel}
              </a>
            </div>
          </div>

          {/* Right: Camilla photo — sticky on desktop */}
          <div className="w-full md:w-72 lg:w-80 shrink-0 md:sticky md:top-10">
            <div className="relative w-full aspect-[3/4] rounded-3xl overflow-hidden shadow-xl ring-4 ring-white">
              <Image
                src={imageSrc}
                alt={imageAlt}
                fill
                className="object-cover object-top"
                sizes="(max-width: 768px) 100vw, 320px"
              />
            </div>
            <p className="text-center font-sans text-xs text-gray-400 mt-3">
              Camilla Freitas — Farmacêutica CRF/PE 4563
            </p>
          </div>

        </div>
      </div>
    </main>
  );
}
