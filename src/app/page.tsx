import { HeroSection } from "@/components/sections/hero-section";
import { IdentifySection } from "@/components/sections/identify-section";

export default function Home() {
  return (
    <main>
      <HeroSection />
      <IdentifySection />

      {/* Placeholder anchor — seções futuras (Stories 2.3–2.8) serão adicionadas aqui */}
      <div id="inscricao" aria-hidden="true" />
    </main>
  );
}
