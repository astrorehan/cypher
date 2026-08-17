import React from 'react';

type Tone = { tone?: string };

/**
 * PrimaryButton — Glass-tinted tactile button with gradient & depth.
 */
export const PrimaryButton: React.FC<
  Tone & {
    children: React.ReactNode;
    onClick?: () => void;
    disabled?: boolean;
    full?: boolean;
    className?: string;
  }
> = ({
  children,
  onClick,
  disabled,
  tone = 'var(--color-core-500)',
  full = true,
  className = '',
}) => (
  <button
    onClick={onClick}
    disabled={disabled}
    style={
      disabled
        ? undefined
        : {
            background: `linear-gradient(175deg, color-mix(in srgb, ${tone} 90%, white), ${tone})`,
            boxShadow: `inset 0 1px 0 rgba(255,255,255,.25), 0 8px 22px -9px color-mix(in srgb, ${tone} 80%, transparent)`,
          }
    }
    className={`${full ? 'w-full' : ''} h-11 px-5 rounded-2xl text-[13.5px] font-semibold text-white
      inline-flex items-center justify-center gap-2 transition-all duration-200 cursor-pointer
      hover:brightness-110 active:scale-[.985]
      disabled:bg-black/[.05] disabled:text-lo disabled:shadow-none disabled:cursor-not-allowed
      disabled:hover:brightness-100 ${className}`}
  >
    {children}
  </button>
);

/** GhostButton — Frosted soft glass secondary button */
export const GhostButton: React.FC<{
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
}> = ({ children, onClick, className = '', disabled = false }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={`h-11 px-5 rounded-2xl text-[13.5px] font-medium text-mid glass-soft backdrop-blur-md cursor-pointer
      inline-flex items-center justify-center gap-2 transition-all duration-200
      hover:bg-black/[.07] hover:text-hi active:scale-[.985] disabled:opacity-40 disabled:cursor-not-allowed ${className}`}
  >
    {children}
  </button>
);

/** SectionLabel with color dot, uppercase tracking, and hairline rule */
export const SectionLabel: React.FC<{
  children: React.ReactNode;
  tone?: string;
}> = ({ children, tone = 'var(--color-lo)' }) => (
  <div className="flex items-center gap-2.5 pt-1">
    <span
      className="w-1.5 h-1.5 rounded-full shrink-0 animate-pulse"
      style={{ background: tone }}
    />
    <span className="text-[11.5px] font-semibold tracking-wider uppercase text-lo shrink-0">
      {children}
    </span>
    <span className="h-px flex-1 bg-black/[.09]" />
  </div>
);

/** Chip badge with custom tinted glass */
export const Chip: React.FC<{
  children: React.ReactNode;
  tone?: string;
  className?: string;
}> = ({ children, tone = 'var(--color-core-500)', className = '' }) => (
  <span
    className={`inline-flex items-center gap-1.5 h-[26px] px-2.5 rounded-full text-[11.5px] font-semibold whitespace-nowrap backdrop-blur-md ${className}`}
    style={{
      color: tone,
      background: `color-mix(in srgb, ${tone} 14%, transparent)`,
      boxShadow: `inset 0 0 0 1px color-mix(in srgb, ${tone} 26%, transparent), inset 0 1px 0 rgba(255,255,255,.1)`,
    }}
  >
    {children}
  </span>
);

/** Thin gradient meter bar with smooth transition */
export const Meter: React.FC<{
  value: number;
  max?: number;
  tone: string;
  danger?: boolean;
}> = ({ value, max = 100, tone, danger = false }) => {
  const c = danger ? 'var(--color-mode-intercept)' : tone;
  return (
    <div className="h-2 w-full rounded-full bg-black/[.08] overflow-hidden p-0.5">
      <div
        className="h-full rounded-full transition-[width] duration-500 ease-out"
        style={{
          width: `${Math.min(100, (value / max) * 100)}%`,
          background: `linear-gradient(90deg, color-mix(in srgb, ${c} 55%, transparent), ${c})`,
          boxShadow: `0 0 12px color-mix(in srgb, ${c} 60%, transparent)`,
        }}
      />
    </div>
  );
};
