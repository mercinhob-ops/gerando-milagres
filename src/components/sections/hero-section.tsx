import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/design-system/button";
import { Heading, Subheading } from "@/components/design-system/heading";

export function HeroSection() {
  return (
    <section
      id="hero"
      className="relative flex min-h-[100svh] md:min-h-[80vh] flex-col items-center justify-center text-center px-4 overflow-hidden"
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

      <div className="relative z-10 max-w-3xl mx-auto space-y-6 animate-[fade-in_0.8s_ease-out_forwards]">
        <p className="font-sans text-xs font-semibold tracking-widest text-brown uppercase">
          Fertilidade Natural &amp; Suplementação
        </p>

        <Heading as="h1" size="h1" className="text-gray-900">
          Seu corpo pode ser o lar do{" "}
          <em className="not-italic text-brown">milagre</em> que você espera
        </Heading>

        <Subheading className="max-w-xl mx-auto text-gray-600">
          Aprenda a preparar seu corpo para gerar vida — com protocolos
          científicos, suplementação estratégica e o cuidado humano que você
          merece.
        </Subheading>

        <div className="flex items-center justify-center gap-3 text-sm text-brown/60">
          <span className="w-8 h-px bg-brown/30" aria-hidden="true" />
          <span className="font-sans font-medium">
            Camilla Freitas — Farmacêutica CRF/PE 4563
          </span>
          <span className="w-8 h-px bg-brown/30" aria-hidden="true" />
        </div>

        <div className="pt-2">
          <a
            href="#inscricao"
            className={cn(
              buttonVariants({ variant: "primary", size: "lg" }),
              "inline-flex"
            )}
          >
            Quero preparar meu corpo
          </a>
        </div>
      </div>
    </section>
  );
}
