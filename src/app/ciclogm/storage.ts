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
