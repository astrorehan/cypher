import React, { useState } from 'react';
import {
  SlidersHorizontal,
  RefreshCw,
  AlertTriangle,
  CheckCircle2,
  Terminal,
  Zap,
  Wind,
  Flame,
  Activity,
  Cpu,
  ShieldCheck,
  Radio,
  Sparkles,
  RotateCcw,
  Sliders,
  Trash2,
  Download,
  Gauge,
  Layers,
  Thermometer,
} from 'lucide-react';
import { ScadaSystemState, ScadaEventLog } from '../../engine/cypherTypes';
import { useSound } from '../../utils/SoundProvider';
import { Meter } from '../ui/primitives';

interface Props {
  state: ScadaSystemState;
  coolantRate: number;
  onCoolantChange: (val: number) => void;
  flueHeatOffset: number;
  onFlueHeatChange: (val: number) => void;
  onTriggerBackwash: () => void;
  onToggleFilter: () => void;
  onCalibrateSensors: () => void;
  onApplyPreset?: (presetId: 'MAX_POWER' | 'ECO_COMPLIANCE' | 'LAB_BENCHMARK' | 'SURGE_PROTECT') => void;
  onClearLogs?: () => void;
  logs: ScadaEventLog[];
}

export const ActuatorControlPanel: React.FC<Props> = ({
  state,
  coolantRate,
  onCoolantChange,
  flueHeatOffset,
  onFlueHeatChange,
  onTriggerBackwash,
  onToggleFilter,
  onCalibrateSensors,
  onApplyPreset,
  onClearLogs,
  logs,
}) => {
  const isLab = state.unitId === 'prototype-lab';
  const { playClick, playBackwash, playAlarm } = useSound();
  const [logFilter, setLogFilter] = useState<'ALL' | 'TEG' | 'CEMS' | 'FILTER' | 'AI' | 'OPERATOR'>('ALL');
  const [activePreset, setActivePreset] = useState<string | null>(null);

  const filteredLogs = logs.filter((l) => {
    if (logFilter === 'ALL') return true;
    if (logFilter === 'TEG') return l.source === 'TEG_HARVESTER';
    if (logFilter === 'CEMS') return l.source === 'CEMS_IOT';
    if (logFilter === 'FILTER') return l.source === 'SMART_FILTER';
    if (logFilter === 'AI') return l.source === 'AI_CONTROLLER';
    if (logFilter === 'OPERATOR') return l.source === 'OPERATOR';
    return true;
  });

  const handlePreset = (presetId: 'MAX_POWER' | 'ECO_COMPLIANCE' | 'LAB_BENCHMARK' | 'SURGE_PROTECT') => {
    setActivePreset(presetId);
    if (onApplyPreset) {
      onApplyPreset(presetId);
    }
  };

  return (
    <div className="space-y-4">
      {/* 1. Top Quick Scenario Presets Toolbar */}
      <div className="p-4 rounded-3xl bg-white border border-black/[.08] shadow-sm flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <span className="w-8 h-8 rounded-xl bg-core-500/10 text-core-600 flex items-center justify-center">
            <Sparkles className="w-4 h-4" />
          </span>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[13px] font-bold text-hi font-mono uppercase tracking-wider">
                Preset Operasional Kendali Cerdas
              </span>
              <span className="text-[9.5px] font-mono px-2 py-0.5 rounded-full bg-core-500/10 text-core-700 font-bold border border-core-500/20">
                SCADA AUTO-TUNE
              </span>
            </div>
            <p className="text-[11.5px] text-mid">
              Konfigurasi parameter otomatis berbasis machine learning dan data empiris esai UGM 2026.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto scrollbar-none flex-wrap">
          <button
            onClick={() => handlePreset('MAX_POWER')}
            className={`h-9 px-3.5 rounded-2xl text-[12px] font-semibold flex items-center gap-1.5 transition-all cursor-pointer shadow-2xs ${
              activePreset === 'MAX_POWER'
                ? 'bg-core-500 text-white font-bold shadow-md scale-[1.02]'
                : 'bg-cyan-50 hover:bg-cyan-100 text-cyan-800 border border-cyan-200'
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            <span>Pemanenan Maksimal</span>
          </button>

          <button
            onClick={() => handlePreset('ECO_COMPLIANCE')}
            className={`h-9 px-3.5 rounded-2xl text-[12px] font-semibold flex items-center gap-1.5 transition-all cursor-pointer shadow-2xs ${
              activePreset === 'ECO_COMPLIANCE'
                ? 'bg-emerald-600 text-white font-bold shadow-md scale-[1.02]'
                : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200'
            }`}
          >
            <Wind className="w-3.5 h-3.5" />
            <span>Kepatuhan Net-Zero</span>
          </button>

          <button
            onClick={() => handlePreset('LAB_BENCHMARK')}
            className={`h-9 px-3.5 rounded-2xl text-[12px] font-semibold flex items-center gap-1.5 transition-all cursor-pointer shadow-2xs ${
              activePreset === 'LAB_BENCHMARK'
                ? 'bg-indigo-600 text-white font-bold shadow-md scale-[1.02]'
                : 'bg-indigo-50 hover:bg-indigo-100 text-indigo-800 border border-indigo-200'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            <span>Uji Lab UGM (TEC1-12706)</span>
          </button>

          <button
            onClick={() => handlePreset('SURGE_PROTECT')}
            className={`h-9 px-3.5 rounded-2xl text-[12px] font-semibold flex items-center gap-1.5 transition-all cursor-pointer shadow-2xs ${
              activePreset === 'SURGE_PROTECT'
                ? 'bg-amber-600 text-white font-bold shadow-md scale-[1.02]'
                : 'bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200'
            }`}
          >
            <Flame className="w-3.5 h-3.5" />
            <span>Peredam Lonjakan Panas</span>
          </button>
        </div>
      </div>

      {/* 2. Main 12-Column Grid: Left Controls (7 cols) & Right Logs (5 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left 7 cols: Actuator Controls & Variable Setpoints */}
        <div className="lg:col-span-7 rounded-3xl bg-white border border-black/[.08] shadow-sm p-5 md:p-6 space-y-6 flex flex-col justify-between">
          <div>
            {/* Header */}
            <div className="flex items-center justify-between pb-3.5 border-b border-black/[.08] mb-5">
              <div className="flex items-center gap-2.5">
                <span className="w-8 h-8 rounded-xl bg-core-500/10 text-core-600 flex items-center justify-center">
                  <SlidersHorizontal className="w-4 h-4" />
                </span>
                <div>
                  <h3 className="font-display font-bold text-[15px] text-hi">
                    Panel Aktuator Smelter &amp; Parameter Dinamis
                  </h3>
                  <p className="text-[11px] font-mono text-mid">
                    Kendali loop tertutup Seebeck TEG, laju alir fluida, dan siklus filtrasi.
                  </p>
                </div>
              </div>
              <span className="text-[10.5px] font-mono font-bold px-2.5 py-1 rounded-full bg-emerald-500/15 text-emerald-700 border border-emerald-500/30">
                INTERLOCK: ACTIVE
              </span>
            </div>

            {/* Sliders Grid */}
            <div className="space-y-4">
              {/* Slider 1: Coolant Flow Rate */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-black/[.06] space-y-2.5">
                <div className="flex items-center justify-between text-[13px] font-semibold">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-core-500 animate-pulse" />
                    <span className="text-hi">Pompa Pendingin Sisi Dingin TEG (T-cold):</span>
                  </div>
                  <span className="font-mono text-core-600 font-bold text-[14px]">
                    {coolantRate} L/min
                  </span>
                </div>

                <div className="space-y-1.5">
                  <input
                    type="range"
                    min="10"
                    max="90"
                    value={coolantRate}
                    onChange={(e) => {
                      playClick();
                      onCoolantChange(Number(e.target.value));
                      setActivePreset(null);
                    }}
                    className="w-full accent-core-500 cursor-pointer h-2 bg-slate-200 rounded-lg appearance-none"
                  />
                  <div className="pt-1">
                    <Meter value={coolantRate} max={90} tone="#0284c7" />
                  </div>
                </div>

                <div className="flex justify-between items-center text-[10.5px] font-mono text-mid pt-1">
                  <span className="text-lo">10 L/min (Suhu Naik)</span>
                  <span className="text-core-600 font-semibold">
                    Estimasi ΔT: ~{state.teg.deltaT}°C | Daya: {state.teg.power} {state.teg.powerUnit}
                  </span>
                  <span className="text-lo">90 L/min (ΔT Maksimal)</span>
                </div>
              </div>

              {/* Slider 2: Heat Flue Offset Simulation */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-black/[.06] space-y-2.5">
                <div className="flex items-center justify-between text-[13px] font-semibold">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-amber-500" />
                    <span className="text-hi">Variasi Termal Flue Gas Smelter (T-hot):</span>
                  </div>
                  <span className="font-mono text-amber-700 font-bold text-[14px]">
                    {flueHeatOffset >= 0 ? `+${flueHeatOffset}` : flueHeatOffset} °C
                  </span>
                </div>

                <div className="space-y-1.5">
                  <input
                    type="range"
                    min="-20"
                    max="30"
                    value={flueHeatOffset}
                    onChange={(e) => {
                      playClick();
                      onFlueHeatChange(Number(e.target.value));
                      setActivePreset(null);
                    }}
                    className="w-full accent-amber-500 cursor-pointer h-2 bg-slate-200 rounded-lg appearance-none"
                  />
                  <div className="pt-1">
                    <Meter
                      value={flueHeatOffset + 20}
                      max={50}
                      tone={flueHeatOffset > 15 ? '#e11d48' : '#f59e0b'}
                      danger={flueHeatOffset > 25}
                    />
                  </div>
                </div>

                <div className="flex justify-between items-center text-[10.5px] font-mono text-mid pt-1">
                  <span className="text-lo">Beban Rendah (-20°C)</span>
                  <span className="text-amber-700 font-semibold">
                    Flue Gas: {state.teg.tempHot}°C (Stabil 40–48°C filter)
                  </span>
                  <span className="text-lo">Thermal Surge (+30°C)</span>
                </div>
              </div>
            </div>

            {/* Quick Action Buttons Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-5">
              {/* Action 1: Force Backwash */}
              <button
                onClick={() => {
                  playBackwash();
                  onTriggerBackwash();
                }}
                disabled={state.filter.chamberStatus === 'PURGING_BACKWASH'}
                className="p-3.5 rounded-2xl bg-cyan-50 hover:bg-cyan-100 border border-cyan-200 text-cyan-900 font-semibold text-[12.5px] flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer disabled:opacity-50 shadow-2xs group"
              >
                <div className="w-8 h-8 rounded-xl bg-cyan-100 text-cyan-700 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <RefreshCw
                    className={`w-4 h-4 ${
                      state.filter.chamberStatus === 'PURGING_BACKWASH' ? 'animate-spin text-cyan-600' : ''
                    }`}
                  />
                </div>
                <span className="text-hi font-bold">
                  {state.filter.chamberStatus === 'PURGING_BACKWASH' ? 'Purging Aktif...' : '⚡ Force Backwash'}
                </span>
                <span className="text-[10.5px] text-cyan-700 font-mono">
                  Pulse-Jet 6 Bar Membran
                </span>
              </button>

              {/* Action 2: Toggle Bypass */}
              <button
                onClick={() => {
                  if (state.filter.active) {
                    playAlarm();
                  } else {
                    playClick();
                  }
                  onToggleFilter();
                }}
                className={`p-3.5 rounded-2xl border font-semibold text-[12.5px] flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer shadow-2xs group ${
                  state.filter.active
                    ? 'bg-slate-50 hover:bg-slate-100 border-black/[.08] text-hi'
                    : 'bg-rose-50 hover:bg-rose-100 border-rose-300 text-rose-900 animate-pulse'
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform ${
                    state.filter.active ? 'bg-slate-200 text-slate-700' : 'bg-rose-100 text-rose-700'
                  }`}
                >
                  <AlertTriangle className="w-4 h-4" />
                </div>
                <span className="text-hi font-bold">
                  {state.filter.active ? 'Uji Buka Bypass' : 'Kunci Tutup Bypass'}
                </span>
                <span
                  className={`text-[10.5px] font-mono ${
                    state.filter.active ? 'text-lo' : 'text-rose-700 font-bold'
                  }`}
                >
                  {state.filter.active ? 'Filter Aktif (99.4%)' : 'Bypass Cerobong Mentah'}
                </span>
              </button>

              {/* Action 3: Calibrate Sensors */}
              <button
                onClick={() => {
                  playClick();
                  onCalibrateSensors();
                }}
                className="p-3.5 rounded-2xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-900 font-semibold text-[12.5px] flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer shadow-2xs group"
              >
                <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <span className="text-hi font-bold">Kalibrasi Sensor CEMS</span>
                <span className="text-[10.5px] text-emerald-700 font-mono">
                  ENS160 &amp; AHT21 Zero/Span
                </span>
              </button>
            </div>
          </div>

          {/* Subsystem Health Matrix Footer */}
          <div className="pt-4 border-t border-black/[.06] grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] font-mono">
            <div className="p-2.5 rounded-2xl bg-slate-50 border border-black/[.04] flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-core-500" />
              <span className="text-lo">Modul TEG:</span>
              <span className="text-core-700 font-bold ml-auto">OK</span>
            </div>
            <div className="p-2.5 rounded-2xl bg-slate-50 border border-black/[.04] flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span className="text-lo">Filter ΔP:</span>
              <span className="text-emerald-700 font-bold ml-auto">
                {state.filter.differentialPressure.toFixed(2)} kPa
              </span>
            </div>
            <div className="p-2.5 rounded-2xl bg-slate-50 border border-black/[.04] flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-indigo-500" />
              <span className="text-lo">CEMS ESP32:</span>
              <span className="text-indigo-700 font-bold ml-auto">SYNC</span>
            </div>
            <div className="p-2.5 rounded-2xl bg-slate-50 border border-black/[.04] flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-teal-500" />
              <span className="text-lo">Baku KLHK:</span>
              <span className="text-teal-700 font-bold ml-auto">PASS</span>
            </div>
          </div>
        </div>

        {/* Right 5 cols: SCADA Real-Time Event & Protocol Logs */}
        <div className="lg:col-span-5 rounded-3xl bg-white border border-black/[.08] shadow-sm p-5 md:p-6 flex flex-col justify-between">
          <div>
            {/* Header */}
            <div className="flex items-center justify-between pb-3.5 border-b border-black/[.08] mb-3">
              <div className="flex items-center gap-2.5">
                <span className="w-8 h-8 rounded-xl bg-core-500/10 text-core-600 flex items-center justify-center">
                  <Terminal className="w-4 h-4" />
                </span>
                <div>
                  <h3 className="font-bold text-[14px] text-hi font-mono uppercase tracking-wider">
                    SCADA IoT Event Feed
                  </h3>
                  <p className="text-[10.5px] text-lo font-mono">
                    Audit log telemetri MQTT &amp; status aktuator.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                {onClearLogs && (
                  <button
                    onClick={() => {
                      playClick();
                      onClearLogs();
                    }}
                    title="Bersihkan Log"
                    className="w-7 h-7 rounded-xl bg-slate-100 hover:bg-slate-200 text-lo hover:text-hi flex items-center justify-center transition-all cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
                <span className="text-[10px] font-mono px-2.5 py-1 rounded-full bg-emerald-500/15 text-emerald-700 font-bold flex items-center gap-1.5 border border-emerald-500/20">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                  LIVE
                </span>
              </div>
            </div>

            {/* Filter Category Chips */}
            <div className="flex items-center gap-1.5 mb-3 overflow-x-auto scrollbar-none pb-1 font-mono text-[10.5px]">
              {(['ALL', 'TEG', 'CEMS', 'FILTER', 'AI', 'OPERATOR'] as const).map((cat) => (
                <button
                  key={cat}
                  onClick={() => {
                    playClick();
                    setLogFilter(cat);
                  }}
                  className={`px-2.5 py-1 rounded-xl font-semibold transition-all cursor-pointer shrink-0 ${
                    logFilter === cat
                      ? 'bg-core-500 text-white shadow-2xs font-bold'
                      : 'bg-slate-100 text-mid hover:bg-slate-200 hover:text-hi'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Scrollable Logs Container */}
            <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1 scroll-paper font-mono text-[11.5px]">
              {filteredLogs.length === 0 ? (
                <div className="p-6 text-center text-lo font-mono text-[12px]">
                  Tidak ada event log untuk kategori ini.
                </div>
              ) : (
                filteredLogs.map((log) => (
                  <div
                    key={log.id}
                    className="p-2.5 rounded-2xl bg-slate-50 border border-black/[.05] flex items-start gap-2 hover:bg-white hover:shadow-2xs transition-all anim-rise"
                  >
                    <span
                      className={`px-1.5 py-0.5 rounded-md text-[9px] font-bold shrink-0 mt-0.5 ${
                        log.level === 'SUCCESS'
                          ? 'bg-emerald-100 text-emerald-800'
                          : log.level === 'WARNING'
                          ? 'bg-amber-100 text-amber-800'
                          : log.level === 'ALERT'
                          ? 'bg-rose-100 text-rose-800'
                          : 'bg-cyan-100 text-cyan-800'
                      }`}
                    >
                      {log.source}
                    </span>
                    <div className="min-w-0 flex-1 leading-snug">
                      <span className="text-lo text-[10px] mr-1.5">[{log.timestamp}]</span>
                      <span className="text-hi font-medium">{log.message}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Footer Bar */}
          <div className="pt-3 border-t border-black/[.06] text-[11px] font-mono text-lo flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-emerald-700 font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              Interlock: TERSINKRON
            </span>
            <span className="text-core-600 font-medium">Protokol MQTT &amp; SCADA OPC-UA</span>
          </div>
        </div>
      </div>
    </div>
  );
};
