import { HeroSection } from "@/components/sections/hero-section";
import { IdentifySection } from "@/components/sections/identify-section";
import { CamillaSection } from "@/components/sections/camilla-section";

export default function Home() {
  return (
    <main>
      <HeroSection />
      <IdentifySection />
      <CamillaSection />

      {/* Placeholder anchor — seções futuras (Stories 2.4–2.8) serão adicionadas aqui */}
      <div id="inscricao" aria-hidden="true" />
    </main>
  );
}
