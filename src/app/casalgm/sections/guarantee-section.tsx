export function GuaranteeSection() {
  return (
    <section className="py-20 px-6 bg-white">
      <div className="max-w-2xl mx-auto text-center">
        <div
          className="w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg"
          style={{ background: "linear-gradient(145deg, #F0E6DC, #E8D0C0)" }}
          aria-hidden="true"
        >
          <span className="text-5xl">🏅</span>
        </div>

        <h2 className="font-['Georgia',serif] text-2xl md:text-3xl font-bold text-dark-brown mb-4 leading-snug">
          Garantia de 7 Dias — Sem Riscos
        </h2>

        <p className="font-sans text-gray-600 leading-relaxed max-w-lg mx-auto">
          Se nos primeiros <strong className="text-brown">7 dias</strong> vocês sentirem que o material não é
          para vocês, devolvemos 100% do valor investido. Sem perguntas, sem burocracia — o risco é nosso, o
          florescer é de vocês.
        </p>
      </div>
    </section>
  );
}
