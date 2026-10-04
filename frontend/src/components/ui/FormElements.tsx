'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

// ---- Button ----
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'neon';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const VARIANT_CLASSES: Record<string, string> = {
  primary:
    'bg-gradient-to-r from-[#00D4FF] to-[#0099CC] text-[#060A18] font-semibold hover:opacity-90 shadow-[0_0_20px_rgba(0,212,255,0.25)]',
  secondary:
    'border border-white/15 text-white/80 hover:bg-white/8 hover:border-white/25 bg-transparent',
  ghost: 'text-white/60 hover:text-white hover:bg-white/6 bg-transparent',
  danger:
    'bg-red-500/15 border border-red-500/30 text-red-400 hover:bg-red-500/25 hover:border-red-500/50',
  neon: 'border border-[#B500FF]/40 text-[#B500FF] hover:bg-[#B500FF]/10 bg-transparent shadow-[0_0_15px_rgba(181,0,255,0.15)]',
};

const SIZE_CLASSES: Record<string, string> = {
  sm: 'h-8 px-3 text-xs rounded-lg',
  md: 'h-10 px-5 text-sm rounded-xl',
  lg: 'h-12 px-7 text-base rounded-xl',
};

export function Button({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  leftIcon,
  rightIcon,
  disabled,
  children,
  className = '',
  ...props
}: ButtonProps) {
  return (
    <motion.button
      whileHover={{ scale: disabled || isLoading ? 1 : 1.02 }}
      whileTap={{ scale: disabled || isLoading ? 1 : 0.97 }}
      disabled={disabled || isLoading}
      className={`
        inline-flex items-center justify-center gap-2
        transition-all duration-200 font-medium
        disabled:opacity-40 disabled:cursor-not-allowed
        ${VARIANT_CLASSES[variant]}
        ${SIZE_CLASSES[size]}
        ${className}
      `}
      {...(props as React.ComponentProps<typeof motion.button>)}
    >
      {isLoading ? (
        <Loader2 size={16} className="animate-spin" />
      ) : leftIcon ? (
        leftIcon
      ) : null}
      {children}
      {!isLoading && rightIcon}
    </motion.button>
  );
}

// ---- Input ----
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  leftIcon?: React.ReactNode;
}

export function Input({
  label,
  error,
  leftIcon,
  className = '',
  id,
  ...props
}: InputProps) {
  const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-');
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={inputId} className="text-xs font-medium text-white/50 uppercase tracking-wider">
          {label}
        </label>
      )}
      <div className="relative">
        {leftIcon && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30">
            {leftIcon}
          </span>
        )}
        <input
          id={inputId}
          className={`
            w-full h-10 rounded-xl border bg-[rgba(255,255,255,0.04)]
            border-white/10 text-white placeholder:text-white/25
            focus:outline-none focus:border-[#00D4FF]/50 focus:bg-[rgba(0,212,255,0.04)]
            transition-all duration-200 text-sm
            ${leftIcon ? 'pl-9 pr-4' : 'px-4'}
            ${error ? 'border-red-500/50 focus:border-red-500/70' : ''}
            ${className}
          `}
          {...props}
        />
      </div>
      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  );
}

// ---- Select ----
interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: { value: string; label: string }[];
  placeholder?: string;
}

export function Select({
  label,
  error,
  options,
  placeholder,
  className = '',
  id,
  ...props
}: SelectProps) {
  const selectId = id ?? label?.toLowerCase().replace(/\s+/g, '-');
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={selectId} className="text-xs font-medium text-white/50 uppercase tracking-wider">
          {label}
        </label>
      )}
      <select
        id={selectId}
        className={`
          w-full h-10 rounded-xl border bg-[rgba(255,255,255,0.04)]
          border-white/10 text-white
          focus:outline-none focus:border-[#00D4FF]/50
          transition-all duration-200 text-sm px-4
          ${error ? 'border-red-500/50' : ''}
          ${className}
        `}
        {...props}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map((opt) => (
          <option key={opt.value} value={opt.value} className="bg-[#0a0f1e] text-white">
            {opt.label}
          </option>
        ))}
      </select>
      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  );
}

// ---- Textarea ----
interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export function Textarea({ label, error, className = '', id, ...props }: TextareaProps) {
  const textId = id ?? label?.toLowerCase().replace(/\s+/g, '-');
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={textId} className="text-xs font-medium text-white/50 uppercase tracking-wider">
          {label}
        </label>
      )}
      <textarea
        id={textId}
        className={`
          w-full rounded-xl border bg-[rgba(255,255,255,0.04)]
          border-white/10 text-white placeholder:text-white/25
          focus:outline-none focus:border-[#00D4FF]/50
          transition-all duration-200 text-sm px-4 py-3 resize-none
          ${error ? 'border-red-500/50' : ''}
          ${className}
        `}
        {...props}
      />
      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  );
}
