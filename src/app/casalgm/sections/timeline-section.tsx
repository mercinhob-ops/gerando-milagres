import { BookOpen, Salad, Flower2 } from "lucide-react";

const groups = [
  {
    range: "Caps 1-3",
    title: "Fundamentos",
    icon: BookOpen,
    items: ["Conhecer o corpo", "Exames", "Guia da fertilidade"],
  },
  {
    range: "Caps 4-6",
    title: "Preparação",
    icon: Salad,
    items: ["Corpo", "Mente", "Suplementação"],
  },
  {
    range: "Caps 7-9",
    title: "Florescimento",
    icon: Flower2,
    items: ["Movimento", "Conexão do casal", "Fé e espiritualidade"],
  },
] as const;

export function TimelineSection() {
  return (
    <section className="py-20 px-6 bg-cream">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-14">
          <h2 className="font-['Georgia',serif] text-3xl md:text-4xl font-bold text-dark-brown leading-snug">
            O que vocês vão viver com o guia
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {groups.map(({ range, title, icon: Icon, items }) => (
            <div key={range} className="bg-white rounded-2xl p-7 shadow-sm border border-nude-dark/30">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-11 h-11 rounded-full bg-salmon/15 flex items-center justify-center shrink-0">
                  <Icon className="w-5 h-5 text-salmon" aria-hidden="true" />
                </div>
                <div>
                  <p className="font-sans text-[11px] font-bold text-salmon uppercase tracking-widest">{range}</p>
                  <h3 className="font-['Georgia',serif] text-lg font-bold text-dark-brown">{title}</h3>
                </div>
              </div>
              <ul className="space-y-2.5">
                {items.map((item) => (
                  <li key={item} className="font-sans text-sm text-gray-600 flex items-center gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-salmon shrink-0" aria-hidden="true" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
