import React, { useEffect, useRef, useState } from 'react';
import { Menu, X, Check, Activity } from 'lucide-react';
import { SiteView } from '../../engine/cypherTypes';
import { SoundToggle } from '../ui/SoundToggle';
import { CypherMark } from '../brand/CypherMark';

interface Props {
  view: SiteView;
  onNavigate: (view: SiteView) => void;
}

const MENU: { id: SiteView; label: string; tag?: string }[] = [
  { id: 'landing', label: 'Beranda' },
  { id: 'simulasi', label: 'Ruang Kendali Smelter (SCADA Live)', tag: 'SCADA' },
  { id: 'nasional', label: 'Hub Emisi Smelter Nasional 2045', tag: 'Peta Geo' },
  { id: 'metodologi', label: 'Metodologi & Landasan Sains' },
  { id: 'profil', label: 'Profil Operator K3 & HSE' },
  { id: 'tentang', label: 'Tentang Tim Peneliti UGM' },
];

export const SiteHeader: React.FC<Props> = ({ view, onNavigate }) => {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (!wrapRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  return (
    <header className="relative z-30 shrink-0 h-[76px] px-6 md:px-9 flex items-center justify-between">
      {/* Kiri — Logo Institusi UGM */}
      <div className="flex items-center gap-2.5">
        <a
          href="https://ugm.ac.id/id/"
          target="_blank"
          rel="noopener noreferrer"
          title="Universitas Gadjah Mada"
          className="inline-flex items-center justify-center p-1 rounded-xl transition-all duration-200 hover:bg-black/[.06] hover:scale-105 active:scale-95 cursor-pointer"
        >
          <img
            src="/Lambang UGM.png"
            alt="Universitas Gadjah Mada"
            className="h-8 md:h-9 w-auto object-contain select-none"
            draggable={false}
          />
        </a>

        <div className="hidden lg:flex items-center gap-1.5 pl-2 border-l border-slate-300/80">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[11px] font-mono font-bold text-emerald-800">
            NET ZERO EMISSIONS 2060
          </span>
        </div>
      </div>

      {/* Tengah — Wordmark CYPHER */}
      <button
        onClick={() => onNavigate('landing')}
        className="absolute left-1/2 -translate-x-1/2 flex items-center gap-2.5 transition-opacity hover:opacity-80 cursor-pointer"
      >
        <CypherMark className="w-6 h-6 md:w-7 md:h-7" />
        <span className="font-display text-[21px] md:text-[24px] font-black tracking-[.28em] pl-[.28em] bg-gradient-to-r from-blue-700 via-cyan-600 to-emerald-600 bg-clip-text text-transparent">
          CYPHER
        </span>
      </button>

      {/* Kanan — Sound Toggle & Menu */}
      <div ref={wrapRef} className="flex items-center gap-2 relative">
        <SoundToggle />

        <button
          onClick={() => setOpen((v) => !v)}
          aria-label="Menu Navigasi"
          aria-expanded={open}
          className="w-11 h-11 rounded-2xl flex items-center justify-center text-hi glass-soft hover:bg-black/[.06] active:scale-95 transition-all cursor-pointer"
        >
          {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>

        {open && (
          <nav className="absolute right-0 top-[54px] w-[290px] rounded-3xl overflow-hidden glass-deep anim-pop shadow-2xl p-1.5 border border-white/60">
            <div className="px-3.5 py-2 text-[10.5px] font-semibold uppercase tracking-wider text-lo border-b border-black/[.06] mb-1">
              Navigasi Platform CYPHER
            </div>
            {MENU.map((m) => {
              const active = m.id === view;
              return (
                <button
                  key={m.id}
                  onClick={() => {
                    setOpen(false);
                    onNavigate(m.id);
                  }}
                  className={`w-full h-11 px-3.5 rounded-2xl flex items-center gap-2 text-left text-[13px] font-medium transition-all cursor-pointer ${
                    active
                      ? 'text-core-600 bg-core-500/10 font-semibold shadow-[inset_0_0_0_1px_rgba(2,132,199,0.25)]'
                      : 'text-mid hover:bg-black/[.04] hover:text-hi'
                  }`}
                >
                  <span className="truncate">{m.label}</span>
                  {m.tag && (
                    <span className="ml-auto text-[9.5px] font-mono px-1.5 py-0.5 rounded-md bg-black/[.05] text-lo">
                      {m.tag}
                    </span>
                  )}
                  {active && <Check className="w-4 h-4 ml-1 text-core-500 shrink-0" />}
                </button>
              );
            })}
          </nav>
        )}
      </div>
    </header>
  );
};
