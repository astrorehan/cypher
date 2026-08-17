import React, { useState } from 'react';
import {
  ArrowLeft,
  User,
  ShieldCheck,
  Award,
  Calendar,
  Phone,
  Mail,
  Clock,
  CheckCircle2,
  FileText,
  Activity,
} from 'lucide-react';
import { SiteView } from '../engine/cypherTypes';
import { useSound } from '../utils/SoundProvider';

interface Props {
  onNavigate: (view: SiteView) => void;
}

export const ProfileView: React.FC<Props> = ({ onNavigate }) => {
  const [logs, setLogs] = useState([
    {
      time: 'Hari ini, 14:05',
      desc: 'Memicu protokol Force Backwash pada Chamber #2 untuk regenerasi cake filtrasi.',
      tag: 'Korektif',
    },
    {
      time: 'Hari ini, 13:30',
      desc: 'Mengunduh Laporan Kepatuhan Emisi & Pemanenan TEG (Format CSV/PDF) untuk arsip Shift 1 Morowali Hub.',
      tag: 'Audit',
    },
    {
      time: 'Hari ini, 08:00',
      desc: 'Login ke Sistem Monitoring SCADA CYPHER dan memulai Shift Pagi.',
      tag: 'Operasional',
    },
    {
      time: 'Kemarin, 15:45',
      desc: 'Melakukan kalibrasi sensor CEMS ENS160 & AHT21 via mikrokontroler ESP32.',
      tag: 'Kalibrasi',
    },
  ]);

  const { playClick } = useSound();

  return (
    <div className="min-h-full flex flex-col p-6 md:p-10 max-w-5xl mx-auto w-full anim-rise">
      {/* Top Header */}
      <div className="flex items-center justify-between gap-4 mb-8">
        <button
          onClick={() => onNavigate('landing')}
          className="h-10 px-4 rounded-full glass-soft hover:bg-white text-hi shadow-sm flex items-center gap-2 text-[13px] font-semibold transition-all cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Beranda</span>
        </button>

        <button
          onClick={() => onNavigate('simulasi')}
          className="h-10 px-5 rounded-full bg-core-500 text-white text-[13px] font-bold shadow-md hover:brightness-110 active:scale-95 transition-all cursor-pointer"
        >
          Buka Ruang Kontrol Smelter
        </button>
      </div>

      {/* Operator Header Card */}
      <div className="p-8 rounded-3xl bg-white border border-black/[.08] shadow-sm flex flex-col sm:flex-row items-center sm:items-start gap-6 mb-8">
        <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-core-500 to-cyan-600 text-white flex items-center justify-center font-display text-[28px] font-extrabold shadow-lg shrink-0">
          AN
        </div>

        <div className="flex-1 text-center sm:text-left">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-1.5">
            <h1 className="font-display text-[24px] font-extrabold text-hi">
              Ahmad Nugroho
            </h1>
            <span className="px-3 py-0.5 rounded-full bg-emerald-500/15 text-emerald-700 font-mono text-[11px] font-bold">
              ● SEDANG BERTUGAS (SHIFT 1)
            </span>
          </div>

          <p className="text-[13.5px] text-mid">
            ID: OP-2024-089 • Kepala Shift Filtrasi &amp; Pemanenan TEG Morowali
          </p>
          <p className="text-[12.5px] text-lo mt-1">
            Departemen Health, Safety &amp; Environment (HSE) Smelter
          </p>
        </div>
      </div>

      {/* 2-Column Grid for Information & Logs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Column: Personal Info & Certifications */}
        <div className="space-y-6">
          <div className="p-6 rounded-3xl bg-white border border-black/[.08] shadow-sm">
            <h2 className="font-bold text-[16px] text-hi pb-3 border-b border-black/[.08] mb-4">
              Informasi Personal &amp; Penugasan
            </h2>
            <div className="space-y-3 text-[13px]">
              <div className="flex items-center justify-between py-1.5 border-b border-black/[.04]">
                <span className="text-mid">Email Resmi:</span>
                <span className="font-medium text-hi">ahmad.nugroho@smelter.co.id</span>
              </div>
              <div className="flex items-center justify-between py-1.5 border-b border-black/[.04]">
                <span className="text-mid">Nomor Telepon:</span>
                <span className="font-medium text-hi">+62 812-3456-7890</span>
              </div>
              <div className="flex items-center justify-between py-1.5 border-b border-black/[.04]">
                <span className="text-mid">Unit Smelter:</span>
                <span className="font-medium text-hi">Morowali Hub (RKEF Unit 01)</span>
              </div>
              <div className="flex items-center justify-between py-1.5">
                <span className="text-mid">Tanggal Bergabung:</span>
                <span className="font-medium text-hi">12 Maret 2021</span>
              </div>
            </div>
          </div>

          <div className="p-6 rounded-3xl bg-white border border-black/[.08] shadow-sm">
            <h2 className="font-bold text-[16px] text-hi pb-3 border-b border-black/[.08] mb-4 flex items-center gap-2">
              <Award className="w-4 h-4 text-cyan-600" />
              <span>Sertifikasi &amp; Kompetensi HSE</span>
            </h2>
            <div className="space-y-3 text-[13px]">
              <div className="flex items-center justify-between py-1.5 border-b border-black/[.04]">
                <span className="text-mid">Ahli K3 Umum (Kemnaker):</span>
                <span className="font-semibold text-emerald-600">Valid (Hingga 2027)</span>
              </div>
              <div className="flex items-center justify-between py-1.5 border-b border-black/[.04]">
                <span className="text-mid">Sertifikasi Operator CEMS:</span>
                <span className="font-semibold text-emerald-600">Valid (Hingga 2026)</span>
              </div>
              <div className="flex items-center justify-between py-1.5">
                <span className="text-mid">Pelatihan Kelistrikan TEG:</span>
                <span className="font-semibold text-emerald-600">Lulus (Okt 2023)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Activity Log Timeline */}
        <div className="p-6 rounded-3xl bg-white border border-black/[.08] shadow-sm flex flex-col justify-between">
          <div>
            <h2 className="font-bold text-[16px] text-hi pb-3 border-b border-black/[.08] mb-4 flex items-center gap-2">
              <Clock className="w-4 h-4 text-core-500" />
              <span>Log Aktivitas Shift Terkini</span>
            </h2>

            <div className="space-y-4 relative before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-black/[.08]">
              {logs.map((l, i) => (
                <div key={i} className="relative pl-6">
                  <div className="absolute left-0.5 top-1.5 w-3 h-3 rounded-full bg-core-500 ring-4 ring-white" />
                  <div className="flex items-center justify-between text-[11px] font-mono mb-0.5">
                    <span className="text-lo">{l.time}</span>
                    <span className="px-2 py-0.5 rounded-full bg-black/[.05] text-mid font-semibold">
                      {l.tag}
                    </span>
                  </div>
                  <p className="text-[13px] text-hi leading-snug">{l.desc}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-6 border-t border-black/[.06] mt-6">
            <button
              onClick={() => {
                playClick();
                setLogs((prev) => [
                  {
                    time: 'Baru saja',
                    desc: 'Sinkronisasi telemetri TEG 450 kW ke Hub Emisi Nasional 2045 berhasil.',
                    tag: 'Auto-Sync',
                  },
                  ...prev,
                ]);
              }}
              className="w-full h-10 rounded-2xl glass-soft hover:bg-black/[.06] text-hi text-[13px] font-semibold transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <Activity className="w-4 h-4 text-core-500" />
              <span>Sinkronisasi Log Shift Sekarang</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
