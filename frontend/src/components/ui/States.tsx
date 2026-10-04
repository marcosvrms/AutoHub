'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { AlertCircle, RefreshCw, Inbox, Loader2 } from 'lucide-react';

// ---- Loading State ----
interface LoadingStateProps {
  message?: string;
  count?: number;
}

export function LoadingState({ message = 'Carregando...', count = 3 }: LoadingStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-16">
      <Loader2 size={32} className="text-[#00D4FF] animate-spin" />
      <p className="text-white/40 text-sm">{message}</p>
    </div>
  );
}

export function SkeletonCard() {
  return (
    <div className="rounded-xl border border-white/8 bg-[rgba(10,15,30,0.60)] overflow-hidden animate-pulse">
      <div className="h-48 bg-white/5" />
      <div className="p-4 space-y-3">
        <div className="h-4 bg-white/8 rounded w-3/4" />
        <div className="h-3 bg-white/5 rounded w-1/2" />
      </div>
    </div>
  );
}

export function SkeletonGrid({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}

// ---- Error State ----
interface ErrorStateProps {
  message?: string;
  onRetry?: () => void;
}

export function ErrorState({
  message = 'Não foi possível carregar as informações.',
  onRetry,
}: ErrorStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col items-center justify-center gap-4 py-16"
    >
      <div className="w-14 h-14 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center">
        <AlertCircle size={24} className="text-red-400" />
      </div>
      <p className="text-white/60 text-sm max-w-xs text-center">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="flex items-center gap-2 text-xs text-[#00D4FF] hover:text-white transition-colors"
        >
          <RefreshCw size={14} />
          Tentar novamente
        </button>
      )}
    </motion.div>
  );
}

// ---- Empty State ----
interface EmptyStateProps {
  title?: string;
  message?: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
}

export function EmptyState({
  title = 'Nenhum resultado encontrado',
  message = 'Não há dados para exibir no momento.',
  icon,
  action,
}: EmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col items-center justify-center gap-4 py-16"
    >
      <div className="w-14 h-14 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
        {icon ?? <Inbox size={24} className="text-white/30" />}
      </div>
      <div className="text-center">
        <p className="text-white/60 text-sm font-medium">{title}</p>
        <p className="text-white/30 text-xs mt-1">{message}</p>
      </div>
      {action}
    </motion.div>
  );
}

// ---- Confirm Dialog ----
interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
  isLoading?: boolean;
  danger?: boolean;
}

export function ConfirmDialog({
  isOpen,
  title,
  message,
  confirmLabel = 'Confirmar',
  cancelLabel = 'Cancelar',
  onConfirm,
  onCancel,
  isLoading = false,
  danger = false,
}: ConfirmDialogProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
      {/* Overlay */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        onClick={onCancel}
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
      />
      {/* Dialog */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="relative z-10 w-full max-w-sm rounded-2xl border border-white/10 bg-[rgba(10,15,30,0.95)] p-6 shadow-2xl"
      >
        <h3 className="text-white font-semibold text-base mb-2">{title}</h3>
        <p className="text-white/50 text-sm mb-6 leading-relaxed">{message}</p>
        <div className="flex gap-3 justify-end">
          <button
            onClick={onCancel}
            className="h-9 px-5 rounded-xl border border-white/15 text-white/70 text-sm hover:bg-white/6 transition-colors"
          >
            {cancelLabel}
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className={`
              h-9 px-5 rounded-xl text-sm font-medium transition-colors
              disabled:opacity-50 flex items-center gap-2
              ${danger
                ? 'bg-red-500/20 border border-red-500/40 text-red-400 hover:bg-red-500/30'
                : 'bg-[#00D4FF]/15 border border-[#00D4FF]/30 text-[#00D4FF] hover:bg-[#00D4FF]/25'
              }
            `}
          >
            {isLoading && <Loader2 size={14} className="animate-spin" />}
            {confirmLabel}
          </button>
        </div>
      </motion.div>
    </div>
  );
}

// ---- Modal ----
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  maxWidth?: string;
}

export function Modal({
  isOpen,
  onClose,
  title,
  children,
  maxWidth = 'max-w-lg',
}: ModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className={`relative z-10 w-full ${maxWidth} rounded-2xl border border-white/10 bg-[rgba(10,15,30,0.95)] shadow-2xl overflow-hidden`}
      >
        {title && (
          <div className="px-6 py-4 border-b border-white/8">
            <h2 className="text-white font-semibold text-base">{title}</h2>
          </div>
        )}
        <div className="p-6">{children}</div>
      </motion.div>
    </div>
  );
}

// ---- Status Badge ----
interface BadgeProps {
  label: string;
  variant?: 'blue' | 'purple' | 'green' | 'red' | 'amber' | 'gray';
}

const BADGE_VARIANTS: Record<string, string> = {
  blue: 'bg-[#00D4FF]/10 border-[#00D4FF]/20 text-[#00D4FF]',
  purple: 'bg-[#B500FF]/10 border-[#B500FF]/20 text-[#B500FF]',
  green: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400',
  red: 'bg-red-500/10 border-red-500/20 text-red-400',
  amber: 'bg-amber-500/10 border-amber-500/20 text-amber-400',
  gray: 'bg-white/5 border-white/10 text-white/40',
};

export function Badge({ label, variant = 'gray' }: BadgeProps) {
  return (
    <span
      className={`
        inline-flex items-center h-5 px-2 rounded-md border text-[10px] font-semibold tracking-wide uppercase
        ${BADGE_VARIANTS[variant]}
      `}
    >
      {label}
    </span>
  );
}
