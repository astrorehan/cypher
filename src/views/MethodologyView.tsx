import React, { useState } from 'react';
import {
  ArrowLeft,
  Zap,
  Wind,
  ShieldCheck,
  Cpu,
  Calculator,
  CheckCircle2,
  TrendingUp,
  Activity,
  Layers,
  FileCheck,
} from 'lucide-react';
import { SiteView } from '../engine/cypherTypes';
import { useSound } from '../utils/SoundProvider';
import { calculatePredictedPower } from '../engine/cypherData';

interface Props {
  onNavigate: (view: SiteView) => void;
}

const MODULES = [
  {
    n: '01',
    icon: Zap,
    name: 'Pemanenan Panas Termoelektrik (TEG)',
    tint: 'var(--color-core-500)',
    body: 'Memanfaatkan modul TEC1-12706 solid-state untuk mengonversi gradien suhu limbah flue gas langsung menjadi daya listrik mandiri tanpa komponen bergerak.',
    mark: 'Model Regresi: P = 0,52 ΔT + 0,08 (R² = 0,94)',
  },
  {
    n: '02',
    icon: Wind,
    name: 'Modul Filtrasi Cerdas Terintegrasi',
    tint: 'var(--color-sinero-emerald)',
    body: 'Penyaringan polutan gas buang yang menurunkan konsentrasi CO hingga 28 ppm dan CO₂ hingga 3,0% tanpa menghambat laju alir (2,5–2,9 L/min) dan suhu gas.',
    mark: 'Uji Wilcoxon: p < 0,05 (Signifikan)',
  },
  {
    n: '03',
    icon: Cpu,
    name: 'Arsitektur CEMS IoT Loop Tertutup',
    tint: 'var(--color-mode-socratic)',
    body: 'Integrasi sensor ENS160 & AHT21 dengan mikrokontroler Arduino Nano dan ESP32, menjadikan CEMS sebagai pusat kendali adaptif real-time.',
    mark: 'Pipeline: ENS160/AHT21 → Nano → ESP32',
  },
];

const ROADMAP_PHASES = [
  {
    phase: 'Tahap 1 (2026–2030)',
    title: 'Validasi Prototipe & Pilot Industri',
    desc: 'Uji coba operasional langsung pada 1 unit smelter nikel skala industri untuk memvalidasi kestabilan termoelektrik dan ketahanan filtrasi pada kondisi lapangan nyata.',
  },
  {
    phase: 'Tahap 2 (2030–2040)',
    title: 'Skalasi Modul Paralel & AI Prediktif',
    desc: 'Pengembangan susunan matriks TEG paralel berdaya hingga 10 kali lipat serta penerapan filter cerdas berbasis Machine Learning untuk adaptasi prediktif.',
  },
  {
    phase: 'Tahap 3 (2040–2045)',
    title: 'Integrasi Jaringan Nasional & Kepatuhan Wajib',
    desc: 'Penggabungan jaringan CEMS IoT di seluruh smelter Indonesia, pembentukan Standar Nikel Hijau Indonesia, dan kontribusi menuju target reduksi emisi 81%.',
  },
];

export const MethodologyView: React.FC<Props> = ({ onNavigate }) => {
  const [deltaT, setDeltaT] = useState<number>(7.5);
  const [scaleMode, setScaleMode] = useState<'lab' | 'industrial'>('lab');
  const { playClick } = useSound();

  const isLab = scaleMode === 'lab';
  const calculatedPower = calculatePredictedPower(deltaT, isLab);

  return (
    <div className="min-h-full flex flex-col p-6 md:p-10 max-w-6xl mx-auto w-full anim-rise">
      {/* Navigation Header */}
      <div className="flex items-center justify-between gap-4 mb-8">
        <button
          onClick={() => onNavigate('landing')}
          className="h-10 px-4 rounded-full glass-soft hover:bg-white text-hi shadow-sm flex items-center gap-2 text-[13px] font-semibold transition-all cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Beranda</span>
        </button>

        <button
          onClick={() => onNavigate('simulasi')}
          className="h-10 px-5 rounded-full bg-core-500 text-white text-[13px] font-bold shadow-md hover:brightness-110 active:scale-95 transition-all cursor-pointer"
        >
          Buka Ruang Kontrol Smelter
        </button>
      </div>

      {/* Page Title */}
      <div className="text-center max-w-3xl mx-auto mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-700 font-mono text-[11px] font-bold mb-3">
          LANDASAN SAINS &amp; METODOLOGI REKAYASA
        </div>
        <h1 className="font-display text-[32px] md:text-[42px] font-extrabold text-hi leading-tight">
          Arsitektur Integrasi Sistem CYPHER
        </h1>
        <p className="mt-3 text-[15px] text-mid leading-relaxed">
          Mengintegrasikan pemulihan limbah panas (TEG), penyaringan polutan cerdas, dan Continuous Emission Monitoring System (CEMS) berbasis IoT ke dalam satu ekosistem kendali loop tertutup.
        </p>
      </div>

      {/* 3 Core Modules Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {MODULES.map((mod, i) => {
          const Icon = mod.icon;
          return (
            <div
              key={i}
              className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm flex flex-col justify-between hover:shadow-md transition-all"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="font-mono text-[11px] font-bold text-lo">MODUL {mod.n}</span>
                  <span
                    className="w-10 h-10 rounded-2xl flex items-center justify-center text-white shadow-sm"
                    style={{ background: mod.tint }}
                  >
                    <Icon className="w-5 h-5" />
                  </span>
                </div>
                <h3 className="font-display text-[17px] font-bold text-hi mb-2">
                  {mod.name}
                </h3>
                <p className="text-[13px] text-mid leading-relaxed mb-6">
                  {mod.body}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 text-[11.5px] font-mono font-semibold text-core-600">
                {mod.mark}
              </div>
            </div>
          );
        })}
      </div>

      {/* Interactive Mathematical Model Calculator */}
      <div className="p-8 rounded-3xl bg-white border border-slate-200 shadow-md mb-12">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2 text-cyan-600 font-mono text-[11px] font-bold uppercase mb-1">
              <Calculator className="w-4 h-4" />
              <span>Model Matematis &amp; Simulasi Prediktif</span>
            </div>
            <h2 className="font-display text-[22px] font-extrabold text-hi">
              Kalkulator Konversi Daya Listrik Termoelektrik
            </h2>
            <p className="text-[13px] text-mid">
              Hitung estimasi daya berdasarkan model regresi empiris hasil uji laboratorium UGM 2026: <em>P = 0,52 ΔT + 0,08</em>.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center bg-slate-100 p-1 rounded-xl text-[12px] font-semibold">
              <button
                onClick={() => {
                  setScaleMode('lab');
                  setDeltaT(7.5);
                }}
                className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                  isLab ? 'bg-white text-slate-900 shadow-sm font-bold' : 'text-slate-600'
                }`}
              >
                Prototipe Lab (TEC1-12706)
              </button>
              <button
                onClick={() => {
                  setScaleMode('industrial');
                  setDeltaT(370);
                }}
                className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                  !isLab ? 'bg-white text-slate-900 shadow-sm font-bold' : 'text-slate-600'
                }`}
              >
                Skala Industri (45 MVA RKEF)
              </button>
            </div>

            <div className="p-4 rounded-2xl bg-cyan-50 border border-cyan-200 text-center min-w-[180px]">
              <div className="text-[10.5px] font-bold uppercase text-slate-500">Estimasi Daya Pemanenan</div>
              <div className="font-display text-[26px] font-extrabold text-cyan-700 font-mono">
                {calculatedPower.toFixed(2)} <span className="text-[15px]">{isLab ? 'Watt' : 'kW'}</span>
              </div>
              <div className="text-[10.5px] text-emerald-600 font-semibold font-mono">
                {isLab ? 'R² = 0,94 (Valid UGM)' : 'Matriks Paralel TEG + ORC'}
              </div>
            </div>
          </div>
        </div>

        {/* Delta T Slider */}
        <div className="pt-4 border-t border-slate-100">
          <div className="flex justify-between text-[13px] font-semibold mb-2">
            <span className="text-mid">
              Perbedaan Temperatur Flue Gas &amp; Pendingin (ΔT = T-hot - T-cold):
            </span>
            <span className="font-mono text-cyan-600 font-bold">{deltaT.toFixed(1)} °C</span>
          </div>
          <input
            type="range"
            min={isLab ? 1 : 50}
            max={isLab ? 20 : 500}
            step={isLab ? 0.1 : 5}
            value={deltaT}
            onChange={(e) => setDeltaT(Number(e.target.value))}
            className="w-full accent-cyan-600 cursor-pointer"
          />
          <div className="flex justify-between text-[11px] font-mono text-slate-500 mt-1">
            <span>{isLab ? 'ΔT Minimum (1°C)' : 'ΔT Rendah (50°C)'}</span>
            <span>{isLab ? 'Rentang Uji Esai (6,5–8,2°C)' : 'Titik Operasi Standar (370°C)'}</span>
            <span>{isLab ? 'ΔT Maksimal (20°C)' : 'Thermal Peak (500°C)'}</span>
          </div>
        </div>
      </div>

      {/* 3-Phase Roadmap to 2045 & NZE 2060 */}
      <div className="p-8 rounded-3xl bg-slate-900 text-white border border-slate-800 shadow-xl mb-10">
        <div className="max-w-3xl mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 font-mono text-[11px] font-bold mb-2">
            PETA JALAN PENGEMBANGAN TEKNOLOGI
          </div>
          <h2 className="font-display text-[24px] font-extrabold text-white">
            Peta Jalan CYPHER Menuju Net Zero Emissions 2060
          </h2>
          <p className="text-[13.5px] text-slate-300 mt-1 leading-relaxed">
            Menyelaraskan inovasi dengan Peta Jalan Dekarbonisasi Industri Nikel Nasional (Bappenas &amp; WRI) yang menargetkan reduksi emisi 81% pada tahun 2045.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {ROADMAP_PHASES.map((p, idx) => (
            <div
              key={idx}
              className="p-5 rounded-2xl bg-slate-800/80 border border-slate-700/80 flex flex-col justify-between"
            >
              <div>
                <span className="font-mono text-[11px] font-bold text-cyan-400 block mb-1">
                  {p.phase}
                </span>
                <h3 className="font-display text-[16px] font-bold text-white mb-2">
                  {p.title}
                </h3>
                <p className="text-[12.5px] text-slate-300 leading-relaxed">
                  {p.desc}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-700/60 flex items-center gap-1.5 text-[11px] font-mono text-emerald-400 font-semibold">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Tahap Terencana</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
