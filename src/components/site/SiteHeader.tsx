import React, { useEffect, useRef, useState } from 'react';
import { Menu, X, Check } from 'lucide-react';
import { SiteView } from '../../engine/cypherTypes';
import { SoundToggle } from '../ui/SoundToggle';
import { CypherMark } from '../brand/CypherMark';

interface Props {
  view: SiteView;
  onNavigate: (view: SiteView) => void;
}

const MENU: { id: SiteView; label: string; tag?: string }[] = [
  { id: 'landing', label: 'Beranda' },
  { id: 'simulasi', label: 'Ruang kendali', tag: 'Simulasi' },
  { id: 'nasional', label: 'Peta emisi nasional', tag: 'Peta' },
  { id: 'metodologi', label: 'Metodologi' },
  { id: 'profil', label: 'Profil operator' },
  { id: 'tentang', label: 'Tentang tim' },
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
    <header className="relative z-30 shrink-0 px-4 md:px-8 pt-4">
      <div className="liquid-bar max-w-[1480px] mx-auto h-[68px] rounded-[24px] px-4 md:px-6 flex items-center justify-between gap-3">
      <div className="flex items-center gap-2.5 min-w-0">
        <a
          href="https://ugm.ac.id/id/"
          target="_blank"
          rel="noopener noreferrer"
          title="Universitas Gadjah Mada"
          className="inline-flex items-center justify-center p-1 rounded-xl transition-colors hover:bg-black/[.04] cursor-pointer"
        >
          <img
            src="/Lambang UGM.png"
            alt="Universitas Gadjah Mada"
            className="h-8 md:h-9 w-auto object-contain select-none"
            draggable={false}
          />
        </a>

        <div className="hidden lg:flex items-center pl-3 border-l border-slate-200">
          <span className="text-[12px] font-medium text-mid">Riset emisi smelter UGM</span>
        </div>
      </div>

      {/* Tengah — Wordmark NEXUS */}
      <button
        onClick={() => onNavigate('landing')}
        className="flex items-center gap-2.5 transition-opacity hover:opacity-75 cursor-pointer shrink-0"
        aria-label="NEXUS, kembali ke beranda"
      >
        <CypherMark className="w-6 h-6 md:w-7 md:h-7" />
        <span className="font-display text-[19px] md:text-[21px] font-bold tracking-[.12em] text-hi">
          NEXUS
        </span>
      </button>

      {/* Kanan — Sound Toggle & Menu */}
      <div ref={wrapRef} className="flex items-center gap-2 relative">
        <SoundToggle />

        <button
          onClick={() => setOpen((v) => !v)}
          aria-label="Menu Navigasi"
          aria-expanded={open}
          className="w-11 h-11 rounded-2xl flex items-center justify-center text-hi bg-white/70 hover:bg-white active:scale-95 transition-all cursor-pointer"
        >
          {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>

        {open && (
          <nav aria-label="Navigasi utama" className="absolute right-0 top-[55px] w-[min(320px,calc(100vw-32px))] rounded-3xl overflow-hidden surface-card anim-pop shadow-xl p-2">
            <div className="px-3.5 py-2 eyebrow text-lo border-b border-black/[.06] mb-1">
              Jelajahi NEXUS
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
                  className={`w-full min-h-11 px-3.5 rounded-2xl flex items-center gap-2 text-left text-[14px] font-medium transition-all cursor-pointer ${
                    active
                      ? 'text-core-600 bg-core-500/10 font-semibold shadow-[inset_0_0_0_1px_rgba(2,132,199,0.25)]'
                      : 'text-mid hover:bg-black/[.04] hover:text-hi'
                  }`}
                >
                  <span className="truncate">{m.label}</span>
                  {m.tag && (
                    <span className="ml-auto text-[11px] px-2 py-0.5 rounded-full bg-slate-100 text-mid">
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
      </div>
    </header>
  );
};
