import React from 'react';
import { ArrowRight, Zap, Wind, Globe, ShieldCheck, Cpu, Layers } from 'lucide-react';
import { SiteView } from '../engine/cypherTypes';
import { CypherMark } from '../components/brand/CypherMark';

interface Props {
  onNavigate: (view: SiteView) => void;
}

const PillButton: React.FC<{
  children: React.ReactNode;
  onClick?: () => void;
}> = ({ children, onClick }) => (
  <button
    onClick={onClick}
    className="h-12 px-6 rounded-full text-[14px] font-semibold text-hi bg-white/85 backdrop-blur-sm shadow-[inset_0_0_0_1px_rgba(16,24,60,.12),0_2px_10px_-4px_rgba(16,24,60,.12)] hover:bg-white hover:shadow-[inset_0_0_0_1px_rgba(16,24,60,.2),0_6px_18px_-6px_rgba(16,24,60,.2)] active:scale-[.98] transition-all cursor-pointer"
  >
    {children}
  </button>
);

const ACRONYM_ITEMS = [
  { letter: 'C', word: 'Carbon-neutral', desc: 'Mendukung target Net Zero Emissions Indonesia 2060' },
  { letter: 'Y', word: 'Yield', desc: 'Hasil produksi hilirisasi mineral nikel yang bernilai tambah tinggi' },
  { letter: 'P', word: 'Predictive', desc: 'Kendali prediktif berbasis machine learning & regresi termal' },
  { letter: 'H', word: 'Hybrid', desc: 'Menggabungkan sensor IoT fisik (ENS160/AHT21) + algoritma digital' },
  { letter: 'E', word: 'Emission', desc: 'Target utama pengendalian emisi SO₂, CO, CO₂ & partikulat' },
  { letter: 'R', word: 'Regulator', desc: 'Pengendali otomatis loop tertutup pemulihan panas & filtrasi' },
];

export const LandingView: React.FC<Props> = ({ onNavigate }) => (
  <main className="relative z-10 flex-1 min-h-0 flex flex-col items-center justify-center px-6 pb-12 text-center max-w-5xl mx-auto w-full">
    {/* Floating Badge */}
    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/90 backdrop-blur-md border border-slate-200 shadow-sm mb-6 anim-rise">
      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
      <span className="text-[12px] font-mono font-bold text-cyan-800">
        KAMAKARYA ESSAY COMPETITION 2026 • UNIVERSITAS GADJAH MADA
      </span>
    </div>

    {/* Main Headline */}
    <h1 className="font-display font-extrabold -tracking-[.035em] leading-[1.08] text-[clamp(28px,5.5vw,60px)] text-hi anim-rise delay-1">
      Integrasi Sistem Kendali Emisi Cerdas
      <br />
      <span className="bg-gradient-to-r from-blue-600 via-cyan-600 to-teal-600 bg-clip-text text-transparent">
        CYPHER
      </span>{' '}
      untuk Smelter Nikel Hijau
    </h1>

    {/* Subtitle */}
    <p className="mt-6 max-w-[760px] text-[15px] md:text-[17px] leading-[1.7] text-mid anim-rise delay-2">
      Platform kendali loop tertutup berbasis IoT yang mengintegrasikan pemulihan limbah panas (TEG Seebeck), filtrasi polutan cerdas, dan Continuous Emission Monitoring System (CEMS) untuk percepatan transisi Net Zero Emissions 2060.
    </p>

    {/* Metric Highlights Pills */}
    <div className="mt-8 flex flex-wrap items-center justify-center gap-3 anim-rise delay-2">
      <div className="px-4 py-2 rounded-2xl glass-soft flex items-center gap-2 text-[12.5px] font-semibold text-hi">
        <Zap className="w-4 h-4 text-cyan-600" />
        <span>P = 0,52 ΔT + 0,08 (R² = 0,94)</span>
      </div>
      <div className="px-4 py-2 rounded-2xl glass-soft flex items-center gap-2 text-[12.5px] font-semibold text-hi">
        <Wind className="w-4 h-4 text-emerald-600" />
        <span>Reduksi CO 15 ppm &amp; CO₂ 1,0% (p &lt; 0,05)</span>
      </div>
      <div className="px-4 py-2 rounded-2xl glass-soft flex items-center gap-2 text-[12.5px] font-semibold text-hi">
        <Globe className="w-4 h-4 text-indigo-600" />
        <span>Target Dekarbonisasi Nikel 81% Menuju 2045</span>
      </div>
    </div>

    {/* Acronym Breakdown Strip */}
    <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 w-full max-w-4xl text-left anim-rise delay-3">
      {ACRONYM_ITEMS.map((item) => (
        <div
          key={item.letter}
          className="p-3 rounded-2xl bg-white/70 backdrop-blur-md border border-slate-200 shadow-2xs hover:bg-white transition-all"
        >
          <div className="flex items-center gap-1.5">
            <span className="w-6 h-6 rounded-lg bg-cyan-500/15 text-cyan-800 font-display font-extrabold text-[13px] flex items-center justify-center">
              {item.letter}
            </span>
            <span className="font-bold text-[12px] text-slate-900 truncate">
              {item.word}
            </span>
          </div>
          <p className="text-[10.5px] text-slate-500 mt-1 leading-snug">
            {item.desc}
          </p>
        </div>
      ))}
    </div>

    {/* Action Buttons */}
    <div className="mt-10 flex flex-wrap items-center justify-center gap-3.5 anim-rise delay-4">
      <button
        onClick={() => onNavigate('simulasi')}
        className="h-14 px-8 rounded-full text-[15px] font-bold text-white bg-gradient-to-r from-core-500 via-cyan-600 to-emerald-600 shadow-[0_14px_40px_-12px_rgba(2,132,199,.5)] inline-flex items-center gap-3 hover:-translate-y-1 hover:shadow-[0_20px_50px_-20px_rgba(2,132,199,.6)] active:scale-[.99] transition-all cursor-pointer"
      >
        Buka Ruang Kontrol Smelter (SCADA)
        <ArrowRight className="w-4 h-4" />
      </button>

      <PillButton onClick={() => onNavigate('nasional')}>
        Hub Emisi Nasional 2045
      </PillButton>

      <PillButton onClick={() => onNavigate('metodologi')}>
        Metodologi &amp; Sains TEG
      </PillButton>

      <PillButton onClick={() => onNavigate('profil')}>
        Profil Operator HSE
      </PillButton>

      <PillButton onClick={() => onNavigate('tentang')}>
        Tentang Penulis UGM
      </PillButton>
    </div>
  </main>
);
