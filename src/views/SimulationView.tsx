import React, { useState, useCallback } from 'react';
import {
  Activity,
  BarChart3,
  Sparkles,
  Layers,
  ArrowLeft,
  Globe,
  Flame,
  FileSpreadsheet,
} from 'lucide-react';
import { useCypher } from '../engine/useCypher';
import { ScadaHeader } from '../components/scada/ScadaHeader';
import { ProcessSchematic } from '../components/scada/ProcessSchematic';
import { TelemetryGauges } from '../components/scada/TelemetryGauges';
import { AnalyticsCharts } from '../components/scada/AnalyticsCharts';
import { ActuatorControlPanel } from '../components/scada/ActuatorControlPanel';
import { CypherCopilot } from '../components/scada/CypherCopilot';
import { ToastContainer, ToastMessage } from '../components/ui/Toast';

interface Props {
  onHome: () => void;
  onNavigateToNational?: () => void;
}

export const SimulationView: React.FC<Props> = ({ onHome, onNavigateToNational }) => {
  const {
    unitId,
    setUnitId,
    currentUnit,
    isLab,
    controlMode,
    setControlMode,
    filterActive,
    toggleFilter,
    backwashActive,
    triggerBackwash,
    coolantRate,
    setCoolantRate,
    flueHeatOffset,
    setFlueHeatOffset,
    calibrateSensors,
    telemetry,
    powerWaveform,
    coWaveform,
    co2Waveform,
    logs,
    copilotMessages,
    sendCopilotQuery,
  } = useCypher();

  const [activeTab, setActiveTab] = useState<'dashboard' | 'charts' | 'copilot'>('dashboard');
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = useCallback(
    (title: string, description?: string, type: 'success' | 'info' | 'warning' = 'info') => {
      const id = String(Date.now());
      setToasts((prev) => [...prev, { id, title, description, type }]);
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, 4000);
    },
    []
  );

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const handleExportScada = () => {
    addToast(
      'Laporan SCADA Diexport',
      `Data telemetri ${currentUnit.name} tersimpan dalam format CSV / PDF untuk audit KLHK.`,
      'success'
    );
  };

  return (
    <div className="min-h-screen w-full flex flex-col bg-[#0f172a] text-slate-100 relative select-none">
      {/* 1. Industrial SCADA Top Bar Header */}
      <ScadaHeader
        state={telemetry}
        onSelectUnit={(id) => {
          setUnitId(id);
          addToast('Unit Berhasil Dialihkan', `Memulai pemantauan telemetri untuk ${id}.`, 'info');
        }}
        onSetControlMode={(mode) => {
          setControlMode(mode);
          addToast('Mode Kendali Diperbarui', `Sistem beralih ke mode ${mode}.`, 'info');
        }}
        onHome={onHome}
        onExportReport={handleExportScada}
      />

      {/* 2. Main SCADA Workspace Container */}
      <main className="flex-1 min-h-0 overflow-y-auto p-4 md:p-6 space-y-6 max-w-[1600px] mx-auto w-full">
        {/* Navigation & Section Tabs */}
        <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900/90 backdrop-blur-md p-2 rounded-2xl border border-slate-800 shadow-md">
          <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`h-9 px-4 rounded-xl text-[13px] font-bold flex items-center gap-2 transition-all cursor-pointer ${
                activeTab === 'dashboard'
                  ? 'bg-cyan-500 text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Activity className="w-4 h-4" />
              <span>Ruang Kontrol SCADA &amp; Digital Twin</span>
            </button>

            <button
              onClick={() => setActiveTab('charts')}
              className={`h-9 px-4 rounded-xl text-[13px] font-bold flex items-center gap-2 transition-all cursor-pointer ${
                activeTab === 'charts'
                  ? 'bg-cyan-500 text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              <span>Data Uji Empiris Esai (UGM 2026)</span>
            </button>

            <button
              onClick={() => setActiveTab('copilot')}
              className={`h-9 px-4 rounded-xl text-[13px] font-bold flex items-center gap-2 transition-all cursor-pointer ${
                activeTab === 'copilot'
                  ? 'bg-cyan-500 text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              <span>CYPHER AI Copilot Advisory</span>
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping ml-1" />
            </button>
          </div>

          <div className="flex items-center gap-2">
            {onNavigateToNational && (
              <button
                onClick={onNavigateToNational}
                className="h-9 px-3.5 rounded-xl bg-indigo-950 hover:bg-indigo-900 border border-indigo-700/50 text-indigo-200 text-[12px] font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <Globe className="w-3.5 h-3.5 text-indigo-400" />
                <span className="hidden sm:inline">Hub Emisi Nasional 2045</span>
              </button>
            )}
          </div>
        </div>

        {/* Tab 1: Full SCADA Instrumentation & Digital Twin View */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6 anim-rise">
            {/* Interactive Process Flow Schematic (P&ID) */}
            <ProcessSchematic
              state={telemetry}
              onTriggerBackwash={() => {
                triggerBackwash();
                addToast('Force Backwash Dipicu', 'Pulse-jet 6 bar diaktifkan pada chamber filter.', 'warning');
              }}
              onToggleFilter={() => {
                toggleFilter();
                addToast(
                  filterActive ? 'Filter Dibypass' : 'Filter Diaktifkan',
                  filterActive ? 'Emisi gas buang mentah mengalir langsung.' : 'Penangkapan CO & CO2 berjalan simultan.',
                  filterActive ? 'warning' : 'success'
                );
              }}
            />

            {/* Live Telemetry Gauges & Detailed Subsystem Tables */}
            <TelemetryGauges state={telemetry} />

            {/* Actuator Controls & Event Log Console */}
            <ActuatorControlPanel
              state={telemetry}
              coolantRate={coolantRate}
              onCoolantChange={setCoolantRate}
              flueHeatOffset={flueHeatOffset}
              onFlueHeatChange={setFlueHeatOffset}
              onTriggerBackwash={() => {
                triggerBackwash();
                addToast('Force Backwash Dipicu', 'Pulse-jet 6 bar diaktifkan pada chamber filter.', 'warning');
              }}
              onToggleFilter={toggleFilter}
              onCalibrateSensors={() => {
                calibrateSensors();
                addToast('Kalibrasi CEMS Selesai', 'Offset sensor ENS160 & AHT21 tervalidasi.', 'success');
              }}
              logs={logs}
            />
          </div>
        )}

        {/* Tab 2: Research Paper Experimental Data & Empirical Regression Charts */}
        {activeTab === 'charts' && (
          <div className="space-y-6 anim-rise">
            <AnalyticsCharts
              powerWaveform={powerWaveform}
              coWaveform={coWaveform}
              co2Waveform={co2Waveform}
              powerUnit={telemetry.teg.powerUnit}
            />

            {/* Additional Process & Actuator Overview under Charts */}
            <ActuatorControlPanel
              state={telemetry}
              coolantRate={coolantRate}
              onCoolantChange={setCoolantRate}
              flueHeatOffset={flueHeatOffset}
              onFlueHeatChange={setFlueHeatOffset}
              onTriggerBackwash={triggerBackwash}
              onToggleFilter={toggleFilter}
              onCalibrateSensors={calibrateSensors}
              logs={logs}
            />
          </div>
        )}

        {/* Tab 3: CYPHER AI Engineering Copilot */}
        {activeTab === 'copilot' && (
          <div className="space-y-6 anim-rise">
            <CypherCopilot
              state={telemetry}
              messages={copilotMessages}
              onSendMessage={sendCopilotQuery}
            />

            {/* Compact Process Schematic below Copilot for Reference */}
            <ProcessSchematic
              state={telemetry}
              onTriggerBackwash={triggerBackwash}
              onToggleFilter={toggleFilter}
            />
          </div>
        )}
      </main>

      {/* Floating Notifications */}
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
};
