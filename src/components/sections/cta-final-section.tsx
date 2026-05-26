import Image from "next/image";
import { cn } from "@/lib/utils";
import { siteConfig } from "@/lib/env";
import { buttonVariants } from "@/components/design-system/button";
import { Heading } from "@/components/design-system/heading";
import { Container } from "@/components/design-system/container";
import { Section } from "@/components/design-system/section";

export function CtaFinalSection() {
  return (
    <Section
      id="inscricao"
      className="bg-[#F0E6DC]"
    >
      <Container className="max-w-2xl text-center">
        {/* Social proof photo */}
        <div className="flex justify-center mb-8">
          <div className="relative w-36 h-48 rounded-2xl overflow-hidden shadow-md ring-4 ring-white">
            <Image
              src="/images/camilla-family.jpg"
              alt="Camilla Freitas"
              fill
              className="object-cover object-top"
              sizes="144px"
            />
          </div>
        </div>

        {/* Urgency badge */}
        <div className="inline-flex items-center gap-2 bg-salmon/10 border border-salmon/20 rounded-full px-4 py-1.5 mb-8">
          <span className="w-2 h-2 rounded-full bg-salmon animate-pulse" aria-hidden="true" />
          <span className="font-sans text-xs font-semibold text-brown uppercase tracking-widest">
            Próxima turma com vagas abertas
          </span>
        </div>

        <Heading as="h2" size="h2" className="text-gray-900 mb-4">
          Seu corpo está esperando por esse cuidado
        </Heading>

        <p className="font-sans text-base md:text-lg text-gray-600 leading-relaxed mb-3">
          As turmas têm vagas limitadas para garantir acompanhamento próximo
          de cada aluna — com atenção real, não produção em massa.
        </p>
        <p className="font-display italic text-brown text-lg mb-10">
          Quando você estiver pronta, as vagas podem não estar mais.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
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
      </Container>
    </Section>
  );
}
