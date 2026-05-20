import { Button } from "@/components/design-system/button";
import { Section } from "@/components/design-system/section";
import { Container } from "@/components/design-system/container";
import { Heading, Subheading } from "@/components/design-system/heading";
import { BodyText } from "@/components/design-system/body-text";

const brandColors = [
  { name: "Lilás", hex: "#B39DDB", bg: "bg-[#B39DDB]" },
  { name: "Roxo Suave", hex: "#9575CD", bg: "bg-[#9575CD]" },
  { name: "Nude", hex: "#F5E6D3", bg: "bg-[#F5E6D3]", border: true },
  { name: "Branco", hex: "#FFFFFF", bg: "bg-white", border: true },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      {/* Hero canary */}
      <section
        className="flex min-h-screen flex-col items-center justify-center text-center px-4"
        style={{ background: "linear-gradient(160deg, #F5E6D3 0%, #D1C4E9 50%, #ffffff 100%)" }}
      >
        <div className="max-w-2xl mx-auto space-y-6">
          <p className="font-sans text-sm font-semibold tracking-widest text-soft-purple uppercase">
            Em breve
          </p>
          <Heading
            as="h1"
            size="h1"
            className="text-gray-900"
          >
            Gerando Milagres
          </Heading>
          <Subheading className="text-gray-600 max-w-lg mx-auto">
            Um programa de 3 meses para preparar seu corpo para ser um ambiente
            mais fértil e preparado para gerar vida.
          </Subheading>
          <div className="flex flex-wrap gap-3 justify-center pt-4">
            <Button variant="primary" size="lg">
              Quero preparar meu corpo
            </Button>
            <Button variant="secondary" size="lg">
              Saiba mais
            </Button>
          </div>
        </div>
      </section>

      {/* Paleta de cores */}
      <Section className="bg-white">
        <Container>
          <Heading as="h2" size="h3" className="text-gray-800 mb-8 text-center">
            Identidade Visual
          </Heading>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
            {brandColors.map((color) => (
              <div key={color.name} className="text-center">
                <div
                  className={`h-20 rounded-xl ${color.bg} ${color.border ? "border border-gray-200" : ""} mb-2`}
                />
                <BodyText variant="caption" className="font-semibold">
                  {color.name}
                </BodyText>
                <BodyText variant="caption" className="font-mono">
                  {color.hex}
                </BodyText>
              </div>
            ))}
          </div>

          {/* Tipografia */}
          <Heading as="h2" size="h3" className="text-gray-800 mb-6 text-center">
            Tipografia
          </Heading>
          <div className="space-y-4 max-w-2xl mx-auto">
            <div>
              <BodyText variant="caption" className="mb-1">Playfair Display — Headline</BodyText>
              <Heading as="h1" size="h1">Prepare seu corpo</Heading>
            </div>
            <div>
              <BodyText variant="caption" className="mb-1">Playfair Display — Subheading</BodyText>
              <Heading as="h2" size="h2">O Método Gerando Milagres</Heading>
            </div>
            <div>
              <BodyText variant="caption" className="mb-1">Inter — Corpo de texto</BodyText>
              <BodyText variant="lg">
                Camilla é farmacêutica e viveu perdas gestacionais. Essa
                experiência transformou sua visão sobre fertilidade.
              </BodyText>
            </div>
          </div>
        </Container>
      </Section>

      {/* Botões */}
      <Section className="bg-nude">
        <Container>
          <Heading as="h2" size="h3" className="text-gray-800 mb-8 text-center">
            Componentes
          </Heading>
          <div className="flex flex-wrap gap-4 justify-center">
            <Button variant="primary">Primary</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="primary" size="sm">Small</Button>
            <Button variant="primary" size="lg">Large</Button>
          </div>
        </Container>
      </Section>

      {/* Rodapé canary */}
      <footer className="border-t border-gray-100 py-6 text-center">
        <BodyText variant="caption">
          Gerando Milagres · Página de preview interno ·{" "}
          <a href="/dev/design-tokens" className="underline hover:text-lilac">
            Design Tokens
          </a>
        </BodyText>
      </footer>
    </main>
  );
}
