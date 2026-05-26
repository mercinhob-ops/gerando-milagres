import Image from "next/image";
import { cn } from "@/lib/utils";
import { siteConfig } from "@/lib/env";
import { buttonVariants } from "@/components/design-system/button";
import { Heading, Subheading } from "@/components/design-system/heading";

export function HeroSection() {
  return (
    <section
      id="hero"
      className="relative flex min-h-[100svh] overflow-hidden"
      style={{
        background:
          "linear-gradient(160deg, #F0E6DC 0%, #E8D0C0 55%, #ffffff 100%)",
      }}
    >
      {/* Organic decorative blobs */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute top-[-8%] right-[-8%] w-[38vw] h-[38vw] rounded-full bg-[#C4867A]/20 blur-3xl" />
        <div className="absolute bottom-[-6%] left-[-6%] w-[32vw] h-[32vw] rounded-full bg-[#E8D0C0]/60 blur-3xl" />
      </div>

      <div className="relative z-10 w-full max-w-6xl mx-auto px-4 flex flex-col md:flex-row items-center gap-10 py-20 md:py-0">

        {/* Text column */}
        <div className="flex-1 text-center md:text-left space-y-6 animate-[fade-in_0.8s_ease-out_forwards]">
          <p className="font-sans text-xs font-semibold tracking-widest text-brown uppercase">
            Fertilidade Natural &amp; Suplementação
          </p>

          <Heading as="h1" size="h1" className="text-gray-900">
            Seu corpo pode ser o lar do{" "}
            <em className="not-italic text-brown">milagre</em> que você espera
          </Heading>

          <Subheading className="md:max-w-lg text-gray-600">
            Aprenda a preparar seu corpo para gerar vida — com protocolos
            científicos, suplementação estratégica e o cuidado humano que você
            merece.
          </Subheading>

          {/* Profile + credential */}
          <div className="flex items-center gap-3 text-sm text-brown/70 justify-center md:justify-start">
            <div className="relative w-10 h-10 rounded-full overflow-hidden shrink-0 ring-2 ring-salmon/40">
              <Image
                src="/images/camilla-profile.jpg"
                alt="Camilla Freitas"
                fill
                className="object-cover object-top"
                sizes="40px"
                priority
              />
            </div>
            <span className="font-sans font-medium">
              Camilla Freitas — Farmacêutica CRF/PE 4563
            </span>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 justify-center md:justify-start pt-2">
            <a
              href={siteConfig.checkoutUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                buttonVariants({ variant: "primary", size: "lg" }),
                "inline-flex"
              )}
            >
              Quero preparar meu corpo
            </a>
          </div>

          {/* Social proof count */}
          <div className="flex items-center gap-3 justify-center md:justify-start">
            <div className="flex -space-x-1.5" aria-hidden="true">
              {[0, 1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="w-7 h-7 rounded-full bg-[#D4B5A0] border-2 border-white"
                />
              ))}
            </div>
            <p className="font-sans text-sm text-brown/70">
              Mais de{" "}
              <span className="font-semibold text-brown">500 mulheres</span>{" "}
              já prepararam o corpo
            </p>
          </div>
        </div>

        {/* Hero image — visible only on md+ */}
        <div className="hidden md:block relative w-[380px] lg:w-[440px] h-[540px] lg:h-[620px] rounded-3xl overflow-hidden shrink-0 shadow-xl">
          <Image
            src="/images/camilla-hero.jpg"
            alt="Camilla Freitas, farmacêutica especialista em fertilidade"
            fill
            className="object-cover object-top"
            sizes="(max-width: 1024px) 380px, 440px"
            priority
          />
        </div>

      </div>
    </section>
  );
}
