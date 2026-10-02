import React from 'react';
import { Cpu, Download, Factory, FlaskConical, Hand, Home } from 'lucide-react';
import { CypherMark } from '../brand/CypherMark';
import { SmelterUnitId, ControlMode, ScadaSystemState } from '../../engine/cypherTypes';
import { SMELTER_UNITS } from '../../engine/cypherData';
import { useSound } from '../../utils/SoundProvider';
import { Dropdown } from '../ui/Dropdown';

const UNIT_OPTIONS = SMELTER_UNITS.map(unit => ({
  value: unit.id,
  label: unit.name,
  description: unit.location,
  icon: unit.isLabPrototype ? FlaskConical : Factory,
}));

const CONTROL_MODE_OPTIONS = [
  { value: 'AUTO_CLOSED_LOOP', label: 'Otomatis', icon: Cpu },
  { value: 'MANUAL_OVERRIDE', label: 'Manual', icon: Hand },
  { value: 'EXPERIMENTAL_BENCH', label: 'Uji lab', icon: FlaskConical },
] as const;

interface Props {
  state: ScadaSystemState;
  onSelectUnit: (id: SmelterUnitId) => void;
  onSetControlMode: (mode: ControlMode) => void;
  onHome?: () => void;
  onExportReport?: () => void;
}

export const ScadaHeader: React.FC<Props> = ({
  state,
  onSelectUnit,
  onSetControlMode,
  onHome,
  onExportReport,
}) => {
  const { playClick } = useSound();

  return (
    <header className="scada-panel rounded-[28px] p-4 md:px-6 md:py-4 text-hi">
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-3 mr-auto">
          {onHome && (
            <button
              type="button"
              onClick={() => { playClick(); onHome(); }}
              aria-label="Kembali ke beranda"
              className="liquid-control w-11 h-11 rounded-2xl flex items-center justify-center cursor-pointer"
            >
              <Home className="w-4 h-4" />
            </button>
          )}
          <CypherMark className="w-8 h-8" />
          <div>
            <div className="font-display text-[17px] font-bold tracking-[0.1em] text-core-700">NEXUS</div>
            <div className="text-[11px] text-mid">Ruang kendali emisi</div>
          </div>
          <span className="rounded-full bg-amber-50/90 border border-amber-200 px-2.5 py-1 text-[11px] font-semibold text-amber-800">Simulasi</span>
        </div>

        <div className="grid grid-cols-2 xl:grid-cols-[minmax(240px,280px)_minmax(130px,1fr)_auto] items-end gap-3 w-full xl:w-auto">
          <Dropdown<SmelterUnitId>
            id="monitored-unit"
            label="Unit dipantau"
            value={state.unitId}
            onChange={(id) => { playClick(); onSelectUnit(id); }}
            options={UNIT_OPTIONS}
            minMenuWidth={360}
            className="col-span-2 xl:col-span-1"
          />

          <Dropdown<ControlMode>
            id="control-mode"
            label="Mode kendali"
            value={state.controlMode}
            onChange={(mode) => { playClick(); onSetControlMode(mode); }}
            options={CONTROL_MODE_OPTIONS}
            minMenuWidth={180}
            showSelectedIcon={false}
          />

          {onExportReport && (
            <button
              type="button"
              onClick={() => { playClick(); onExportReport(); }}
              className="primary-action h-11 px-3 md:px-4 rounded-xl text-[13px] font-semibold flex items-center justify-center gap-2 cursor-pointer whitespace-nowrap"
            >
              <Download className="w-4 h-4" /> Unduh CSV
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
