import React from 'react';

/** Boîte à outils visuelle du back-office (sombre, accent rose Partiz). */

export const cx = (...classes: (string | false | null | undefined)[]) => classes.filter(Boolean).join(' ');

export type Tone = 'neutral' | 'accent' | 'ok' | 'warn' | 'crit' | 'muted';

const TONES: Record<Tone, string> = {
  neutral: 'border-white/10 bg-white/[0.06] text-zinc-200',
  accent: 'border-pink-500/30 bg-pink-500/15 text-pink-200',
  ok: 'border-emerald-500/30 bg-emerald-500/15 text-emerald-300',
  warn: 'border-amber-500/30 bg-amber-500/15 text-amber-300',
  crit: 'border-rose-500/30 bg-rose-500/15 text-rose-300',
  muted: 'border-white/10 bg-transparent text-zinc-500',
};

export const Chip: React.FC<{ tone?: Tone; title?: string; children: React.ReactNode }> = ({
  tone = 'neutral',
  title,
  children,
}) => (
  <span
    title={title}
    className={cx(
      'inline-flex items-center gap-1 whitespace-nowrap rounded-full border px-2 py-0.5 text-[11px] font-semibold',
      TONES[tone]
    )}
  >
    {children}
  </span>
);

export const Panel: React.FC<{ className?: string; children: React.ReactNode }> = ({ className, children }) => (
  <section className={cx('rounded-2xl border border-white/10 bg-white/[0.03] p-5 sm:p-6', className)}>{children}</section>
);

export const SectionTitle: React.FC<{ title: string; subtitle?: React.ReactNode; action?: React.ReactNode }> = ({
  title,
  subtitle,
  action,
}) => (
  <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
    <div>
      <h2 className="text-[15px] font-semibold text-white">{title}</h2>
      {subtitle && <p className="mt-1 max-w-2xl text-sm text-zinc-400">{subtitle}</p>}
    </div>
    {action}
  </div>
);

export const FieldLabel: React.FC<{ htmlFor?: string; children: React.ReactNode }> = ({ htmlFor, children }) => (
  <label htmlFor={htmlFor} className="mb-2 block text-[11px] font-semibold uppercase tracking-wider text-zinc-400">
    {children}
  </label>
);

export function Segmented<T extends string | number | null>({
  value,
  options,
  onChange,
  disabled,
  ariaLabel,
}: {
  value: T;
  options: { value: T; label: string; hint?: string }[];
  onChange: (value: T) => void;
  disabled?: boolean;
  ariaLabel: string;
}) {
  return (
    <div role="radiogroup" aria-label={ariaLabel} className="flex flex-wrap gap-1.5">
      {options.map(option => {
        const active = option.value === value;
        return (
          <button
            key={String(option.value)}
            type="button"
            role="radio"
            aria-checked={active}
            title={option.hint}
            disabled={disabled}
            onClick={() => onChange(option.value)}
            className={cx(
              'rounded-lg border px-3 py-1.5 text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-pink-400 disabled:cursor-not-allowed disabled:opacity-50',
              active
                ? 'border-pink-500 bg-pink-500 text-white'
                : 'border-white/10 bg-white/[0.04] text-zinc-300 hover:bg-white/[0.09]'
            )}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}

export const Toggle: React.FC<{
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: React.ReactNode;
  disabled?: boolean;
}> = ({ checked, onChange, label, disabled }) => (
  <button
    type="button"
    role="switch"
    aria-checked={checked}
    disabled={disabled}
    onClick={() => onChange(!checked)}
    className="inline-flex items-center gap-2.5 rounded-md text-sm text-zinc-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-pink-400 disabled:cursor-not-allowed disabled:opacity-50"
  >
    <span className={cx('relative h-5 w-9 shrink-0 rounded-full transition-colors', checked ? 'bg-pink-500' : 'bg-white/15')}>
      <span
        className={cx(
          'absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-all',
          checked ? 'left-[18px]' : 'left-0.5'
        )}
      />
    </span>
    {label}
  </button>
);

export const Button: React.FC<
  React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'ghost' | 'subtle' }
> = ({ variant = 'subtle', className, ...props }) => (
  <button
    {...props}
    className={cx(
      'inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-pink-400 disabled:cursor-not-allowed disabled:opacity-50',
      variant === 'primary' && 'bg-pink-500 text-white hover:bg-pink-600',
      variant === 'subtle' && 'border border-white/10 bg-white/[0.05] text-zinc-100 hover:bg-white/[0.1]',
      variant === 'ghost' && 'text-zinc-300 hover:bg-white/[0.06] hover:text-white',
      className
    )}
  />
);

export const formatNumber = (n: number) => n.toLocaleString('fr-FR', { maximumFractionDigits: 1 });
