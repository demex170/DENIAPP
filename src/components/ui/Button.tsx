import React from 'react';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'amber';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  icon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  icon,
  className = '',
  disabled,
  ...props
}) => {
  const baseClasses =
    'inline-flex items-center justify-center font-medium rounded-xl transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-800/40 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap active:scale-[0.98] select-none';

  const sizeClasses = {
    sm: 'text-xs py-1.5 px-3 gap-1.5 min-h-[36px]',
    md: 'text-sm py-2 px-4 gap-2 min-h-[42px]',
    lg: 'text-base py-2.5 px-6 gap-2.5 min-h-[48px]',
  };

  const variantClasses = {
    primary:
      'bg-stone-900 text-stone-50 hover:bg-stone-800 shadow-sm border border-stone-800',
    amber:
      'bg-amber-800 text-amber-50 hover:bg-amber-900 shadow-sm border border-amber-900',
    secondary:
      'bg-stone-100 text-stone-800 hover:bg-stone-200 border border-stone-200/80',
    outline:
      'bg-transparent text-stone-800 hover:bg-stone-100/70 border border-stone-300',
    ghost:
      'bg-transparent text-stone-700 hover:bg-stone-100 hover:text-stone-900',
    danger:
      'bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200',
  };

  return (
    <button
      className={`${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? <Loader2 className="w-4 h-4 animate-spin text-current" /> : icon}
      <span>{children}</span>
    </button>
  );
};
