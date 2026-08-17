/**
 * SoundEngine — Modern Web Audio API Synthesizer for SINERO
 * High-precision tactile feedback, telemetry confirmations, and industrial alarms.
 */

export type SoundPreset = 'cyber' | 'tactile' | 'glass' | 'scada';

export interface PresetInfo {
  id: SoundPreset;
  name: string;
  desc: string;
  badge: string;
  tagline: string;
}

export const SOUND_PRESETS: PresetInfo[] = [
  {
    id: 'cyber',
    name: 'Cybernetic Haptic',
    badge: 'Futuristik',
    tagline: 'Renyah, modern, & presisi tinggi',
    desc: 'Suara haptik UI futuristik dengan transient frekuensi tinggi dan punch taktil cepat.',
  },
  {
    id: 'tactile',
    name: 'Tactile Switch',
    badge: 'Mekanikal',
    tagline: 'Snap leaf & switch keyboard mekanikal',
    desc: 'Sensasi ketikan switch mekanikal dengan respon klik tajam dan resonansi housing.',
  },
  {
    id: 'glass',
    name: 'Minimal Glass',
    badge: 'Organik',
    tagline: 'Pop kristal lembut ala Apple/VisionOS',
    desc: 'Efek pop tetesan kaca minimalis yang bersih, lembut di telinga, dan elegan.',
  },
  {
    id: 'scada',
    name: 'SCADA Telemetry',
    badge: 'Industri',
    tagline: 'Dual-tone telemetry ruang kendali',
    desc: 'Sinyal bip telemetri dan radar konfirmasi instrumen kontrol SCADA presisi.',
  },
];

export interface SoundState {
  isMuted: boolean;
  preset: SoundPreset;
  volume: number; // 0.0 to 1.0
}

type SoundListener = (state: SoundState) => void;

class SoundEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private isMuted: boolean = false;
  private preset: SoundPreset = 'cyber';
  private volume: number = 0.85;
  private noiseBuffer: AudioBuffer | null = null;
  private listeners: Set<SoundListener> = new Set();

  constructor() {
    if (typeof window !== 'undefined') {
      const savedMuted = localStorage.getItem('sinero_sound_muted');
      if (savedMuted !== null) {
        this.isMuted = savedMuted === 'true';
      }

      const savedPreset = localStorage.getItem('sinero_sound_preset') as SoundPreset | null;
      if (savedPreset && SOUND_PRESETS.some((p) => p.id === savedPreset)) {
        this.preset = savedPreset;
      }

      const savedVol = localStorage.getItem('sinero_sound_volume');
      if (savedVol !== null) {
        const parsed = parseFloat(savedVol);
        if (!isNaN(parsed) && parsed >= 0 && parsed <= 1) {
          this.volume = parsed;
        }
      }
    }
  }

  public subscribe(listener: SoundListener): () => void {
    this.listeners.add(listener);
    listener(this.getState());
    return () => {
      this.listeners.delete(listener);
    };
  }

  public getState(): SoundState {
    return {
      isMuted: this.isMuted,
      preset: this.preset,
      volume: this.volume,
    };
  }

  private notifyListeners() {
    const state = this.getState();
    this.listeners.forEach((l) => l(state));
  }

  public initContext() {
    if (typeof window === 'undefined') return;

    if (!this.ctx) {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
        this.masterGain = this.ctx.createGain();
        this.updateMasterVolume();
        this.masterGain.connect(this.ctx.destination);
        this.generateNoiseBuffer();
      }
    }

    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }

    this.updateMasterVolume();
  }

  private updateMasterVolume() {
    if (!this.ctx || !this.masterGain) return;
    const targetGain = this.isMuted ? 0 : this.volume;
    this.masterGain.gain.setValueAtTime(
      Math.max(0.0001, targetGain),
      this.ctx.currentTime
    );
  }

  private generateNoiseBuffer() {
    if (!this.ctx) return;
    const bufferSize = this.ctx.sampleRate * 0.5;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * 0.8;
    }
    this.noiseBuffer = buffer;
  }

  private getDestination(): AudioNode | null {
    if (!this.ctx) return null;
    return this.masterGain || this.ctx.destination;
  }

  // ==========================================================================
  // HOVER SYNTHESIS (Per Preset)
  // ==========================================================================

  public playHover(presetOverride?: SoundPreset) {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx || this.isMuted) return;

    const dest = this.getDestination();
    if (!dest) return;

    const mode = presetOverride || this.preset;
    const now = this.ctx.currentTime;

    switch (mode) {
      case 'cyber': {
        // Crisp high-tech micro harmonic shimmer (Zero low-end mud)
        const osc = this.ctx.createOscillator();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(1550, now);
        osc.frequency.exponentialRampToValueAtTime(2150, now + 0.022);

        const filter = this.ctx.createBiquadFilter();
        filter.type = 'highpass';
        filter.frequency.setValueAtTime(1200, now);

        const gain = this.ctx.createGain();
        gain.gain.setValueAtTime(0.0001, now);
        gain.gain.linearRampToValueAtTime(0.024, now + 0.002);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.025);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(dest);

        osc.start(now);
        osc.stop(now + 0.028);
        break;
      }

      case 'tactile': {
        // Soft mechanical switch contact tick
        if (this.noiseBuffer) {
          const noise = this.ctx.createBufferSource();
          noise.buffer = this.noiseBuffer;
          const filter = this.ctx.createBiquadFilter();
          filter.type = 'bandpass';
          filter.frequency.setValueAtTime(3400, now);
          filter.Q.setValueAtTime(3.8, now);

          const noiseGain = this.ctx.createGain();
          noiseGain.gain.setValueAtTime(0.0001, now);
          noiseGain.gain.linearRampToValueAtTime(0.026, now + 0.001);
          noiseGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.012);

          noise.connect(filter);
          filter.connect(noiseGain);
          noiseGain.connect(dest);

          noise.start(now, Math.random() * 0.1);
          noise.stop(now + 0.015);
        }

        const osc = this.ctx.createOscillator();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(1250, now);
        osc.frequency.exponentialRampToValueAtTime(800, now + 0.012);

        const oscGain = this.ctx.createGain();
        oscGain.gain.setValueAtTime(0.0001, now);
        oscGain.gain.linearRampToValueAtTime(0.015, now + 0.001);
        oscGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.014);

        osc.connect(oscGain);
        oscGain.connect(dest);

        osc.start(now);
        osc.stop(now + 0.016);
        break;
      }

      case 'glass': {
        // High crystal glass micro-ping
        const osc = this.ctx.createOscillator();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(2640, now);

        const gain = this.ctx.createGain();
        gain.gain.setValueAtTime(0.0001, now);
        gain.gain.linearRampToValueAtTime(0.018, now + 0.001);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.018);

        osc.connect(gain);
        gain.connect(dest);

        osc.start(now);
        osc.stop(now + 0.02);
        break;
      }

      case 'scada': {
        // High-tech radar ping
        const osc = this.ctx.createOscillator();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(1760, now);

        const gain = this.ctx.createGain();
        gain.gain.setValueAtTime(0.0001, now);
        gain.gain.linearRampToValueAtTime(0.022, now + 0.001);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.016);

        osc.connect(gain);
        gain.connect(dest);

        osc.start(now);
        osc.stop(now + 0.018);
        break;
      }
    }
  }

  // ==========================================================================
  // CLICK SYNTHESIS (Per Preset)
  // ==========================================================================

  public playClick(presetOverride?: SoundPreset) {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx || this.isMuted) return;

    const dest = this.getDestination();
    if (!dest) return;

    const mode = presetOverride || this.preset;
    const now = this.ctx.currentTime;

    switch (mode) {
      case 'cyber': {
        // Layer 1: Crisp high-pass mechanical transient click
        if (this.noiseBuffer) {
          const noise = this.ctx.createBufferSource();
          noise.buffer = this.noiseBuffer;
          const noiseFilter = this.ctx.createBiquadFilter();
          noiseFilter.type = 'bandpass';
          noiseFilter.frequency.setValueAtTime(4200, now);
          noiseFilter.Q.setValueAtTime(3.2, now);

          const noiseGain = this.ctx.createGain();
          noiseGain.gain.setValueAtTime(0.0001, now);
          noiseGain.gain.linearRampToValueAtTime(0.085, now + 0.001);
          noiseGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.012);

          noise.connect(noiseFilter);
          noiseFilter.connect(noiseGain);
          noiseGain.connect(dest);

          noise.start(now, Math.random() * 0.1);
          noise.stop(now + 0.015);
        }

        // Layer 2: Resonant downward tactile chirp
        const osc = this.ctx.createOscillator();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(920, now);
        osc.frequency.exponentialRampToValueAtTime(420, now + 0.03);

        const filter = this.ctx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(1050, now);
        filter.Q.setValueAtTime(2.2, now);

        const gain = this.ctx.createGain();
        gain.gain.setValueAtTime(0.0001, now);
        gain.gain.linearRampToValueAtTime(0.18, now + 0.002);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.038);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(dest);

        osc.start(now);
        osc.stop(now + 0.04);

        // Layer 3: Subtle tactile weight punch
        const subOsc = this.ctx.createOscillator();
        subOsc.type = 'sine';
        subOsc.frequency.setValueAtTime(120, now);
        subOsc.frequency.exponentialRampToValueAtTime(55, now + 0.022);

        const subGain = this.ctx.createGain();
        subGain.gain.setValueAtTime(0.0001, now);
        subGain.gain.linearRampToValueAtTime(0.09, now + 0.002);
        subGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.025);

        subOsc.connect(subGain);
        subGain.connect(dest);

        subOsc.start(now);
        subOsc.stop(now + 0.028);
        break;
      }

      case 'tactile': {
        // Mechanical switch actuation snap
        if (this.noiseBuffer) {
          const noise = this.ctx.createBufferSource();
          noise.buffer = this.noiseBuffer;
          const noiseFilter = this.ctx.createBiquadFilter();
          noiseFilter.type = 'bandpass';
          noiseFilter.frequency.setValueAtTime(5200, now);
          noiseFilter.Q.setValueAtTime(4.2, now);

          const noiseGain = this.ctx.createGain();
          noiseGain.gain.setValueAtTime(0.0001, now);
          noiseGain.gain.linearRampToValueAtTime(0.14, now + 0.001);
          noiseGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.015);

          noise.connect(noiseFilter);
          noiseFilter.connect(noiseGain);
          noiseGain.connect(dest);

          noise.start(now, Math.random() * 0.1);
          noise.stop(now + 0.018);
        }

        // Switch leaf double strike
        const osc1 = this.ctx.createOscillator();
        osc1.type = 'sine';
        osc1.frequency.setValueAtTime(740, now);
        osc1.frequency.exponentialRampToValueAtTime(320, now + 0.024);

        const gain1 = this.ctx.createGain();
        gain1.gain.setValueAtTime(0.0001, now);
        gain1.gain.linearRampToValueAtTime(0.16, now + 0.0015);
        gain1.gain.exponentialRampToValueAtTime(0.0001, now + 0.026);

        osc1.connect(gain1);
        gain1.connect(dest);

        osc1.start(now);
        osc1.stop(now + 0.028);

        // Bottom-out bump
        const osc2 = this.ctx.createOscillator();
        osc2.type = 'sine';
        osc2.frequency.setValueAtTime(160, now + 0.004);
        osc2.frequency.exponentialRampToValueAtTime(70, now + 0.025);

        const gain2 = this.ctx.createGain();
        gain2.gain.setValueAtTime(0.0001, now + 0.004);
        gain2.gain.linearRampToValueAtTime(0.11, now + 0.006);
        gain2.gain.exponentialRampToValueAtTime(0.0001, now + 0.025);

        osc2.connect(gain2);
        gain2.connect(dest);

        osc2.start(now + 0.004);
        osc2.stop(now + 0.028);
        break;
      }

      case 'glass': {
        // Minimalist liquid / glass bubble pop
        const osc = this.ctx.createOscillator();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(680, now);
        osc.frequency.exponentialRampToValueAtTime(1420, now + 0.014);
        osc.frequency.exponentialRampToValueAtTime(980, now + 0.038);

        const gain = this.ctx.createGain();
        gain.gain.setValueAtTime(0.0001, now);
        gain.gain.linearRampToValueAtTime(0.19, now + 0.002);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.04);

        osc.connect(gain);
        gain.connect(dest);

        osc.start(now);
        osc.stop(now + 0.045);

        // Glass harmonic overtone
        const overtone = this.ctx.createOscillator();
        overtone.type = 'sine';
        overtone.frequency.setValueAtTime(2840, now);

        const overtoneGain = this.ctx.createGain();
        overtoneGain.gain.setValueAtTime(0.0001, now);
        overtoneGain.gain.linearRampToValueAtTime(0.03, now + 0.001);
        overtoneGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.02);

        overtone.connect(overtoneGain);
        overtoneGain.connect(dest);

        overtone.start(now);
        overtone.stop(now + 0.022);
        break;
      }

      case 'scada': {
        // Dual-tone telemetry confirmation blip
        const osc1 = this.ctx.createOscillator();
        osc1.type = 'sine';
        osc1.frequency.setValueAtTime(920, now);

        const gain1 = this.ctx.createGain();
        gain1.gain.setValueAtTime(0.0001, now);
        gain1.gain.linearRampToValueAtTime(0.14, now + 0.002);
        gain1.gain.exponentialRampToValueAtTime(0.0001, now + 0.028);

        osc1.connect(gain1);
        gain1.connect(dest);

        osc1.start(now);
        osc1.stop(now + 0.03);

        // Second tone at +16ms
        const osc2 = this.ctx.createOscillator();
        osc2.type = 'sine';
        osc2.frequency.setValueAtTime(1840, now + 0.016);

        const gain2 = this.ctx.createGain();
        gain2.gain.setValueAtTime(0.0001, now + 0.016);
        gain2.gain.linearRampToValueAtTime(0.12, now + 0.018);
        gain2.gain.exponentialRampToValueAtTime(0.0001, now + 0.038);

        osc2.connect(gain2);
        gain2.connect(dest);

        osc2.start(now + 0.016);
        osc2.stop(now + 0.04);
        break;
      }
    }
  }

  // ==========================================================================
  // ALARM & SPECIAL EFFECTS
  // ==========================================================================

  public playAlarm() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx || this.isMuted) return;

    const dest = this.getDestination();
    if (!dest) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(880, now);
    osc.frequency.setValueAtTime(660, now + 0.09);
    osc.frequency.setValueAtTime(880, now + 0.18);

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(2400, now);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.linearRampToValueAtTime(0.18, now + 0.008);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.28);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(dest);

    osc.start(now);
    osc.stop(now + 0.29);
  }

  public playBackwash() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx || this.isMuted) return;

    const dest = this.getDestination();
    if (!dest) return;

    const now = this.ctx.currentTime;

    // Resonant hydraulic pitch sweep
    const osc = this.ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(180, now);
    osc.frequency.exponentialRampToValueAtTime(460, now + 0.12);
    osc.frequency.exponentialRampToValueAtTime(90, now + 0.32);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.linearRampToValueAtTime(0.20, now + 0.03);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.34);

    osc.connect(gain);
    gain.connect(dest);

    osc.start(now);
    osc.stop(now + 0.35);

    // Filtered pneumatic noise burst
    if (this.noiseBuffer) {
      const noise = this.ctx.createBufferSource();
      noise.buffer = this.noiseBuffer;

      const noiseFilter = this.ctx.createBiquadFilter();
      noiseFilter.type = 'bandpass';
      noiseFilter.frequency.setValueAtTime(300, now);
      noiseFilter.frequency.exponentialRampToValueAtTime(1600, now + 0.15);
      noiseFilter.frequency.exponentialRampToValueAtTime(350, now + 0.32);
      noiseFilter.Q.setValueAtTime(2.0, now);

      const noiseGain = this.ctx.createGain();
      noiseGain.gain.setValueAtTime(0.0001, now);
      noiseGain.gain.linearRampToValueAtTime(0.12, now + 0.04);
      noiseGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.33);

      noise.connect(noiseFilter);
      noiseFilter.connect(noiseGain);
      noiseGain.connect(dest);

      noise.start(now);
      noise.stop(now + 0.34);
    }
  }

  // ==========================================================================
  // CONFIGURATION & PERSISTENCE
  // ==========================================================================

  public setMuted(muted: boolean) {
    this.isMuted = muted;
    if (typeof window !== 'undefined') {
      localStorage.setItem('sinero_sound_muted', String(muted));
    }
    this.updateMasterVolume();
    this.notifyListeners();
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  public toggleMute(): boolean {
    const next = !this.isMuted;
    this.setMuted(next);
    if (!next) {
      this.playClick();
    }
    return next;
  }

  public setPreset(preset: SoundPreset) {
    if (!SOUND_PRESETS.some((p) => p.id === preset)) return;
    this.preset = preset;
    if (typeof window !== 'undefined') {
      localStorage.setItem('sinero_sound_preset', preset);
    }
    this.notifyListeners();
    this.playClick(preset);
  }

  public getPreset(): SoundPreset {
    return this.preset;
  }

  public setVolume(volume: number) {
    const clamped = Math.max(0, Math.min(1, volume));
    this.volume = clamped;
    if (typeof window !== 'undefined') {
      localStorage.setItem('sinero_sound_volume', String(clamped));
    }
    this.updateMasterVolume();
    this.notifyListeners();
  }

  public getVolume(): number {
    return this.volume;
  }
}

export const soundEngine = new SoundEngine();

export function findInteractiveElement(target: EventTarget | null): Element | null {
  if (!target || !(target instanceof Element)) return null;
  if (target.closest('[data-no-sound="true"]')) return null;

  const selector = [
    'button',
    'a',
    'input',
    'select',
    'textarea',
    '[role="button"]',
    '[role="tab"]',
    '[role="menuitem"]',
    '[data-sound]',
    '.cursor-pointer',
    '.interactive',
    'summary',
  ].join(',');

  return target.closest(selector);
}
