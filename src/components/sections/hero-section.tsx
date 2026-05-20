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
          "linear-gradient(160deg, #F5E6D3 0%, #D1C4E9 55%, #ffffff 100%)",
      }}
    >
      {/* Organic decorative blobs */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute top-[-8%] right-[-8%] w-[38vw] h-[38vw] rounded-full bg-[#B39DDB]/20 blur-3xl" />
        <div className="absolute bottom-[-6%] left-[-6%] w-[32vw] h-[32vw] rounded-full bg-[#F5E6D3]/60 blur-3xl" />
      </div>

      <div className="relative z-10 max-w-3xl mx-auto space-y-6 animate-[fade-in_0.8s_ease-out_forwards]">
        <p className="font-sans text-xs font-semibold tracking-widest text-soft-purple uppercase">
          Programa de Fertilidade Natural
        </p>

        <Heading as="h1" size="h1" className="text-gray-900">
          Seu corpo pode ser o lar do{" "}
          <em className="not-italic text-soft-purple">milagre</em> que você
          espera
        </Heading>

        <Subheading className="max-w-xl mx-auto text-gray-600">
          Aprenda a preparar seu corpo para gerar vida — com protocolos
          científicos, suplementação estratégica e o cuidado humano que você
          merece.
        </Subheading>

        <div className="pt-4">
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
