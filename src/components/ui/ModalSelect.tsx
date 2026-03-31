import React from 'react';

type ModalSelectProps = React.PropsWithChildren<React.SelectHTMLAttributes<HTMLSelectElement>> & {
  label: string;
  hint?: string;
};

export function ModalSelect({ label, hint, className = '', children, ...props }: ModalSelectProps) {
  return (
    <label className="block space-y-1.5">
      <span className="text-[11px] font-bold text-zinc-500 uppercase tracking-[0.16em]">{label}</span>
      <select
        className={`w-full h-11 px-3.5 bg-zinc-50 border border-zinc-200 rounded-xl text-sm text-zinc-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/15 disabled:text-zinc-400 disabled:bg-zinc-100 ${className}`.trim()}
        {...props}
      >
        {children}
      </select>
      {hint && <span className="block text-[11px] text-zinc-400">{hint}</span>}
    </label>
  );
}
