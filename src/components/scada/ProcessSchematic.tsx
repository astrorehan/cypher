import React, { useState } from 'react';
import {
  Flame,
  Zap,
  Wind,
  Activity,
  Cpu,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Sliders,
  ChevronRight,
  Info,
} from 'lucide-react';
import { ScadaSystemState } from '../../engine/cypherTypes';
import { useSound } from '../../utils/SoundProvider';

interface Props {
  state: ScadaSystemState;
  onTriggerBackwash?: () => void;
  onToggleFilter?: () => void;
}

export const ProcessSchematic: React.FC<Props> = ({
  state,
  onTriggerBackwash,
  onToggleFilter,
}) => {
  const [selectedNode, setSelectedNode] = useState<string | null>('teg');
  const isLab = state.unitId === 'prototype-lab';
  const { playClick, playBackwash, playAlarm } = useSound();

  return (
    <div className="rounded-3xl bg-white border border-black/[.08] text-hi p-5 md:p-6 shadow-sm relative overflow-hidden">
      {/* Decorative subtle ambient glows */}
      <div className="absolute inset-0 pointer-events-none opacity-40">
        <div className="absolute top-0 left-1/4 w-80 h-80 bg-cyan-500/10 rounded-full filter blur-[80px]" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-emerald-500/10 rounded-full filter blur-[80px]" />
      </div>

      {/* Schematic Title & Status Badge */}
      <div className="relative z-10 flex flex-wrap items-center justify-between gap-3 mb-6">
        <div>
          <div className="flex items-center gap-2 text-core-600 font-mono text-[11px] font-bold uppercase tracking-wider mb-0.5">
            <Cpu className="w-3.5 h-3.5" />
            <span>Digital Twin • Skema Alir Proses Terintegrasi (P&amp;ID)</span>
          </div>
          <h2 className="font-display text-[18px] md:text-[20px] font-extrabold text-hi">
            Integrasi 3 Modul CYPHER: Pemanenan Panas, Filtrasi &amp; CEMS IoT
          </h2>
        </div>

        <div className="flex items-center gap-2 text-[12px] font-mono">
          <span
            className={`px-3.5 py-1.5 rounded-full border flex items-center gap-2 font-bold ${
              state.filter.active
                ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                : 'bg-amber-50 text-amber-800 border-amber-200'
            }`}
          >
            <span
              className={`w-2 h-2 rounded-full ${
                state.filter.active ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'
              }`}
            />
            <span>
              STATUS ALIRAN: {state.filter.active ? 'TERINTEGRASI PENUH' : 'BYPASS AKTIF'}
            </span>
          </span>
        </div>
      </div>

      {/* Interactive Process Pipeline Diagram */}
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-5 gap-3.5 items-stretch mb-6">
        {/* Node 1: Smelter Furnace / Flue Gas Source */}
        <div
          onClick={() => {
            playClick();
            setSelectedNode('furnace');
          }}
          className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
            selectedNode === 'furnace'
              ? 'bg-amber-50/40 border-amber-500 shadow-md ring-2 ring-amber-500/20'
              : 'bg-slate-50/80 border-black/[.06] hover:bg-white hover:shadow-sm'
          }`}
        >
          <div>
            <div className="flex items-center justify-between text-[11px] font-mono text-amber-700 mb-2">
              <span className="font-bold uppercase">Tahap 01</span>
              <Flame className="w-4 h-4 text-amber-600 animate-pulse" />
            </div>
            <h3 className="font-display text-[14px] font-bold text-hi mb-1">
              Sumber Flue Gas
            </h3>
            <p className="text-[11.5px] text-mid leading-snug">
              Gas buang panas hasil peleburan tungku smelter nikel.
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-black/[.06] space-y-1 font-mono text-[11px]">
            <div className="flex justify-between">
              <span className="text-lo">Suhu Gas (T-in):</span>
              <span className="font-bold text-amber-700">{state.teg.tempHot} °C</span>
            </div>
            <div className="flex justify-between">
              <span className="text-lo">Laju Alir:</span>
              <span className="font-bold text-hi">
                {state.cems.gasFlow} {isLab ? 'L/min' : 'm³/jam'}
              </span>
            </div>
          </div>
        </div>

        {/* Node 2: Modul 1 TEG Waste Heat Harvester */}
        <div
          onClick={() => {
            playClick();
            setSelectedNode('teg');
          }}
          className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
            selectedNode === 'teg'
              ? 'bg-cyan-50/40 border-core-500 shadow-md ring-2 ring-core-500/20'
              : 'bg-slate-50/80 border-black/[.06] hover:bg-white hover:shadow-sm'
          }`}
        >
          <div>
            <div className="flex items-center justify-between text-[11px] font-mono text-core-600 mb-2">
              <span className="font-bold uppercase">Modul 1 • TEG</span>
              <Zap className="w-4 h-4 text-core-500" />
            </div>
            <h3 className="font-display text-[14px] font-bold text-hi mb-1">
              Pemanen Termoelektrik
            </h3>
            <p className="text-[11.5px] text-mid leading-snug">
              Konversi Seebeck (P = 0.52 ΔT + 0.08) menjadi listrik mandiri.
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-black/[.06] space-y-1 font-mono text-[11px]">
            <div className="flex justify-between">
              <span className="text-lo">Gradien (ΔT):</span>
              <span className="font-bold text-core-600">{state.teg.deltaT} °C</span>
            </div>
            <div className="flex justify-between">
              <span className="text-lo">Daya Listrik:</span>
              <span className="font-bold text-core-700">
                {state.teg.power} {state.teg.powerUnit}
              </span>
            </div>
          </div>
        </div>

        {/* Node 3: Modul 2 Advanced Dry Filtration Chamber */}
        <div
          onClick={() => {
            playClick();
            setSelectedNode('filter');
          }}
          className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
            selectedNode === 'filter'
              ? 'bg-emerald-50/40 border-emerald-500 shadow-md ring-2 ring-emerald-500/20'
              : 'bg-slate-50/80 border-black/[.06] hover:bg-white hover:shadow-sm'
          }`}
        >
          <div>
            <div className="flex items-center justify-between text-[11px] font-mono text-emerald-700 mb-2">
              <span className="font-bold uppercase">Modul 2 • Filter</span>
              <Wind className="w-4 h-4 text-emerald-600" />
            </div>
            <h3 className="font-display text-[14px] font-bold text-hi mb-1">
              Filtrasi Partikulat &amp; Gas
            </h3>
            <p className="text-[11.5px] text-mid leading-snug">
              Penurunan CO hingga 28 ppm &amp; CO₂ 3.0% (Wilcoxon p &lt; 0.05).
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-black/[.06] space-y-1 font-mono text-[11px]">
            <div className="flex justify-between">
              <span className="text-lo">Status Chamber:</span>
              <span className="font-bold text-emerald-700">{state.filter.chamberStatus}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-lo">Reduksi CO / CO₂:</span>
              <span className="font-bold text-emerald-700">
                -{state.filter.coReductionPercent}% / -{state.filter.co2ReductionPercent}%
              </span>
            </div>
          </div>
        </div>

        {/* Node 4: Modul 3 CEMS & IoT Sensor Suite */}
        <div
          onClick={() => {
            playClick();
            setSelectedNode('cems');
          }}
          className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
            selectedNode === 'cems'
              ? 'bg-indigo-50/40 border-indigo-500 shadow-md ring-2 ring-indigo-500/20'
              : 'bg-slate-50/80 border-black/[.06] hover:bg-white hover:shadow-sm'
          }`}
        >
          <div>
            <div className="flex items-center justify-between text-[11px] font-mono text-indigo-700 mb-2">
              <span className="font-bold uppercase">Modul 3 • CEMS IoT</span>
              <Activity className="w-4 h-4 text-indigo-600" />
            </div>
            <h3 className="font-display text-[14px] font-bold text-hi mb-1">
              CEMS &amp; Loop Tertutup
            </h3>
            <p className="text-[11.5px] text-mid leading-snug">
              ENS160 &amp; AHT21 → Nano → ESP32 edge controller.
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-black/[.06] space-y-1 font-mono text-[11px]">
            <div className="flex justify-between">
              <span className="text-lo">Gas CO / CO₂:</span>
              <span className="font-bold text-hi">
                {state.cems.co} ppm / {state.cems.co2}%
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-lo">Kadar O₂ Stabil:</span>
              <span className="font-bold text-indigo-700">{state.cems.o2}%</span>
            </div>
          </div>
        </div>

        {/* Node 5: Clean Exhaust Stack */}
        <div
          onClick={() => {
            playClick();
            setSelectedNode('stack');
          }}
          className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
            selectedNode === 'stack'
              ? 'bg-teal-50/40 border-teal-500 shadow-md ring-2 ring-teal-500/20'
              : 'bg-slate-50/80 border-black/[.06] hover:bg-white hover:shadow-sm'
          }`}
        >
          <div>
            <div className="flex items-center justify-between text-[11px] font-mono text-teal-700 mb-2">
              <span className="font-bold uppercase">Emisi Bersih</span>
              <CheckCircle2 className="w-4 h-4 text-teal-600" />
            </div>
            <h3 className="font-display text-[14px] font-bold text-hi mb-1">
              Cerobong Hijau
            </h3>
            <p className="text-[11.5px] text-mid leading-snug">
              Pelepasan gas buang rendah emisi sesuai Baku Mutu KLHK &amp; SDGs.
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-black/[.06] space-y-1 font-mono text-[11px]">
            <div className="flex justify-between">
              <span className="text-lo">Opasitas Cerobong:</span>
              <span className="font-bold text-teal-700">{state.cems.opacity}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-lo">Kepatuhan KLHK:</span>
              <span className="font-bold text-emerald-700">
                {state.complianceScorePercent}% PASS
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Node Detail / Technical Explanation Footer Banner */}
      <div className="relative z-10 p-4 rounded-2xl bg-slate-50/90 border border-black/[.06] flex flex-wrap items-center justify-between gap-3 text-[12.5px]">
        <div className="flex items-center gap-3">
          <span className="w-8 h-8 rounded-xl bg-core-500/10 text-core-600 flex items-center justify-center shrink-0">
            <Info className="w-4 h-4" />
          </span>
          <p className="text-mid leading-relaxed max-w-4xl">
            {selectedNode === 'teg' && (
              <span>
                <strong className="text-hi">Modul TEG Seebeck:</strong> Memanen panas fluida buang tanpa komponen bergerak. Berdasarkan uji empiris UGM 2026, relasi antara beda suhu dan daya listrik memenuhi persamaan <em>P = 0.52 ΔT + 0.08 (R² = 0.94)</em> dengan modul TEC1-12706 menghasilkan 3.2–4.4 W pada tegangan stabil 2.0–2.5 V.
              </span>
            )}
            {selectedNode === 'filter' && (
              <span>
                <strong className="text-hi">Modul Filtrasi Cerdas:</strong> Menangkap polutan gas dan partikulat halus secara simultan. Uji statistik Wilcoxon membuktikan reduksi CO sebesar 15 ppm (45 $\rightarrow$ 28 ppm) dan CO₂ sebesar 1.0% (4.2% $\rightarrow$ 3.0%) tanpa menurunkan temperatur gas (40–48°C) maupun mengganggu laju alir (2.5–2.9 L/min).
              </span>
            )}
            {selectedNode === 'cems' && (
              <span>
                <strong className="text-hi">Arsitektur CEMS &amp; IoT Controller:</strong> Sensor kualitas udara ENS160 dan sensor presisi suhu/kelembaban AHT21 dihubungkan ke Arduino Nano lalu diteruskan ke mikrokontroler ESP32 untuk komunikasi real-time dan kendali adaptif loop tertutup.
              </span>
            )}
            {selectedNode === 'furnace' && (
              <span>
                <strong className="text-hi">Tungku Peleburan Smelter:</strong> Menghasilkan gas buang flue gas bertemperatur tinggi. Sistem CYPHER mendayagunakan panas buang ini sebagai sumber energi terbarukan, alih-alih melepaskannya sebagai residu berbahaya.
              </span>
            )}
            {selectedNode === 'stack' && (
              <span>
                <strong className="text-hi">Standar Emisi &amp; Kepatuhan Regulasi:</strong> Gas buang akhir memenuhi ketentuan Permenkes No. 2/2023 dan Permen LHK No. 15/2019, mendukung Peta Jalan Dekarbonisasi Industri Nikel Nasional (target reduksi emisi 81% menuju 2045).
              </span>
            )}
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {onTriggerBackwash && (
            <button
              onClick={() => {
                playBackwash();
                onTriggerBackwash();
              }}
              disabled={state.filter.chamberStatus === 'PURGING_BACKWASH'}
              className="h-8 px-3.5 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white font-semibold text-[11.5px] flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-50 shadow-2xs"
            >
              <RefreshCw
                className={`w-3.5 h-3.5 ${
                  state.filter.chamberStatus === 'PURGING_BACKWASH' ? 'animate-spin' : ''
                }`}
              />
              <span>{state.filter.chamberStatus === 'PURGING_BACKWASH' ? 'Purging...' : 'Force Backwash'}</span>
            </button>
          )}

          {onToggleFilter && (
            <button
              onClick={() => {
                if (state.filter.active) playAlarm();
                else playClick();
                onToggleFilter();
              }}
              className={`h-8 px-3.5 rounded-xl text-[11.5px] font-semibold flex items-center gap-1.5 transition-all cursor-pointer shadow-2xs ${
                state.filter.active
                  ? 'bg-slate-200 hover:bg-slate-300 text-slate-800'
                  : 'bg-rose-600 text-white hover:bg-rose-700'
              }`}
            >
              <span>{state.filter.active ? 'Uji Bypass' : 'Aktifkan Filter'}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
