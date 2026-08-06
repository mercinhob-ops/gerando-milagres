"use client";

import type { DailyRecord } from "./types";
import { cycleDayFor } from "./storage";

const WIDTH = 720;
const HEIGHT = 280;
const PADDING_LEFT = 44;
const PADDING_RIGHT = 16;
const PADDING_TOP = 16;
const PADDING_BOTTOM = 36;

const Y_MIN = 36.0;
const Y_MAX = 37.5;

// Valores neutros só para dar forma ao gráfico quando o ciclo ainda não tem
// registros reais — sem qualquer padrão bifásico (não deve parecer indicar
// ovulação), por restrição do CRF/PE 4563.
const EXAMPLE_POINTS = [
  { date: "example-1", cycleDay: 1, temperature: 36.4 },
  { date: "example-2", cycleDay: 2, temperature: 36.5 },
  { date: "example-3", cycleDay: 3, temperature: 36.3 },
  { date: "example-4", cycleDay: 4, temperature: 36.5 },
  { date: "example-5", cycleDay: 5, temperature: 36.4 },
];

export function TemperatureChart({
  records,
  cycleStartDate,
  onPointClick,
}: {
  records: DailyRecord[];
  cycleStartDate: string;
  onPointClick?: (date: string) => void;
}) {
  const realPoints = records
    .filter((record): record is DailyRecord & { temperature: number } => typeof record.temperature === "number")
    .map((record) => ({ ...record, cycleDay: cycleDayFor(cycleStartDate, record.date) }))
    .sort((a, b) => a.cycleDay - b.cycleDay);

  const isExample = realPoints.length === 0;
  const points = isExample ? EXAMPLE_POINTS : realPoints;

  const chartWidth = WIDTH - PADDING_LEFT - PADDING_RIGHT;
  const chartHeight = HEIGHT - PADDING_TOP - PADDING_BOTTOM;
  const range = Y_MAX - Y_MIN;

  const maxDay = Math.max(points[points.length - 1].cycleDay, points.length > 1 ? points.length : 1);
  const dayFor = (day: number) => Math.max(day, 1);

  const xFor = (day: number) =>
    maxDay <= 1 ? PADDING_LEFT + chartWidth / 2 : PADDING_LEFT + ((dayFor(day) - 1) / (maxDay - 1)) * chartWidth;

  const yFor = (temp: number) => {
    const clamped = Math.min(Math.max(temp, Y_MIN), Y_MAX);
    return PADDING_TOP + chartHeight - ((clamped - Y_MIN) / range) * chartHeight;
  };

  const linePath = points
    .map((point, index) => `${index === 0 ? "M" : "L"} ${xFor(point.cycleDay).toFixed(1)} ${yFor(point.temperature).toFixed(1)}`)
    .join(" ");

  const yTicks = [36.0, 36.3, 36.6, 36.9, 37.2, 37.5];
  const xTickStep = Math.max(1, Math.ceil(maxDay / 10));
  const xTicks: number[] = [];
  for (let day = 1; day <= maxDay; day += xTickStep) xTicks.push(day);
  if (xTicks[xTicks.length - 1] !== maxDay) xTicks.push(maxDay);

  return (
    <div className="relative rounded-2xl bg-white border border-nude-dark/30 shadow-[0_8px_24px_rgba(107,66,57,0.08)] p-4 overflow-x-auto min-h-[200px]">
      {isExample && (
        <span className="absolute top-3 right-3 z-10 font-sans text-[10px] font-semibold uppercase tracking-widest text-brown/50 bg-cream/90 rounded-full px-2.5 py-1 border border-nude-dark/30">
          Exemplo
        </span>
      )}
      <svg
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        width={WIDTH}
        height={HEIGHT}
        className={`w-full min-w-[520px] min-h-[180px] ${isExample ? "opacity-50" : ""}`}
        role="img"
        aria-label={
          isExample
            ? "Gráfico de exemplo — nenhum registro real ainda"
            : "Gráfico de temperatura basal por dia do ciclo"
        }
      >
        {yTicks.map((tick) => (
          <g key={tick}>
            <line
              x1={PADDING_LEFT}
              x2={WIDTH - PADDING_RIGHT}
              y1={yFor(tick)}
              y2={yFor(tick)}
              stroke="#E8D0C0"
              strokeWidth={1}
            />
            <text x={PADDING_LEFT - 8} y={yFor(tick) + 3} textAnchor="end" fontSize={10} fill="#6B4239">
              {tick.toFixed(1)}
            </text>
          </g>
        ))}

        {xTicks.map((day) => (
          <g key={day}>
            <line
              x1={xFor(day)}
              x2={xFor(day)}
              y1={PADDING_TOP}
              y2={HEIGHT - PADDING_BOTTOM}
              stroke="#F0E6DC"
              strokeWidth={1}
            />
            <text x={xFor(day)} y={HEIGHT - PADDING_BOTTOM + 18} textAnchor="middle" fontSize={10} fill="#6B4239">
              {day}
            </text>
          </g>
        ))}

        <path d={linePath} fill="none" stroke="#C4867A" strokeWidth={2.5} strokeLinejoin="round" strokeLinecap="round" />

        {points.map((point) => (
          <circle
            key={point.date}
            cx={xFor(point.cycleDay)}
            cy={yFor(point.temperature)}
            r={5}
            fill="#C4867A"
            stroke="#ffffff"
            strokeWidth={1.5}
            role={!isExample && onPointClick ? "button" : undefined}
            tabIndex={!isExample && onPointClick ? 0 : undefined}
            aria-label={`Dia ${point.cycleDay} · ${point.temperature.toFixed(2)}°C`}
            className={!isExample && onPointClick ? "cursor-pointer" : undefined}
            onClick={isExample ? undefined : () => onPointClick?.(point.date)}
            onKeyDown={
              isExample
                ? undefined
                : (event) => {
                    if (onPointClick && (event.key === "Enter" || event.key === " ")) {
                      event.preventDefault();
                      onPointClick(point.date);
                    }
                  }
            }
          >
            <title>{`Dia ${point.cycleDay} · ${point.temperature.toFixed(2)}°C`}</title>
          </circle>
        ))}
      </svg>
      {isExample && (
        <p className="font-sans text-xs text-brown/50 text-center mt-1">
          Assim que você salvar um registro, seu gráfico real aparece aqui.
        </p>
      )}
    </div>
  );
}
