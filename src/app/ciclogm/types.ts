export type Mood = "otimo" | "bom" | "neutro" | "ruim";
export type Mucus = "seco" | "cremoso" | "aquoso" | "elastico";
export type Bleeding = "nenhum" | "leve" | "moderado" | "intenso";

export interface DailyRecord {
  date: string; // "YYYY-MM-DD"
  cycleDay?: number;
  temperature?: number;
  bleeding?: Bleeding;
  mucus?: Mucus;
  mood?: Mood;
  notes?: string;
}

export interface Cycle {
  id: string;
  name: string;
  startDate: string; // "YYYY-MM-DD"
  records: DailyRecord[];
}

export interface CicloGmData {
  cycles: Cycle[];
  activeCycleId: string | null;
  onboarded: boolean;
}

export const BLEEDING_LABELS: Record<Bleeding, string> = {
  nenhum: "Nenhum",
  leve: "Leve",
  moderado: "Moderado",
  intenso: "Intenso",
};

export const BLEEDING_EMOJI: Record<Bleeding, string> = {
  nenhum: "⚪",
  leve: "🔴",
  moderado: "🔵",
  intenso: "🟣",
};

export const MUCUS_LABELS: Record<Mucus, string> = {
  seco: "Seco",
  cremoso: "Cremoso",
  aquoso: "Aquoso",
  elastico: "Elástico",
};

export const MUCUS_EMOJI: Record<Mucus, string> = {
  seco: "🌾",
  cremoso: "🥛",
  aquoso: "💧",
  elastico: "🧵",
};

export const MOOD_LABELS: Record<Mood, string> = {
  otimo: "Ótimo",
  bom: "Bom",
  neutro: "Neutro",
  ruim: "Ruim",
};

export const MOOD_EMOJI: Record<Mood, string> = {
  otimo: "😄",
  bom: "🙂",
  neutro: "😐",
  ruim: "😔",
};
