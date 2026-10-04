'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import type { Manufacturer } from '@/src/types';

interface BrandCardProps {
  manufacturer: Manufacturer;
  modelCount?: number;
  index?: number;
}

/**
 * BrandCard — Card de fabricante para a vitrine de marcas
 */
export function BrandCard({ manufacturer, modelCount, index = 0 }: BrandCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.05 }}
      whileHover={{ scale: 1.02, y: -3 }}
    >
      <Link
        href={`/brands/${manufacturer.id}`}
        aria-label={`Ver modelos de ${manufacturer.name}`}
        className="group block relative rounded-2xl border border-white/8 bg-[rgba(10,15,30,0.70)] backdrop-blur-xl overflow-hidden transition-all duration-300 hover:border-[#00D4FF]/30 hover:shadow-[0_8px_40px_rgba(0,212,255,0.12)]"
      >
        {/* Gradiente superior decorativo */}
        <div className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-transparent via-[#00D4FF]/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        <div className="p-7 flex flex-col items-center text-center gap-4">
          {/* Logo / Inicial */}
          <div className="w-16 h-16 rounded-2xl border border-white/10 bg-white/4 flex items-center justify-center group-hover:border-[#00D4FF]/20 group-hover:bg-[#00D4FF]/5 transition-all duration-300 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]">
            <span className="text-2xl font-black text-white/60 group-hover:text-[#00D4FF] transition-colors duration-300 tracking-tight">
              {manufacturer.name.charAt(0)}
            </span>
          </div>

          {/* Nome */}
          <div>
            <h3 className="text-white font-semibold text-sm tracking-wide group-hover:text-white transition-colors">
              {manufacturer.name}
            </h3>
            {modelCount !== undefined && (
              <p className="text-white/30 text-xs mt-1">
                {modelCount} {modelCount === 1 ? 'modelo' : 'modelos'}
              </p>
            )}
          </div>

          {/* CTA */}
          <div className="flex items-center gap-1.5 text-[#00D4FF]/0 group-hover:text-[#00D4FF] transition-all duration-300 text-xs font-medium">
            <span>Ver catálogo</span>
            <ArrowRight size={12} />
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
