/**
 * CYPHER Experimental & Industrial Data Store
 * Sourced directly from:
 * "CYPHER: Integrasi Sistem Kendali Emisi Cerdas Berbasis Internet of Things untuk Hilirisasi dan Dekarbonisasi Menuju Net Zero Emissions Indonesia 2060"
 * Tim Universitas Gadjah Mada (UGM), 2026.
 */

import { ExperimentalTimePoint, SmelterUnitInfo } from './cypherTypes';

export const SMELTER_UNITS: SmelterUnitInfo[] = [
  {
    id: 'morowali-01',
    name: 'PT IMIP Morowali — RKEF Unit 01',
    location: 'Bahodopi, Morowali, Sulawesi Tengah',
    type: 'Rotary Kiln Electric Furnace (RKEF) 45 MVA',
    capacity: '36.000 Ton Ni/Tahun',
    isLabPrototype: false,
    nominalFlueTemp: 580,
    nominalFlowRate: 1200,
    flowUnit: 'm³/jam',
    nominalPower: 450,
    powerUnit: 'kW',
  },
  {
    id: 'prototype-lab',
    name: 'Purwarupa Uji Laboratorium UGM (TEC1-12706)',
    location: 'Laboratorium Rekayasa Energi & Lingkungan UGM, Yogyakarta',
    type: 'Modul Termoelektrik TEC1-12706 + Filter Kering + ENS160/AHT21',
    capacity: 'Bench-Scale Flue Gas Simulator (2.5 - 2.9 L/min)',
    isLabPrototype: true,
    nominalFlueTemp: 48,
    nominalFlowRate: 2.7,
    flowUnit: 'L/min',
    nominalPower: 3.8,
    powerUnit: 'W',
  },
  {
    id: 'weda-02',
    name: 'Weda Bay Industrial Park — Smelter Unit 02',
    location: 'Halmahera Tengah, Maluku Utara',
    type: 'High-Pressure Acid Leach (HPAL) & Ferronickel Smelter',
    capacity: '42.000 Ton Ni/Tahun',
    isLabPrototype: false,
    nominalFlueTemp: 610,
    nominalFlowRate: 1450,
    flowUnit: 'm³/jam',
    nominalPower: 520,
    powerUnit: 'kW',
  },
  {
    id: 'sorowako-01',
    name: 'PT Vale Sorowako — Furnace Line 01',
    location: 'Luwu Timur, Sulawesi Selatan',
    type: 'Nickel Matte Reduction Furnace',
    capacity: '72.000 Ton Ni/Tahun',
    isLabPrototype: false,
    nominalFlueTemp: 550,
    nominalFlowRate: 1100,
    flowUnit: 'm³/jam',
    nominalPower: 420,
    powerUnit: 'kW',
  },
  {
    id: 'konawe-01',
    name: 'VDNI Konawe Industrial Hub — Line 03',
    location: 'Konawe, Sulawesi Tenggara',
    type: 'Rotary Kiln Nickel Pig Iron Smelter',
    capacity: '28.000 Ton Ni/Tahun',
    isLabPrototype: false,
    nominalFlueTemp: 570,
    nominalFlowRate: 1180,
    flowUnit: 'm³/jam',
    nominalPower: 435,
    powerUnit: 'kW',
  },
];

/**
 * Data Hasil Uji Nyata Prototipe CYPHER per 15 Menit
 * (Gambar 1 & Gambar 2 dari Esai UGM 2026)
 */
export const EXPERIMENTAL_SERIES: ExperimentalTimePoint[] = [
  {
    timeLabel: '0–15 mnt',
    tHotAvg: 33.2,
    tColdAvg: 26.2,
    deltaTAvg: 7.0,
    vAvg: 2.2,
    pAvg: 3.6,
    coWithFilter: 20,
    coWithoutFilter: 35,
    co2WithFilter: 2.5,
    co2WithoutFilter: 3.5,
    gasTempWithFilter: 40,
    gasTempWithoutFilter: 40,
    flowWithFilter: 2.5,
    flowWithoutFilter: 2.5,
    o2WithFilter: 20.8,
    o2WithoutFilter: 20.8,
  },
  {
    timeLabel: '15–30 mnt',
    tHotAvg: 34.6,
    tColdAvg: 26.4,
    deltaTAvg: 8.2,
    vAvg: 2.5,
    pAvg: 4.4,
    coWithFilter: 22,
    coWithoutFilter: 38,
    co2WithFilter: 2.6,
    co2WithoutFilter: 3.7,
    gasTempWithFilter: 42,
    gasTempWithoutFilter: 42,
    flowWithFilter: 2.6,
    flowWithoutFilter: 2.6,
    o2WithFilter: 20.8,
    o2WithoutFilter: 20.6,
  },
  {
    timeLabel: '30–45 mnt',
    tHotAvg: 33.1,
    tColdAvg: 26.6,
    deltaTAvg: 6.5,
    vAvg: 2.0,
    pAvg: 3.2,
    coWithFilter: 25,
    coWithoutFilter: 42,
    co2WithFilter: 2.8,
    co2WithoutFilter: 4.0,
    gasTempWithFilter: 45,
    gasTempWithoutFilter: 45,
    flowWithFilter: 2.7,
    flowWithoutFilter: 2.7,
    o2WithFilter: 20.6,
    o2WithoutFilter: 20.4,
  },
  {
    timeLabel: '45–60 mnt',
    tHotAvg: 34.0,
    tColdAvg: 26.8,
    deltaTAvg: 7.2,
    vAvg: 2.3,
    pAvg: 3.8,
    coWithFilter: 28,
    coWithoutFilter: 45,
    co2WithFilter: 3.0,
    co2WithoutFilter: 4.2,
    gasTempWithFilter: 48,
    gasTempWithoutFilter: 48,
    flowWithFilter: 2.9,
    flowWithoutFilter: 2.9,
    o2WithFilter: 20.4,
    o2WithoutFilter: 20.2,
  },
];

/**
 * Parameter Regresi Linear TEG Seebeck:
 * P (Watt) = 0.52 * ΔT + 0.08 (R² = 0.94)
 */
export function calculatePredictedPower(deltaT: number, isLab: boolean = true): number {
  if (isLab) {
    // Model empiris prototipe: P = 0.52 * ΔT + 0.08
    return Math.max(0, 0.52 * deltaT + 0.08);
  }
  // Model industri tereskalasi (matriks paralel TEG + ORC):
  // Flue gas industri ΔT berkisar 200°C - 400°C -> Daya ratusan kW
  const baseSeebeckAlpha = 220e-6; // V/K
  const numCouples = 5200;
  const internalResistance = 0.35;
  const voltage = numCouples * baseSeebeckAlpha * deltaT;
  const powerKw = Math.pow(voltage, 2) / (4 * internalResistance * 1000);
  return Math.max(0, powerKw);
}

/**
 * Standard Regulasi Lingkungan Terkait
 */
export const COMPLIANCE_THRESHOLDS = {
  so2MaxIndustrial: 300,   // mg/Nm³ (Permen LHK No. 15/2019)
  so2MaxAmbient: 150,      // µg/m³ (Baku Mutu Udara Ambien Nasional)
  coMaxPpm: 50,            // ppm
  co2MaxPercent: 4.5,      // %
  pm25MaxOccupational: 55, // µg/m³ (Permenkes No. 2/2023)
  opacityMaxPercent: 20,   // %
  o2MinPercent: 20.0,      // %
};

export const DEFAULT_COPILOT_PROMPTS = [
  'Bagaimana hubungan gradien suhu (ΔT) dengan daya listrik yang dihasilkan modul TEG TEC1-12706 sesuai formula P = 0.52 ΔT + 0.08?',
  'Mengapa modul filter cerdas CYPHER mampu menurunkan CO hingga 28 ppm dan CO₂ hingga 3.0% tanpa mengganggu laju alir gas buang?',
  'Bagaimana integrasi sensor ENS160 dan AHT21 melalui mikrokontroler Arduino Nano dan ESP32 membentuk sistem kendali adaptif loop tertutup?',
  'Bagaimana kontribusi penerapan CYPHER di seluruh smelter nikel terhadap target Peta Jalan Dekarbonisasi Nasional 81% pada 2045?',
];
