import React from 'react';
import {
  Sliders,
  RefreshCw,
  AlertTriangle,
  Radio,
  SlidersHorizontal,
  CheckCircle2,
  Terminal,
  Activity,
  Zap,
} from 'lucide-react';
import { ScadaSystemState, ScadaEventLog } from '../../engine/cypherTypes';

interface Props {
  state: ScadaSystemState;
  coolantRate: number;
  onCoolantChange: (val: number) => void;
  flueHeatOffset: number;
  onFlueHeatChange: (val: number) => void;
  onTriggerBackwash: () => void;
  onToggleFilter: () => void;
  onCalibrateSensors: () => void;
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
  logs,
}) => {
  const isLab = state.unitId === 'prototype-lab';

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
      {/* Left 7 cols: Actuator Controls & Variable Setpoints */}
      <div className="lg:col-span-7 rounded-3xl bg-white border border-slate-200 shadow-sm p-6 space-y-6">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-cyan-600" />
            <h3 className="font-bold text-[15px] text-slate-900">
              Panel Aktuator &amp; Parameter Dinamis
            </h3>
          </div>
          <span className="text-[11px] font-mono font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
            Kendali Operasional
          </span>
        </div>

        {/* Sliders Grid */}
        <div className="space-y-4">
          {/* Slider 1: Coolant Flow Rate */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
            <div className="flex items-center justify-between text-[13px] font-semibold mb-2">
              <span className="text-slate-700">Laju Alir Pompa Pendingin (Sisi Dingin TEG):</span>
              <span className="font-mono text-cyan-700 font-bold">{coolantRate} L/min</span>
            </div>
            <input
              type="range"
              min="10"
              max="90"
              value={coolantRate}
              onChange={(e) => onCoolantChange(Number(e.target.value))}
              className="w-full accent-cyan-600 cursor-pointer"
            />
            <div className="flex justify-between text-[10.5px] font-mono text-slate-600 mt-1">
              <span>10 L/min (Suhu Naik)</span>
              <span>Optimal (50 L/min)</span>
              <span>90 L/min (ΔT Maksimal)</span>
            </div>
          </div>

          {/* Slider 2: Heat Flue Offset Simulation */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
            <div className="flex items-center justify-between text-[13px] font-semibold mb-2">
              <span className="text-slate-700">Variasi Termal Flue Gas Smelter:</span>
              <span className="font-mono text-amber-700 font-bold">
                {flueHeatOffset >= 0 ? `+${flueHeatOffset}` : flueHeatOffset} °C
              </span>
            </div>
            <input
              type="range"
              min="-20"
              max="30"
              value={flueHeatOffset}
              onChange={(e) => onFlueHeatChange(Number(e.target.value))}
              className="w-full accent-amber-500 cursor-pointer"
            />
            <div className="flex justify-between text-[10.5px] font-mono text-slate-600 mt-1">
              <span>Beban Rendah (-20°C)</span>
              <span>Beban Nominal (0°C)</span>
              <span>Thermal Surge (+30°C)</span>
            </div>
          </div>
        </div>

        {/* Quick Action Buttons Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
          {/* Action 1: Force Backwash */}
          <button
            onClick={onTriggerBackwash}
            disabled={state.filter.chamberStatus === 'PURGING_BACKWASH'}
            className="p-3.5 rounded-2xl bg-cyan-50 hover:bg-cyan-100 border border-cyan-200 text-cyan-800 font-semibold text-[12.5px] flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 text-cyan-600 ${state.filter.chamberStatus === 'PURGING_BACKWASH' ? 'animate-spin' : ''}`} />
            <span>{state.filter.chamberStatus === 'PURGING_BACKWASH' ? 'Purging Aktif...' : '⚡ Force Backwash'}</span>
            <span className="text-[10px] text-cyan-700 font-normal">Pembersihan Membran</span>
          </button>

          {/* Action 2: Toggle Bypass */}
          <button
            onClick={onToggleFilter}
            className={`p-3.5 rounded-2xl border font-semibold text-[12.5px] flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer ${
              state.filter.active
                ? 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700'
                : 'bg-rose-50 hover:bg-rose-100 border-rose-200 text-rose-800'
            }`}
          >
            <AlertTriangle className={`w-4 h-4 ${state.filter.active ? 'text-slate-500' : 'text-rose-600'}`} />
            <span>{state.filter.active ? 'Uji Buka Bypass' : 'Kunci Tutup Bypass'}</span>
            <span className="text-[10px] font-normal text-slate-500">
              {state.filter.active ? 'Filter Aktif' : 'Status Bypass'}
            </span>
          </button>

          {/* Action 3: Calibrate Sensors */}
          <button
            onClick={onCalibrateSensors}
            className="p-3.5 rounded-2xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-800 font-semibold text-[12.5px] flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer"
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Kalibrasi Sensor CEMS</span>
            <span className="text-[10px] text-emerald-700 font-normal">ENS160 &amp; AHT21 Zero/Span</span>
          </button>
        </div>
      </div>

      {/* Right 5 cols: SCADA Real-Time Event & Protocol Logs */}
      <div className="lg:col-span-5 rounded-3xl bg-slate-900 border border-slate-800 text-slate-200 shadow-sm p-6 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3">
            <div className="flex items-center gap-2">
              <Terminal className="w-4 h-4 text-cyan-400" />
              <h3 className="font-bold text-[14px] text-white font-mono uppercase">
                SCADA IoT Event Log Feed
              </h3>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold">
              LIVE BROADCAST
            </span>
          </div>

          <div className="space-y-2.5 max-h-[290px] overflow-y-auto pr-1 scroll-paper font-mono text-[11.5px]">
            {logs.map((log) => (
              <div
                key={log.id}
                className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80 flex items-start gap-2"
              >
                <span
                  className={`px-1.5 py-0.5 rounded text-[9.5px] font-bold shrink-0 mt-0.5 ${
                    log.level === 'SUCCESS'
                      ? 'bg-emerald-500/20 text-emerald-400'
                      : log.level === 'WARNING'
                      ? 'bg-amber-500/20 text-amber-400'
                      : log.level === 'ALERT'
                      ? 'bg-rose-500/20 text-rose-400'
                      : 'bg-cyan-500/20 text-cyan-400'
                  }`}
                >
                  {log.source}
                </span>
                <div className="min-w-0 flex-1 leading-snug">
                  <span className="text-slate-400 text-[10px] mr-1.5">[{log.timestamp}]</span>
                  <span className="text-slate-200">{log.message}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="pt-3 border-t border-slate-800 text-[11px] font-mono text-slate-400 flex items-center justify-between">
          <span>Loop Interlock: TERSINKRON</span>
          <span className="text-cyan-400">Protokol MQTT &amp; SCADA OPC-UA</span>
        </div>
      </div>
    </div>
  );
};
