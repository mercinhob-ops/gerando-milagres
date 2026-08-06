import { CheckCheck } from "lucide-react";

const testimonials = [
  {
    names: "Maria e João",
    message:
      "Depois de 8 meses tentando, o guia nos ajudou a entender que fertilidade é coisa de casal mesmo. Fizemos os exames juntos e hoje estamos grávidos! 💛",
  },
  {
    names: "Ana e Pedro",
    message:
      'A parte da conexão do casal mudou tudo pra gente. O sexo deixou de ser "tarefa" e virou encontro de novo. Recomendamos demais!',
  },
  {
    names: "Camila e Rafael",
    message:
      "Eu não sabia nem por onde começar com os exames. O guia explicou tudo de um jeito simples e acolhedor. Hoje sabemos exatamente o que fazer.",
  },
  {
    names: "Juliana e Marcos",
    message:
      "A parte da fé junto com a ciência foi o que mais tocou a gente. Nos sentimos acompanhados em cada etapa dessa jornada.",
  },
] as const;

export function TestimonialsSection() {
  return (
    <section className="py-20 px-6 bg-cream">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <p className="font-sans text-xs font-semibold tracking-widest text-salmon uppercase mb-4">
            Depoimentos
          </p>
          <h2 className="font-['Georgia',serif] text-3xl md:text-4xl font-bold text-dark-brown leading-snug">
            O que casais estão dizendo
          </h2>
          <p className="font-sans text-xs text-gray-400 mt-3">*Depoimentos ilustrativos</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {testimonials.map(({ names, message }) => (
            <div key={names} className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
              <div className="flex items-center gap-2.5 mb-3">
                <div className="w-9 h-9 rounded-full bg-salmon/20 flex items-center justify-center shrink-0">
                  <span className="font-sans text-sm font-bold text-salmon">{names[0]}</span>
                </div>
                <p className="font-sans text-sm font-semibold text-gray-800">{names}</p>
              </div>
              <div className="bg-[#DCF8C6] rounded-lg rounded-tl-none px-3.5 py-2.5">
                <p className="font-sans text-sm text-gray-800 leading-relaxed">{message}</p>
                <div className="flex justify-end mt-1">
                  <CheckCheck className="w-3.5 h-3.5 text-blue-500" aria-hidden="true" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
