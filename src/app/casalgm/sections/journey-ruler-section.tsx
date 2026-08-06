const stages = [
  "Perdidos e Sozinhos",
  "Buscando Respostas",
  "Preparando o Corpo",
  "Florescendo Juntos",
  "Positivo! 🎉",
] as const;

const CURRENT_STAGE_INDEX = 2; // "Preparando o Corpo"

const COLUMN_WIDTH_PCT = 100 / stages.length;
const INSET_PCT = COLUMN_WIDTH_PCT / 2;
const PROGRESS_PCT = (100 - 2 * INSET_PCT) * (CURRENT_STAGE_INDEX / (stages.length - 1));

export function JourneyRulerSection() {
  return (
    <section className="py-20 px-6 bg-white">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-14">
          <h2 className="font-['Georgia',serif] text-3xl md:text-4xl font-bold text-dark-brown leading-snug">
            Onde vocês estão nessa jornada?
          </h2>
        </div>

        <div className="relative h-9">
          <div
            className="absolute top-1/2 h-0.5 bg-nude -translate-y-1/2"
            style={{ left: `${INSET_PCT}%`, right: `${INSET_PCT}%` }}
            aria-hidden="true"
          />
          <div
            className="absolute top-1/2 h-0.5 bg-salmon -translate-y-1/2 transition-all"
            style={{ left: `${INSET_PCT}%`, width: `${PROGRESS_PCT}%` }}
            aria-hidden="true"
          />
          <div className="relative grid h-9" style={{ gridTemplateColumns: `repeat(${stages.length}, 1fr)` }}>
            {stages.map((stage, i) => (
              <div key={stage} className="flex justify-center">
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center border-4 border-white shadow-sm ${
                    i === CURRENT_STAGE_INDEX
                      ? "bg-salmon"
                      : i < CURRENT_STAGE_INDEX
                        ? "bg-salmon/60"
                        : "bg-nude"
                  }`}
                >
                  {i === CURRENT_STAGE_INDEX && (
                    <span className="w-2.5 h-2.5 rounded-full bg-white" aria-hidden="true" />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid mt-3" style={{ gridTemplateColumns: `repeat(${stages.length}, 1fr)` }}>
          {stages.map((stage, i) => (
            <p
              key={stage}
              className={`text-center font-sans text-[11px] md:text-xs leading-tight px-1 ${
                i === CURRENT_STAGE_INDEX ? "text-salmon font-bold" : "text-brown/60"
              }`}
            >
              {stage}
            </p>
          ))}
        </div>

        <p className="text-center font-sans text-sm text-gray-500 mt-10 max-w-xl mx-auto">
          Vocês estão prontos para dar o próximo passo. O Florescer a Dois é o empurrão que faltava.
        </p>
      </div>
    </section>
  );
}
