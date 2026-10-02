import React, { useState } from 'react';
import { Activity, Info, TrendingUp } from 'lucide-react';
import { ScadaSystemState } from '../../engine/cypherTypes';
import { Dropdown } from '../ui/Dropdown';

interface Props {
  state: ScadaSystemState;
}

type Metric = 'co' | 'co2' | 'so2' | 'pm25';

const METRICS: { key: Metric; label: string; unit: string; digits: number }[] = [
  { key: 'co', label: 'CO', unit: 'ppm', digits: 1 },
  { key: 'co2', label: 'CO₂', unit: '%', digits: 2 },
  { key: 'so2', label: 'SO₂', unit: 'mg/Nm³', digits: 1 },
  { key: 'pm25', label: 'PM2.5', unit: 'µg/m³', digits: 1 },
];

const METRIC_OPTIONS = METRICS.map(item => ({
  value: item.key,
  label: item.label,
  description: item.unit,
  icon: Activity,
}));

const HOURS = [0, 6, 12, 18, 24, 30, 36, 42, 48];

function project(value: number, hours: number, dailyChangePercent: number): number {
  return Math.max(0, value * (1 + (dailyChangePercent / 100) * (hours / 24)));
}

export const EmissionForecast: React.FC<Props> = ({ state }) => {
  const [metric, setMetric] = useState<Metric>('co');
  const [dailyChangePercent, setDailyChangePercent] = useState(0);
  const selected = METRICS.find((item) => item.key === metric)!;
  const current = state.cems[metric];
  const values = HOURS.map((hour) => project(current, hour, dailyChangePercent));
  const max = Math.max(...values, 0.01) * 1.15;
  const points = values.map((value, index) => `${36 + index * 55},${158 - (value / max) * 118}`).join(' ');

  return (
    <section className="space-y-5 anim-rise" aria-label="Simulasi emisi 24 sampai 48 jam">
      <div className="rounded-2xl border border-cyan-200 bg-cyan-50/70 p-4 flex gap-3">
        <Info className="w-5 h-5 text-cyan-700 shrink-0 mt-0.5" />
        <div className="text-[12px] leading-relaxed text-slate-700">
          <strong className="text-slate-900">Skenario ilustratif.</strong> Angka memakai telemetri simulasi saat ini dan perubahan harian yang Anda pilih. Riwayat CEMS belum tersedia.
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(240px,320px)] gap-4">
        <div className="rounded-2xl surface-inset p-5">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
            <div>
              <div className="flex items-center gap-2 text-core-600 font-mono text-[11px] font-bold uppercase tracking-wider">
                <TrendingUp className="w-4 h-4" /> 0–48 jam
              </div>
              <h4 className="section-title text-[19px] text-hi mt-1">Konsentrasi {selected.label}</h4>
            </div>
            <Dropdown<Metric>
              id="emission-parameter"
              label="Parameter"
              value={metric}
              onChange={setMetric}
              options={METRIC_OPTIONS}
              minMenuWidth={180}
              showSelectedIcon={false}
              className="w-28"
            />
          </div>

          <div className="w-full overflow-x-auto" role="img" aria-label={`Grafik skenario ${selected.label} dari saat ini hingga 48 jam`}>
            <svg viewBox="0 0 520 190" className="w-full min-w-[460px] h-auto" aria-hidden="true">
              {[40, 99, 158].map((y) => <line key={y} x1="36" x2="492" y1={y} y2={y} stroke="#cbd5e1" strokeDasharray="4 5" />)}
              <line x1="36" x2="36" y1="35" y2="158" stroke="#94a3b8" />
              <line x1="36" x2="492" y1="158" y2="158" stroke="#94a3b8" />
              <polyline points={points} fill="none" stroke="#0891b2" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
              {values.map((value, index) => (
                <circle key={HOURS[index]} cx={36 + index * 55} cy={158 - (value / max) * 118} r={index % 4 === 0 ? 5 : 3} fill="#0891b2" />
              ))}
              {[0, 24, 48].map((hour) => <text key={hour} x={36 + (hour / 6) * 55} y="180" textAnchor="middle" fontSize="12" fill="#475569">{hour === 0 ? 'Kini' : `${hour} jam`}</text>)}
            </svg>
          </div>

          <div className="grid grid-cols-3 gap-2 mt-3">
            {[0, 24, 48].map((hour) => (
              <div key={hour} className="rounded-xl bg-white border border-black/[.06] px-3 py-3">
                <div className="text-[11px] font-semibold text-lo">{hour === 0 ? 'Saat ini' : `+${hour} jam`}</div>
                <div className="font-mono text-[17px] font-bold text-hi mt-1">{project(current, hour, dailyChangePercent).toFixed(selected.digits)}</div>
                <div className="text-[11px] text-mid">{selected.unit}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl surface-inset p-5 space-y-5">
          <div className="flex items-center gap-2 text-core-600 font-mono text-[11px] font-bold uppercase tracking-wider">
            <Activity className="w-4 h-4" /> Asumsi Skenario
          </div>
          <div>
            <label htmlFor="daily-emission-change" className="flex justify-between gap-2 text-[12px] font-semibold text-hi">
              <span>Perubahan konsentrasi per hari</span>
              <span className="font-mono text-core-600">{dailyChangePercent > 0 ? '+' : ''}{dailyChangePercent}%</span>
            </label>
            <input
              id="daily-emission-change"
              type="range"
              min="-20"
              max="20"
              step="1"
              value={dailyChangePercent}
              onChange={(event) => setDailyChangePercent(Number(event.target.value))}
              className="liquid-range mt-5 mb-4"
              style={{ '--range-color': '#0891b2', '--range-fill': `${((dailyChangePercent + 20) / 40) * 100}%` } as React.CSSProperties}
            />
            <div className="flex justify-between text-[11px] text-mid mt-1"><span>−20%</span><span>0%</span><span>+20%</span></div>
          </div>
          <p className="text-[12px] leading-relaxed text-mid">
            {dailyChangePercent === 0
              ? 'Saat ini diasumsikan tetap. Geser untuk mencoba kenaikan atau penurunan hingga 48 jam.'
              : `Perubahan diterapkan secara linier setiap hari. Filter saat ini ${state.filter.active ? 'aktif' : 'bypass'}.`}
          </p>
        </div>
      </div>

      <details className="group rounded-2xl surface-inset">
        <summary className="cursor-pointer p-4 text-[13px] font-bold text-hi">Lihat proyeksi semua parameter</summary>
        <div className="overflow-x-auto border-t border-black/[.08]">
          <table className="w-full min-w-[520px] text-left text-[12px]">
            <thead className="bg-slate-50 text-mid"><tr><th className="px-4 py-3">Parameter</th><th className="px-4 py-3">Saat ini</th><th className="px-4 py-3">+24 jam</th><th className="px-4 py-3">+48 jam</th></tr></thead>
            <tbody>
              {METRICS.map((item) => (
                <tr key={item.key} className="border-t border-black/[.06] text-hi">
                  <th className="px-4 py-3 font-semibold">{item.label} <span className="font-normal text-lo">({item.unit})</span></th>
                  {[0, 24, 48].map((hour) => <td key={hour} className="px-4 py-3 font-mono">{project(state.cems[item.key], hour, dailyChangePercent).toFixed(item.digits)}</td>)}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </details>
    </section>
  );
};
