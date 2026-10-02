import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightElement?: React.ReactNode;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  helperText,
  leftIcon,
  rightElement,
  className = '',
  id,
  ...props
}) => {
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className="w-full space-y-1.5 text-left">
      {label && (
        <label htmlFor={inputId} className="block text-xs font-medium text-stone-700">
          {label}
        </label>
      )}
      <div className="relative flex items-center">
        {leftIcon && (
          <div className="absolute left-3.5 text-stone-400 pointer-events-none flex items-center justify-center">
            {leftIcon}
          </div>
        )}
        <input
          id={inputId}
          className={`w-full px-3.5 py-2.5 text-sm bg-white border rounded-xl text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-800/20 focus:border-amber-800 transition-colors ${
            leftIcon ? 'pl-10' : ''
          } ${rightElement ? 'pr-11' : ''} ${
            error ? 'border-rose-400 bg-rose-50/20 focus:border-rose-500 focus:ring-rose-200' : 'border-stone-300 hover:border-stone-400'
          } ${className}`}
          {...props}
        />
        {rightElement && (
          <div className="absolute right-3 text-stone-400 flex items-center justify-center">
            {rightElement}
          </div>
        )}
      </div>
      {error && <p className="text-xs text-rose-600 font-medium">{error}</p>}
      {helperText && !error && <p className="text-xs text-stone-500">{helperText}</p>}
    </div>
  );
};

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Textarea: React.FC<TextareaProps> = ({
  label,
  error,
  helperText,
  className = '',
  id,
  rows = 3,
  ...props
}) => {
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className="w-full space-y-1.5 text-left">
      {label && (
        <label htmlFor={inputId} className="block text-xs font-medium text-stone-700">
          {label}
        </label>
      )}
      <textarea
        id={inputId}
        rows={rows}
        className={`w-full px-3.5 py-2.5 text-sm bg-white border rounded-xl text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-800/20 focus:border-amber-800 transition-colors resize-y ${
          error ? 'border-rose-400 bg-rose-50/20 focus:border-rose-500' : 'border-stone-300 hover:border-stone-400'
        } ${className}`}
        {...props}
      />
      {error && <p className="text-xs text-rose-600 font-medium">{error}</p>}
      {helperText && !error && <p className="text-xs text-stone-500">{helperText}</p>}
    </div>
  );
};

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: Array<{ value: string; label: string }>;
}

export const Select: React.FC<SelectProps> = ({
  label,
  error,
  options,
  className = '',
  id,
  ...props
}) => {
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className="w-full space-y-1.5 text-left">
      {label && (
        <label htmlFor={inputId} className="block text-xs font-medium text-stone-700">
          {label}
        </label>
      )}
      <select
        id={inputId}
        className={`w-full px-3.5 py-2.5 text-sm bg-white border rounded-xl text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-800/20 focus:border-amber-800 transition-colors ${
          error ? 'border-rose-400' : 'border-stone-300 hover:border-stone-400'
        } ${className}`}
        {...props}
      >
        {options.map(opt => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && <p className="text-xs text-rose-600 font-medium">{error}</p>}
    </div>
  );
};
