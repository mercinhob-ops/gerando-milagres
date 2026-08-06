"use client";

import type { DailyRecord } from "./types";

const WIDTH = 720;
const HEIGHT = 260;
const PADDING_LEFT = 44;
const PADDING_RIGHT = 16;
const PADDING_TOP = 20;
const PADDING_BOTTOM = 36;

function formatShortDate(iso: string) {
  const [, month, day] = iso.split("-");
  return `${day}/${month}`;
}

export function TemperatureChart({ records }: { records: DailyRecord[] }) {
  const points = records
    .filter((record): record is DailyRecord & { temperature: number } => typeof record.temperature === "number")
    .sort((a, b) => a.date.localeCompare(b.date));

  if (points.length === 0) {
    return (
      <div className="flex items-center justify-center h-48 rounded-2xl bg-cream/60 border border-nude-dark/30">
        <p className="font-sans text-sm text-brown/50 text-center px-6">
          Nenhuma temperatura registrada neste ciclo ainda.
        </p>
      </div>
    );
  }

  const temps = points.map((point) => point.temperature);
  const rawMin = Math.min(...temps);
  const rawMax = Math.max(...temps);
  const min = Math.floor((rawMin - 0.2) * 10) / 10;
  const max = Math.ceil((rawMax + 0.2) * 10) / 10;
  const range = max - min || 1;

  const chartWidth = WIDTH - PADDING_LEFT - PADDING_RIGHT;
  const chartHeight = HEIGHT - PADDING_TOP - PADDING_BOTTOM;

  const xFor = (index: number) =>
    points.length === 1
      ? PADDING_LEFT + chartWidth / 2
      : PADDING_LEFT + (index / (points.length - 1)) * chartWidth;

  const yFor = (temp: number) => PADDING_TOP + chartHeight - ((temp - min) / range) * chartHeight;

  const linePath = points
    .map((point, index) => `${index === 0 ? "M" : "L"} ${xFor(index).toFixed(1)} ${yFor(point.temperature).toFixed(1)}`)
    .join(" ");

  const gridLines = 4;
  const yTicks = Array.from({ length: gridLines + 1 }, (_, i) => min + (range / gridLines) * i);

  const labelStep = Math.ceil(points.length / 8);

  return (
    <div className="rounded-2xl bg-white border border-nude-dark/30 p-4 overflow-x-auto">
      <svg
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        className="w-full min-w-[520px]"
        role="img"
        aria-label="Gráfico de temperatura basal do ciclo"
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
              strokeDasharray="4 4"
            />
            <text
              x={PADDING_LEFT - 8}
              y={yFor(tick) + 3}
              textAnchor="end"
              fontSize={10}
              fill="#6B4239"
              fontFamily="var(--font-inter), sans-serif"
            >
              {tick.toFixed(1)}
            </text>
          </g>
        ))}

        <path d={linePath} fill="none" stroke="#C4867A" strokeWidth={2.5} strokeLinejoin="round" strokeLinecap="round" />

        {points.map((point, index) => (
          <circle
            key={point.date}
            cx={xFor(index)}
            cy={yFor(point.temperature)}
            r={4}
            fill="#C4867A"
            stroke="#ffffff"
            strokeWidth={1.5}
          />
        ))}

        {points.map((point, index) =>
          index % labelStep === 0 || index === points.length - 1 ? (
            <text
              key={`label-${point.date}`}
              x={xFor(index)}
              y={HEIGHT - PADDING_BOTTOM + 18}
              textAnchor="middle"
              fontSize={10}
              fill="#6B4239"
              fontFamily="var(--font-inter), sans-serif"
            >
              {formatShortDate(point.date)}
            </text>
          ) : null
        )}
      </svg>
    </div>
  );
}
