import { camillaStory } from "@/data/camilla";
import { Heading } from "@/components/design-system/heading";
import { Container } from "@/components/design-system/container";
import { Section } from "@/components/design-system/section";

export function CamillaSection() {
  const { eyebrow, headline, personal, credential } = camillaStory;

  return (
    <Section id="historia" className="bg-white">
      <Container>
        <div className="flex flex-col md:flex-row gap-10 lg:gap-16 items-center">

          {/* Photo column */}
          <div className="w-full md:w-2/5 shrink-0">
            {/*
              Placeholder editorial — substituir por:
              <Image src="/camilla.jpg" alt="Camilla Freitas" fill className="object-cover" />
              quando a foto real estiver disponível em public/camilla.jpg
            */}
            <div
              className="relative w-full aspect-[3/4] rounded-3xl overflow-hidden"
              style={{
                background:
                  "linear-gradient(160deg, #F0E6DC 0%, #C4867A 60%, #6B4239 100%)",
              }}
              aria-label="Foto de Camilla Freitas"
              role="img"
            >
              <div className="absolute inset-0 flex flex-col items-center justify-end p-6">
                <div className="text-center text-white/90">
                  <p className="font-display text-lg font-bold drop-shadow">
                    {credential.name}
                  </p>
                  <p className="font-sans text-xs tracking-wide drop-shadow">
                    {credential.role}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Text column */}
          <div className="w-full md:w-3/5 space-y-6">
            <div>
              <p className="font-sans text-xs font-semibold tracking-widest text-brown uppercase mb-4">
                {eyebrow}
              </p>
              <Heading as="h2" size="h2" className="text-gray-900">
                {headline}
              </Heading>
            </div>

            {/* Personal narrative */}
            <div className="space-y-4">
              {personal.split("\n\n").map((paragraph, i) => (
                <p
                  key={i}
                  className="font-display text-base md:text-lg italic text-gray-700 leading-relaxed"
                >
                  {paragraph}
                </p>
              ))}
            </div>

            {/* Professional credential */}
            <div className="border-l-4 border-salmon pl-5 py-1 space-y-1">
              <p className="font-sans font-semibold text-brown">
                {credential.name}
              </p>
              <p className="font-sans text-xs font-semibold tracking-wide text-salmon uppercase">
                {credential.role}
              </p>
              <p className="font-sans text-sm text-gray-600 leading-relaxed mt-2">
                {credential.description}
              </p>
            </div>
          </div>

        </div>
      </Container>
    </Section>
  );
}
