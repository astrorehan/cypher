import React, { useCallback, useRef, useState } from 'react';
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
    bio: 'Bertanggung jawab atas konseptualisasi gagasan CYPHER, pengujian prototipe termoelektrik (TEC1-12706), perumusan model regresi linear P = 0,52 ΔT + 0,08, serta integrasi pipeline komunikasi data mikrokontroler.',
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
    bio: 'Mengelola telaah regulasi lingkungan (Permen LHK No. 15/2019 dan Permenkes No. 2/2023), perancangan integrasi CYPHER dengan Peta Jalan Dekarbonisasi Industri Nikel Bappenas-WRI 2045, serta evaluasi penurunan prevalensi ISPA di kawasan industri smelter.',
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
  event: 'KAMAKARYA ESSAY COMPETITION (KEC) 2026',
  subtheme: 'Sustainable Economy & Green Technology',
  title:
    'CYPHER: Integrasi Sistem Kendali Emisi Cerdas Berbasis Internet of Things untuk Hilirisasi dan Dekarbonisasi Menuju Net Zero Emissions Indonesia 2060',
  institution: 'UNIVERSITAS GADJAH MADA, YOGYAKARTA',
};

const MemberCard: React.FC<{
  member: Member;
  index: number;
  open: boolean;
  onToggle: () => void;
}> = ({ member, index, open, onToggle }) => {
  const frameRef = useRef<HTMLDivElement>(null);
  const target = useRef({ x: 0, y: 0, mx: 50, my: 50 });
  const shown = useRef({ x: 0, y: 0, mx: 50, my: 50 });
  const raf = useRef<number | null>(null);

  const tick = useCallback(() => {
    const t = target.current;
    const s = shown.current;
    const k = 0.14;

    s.x += (t.x - s.x) * k;
    s.y += (t.y - s.y) * k;
    s.mx += (t.mx - s.mx) * k;
    s.my += (t.my - s.my) * k;

    const el = frameRef.current;
    if (el) {
      el.style.transform = `perspective(1100px) rotateX(${s.x.toFixed(3)}deg) rotateY(${s.y.toFixed(3)}deg)`;
      el.style.setProperty('--mx', `${s.mx.toFixed(2)}%`);
      el.style.setProperty('--my', `${s.my.toFixed(2)}%`);
    }

    if (
      Math.abs(t.x - s.x) > 0.01 ||
      Math.abs(t.y - s.y) > 0.01 ||
      Math.abs(t.mx - s.mx) > 0.05 ||
      Math.abs(t.my - s.my) > 0.05
    ) {
      raf.current = requestAnimationFrame(tick);
    } else {
      raf.current = null;
    }
  }, []);

  const onMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = frameRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const nx = (e.clientX - rect.left) / rect.width - 0.5;
    const ny = (e.clientY - rect.top) / rect.height - 0.5;

    target.current = {
      x: -ny * 12,
      y: nx * 12,
      mx: ((e.clientX - rect.left) / rect.width) * 100,
      my: ((e.clientY - rect.top) / rect.height) * 100,
    };

    if (raf.current === null) raf.current = requestAnimationFrame(tick);
  };

  const onMouseLeave = () => {
    target.current = { x: 0, y: 0, mx: 50, my: 50 };
    if (raf.current === null) raf.current = requestAnimationFrame(tick);
  };

  return (
    <div
      className="anim-bob anim-bob-hold flex flex-col"
      style={{ animationDelay: `${index * 0.7}s` }}
    >
      <div
        ref={frameRef}
        onMouseMove={onMouseMove}
        onMouseLeave={onMouseLeave}
        onClick={onToggle}
        className="relative flex-1 rounded-3xl p-6 bg-white border border-slate-200 shadow-md hover:shadow-2xl transition-all duration-300 cursor-pointer overflow-hidden flex flex-col justify-between"
      >
        <div
          className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          style={{
            background: `radial-gradient(400px circle at var(--mx, 50%) var(--my, 50%), color-mix(in srgb, ${member.tint} 15%, transparent), transparent 70%)`,
          }}
        />

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
              onClick={(e) => {
                e.stopPropagation();
                onToggle();
              }}
              className="w-8 h-8 rounded-full glass-soft flex items-center justify-center text-lo hover:text-hi"
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
    </div>
  );
};

export const AboutView: React.FC<Props> = ({ onNavigate }) => {
  const [openCard, setOpenCard] = useState<number | null>(null);

  return (
    <div className="min-h-full flex flex-col p-6 md:p-10 max-w-6xl mx-auto w-full anim-rise">
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

      {/* Page Title */}
      <div className="text-center max-w-3xl mx-auto mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-700 font-mono text-[11px] font-bold mb-3">
          TIM PENELITI &amp; INOVASI CYPHER UGM
        </div>
        <h1 className="font-display text-[32px] md:text-[42px] font-extrabold text-hi leading-tight">
          Penulis &amp; Pengembang Gagasan CYPHER
        </h1>
        <p className="mt-3 text-[15px] text-mid leading-relaxed">
          Karya tulis ilmiah mahasiswa Universitas Gadjah Mada (UGM) Yogyakarta dalam ajang Kamakarya Essay Competition (KEC) 2026.
        </p>
      </div>

      {/* Competition Context Banner Card */}
      <div className="max-w-3xl mx-auto w-full mb-10">
        <div className="p-6 rounded-3xl bg-white border border-emerald-500/30 shadow-md flex flex-col sm:flex-row items-center sm:items-start gap-5 border-l-4 border-l-emerald-500">
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
            index={idx}
            open={openCard === idx}
            onToggle={() => setOpenCard(openCard === idx ? null : idx)}
          />
        ))}
      </div>
    </div>
  );
};
