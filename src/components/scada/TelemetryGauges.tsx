import React from 'react';
import {
  Zap,
  Gauge,
  Wind,
  ShieldCheck,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Activity,
  Flame,
  Layers,
  Thermometer,
} from 'lucide-react';
import { ScadaSystemState } from '../../engine/cypherTypes';
import { Meter } from '../ui/primitives';

interface Props {
  state: ScadaSystemState;
}

export const TelemetryGauges: React.FC<Props> = ({ state }) => {
  const isLab = state.unitId === 'prototype-lab';

  return (
    <div className="space-y-4">
      {/* 4 Primary Top KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: TEG Power Output */}
        <div className="p-5 rounded-3xl bg-white border border-black/[.08] shadow-sm relative overflow-hidden group hover:shadow-md transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-lo">
              Daya Pemanenan TEG
            </span>
            <span className="w-8 h-8 rounded-xl bg-cyan-50 text-cyan-600 flex items-center justify-center">
              <Zap className="w-4 h-4" />
            </span>
          </div>

          <div className="flex items-baseline gap-1.5 mb-2">
            <span className="font-display text-[32px] font-extrabold text-hi font-mono tracking-tight">
              {state.teg.power}
            </span>
            <span className="font-bold text-core-600 text-[14px]">{state.teg.powerUnit}</span>
          </div>

          <div className="space-y-1 mb-3">
            <Meter
              value={state.teg.power}
              max={state.teg.powerUnit === 'kW' ? 600 : 6.0}
              tone="#0284c7"
            />
          </div>

          <div className="flex items-center justify-between text-[11px] font-mono pt-2.5 border-t border-black/[.06] text-mid">
            <span>Model Regresi:</span>
            <span className="font-mono text-core-600 font-semibold">
              {state.teg.predictedPower} {state.teg.powerUnit} (R²=0.94)
            </span>
          </div>
        </div>

        {/* Card 2: Thermal Gradient & Voltage */}
        <div className="p-5 rounded-3xl bg-white border border-black/[.08] shadow-sm relative overflow-hidden group hover:shadow-md transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-lo">
              Gradien Termal (ΔT)
            </span>
            <span className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Thermometer className="w-4 h-4" />
            </span>
          </div>

          <div className="flex items-baseline gap-1.5 mb-2">
            <span className="font-display text-[32px] font-extrabold text-hi font-mono tracking-tight">
              {state.teg.deltaT}
            </span>
            <span className="font-bold text-blue-600 text-[14px]">°C</span>
          </div>

          <div className="space-y-1 mb-3">
            <Meter
              value={state.teg.deltaT}
              max={isLab ? 12 : 500}
              tone="#2563eb"
            />
          </div>

          <div className="flex items-center justify-between text-[11px] font-mono pt-2.5 border-t border-black/[.06] text-mid">
            <span>Tegangan Terkonversi:</span>
            <span className="font-mono text-blue-700 font-semibold">{state.teg.voltage} V DC</span>
          </div>
        </div>

        {/* Card 3: CEMS CO & CO2 Concentration */}
        <div
          className={`p-5 rounded-3xl bg-white border shadow-sm relative overflow-hidden transition-all ${
            !state.filter.active
              ? 'border-amber-300 bg-amber-50/30'
              : 'border-black/[.08] hover:shadow-md'
          }`}
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-lo">
              Emisi Karbon (CO / CO₂)
            </span>
            <span
              className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                !state.filter.active
                  ? 'bg-amber-100 text-amber-600'
                  : 'bg-emerald-50 text-emerald-600'
              }`}
            >
              <Wind className="w-4 h-4" />
            </span>
          </div>

          <div className="flex items-baseline gap-2 mb-2">
            <span className="font-display text-[24px] font-extrabold font-mono text-hi">
              {state.cems.co} <span className="text-[12px] font-normal text-lo">ppm</span>
            </span>
            <span className="text-slate-300">|</span>
            <span className="font-display text-[24px] font-extrabold font-mono text-hi">
              {state.cems.co2} <span className="text-[12px] font-normal text-lo">%</span>
            </span>
          </div>

          <div className="space-y-1 mb-3">
            <Meter
              value={state.cems.co}
              max={60}
              tone={state.filter.active ? '#10b981' : '#f59e0b'}
              danger={!state.filter.active}
            />
          </div>

          <div className="flex items-center justify-between text-[11px] font-mono pt-2.5 border-t border-black/[.06] text-mid">
            <span>Reduksi Filter:</span>
            <span
              className={`font-mono font-bold ${
                state.filter.active ? 'text-emerald-700' : 'text-amber-700'
              }`}
            >
              {state.filter.active ? 'CO -15 ppm | CO₂ -1.0%' : 'Bypass Tanpa Filter'}
            </span>
          </div>
        </div>

        {/* Card 4: O2 Stability & Gas Flow Integrity */}
        <div className="p-5 rounded-3xl bg-white border border-black/[.08] shadow-sm relative overflow-hidden group hover:shadow-md transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-lo">
              Kestabilan O₂ &amp; Aliran Gas
            </span>
            <span className="w-8 h-8 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
            </span>
          </div>

          <div className="flex items-baseline gap-1.5 mb-2">
            <span className="font-display text-[32px] font-extrabold text-hi font-mono tracking-tight">
              {state.cems.o2}
            </span>
            <span className="font-bold text-teal-600 text-[14px]">% O₂</span>
          </div>

          <div className="space-y-1 mb-3">
            <Meter value={state.cems.o2} max={25} tone="#0d9488" />
          </div>

          <div className="flex items-center justify-between text-[11px] font-mono pt-2.5 border-t border-black/[.06] text-mid">
            <span>Laju Alir Terjaga:</span>
            <span className="font-mono text-teal-700 font-semibold">
              {state.cems.gasFlow} {isLab ? 'L/min' : 'm³/h'}
            </span>
          </div>
        </div>
      </div>

      {/* Dual Detailed Telemetry Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Left: TEG Thermoelectric Subsystem Details */}
        <div className="p-6 rounded-3xl bg-white border border-black/[.08] shadow-sm">
          <div className="flex items-center justify-between pb-3.5 border-b border-black/[.08] mb-4">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-cyan-500" />
              <h3 className="font-bold text-[15px] text-hi">
                ⚡ Parameter Termoelektrik (TEG Harvester)
              </h3>
            </div>
            <span className="font-mono text-[11px] px-2.5 py-0.5 rounded-full bg-cyan-50 text-cyan-700 font-semibold border border-cyan-200">
              {state.teg.moduleType}
            </span>
          </div>

          <div className="space-y-3 text-[13px]">
            <div className="flex items-center justify-between py-2 border-b border-black/[.04]">
              <span className="text-mid">Suhu Sisi Panas Flue Gas (T-hot)</span>
              <span className="font-mono font-bold text-amber-700">{state.teg.tempHot} °C</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-black/[.04]">
              <span className="text-mid">Suhu Sisi Dingin Pendingin (T-cold)</span>
              <span className="font-mono font-bold text-core-700">{state.teg.tempCold} °C</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-black/[.04]">
              <span className="text-mid">Beda Suhu Efektif (ΔT)</span>
              <span className="font-mono font-bold text-core-600">{state.teg.deltaT} °C</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-black/[.04]">
              <span className="text-mid">Arus Beban Listrik (I)</span>
              <span className="font-mono font-bold text-hi">{state.teg.current} A</span>
            </div>
            <div className="flex items-center justify-between py-2">
              <span className="text-mid">Efisiensi Konversi Termal</span>
              <span className="font-mono font-bold text-emerald-600">
                {state.teg.efficiency}% (Optimal Seebeck)
              </span>
            </div>
          </div>
        </div>

        {/* Right: CEMS IoT Sensor Suite Details */}
        <div className="p-6 rounded-3xl bg-white border border-black/[.08] shadow-sm">
          <div className="flex items-center justify-between pb-3.5 border-b border-black/[.08] mb-4">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-emerald-500" />
              <h3 className="font-bold text-[15px] text-hi">
                🌱 Sensor CEMS IoT &amp; Kualitas Udara Cerobong
              </h3>
            </div>
            <span className="font-mono text-[11px] px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-semibold border border-emerald-200">
              ENS160 + AHT21 Suite
            </span>
          </div>

          <div className="space-y-3 text-[13px]">
            <div className="flex items-center justify-between py-2 border-b border-black/[.04]">
              <span className="text-mid">Sulfur Dioksida (SO₂) Cerobong</span>
              <span className="font-mono font-bold text-hi">
                {state.cems.so2} mg/Nm³ (Baku &lt; 300)
              </span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-black/[.04]">
              <span className="text-mid">Partikulat Halus (PM2.5)</span>
              <span className="font-mono font-bold text-emerald-600">
                {state.cems.pm25} µg/m³ (Baku &lt; 55)
              </span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-black/[.04]">
              <span className="text-mid">Temperatur Gas Lewat Filter</span>
              <span className="font-mono font-bold text-hi">{state.cems.gasTemp} °C (Stabil 40–48°C)</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-black/[.04]">
              <span className="text-mid">Opasitas Cerobong Gas Buang</span>
              <span className="font-mono font-bold text-emerald-600">
                {state.cems.opacity}% (Batas &lt; 20%)
              </span>
            </div>
            <div className="flex items-center justify-between py-2">
              <span className="text-mid">Pipeline Komunikasi IoT</span>
              <span className="font-mono text-[11.5px] font-bold text-indigo-600 truncate max-w-[260px]">
                {state.cems.hardwarePipeline}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
