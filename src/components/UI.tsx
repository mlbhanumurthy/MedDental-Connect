import React from 'react';
import { cn } from '../lib/utils';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', isLoading, children, ...props }, ref) => {
    const variants = {
      primary: 'bg-blue-600 text-white hover:bg-blue-500 shadow-lg shadow-blue-500/20',
      secondary: 'bg-white/5 text-white border border-white/10 hover:bg-white/10',
      outline: 'border-2 border-blue-600 text-blue-400 hover:bg-blue-600/10',
      ghost: 'text-slate-400 hover:bg-white/5 hover:text-white border border-transparent',
      danger: 'bg-red-600 text-white hover:bg-red-700',
    };

    const sizes = {
      sm: 'px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest',
      md: 'px-4 py-2 text-xs font-bold uppercase tracking-widest',
      lg: 'px-8 py-3 text-sm font-bold uppercase tracking-widest',
    };

    return (
      <button
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center transition-all duration-200 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]',
          variants[variant as keyof typeof variants] || variants.primary,
          sizes[size as keyof typeof sizes] || sizes.md,
          className
        )}
        disabled={isLoading || props.disabled}
        {...props}
      >
        {isLoading && (
          <svg className="w-4 h-4 mr-2 animate-spin" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
        )}
        {children}
      </button>
    );
  }
);

export const Card = ({ children, className, id }: { children: React.ReactNode; className?: string; id?: string }) => (
  <div id={id} className={cn('bg-[#161B22] rounded-3xl border border-white/5 p-6 shadow-xl', className)}>
    {children}
  </div>
);

export const Badge = ({ children, variant = 'neutral', className }: { children: React.ReactNode; variant?: 'neutral' | 'success' | 'warning' | 'error' | 'info'; className?: string }) => {
  const variants = {
    neutral: 'bg-white/5 text-slate-400 border border-white/5',
    success: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20',
    warning: 'bg-amber-500/10 text-amber-400 border border-amber-500/20',
    error: 'bg-red-500/10 text-red-400 border border-red-500/20',
    info: 'bg-blue-500/10 text-blue-400 border border-blue-500/20',
  };
  return (
    <span className={cn('px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest leading-none', variants[variant])}>
      {children}
    </span>
  );
};
