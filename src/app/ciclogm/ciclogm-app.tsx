"use client";

import { useRef, useState, useSyncExternalStore, type CSSProperties } from "react";
import Image from "next/image";
import { Download, Upload, Printer, Trash2 } from "lucide-react";
import type { DailyRecord } from "./types";
import {
  computeStreak,
  createCycleId,
  getServerSnapshot,
  getSnapshot,
  isValidData,
  setCicloData,
  subscribe,
  todayIso,
} from "./storage";
import { CycleSelector } from "./cycle-selector";
import { TemperatureChart } from "./temperature-chart";
import { DailyEntryForm } from "./daily-entry-form";
import { CycleTable } from "./cycle-table";
import { CycleSummary } from "./cycle-summary";
import { StreakIndicator } from "./streak-indicator";
import { VerseCarousel } from "./verse-carousel";
import { EncouragementToast, randomEncouragement } from "./encouragement-toast";

const GEORGIA = "font-['Georgia',serif]";

const FADE_IN_KEYFRAMES = `
  @keyframes ciclogm-fade-in {
    from { opacity: 0; transform: translateY(8px); }
    to { opacity: 1; transform: translateY(0); }
  }
`;

function fadeIn(delayMs: number): CSSProperties {
  return { animation: `ciclogm-fade-in 0.5s ease-out ${delayMs}ms both` };
}

function createCycle(name: string) {
  return {
    id: createCycleId(),
    name,
    startDate: todayIso(),
    records: [] as DailyRecord[],
  };
}

export function CicloGmApp() {
  const data = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const [selectedDate, setSelectedDate] = useState(todayIso());
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastVisible, setToastVisible] = useState(false);
  const toastTimeouts = useRef<{ hide?: number; clear?: number }>({});

  if (!data.onboarded) {
    return (
      <WelcomeScreen
        onStart={() => {
          const firstCycle = createCycle("Ciclo 1");
          setCicloData({ cycles: [firstCycle], activeCycleId: firstCycle.id, onboarded: true });
        }}
      />
    );
  }

  const activeCycle = data.cycles.find((cycle) => cycle.id === data.activeCycleId) ?? data.cycles[0];

  function updateActiveCycleRecords(updater: (records: DailyRecord[]) => DailyRecord[]) {
    if (!activeCycle) return;
    setCicloData((prev) => ({
      ...prev,
      cycles: prev.cycles.map((cycle) =>
        cycle.id === activeCycle.id ? { ...cycle, records: updater(cycle.records) } : cycle
      ),
    }));
  }

  function showEncouragement() {
    if (toastTimeouts.current.hide) window.clearTimeout(toastTimeouts.current.hide);
    if (toastTimeouts.current.clear) window.clearTimeout(toastTimeouts.current.clear);

    setToastMessage(randomEncouragement());
    setToastVisible(true);
    toastTimeouts.current.hide = window.setTimeout(() => setToastVisible(false), 3000);
    toastTimeouts.current.clear = window.setTimeout(() => setToastMessage(null), 3300);
  }

  function handleSaveRecord(record: DailyRecord) {
    updateActiveCycleRecords((records) => {
      const withoutDate = records.filter((existing) => existing.date !== record.date);
      return [...withoutDate, record];
    });
    showEncouragement();
  }

  function handleDeleteRecord(date: string) {
    updateActiveCycleRecords((records) => records.filter((record) => record.date !== date));
  }

  function handleCreateCycle(name: string) {
    const cycle = createCycle(name);
    setCicloData((prev) => ({
      ...prev,
      cycles: [...prev.cycles, cycle],
      activeCycleId: cycle.id,
    }));
  }

  function handleClearCycle() {
    if (!activeCycle) return;
    const confirmed = window.confirm(
      `Isso vai apagar todos os registros do ciclo "${activeCycle.name}". Essa ação não pode ser desfeita. Continuar?`
    );
    if (confirmed) updateActiveCycleRecords(() => []);
  }

  function handleExport() {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `temperatura-basal-backup-${todayIso()}.json`;
    link.click();
    URL.revokeObjectURL(url);
  }

  function handleImportFile(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(String(reader.result));
        if (!isValidData(parsed)) {
          window.alert("Arquivo inválido. Selecione um backup exportado por este app.");
          return;
        }
        const confirmed = window.confirm(
          "Restaurar este backup vai substituir todos os dados salvos neste dispositivo. Continuar?"
        );
        if (confirmed) setCicloData(parsed);
      } catch {
        window.alert("Não foi possível ler o arquivo. Verifique se é um JSON válido.");
      }
    };
    reader.readAsText(file);
  }

  function handlePrint() {
    window.print();
  }

  const streak = activeCycle ? computeStreak(activeCycle.records) : 0;

  return (
    <div
      className="min-h-screen"
      style={{ background: "linear-gradient(180deg, #F0E6DC 0%, #FBF7F4 45%, #F0E6DC 100%)" }}
    >
      <style>{FADE_IN_KEYFRAMES}</style>

      <AppHeader />

      <main className="max-w-4xl mx-auto px-4 md:px-6 py-8 space-y-8 print:hidden">
        <div style={fadeIn(80)}>
          <VerseCarousel />
        </div>

        <div style={fadeIn(160)}>
          <CycleSelector
            cycles={data.cycles}
            activeCycleId={activeCycle?.id ?? null}
            onSelect={(cycleId) => setCicloData((prev) => ({ ...prev, activeCycleId: cycleId }))}
            onCreate={handleCreateCycle}
          />
        </div>

        {activeCycle && (
          <>
            <StreakIndicator streak={streak} />

            <section style={fadeIn(240)}>
              <h2 className={`${GEORGIA} text-xl font-semibold text-dark-brown mb-3`}>Gráfico do ciclo</h2>
              <TemperatureChart
                records={activeCycle.records}
                cycleStartDate={activeCycle.startDate}
                onPointClick={setSelectedDate}
              />
            </section>

            <section>
              <CycleSummary records={activeCycle.records} cycleStartDate={activeCycle.startDate} />
            </section>

            <section style={fadeIn(320)}>
              <DailyEntryForm
                cycleStartDate={activeCycle.startDate}
                existingRecords={activeCycle.records}
                date={selectedDate}
                onDateChange={setSelectedDate}
                onSave={handleSaveRecord}
              />
            </section>

            <section style={fadeIn(400)}>
              <div className="flex items-center justify-between gap-3 mb-3">
                <h2 className={`${GEORGIA} text-xl font-semibold text-dark-brown`}>Tabela de registro</h2>
                <button
                  type="button"
                  onClick={handlePrint}
                  className="inline-flex items-center gap-1.5 font-sans text-xs font-semibold text-brown border border-nude-dark/40 rounded-lg px-3 py-2 shadow-sm transition-all duration-200 hover:bg-white hover:shadow-md shrink-0"
                >
                  <Printer className="w-3.5 h-3.5" aria-hidden="true" />
                  Salvar / Imprimir PDF
                </button>
              </div>
              <CycleTable records={activeCycle.records} onDelete={handleDeleteRecord} />
            </section>
          </>
        )}

        <AppFooter
          onExport={handleExport}
          onImport={handleImportFile}
          onClearCycle={handleClearCycle}
          hasActiveCycle={Boolean(activeCycle)}
        />

        <BrandFooter />
      </main>

      {/* Print-only view */}
      {activeCycle && (
        <div className="hidden print:block px-6 py-6">
          <p className="font-sans text-xs text-brown/60 mb-1">Temperatura Basal · Gerando Milagres</p>
          <h1 className={`${GEORGIA} text-2xl font-bold text-dark-brown mb-4`}>{activeCycle.name}</h1>
          <CycleTable records={activeCycle.records} />
          <p className="font-sans text-[10px] text-brown/50 mt-6">
            Ferramenta de autoconhecimento · Dra. Camilla Freitas · CRF/PE 4563. Não substitui orientação profissional.
          </p>
        </div>
      )}

      <EncouragementToast message={toastMessage} visible={toastVisible} />
    </div>
  );
}

function AppHeader() {
  return (
    <header
      className="sticky top-0 z-10 shadow-sm print:hidden"
      style={{ background: "linear-gradient(135deg, #4A2E26 0%, #6B4239 100%)", ...fadeIn(0) }}
    >
      <div className="max-w-4xl mx-auto px-4 md:px-6 py-4">
        <p className={`${GEORGIA} text-base font-bold text-white leading-none`}>
          Temperatura Basal <span className="text-nude font-normal">·</span> Gerando Milagres
        </p>
      </div>
    </header>
  );
}

function AppFooter({
  onExport,
  onImport,
  onClearCycle,
  hasActiveCycle,
}: {
  onExport: () => void;
  onImport: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onClearCycle: () => void;
  hasActiveCycle: boolean;
}) {
  return (
    <footer className="pt-4 border-t border-nude-dark/30 space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={onExport}
          className="inline-flex items-center gap-1.5 font-sans text-xs font-semibold text-brown border border-nude-dark/40 rounded-lg px-3 py-2 shadow-sm transition-all duration-200 hover:bg-white hover:shadow-md"
        >
          <Download className="w-3.5 h-3.5" aria-hidden="true" />
          Fazer backup
        </button>

        <label className="inline-flex items-center gap-1.5 font-sans text-xs font-semibold text-brown border border-nude-dark/40 rounded-lg px-3 py-2 shadow-sm transition-all duration-200 hover:bg-white hover:shadow-md cursor-pointer">
          <Upload className="w-3.5 h-3.5" aria-hidden="true" />
          Restaurar backup
          <input type="file" accept="application/json" onChange={onImport} className="hidden" />
        </label>

        {hasActiveCycle && (
          <button
            type="button"
            onClick={onClearCycle}
            className="inline-flex items-center gap-1.5 font-sans text-xs font-semibold text-danger border border-danger/30 rounded-lg px-3 py-2 transition-all duration-200 hover:bg-danger/5"
          >
            <Trash2 className="w-3.5 h-3.5" aria-hidden="true" />
            Limpar este ciclo
          </button>
        )}
      </div>

      <div className="space-y-1">
        <p className="font-sans text-[11px] text-brown/50 text-center leading-relaxed px-4">
          Seus registros ficam salvos neste aparelho. Faça backup regularmente.
        </p>
        <Disclaimer />
      </div>
    </footer>
  );
}

function BrandFooter() {
  return (
    <div className="text-center pt-2 pb-4 space-y-1.5">
      <p className={`${GEORGIA} italic text-base font-bold text-dark-brown`}>Gerando Milagres</p>
      <p className="font-sans text-xs text-brown/60">
        Feito com 💛 pela Dra. Camilla Freitas · CRF/PE 4563
      </p>
      <p className="font-sans text-sm italic text-salmon">Sua jornada é única. Seu milagre está a caminho.</p>
      <p className="text-lg" aria-hidden="true">
        🌸
      </p>
    </div>
  );
}

function WelcomeScreen({ onStart }: { onStart: () => void }) {
  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ background: "linear-gradient(180deg, #F0E6DC 0%, #FBF7F4 100%)" }}
    >
      <div className="relative w-full h-[48vh] min-h-[300px] max-h-[440px] shrink-0">
        <Image
          src="/images/camilla-zap2.jpg"
          alt="Dra. Camilla Freitas"
          fill
          className="object-cover object-top"
          sizes="100vw"
          priority
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(74,46,38,0.35) 0%, rgba(74,46,38,0.1) 45%, #F0E6DC 100%)",
          }}
        />
        <p
          className={`${GEORGIA} absolute top-6 inset-x-0 text-center italic text-white text-lg font-bold`}
          style={{ textShadow: "0 2px 8px rgba(74,46,38,0.5)" }}
        >
          Gerando Milagres
        </p>
      </div>

      <main className="flex-1 flex items-start justify-center px-6 -mt-10 relative z-10 pb-12">
        <div className="max-w-md w-full text-center space-y-6">
          <div className="space-y-2">
            <h1 className={`${GEORGIA} text-3xl md:text-4xl font-bold text-dark-brown leading-tight`}>
              Temperatura Basal
            </h1>
            <p className="font-sans text-sm font-semibold text-salmon uppercase tracking-wide">
              sua jornada começa aqui
            </p>
            <p className="font-sans text-brown/70 leading-relaxed pt-2">
              Um espaço simples e acolhedor para registrar sua temperatura basal e os sinais do seu corpo,
              ciclo a ciclo — no seu tempo, do seu jeito.
            </p>
          </div>

          <button
            type="button"
            onClick={onStart}
            className="w-full inline-flex items-center justify-center bg-salmon text-white font-sans font-semibold text-base px-6 py-3.5 rounded-xl shadow-[0_8px_24px_rgba(196,134,122,0.4)] transition-all duration-200 hover:bg-salmon/90 hover:shadow-[0_10px_28px_rgba(196,134,122,0.5)] active:scale-[0.98]"
          >
            Começar minha jornada
          </button>

          <Disclaimer />
        </div>
      </main>
    </div>
  );
}

function Disclaimer() {
  return (
    <p className="font-sans text-[11px] text-brown/50 text-center leading-relaxed px-4">
      Ferramenta de autoconhecimento · Dra. Camilla Freitas · CRF/PE 4563.
      <br />
      Não substitui orientação profissional.
    </p>
  );
}
