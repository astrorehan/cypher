import React, { useState, useRef, useEffect } from 'react';
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
    <div ref={menuRef} className={`relative flex items-center ${className}`}>
      {/* Main Sound Button Group */}
      <div className="flex items-center rounded-xl p-0.5 bg-slate-900/60 sm:bg-white/80 border border-slate-700/50 sm:border-slate-200/80 shadow-xs transition-all backdrop-blur-md">
        {/* Toggle Mute Button */}
        <button
          type="button"
          onClick={() => toggleMute()}
          title={isMuted ? 'Aktifkan Efek Suara' : 'Bisukan Efek Suara'}
          aria-label={isMuted ? 'Unmute Sound' : 'Mute Sound'}
          className={`h-8 px-2.5 rounded-lg flex items-center gap-1.5 transition-all cursor-pointer select-none text-[12px] font-medium ${
            isMuted
              ? 'text-slate-400 hover:text-slate-200 hover:bg-white/10'
              : 'text-cyan-400 sm:text-cyan-700 font-semibold bg-cyan-500/10 sm:bg-cyan-50 hover:bg-cyan-500/20 sm:hover:bg-cyan-100 shadow-xs'
          }`}
        >
          {isMuted ? (
            <VolumeX className="w-3.5 h-3.5 text-slate-400" />
          ) : volume < 0.4 ? (
            <Volume1 className="w-3.5 h-3.5 text-cyan-400 sm:text-cyan-600 animate-pulse" />
          ) : (
            <Volume2 className="w-3.5 h-3.5 text-cyan-400 sm:text-cyan-600" />
          )}
          <span className="hidden sm:inline text-[11px] tracking-tight">
            {isMuted ? 'Muted' : 'Audio On'}
          </span>
        </button>

        {/* Preset Switcher Trigger */}
        <button
          type="button"
          onClick={() => setIsOpen((prev) => !prev)}
          title="Pilih Tema & Pengaturan Suara UI"
          aria-label="Sound Settings Menu"
          aria-expanded={isOpen}
          className={`h-8 w-7 rounded-lg flex items-center justify-center transition-all cursor-pointer text-slate-300 sm:text-slate-600 hover:text-white sm:hover:text-slate-900 hover:bg-white/10 sm:hover:bg-slate-100 ${
            isOpen ? 'bg-white/15 sm:bg-slate-200 text-white sm:text-slate-900' : ''
          }`}
        >
          <ChevronDown
            className={`w-3.5 h-3.5 transition-transform duration-200 ${
              isOpen ? 'rotate-180 text-cyan-400 sm:text-cyan-600' : 'text-slate-400'
            }`}
          />
        </button>
      </div>

      {/* Floating Sound Settings Popover */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-[300px] sm:w-[330px] rounded-2xl bg-white/95 p-3.5 border border-slate-200/90 shadow-2xl z-50 anim-pop backdrop-blur-xl text-slate-800">
          {/* Header */}
          <div className="flex items-center justify-between pb-2.5 mb-2.5 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-cyan-100 text-cyan-700 flex items-center justify-center shadow-xs">
                <ActiveIconComponent className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-[13px] font-bold text-slate-900 leading-tight">Profil Audio Haptik</h4>
                <span className="text-[10.5px] text-slate-500">Kustomisasi efek hover & click UI</span>
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
              {isMuted ? 'Muted' : 'Aktif'}
            </button>
          </div>

          {/* Volume Slider */}
          <div className="mb-3 px-2.5 py-2 rounded-xl bg-slate-50 border border-slate-100">
            <div className="flex items-center justify-between text-[11px] text-slate-600 mb-1.5">
              <span className="flex items-center gap-1.5 font-medium">
                <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400" />
                Master Volume
              </span>
              <span className="font-mono text-[11px] font-bold text-slate-800">
                {isMuted ? '0%' : `${Math.round(volume * 100)}%`}
              </span>
            </div>
            <input
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
                  onClick={() => {
                    setPreset(p.id);
                  }}
                  className={`w-full p-2.5 rounded-xl flex items-start gap-2.5 transition-all text-left cursor-pointer border ${
                    isActive
                      ? 'bg-cyan-50/90 border-cyan-400/70 shadow-xs ring-1 ring-cyan-500/20'
                      : 'bg-white hover:bg-slate-50/90 border-slate-100 hover:border-slate-200'
                  }`}
                >
                  <div
                    className={`w-7 h-7 rounded-lg shrink-0 flex items-center justify-center mt-0.5 ${
                      isActive
                        ? 'bg-cyan-600 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-500'
                    }`}
                  >
                    <IconComp className="w-3.5 h-3.5" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 justify-between">
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
                    </div>
                    <p className="text-[11px] text-slate-500 line-clamp-1 leading-snug">
                      {p.tagline}
                    </p>
                  </div>

                  {/* Play preview button */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      playClick(p.id);
                    }}
                    title={`Uji Coba Suara ${p.name}`}
                    className="p-1.5 rounded-lg hover:bg-slate-200/80 text-slate-400 hover:text-slate-800 shrink-0 transition-all cursor-pointer mt-0.5"
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
          <div className="mt-3 pt-2 border-t border-slate-100 text-[10px] text-slate-500 flex items-center justify-between">
            <span>Hover / klik tombol untuk mendengar efek</span>
            <span className="font-mono text-[9px] text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded font-semibold">
              Web Audio API
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
