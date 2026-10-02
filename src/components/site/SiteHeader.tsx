import React, { useEffect, useId, useRef, useState } from 'react';
import { Menu, X, Check, ArrowUpRight, Home, SlidersHorizontal, Map, BookOpen, UserRound, UsersRound, type LucideIcon } from 'lucide-react';
import { SiteView } from '../../engine/cypherTypes';
import { SoundToggle } from '../ui/SoundToggle';
import { CypherMark } from '../brand/CypherMark';

interface Props {
  view: SiteView;
  onNavigate: (view: SiteView) => void;
}

const MENU: { id: SiteView; label: string; description: string; icon: LucideIcon; tag?: string }[] = [
  { id: 'landing', label: 'Beranda', description: 'Kenali ekosistem NEXUS', icon: Home },
  { id: 'simulasi', label: 'Ruang kendali', description: 'Pantau dan simulasikan emisi', icon: SlidersHorizontal, tag: 'Simulasi' },
  { id: 'nasional', label: 'Peta emisi nasional', description: 'Jelajahi sebaran unit smelter', icon: Map },
  { id: 'metodologi', label: 'Metodologi', description: 'Dasar riset dan pendekatan', icon: BookOpen },
  { id: 'profil', label: 'Profil operator', description: 'Informasi dan profil operator', icon: UserRound },
  { id: 'tentang', label: 'Tentang tim', description: 'Tim di balik NEXUS', icon: UsersRound },
];

export const SiteHeader: React.FC<Props> = ({ view, onNavigate }) => {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuId = useId();

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (!wrapRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', onDown);
    return () => {
      document.removeEventListener('mousedown', onDown);
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
      <div className="flex items-center gap-2">
        <SoundToggle />

        <div
          ref={wrapRef}
          className="relative"
          onBlur={(event) => {
            if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setOpen(false);
          }}
          onKeyDown={(event) => {
            if (event.key === 'Escape' && open) {
              event.stopPropagation();
              setOpen(false);
              triggerRef.current?.focus();
            }
          }}
        >
        <button
          ref={triggerRef}
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-label="Menu Navigasi"
          aria-expanded={open}
          aria-controls={menuId}
          className={`navigation-trigger liquid-control w-11 h-11 rounded-2xl flex items-center justify-center cursor-pointer ${open ? 'is-open' : 'text-mid'}`}
        >
          {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>

        {open && (
          <nav id={menuId} aria-label="Navigasi utama" className="dropdown-panel absolute right-0 top-[calc(100%+12px)] w-[min(360px,calc(100vw-80px))] rounded-[26px] p-2.5">
            <div className="flex items-center gap-3 px-3 py-3.5 mb-2 border-b border-slate-200/70">
              <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-core-500/10 text-core-600"><CypherMark className="w-5 h-5" /></span>
              <div>
                <div className="text-[13px] font-semibold tracking-tight text-hi">Jelajahi NEXUS</div>
                <p className="mt-0.5 text-[11px] text-lo">Riset, pemantauan, dan simulasi emisi</p>
              </div>
            </div>
            <div className="space-y-1">
            {MENU.map((m) => {
              const active = m.id === view;
              const Icon = m.icon;
              return (
                <button
                  key={m.id}
                  type="button"
                  aria-current={active ? 'page' : undefined}
                  onClick={() => {
                    setOpen(false);
                    onNavigate(m.id);
                  }}
                  className={`navigation-item group w-full min-h-[62px] px-3 py-2.5 rounded-2xl flex items-center gap-3 text-left cursor-pointer ${active ? 'is-active' : ''}`}
                >
                  <span className="navigation-icon flex w-9 h-9 items-center justify-center rounded-xl shrink-0"><Icon className="w-[17px] h-[17px]" strokeWidth={1.8} /></span>
                  <span className="min-w-0 flex-1">
                    <span className="flex items-center gap-2 text-[13px] font-semibold tracking-tight">
                      <span className="truncate">{m.label}</span>
                      {m.tag && <span className="rounded-full bg-white/85 border border-slate-200/70 px-1.5 py-0.5 text-[9px] font-medium text-lo">{m.tag}</span>}
                    </span>
                    <span className="block mt-0.5 text-[11px] font-normal text-lo">{m.description}</span>
                  </span>
                  {active
                    ? <span className="w-5 h-5 rounded-full bg-core-500 text-white flex items-center justify-center shrink-0"><Check className="w-3 h-3" strokeWidth={2.5} /></span>
                    : <ArrowUpRight className="navigation-arrow w-4 h-4 shrink-0" />}
                </button>
              );
            })}
            </div>
            <div className="mt-2 px-3 py-2.5 border-t border-slate-200/70 flex items-center gap-2 text-[10px] text-lo">
              <span className="w-1.5 h-1.5 rounded-full bg-core-500" />
              NEXUS · Riset emisi smelter UGM
            </div>
          </nav>
        )}
        </div>
      </div>
      </div>
    </header>
  );
};
