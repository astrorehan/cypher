import React, { useState } from 'react';
import {
  Activity,
  AlertTriangle,
  CheckCircle2,
  Flame,
  ListFilter,
  RefreshCw,
  SlidersHorizontal,
  Trash2,
  UserRound,
  Wind,
  Zap,
} from 'lucide-react';
import { ScadaSystemState, ScadaEventLog } from '../../engine/cypherTypes';
import { Dropdown } from '../ui/Dropdown';

type PresetId = 'MAX_POWER' | 'ECO_COMPLIANCE' | 'LAB_BENCHMARK' | 'SURGE_PROTECT';
type LogFilter = 'ALL' | 'TEG' | 'CEMS' | 'FILTER' | 'AI' | 'OPERATOR';

interface Props {
  state: ScadaSystemState;
  coolantRate: number;
  onCoolantChange: (val: number) => void;
  flueHeatOffset: number;
  onFlueHeatChange: (val: number) => void;
  onTriggerBackwash: () => void;
  onToggleFilter: () => void;
  onCalibrateSensors: () => void;
  onApplyPreset?: (presetId: PresetId) => void;
  onClearLogs?: () => void;
  logs: ScadaEventLog[];
}

const PRESETS = [
  { id: 'MAX_POWER', label: 'Daya maksimum', icon: Zap },
  { id: 'ECO_COMPLIANCE', label: 'Emisi rendah', icon: Wind },
  { id: 'LAB_BENCHMARK', label: 'Uji lab', icon: Activity },
  { id: 'SURGE_PROTECT', label: 'Redam panas', icon: Flame },
] as const;

const LOG_FILTER_OPTIONS = [
  { value: 'ALL', label: 'Semua aktivitas', icon: ListFilter },
  { value: 'TEG', label: 'TEG', icon: Zap },
  { value: 'CEMS', label: 'CEMS', icon: Activity },
  { value: 'FILTER', label: 'Filter', icon: Wind },
  { value: 'AI', label: 'Kendali', icon: SlidersHorizontal },
  { value: 'OPERATOR', label: 'Operator', icon: UserRound },
] as const;

const SOURCE_NAMES: Record<ScadaEventLog['source'], string> = {
  TEG_HARVESTER: 'TEG',
  CEMS_IOT: 'CEMS',
  SMART_FILTER: 'Filter',
  AI_CONTROLLER: 'Kendali',
  OPERATOR: 'Operator',
};

export const ActuatorControlPanel: React.FC<Props> = ({
  state,
  coolantRate,
  onCoolantChange,
  flueHeatOffset,
  onFlueHeatChange,
  onTriggerBackwash,
  onToggleFilter,
  onCalibrateSensors,
  onApplyPreset,
  onClearLogs,
  logs,
}) => {
  const [activePreset, setActivePreset] = useState<PresetId | null>(null);
  const [logFilter, setLogFilter] = useState<LogFilter>('ALL');
  const filteredLogs = logs.filter((log) => {
    if (logFilter === 'ALL') return true;
    if (logFilter === 'TEG') return log.source === 'TEG_HARVESTER';
    if (logFilter === 'CEMS') return log.source === 'CEMS_IOT';
    if (logFilter === 'FILTER') return log.source === 'SMART_FILTER';
    if (logFilter === 'AI') return log.source === 'AI_CONTROLLER';
    return log.source === 'OPERATOR';
  });

  return (
    <div className="space-y-4">
      <section className="scada-panel rounded-[26px] px-5 py-4 md:px-6 md:py-5" aria-label="Preset simulasi">
        <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4">
          <div>
            <h3 className="text-[15px] font-bold tracking-tight text-hi">Mulai dari preset</h3>
            <p className="mt-0.5 text-[13px] text-mid">Pilih kondisi contoh, lalu sesuaikan parameternya.</p>
          </div>
          <div className="flex flex-wrap gap-2" role="group" aria-label="Pilih preset operasi">
            {PRESETS.map((preset) => {
              const Icon = preset.icon;
              const selected = activePreset === preset.id;
              return (
                <button
                  key={preset.id}
                  type="button"
                  disabled={!onApplyPreset}
                  aria-pressed={selected}
                  onClick={() => { setActivePreset(preset.id); onApplyPreset?.(preset.id); }}
                  className={`liquid-control min-h-11 rounded-full px-4 py-2.5 inline-flex items-center gap-2 text-[13px] font-semibold cursor-pointer disabled:opacity-50 ${selected ? 'text-core-700 ring-2 ring-core-500/35' : 'text-hi'}`}
                >
                  <Icon className="w-4 h-4 text-core-600" /> {preset.label}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        <section className="scada-panel lg:col-span-7 rounded-[28px] p-5 md:p-7" aria-label="Kendali proses">
          <div className="flex flex-wrap items-start justify-between gap-3 mb-6">
            <div className="flex items-start gap-3">
              <span className="liquid-control w-11 h-11 rounded-2xl text-core-600 flex items-center justify-center shrink-0">
                <SlidersHorizontal className="w-5 h-5" />
              </span>
              <div>
                <h3 className="font-display text-[19px] font-bold tracking-tight text-hi">Kendali proses</h3>
                <p className="mt-0.5 text-[13px] text-mid">Ubah aliran pendingin dan suhu gas pada simulasi.</p>
              </div>
            </div>
            <span className="rounded-full bg-slate-100 px-3 py-1.5 text-[12px] font-semibold text-mid">Simulasi</span>
          </div>

          <div className="space-y-4">
            <div className="rounded-[22px] bg-[#f5f8fc] border border-slate-200/70 p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <label htmlFor="coolant-rate" className="block text-[15px] font-semibold text-hi">Aliran pendingin</label>
                  <p className="mt-1 text-[13px] text-mid">Mengatur suhu sisi dingin modul TEG.</p>
                </div>
                <output htmlFor="coolant-rate" className="shrink-0 rounded-xl bg-white px-3 py-2 text-[18px] font-bold tabular-nums text-core-700 shadow-sm">
                  {coolantRate} <span className="text-[12px] font-medium">L/min</span>
                </output>
              </div>
              <input
                id="coolant-rate"
                type="range"
                min="10"
                max="90"
                value={coolantRate}
                onChange={(event) => { onCoolantChange(Number(event.target.value)); setActivePreset(null); }}
                style={{ '--range-fill': `${((coolantRate - 10) / 80) * 100}%`, '--range-color': '#0284c7' } as React.CSSProperties}
                className="liquid-range mt-7"
              />
              <div className="mt-3 flex justify-between text-[12px] text-mid"><span>10 L/min</span><span>90 L/min</span></div>
            </div>

            <div className="rounded-[22px] bg-[#f5f8fc] border border-slate-200/70 p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <label htmlFor="flue-heat" className="block text-[15px] font-semibold text-hi">Perubahan suhu gas</label>
                  <p className="mt-1 text-[13px] text-mid">Penyesuaian terhadap suhu gas dasar.</p>
                </div>
                <output htmlFor="flue-heat" className="shrink-0 rounded-xl bg-white px-3 py-2 text-[18px] font-bold tabular-nums text-amber-700 shadow-sm">
                  {flueHeatOffset > 0 ? '+' : ''}{flueHeatOffset} <span className="text-[12px] font-medium">°C</span>
                </output>
              </div>
              <input
                id="flue-heat"
                type="range"
                min="-20"
                max="30"
                value={flueHeatOffset}
                onChange={(event) => { onFlueHeatChange(Number(event.target.value)); setActivePreset(null); }}
                style={{ '--range-fill': `${((flueHeatOffset + 20) / 50) * 100}%`, '--range-color': '#d97706' } as React.CSSProperties}
                className="liquid-range mt-7"
              />
              <div className="mt-3 flex justify-between text-[12px] text-mid"><span>−20 °C</span><span>+30 °C</span></div>
            </div>
          </div>

          <div className="mt-5 rounded-[22px] bg-slate-900 p-5 text-white">
            <h4 className="text-[12px] font-semibold text-slate-300">Dampak pada unit saat ini</h4>
            <div className="mt-3 grid grid-cols-3 gap-3">
              <div><div className="text-[11px] text-slate-300">Suhu gas</div><div className="mt-1 text-[18px] font-bold tabular-nums">{state.teg.tempHot} <span className="text-[12px] font-medium">°C</span></div></div>
              <div><div className="text-[11px] text-slate-300">Gradien ΔT</div><div className="mt-1 text-[18px] font-bold tabular-nums">{state.teg.deltaT} <span className="text-[12px] font-medium">°C</span></div></div>
              <div><div className="text-[11px] text-slate-300">Daya TEG</div><div className="mt-1 text-[18px] font-bold tabular-nums">{state.teg.power} <span className="text-[12px] font-medium">{state.teg.powerUnit}</span></div></div>
            </div>
          </div>

          <div className="mt-7">
            <h4 className="text-[15px] font-bold text-hi mb-3">Tindakan</h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <button
                type="button"
                onClick={onTriggerBackwash}
                disabled={state.filter.chamberStatus === 'PURGING_BACKWASH'}
                className="liquid-control min-h-[94px] rounded-[20px] p-4 text-left disabled:opacity-50 cursor-pointer"
              >
                <RefreshCw className={`w-5 h-5 text-core-600 ${state.filter.chamberStatus === 'PURGING_BACKWASH' ? 'animate-spin' : ''}`} />
                <span className="block mt-2 text-[13px] font-bold text-hi">{state.filter.chamberStatus === 'PURGING_BACKWASH' ? 'Pembersihan aktif' : 'Bersihkan filter'}</span>
                <span className="block mt-0.5 text-[12px] text-mid">Pulse-jet backwash</span>
              </button>
              <button
                type="button"
                onClick={onToggleFilter}
                className={`liquid-control min-h-[94px] rounded-[20px] p-4 text-left cursor-pointer ${state.filter.active ? 'ring-1 ring-amber-300/70' : 'ring-2 ring-emerald-400/60'}`}
              >
                <AlertTriangle className={`w-5 h-5 ${state.filter.active ? 'text-amber-600' : 'text-emerald-600'}`} />
                <span className="block mt-2 text-[13px] font-bold text-hi">{state.filter.active ? 'Uji bypass' : 'Aktifkan filter'}</span>
                <span className="block mt-0.5 text-[12px] text-mid">{state.filter.active ? 'Lewati filter sementara' : 'Akhiri mode bypass'}</span>
              </button>
              <button type="button" onClick={onCalibrateSensors} className="liquid-control min-h-[94px] rounded-[20px] p-4 text-left cursor-pointer">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                <span className="block mt-2 text-[13px] font-bold text-hi">Kalibrasi sensor</span>
                <span className="block mt-0.5 text-[12px] text-mid">Simulasi zero/span</span>
              </button>
            </div>
          </div>
        </section>

        <section className="scada-panel lg:col-span-5 rounded-[28px] p-5 md:p-7 flex flex-col" aria-label="Aktivitas sesi">
          <div className="flex flex-wrap items-start justify-between gap-3 mb-5">
            <div>
              <h3 className="font-display text-[19px] font-bold tracking-tight text-hi">Aktivitas sesi</h3>
              <p className="mt-0.5 text-[13px] text-mid">Aksi dan perubahan selama simulasi.</p>
            </div>
            {onClearLogs && (
              <button type="button" onClick={onClearLogs} aria-label="Bersihkan catatan" title="Bersihkan catatan" className="liquid-control w-10 h-10 rounded-xl text-mid flex items-center justify-center cursor-pointer">
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>

          <Dropdown<LogFilter>
            id="session-log-filter"
            label="Tampilkan catatan"
            value={logFilter}
            onChange={setLogFilter}
            options={LOG_FILTER_OPTIONS}
            className="mb-4"
          />

          <div className="space-y-2 max-h-[440px] overflow-y-auto pr-1 scroll-paper flex-1">
            {filteredLogs.length === 0 ? (
              <p className="rounded-2xl bg-slate-50 p-5 text-[13px] text-mid">Belum ada aktivitas pada kategori ini.</p>
            ) : filteredLogs.map((log) => (
              <div key={log.id} className="rounded-2xl bg-[#f5f8fc] border border-slate-200/60 p-3.5">
                <div className="flex items-center gap-2 text-[11px] font-semibold text-mid">
                  <span className={`w-2 h-2 rounded-full ${log.level === 'ALERT' ? 'bg-rose-500' : log.level === 'WARNING' ? 'bg-amber-500' : log.level === 'SUCCESS' ? 'bg-emerald-500' : 'bg-core-500'}`} />
                  {SOURCE_NAMES[log.source]} <span className="ml-auto font-normal tabular-nums">{log.timestamp}</span>
                </div>
                <p className="mt-1.5 text-[12px] leading-relaxed text-hi">{log.message}</p>
              </div>
            ))}
          </div>
          <p className="pt-4 mt-4 border-t border-slate-200 text-[12px] text-mid">Data contoh · belum terhubung ke CEMS</p>
        </section>
      </div>
    </div>
  );
};
