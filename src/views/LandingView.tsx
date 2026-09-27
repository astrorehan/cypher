import React from 'react';
import { ArrowRight, Zap, Wind, Globe, ArrowUpRight } from 'lucide-react';
import { SiteView } from '../engine/cypherTypes';

interface Props {
  onNavigate: (view: SiteView) => void;
}

const highlights = [
  { icon: Zap, label: 'Pemanenan panas', value: 'TEG Seebeck', detail: 'Energi dari panas buang' },
  { icon: Wind, label: 'Filtrasi gas', value: 'CO & CO₂', detail: 'Pemantauan kualitas udara' },
  { icon: Globe, label: 'Pemantauan emisi', value: 'CEMS IoT', detail: 'Data dalam satu ruang kendali' },
];

export const LandingView: React.FC<Props> = ({ onNavigate }) => (
  <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-5 md:px-8 py-12 md:py-20 max-w-6xl mx-auto w-full">
    <div className="w-full max-w-4xl text-center anim-rise">
      <div className="inline-flex items-center gap-2 rounded-full surface-card px-4 py-2 eyebrow text-core-700">
        <span className="w-2 h-2 rounded-full bg-emerald-500" />
        Riset Universitas Gadjah Mada · 2026
      </div>

      <h1 className="page-title mt-8 text-[clamp(2.7rem,6vw,5.2rem)] text-hi">
        Satu ruang kendali untuk
        <span className="block text-core-600">emisi smelter yang lebih jelas.</span>
      </h1>

      <p className="mt-6 max-w-2xl mx-auto text-[16px] md:text-[18px] leading-[1.7] text-mid">
        NEXUS menyatukan pemanenan panas, filtrasi gas, dan pemantauan emisi dalam simulasi yang mudah dijelajahi.
      </p>

      <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
        <button
          onClick={() => onNavigate('simulasi')}
          className="primary-action min-h-13 px-6 rounded-2xl inline-flex items-center gap-3 text-[14px] font-semibold cursor-pointer"
        >
          Jelajahi ruang kendali <ArrowRight className="w-4 h-4" />
        </button>
        <button
          onClick={() => onNavigate('nasional')}
          className="liquid-control min-h-13 px-6 rounded-2xl inline-flex items-center gap-3 text-[14px] font-semibold text-hi cursor-pointer"
        >
          Lihat peta emisi <ArrowUpRight className="w-4 h-4" />
        </button>
      </div>

      <div className="mt-6 flex items-center justify-center gap-5 text-[13px] font-medium text-mid">
        <button onClick={() => onNavigate('metodologi')} className="hover:text-core-600 underline-offset-4 hover:underline cursor-pointer">Metodologi</button>
        <span className="w-1 h-1 rounded-full bg-slate-400" />
        <button onClick={() => onNavigate('profil')} className="hover:text-core-600 underline-offset-4 hover:underline cursor-pointer">Profil operator</button>
      </div>
    </div>

    <div className="mt-16 md:mt-20 grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4 w-full anim-rise delay-2">
      {highlights.map(({ icon: Icon, label, value, detail }) => (
        <div key={label} className="surface-card rounded-[24px] p-5 text-left">
          <div className="w-10 h-10 rounded-2xl surface-inset flex items-center justify-center text-core-600 mb-5"><Icon className="w-5 h-5" /></div>
          <div className="eyebrow text-lo">{label}</div>
          <div className="section-title text-[20px] text-hi mt-1">{value}</div>
          <p className="text-[13px] text-mid mt-1">{detail}</p>
        </div>
      ))}
    </div>
  </main>
);
