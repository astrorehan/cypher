import React, { useState } from 'react';
import {
  TrendingUp,
  BarChart3,
  Activity,
  Layers,
  CheckCircle2,
  AlertTriangle,
  Info,
} from 'lucide-react';
import { EXPERIMENTAL_SERIES } from '../../engine/cypherData';

interface Props {
  powerWaveform: number[];
  coWaveform: number[];
  co2Waveform: number[];
  powerUnit?: 'W' | 'kW';
}

export const AnalyticsCharts: React.FC<Props> = ({
  powerWaveform,
  coWaveform,
  co2Waveform,
  powerUnit = 'W',
}) => {
  const [activeTab, setActiveTab] = useState<'experiment_teg' | 'experiment_cems' | 'live_stream'>('experiment_teg');

  return (
    <div className="rounded-3xl bg-white border border-slate-200 shadow-sm p-6 space-y-5">
      {/* Top Header & Tab Switcher */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2 text-cyan-700 font-mono text-[11px] font-bold uppercase tracking-wider mb-0.5">
            <BarChart3 className="w-3.5 h-3.5" />
            <span>Validasi Data Uji Empiris Laboratorium (UGM 2026)</span>
          </div>
          <h3 className="font-display text-[17px] font-bold text-slate-900">
            Grafik Kinerja Termal, Elektrik &amp; Komparasi Filtrasi Gas
          </h3>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center bg-slate-100 p-1 rounded-xl text-[12px] font-semibold">
          <button
            onClick={() => setActiveTab('experiment_teg')}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
              activeTab === 'experiment_teg'
                ? 'bg-white text-slate-900 shadow-sm font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            ⚡ Data Termal &amp; Daya TEG
          </button>
          <button
            onClick={() => setActiveTab('experiment_cems')}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
              activeTab === 'experiment_cems'
                ? 'bg-white text-slate-900 shadow-sm font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            🌱 Reduksi CO &amp; CO₂ Filter
          </button>
          <button
            onClick={() => setActiveTab('live_stream')}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
              activeTab === 'live_stream'
                ? 'bg-white text-slate-900 shadow-sm font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            📈 Osiloskop Real-Time
          </button>
        </div>
      </div>

      {/* Tab 1: TEG Thermal & Electrical Parameters (Gambar 1 dari Esai) */}
      {activeTab === 'experiment_teg' && (
        <div className="space-y-6 anim-rise">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Sub-chart A: Thermal Parameters (T-hot, T-cold, Delta-T) */}
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-bold text-[13.5px] text-slate-900">
                  (a) Grafik Rata-Rata T-hot, T-cold &amp; ΔT per 15 Menit
                </h4>
                <span className="text-[11px] font-mono text-cyan-700 font-semibold">
                  Satuan: °C
                </span>
              </div>

              {/* Custom SVG Line Chart */}
              <div className="h-[200px] w-full relative">
                <svg className="w-full h-full overflow-visible" viewBox="0 0 400 160">
                  {/* Grid Lines */}
                  <line x1="40" y1="20" x2="390" y2="20" stroke="#e2e8f0" strokeDasharray="3 3" />
                  <line x1="40" y1="60" x2="390" y2="60" stroke="#e2e8f0" strokeDasharray="3 3" />
                  <line x1="40" y1="100" x2="390" y2="100" stroke="#e2e8f0" strokeDasharray="3 3" />
                  <line x1="40" y1="140" x2="390" y2="140" stroke="#cbd5e1" strokeWidth="1.5" />

                  {/* Y Axis Labels */}
                  <text x="30" y="24" fontSize="9" fill="#64748b" textAnchor="end">35°C</text>
                  <text x="30" y="64" fontSize="9" fill="#64748b" textAnchor="end">25°C</text>
                  <text x="30" y="104" fontSize="9" fill="#64748b" textAnchor="end">15°C</text>
                  <text x="30" y="144" fontSize="9" fill="#64748b" textAnchor="end">5°C</text>

                  {/* Lines */}
                  {/* T-hot (Blue Line ~33-35) */}
                  <path
                    d={`M 70,${140 - ((33.2 - 5) / 30) * 120} L 170,${140 - ((34.6 - 5) / 30) * 120} L 270,${140 - ((33.1 - 5) / 30) * 120} L 370,${140 - ((34.0 - 5) / 30) * 120}`}
                    fill="none"
                    stroke="#2563eb"
                    strokeWidth="2.5"
                  />
                  {/* T-cold (Red Line ~26) */}
                  <path
                    d={`M 70,${140 - ((26.2 - 5) / 30) * 120} L 170,${140 - ((26.4 - 5) / 30) * 120} L 270,${140 - ((26.6 - 5) / 30) * 120} L 370,${140 - ((26.8 - 5) / 30) * 120}`}
                    fill="none"
                    stroke="#dc2626"
                    strokeWidth="2.5"
                  />
                  {/* Delta T (Green Line ~6.5-8.2) */}
                  <path
                    d={`M 70,${140 - ((7.0 - 5) / 30) * 120} L 170,${140 - ((8.2 - 5) / 30) * 120} L 270,${140 - ((6.5 - 5) / 30) * 120} L 370,${140 - ((7.2 - 5) / 30) * 120}`}
                    fill="none"
                    stroke="#16a34a"
                    strokeWidth="2.5"
                  />

                  {/* Data Points and values */}
                  {EXPERIMENTAL_SERIES.map((pt, idx) => {
                    const x = 70 + idx * 100;
                    const yHot = 140 - ((pt.tHotAvg - 5) / 30) * 120;
                    const yCold = 140 - ((pt.tColdAvg - 5) / 30) * 120;
                    const yDelta = 140 - ((pt.deltaTAvg - 5) / 30) * 120;

                    return (
                      <g key={idx}>
                        <circle cx={x} cy={yHot} r="4" fill="#2563eb" />
                        <text x={x} y={yHot - 8} fontSize="9" fontWeight="bold" fill="#2563eb" textAnchor="middle">{pt.tHotAvg}</text>

                        <circle cx={x} cy={yCold} r="4" fill="#dc2626" />
                        <text x={x} y={yCold - 8} fontSize="9" fontWeight="bold" fill="#dc2626" textAnchor="middle">{pt.tColdAvg}</text>

                        <circle cx={x} cy={yDelta} r="4" fill="#16a34a" />
                        <text x={x} y={yDelta - 8} fontSize="9" fontWeight="bold" fill="#16a34a" textAnchor="middle">{pt.deltaTAvg}</text>

                        <text x={x} y="156" fontSize="9" fill="#64748b" textAnchor="middle">{pt.timeLabel}</text>
                      </g>
                    );
                  })}
                </svg>
              </div>

              {/* Legend */}
              <div className="mt-3 flex items-center justify-center gap-5 text-[11px] font-semibold">
                <span className="inline-flex items-center gap-1.5 text-blue-600">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-600" />
                  T-hot avg (°C)
                </span>
                <span className="inline-flex items-center gap-1.5 text-rose-600">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-600" />
                  T-cold avg (°C)
                </span>
                <span className="inline-flex items-center gap-1.5 text-emerald-600">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-600" />
                  ΔT avg (°C)
                </span>
              </div>
            </div>

            {/* Sub-chart B: Electrical Parameters (Voltage V & Power W) */}
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-bold text-[13.5px] text-slate-900">
                  (b) Grafik Rata-Rata Tegangan (V) &amp; Daya (W) per 15 Menit
                </h4>
                <span className="text-[11px] font-mono text-cyan-700 font-semibold">
                  P = 0.52 ΔT + 0.08 (R² = 0.94)
                </span>
              </div>

              {/* Custom SVG Line Chart */}
              <div className="h-[200px] w-full relative">
                <svg className="w-full h-full overflow-visible" viewBox="0 0 400 160">
                  {/* Grid Lines */}
                  <line x1="40" y1="20" x2="390" y2="20" stroke="#e2e8f0" strokeDasharray="3 3" />
                  <line x1="40" y1="60" x2="390" y2="60" stroke="#e2e8f0" strokeDasharray="3 3" />
                  <line x1="40" y1="100" x2="390" y2="100" stroke="#e2e8f0" strokeDasharray="3 3" />
                  <line x1="40" y1="140" x2="390" y2="140" stroke="#cbd5e1" strokeWidth="1.5" />

                  {/* Y Axis Labels */}
                  <text x="30" y="24" fontSize="9" fill="#64748b" textAnchor="end">5.0</text>
                  <text x="30" y="64" fontSize="9" fill="#64748b" textAnchor="end">3.5</text>
                  <text x="30" y="104" fontSize="9" fill="#64748b" textAnchor="end">2.0</text>
                  <text x="30" y="144" fontSize="9" fill="#64748b" textAnchor="end">0.5</text>

                  {/* Power P_avg (Red/Rose Line ~3.2 - 4.4 W) */}
                  <path
                    d={`M 70,${140 - ((3.6 - 0.5) / 4.5) * 120} L 170,${140 - ((4.4 - 0.5) / 4.5) * 120} L 270,${140 - ((3.2 - 0.5) / 4.5) * 120} L 370,${140 - ((3.8 - 0.5) / 4.5) * 120}`}
                    fill="none"
                    stroke="#e11d48"
                    strokeWidth="3"
                  />

                  {/* Voltage V_avg (Blue Line ~2.0 - 2.5 V) */}
                  <path
                    d={`M 70,${140 - ((2.2 - 0.5) / 4.5) * 120} L 170,${140 - ((2.5 - 0.5) / 4.5) * 120} L 270,${140 - ((2.0 - 0.5) / 4.5) * 120} L 370,${140 - ((2.3 - 0.5) / 4.5) * 120}`}
                    fill="none"
                    stroke="#0284c7"
                    strokeWidth="2.5"
                  />

                  {/* Data Points */}
                  {EXPERIMENTAL_SERIES.map((pt, idx) => {
                    const x = 70 + idx * 100;
                    const yP = 140 - ((pt.pAvg - 0.5) / 4.5) * 120;
                    const yV = 140 - ((pt.vAvg - 0.5) / 4.5) * 120;

                    return (
                      <g key={idx}>
                        <circle cx={x} cy={yP} r="4" fill="#e11d48" />
                        <text x={x} y={yP - 8} fontSize="9" fontWeight="bold" fill="#e11d48" textAnchor="middle">{pt.pAvg} W</text>

                        <circle cx={x} cy={yV} r="4" fill="#0284c7" />
                        <text x={x} y={yV + 16} fontSize="9" fontWeight="bold" fill="#0284c7" textAnchor="middle">{pt.vAvg} V</text>

                        <text x={x} y="156" fontSize="9" fill="#64748b" textAnchor="middle">{pt.timeLabel}</text>
                      </g>
                    );
                  })}
                </svg>
              </div>

              {/* Legend */}
              <div className="mt-3 flex items-center justify-center gap-5 text-[11px] font-semibold">
                <span className="inline-flex items-center gap-1.5 text-rose-600">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-600" />
                  P_avg (Watt Daya Listrik)
                </span>
                <span className="inline-flex items-center gap-1.5 text-cyan-600">
                  <span className="w-2.5 h-2.5 rounded-full bg-cyan-600" />
                  V_avg (Volt Tegangan DC)
                </span>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-cyan-50/60 border border-cyan-200/80 text-[12.5px] text-cyan-900 flex items-start gap-3">
            <Info className="w-4 h-4 text-cyan-700 shrink-0 mt-0.5" />
            <p>
              <strong>Kesimpulan Termal TEG:</strong> Modul TEG tipe TEC1-12706 terbukti menghasilkan daya listrik rata-rata <strong>3,2–4,4 W</strong> pada perbedaan suhu <strong>6,5–8,2°C</strong> dengan tegangan stabil <strong>2,0–2,5 V</strong>. Hubungan erat dinyatakan dalam model regresi <em>P = 0,52 ΔT + 0,08 (R² = 0,94)</em>: semakin besar gradien suhu cerobong, semakin besar energi listrik yang dipanen.
            </p>
          </div>
        </div>
      )}

      {/* Tab 2: Filter vs Without Filter CEMS Emissions (Gambar 2 dari Esai) */}
      {activeTab === 'experiment_cems' && (
        <div className="space-y-6 anim-rise">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Sub-chart A: CO (ppm) Reduction */}
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-bold text-[13.5px] text-slate-900">
                  (a) Perubahan Kadar CO (ppm) per 15 Menit
                </h4>
                <span className="text-[11px] font-mono text-emerald-700 font-semibold">
                  Reduksi ~15 ppm (Wilcoxon p &lt; 0.05)
                </span>
              </div>

              <div className="h-[200px] w-full relative">
                <svg className="w-full h-full overflow-visible" viewBox="0 0 400 160">
                  <line x1="40" y1="20" x2="390" y2="20" stroke="#e2e8f0" strokeDasharray="3 3" />
                  <line x1="40" y1="60" x2="390" y2="60" stroke="#e2e8f0" strokeDasharray="3 3" />
                  <line x1="40" y1="100" x2="390" y2="100" stroke="#e2e8f0" strokeDasharray="3 3" />
                  <line x1="40" y1="140" x2="390" y2="140" stroke="#cbd5e1" strokeWidth="1.5" />

                  <text x="30" y="24" fontSize="9" fill="#64748b" textAnchor="end">50</text>
                  <text x="30" y="64" fontSize="9" fill="#64748b" textAnchor="end">35</text>
                  <text x="30" y="104" fontSize="9" fill="#64748b" textAnchor="end">20</text>
                  <text x="30" y="144" fontSize="9" fill="#64748b" textAnchor="end">5</text>

                  {/* Tanpa Filter (Red Line: 35, 38, 42, 45 ppm) */}
                  <path
                    d={`M 70,${140 - ((35 - 5) / 45) * 120} L 170,${140 - ((38 - 5) / 45) * 120} L 270,${140 - ((42 - 5) / 45) * 120} L 370,${140 - ((45 - 5) / 45) * 120}`}
                    fill="none"
                    stroke="#dc2626"
                    strokeWidth="3"
                  />

                  {/* Dengan Filter (Blue Line: 20, 22, 25, 28 ppm) */}
                  <path
                    d={`M 70,${140 - ((20 - 5) / 45) * 120} L 170,${140 - ((22 - 5) / 45) * 120} L 270,${140 - ((25 - 5) / 45) * 120} L 370,${140 - ((28 - 5) / 45) * 120}`}
                    fill="none"
                    stroke="#0284c7"
                    strokeWidth="3"
                  />

                  {EXPERIMENTAL_SERIES.map((pt, idx) => {
                    const x = 70 + idx * 100;
                    const yNo = 140 - ((pt.coWithoutFilter - 5) / 45) * 120;
                    const yYes = 140 - ((pt.coWithFilter - 5) / 45) * 120;

                    return (
                      <g key={idx}>
                        <circle cx={x} cy={yNo} r="4" fill="#dc2626" />
                        <text x={x} y={yNo - 8} fontSize="9" fontWeight="bold" fill="#dc2626" textAnchor="middle">{pt.coWithoutFilter}</text>

                        <circle cx={x} cy={yYes} r="4" fill="#0284c7" />
                        <text x={x} y={yYes - 8} fontSize="9" fontWeight="bold" fill="#0284c7" textAnchor="middle">{pt.coWithFilter}</text>

                        <text x={x} y="156" fontSize="9" fill="#64748b" textAnchor="middle">{pt.timeLabel}</text>
                      </g>
                    );
                  })}
                </svg>
              </div>

              <div className="mt-3 flex items-center justify-center gap-5 text-[11px] font-semibold">
                <span className="inline-flex items-center gap-1.5 text-cyan-700">
                  <span className="w-2.5 h-2.5 rounded-full bg-cyan-600" />
                  CO (ppm) Dengan Filter
                </span>
                <span className="inline-flex items-center gap-1.5 text-rose-600">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-600" />
                  CO (ppm) Tanpa Filter
                </span>
              </div>
            </div>

            {/* Sub-chart B: CO2 (%) Reduction */}
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-bold text-[13.5px] text-slate-900">
                  (b) Perubahan Kadar CO₂ (%) per 15 Menit
                </h4>
                <span className="text-[11px] font-mono text-emerald-700 font-semibold">
                  Reduksi ~1.0% (3.0% vs 4.2%)
                </span>
              </div>

              <div className="h-[200px] w-full relative">
                <svg className="w-full h-full overflow-visible" viewBox="0 0 400 160">
                  <line x1="40" y1="20" x2="390" y2="20" stroke="#e2e8f0" strokeDasharray="3 3" />
                  <line x1="40" y1="60" x2="390" y2="60" stroke="#e2e8f0" strokeDasharray="3 3" />
                  <line x1="40" y1="100" x2="390" y2="100" stroke="#e2e8f0" strokeDasharray="3 3" />
                  <line x1="40" y1="140" x2="390" y2="140" stroke="#cbd5e1" strokeWidth="1.5" />

                  <text x="30" y="24" fontSize="9" fill="#64748b" textAnchor="end">4.5%</text>
                  <text x="30" y="64" fontSize="9" fill="#64748b" textAnchor="end">3.5%</text>
                  <text x="30" y="104" fontSize="9" fill="#64748b" textAnchor="end">2.5%</text>
                  <text x="30" y="144" fontSize="9" fill="#64748b" textAnchor="end">1.5%</text>

                  {/* Tanpa Filter (Red Line: 3.5%, 3.7%, 4.0%, 4.2%) */}
                  <path
                    d={`M 70,${140 - ((3.5 - 1.5) / 3.0) * 120} L 170,${140 - ((3.7 - 1.5) / 3.0) * 120} L 270,${140 - ((4.0 - 1.5) / 3.0) * 120} L 370,${140 - ((4.2 - 1.5) / 3.0) * 120}`}
                    fill="none"
                    stroke="#dc2626"
                    strokeWidth="3"
                  />

                  {/* Dengan Filter (Blue Line: 2.5%, 2.6%, 2.8%, 3.0%) */}
                  <path
                    d={`M 70,${140 - ((2.5 - 1.5) / 3.0) * 120} L 170,${140 - ((2.6 - 1.5) / 3.0) * 120} L 270,${140 - ((2.8 - 1.5) / 3.0) * 120} L 370,${140 - ((3.0 - 1.5) / 3.0) * 120}`}
                    fill="none"
                    stroke="#0284c7"
                    strokeWidth="3"
                  />

                  {EXPERIMENTAL_SERIES.map((pt, idx) => {
                    const x = 70 + idx * 100;
                    const yNo = 140 - ((pt.co2WithoutFilter - 1.5) / 3.0) * 120;
                    const yYes = 140 - ((pt.co2WithFilter - 1.5) / 3.0) * 120;

                    return (
                      <g key={idx}>
                        <circle cx={x} cy={yNo} r="4" fill="#dc2626" />
                        <text x={x} y={yNo - 8} fontSize="9" fontWeight="bold" fill="#dc2626" textAnchor="middle">{pt.co2WithoutFilter}%</text>

                        <circle cx={x} cy={yYes} r="4" fill="#0284c7" />
                        <text x={x} y={yYes - 8} fontSize="9" fontWeight="bold" fill="#0284c7" textAnchor="middle">{pt.co2WithFilter}%</text>

                        <text x={x} y="156" fontSize="9" fill="#64748b" textAnchor="middle">{pt.timeLabel}</text>
                      </g>
                    );
                  })}
                </svg>
              </div>

              <div className="mt-3 flex items-center justify-center gap-5 text-[11px] font-semibold">
                <span className="inline-flex items-center gap-1.5 text-cyan-700">
                  <span className="w-2.5 h-2.5 rounded-full bg-cyan-600" />
                  CO₂ (%) Dengan Filter
                </span>
                <span className="inline-flex items-center gap-1.5 text-rose-600">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-600" />
                  CO₂ (%) Tanpa Filter
                </span>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200/80 text-[12.5px] text-emerald-900 flex items-start gap-3">
            <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
            <p>
              <strong>Uji Statistik Wilcoxon Signed-Rank (p &lt; 0.05):</strong> Membuktikan penurunan kadar CO dan CO₂ yang signifikan setelah gas melewati filter. Pada menit ke-45 hingga 60, kadar CO dengan filter hanya <strong>28 ppm</strong> (vs 45 ppm tanpa filter) dan CO₂ hanya <strong>3,0%</strong> (vs 4,2%). Kestabilan laju alir (2,5–2,9 L/min) dan suhu gas (40–48°C) memastikan filtrasi tidak mengganggu kinerja tungku pembakaran.
            </p>
          </div>
        </div>
      )}

      {/* Tab 3: Real-Time High-Speed Waveform Stream */}
      {activeTab === 'live_stream' && (
        <div className="space-y-4 anim-rise">
          <div className="p-5 rounded-2xl bg-slate-900 text-white border border-slate-800">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span className="font-mono text-[12px] font-bold text-slate-200">
                  OSILOSKOP TRANSIEN TELEMETRI CYPHER (STREAM REAL-TIME)
                </span>
              </div>
              <div className="flex items-center gap-4 text-[11px] font-mono">
                <span className="text-cyan-400">● Daya TEG ({powerUnit})</span>
                <span className="text-amber-400">● CO Gas (ppm)</span>
                <span className="text-emerald-400">● CO₂ (%)</span>
              </div>
            </div>

            <div className="h-[220px] w-full relative bg-slate-950/60 rounded-xl p-3 border border-slate-800 flex items-end">
              <svg className="w-full h-full overflow-visible" viewBox="0 0 500 180" preserveAspectRatio="none">
                <line x1="0" y1="30" x2="500" y2="30" stroke="rgba(255,255,255,0.06)" strokeDasharray="4 4" />
                <line x1="0" y1="90" x2="500" y2="90" stroke="rgba(255,255,255,0.06)" strokeDasharray="4 4" />
                <line x1="0" y1="150" x2="500" y2="150" stroke="rgba(255,255,255,0.06)" strokeDasharray="4 4" />

                {/* Power Path (Cyan) */}
                <path
                  d={`M ${powerWaveform
                    .map((val, idx) => {
                      const x = (idx / (powerWaveform.length - 1)) * 500;
                      const y = 140 - (val / (powerUnit === 'kW' ? 600 : 6.0)) * 100;
                      return `${x},${y}`;
                    })
                    .join(' L ')}`}
                  fill="none"
                  stroke="#06b6d4"
                  strokeWidth="3"
                  strokeLinecap="round"
                />

                {/* CO Path (Amber) */}
                <path
                  d={`M ${coWaveform
                    .map((val, idx) => {
                      const x = (idx / (coWaveform.length - 1)) * 500;
                      const y = 160 - (val / 60) * 120;
                      return `${x},${y}`;
                    })
                    .join(' L ')}`}
                  fill="none"
                  stroke="#f59e0b"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
              </svg>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
