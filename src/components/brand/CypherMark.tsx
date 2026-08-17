import React from 'react';

export const CypherMark: React.FC<{ className?: string }> = ({ className = 'w-6 h-6' }) => (
  <svg
    viewBox="0 0 48 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <defs>
      <linearGradient id="cypherGrad" x1="4" y1="4" x2="44" y2="44" gradientUnits="userSpaceOnUse">
        <stop stopColor="#0284c7" />
        <stop offset="0.5" stopColor="#06b6d4" />
        <stop offset="1" stopColor="#10b981" />
      </linearGradient>
      <linearGradient id="cypherGlow" x1="24" y1="8" x2="24" y2="40" gradientUnits="userSpaceOnUse">
        <stop stopColor="#38bdf8" />
        <stop offset="1" stopColor="#059669" />
      </linearGradient>
    </defs>

    {/* Outer Energy Shell */}
    <circle cx="24" cy="24" r="20" stroke="url(#cypherGrad)" strokeWidth="3" strokeDasharray="6 3" />

    {/* Thermoelectric Harvest Core (Delta-T conversion Seebeck crystal) */}
    <path
      d="M24 10L35 18V30L24 38L13 30V18L24 10Z"
      fill="url(#cypherGrad)"
      fillOpacity="0.18"
      stroke="url(#cypherGlow)"
      strokeWidth="2"
      strokeLinejoin="round"
    />

    {/* Energy Lightning / Filtration Vortex */}
    <path
      d="M25 15L17 26H24L23 33L31 22H24L25 15Z"
      fill="url(#cypherGrad)"
      stroke="#ffffff"
      strokeWidth="1.2"
      strokeLinejoin="round"
    />
  </svg>
);

export const SineroMark = CypherMark;
export const CoreMark = CypherMark;
