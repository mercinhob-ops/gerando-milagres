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

export function TemperatureChart({
  records,
  cycleStartDate,
  onPointClick,
}: {
  records: DailyRecord[];
  cycleStartDate: string;
  onPointClick?: (date: string) => void;
}) {
  const points = records
    .filter((record): record is DailyRecord & { temperature: number } => typeof record.temperature === "number")
    .map((record) => ({ ...record, cycleDay: cycleDayFor(cycleStartDate, record.date) }))
    .sort((a, b) => a.cycleDay - b.cycleDay);

  if (points.length === 0) {
    return (
      <div className="flex items-center justify-center h-48 rounded-2xl bg-cream/60 border border-nude-dark/30">
        <p className="font-sans text-sm text-brown/50 text-center px-6">
          Nenhuma temperatura registrada neste ciclo ainda.
        </p>
      </div>
    );
  }

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
    <div className="rounded-2xl bg-white border border-nude-dark/30 p-4 overflow-x-auto">
      <svg
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        className="w-full min-w-[520px]"
        role="img"
        aria-label="Gráfico de temperatura basal por dia do ciclo"
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
            role={onPointClick ? "button" : undefined}
            tabIndex={onPointClick ? 0 : undefined}
            aria-label={`Dia ${point.cycleDay} · ${point.temperature.toFixed(2)}°C`}
            className={onPointClick ? "cursor-pointer" : undefined}
            onClick={() => onPointClick?.(point.date)}
            onKeyDown={(event) => {
              if (onPointClick && (event.key === "Enter" || event.key === " ")) {
                event.preventDefault();
                onPointClick(point.date);
              }
            }}
          >
            <title>{`Dia ${point.cycleDay} · ${point.temperature.toFixed(2)}°C`}</title>
          </circle>
        ))}
      </svg>
    </div>
  );
}
