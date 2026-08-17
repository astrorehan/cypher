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
import { useSound } from '../../utils/SoundProvider';

interface Props {
  state: ScadaSystemState;
  onSelectUnit: (id: SmelterUnitId) => void;
  onSetControlMode: (mode: ControlMode) => void;
  onHome?: () => void;
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
  const { playClick } = useSound();

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeStr(new Date().toLocaleTimeString('id-ID'));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const currentUnit = SMELTER_UNITS.find((u) => u.id === state.unitId) || SMELTER_UNITS[0];

  return (
    <div className="p-3.5 md:p-4 rounded-3xl bg-white/85 backdrop-blur-md border border-black/[.08] shadow-sm text-hi relative z-30">
      <div className="flex flex-wrap items-center justify-between gap-3">
        {/* Left: Brand + Smelter Unit Selector */}
        <div className="flex items-center gap-3 md:gap-4 flex-wrap">
          {onHome && (
            <button
              onClick={() => {
                playClick();
                onHome();
              }}
              title="Kembali ke Beranda"
              className="w-10 h-10 rounded-2xl glass-soft hover:bg-black/[.06] text-hi flex items-center justify-center transition-all cursor-pointer shadow-2xs active:scale-95"
            >
              <Home className="w-4 h-4" />
            </button>
          )}

          <div className="flex items-center gap-2.5">
            <CypherMark className="w-7 h-7" />
            <div>
              <div className="flex items-center gap-2">
                <span className="font-display font-black text-[16px] tracking-[0.2em] bg-gradient-to-r from-blue-700 via-cyan-600 to-emerald-600 bg-clip-text text-transparent">
                  CYPHER
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-core-500/10 text-core-600 font-bold border border-core-500/20">
                  SCADA LIVE
                </span>
              </div>
              <p className="text-[10.5px] text-lo font-mono hidden sm:block">
                Ruang Kendali Telemetri CEMS &amp; Pemanen TEG
              </p>
            </div>
          </div>

          {/* Unit Selector Dropdown */}
          <div className="relative pl-3 border-l border-black/[.08]">
            <button
              onClick={() => {
                playClick();
                setUnitDropdownOpen((v) => !v);
              }}
              className="h-10 px-3.5 rounded-2xl bg-slate-50 hover:bg-slate-100 border border-black/[.08] text-[13px] font-semibold text-hi flex items-center gap-2 transition-all cursor-pointer shadow-2xs"
            >
              <Flame className="w-4 h-4 text-amber-600 shrink-0" />
              <span className="max-w-[180px] sm:max-w-[240px] truncate">
                {currentUnit.name}
              </span>
              <ChevronDown
                className={`w-3.5 h-3.5 text-lo transition-transform ${
                  unitDropdownOpen ? 'rotate-180' : ''
                }`}
              />
            </button>

            {unitDropdownOpen && (
              <div className="absolute left-3 top-12 w-84 rounded-3xl bg-white/95 backdrop-blur-xl border border-black/[.08] shadow-2xl p-2 z-50 anim-pop">
                <div className="px-3 py-1.5 text-[10.5px] font-mono font-bold uppercase tracking-wider text-lo border-b border-black/[.06] mb-1">
                  Pilih Unit Smelter Target
                </div>
                {SMELTER_UNITS.map((unit) => {
                  const isSelected = unit.id === state.unitId;
                  return (
                    <button
                      key={unit.id}
                      onClick={() => {
                        playClick();
                        onSelectUnit(unit.id);
                        setUnitDropdownOpen(false);
                      }}
                      className={`w-full p-2.5 rounded-2xl text-left transition-all mb-1 cursor-pointer flex flex-col ${
                        isSelected
                          ? 'bg-core-500/10 text-core-700 border border-core-500/30 font-semibold'
                          : 'hover:bg-black/[.04] text-mid'
                      }`}
                    >
                      <div className="flex items-center justify-between text-[13px]">
                        <span className="font-semibold text-hi">{unit.name}</span>
                        {unit.isLabPrototype && (
                          <span className="text-[9.5px] font-mono px-1.5 py-0.5 rounded bg-emerald-500/15 text-emerald-700 font-bold">
                            ESAI UGM
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] text-lo truncate mt-0.5">
                        {unit.type} • {unit.capacity}
                      </span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Right: Mode Switcher + IoT Sync + Actions */}
        <div className="flex items-center gap-2.5 flex-wrap">
          {/* Mode Switcher */}
          <div className="flex items-center bg-black/[.04] p-1 rounded-2xl border border-black/[.06] text-[12px] font-semibold">
            <button
              onClick={() => {
                playClick();
                onSetControlMode('AUTO_CLOSED_LOOP');
              }}
              className={`px-3 py-1.5 rounded-xl flex items-center gap-1.5 transition-all cursor-pointer ${
                state.controlMode === 'AUTO_CLOSED_LOOP'
                  ? 'bg-core-500 text-white font-bold shadow-sm'
                  : 'text-mid hover:text-hi'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>AI Closed-Loop</span>
            </button>
            <button
              onClick={() => {
                playClick();
                onSetControlMode('MANUAL_OVERRIDE');
              }}
              className={`px-3 py-1.5 rounded-xl flex items-center gap-1.5 transition-all cursor-pointer ${
                state.controlMode === 'MANUAL_OVERRIDE'
                  ? 'bg-amber-500 text-white font-bold shadow-sm'
                  : 'text-mid hover:text-hi'
              }`}
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>Manual Override</span>
            </button>
          </div>

          {/* IoT Status Pill */}
          <div className="hidden lg:flex items-center gap-2 px-3 py-2 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-[11.5px] font-mono text-emerald-800">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-semibold">ESP32 &amp; NANO SYNCED</span>
          </div>

          {/* Timestamp */}
          <div className="hidden xl:block font-mono text-[12px] text-mid px-3 py-2 rounded-2xl bg-slate-50 border border-black/[.06]">
            {timeStr} WIB
          </div>

          {/* Export Action */}
          {onExportReport && (
            <button
              onClick={() => {
                playClick();
                onExportReport();
              }}
              title="Unduh Laporan Telemetri SCADA"
              className="h-10 px-4 rounded-2xl bg-core-500 text-white hover:brightness-110 shadow-sm text-[12.5px] font-semibold flex items-center gap-1.5 transition-all cursor-pointer active:scale-95"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Export SCADA</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
