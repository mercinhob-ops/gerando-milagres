"use client";

import { useState } from "react";
import { Plus, X } from "lucide-react";
import type { Cycle } from "./types";
import { formatMonthYear } from "./storage";

export function CycleSelector({
  cycles,
  activeCycleId,
  onSelect,
  onCreate,
}: {
  cycles: Cycle[];
  activeCycleId: string | null;
  onSelect: (cycleId: string) => void;
  onCreate: (name: string) => void;
}) {
  const [creating, setCreating] = useState(false);
  const [name, setName] = useState("");

  function handleCreate() {
    const trimmed = name.trim();
    if (!trimmed) return;
    onCreate(trimmed);
    setName("");
    setCreating(false);
  }

  return (
    <section>
      <h2 className="font-display text-xl font-semibold text-dark-brown mb-3">Ciclos</h2>
      <div className="flex items-center gap-2 flex-wrap">
        {cycles.map((cycle) => {
          const active = cycle.id === activeCycleId;
          return (
            <button
              key={cycle.id}
              type="button"
              onClick={() => onSelect(cycle.id)}
              aria-pressed={active}
              className={`text-left rounded-2xl px-4 py-2.5 border transition-colors ${
                active
                  ? "bg-salmon text-white border-salmon shadow-sm"
                  : "bg-white text-brown border-nude-dark/40 hover:border-salmon/60"
              }`}
            >
              <p className="font-sans text-sm font-semibold leading-tight">{cycle.name}</p>
              <p className={`font-sans text-[11px] leading-tight mt-0.5 ${active ? "text-white/80" : "text-brown/50"}`}>
                {formatMonthYear(cycle.startDate)}
              </p>
            </button>
          );
        })}

        {!creating ? (
          <button
            type="button"
            onClick={() => setCreating(true)}
            className="inline-flex items-center gap-1.5 font-sans text-sm font-semibold text-salmon border border-dashed border-salmon/50 rounded-2xl px-4 py-2.5 hover:bg-salmon/10 transition-colors"
          >
            <Plus className="w-4 h-4" aria-hidden="true" />
            Novo
          </button>
        ) : (
          <div className="flex items-center gap-1.5">
            <input
              type="text"
              autoFocus
              placeholder="Nome do ciclo"
              value={name}
              onChange={(event) => setName(event.target.value)}
              onKeyDown={(event) => event.key === "Enter" && handleCreate()}
              className="font-sans text-sm text-dark-brown bg-white border border-nude-dark/40 rounded-lg px-3 py-2 w-40 focus:outline-none focus:ring-2 focus:ring-salmon/40"
            />
            <button
              type="button"
              onClick={handleCreate}
              className="font-sans text-sm font-semibold text-white bg-salmon rounded-lg px-3 py-2 hover:bg-salmon/90 transition-colors"
            >
              Criar
            </button>
            <button
              type="button"
              onClick={() => {
                setCreating(false);
                setName("");
              }}
              aria-label="Cancelar"
              className="text-brown/50 hover:text-brown p-2"
            >
              <X className="w-4 h-4" aria-hidden="true" />
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
