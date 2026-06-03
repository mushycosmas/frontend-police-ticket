import React, { InputHTMLAttributes, forwardRef } from 'react';
interface Props extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
  variant?: 'box' | 'underline';
}
export const Input = forwardRef<HTMLInputElement, Props>(
  ({ label, error, icon, className = '', variant = 'box', ...rest }, ref) => {
    const baseClass = variant === 'box' ? 'input-field shadow-sm bg-white' : 'input-underline';
    
    return (
      <div className="w-full">
        {label && <label className="label">{label}</label>}
        <div className="relative">
          {icon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-muted">
              {icon}
            </div>
          )}
          <input
            ref={ref}
            className={`${baseClass} ${icon ? (variant === 'box' ? 'pl-10' : 'pl-8') : ''} ${
              error ? 'border-red-400 focus:ring-red-400' : ''
            } ${className}`}
            {...rest}
          />
      </div>
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
    );
  }
);
Input.displayName = 'Input';
