import type { DailyRecord } from "./types";
import { cycleDayFor, todayIso } from "./storage";

export function CycleSummary({
  records,
  cycleStartDate,
}: {
  records: DailyRecord[];
  cycleStartDate: string;
}) {
  const temperatures = records
    .filter((record): record is DailyRecord & { temperature: number } => typeof record.temperature === "number")
    .map((record) => record.temperature);

  const total = records.length;
  const average = temperatures.length
    ? temperatures.reduce((sum, temp) => sum + temp, 0) / temperatures.length
    : null;
  const currentDay = cycleDayFor(cycleStartDate, todayIso());
  const variation = temperatures.length ? Math.max(...temperatures) - Math.min(...temperatures) : null;

  const stats = [
    { icon: "📊", label: "Registros", value: String(total) },
    { icon: "🌡️", label: "Temp. média", value: average !== null ? `${average.toFixed(2)}°C` : "—" },
    { icon: "📅", label: "Dia do ciclo", value: String(currentDay) },
    { icon: "📈", label: "Variação", value: variation !== null ? `${variation.toFixed(2)}°C` : "—" },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="bg-white rounded-2xl border border-nude-dark/30 shadow-[0_4px_12px_rgba(107,66,57,0.06)] p-4 text-center"
        >
          <p className="text-2xl leading-none" aria-hidden="true">
            {stat.icon}
          </p>
          <p className="font-['Georgia',serif] text-lg font-bold text-dark-brown mt-1.5">{stat.value}</p>
          <p className="font-sans text-[11px] text-brown/60 mt-0.5">{stat.label}</p>
        </div>
      ))}
    </div>
  );
}
