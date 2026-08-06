import Image from "next/image";
import { Heart } from "lucide-react";
import { CheckoutCta } from "../checkout-cta";
import { Polaroid } from "./polaroid";

const TICKER_TEXT =
  "FLORESCER A DOIS • FERTILIDADE DO CASAL • GERANDO MILAGRES • DRA. CAMILLA FREITAS • ".repeat(3);

export function HeroSection() {
  return (
    <section
      className="relative overflow-hidden"
      style={{ background: "linear-gradient(160deg, #4A2E26 0%, #6B4239 55%, #8B5E52 100%)" }}
    >
      <style>{`
        @keyframes casalgm-ticker-scroll {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
      `}</style>

      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute top-[-10%] right-[-8%] w-[40vw] h-[40vw] rounded-full bg-salmon/10 blur-3xl" />
        <div className="absolute bottom-[-8%] left-[-6%] w-[32vw] h-[32vw] rounded-full bg-nude/10 blur-3xl" />
      </div>

      <div className="relative z-10 w-full max-w-6xl mx-auto px-6 pt-12 md:pt-16 pb-10 flex flex-col md:flex-row items-center gap-12">
        {/* Left: copy */}
        <div className="flex-1 text-center md:text-left space-y-6 order-2 md:order-1">
          <p className="font-['Georgia',serif] italic text-lg font-bold text-white">Gerando Milagres</p>

          <h1 className="font-['Georgia',serif] text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-[1.1]">
            O PRIMEIRO PASSO PARA VOCÊS ENGRAVIDAREM JUNTOS <span aria-hidden="true">🌸</span>
          </h1>

          <p className="font-sans text-lg md:text-xl text-nude/90 leading-relaxed md:max-w-xl">
            O que vocês fazem antes de tentar pode mudar completamente suas chances.
          </p>

          <div className="flex items-center justify-center md:justify-start gap-3">
            <AvatarStack />
            <p className="font-sans text-sm text-nude/70">+500 casais já começaram essa jornada</p>
          </div>

          <div className="pt-2">
            <CheckoutCta
              label="Quero começar minha jornada →"
              className="bg-salmon hover:bg-salmon/90 text-base md:text-lg px-8 py-4"
            />
          </div>
        </div>

        {/* Right: photo + floating polaroids */}
        <div className="order-1 md:order-2 shrink-0 relative w-full max-w-[300px] md:max-w-[360px]">
          <div className="relative w-full aspect-[3/4] rounded-3xl overflow-hidden shadow-2xl">
            <Image
              src="/images/camilla-zap2.jpg"
              alt="Dra. Camilla Freitas"
              fill
              className="object-cover object-top"
              sizes="(max-width: 768px) 300px, 360px"
              priority
            />
          </div>

          <Polaroid className="absolute -top-6 -left-10 w-24 rotate-[-8deg] hidden sm:block" />
          <Polaroid className="absolute top-1/3 -right-8 w-24 rotate-[6deg] hidden sm:block" />
          <Polaroid className="absolute -bottom-6 left-6 w-24 rotate-[4deg] hidden sm:block" />
        </div>
      </div>

      {/* Ticker */}
      <div className="relative z-10 border-t border-white/10 bg-black/10 py-3 overflow-hidden">
        <div className="flex w-max whitespace-nowrap" style={{ animation: "casalgm-ticker-scroll 22s linear infinite" }}>
          <span className="font-sans text-xs font-semibold tracking-widest text-nude/70 uppercase px-4">
            {TICKER_TEXT}
          </span>
          <span className="font-sans text-xs font-semibold tracking-widest text-nude/70 uppercase px-4" aria-hidden="true">
            {TICKER_TEXT}
          </span>
        </div>
      </div>
    </section>
  );
}

function AvatarStack() {
  const colors = ["bg-salmon", "bg-nude", "bg-brown", "bg-nude-dark"];
  return (
    <div className="flex -space-x-3" aria-hidden="true">
      {colors.map((color) => (
        <div
          key={color}
          className={`w-9 h-9 rounded-full ${color} border-2 border-white/80 flex items-center justify-center`}
        >
          <Heart className="w-4 h-4 text-white/90" fill="currentColor" />
        </div>
      ))}
    </div>
  );
}

