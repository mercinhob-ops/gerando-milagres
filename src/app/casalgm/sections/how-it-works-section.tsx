import { Stethoscope, Salad, Sparkles } from "lucide-react";

const steps = [
  {
    number: "1",
    icon: Stethoscope,
    title: "Entender o Corpo",
    desc: "Ciclo, exames e hormônios explicados de forma simples, para vocês entenderem o que está acontecendo.",
  },
  {
    number: "2",
    icon: Salad,
    title: "Preparar Juntos",
    desc: "Alimentação, suplementação e mente — hábitos que os dois constroem lado a lado.",
  },
  {
    number: "3",
    icon: Sparkles,
    title: "Florescer a Dois",
    desc: "Conexão, fé e os próximos passos para caminharem unidos rumo à gravidez.",
  },
] as const;

export function HowItWorksSection() {
  return (
    <section className="py-20 px-6 bg-white">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-14">
          <p className="font-sans text-xs font-semibold tracking-widest text-salmon uppercase mb-4">
            Como funciona
          </p>
          <h2 className="font-['Georgia',serif] text-3xl md:text-4xl font-bold text-dark-brown leading-snug">
            Um caminho claro, em 3 etapas
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {steps.map(({ number, icon: Icon, title, desc }) => (
            <div key={number} className="bg-cream rounded-2xl p-7 text-center shadow-sm border border-nude-dark/30">
              <div className="w-16 h-16 rounded-full bg-salmon/15 flex items-center justify-center mx-auto mb-5">
                <Icon className="w-8 h-8 text-salmon" aria-hidden="true" />
              </div>
              <p className="font-sans text-xs font-bold text-salmon uppercase tracking-widest mb-2">
                Etapa {number}
              </p>
              <h3 className="font-['Georgia',serif] text-xl font-bold text-dark-brown mb-3">{title}</h3>
              <p className="font-sans text-sm text-gray-600 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
