import { Users } from "lucide-react";

export function SocialProofSection() {
  return (
    <section className="py-14 px-6 bg-cream">
      <div className="max-w-4xl mx-auto text-center">
        <p className="font-['Georgia',serif] text-xl md:text-2xl font-semibold text-dark-brown mb-8 leading-snug">
          Mais de <span className="text-salmon">500 casais</span> já transformaram sua jornada com a Dra. Camilla
        </p>

        <div className="grid grid-cols-5 gap-3 md:gap-4 mb-6">
          {Array.from({ length: 5 }, (_, i) => i).map((i) => (
            <div
              key={i}
              className="aspect-square rounded-2xl shadow-sm flex items-center justify-center"
              style={{ background: "linear-gradient(135deg, #C4867A 0%, #E8D0C0 100%)" }}
              aria-hidden="true"
            >
              <Users className="w-6 h-6 md:w-8 md:h-8 text-white/70" />
            </div>
          ))}
        </div>

        <p className="font-sans text-brown/70 text-base md:text-lg italic">Agora é a vez de vocês.</p>
      </div>
    </section>
  );
}
