import { CheckoutCta } from "../checkout-cta";

export function FinalCtaSection() {
  return (
    <section
      className="py-24 px-6 text-center relative overflow-hidden"
      style={{ background: "linear-gradient(160deg, #4A2E26 0%, #6B4239 100%)" }}
    >
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute top-[-10%] right-[-5%] w-[30vw] h-[30vw] rounded-full bg-salmon/10 blur-3xl" />
        <div className="absolute bottom-[-10%] left-[-5%] w-[28vw] h-[28vw] rounded-full bg-nude/10 blur-3xl" />
      </div>

      <div className="relative z-10 max-w-2xl mx-auto space-y-7">
        <p className="font-sans text-xs font-semibold tracking-widest text-salmon uppercase">Chegou a hora</p>
        <h2 className="font-['Georgia',serif] text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight">
          Não percam mais um ciclo — esse pode ser o de vocês.
        </h2>
        <p className="font-sans text-nude/80 text-lg leading-relaxed max-w-xl mx-auto">
          Corpo, mente, suplementação e fé — tudo o que vocês precisam para caminhar juntos, de mãos dadas,
          rumo à gravidez.
        </p>

        <div className="pt-2">
          <CheckoutCta
            label="Quero o Florescer a Dois →"
            className="bg-salmon hover:bg-salmon/90 text-lg px-10 py-5"
          />
        </div>
      </div>
    </section>
  );
}
