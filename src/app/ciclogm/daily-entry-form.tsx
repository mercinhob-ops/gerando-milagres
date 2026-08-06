"use client";

import { useState } from "react";
import { Thermometer, Save } from "lucide-react";
import type { Bleeding, DailyRecord, Mood, Mucus } from "./types";
import { BLEEDING_LABELS, MOOD_LABELS, MUCUS_LABELS } from "./types";
import { todayIso } from "./storage";

const moodOptions = Object.keys(MOOD_LABELS) as Mood[];
const mucusOptions = Object.keys(MUCUS_LABELS) as Mucus[];
const bleedingOptions = Object.keys(BLEEDING_LABELS) as Bleeding[];

export function DailyEntryForm({
  existingRecords,
  onSave,
}: {
  existingRecords: DailyRecord[];
  onSave: (record: DailyRecord) => void;
}) {
  const [date, setDate] = useState(todayIso());
  const [temperature, setTemperature] = useState("");
  const [mood, setMood] = useState<Mood | "">("");
  const [mucus, setMucus] = useState<Mucus | "">("");
  const [bleeding, setBleeding] = useState<Bleeding | "">("");
  const [savedMessage, setSavedMessage] = useState(false);

  function loadRecordFor(nextDate: string) {
    const existing = existingRecords.find((record) => record.date === nextDate);
    setTemperature(existing?.temperature !== undefined ? String(existing.temperature) : "");
    setMood(existing?.mood ?? "");
    setMucus(existing?.mucus ?? "");
    setBleeding(existing?.bleeding ?? "");
  }

  function handleDateChange(nextDate: string) {
    setDate(nextDate);
    loadRecordFor(nextDate);
    setSavedMessage(false);
  }

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();

    const parsedTemp = temperature.trim() === "" ? undefined : Number(temperature.replace(",", "."));

    onSave({
      date,
      temperature: parsedTemp !== undefined && !Number.isNaN(parsedTemp) ? parsedTemp : undefined,
      mood: mood || undefined,
      mucus: mucus || undefined,
      bleeding: bleeding || undefined,
    });

    setSavedMessage(true);
    setTimeout(() => setSavedMessage(false), 2500);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-2xl border border-nude-dark/30 shadow-sm p-5 md:p-6 space-y-5"
    >
      <div className="flex items-center justify-between gap-3">
        <h3 className="font-display text-lg font-semibold text-dark-brown">Registro diário</h3>
        <input
          type="date"
          value={date}
          max={todayIso()}
          onChange={(event) => handleDateChange(event.target.value)}
          className="font-sans text-sm text-brown border border-nude-dark/40 rounded-lg px-3 py-1.5 bg-cream/50 focus:outline-none focus:ring-2 focus:ring-salmon/40"
        />
      </div>

      <div>
        <label className="flex items-center gap-2 font-sans text-sm font-semibold text-brown mb-2">
          <Thermometer className="w-4 h-4 text-salmon" aria-hidden="true" />
          Temperatura basal (°C)
        </label>
        <input
          type="number"
          inputMode="decimal"
          step="0.01"
          min="34"
          max="42"
          placeholder="Ex: 36.5"
          value={temperature}
          onChange={(event) => setTemperature(event.target.value)}
          className="w-full font-sans text-base text-dark-brown border border-nude-dark/40 rounded-lg px-3 py-2.5 bg-cream/40 focus:outline-none focus:ring-2 focus:ring-salmon/40"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <p className="font-sans text-sm font-semibold text-brown mb-2">Humor</p>
          <div className="flex flex-wrap gap-1.5">
            {moodOptions.map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => setMood(mood === option ? "" : option)}
                className={`font-sans text-xs px-3 py-1.5 rounded-full border transition-colors ${
                  mood === option
                    ? "bg-salmon text-white border-salmon"
                    : "bg-cream/50 text-brown border-nude-dark/40 hover:border-salmon/60"
                }`}
              >
                {MOOD_LABELS[option]}
              </button>
            ))}
          </div>
        </div>

        <div>
          <p className="font-sans text-sm font-semibold text-brown mb-2">Muco cervical</p>
          <div className="flex flex-wrap gap-1.5">
            {mucusOptions.map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => setMucus(mucus === option ? "" : option)}
                className={`font-sans text-xs px-3 py-1.5 rounded-full border transition-colors ${
                  mucus === option
                    ? "bg-salmon text-white border-salmon"
                    : "bg-cream/50 text-brown border-nude-dark/40 hover:border-salmon/60"
                }`}
              >
                {MUCUS_LABELS[option]}
              </button>
            ))}
          </div>
        </div>

        <div>
          <p className="font-sans text-sm font-semibold text-brown mb-2">Sangramento</p>
          <div className="flex flex-wrap gap-1.5">
            {bleedingOptions.map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => setBleeding(bleeding === option ? "" : option)}
                className={`font-sans text-xs px-3 py-1.5 rounded-full border transition-colors ${
                  bleeding === option
                    ? "bg-salmon text-white border-salmon"
                    : "bg-cream/50 text-brown border-nude-dark/40 hover:border-salmon/60"
                }`}
              >
                {BLEEDING_LABELS[option]}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3 pt-1">
        <button
          type="submit"
          className="inline-flex items-center gap-2 bg-salmon text-white font-sans font-semibold text-sm px-5 py-2.5 rounded-lg hover:bg-salmon/90 transition-colors"
        >
          <Save className="w-4 h-4" aria-hidden="true" />
          Salvar registro
        </button>
        {savedMessage && (
          <span className="font-sans text-xs text-salmon font-semibold">Registro salvo ✓</span>
        )}
      </div>
    </form>
  );
}
