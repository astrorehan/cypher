import React, { useState } from 'react';
import { ArrowLeft, GraduationCap, Plus, Quote, Sparkles, Award } from 'lucide-react';
import { SiteView } from '../engine/cypherTypes';
import { Chip } from '../components/ui/primitives';

interface Props {
  onNavigate: (view: SiteView) => void;
}

interface Member {
  name: string;
  nim: string;
  role: string;
  initials: string;
  ringkas: string;
  bio: string;
  tags: string[];
  tint: string;
  tint2: string;
}

const TEAM: Member[] = [
  {
    initials: 'MH',
    name: 'Muhammad Hashfy Habib Emir Abdullah',
    nim: '26/581881/KH/13096',
    role: 'Ketua Tim & Rekayasa Termal IoT',
    ringkas: 'Perancangan modul termoelektrik TEG Seebeck dan integrasi sistem mikrokontroler Arduino Nano ke ESP32.',
    bio: 'Bertanggung jawab atas konseptualisasi gagasan NEXUS, pengujian prototipe termoelektrik (TEC1-12706), perumusan model regresi linear P = 0,52 ΔT + 0,08, serta integrasi pipeline komunikasi data mikrokontroler.',
    tags: ['Termodinamika TEG', 'Pipeline ESP32/Nano', 'Manajemen Inovasi'],
    tint: 'var(--color-core-500)',
    tint2: 'var(--color-sinero-cyan)',
  },
  {
    initials: 'ZP',
    name: 'Zefania Priscila',
    nim: '25/560845/PS/24033',
    role: 'Analisis Kebijakan & Dampak Lingkungan',
    ringkas: 'Penyusunan peta jalan dekarbonisasi industri nikel nasional, analisis dampak kesehatan masyarakat, dan kepatuhan baku mutu emisi.',
    bio: 'Mengelola telaah regulasi lingkungan (Permen LHK No. 15/2019 dan Permenkes No. 2/2023), perancangan integrasi NEXUS dengan Peta Jalan Dekarbonisasi Industri Nikel Bappenas-WRI 2045, serta evaluasi penurunan prevalensi ISPA di kawasan industri smelter.',
    tags: ['Kebijakan Dekarbonisasi', 'Analisis Emisi CEMS', 'Peta Jalan 2045'],
    tint: 'var(--color-sinero-emerald)',
    tint2: 'var(--color-core-400)',
  },
  {
    initials: 'JK',
    name: 'Josephine Claudia Krisnandita',
    nim: '25/559330/PA/23522',
    role: 'Instrumentasi Filtrasi & Data Sains',
    ringkas: 'Pengujian performa filtrasi partikulat/gas, analisis statistik Wilcoxon Signed-Rank, dan kalibrasi sensor ENS160/AHT21.',
    bio: 'Merancang konfigurasi modul filtrasi cerdas tanpa resistansi aliran gas buang, melakukan uji komparasi dengan filter vs tanpa filter (reduksi CO 15 ppm dan CO₂ 1,0%), serta memverifikasi signifikansi statistik efektivitas penangkapan polutan.',
    tags: ['Modul Filtrasi Gas', 'Uji Statistik Wilcoxon', 'Sensor ENS160 & AHT21'],
    tint: 'var(--color-mode-socratic)',
    tint2: 'var(--color-sinero-amber)',
  },
];

const COMPETITION_INFO = {
  event: 'NATIONAL ERCOM COMPETITION 2026',
  subtheme: 'Sustainable Economy & Green Technology',
  title:
    'NEXUS: Integrasi Sistem Kendali Emisi Cerdas Berbasis Internet of Things untuk Hilirisasi dan Dekarbonisasi Menuju Net Zero Emissions Indonesia 2060',
  institution: 'UNIVERSITAS GADJAH MADA, YOGYAKARTA',
};

const MemberCard: React.FC<{
  member: Member;
  open: boolean;
  onToggle: () => void;
}> = ({ member, open, onToggle }) => {
  return (
    <div className="rounded-3xl p-6 surface-card flex flex-col justify-between">

        <div>
          {/* Avatar Icon */}
          <div className="flex items-center justify-between mb-4">
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center font-display text-[18px] font-bold text-white shadow-md"
              style={{
                background: `linear-gradient(135deg, ${member.tint}, ${member.tint2})`,
              }}
            >
              {member.initials}
            </div>

            <button
              onClick={onToggle}
              className="w-10 h-10 rounded-full liquid-control flex items-center justify-center text-lo hover:text-hi"
              aria-label={open ? `Tutup profil ${member.name}` : `Buka profil ${member.name}`}
              aria-expanded={open}
            >
              <Plus className={`w-4 h-4 transition-transform duration-300 ${open ? 'rotate-45' : ''}`} />
            </button>
          </div>

          <h3 className="font-display text-[17px] font-bold text-hi leading-snug mb-0.5">
            {member.name}
          </h3>
          <div className="text-[11.5px] font-mono text-lo mb-1.5">
            NIM: {member.nim}
          </div>
          <div className="text-[12.5px] font-mono font-semibold uppercase tracking-wider mb-3" style={{ color: member.tint }}>
            {member.role}
          </div>

          <p className="text-[13px] text-mid leading-relaxed mb-4">
            {open ? member.bio : member.ringkas}
          </p>
        </div>

        <div className="flex flex-wrap gap-1.5 pt-3 border-t border-slate-100">
          {member.tags.map((t, idx) => (
            <Chip key={idx} tone={member.tint}>
              {t}
            </Chip>
          ))}
        </div>
    </div>
  );
};

export const AboutView: React.FC<Props> = ({ onNavigate }) => {
  const [openCard, setOpenCard] = useState<number | null>(null);

  return (
    <div className="min-h-full flex flex-col p-5 md:p-10 max-w-6xl mx-auto w-full anim-rise">
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-10">
        <button
          onClick={() => onNavigate('landing')}
          className="liquid-control min-h-11 px-4 rounded-2xl text-hi flex items-center gap-2 text-[13px] font-semibold cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Beranda</span>
        </button>

        <button
          onClick={() => onNavigate('simulasi')}
          className="primary-action min-h-11 px-5 rounded-2xl text-[13px] font-semibold cursor-pointer"
        >
          Buka Ruang Kontrol Smelter
        </button>
      </div>

      {/* Page Title */}
      <div className="text-center max-w-3xl mx-auto mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-700 eyebrow mb-4">
          TIM PENELITI &amp; INOVASI NEXUS UGM
        </div>
        <h1 className="page-title text-[34px] md:text-[48px] text-hi">
          Penulis &amp; Pengembang Gagasan NEXUS
        </h1>
        <p className="mt-4 text-[15px] md:text-[16px] text-mid leading-relaxed">
          Karya tulis ilmiah mahasiswa Universitas Gadjah Mada (UGM) Yogyakarta dalam ajang National Ercom Competition 2026.
        </p>
      </div>

      {/* Competition Context Banner Card */}
      <div className="max-w-3xl mx-auto w-full mb-10">
        <div className="p-6 rounded-3xl surface-card flex flex-col sm:flex-row items-center sm:items-start gap-5 border-l-4 border-l-emerald-500">
          <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-700 font-display text-[22px] font-extrabold flex items-center justify-center shrink-0 shadow-inner">
            UGM
          </div>
          <div>
            <div className="flex items-center gap-2 text-[11px] font-mono font-bold text-emerald-700 uppercase">
              <Award className="w-4 h-4" />
              <span>{COMPETITION_INFO.event} • {COMPETITION_INFO.subtheme}</span>
            </div>
            <h3 className="font-display text-[16px] md:text-[17px] font-bold text-hi mt-1 leading-snug">
              {COMPETITION_INFO.title}
            </h3>
            <p className="text-[12.5px] text-mid leading-relaxed mt-1.5 font-mono">
              {COMPETITION_INFO.institution}
            </p>
          </div>
        </div>
      </div>

      {/* Team Members Grid (3 Cards) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {TEAM.map((m, idx) => (
          <MemberCard
            key={idx}
            member={m}
            open={openCard === idx}
            onToggle={() => setOpenCard(openCard === idx ? null : idx)}
          />
        ))}
      </div>
    </div>
  );
};
