"use client";

import { useRef, useState, useSyncExternalStore } from "react";
import Image from "next/image";
import { Download, Upload, Printer, Plus, X } from "lucide-react";
import type { DailyRecord } from "./types";
import {
  createCycleId,
  getServerSnapshot,
  getSnapshot,
  isValidData,
  setCicloData,
  subscribe,
  todayIso,
} from "./storage";
import { TemperatureChart } from "./temperature-chart";
import { DailyEntryForm } from "./daily-entry-form";
import { CycleTable } from "./cycle-table";

function createFirstCycle(name: string) {
  return {
    id: createCycleId(),
    name,
    startDate: todayIso(),
    records: [] as DailyRecord[],
  };
}

export function CicloGmApp() {
  const data = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const [creatingCycle, setCreatingCycle] = useState(false);
  const [newCycleName, setNewCycleName] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!data.onboarded) {
    return (
      <WelcomeScreen
        onStart={() => {
          const firstCycle = createFirstCycle("Ciclo 1");
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

  function handleSaveRecord(record: DailyRecord) {
    updateActiveCycleRecords((records) => {
      const withoutDate = records.filter((existing) => existing.date !== record.date);
      return [...withoutDate, record];
    });
  }

  function handleDeleteRecord(date: string) {
    updateActiveCycleRecords((records) => records.filter((record) => record.date !== date));
  }

  function handleCreateCycle() {
    const name = newCycleName.trim();
    if (!name) return;
    const cycle = createFirstCycle(name);
    setCicloData((prev) => ({
      ...prev,
      cycles: [...prev.cycles, cycle],
      activeCycleId: cycle.id,
    }));
    setNewCycleName("");
    setCreatingCycle(false);
  }

  function handleExport() {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `ciclogm-backup-${todayIso()}.json`;
    link.click();
    URL.revokeObjectURL(url);
  }

  function handleImportClick() {
    fileInputRef.current?.click();
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
          window.alert("Arquivo inválido. Selecione um backup exportado pelo CicloGM.");
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

  return (
    <div className="min-h-screen bg-cream">
      <AppHeader />

      <main className="max-w-4xl mx-auto px-4 md:px-6 py-8 space-y-6 print:hidden">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:justify-between">
          <div className="flex items-center gap-2 flex-wrap">
            <select
              value={activeCycle?.id ?? ""}
              onChange={(event) => setCicloData((prev) => ({ ...prev, activeCycleId: event.target.value }))}
              className="font-sans text-sm text-dark-brown font-semibold bg-white border border-nude-dark/40 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-salmon/40"
              aria-label="Selecionar ciclo"
            >
              {data.cycles.map((cycle) => (
                <option key={cycle.id} value={cycle.id}>
                  {cycle.name}
                </option>
              ))}
            </select>

            {!creatingCycle ? (
              <button
                type="button"
                onClick={() => setCreatingCycle(true)}
                className="inline-flex items-center gap-1.5 font-sans text-sm font-semibold text-salmon border border-salmon/40 rounded-lg px-3 py-2 hover:bg-salmon/10 transition-colors"
              >
                <Plus className="w-4 h-4" aria-hidden="true" />
                Novo ciclo
              </button>
            ) : (
              <div className="flex items-center gap-1.5">
                <input
                  type="text"
                  autoFocus
                  placeholder="Nome do ciclo"
                  value={newCycleName}
                  onChange={(event) => setNewCycleName(event.target.value)}
                  onKeyDown={(event) => event.key === "Enter" && handleCreateCycle()}
                  className="font-sans text-sm text-dark-brown bg-white border border-nude-dark/40 rounded-lg px-3 py-2 w-40 focus:outline-none focus:ring-2 focus:ring-salmon/40"
                />
                <button
                  type="button"
                  onClick={handleCreateCycle}
                  className="font-sans text-sm font-semibold text-white bg-salmon rounded-lg px-3 py-2 hover:bg-salmon/90 transition-colors"
                >
                  Criar
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setCreatingCycle(false);
                    setNewCycleName("");
                  }}
                  aria-label="Cancelar"
                  className="text-brown/50 hover:text-brown p-2"
                >
                  <X className="w-4 h-4" aria-hidden="true" />
                </button>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              type="button"
              onClick={handleExport}
              className="inline-flex items-center gap-1.5 font-sans text-xs font-semibold text-brown border border-nude-dark/40 rounded-lg px-3 py-2 hover:bg-white transition-colors"
            >
              <Download className="w-3.5 h-3.5" aria-hidden="true" />
              Exportar backup
            </button>
            <button
              type="button"
              onClick={handleImportClick}
              className="inline-flex items-center gap-1.5 font-sans text-xs font-semibold text-brown border border-nude-dark/40 rounded-lg px-3 py-2 hover:bg-white transition-colors"
            >
              <Upload className="w-3.5 h-3.5" aria-hidden="true" />
              Restaurar backup
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="application/json"
              onChange={handleImportFile}
              className="hidden"
            />
            <button
              type="button"
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 font-sans text-xs font-semibold text-brown border border-nude-dark/40 rounded-lg px-3 py-2 hover:bg-white transition-colors"
            >
              <Printer className="w-3.5 h-3.5" aria-hidden="true" />
              Salvar como PDF
            </button>
          </div>
        </div>

        {activeCycle && (
          <>
            <section>
              <h2 className="font-display text-xl font-semibold text-dark-brown mb-3">
                Temperatura basal — {activeCycle.name}
              </h2>
              <TemperatureChart records={activeCycle.records} />
            </section>

            <section>
              <DailyEntryForm existingRecords={activeCycle.records} onSave={handleSaveRecord} />
            </section>

            <section>
              <h2 className="font-display text-xl font-semibold text-dark-brown mb-3">Histórico de registros</h2>
              <CycleTable records={activeCycle.records} onDelete={handleDeleteRecord} />
            </section>
          </>
        )}

        <Disclaimer />
      </main>

      {/* Print-only view */}
      {activeCycle && (
        <div className="hidden print:block px-6 py-6">
          <p className="font-sans text-xs text-brown/60 mb-1">Gerando Milagres · Dra. Camilla Freitas</p>
          <h1 className="font-display text-2xl font-bold text-dark-brown mb-4">{activeCycle.name}</h1>
          <CycleTable records={activeCycle.records} onDelete={() => {}} />
          <p className="font-sans text-[10px] text-brown/50 mt-6">
            Ferramenta de autoconhecimento · Dra. Camilla Freitas · CRF/PE 4563. Não substitui orientação profissional.
          </p>
        </div>
      )}
    </div>
  );
}

function AppHeader() {
  return (
    <header className="bg-white border-b border-nude-dark/40 print:hidden">
      <div className="max-w-4xl mx-auto px-4 md:px-6 py-4 flex items-center justify-between">
        <div>
          <p className="font-display text-lg font-bold text-dark-brown italic leading-none">Gerando Milagres</p>
          <p className="font-sans text-xs text-salmon font-semibold tracking-wide uppercase mt-0.5">
            CicloGM · Dra. Camilla Freitas
          </p>
        </div>
      </div>
    </header>
  );
}

function WelcomeScreen({ onStart }: { onStart: () => void }) {
  return (
    <div className="min-h-screen bg-cream flex flex-col">
      <main className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="max-w-md w-full text-center space-y-6">
          <div className="relative w-32 h-32 mx-auto rounded-full overflow-hidden ring-4 ring-white shadow-xl">
            <Image
              src="/images/camilla-zap.jpg"
              alt="Dra. Camilla Freitas"
              fill
              className="object-cover object-top"
              sizes="128px"
              priority
            />
          </div>

          <div className="space-y-2">
            <p className="font-sans text-xs font-semibold tracking-widest text-salmon uppercase">
              Gerando Milagres apresenta
            </p>
            <h1 className="font-display text-3xl md:text-4xl font-bold text-dark-brown leading-tight">
              CicloGM
            </h1>
            <p className="font-sans text-brown/70 leading-relaxed">
              Um espaço simples e acolhedor para registrar sua temperatura basal e os sinais do seu corpo,
              ciclo a ciclo.
            </p>
          </div>

          <button
            type="button"
            onClick={onStart}
            className="w-full inline-flex items-center justify-center bg-salmon text-white font-sans font-semibold text-base px-6 py-3.5 rounded-xl hover:bg-salmon/90 transition-colors shadow-sm"
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
