"use client";

import { Trash2 } from "lucide-react";
import type { DailyRecord } from "./types";
import { BLEEDING_LABELS, MOOD_LABELS, MUCUS_LABELS } from "./types";

function formatDate(iso: string) {
  const [year, month, day] = iso.split("-");
  return `${day}/${month}/${year}`;
}

export function CycleTable({
  records,
  onDelete,
}: {
  records: DailyRecord[];
  onDelete: (date: string) => void;
}) {
  const sorted = [...records].sort((a, b) => b.date.localeCompare(a.date));

  if (sorted.length === 0) {
    return (
      <div className="flex items-center justify-center h-32 rounded-2xl bg-cream/60 border border-nude-dark/30">
        <p className="font-sans text-sm text-brown/50">Nenhum registro neste ciclo ainda.</p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl bg-white border border-nude-dark/30 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left" id="ciclogm-history-table">
          <thead>
            <tr className="bg-cream/70 border-b border-nude-dark/30">
              <th className="font-sans text-xs font-semibold text-brown uppercase tracking-wide px-4 py-3">Data</th>
              <th className="font-sans text-xs font-semibold text-brown uppercase tracking-wide px-4 py-3">Temp. (°C)</th>
              <th className="font-sans text-xs font-semibold text-brown uppercase tracking-wide px-4 py-3">Humor</th>
              <th className="font-sans text-xs font-semibold text-brown uppercase tracking-wide px-4 py-3">Muco cervical</th>
              <th className="font-sans text-xs font-semibold text-brown uppercase tracking-wide px-4 py-3">Sangramento</th>
              <th
                className="font-sans text-xs font-semibold text-brown uppercase tracking-wide px-4 py-3 print:hidden"
                aria-label="Ações"
              />
            </tr>
          </thead>
          <tbody>
            {sorted.map((record) => (
              <tr key={record.date} className="border-b border-nude-dark/15 last:border-0">
                <td className="font-sans text-sm text-dark-brown px-4 py-3 whitespace-nowrap">
                  {formatDate(record.date)}
                </td>
                <td className="font-sans text-sm text-brown px-4 py-3">
                  {record.temperature !== undefined ? record.temperature.toFixed(2) : "—"}
                </td>
                <td className="font-sans text-sm text-brown px-4 py-3">
                  {record.mood ? MOOD_LABELS[record.mood] : "—"}
                </td>
                <td className="font-sans text-sm text-brown px-4 py-3">
                  {record.mucus ? MUCUS_LABELS[record.mucus] : "—"}
                </td>
                <td className="font-sans text-sm text-brown px-4 py-3">
                  {record.bleeding ? BLEEDING_LABELS[record.bleeding] : "—"}
                </td>
                <td className="px-4 py-3 print:hidden">
                  <button
                    type="button"
                    onClick={() => onDelete(record.date)}
                    aria-label={`Excluir registro de ${formatDate(record.date)}`}
                    className="text-gray-400 hover:text-danger transition-colors"
                  >
                    <Trash2 className="w-4 h-4" aria-hidden="true" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
