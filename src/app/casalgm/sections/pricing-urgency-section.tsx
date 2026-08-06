import Image from "next/image";
import { CheckoutCta } from "../checkout-cta";
import { Polaroid } from "./polaroid";

export function PricingUrgencySection() {
  return (
    <section className="py-20 px-6 bg-cream">
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center gap-12 lg:gap-16">
        <div className="w-full md:w-[280px] lg:w-[320px] shrink-0 relative">
          <div className="relative w-full aspect-[3/4] rounded-3xl overflow-hidden shadow-xl">
            <Image
              src="/images/camilla-zap.jpg"
              alt="Dra. Camilla Freitas"
              fill
              className="object-cover object-top"
              sizes="(max-width: 768px) 100vw, 320px"
            />
          </div>
          <Polaroid className="absolute -top-5 -right-8 w-20 rotate-[8deg] hidden sm:block" />
          <Polaroid className="absolute -bottom-5 -left-6 w-20 rotate-[-6deg] hidden sm:block" />
        </div>

        <div className="flex-1 text-center md:text-left space-y-5">
          <div className="inline-flex items-center gap-2 bg-salmon/10 border border-salmon/30 rounded-full px-4 py-1.5">
            <span className="w-2 h-2 rounded-full bg-salmon animate-pulse shrink-0" aria-hidden="true" />
            <p className="font-sans text-xs font-bold text-salmon uppercase tracking-widest">
              As vagas para esse guia encerram em breve!
            </p>
          </div>

          <div>
            <p className="font-sans text-lg text-gray-400 line-through">DE R$ 97,00</p>
            <p className="font-sans text-sm text-brown/60 font-medium mt-2">2x de</p>
            <p className="font-['Georgia',serif] text-6xl font-bold text-salmon leading-none">R$ 28,95</p>
            <p className="font-sans text-base font-bold text-brown mt-3 uppercase tracking-wide">
              ou R$ 57,90 à vista
            </p>
          </div>

          <div className="pt-2">
            <CheckoutCta
              label="Quero garantir minha vaga →"
              className="bg-salmon hover:bg-salmon/90 text-lg px-10 py-5 w-full md:w-auto justify-center"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
