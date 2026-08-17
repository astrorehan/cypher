import { useState, useEffect, useCallback, useRef } from 'react';
import {
  SmelterUnitId,
  ControlMode,
  ScadaSystemState,
  TegTelemetry,
  CemsTelemetry,
  FilterTelemetry,
  ScadaEventLog,
  CopilotMessage,
} from './cypherTypes';
import {
  SMELTER_UNITS,
  EXPERIMENTAL_SERIES,
  calculatePredictedPower,
} from './cypherData';
import { useSound } from '../utils/SoundProvider';

export function useCypher() {
  const { playClick, playBackwash, playAlarm } = useSound();

  const [unitId, setUnitId] = useState<SmelterUnitId>('morowali-01');
  const [controlMode, setControlMode] = useState<ControlMode>('AUTO_CLOSED_LOOP');
  const [filterActive, setFilterActive] = useState<boolean>(true);
  const [backwashActive, setBackwashActive] = useState<boolean>(false);
  const [coolantRate, setCoolantRate] = useState<number>(50); // L/min or %
  const [flueHeatOffset, setFlueHeatOffset] = useState<number>(0); // manual thermal tweak

  // Active unit metadata
  const currentUnit = SMELTER_UNITS.find((u) => u.id === unitId) || SMELTER_UNITS[0];
  const isLab = currentUnit.isLabPrototype;

  // Real-time Event Logs
  const [logs, setLogs] = useState<ScadaEventLog[]>([
    {
      id: 'log-1',
      timestamp: new Date().toLocaleTimeString('id-ID'),
      source: 'CEMS_IOT',
      level: 'SUCCESS',
      message: 'Node IoT ESP32 & sensor ENS160/AHT21 tersinkronisasi via protokol MQTT/WebSockets.',
    },
    {
      id: 'log-2',
      timestamp: new Date().toLocaleTimeString('id-ID'),
      source: 'TEG_HARVESTER',
      level: 'INFO',
      message: 'Sirkuit pemanen termoelektrik Seebeck beroperasi normal pada status loop tertutup adaptif.',
    },
  ]);

  const addLog = useCallback((source: ScadaEventLog['source'], level: ScadaEventLog['level'], message: string) => {
    const newLog: ScadaEventLog = {
      id: `log-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      timestamp: new Date().toLocaleTimeString('id-ID'),
      source,
      level,
      message,
    };
    setLogs((prev) => [newLog, ...prev.slice(0, 40)]);
  }, []);

  // Copilot messages
  const [copilotMessages, setCopilotMessages] = useState<CopilotMessage[]>([
    {
      id: 'c-welcome',
      role: 'assistant',
      content: `**Selamat datang di Sistem Ruang Kendali CYPHER.**\n\nSistem mengintegrasikan 3 modul inti:\n1. **TEG Waste Heat Harvester** (Konversi Seebeck $P = 0.52\\Delta T + 0.08$)\n2. **Advanced Dry Filtration** (Reduksi CO hingga 28 ppm dan $\\text{CO}_2$ hingga 3.0%)\n3. **CEMS IoT Closed-Loop Controller** (Sensor ENS160 & AHT21 $\\rightarrow$ Arduino Nano $\\rightarrow$ ESP32).\n\nSilakan ajukan analisis operasional, lakukan pengujian filtrasi, atau picu modul pemulihan.`,
      timestamp: new Date().toLocaleTimeString('id-ID'),
    },
  ]);

  // Real-time calculated telemetry
  const [telemetry, setTelemetry] = useState<ScadaSystemState>(() => {
    return generateTelemetry(currentUnit.id, filterActive, backwashActive, coolantRate, flueHeatOffset, controlMode);
  });

  // Oscilloscope waveform buffers
  const [powerWaveform, setPowerWaveform] = useState<number[]>([3.4, 3.6, 3.8, 4.1, 4.3, 4.4]);
  const [coWaveform, setCoWaveform] = useState<number[]>([22, 24, 25, 24, 26, 28]);
  const [co2Waveform, setCo2Waveform] = useState<number[]>([2.5, 2.6, 2.7, 2.8, 2.9, 3.0]);

  // Update telemetry continuously
  useEffect(() => {
    const interval = setInterval(() => {
      const updated = generateTelemetry(
        unitId,
        filterActive,
        backwashActive,
        coolantRate,
        flueHeatOffset,
        controlMode
      );
      setTelemetry(updated);

      setPowerWaveform((prev) => [...prev.slice(1), updated.teg.power]);
      setCoWaveform((prev) => [...prev.slice(1), updated.cems.co]);
      setCo2Waveform((prev) => [...prev.slice(1), updated.cems.co2]);
    }, 2000);

    return () => clearInterval(interval);
  }, [unitId, filterActive, backwashActive, coolantRate, flueHeatOffset, controlMode]);

  // Actuator: Trigger Force Backwash
  const triggerBackwash = useCallback(() => {
    playBackwash();
    setBackwashActive(true);
    addLog('SMART_FILTER', 'WARNING', 'Memicu Pulse-Jet Backwash 6 bar pada chamber filtrasi.');

    setTimeout(() => {
      setBackwashActive(false);
      addLog('SMART_FILTER', 'SUCCESS', 'Force Backwash selesai. Cake debu rontok, permeabilitas membran 100% pulih.');
    }, 3200);
  }, [playBackwash, addLog]);

  // Actuator: Toggle Filter vs Bypass
  const toggleFilter = useCallback(() => {
    playClick();
    const nextState = !filterActive;
    setFilterActive(nextState);

    if (nextState) {
      addLog('SMART_FILTER', 'SUCCESS', 'Modul Filtrasi Cerdas CYPHER diaktifkan. Penangkapan CO & CO2 berjalan simultan.');
    } else {
      playAlarm();
      addLog('SMART_FILTER', 'ALERT', 'PERINGATAN: Filter dibypass! Gas buang mentah mengalir langsung ke cerobong.');
    }
  }, [filterActive, playClick, playAlarm, addLog]);

  // Actuator: Calibrate CEMS
  const calibrateSensors = useCallback(() => {
    playClick();
    addLog('CEMS_IOT', 'INFO', 'Memulai kalibrasi nol & rentang (Zero/Span Calibration) sensor ENS160 & AHT21...');
    setTimeout(() => {
      addLog('CEMS_IOT', 'SUCCESS', 'Kalibrasi optik & elektrokimia selesai. Offset = 0.00 ppm, Drift = 0.01%.');
    }, 1800);
  }, [playClick, addLog]);

  // Send Copilot Message
  const sendCopilotQuery = useCallback((text: string) => {
    if (!text.trim()) return;
    playClick();

    const userMsg: CopilotMessage = {
      id: `u-${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString('id-ID'),
    };

    setCopilotMessages((prev) => [...prev, userMsg]);

    // Generate intelligent engineering response
    setTimeout(() => {
      const answer = generateCopilotAnswer(text, telemetry);
      setCopilotMessages((prev) => [...prev, answer]);
    }, 600);
  }, [telemetry, playClick]);

  return {
    unitId,
    setUnitId: (id: SmelterUnitId) => {
      playClick();
      setUnitId(id);
      addLog('OPERATOR', 'INFO', `Beralih ke unit target: ${SMELTER_UNITS.find((u) => u.id === id)?.name}`);
    },
    currentUnit,
    isLab,
    controlMode,
    setControlMode: (mode: ControlMode) => {
      playClick();
      setControlMode(mode);
      addLog('AI_CONTROLLER', 'INFO', `Mode kendali diubah menjadi: ${mode}`);
    },
    filterActive,
    toggleFilter,
    backwashActive,
    triggerBackwash,
    coolantRate,
    setCoolantRate,
    flueHeatOffset,
    setFlueHeatOffset,
    calibrateSensors,
    telemetry,
    powerWaveform,
    coWaveform,
    co2Waveform,
    logs,
    addLog,
    copilotMessages,
    sendCopilotQuery,
  };
}

/**
 * Pure Telemetry Generator adhering to the research paper equations & findings
 */
function generateTelemetry(
  unitId: SmelterUnitId,
  filterActive: boolean,
  backwashActive: boolean,
  coolantRate: number,
  flueHeatOffset: number,
  controlMode: ControlMode
): ScadaSystemState {
  const isLab = unitId === 'prototype-lab';
  const noise = (Math.random() - 0.5) * 0.08;

  if (isLab) {
    // Lab Prototype TEC1-12706 (From Experimental Paper Data)
    const baseTHot = 34.0 + flueHeatOffset * 0.1 + noise * 1.5;
    const baseTCold = 26.5 - (coolantRate - 50) * 0.02 + noise * 0.5;
    const deltaT = Math.max(0.5, baseTHot - baseTCold);
    const predictedP = calculatePredictedPower(deltaT, true); // P = 0.52 * ΔT + 0.08
    const actualP = Math.max(0, predictedP + noise * 0.2);
    const voltage = 2.0 + (deltaT / 8.0) * 0.5 + noise * 0.1;
    const current = actualP / Math.max(0.1, voltage);

    // Filter vs No-Filter CEMS Metrics (Direct from Gambar 2 & Table in Paper)
    const co = filterActive ? 24 + noise * 3 : 42 + noise * 4; // ~28 with filter vs 45 without
    const co2 = filterActive ? 2.8 + noise * 0.2 : 4.1 + noise * 0.2; // ~3.0% with filter vs 4.2% without
    const o2 = 20.6 + noise * 0.2; // stable O2
    const gasTemp = 44 + noise * 2; // stable gas temp (40-48°C)
    const gasFlow = 2.7 + noise * 0.1; // stable flow (2.5-2.9 L/min)
    const so2 = filterActive ? 35 + noise * 5 : 68 + noise * 8; // mg/Nm3 bench equivalent
    const pm25 = filterActive ? 14 + noise * 2 : 78 + noise * 6; // ug/m3

    return {
      unitId,
      controlMode,
      systemStatus: backwashActive ? 'BACKWASH_PURGE' : !filterActive ? 'EMERGENCY_BYPASS' : 'OPTIMAL',
      iotBridgeConnected: true,
      lastSyncTime: new Date().toLocaleTimeString('id-ID'),
      carbonAvoidedKgPerDay: filterActive ? 14.8 : 0,
      complianceScorePercent: filterActive ? 99.4 : 64.2,
      teg: {
        tempHot: Number(baseTHot.toFixed(1)),
        tempCold: Number(baseTCold.toFixed(1)),
        deltaT: Number(deltaT.toFixed(1)),
        voltage: Number(voltage.toFixed(2)),
        current: Number(current.toFixed(2)),
        power: Number(actualP.toFixed(2)),
        powerUnit: 'W',
        efficiency: Number((5.8 + deltaT * 0.4).toFixed(1)),
        coolantFlow: coolantRate,
        predictedPower: Number(predictedP.toFixed(2)),
        moduleType: 'TEC1-12706 Single Element (Prototipe UGM)',
      },
      cems: {
        so2: Number(so2.toFixed(1)),
        co: Number(co.toFixed(1)),
        co2: Number(co2.toFixed(2)),
        pm25: Number(pm25.toFixed(1)),
        pm10: Number((pm25 * 1.6).toFixed(1)),
        nox: Number((24 + noise * 3).toFixed(1)),
        o2: Number(o2.toFixed(2)),
        gasTemp: Number(gasTemp.toFixed(1)),
        gasFlow: Number(gasFlow.toFixed(2)),
        opacity: Number((filterActive ? 4.2 : 18.5).toFixed(1)),
        sensorStatus: 'OPTIMAL',
        hardwarePipeline: 'ENS160 (Gas) + AHT21 (Temp/Hum) -> Arduino Nano -> ESP32 IoT',
      },
      filter: {
        active: filterActive,
        chamberStatus: backwashActive ? 'PURGING_BACKWASH' : filterActive ? 'FILTERING' : 'BYPASSED',
        coReductionPercent: 37.8, // (45 - 28) / 45 = 37.8%
        co2ReductionPercent: 28.5, // (4.2 - 3.0) / 4.2 = 28.5%
        differentialPressure: backwashActive ? 0.3 : 0.7 + noise * 0.1,
        cakeThicknessMm: backwashActive ? 0.2 : 1.4,
        wilcoxonSignificance: 'p < 0.05 (Uji Wilcoxon Terverifikasi)',
      },
    };
  } else {
    // Industrial Scale Smelter (e.g. IMIP Morowali 45 MVA RKEF)
    const baseTHot = 580.0 + flueHeatOffset + noise * 10;
    const baseTCold = 210.0 - (coolantRate - 50) * 0.4 + noise * 4;
    const deltaT = Math.max(50, baseTHot - baseTCold);
    const powerKw = calculatePredictedPower(deltaT, false); // ~450 kW
    const voltage = 400 + noise * 4;
    const current = (powerKw * 1000) / voltage;

    const so2 = filterActive ? 220 + noise * 15 : 315 + noise * 20;
    const pm25 = filterActive ? 12.5 + noise * 1.5 : 95.0 + noise * 10;
    const co = filterActive ? 28 + noise * 2 : 45 + noise * 3;
    const co2 = filterActive ? 3.0 + noise * 0.1 : 4.2 + noise * 0.1;

    return {
      unitId,
      controlMode,
      systemStatus: backwashActive
        ? 'BACKWASH_PURGE'
        : !filterActive
        ? 'EMERGENCY_BYPASS'
        : so2 >= 280
        ? 'WARNING_EMISSION'
        : 'OPTIMAL',
      iotBridgeConnected: true,
      lastSyncTime: new Date().toLocaleTimeString('id-ID'),
      carbonAvoidedKgPerDay: filterActive ? 4250 : 0,
      complianceScorePercent: filterActive ? 96.8 : 58.0,
      teg: {
        tempHot: Number(baseTHot.toFixed(1)),
        tempCold: Number(baseTCold.toFixed(1)),
        deltaT: Number(deltaT.toFixed(1)),
        voltage: Number(voltage.toFixed(1)),
        current: Number(current.toFixed(1)),
        power: Number(powerKw.toFixed(1)),
        powerUnit: 'kW',
        efficiency: Number((14.2 + noise * 0.4).toFixed(1)),
        coolantFlow: coolantRate,
        predictedPower: Number(powerKw.toFixed(1)),
        moduleType: 'Matriks Paralel TEG + Siklus Tertutup ORC',
      },
      cems: {
        so2: Number(so2.toFixed(1)),
        co: Number(co.toFixed(1)),
        co2: Number(co2.toFixed(2)),
        pm25: Number(pm25.toFixed(1)),
        pm10: Number((pm25 * 1.8).toFixed(1)),
        nox: Number((185 + noise * 10).toFixed(1)),
        o2: Number((20.4 + noise * 0.2).toFixed(2)),
        gasTemp: Number((baseTHot * 0.35).toFixed(1)),
        gasFlow: Number((1200 + noise * 50).toFixed(0)),
        opacity: Number((filterActive ? 7.5 : 24.0).toFixed(1)),
        sensorStatus: 'OPTIMAL',
        hardwarePipeline: 'Industrial CEMS Spectrometer Array -> SCADA OPC-UA -> Cloud Hub',
      },
      filter: {
        active: filterActive,
        chamberStatus: backwashActive ? 'PURGING_BACKWASH' : filterActive ? 'FILTERING' : 'BYPASSED',
        coReductionPercent: 37.8,
        co2ReductionPercent: 28.5,
        differentialPressure: backwashActive ? 0.4 : 1.2 + noise * 0.2,
        cakeThicknessMm: backwashActive ? 0.3 : 2.8,
        wilcoxonSignificance: 'p < 0.05 (Uji Signifikan Terverifikasi)',
      },
    };
  }
}

/**
 * Intelligent engineering copilot response engine based on UGM paper
 */
function generateCopilotAnswer(prompt: string, state: ScadaSystemState): CopilotMessage {
  const p = prompt.toLowerCase();
  let content = '';

  if (p.includes('teg') || p.includes('seebeck') || p.includes('daya') || p.includes('regresi') || p.includes('panas')) {
    content = `### Analisis Pemanenan Energi Termoelektrik (TEG)\n\nBerdasarkan data penelitian CYPHER 2026:\n- **Formula Regresi Empiris**: $P = 0.52 \\Delta T + 0.08$ dengan koefisien determinasi $R^2 = 0.94$.\n- **Hasil Uji Prototipe (TEC1-12706)**: Menghasilkan daya rata-rata **3.2 – 4.4 W** pada gradien suhu $\\Delta T$ sebesar **6.5 – 8.2°C**, dengan tegangan stabil **2.0 – 2.5 V**.\n- **Status Operasional Saat Ini**: $\\Delta T = ${state.teg.deltaT}^\\circ\\text{C}$ menghasilkan daya aktual **${state.teg.power} ${state.teg.powerUnit}**.\n- **Keunggulan**: Sistem solid-state tanpa komponen bergerak, andal, dan memanfaatkan limbah flue gas tanpa mengganggu proses peleburan.`;
  } else if (p.includes('filter') || p.includes('filtrasi') || p.includes('co') || p.includes('wilcoxon') || p.includes('aliran')) {
    content = `### Analisis Kinerja Modul Filtrasi Cerdas CYPHER\n\nBerdasarkan uji statistik **Wilcoxon Signed-Rank** ($p < 0.05$):\n1. **Reduksi CO**: Turun signifikan rata-rata **15 ppm** (dari 45 ppm tanpa filter menjadi 28 ppm pada menit ke-45–60).\n2. **Reduksi $\\text{CO}_2$**: Turun signifikan **1.0%** (dari 4.2% menjadi 3.0%).\n3. **Stabilitas Aerodinamika & Termal**: Modul filter terbukti **tidak menghambat aliran gas** (laju alir konstan 2.5–2.9 L/min) dan suhu gas tetap stabil di kisaran 40–48°C.\n4. **Kestabilan $\\text{O}_2$**: Kadar $\\text{O}_2$ stabil di kisaran 20.4%–20.8%, menandakan proses pembakaran tungku tidak terganggu.`;
  } else if (p.includes('ens160') || p.includes('aht21') || p.includes('arduino') || p.includes('esp32') || p.includes('iot') || p.includes('cems')) {
    content = `### Arsitektur CEMS & IoT Closed-Loop Controller\n\n- **Sensor Endpoints**: Sensor **ENS160** (deteksi gas kualitas udara, CO, $\\text{CO}_2$, VOC) dipadukan dengan sensor **AHT21** (pengukuran temperatur dan kelembaban presisi tinggi).\n- **Pemrosesan Mikro**: Data diakuisisi oleh **Arduino Nano** lalu ditransmisikan ke mikrokontroler **ESP32**.\n- **Loop Tertutup Adaptif**: CEMS tidak hanya mencatat kepatuhan regulasi secara pasif, tetapi bertindak sebagai otak kendali yang secara real-time menyesuaikan intensitas pemanenan TEG dan filtrasi cerdas berdasarkan fluktuasi emisi cerobong.`;
  } else if (p.includes('roadmap') || p.includes('peta jalan') || p.includes('2045') || p.includes('2060') || p.includes('bappenas') || p.includes('target')) {
    content = `### Peta Jalan Dekarbonisasi Menuju NZE 2060 & Indonesia Emas 2045\n\nSesuai Peta Jalan Dekarbonisasi Industri Nikel Nasional (Bappenas & WRI Indonesia target reduksi 81%):\n- **Tahap 1 (2026–2030)**: Validasi prototipe dan uji coba di 1 unit smelter skala industri.\n- **Tahap 2 (2030–2040)**: Pengembangan modul TEG paralel (daya 10x lipat) & filter cerdas berbasis AI/Machine Learning untuk optimasi prediktif.\n- **Tahap 3 (2040–2045)**: Integrasi jaringan pemantauan IoT nasional dan penetapan CYPHER sebagai standar kepatuhan wajib (*mandatory compliance*) bagi seluruh smelter Indonesia.`;
  } else {
    content = `### Rekomendasi Kendali CYPHER\n\nKondisi telemetri unit **${state.unitId}**:\n- **Daya Listrik TEG**: ${state.teg.power} ${state.teg.powerUnit} ($\\Delta T = ${state.teg.deltaT}^\\circ\\text{C}$)\n- **Status Emisi CEMS**: $\\text{SO}_2 = ${state.cems.so2}$, $\\text{CO} = ${state.cems.co}$ ppm, $\\text{CO}_2 = ${state.cems.co2}\\%$\n- **Efektivitas Filter**: ${state.filter.active ? 'AKTIF (Efisiensi 99.4%)' : 'BYPASS (Peringatan Emisi)'}\n\nSistem beroperasi optimal dalam kepatuhan baku mutu lingkungan.`;
  }

  return {
    id: `ans-${Date.now()}`,
    role: 'assistant',
    content,
    timestamp: new Date().toLocaleTimeString('id-ID'),
  };
}
