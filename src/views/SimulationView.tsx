import React, { useState, useCallback } from 'react';
import {
  Activity,
  BarChart3,
  Sparkles,
  Globe,
  ChevronDown,
  SlidersHorizontal,
  Network,
} from 'lucide-react';
import { useCypher } from '../engine/useCypher';
import { ScadaHeader } from '../components/scada/ScadaHeader';
import { ProcessSchematic } from '../components/scada/ProcessSchematic';
import { TelemetryGauges } from '../components/scada/TelemetryGauges';
import { AnalyticsCharts } from '../components/scada/AnalyticsCharts';
import { ActuatorControlPanel } from '../components/scada/ActuatorControlPanel';
import { CypherCopilot } from '../components/scada/CypherCopilot';
import { DashboardSummary } from '../components/scada/DashboardSummary';
import { ToastContainer, ToastMessage } from '../components/ui/Toast';
import { useSound } from '../utils/SoundProvider';

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
    applyPreset,
    clearLogs,
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
  const { playClick } = useSound();

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
    playClick();
    const columns = ['sumber', 'waktu_iso', 'unit', 'filter', 'co_ppm', 'co2_persen', 'so2_mg_nm3', 'pm25_ug_m3', 'daya_teg', 'satuan_daya'];
    const values = [
      'SIMULASI', new Date().toISOString(), currentUnit.id,
      filterActive ? 'aktif' : 'bypass',
      telemetry.cems.co, telemetry.cems.co2, telemetry.cems.so2, telemetry.cems.pm25,
      telemetry.teg.power, telemetry.teg.powerUnit,
    ];
    const csv = [columns, values].map((row) => row.map((value) => `"${String(value).replace(/"/g, '""')}"`).join(',')).join('\r\n');
    const url = URL.createObjectURL(new Blob(['\uFEFF', csv], { type: 'text/csv;charset=utf-8' }));
    const link = document.createElement('a');
    link.href = url;
    link.download = `nexus-simulasi-${currentUnit.id}-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
    addToast('CSV diunduh', `Snapshot telemetri simulasi ${currentUnit.name} tersimpan.`, 'success');
  };

  return (
    <main className="min-h-full flex flex-col p-4 md:p-8 space-y-5 max-w-[1480px] mx-auto w-full relative z-10 text-hi anim-rise">
      {/* 1. Industrial SCADA Sub-Header / Control Toolbar */}
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

      {/* 2. Workspace Navigation Tabs */}
      <nav aria-label="Navigasi ruang kendali" className="liquid-bar flex flex-wrap items-center justify-between gap-3 p-2 rounded-[22px]">
        <div className="flex flex-wrap items-center gap-1.5">
          <button
            aria-pressed={activeTab === 'dashboard'}
            onClick={() => {
              playClick();
              setActiveTab('dashboard');
            }}
            className={`h-11 px-4 rounded-2xl text-[13px] font-semibold flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'dashboard'
                ? 'bg-core-500 text-white shadow-sm'
                : 'text-mid hover:text-hi hover:bg-white/70'
            }`}
          >
            <Activity className="w-4 h-4" />
            <span>Ikhtisar</span>
          </button>

          <button
            aria-pressed={activeTab === 'charts'}
            onClick={() => {
              playClick();
              setActiveTab('charts');
            }}
            className={`h-11 px-4 rounded-2xl text-[13px] font-semibold flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'charts'
                ? 'bg-core-500 text-white shadow-sm'
                : 'text-mid hover:text-hi hover:bg-white/70'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>Proyeksi</span>
          </button>

          <button
            aria-pressed={activeTab === 'copilot'}
            onClick={() => {
              playClick();
              setActiveTab('copilot');
            }}
            className={`h-11 px-4 rounded-2xl text-[13px] font-semibold flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'copilot'
                ? 'bg-core-500 text-white shadow-sm'
                : 'text-mid hover:text-hi hover:bg-white/70'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>Asisten</span>
          </button>
        </div>

        <div className="flex items-center gap-2">
          {onNavigateToNational && (
            <button
              onClick={() => {
                playClick();
                onNavigateToNational();
              }}
              className="h-11 px-4 rounded-2xl bg-white/75 hover:bg-white text-indigo-800 text-[13px] font-semibold flex items-center gap-1.5 cursor-pointer transition-colors"
            >
              <Globe className="w-4 h-4 text-indigo-600" />
              <span>Peta nasional</span>
            </button>
          )}
        </div>
      </nav>

      {/* Tab 1: Full SCADA Instrumentation & Digital Twin View */}
      {activeTab === 'dashboard' && (
        <div className="space-y-4 anim-rise">
          <DashboardSummary
            state={telemetry}
            onShowForecast={() => { playClick(); setActiveTab('charts'); }}
            onEnableFilter={() => { toggleFilter(); addToast('Filter diaktifkan', 'Telemetri akan diperbarui sesuai kondisi filter.', 'success'); }}
          />

          <details className="group rounded-2xl surface-card">
            <summary className="list-none cursor-pointer flex items-center justify-between gap-3 p-5 font-semibold text-[14px] text-hi rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-core-500/50 [&::-webkit-details-marker]:hidden">
              <span className="flex items-center gap-3"><SlidersHorizontal className="w-5 h-5 text-core-600" /> Kendali operasi &amp; catatan kejadian</span>
              <ChevronDown className="w-4 h-4 text-mid transition-transform group-open:rotate-180" />
            </summary>
            <div className="px-4 pb-4">
              <ActuatorControlPanel
                state={telemetry}
                coolantRate={coolantRate}
                onCoolantChange={setCoolantRate}
                flueHeatOffset={flueHeatOffset}
                onFlueHeatChange={setFlueHeatOffset}
                onTriggerBackwash={triggerBackwash}
                onToggleFilter={toggleFilter}
                onCalibrateSensors={calibrateSensors}
                onApplyPreset={applyPreset}
                onClearLogs={clearLogs}
                logs={logs}
              />
            </div>
          </details>

          <details className="group rounded-2xl surface-card">
            <summary className="list-none cursor-pointer flex items-center justify-between gap-3 p-5 font-semibold text-[14px] text-hi rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-core-500/50 [&::-webkit-details-marker]:hidden">
              <span className="flex items-center gap-3"><Network className="w-5 h-5 text-core-600" /> Alur proses &amp; detail sensor</span>
              <ChevronDown className="w-4 h-4 text-mid transition-transform group-open:rotate-180" />
            </summary>
            <div className="px-4 pb-4 space-y-4">
              <ProcessSchematic state={telemetry} onTriggerBackwash={triggerBackwash} onToggleFilter={toggleFilter} />
              <TelemetryGauges state={telemetry} />
            </div>
          </details>
        </div>
      )}

      {/* Tab 2: Research Paper Experimental Data & Empirical Regression Charts */}
      {activeTab === 'charts' && (
        <div className="space-y-6 anim-rise">
          <AnalyticsCharts
            state={telemetry}
            powerWaveform={powerWaveform}
            coWaveform={coWaveform}
            co2Waveform={co2Waveform}
            powerUnit={telemetry.teg.powerUnit}
          />

        </div>
      )}

      {/* Tab 3: NEXUS AI Engineering Copilot */}
      {activeTab === 'copilot' && (
        <div className="space-y-6 anim-rise">
          <CypherCopilot
            state={telemetry}
            messages={copilotMessages}
            onSendMessage={sendCopilotQuery}
          />

        </div>
      )}

      {/* Floating Notifications */}
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
    </main>
  );
};
