import type { CicloGmData, Cycle, DailyRecord } from "./types";

const STORAGE_KEY = "ciclogm:data";

const EMPTY_DATA: CicloGmData = {
  cycles: [],
  activeCycleId: null,
  onboarded: false,
};

let cachedData: CicloGmData = EMPTY_DATA;
let hydrated = false;
const listeners = new Set<() => void>();

function readFromLocalStorage(): CicloGmData {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return EMPTY_DATA;
    const parsed = JSON.parse(raw);
    return isValidData(parsed) ? parsed : EMPTY_DATA;
  } catch {
    return EMPTY_DATA;
  }
}

export function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function getSnapshot(): CicloGmData {
  if (!hydrated) {
    cachedData = readFromLocalStorage();
    hydrated = true;
  }
  return cachedData;
}

export function getServerSnapshot(): CicloGmData {
  return EMPTY_DATA;
}

export function setCicloData(updater: CicloGmData | ((prev: CicloGmData) => CicloGmData)) {
  cachedData = typeof updater === "function" ? updater(cachedData) : updater;
  hydrated = true;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(cachedData));
  listeners.forEach((listener) => listener());
}

export function isValidData(value: unknown): value is CicloGmData {
  if (!value || typeof value !== "object") return false;
  const candidate = value as Record<string, unknown>;
  if (!Array.isArray(candidate.cycles)) return false;
  return candidate.cycles.every(isValidCycle);
}

function isValidCycle(value: unknown): value is Cycle {
  if (!value || typeof value !== "object") return false;
  const candidate = value as Record<string, unknown>;
  return (
    typeof candidate.id === "string" &&
    typeof candidate.name === "string" &&
    typeof candidate.startDate === "string" &&
    Array.isArray(candidate.records) &&
    candidate.records.every(isValidRecord)
  );
}

function isValidRecord(value: unknown): value is DailyRecord {
  if (!value || typeof value !== "object") return false;
  const candidate = value as Record<string, unknown>;
  return typeof candidate.date === "string";
}

export function createCycleId() {
  return `cycle_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

export function todayIso() {
  const now = new Date();
  const offset = now.getTimezoneOffset();
  const local = new Date(now.getTime() - offset * 60 * 1000);
  return local.toISOString().slice(0, 10);
}

export function cycleDayFor(startDate: string, date: string): number {
  const start = new Date(`${startDate}T00:00:00`);
  const current = new Date(`${date}T00:00:00`);
  const diffDays = Math.round((current.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
  return diffDays + 1;
}

const MONTH_LABELS = [
  "jan",
  "fev",
  "mar",
  "abr",
  "mai",
  "jun",
  "jul",
  "ago",
  "set",
  "out",
  "nov",
  "dez",
];

export function formatMonthYear(iso: string): string {
  const [year, month] = iso.split("-").map(Number);
  return `${MONTH_LABELS[(month ?? 1) - 1]}/${String(year).slice(2)}`;
}

export function formatDatePtBr(iso: string): string {
  const [year, month, day] = iso.split("-");
  return `${day}/${month}/${year}`;
}

/**
 * Sequência de dias consecutivos com registro, contando para trás a partir
 * da data mais recente registrada (não precisa ser hoje).
 */
export function computeStreak(records: DailyRecord[]): number {
  const uniqueDates = Array.from(new Set(records.map((record) => record.date))).sort().reverse();
  if (uniqueDates.length === 0) return 0;

  let streak = 1;
  let cursor = new Date(`${uniqueDates[0]}T00:00:00`);

  for (let i = 1; i < uniqueDates.length; i++) {
    const expectedPrevious = new Date(cursor);
    expectedPrevious.setDate(expectedPrevious.getDate() - 1);
    const expectedIso = expectedPrevious.toISOString().slice(0, 10);

    if (uniqueDates[i] !== expectedIso) break;
    streak++;
    cursor = expectedPrevious;
  }

  return streak;
}
