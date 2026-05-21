import Image from "next/image";
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
            <div className="relative w-full aspect-[3/4] rounded-3xl overflow-hidden shadow-lg">
              <Image
                src="/images/camilla-story.jpg"
                alt="Camilla Freitas"
                fill
                className="object-cover object-top"
                sizes="(max-width: 768px) 100vw, 40vw"
              />
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
