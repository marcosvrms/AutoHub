'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface GlassPanelProps {
  children: React.ReactNode;
  className?: string;
  neon?: 'blue' | 'purple' | 'none';
  hover?: boolean;
  padding?: string;
  as?: React.ElementType;
}

/**
 * GlassPanel — Painel glassmorphism padrão do AutoHub
 */
export function GlassPanel({
  children,
  className = '',
  neon = 'none',
  hover = false,
  padding = 'p-5',
  as: Tag = 'div',
}: GlassPanelProps) {
  const neonBorder = {
    blue: 'border-[#00D4FF]/20 shadow-[0_0_20px_rgba(0,212,255,0.08)]',
    purple: 'border-[#B500FF]/20 shadow-[0_0_20px_rgba(181,0,255,0.08)]',
    none: 'border-white/8',
  }[neon];

  const hoverClass = hover
    ? 'transition-all duration-300 hover:border-[#00D4FF]/30 hover:shadow-[0_0_30px_rgba(0,212,255,0.12)] hover:-translate-y-0.5'
    : '';

  return (
    <Tag
      className={`
        relative rounded-xl border backdrop-blur-xl
        bg-[rgba(10,15,30,0.70)]
        ${neonBorder} ${hoverClass} ${padding} ${className}
      `}
    >
      {children}
    </Tag>
  );
}

/**
 * GlassPanelAnimated — Com animação de entrada via Framer Motion
 */
export function GlassPanelAnimated({
  children,
  className = '',
  delay = 0,
  neon = 'none',
  padding = 'p-5',
}: GlassPanelProps & { delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      className={`
        relative rounded-xl border backdrop-blur-xl
        bg-[rgba(10,15,30,0.70)]
        ${neon === 'blue' ? 'border-[#00D4FF]/20' : neon === 'purple' ? 'border-[#B500FF]/20' : 'border-white/8'}
        ${padding} ${className}
      `}
    >
      {children}
    </motion.div>
  );
}
