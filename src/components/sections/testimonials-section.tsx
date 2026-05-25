import { Heading } from "@/components/design-system/heading";
import { Container } from "@/components/design-system/container";
import { Section } from "@/components/design-system/section";

const videos = [
  {
    id: "YtnEK5VDuC0",
    title: "Depoimento 1 — Gerando Milagres",
  },
  {
    id: "r3nvI7zs3Pc",
    title: "Depoimento 2 — Gerando Milagres",
  },
] as const;

export function TestimonialsSection() {
  return (
    <Section id="depoimentos" className="bg-[#F0E6DC]">
      <Container>
        {/* Header */}
        <div className="text-center mb-12">
          <p className="font-sans text-xs font-semibold tracking-widest text-brown uppercase mb-4">
            Depoimentos
          </p>
          <Heading as="h2" size="h2" className="text-gray-900">
            Resultados reais de mulheres reais
          </Heading>
          <p className="font-sans text-base text-gray-600 mt-3">
            Veja o que elas têm a dizer
          </p>
        </div>

        {/* Videos — 9:16 vertical (Shorts format) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-2xl mx-auto">
          {videos.map((v) => (
            <div
              key={v.id}
              className="relative w-full overflow-hidden rounded-2xl shadow-lg bg-gray-900"
              style={{ aspectRatio: "9/16" }}
            >
              <iframe
                src={`https://www.youtube-nocookie.com/embed/${v.id}`}
                title={v.title}
                loading="lazy"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                className="absolute inset-0 w-full h-full border-0"
              />
            </div>
          ))}
        </div>
      </Container>
    </Section>
  );
}
