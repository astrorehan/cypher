import React, { useState, useRef, useEffect, useId } from 'react';
import {
  Volume2,
  VolumeX,
  Volume1,
  Zap,
  Keyboard,
  Sparkles,
  Radio,
  Check,
  ChevronDown,
  Play,
  SlidersHorizontal,
} from 'lucide-react';
import { useSound } from '../../utils/SoundProvider';
import { SoundPreset } from '../../utils/soundEngine';

const PRESET_ICONS: Record<SoundPreset, React.ComponentType<{ className?: string }>> = {
  cyber: Zap,
  tactile: Keyboard,
  glass: Sparkles,
  scada: Radio,
};

export const SoundToggle: React.FC<{ className?: string }> = ({ className = '' }) => {
  const {
    isMuted,
    toggleMute,
    setMuted,
    preset,
    setPreset,
    presets,
    volume,
    setVolume,
    playClick,
  } = useSound();

  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const settingsId = useId();
  const volumeId = useId();

  // Close on outside click
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleOutsideClick);
    }
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [isOpen]);

  const activeIcon = PRESET_ICONS[preset] || Zap;
  const ActiveIconComponent = activeIcon;

  return (
    <div
      ref={menuRef}
      className={`relative flex items-center ${className}`}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setIsOpen(false);
      }}
      onKeyDown={(event) => {
        if (event.key === 'Escape' && isOpen) {
          event.stopPropagation();
          setIsOpen(false);
          triggerRef.current?.focus();
        }
      }}
    >
      {/* Main Sound Button Group */}
      <div className="flex items-center rounded-xl p-0.5 bg-white/60">
        {/* Toggle Mute Button */}
        <button
          type="button"
          onClick={() => toggleMute()}
          title={isMuted ? 'Aktifkan Efek Suara' : 'Bisukan Efek Suara'}
          aria-label={isMuted ? 'Aktifkan suara' : 'Bisukan suara'}
          className={`h-9 px-2.5 rounded-lg flex items-center gap-1.5 transition-all cursor-pointer select-none text-[12px] font-medium ${
            isMuted
              ? 'text-mid hover:text-hi hover:bg-white'
              : 'text-cyan-700 font-semibold bg-cyan-50 hover:bg-cyan-100'
          }`}
        >
          {isMuted ? (
            <VolumeX className="w-3.5 h-3.5 text-slate-400" />
          ) : volume < 0.4 ? (
            <Volume1 className="w-3.5 h-3.5 text-cyan-600" />
          ) : (
            <Volume2 className="w-3.5 h-3.5 text-cyan-600" />
          )}
          <span className="hidden sm:inline text-[11px] tracking-tight">
            {isMuted ? 'Suara mati' : 'Suara aktif'}
          </span>
        </button>

        {/* Preset Switcher Trigger */}
        <button
          ref={triggerRef}
          type="button"
          onClick={() => setIsOpen((prev) => !prev)}
          title="Pilih Tema & Pengaturan Suara UI"
          aria-label="Pengaturan suara"
          aria-expanded={isOpen}
          aria-controls={settingsId}
          className={`h-9 w-8 rounded-lg flex items-center justify-center transition-all cursor-pointer text-mid hover:text-hi hover:bg-white ${
            isOpen ? 'bg-white text-hi' : ''
          }`}
        >
          <ChevronDown
            className={`w-3.5 h-3.5 transition-transform duration-200 ${
              isOpen ? 'rotate-180 text-cyan-600' : 'text-slate-400'
            }`}
          />
        </button>
      </div>

      {/* Floating Sound Settings Popover */}
      {isOpen && (
        <div id={settingsId} role="region" aria-label="Pengaturan suara" className="dropdown-panel absolute -right-[52px] top-full mt-4 w-[min(350px,calc(100vw-80px))] rounded-[26px] p-4 z-50 text-slate-800">
          {/* Header */}
          <div className="flex items-center justify-between pb-2.5 mb-2.5 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-2xl bg-core-500/10 text-core-600 flex items-center justify-center">
                <ActiveIconComponent className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-[13px] font-semibold text-hi leading-tight">Pengaturan suara</h4>
                <span className="text-[11px] text-slate-500">Atur suara antarmuka</span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => {
                setMuted(!isMuted);
              }}
              className={`text-[10.5px] px-2 py-0.5 rounded-md font-semibold transition-all cursor-pointer ${
                isMuted
                  ? 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  : 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'
              }`}
            >
              {isMuted ? 'Mati' : 'Aktif'}
            </button>
          </div>

          {/* Volume Slider */}
          <div className="mb-3 px-2.5 py-2 rounded-xl bg-slate-50 border border-slate-100">
            <div className="flex items-center justify-between text-[11px] text-slate-600 mb-1.5">
              <label htmlFor={volumeId} className="flex items-center gap-1.5 font-medium">
                <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400" />
                Volume suara
              </label>
              <span className="font-mono text-[11px] font-bold text-slate-800">
                {isMuted ? '0%' : `${Math.round(volume * 100)}%`}
              </span>
            </div>
            <input
              id={volumeId}
              type="range"
              min="0.1"
              max="1.0"
              step="0.05"
              value={volume}
              disabled={isMuted}
              onChange={(e) => {
                const newVol = parseFloat(e.target.value);
                setVolume(newVol);
                if (isMuted) setMuted(false);
              }}
              className="w-full accent-cyan-600 cursor-pointer h-1.5 bg-slate-200 rounded-lg"
            />
          </div>

          {/* Preset List */}
          <div className="space-y-1.5">
            <div className="text-[10px] font-bold tracking-wider uppercase text-slate-400 px-1">
              Pilihan Suara UI
            </div>
            {presets.map((p) => {
              const IconComp = PRESET_ICONS[p.id] || Zap;
              const isActive = preset === p.id;

              return (
                <div
                  key={p.id}
                  className={`w-full rounded-2xl flex items-center transition-all text-left border ${
                    isActive
                      ? 'bg-cyan-50/90 border-cyan-400/70 shadow-xs ring-1 ring-cyan-500/20'
                      : 'bg-white hover:bg-slate-50/90 border-slate-100 hover:border-slate-200'
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => setPreset(p.id)}
                    aria-pressed={isActive}
                    className="flex-1 min-w-0 p-3 flex items-center gap-2.5 text-left cursor-pointer rounded-xl"
                  >
                  <span
                    className={`w-7 h-7 rounded-lg shrink-0 flex items-center justify-center mt-0.5 ${
                      isActive
                        ? 'bg-cyan-600 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-500'
                    }`}
                  >
                    <IconComp className="w-3.5 h-3.5" />
                  </span>

                  <span className="flex-1 min-w-0">
                    <span className="flex items-center gap-1.5 justify-between">
                      <span
                        className={`text-[12px] font-bold truncate ${
                          isActive ? 'text-cyan-900' : 'text-slate-800'
                        }`}
                      >
                        {p.name}
                      </span>
                      <span
                        className={`text-[9.5px] px-1.5 py-0.2 rounded-full font-semibold ${
                          isActive
                            ? 'bg-cyan-200/80 text-cyan-900'
                            : 'bg-slate-100 text-slate-500'
                        }`}
                      >
                        {p.badge}
                      </span>
                    </span>
                    <span className="block text-[11px] text-slate-500 line-clamp-1 leading-snug">
                      {p.tagline}
                    </span>
                  </span>
                  </button>

                  {/* Play preview button */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      playClick(p.id);
                    }}
                    title={`Uji Coba Suara ${p.name}`}
                    aria-label={`Uji coba suara ${p.name}`}
                    className="p-2 mr-2 rounded-xl hover:bg-slate-200/80 text-slate-400 hover:text-slate-800 shrink-0 transition-all cursor-pointer"
                  >
                    {isActive ? (
                      <Check className="w-3.5 h-3.5 text-cyan-600 font-bold" />
                    ) : (
                      <Play className="w-3 h-3 text-slate-400 fill-slate-400" />
                    )}
                  </button>
                </div>
              );
            })}
          </div>

          {/* Quick tip footer */}
          <div className="mt-3 pt-3 border-t border-slate-200/70 text-[10px] text-lo flex items-center gap-2">
            <Play className="w-3 h-3 shrink-0" />
            <span>Coba suara sebelum memilih tema favorit Anda.</span>
          </div>
        </div>
      )}
    </div>
  );
};
