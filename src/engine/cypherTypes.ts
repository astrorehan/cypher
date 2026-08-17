/**
 * CYPHER: Carbon-neutral Yield Predictive Hybrid Emission Regulator
 * Industrial SCADA & IoT CEMS Engine — Type Definitions
 * Universitas Gadjah Mada (UGM), 2026
 */

export type SiteView = 'landing' | 'simulasi' | 'nasional' | 'metodologi' | 'profil' | 'tentang';

export type SmelterUnitId =
  | 'morowali-01'
  | 'weda-02'
  | 'sorowako-01'
  | 'konawe-01'
  | 'prototype-lab';

export type ControlMode = 'AUTO_CLOSED_LOOP' | 'MANUAL_OVERRIDE' | 'EXPERIMENTAL_BENCH';

export interface SmelterUnitInfo {
  id: SmelterUnitId;
  name: string;
  location: string;
  type: string;
  capacity: string;
  isLabPrototype: boolean;
  nominalFlueTemp: number; // °C
  nominalFlowRate: number; // L/min (lab) or m3/h (industrial)
  flowUnit: string;
  nominalPower: number; // W (lab) or kW (industrial)
  powerUnit: 'W' | 'kW';
}

export interface TegTelemetry {
  tempHot: number;       // °C (T-hot)
  tempCold: number;      // °C (T-cold)
  deltaT: number;        // °C (ΔT = T-hot - T-cold)
  voltage: number;       // V (Tegangan listrik)
  current: number;       // A (Arus listrik)
  power: number;         // W or kW (Daya terkonversi)
  powerUnit: 'W' | 'kW';
  efficiency: number;    // %
  coolantFlow: number;   // L/min
  predictedPower: number;// W or kW based on regression P = 0.52*ΔT + 0.08
  moduleType: string;    // e.g. "TEC1-12706 Array" or "High-Temp Bi2Te3 Matrix"
}

export interface CemsTelemetry {
  so2: number;           // mg/Nm³ or ppm
  co: number;            // ppm
  co2: number;           // %
  pm25: number;          // µg/m³
  pm10: number;          // µg/m³
  nox: number;           // mg/Nm³
  o2: number;            // % (Kadar Oksigen stabil)
  gasTemp: number;       // °C
  gasFlow: number;       // L/min or m³/h
  opacity: number;       // %
  sensorStatus: 'OPTIMAL' | 'CALIBRATING' | 'DRIFT_WARNING';
  hardwarePipeline: string; // "ENS160 + AHT21 -> Arduino Nano -> ESP32"
}

export interface FilterTelemetry {
  active: boolean;       // Filter terpasang vs bypass
  chamberStatus: 'READY' | 'FILTERING' | 'PURGING_BACKWASH' | 'BYPASSED';
  coReductionPercent: number; // e.g. 37.8% (45 ppm -> 28 ppm)
  co2ReductionPercent: number; // e.g. 28.5% (4.2% -> 3.0%)
  differentialPressure: number; // kPa
  cakeThicknessMm: number;
  lastBackwashTimestamp?: string;
  wilcoxonSignificance: string; // "p < 0.05 (Signifikan)"
}

export interface ScadaSystemState {
  unitId: SmelterUnitId;
  controlMode: ControlMode;
  teg: TegTelemetry;
  cems: CemsTelemetry;
  filter: FilterTelemetry;
  systemStatus: 'OPTIMAL' | 'ADAPTIVE_ACTIVE' | 'WARNING_EMISSION' | 'BACKWASH_PURGE' | 'EMERGENCY_BYPASS';
  iotBridgeConnected: boolean;
  lastSyncTime: string;
  carbonAvoidedKgPerDay: number;
  complianceScorePercent: number;
}

export interface ExperimentalTimePoint {
  timeLabel: string; // e.g. "0-15", "15-30", "30-45", "45-60"
  tHotAvg: number;
  tColdAvg: number;
  deltaTAvg: number;
  vAvg: number;
  pAvg: number;
  coWithFilter: number;
  coWithoutFilter: number;
  co2WithFilter: number;
  co2WithoutFilter: number;
  gasTempWithFilter: number;
  gasTempWithoutFilter: number;
  flowWithFilter: number;
  flowWithoutFilter: number;
  o2WithFilter: number;
  o2WithoutFilter: number;
}

export interface ScadaEventLog {
  id: string;
  timestamp: string;
  source: 'TEG_HARVESTER' | 'CEMS_IOT' | 'SMART_FILTER' | 'AI_CONTROLLER' | 'OPERATOR';
  level: 'INFO' | 'SUCCESS' | 'WARNING' | 'ALERT';
  message: string;
}

export interface CopilotMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  suggestedAction?: {
    label: string;
    actionType: 'TRIGGER_BACKWASH' | 'SET_COOLANT' | 'TOGGLE_FILTER' | 'APPLY_CALIBRATION';
    payload?: number;
  };
}
