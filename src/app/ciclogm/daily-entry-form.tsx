"use client";

import { useState } from "react";
import { Thermometer, Save } from "lucide-react";
import type { Bleeding, DailyRecord, Mood, Mucus } from "./types";
import { BLEEDING_LABELS, MUCUS_LABELS, MOOD_LABELS } from "./types";
import { cycleDayFor, todayIso } from "./storage";

const bleedingOptions = Object.keys(BLEEDING_LABELS) as Bleeding[];
const mucusOptions = Object.keys(MUCUS_LABELS) as Mucus[];
const moodOptions = Object.keys(MOOD_LABELS) as Mood[];

interface DailyEntryFormProps {
  cycleStartDate: string;
  existingRecords: DailyRecord[];
  date: string;
  onDateChange: (date: string) => void;
  onSave: (record: DailyRecord) => void;
}

export function DailyEntryForm(props: DailyEntryFormProps) {
  return (
    <div className="bg-white rounded-2xl border border-nude-dark/30 shadow-sm p-5 md:p-6 space-y-5">
      <h3 className="font-display text-lg font-semibold text-dark-brown">Registro diário</h3>
      {/* Remount fields whenever the selected date changes (typed or via chart click),
          so each date's saved record loads fresh into the form. */}
      <DailyEntryFields key={props.date} {...props} />
    </div>
  );
}

function DailyEntryFields({
  cycleStartDate,
  existingRecords,
  date,
  onDateChange,
  onSave,
}: DailyEntryFormProps) {
  const existing = existingRecords.find((record) => record.date === date);

  const [cycleDay, setCycleDay] = useState(existing?.cycleDay ?? cycleDayFor(cycleStartDate, date));
  const [temperature, setTemperature] = useState(
    existing?.temperature !== undefined ? String(existing.temperature) : ""
  );
  const [bleeding, setBleeding] = useState<Bleeding | "">(existing?.bleeding ?? "");
  const [mucus, setMucus] = useState<Mucus | "">(existing?.mucus ?? "");
  const [mood, setMood] = useState<Mood | "">(existing?.mood ?? "");
  const [notes, setNotes] = useState(existing?.notes ?? "");
  const [savedMessage, setSavedMessage] = useState(false);

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();

    const parsedTemp = temperature.trim() === "" ? undefined : Number(temperature.replace(",", "."));

    onSave({
      date,
      cycleDay,
      temperature: parsedTemp !== undefined && !Number.isNaN(parsedTemp) ? parsedTemp : undefined,
      bleeding: bleeding || undefined,
      mucus: mucus || undefined,
      mood: mood || undefined,
      notes: notes.trim() || undefined,
    });

    setSavedMessage(true);
    setTimeout(() => setSavedMessage(false), 2500);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div>
          <label className="font-sans text-xs font-semibold text-brown mb-1.5 block">Dia do ciclo</label>
          <input
            type="number"
            min={1}
            value={cycleDay}
            onChange={(event) => setCycleDay(Number(event.target.value) || 1)}
            className="w-full font-sans text-sm text-dark-brown border border-nude-dark/40 rounded-lg px-3 py-2 bg-cream/40 focus:outline-none focus:ring-2 focus:ring-salmon/40"
          />
        </div>

        <div className="col-span-2 sm:col-span-1">
          <label className="font-sans text-xs font-semibold text-brown mb-1.5 block">Data</label>
          <input
            type="date"
            value={date}
            max={todayIso()}
            onChange={(event) => onDateChange(event.target.value)}
            className="w-full font-sans text-sm text-dark-brown border border-nude-dark/40 rounded-lg px-3 py-2 bg-cream/40 focus:outline-none focus:ring-2 focus:ring-salmon/40"
          />
        </div>

        <div className="col-span-2 sm:col-span-2">
          <label className="flex items-center gap-1.5 font-sans text-xs font-semibold text-brown mb-1.5">
            <Thermometer className="w-3.5 h-3.5 text-salmon" aria-hidden="true" />
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
            className="w-full font-sans text-base text-dark-brown border border-nude-dark/40 rounded-lg px-3 py-2 bg-cream/40 focus:outline-none focus:ring-2 focus:ring-salmon/40"
          />
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
        <label className="font-sans text-sm font-semibold text-brown mb-2 block">Observações</label>
        <textarea
          rows={2}
          value={notes}
          onChange={(event) => setNotes(event.target.value)}
          placeholder="Anotações livres sobre o dia..."
          className="w-full font-sans text-sm text-dark-brown border border-nude-dark/40 rounded-lg px-3 py-2 bg-cream/40 focus:outline-none focus:ring-2 focus:ring-salmon/40 resize-none"
        />
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
