import React, { useState, useEffect } from 'react';
import {
  Activity,
  Cpu,
  Radio,
  Download,
  Flame,
  Home,
  Sliders,
  ShieldCheck,
  AlertTriangle,
  ChevronDown,
  RefreshCw,
  Sparkles,
} from 'lucide-react';
import { CypherMark } from '../brand/CypherMark';
import { SmelterUnitId, ControlMode, ScadaSystemState } from '../../engine/cypherTypes';
import { SMELTER_UNITS } from '../../engine/cypherData';
import { SoundToggle } from '../ui/SoundToggle';

interface Props {
  state: ScadaSystemState;
  onSelectUnit: (id: SmelterUnitId) => void;
  onSetControlMode: (mode: ControlMode) => void;
  onHome: () => void;
  onExportReport?: () => void;
}

export const ScadaHeader: React.FC<Props> = ({
  state,
  onSelectUnit,
  onSetControlMode,
  onHome,
  onExportReport,
}) => {
  const [timeStr, setTimeStr] = useState<string>(new Date().toLocaleTimeString('id-ID'));
  const [unitDropdownOpen, setUnitDropdownOpen] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeStr(new Date().toLocaleTimeString('id-ID'));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const currentUnit = SMELTER_UNITS.find((u) => u.id === state.unitId) || SMELTER_UNITS[0];

  return (
    <header className="shrink-0 bg-slate-900 border-b border-slate-800 text-white px-4 md:px-6 py-3 select-none relative z-30 shadow-lg">
      <div className="max-w-[1600px] mx-auto flex flex-wrap items-center justify-between gap-3">
        {/* Left: Brand + Navigation + Smelter Target Selector */}
        <div className="flex items-center gap-3 md:gap-5">
          <button
            onClick={onHome}
            title="Kembali ke Beranda"
            className="w-9 h-9 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center transition-all cursor-pointer shadow-inner"
          >
            <Home className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-2.5">
            <CypherMark className="w-7 h-7" />
            <div className="leading-tight">
              <div className="flex items-center gap-2">
                <span className="font-display font-black text-[17px] tracking-[0.2em] bg-gradient-to-r from-sky-400 via-cyan-300 to-emerald-400 bg-clip-text text-transparent">
                  CYPHER
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 font-semibold uppercase border border-cyan-500/30">
                  SCADA &amp; CEMS
                </span>
              </div>
              <p className="text-[10px] text-slate-400 font-mono hidden sm:block">
                Carbon-neutral Yield Predictive Hybrid Emission Regulator
              </p>
            </div>
          </div>

          {/* Unit Selector Dropdown */}
          <div className="relative pl-3 border-l border-slate-800">
            <button
              onClick={() => setUnitDropdownOpen((v) => !v)}
              className="h-9 px-3 rounded-xl bg-slate-800 hover:bg-slate-750 border border-slate-700 text-[12.5px] font-medium text-slate-200 flex items-center gap-2 transition-all cursor-pointer"
            >
              <Flame className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span className="font-semibold text-white max-w-[180px] sm:max-w-[240px] truncate">
                {currentUnit.name}
              </span>
              <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${unitDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {unitDropdownOpen && (
              <div className="absolute left-3 top-11 w-80 rounded-2xl bg-slate-900/95 backdrop-blur-xl border border-slate-700 shadow-2xl p-2 z-50 anim-pop">
                <div className="px-3 py-1.5 text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 border-b border-slate-800 mb-1">
                  Pilih Unit Smelter &amp; Skala Uji
                </div>
                {SMELTER_UNITS.map((unit) => {
                  const isSelected = unit.id === state.unitId;
                  return (
                    <button
                      key={unit.id}
                      onClick={() => {
                        onSelectUnit(unit.id);
                        setUnitDropdownOpen(false);
                      }}
                      className={`w-full p-2.5 rounded-xl text-left transition-all mb-1 cursor-pointer flex flex-col ${
                        isSelected
                          ? 'bg-cyan-500/20 text-cyan-200 border border-cyan-500/40'
                          : 'hover:bg-slate-800/80 text-slate-300'
                      }`}
                    >
                      <div className="flex items-center justify-between text-[12.5px] font-semibold text-white">
                        <span>{unit.name}</span>
                        {unit.isLabPrototype && (
                          <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold">
                            ESAI UGM
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] text-slate-400 truncate mt-0.5">
                        {unit.type} • {unit.capacity}
                      </span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Center/Right: Control Mode + IoT Status + Actions */}
        <div className="flex items-center gap-2 md:gap-3 flex-wrap">
          {/* Mode Switcher */}
          <div className="flex items-center bg-slate-800 p-1 rounded-xl border border-slate-700 text-[11.5px] font-semibold">
            <button
              onClick={() => onSetControlMode('AUTO_CLOSED_LOOP')}
              className={`px-3 py-1 rounded-lg flex items-center gap-1.5 transition-all cursor-pointer ${
                state.controlMode === 'AUTO_CLOSED_LOOP'
                  ? 'bg-cyan-500 text-slate-950 font-bold shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Sparkles className="w-3 h-3" />
              <span>AI Closed-Loop</span>
            </button>
            <button
              onClick={() => onSetControlMode('MANUAL_OVERRIDE')}
              className={`px-3 py-1 rounded-lg flex items-center gap-1.5 transition-all cursor-pointer ${
                state.controlMode === 'MANUAL_OVERRIDE'
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Sliders className="w-3 h-3" />
              <span>Manual Override</span>
            </button>
          </div>

          {/* IoT Sync Status Pill */}
          <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-800/80 border border-slate-700/80 text-[11px] font-mono">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-emerald-300 font-semibold">
              ESP32 &amp; NANO SYNCED
            </span>
          </div>

          {/* Live Timestamp */}
          <div className="hidden xl:block font-mono text-[12px] text-slate-300 px-2.5 py-1 rounded-lg bg-slate-800/60 border border-slate-700/50">
            {timeStr} WIB
          </div>

          {/* Export Report Action */}
          {onExportReport && (
            <button
              onClick={onExportReport}
              title="Unduh Telemetri SCADA & Kepatuhan KLHK"
              className="h-9 px-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-[12px] font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-cyan-400" />
              <span className="hidden sm:inline">Export SCADA</span>
            </button>
          )}

          <SoundToggle />
        </div>
      </div>
    </header>
  );
};
