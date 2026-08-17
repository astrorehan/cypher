import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, ZoomIn, ZoomOut, RotateCcw, MapPin, Activity, Zap, Wind, Info } from 'lucide-react';
import L from 'leaflet';
import { SiteView } from '../engine/cypherTypes';
import { useSound } from '../utils/SoundProvider';

interface Props {
  onNavigate: (view: SiteView) => void;
}

export interface RegionNode {
  id: string;
  name: string;
  sub: string;
  lat: number;
  lng: number;
  so2: number;
  co: number;
  co2: number;
  compliance: string;
  tegEff: string;
  carbonTax: string;
  gridContribution: string;
  status: string;
}

export const REGIONS: RegionNode[] = [
  {
    id: 'morowali',
    name: 'Morowali Hub IWIP',
    sub: 'PT Indonesia Morowali Industrial Park (Nikel RKEF & HPAL)',
    lat: -2.816,
    lng: 122.152,
    so2: 145,
    co: 45,
    co2: 310,
    compliance: '89%',
    tegEff: '94.2%',
    carbonTax: 'Rp 1.4B/Bln',
    gridContribution: '+24.5 GW/h',
    status: 'ACTIVE (99% Absorb)',
  },
  {
    id: 'weda',
    name: 'Weda Bay IMIP',
    sub: 'Kawasan Industri Halmahera Tengah (Smelter Ferronickel)',
    lat: 0.485,
    lng: 127.876,
    so2: 110,
    co: 32,
    co2: 240,
    compliance: '92%',
    tegEff: '97.5%',
    carbonTax: 'Rp 950M/Bln',
    gridContribution: '+18.2 GW/h',
    status: 'ACTIVE (98% Absorb)',
  },
  {
    id: 'gresik',
    name: 'Freeport Gresik',
    sub: 'Smelter Tembaga Manyar (Single Line Terbesar)',
    lat: -7.149,
    lng: 112.656,
    so2: 85,
    co: 20,
    co2: 185,
    compliance: '96%',
    tegEff: '98.9%',
    carbonTax: 'Rp 420M/Bln',
    gridContribution: '+32.0 GW/h',
    status: 'ACTIVE (99.4% Absorb)',
  },
  {
    id: 'bangka',
    name: 'Bangka Belitung Tin',
    sub: 'Peleburan Timah Hijau Nasional (Eco-Smelter)',
    lat: -2.129,
    lng: 106.113,
    so2: 60,
    co: 15,
    co2: 120,
    compliance: '98%',
    tegEff: '99.1%',
    carbonTax: 'Subsidi Hijau Net-Zero',
    gridContribution: '+8.4 GW/h',
    status: 'ACTIVE (99.8% Absorb)',
  },
  {
    id: 'konawe',
    name: 'Virtue Dragon Konawe',
    sub: 'Konawe Industrial Hub (VDNI Nikel & Stainless)',
    lat: -3.945,
    lng: 122.428,
    so2: 128,
    co: 23,
    co2: 344,
    compliance: '89%',
    tegEff: '96.0%',
    carbonTax: 'Rp 4.6B/Bln',
    gridContribution: '+19.6 GW/h',
    status: 'ACTIVE (98.5% Absorb)',
  },
  {
    id: 'bantaeng',
    name: 'Huadi Bantaeng Hub',
    sub: 'Huadi Nickel-Alloy Smelting (Sulawesi Selatan)',
    lat: -5.549,
    lng: 120.005,
    so2: 180,
    co: 55,
    co2: 400,
    compliance: '82%',
    tegEff: '91.0%',
    carbonTax: 'Rp 2.1B/Bln',
    gridContribution: '+11.2 GW/h',
    status: 'ACTIVE (96% Absorb)',
  },
];

export const NationalHubView: React.FC<Props> = ({ onNavigate }) => {
  // Default to null on first load (overview / reset position)
  const [selectedRegion, setSelectedRegion] = useState<RegionNode | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersRef = useRef<Record<string, L.Marker>>({});
  const { playClick } = useSound();

  // Initialize Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
    }

    const map = L.map(mapContainerRef.current, {
      center: [-2.5, 118.0],
      zoom: 5,
      minZoom: 4,
      maxZoom: 15,
      zoomControl: false,
      attributionControl: false,
    });

    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
      subdomains: 'abcd',
      maxZoom: 19,
    }).addTo(map);

    mapInstanceRef.current = map;

    // Add Markers for each region
    REGIONS.forEach((region) => {
      const customIcon = L.divIcon({
        className: 'cypher-leaflet-marker',
        html: `
          <div style="position: relative; display: flex; align-items: center; justify-content: center; width: 28px; height: 28px;">
            <span style="position: absolute; width: 28px; height: 28px; border-radius: 50%; background: #0284c7; opacity: 0.35; animation: pulse 2s infinite;"></span>
            <span style="position: absolute; width: 14px; height: 14px; border-radius: 50%; background: #0284c7; box-shadow: 0 0 10px #0284c7; border: 2px solid #ffffff;"></span>
          </div>
        `,
        iconSize: [28, 28],
        iconAnchor: [14, 14],
      });

      const marker = L.marker([region.lat, region.lng], { icon: customIcon }).addTo(map);

      marker.bindPopup(`
        <div style="font-family: 'Inter', sans-serif; padding: 4px; min-width: 180px;">
          <div style="font-size: 11px; font-weight: 700; color: #0284c7; text-transform: uppercase; margin-bottom: 2px;">
            CYPHER EMISSION NODE
          </div>
          <div style="font-size: 14px; font-weight: 800; color: #0f172a; margin-bottom: 4px;">
            ${region.name}
          </div>
          <div style="font-size: 12px; color: #475569; margin-bottom: 8px;">
            ${region.sub}
          </div>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 4px; font-size: 11px; padding: 6px; background: #f1f5f9; border-radius: 8px;">
            <div>SO₂: <strong>${region.so2} mg/Nm³</strong></div>
            <div>TEG Eff: <strong>${region.tegEff}</strong></div>
            <div>Kepatuhan: <strong style="color: #059669;">${region.compliance}</strong></div>
            <div>CCUS: <strong>99%</strong></div>
          </div>
        </div>
      `);

      marker.on('click', () => {
        playClick();
        setSelectedRegion(region);
      });

      markersRef.current[region.id] = marker;
    });

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Update selected region and fly only when selected
  useEffect(() => {
    if (!mapInstanceRef.current) return;
    const map = mapInstanceRef.current;

    if (selectedRegion) {
      map.flyTo([selectedRegion.lat, selectedRegion.lng], 7, {
        duration: 1.2,
        easeLinearity: 0.25,
      });
    }

    // Update marker visuals
    REGIONS.forEach((region) => {
      const marker = markersRef.current[region.id];
      if (!marker) return;
      const isSelected = selectedRegion?.id === region.id;

      const customIcon = L.divIcon({
        className: 'cypher-leaflet-marker',
        html: `
          <div style="position: relative; display: flex; align-items: center; justify-content: center; width: 28px; height: 28px;">
            <span style="position: absolute; width: 28px; height: 28px; border-radius: 50%; background: ${
              isSelected ? '#f59e0b' : '#0284c7'
            }; opacity: 0.45; animation: pulse 2s infinite;"></span>
            <span style="position: absolute; width: ${isSelected ? '16px' : '14px'}; height: ${
          isSelected ? '16px' : '14px'
        }; border-radius: 50%; background: ${
          isSelected ? '#f59e0b' : '#0284c7'
        }; box-shadow: 0 0 14px ${isSelected ? '#f59e0b' : '#0284c7'}; border: 2.5px solid #ffffff;"></span>
          </div>
        `,
        iconSize: [28, 28],
        iconAnchor: [14, 14],
      });

      marker.setIcon(customIcon);
      if (isSelected) {
        marker.openPopup();
      }
    });
  }, [selectedRegion]);

  const handleZoomIn = () => {
    playClick();
    mapInstanceRef.current?.zoomIn();
  };

  const handleZoomOut = () => {
    playClick();
    mapInstanceRef.current?.zoomOut();
  };

  const handleResetView = () => {
    playClick();
    setSelectedRegion(null);
    mapInstanceRef.current?.closePopup();
    mapInstanceRef.current?.flyTo([-2.5, 118.0], 5, { duration: 1.0 });
  };

  return (
    <div className="min-h-full flex flex-col p-6 md:p-10 bg-transparent text-hi anim-rise">
      {/* Top Bar Navigation */}
      <div className="max-w-7xl mx-auto w-full flex flex-wrap items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate('landing')}
            className="h-10 px-4 rounded-full glass-soft hover:bg-white text-hi shadow-sm flex items-center gap-2 text-[13px] font-semibold transition-all cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Kembali ke Beranda</span>
          </button>

          <div className="hidden sm:inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-indigo-500/10 text-indigo-600 font-mono text-[11px] font-bold">
            <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
            PETA INTERAKTIF EMISI LEAFLET • INDONESIA EMAS 2045
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onNavigate('simulasi')}
            className="h-10 px-5 rounded-full bg-gradient-to-r from-core-500 to-cyan-600 text-white text-[13px] font-bold shadow-md hover:brightness-110 active:scale-95 transition-all cursor-pointer"
          >
            Buka Simulasi Smelter
          </button>
        </div>
      </div>

      {/* Main Layout Grid */}
      <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (7 cols): Fully Interactive Leaflet Map */}
        <div className="lg:col-span-7 rounded-3xl p-6 border border-black/[.08] glass shadow-sm flex flex-col justify-between">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <div>
              <h2 className="font-display text-[20px] font-extrabold leading-tight text-hi">
                Pemetaan Smelter Nasional &amp; Makro Emisi Real-Time
              </h2>
              <p className="text-[12.5px] text-mid mt-0.5">
                Peta Leaflet interaktif: Geser, perbesar (zoom), atau klik node geo-lokasi untuk inspeksi detail.
              </p>
            </div>

            {/* Map Action Controls */}
            <div className="flex items-center gap-1.5">
              <button
                onClick={handleZoomIn}
                title="Perbesar Peta"
                className="w-8 h-8 rounded-xl glass-soft hover:bg-white flex items-center justify-center text-hi shadow-sm transition-all cursor-pointer"
              >
                <ZoomIn className="w-4 h-4" />
              </button>
              <button
                onClick={handleZoomOut}
                title="Perkecil Peta"
                className="w-8 h-8 rounded-xl glass-soft hover:bg-white flex items-center justify-center text-hi shadow-sm transition-all cursor-pointer"
              >
                <ZoomOut className="w-4 h-4" />
              </button>
              <button
                onClick={handleResetView}
                title="Reset Tampilan Indonesia"
                className={`h-8 px-3 rounded-xl flex items-center gap-1.5 text-[11.5px] font-semibold transition-all cursor-pointer ${
                  selectedRegion === null
                    ? 'bg-core-500 text-white shadow-sm'
                    : 'glass-soft hover:bg-white text-hi shadow-sm'
                }`}
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset (Nasional)</span>
              </button>
            </div>
          </div>

          {/* Leaflet Map DOM Canvas */}
          <div className="relative rounded-2xl overflow-hidden border border-black/[.08] shadow-inner h-[440px] w-full">
            <div ref={mapContainerRef} className="w-full h-full z-10" />
          </div>

          {/* Region Quick Filter Pill Track */}
          <div className="mt-4 flex items-center gap-2 overflow-x-auto scrollbar-none pb-1">
            <button
              onClick={handleResetView}
              className={`h-8 px-3 rounded-xl text-[12px] font-semibold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
                selectedRegion === null
                  ? 'bg-core-500 text-white shadow-sm font-bold'
                  : 'glass-soft text-mid hover:text-hi hover:bg-white'
              }`}
            >
              <span>🌐 Seluruh Indonesia</span>
            </button>

            {REGIONS.map((r) => {
              const isSelected = selectedRegion?.id === r.id;
              return (
                <button
                  key={r.id}
                  onClick={() => {
                    playClick();
                    setSelectedRegion(r);
                  }}
                  className={`h-8 px-3 rounded-xl text-[12px] font-semibold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
                    isSelected
                      ? 'bg-core-500 text-white shadow-sm font-bold'
                      : 'glass-soft text-mid hover:text-hi hover:bg-white'
                  }`}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      isSelected ? 'bg-amber-400' : 'bg-core-500'
                    }`}
                  />
                  <span>{r.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Column (5 cols): Regional / National Aggregate Analytics Card */}
        <div className="lg:col-span-5 rounded-3xl p-6 border border-black/[.08] glass shadow-sm flex flex-col justify-between">
          {selectedRegion ? (
            <div>
              <div className="mb-4 pb-4 border-b border-black/[.08]">
                <div className="flex items-center justify-between">
                  <div className="text-[11px] font-mono font-bold uppercase tracking-wider text-cyan-600">
                    Regional Analytics Node
                  </div>
                  <button
                    onClick={handleResetView}
                    className="text-[11px] font-semibold text-core-600 hover:underline cursor-pointer"
                  >
                    ← Lihat Rekap Nasional
                  </button>
                </div>
                <h3 className="font-display text-[22px] font-extrabold text-hi mt-1">
                  {selectedRegion.name}
                </h3>
                <p className="text-[12px] text-mid mt-0.5">{selectedRegion.sub}</p>
              </div>

              {/* Macro Emission 3-Box Grid */}
              <div className="grid grid-cols-3 gap-2.5 mb-6 text-center">
                <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20">
                  <div className="text-[10px] font-bold text-amber-700 uppercase">Paparan SO₂</div>
                  <div className="font-display text-[18px] font-extrabold text-amber-800 font-mono mt-0.5">
                    {selectedRegion.so2}
                  </div>
                  <div className="text-[9px] text-lo">mg/Nm³</div>
                </div>

                <div className="p-3 rounded-2xl bg-cyan-500/10 border border-cyan-500/20">
                  <div className="text-[10px] font-bold text-cyan-700 uppercase">Paparan CO</div>
                  <div className="font-display text-[18px] font-extrabold text-cyan-800 font-mono mt-0.5">
                    {selectedRegion.co}
                  </div>
                  <div className="text-[9px] text-lo">ppm</div>
                </div>

                <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20">
                  <div className="text-[10px] font-bold text-emerald-700 uppercase">Paparan CO₂</div>
                  <div className="font-display text-[18px] font-extrabold text-emerald-800 font-mono mt-0.5">
                    {selectedRegion.co2}
                  </div>
                  <div className="text-[9px] text-lo">ppm</div>
                </div>
              </div>

              {/* Net-Zero 2045 Metric Rows */}
              <div className="space-y-3.5 text-[13px]">
                <div className="flex items-center justify-between pb-2.5 border-b border-black/[.06]">
                  <span className="text-mid font-medium">Indeks Kepatuhan Udara:</span>
                  <span className="font-mono font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-700">
                    {selectedRegion.compliance} PASS
                  </span>
                </div>

                <div className="flex items-center justify-between pb-2.5 border-b border-black/[.06]">
                  <span className="text-mid font-medium">Efisiensi TEG Quantum:</span>
                  <span className="font-mono font-bold text-cyan-600">
                    {selectedRegion.tegEff}
                  </span>
                </div>

                <div className="flex items-center justify-between pb-2.5 border-b border-black/[.06]">
                  <span className="text-mid font-medium">Carbon Tax Net-Volume:</span>
                  <span className="font-mono font-bold text-amber-600">
                    {selectedRegion.carbonTax}
                  </span>
                </div>

                <div className="flex items-center justify-between pb-2.5 border-b border-black/[.06]">
                  <span className="text-mid font-medium">Status CCUS (Carbon Capture):</span>
                  <span className="font-mono font-bold text-blue-600 text-[12px]">
                    {selectedRegion.status}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-mid font-medium">Kontribusi Grid Listrik Nasional:</span>
                  <span className="font-mono font-bold text-indigo-600">
                    {selectedRegion.gridContribution}
                  </span>
                </div>
              </div>
            </div>
          ) : (
            /* National Aggregate Overview (Default Initial State) */
            <div>
              <div className="mb-4 pb-4 border-b border-black/[.08]">
                <div className="text-[11px] font-mono font-bold uppercase tracking-wider text-emerald-600 mb-1">
                  Konsolidasi Emisi Smelter Nasional
                </div>
                <h3 className="font-display text-[22px] font-extrabold text-hi">
                  Agregat Hub Emisi Indonesia 2045
                </h3>
                <p className="text-[12px] text-mid mt-0.5">
                  Rekapitulasi 6 kawasan industri smelter terintegrasi TEG &amp; CEMS.
                </p>
              </div>

              {/* National Aggregate Macro Grid */}
              <div className="grid grid-cols-3 gap-2.5 mb-6 text-center">
                <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20">
                  <div className="text-[10px] font-bold text-amber-700 uppercase">Rata-Rata SO₂</div>
                  <div className="font-display text-[18px] font-extrabold text-amber-800 font-mono mt-0.5">
                    118.0
                  </div>
                  <div className="text-[9px] text-lo">mg/Nm³ (Aman)</div>
                </div>

                <div className="p-3 rounded-2xl bg-cyan-500/10 border border-cyan-500/20">
                  <div className="text-[10px] font-bold text-cyan-700 uppercase">Rata-Rata CO</div>
                  <div className="font-display text-[18px] font-extrabold text-cyan-800 font-mono mt-0.5">
                    31.7
                  </div>
                  <div className="text-[9px] text-lo">ppm</div>
                </div>

                <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20">
                  <div className="text-[10px] font-bold text-emerald-700 uppercase">Rata-Rata CO₂</div>
                  <div className="font-display text-[18px] font-extrabold text-emerald-800 font-mono mt-0.5">
                    266.5
                  </div>
                  <div className="text-[9px] text-lo">ppm</div>
                </div>
              </div>

              {/* National Aggregate Metrics */}
              <div className="space-y-3.5 text-[13px]">
                <div className="flex items-center justify-between pb-2.5 border-b border-black/[.06]">
                  <span className="text-mid font-medium">Total Kontribusi Grid TEG Nasional:</span>
                  <span className="font-mono font-bold text-indigo-600">
                    +113.9 GW/h
                  </span>
                </div>

                <div className="flex items-center justify-between pb-2.5 border-b border-black/[.06]">
                  <span className="text-mid font-medium">Rata-Rata Kepatuhan Emisi:</span>
                  <span className="font-mono font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-700">
                    91.0% PASS
                  </span>
                </div>

                <div className="flex items-center justify-between pb-2.5 border-b border-black/[.06]">
                  <span className="text-mid font-medium">Rata-Rata Efisiensi TEG Seebeck:</span>
                  <span className="font-mono font-bold text-cyan-600">
                    96.1%
                  </span>
                </div>

                <div className="flex items-center justify-between pb-2.5 border-b border-black/[.06]">
                  <span className="text-mid font-medium">Penerimaan Pajak Karbon Terkelola:</span>
                  <span className="font-mono font-bold text-amber-600">
                    Rp 9.5B / Bln
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-mid font-medium">Kesiapan Infrastruktur CCUS:</span>
                  <span className="font-mono font-bold text-emerald-600 text-[12px]">
                    100% OPERATIONAL (6 Hub)
                  </span>
                </div>
              </div>

              {/* Hint Box */}
              <div className="mt-6 p-3.5 rounded-2xl glass-soft border border-black/[.06] flex items-center gap-2.5 text-[12px] text-mid">
                <Info className="w-4 h-4 text-core-500 shrink-0" />
                <span>Klik pin pada peta atau tombol lokasi untuk melihat analisis spesifik tiap smelter.</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
