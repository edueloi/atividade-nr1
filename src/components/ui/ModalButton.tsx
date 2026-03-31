import React from 'react';

type ModalButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
type ModalButtonSize = 'sm' | 'md';

type ModalButtonProps = React.PropsWithChildren<React.ButtonHTMLAttributes<HTMLButtonElement>> & {
  variant?: ModalButtonVariant;
  size?: ModalButtonSize;
  fullWidth?: boolean;
  iconLeft?: React.ReactNode;
  iconRight?: React.ReactNode;
};

const VARIANT_CLASS: Record<ModalButtonVariant, string> = {
  primary: 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-lg shadow-emerald-100 disabled:bg-zinc-200 disabled:text-zinc-400 disabled:shadow-none',
  secondary: 'bg-zinc-100 text-zinc-700 hover:bg-zinc-200 disabled:bg-zinc-100 disabled:text-zinc-400',
  ghost: 'bg-white border border-zinc-200 text-zinc-700 hover:bg-zinc-50 disabled:bg-zinc-100 disabled:text-zinc-400',
  danger: 'bg-rose-50 text-rose-700 hover:bg-rose-100 disabled:bg-zinc-100 disabled:text-zinc-400',
};

const SIZE_CLASS: Record<ModalButtonSize, string> = {
  sm: 'h-9 px-3 text-sm rounded-lg',
  md: 'h-10 px-4 text-sm rounded-xl',
};

export function ModalButton({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  iconLeft,
  iconRight,
  className = '',
  children,
  type = 'button',
  ...props
}: ModalButtonProps) {
  return (
    <button
      type={type}
      className={`inline-flex items-center justify-center gap-2 font-bold transition-all disabled:cursor-not-allowed ${VARIANT_CLASS[variant]} ${SIZE_CLASS[size]} ${fullWidth ? 'w-full' : ''} ${className}`.trim()}
      {...props}
    >
      {iconLeft}
      {children}
      {iconRight}
    </button>
  );
}
