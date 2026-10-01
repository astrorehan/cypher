import React from 'react';
import { ArrowRight, ShieldCheck, AlertTriangle } from 'lucide-react';
import { ScadaSystemState } from '../../engine/cypherTypes';

interface Props {
  state: ScadaSystemState;
  onShowForecast: () => void;
  onEnableFilter: () => void;
}

export const DashboardSummary: React.FC<Props> = ({ state, onShowForecast, onEnableFilter }) => {
  const filterActive = state.filter.active;
  const readings = [
    { label: 'CO', name: 'Karbon monoksida', value: state.cems.co, unit: 'ppm' },
    { label: 'CO₂', name: 'Karbon dioksida', value: state.cems.co2, unit: '%' },
    { label: 'SO₂', name: 'Sulfur dioksida', value: state.cems.so2, unit: 'mg/Nm³' },
    { label: 'PM2.5', name: 'Partikulat halus', value: state.cems.pm25, unit: 'µg/m³' },
  ];

  return (
    <section className="space-y-4" aria-label="Ikhtisar emisi">
      <div className={`rounded-3xl p-6 md:p-8 text-white shadow-sm ${filterActive ? 'bg-slate-900' : 'bg-amber-900'}`}>
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.14em] font-bold text-cyan-200 mb-3">
              {filterActive ? <ShieldCheck className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
              Status pengendalian emisi · Simulasi
            </div>
            <h1 className="page-title text-[23px] md:text-[29px]">
              {filterActive ? 'Filter aktif, emisi sedang dipantau' : 'Bypass aktif, emisi tanpa filtrasi'}
            </h1>
            <p className="text-[12px] md:text-[13px] text-slate-200 mt-2 leading-relaxed">
              {filterActive
                ? 'Lihat konsentrasi gas buang di bawah, lalu buka proyeksi 24–48 jam untuk mencoba skenario perubahan emisi.'
                : 'Aktifkan kembali filter untuk melihat dampaknya pada pembacaan emisi. Proyeksi mengikuti kondisi unit yang dipilih.'}
            </p>
          </div>
          <div className="flex flex-wrap lg:flex-col gap-2 shrink-0">
            {!filterActive && (
              <button
                type="button"
                onClick={onEnableFilter}
                className="rounded-xl bg-white px-4 py-2.5 text-[12px] font-bold text-amber-900 hover:bg-amber-50 transition-colors cursor-pointer"
              >
                Aktifkan filter
              </button>
            )}
            <button
              type="button"
              onClick={onShowForecast}
              className={`rounded-xl px-4 py-2.5 text-[12px] font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer ${filterActive ? 'bg-cyan-400 hover:bg-cyan-300 text-slate-950' : 'bg-amber-300 hover:bg-amber-200 text-amber-950'}`}
            >
              Lihat proyeksi 24–48 jam <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <div>
        <div className="flex flex-wrap items-baseline justify-between gap-2 mb-3 px-1">
          <h2 className="section-title text-[17px] text-hi">Pembacaan emisi cerobong</h2>
          <span className="text-[10px] text-mid">Data simulasi · diperbarui setiap 2 detik</span>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {readings.map((reading) => (
            <div key={reading.label} className="rounded-2xl surface-card p-3.5 md:p-4">
              <div className="text-[11px] font-bold text-mid">{reading.label}</div>
              <div className="mt-3 flex flex-wrap items-baseline gap-1.5">
                <span className="font-display text-[25px] md:text-[29px] font-extrabold text-hi leading-none">{reading.value}</span>
                <span className="text-[10px] font-semibold text-mid">{reading.unit}</span>
              </div>
              <div className="mt-3 text-[10px] text-lo">{reading.name}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-2xl surface-card px-5 py-3 flex flex-wrap items-center gap-x-6 gap-y-2 text-[11px] text-mid">
        <span><strong className="text-hi">Filter:</strong> {filterActive ? 'Aktif' : 'Bypass'}</span>
        <span><strong className="text-hi">Energi dipanen:</strong> {state.teg.power} {state.teg.powerUnit}</span>
        <span><strong className="text-hi">Aliran gas:</strong> {state.cems.gasFlow} {state.unitId === 'prototype-lab' ? 'L/min' : 'm³/jam'}</span>
      </div>
    </section>
  );
};
