import { Check } from "lucide-react";

const points = [
  "Estão tentando engravidar há meses sem resultado",
  "Fizeram exames e ouviram que está tudo normal",
  "Não sabem quais exames os dois precisam fazer",
  "Sentem que o sexo virou obrigação",
  "Querem unir ciência e fé nessa jornada",
] as const;

export function ForWhoSection() {
  return (
    <section className="py-20 px-6" style={{ background: "#4A2E26" }}>
      <div className="max-w-2xl mx-auto">
        <h2 className="font-['Georgia',serif] text-3xl md:text-4xl font-bold text-white text-center mb-10 leading-snug">
          Esse guia é para vocês se…
        </h2>
        <ul className="space-y-4">
          {points.map((point) => (
            <li
              key={point}
              className="flex items-start gap-4 bg-white/5 rounded-2xl px-5 py-4 border border-white/10"
            >
              <span className="shrink-0 w-6 h-6 rounded-full bg-white/15 flex items-center justify-center mt-0.5">
                <Check className="w-4 h-4 text-white" aria-hidden="true" />
              </span>
              <p className="font-sans text-white/90 text-base leading-snug">{point}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
