import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  findInteractiveElement,
  soundEngine,
  SoundPreset,
  PresetInfo,
  SOUND_PRESETS,
  SoundState,
} from './soundEngine';

interface SoundContextType {
  isMuted: boolean;
  preset: SoundPreset;
  volume: number;
  presets: PresetInfo[];
  toggleMute: () => void;
  setMuted: (muted: boolean) => void;
  setPreset: (preset: SoundPreset) => void;
  setVolume: (volume: number) => void;
  playHover: (override?: SoundPreset) => void;
  playClick: (override?: SoundPreset) => void;
  playAlarm: () => void;
  playBackwash: () => void;
}

const SoundContext = createContext<SoundContextType>({
  isMuted: false,
  preset: 'cyber',
  volume: 0.85,
  presets: SOUND_PRESETS,
  toggleMute: () => {},
  setMuted: () => {},
  setPreset: () => {},
  setVolume: () => {},
  playHover: () => {},
  playClick: () => {},
  playAlarm: () => {},
  playBackwash: () => {},
});

export const useSound = () => useContext(SoundContext);

export const SoundProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<SoundState>(() => soundEngine.getState());

  useEffect(() => {
    return soundEngine.subscribe(setState);
  }, []);

  useEffect(() => {
    let lastHovered: Element | null = null;

    const handleMouseOver = (e: MouseEvent) => {
      const target = findInteractiveElement(e.target);
      if (target && target !== lastHovered) {
        lastHovered = target;
        soundEngine.playHover();
      }
    };

    const handleMouseOut = (e: MouseEvent) => {
      const target = findInteractiveElement(e.target);
      if (target === lastHovered) {
        lastHovered = null;
      }
    };

    const handleClick = (e: MouseEvent) => {
      const target = findInteractiveElement(e.target);
      if (target) {
        soundEngine.playClick();
      }
    };

    document.addEventListener('mouseover', handleMouseOver, { passive: true });
    document.addEventListener('mouseout', handleMouseOut, { passive: true });
    document.addEventListener('click', handleClick, { passive: true });

    return () => {
      document.removeEventListener('mouseover', handleMouseOver);
      document.removeEventListener('mouseout', handleMouseOut);
      document.removeEventListener('click', handleClick);
    };
  }, []);

  return (
    <SoundContext.Provider
      value={{
        isMuted: state.isMuted,
        preset: state.preset,
        volume: state.volume,
        presets: SOUND_PRESETS,
        toggleMute: () => soundEngine.toggleMute(),
        setMuted: (muted) => soundEngine.setMuted(muted),
        setPreset: (preset) => soundEngine.setPreset(preset),
        setVolume: (vol) => soundEngine.setVolume(vol),
        playHover: (override) => soundEngine.playHover(override),
        playClick: (override) => soundEngine.playClick(override),
        playAlarm: () => soundEngine.playAlarm(),
        playBackwash: () => soundEngine.playBackwash(),
      }}
    >
      {children}
    </SoundContext.Provider>
  );
};
