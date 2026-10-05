'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Calendar, Tag } from 'lucide-react';
import type { VehicleModel } from '@/src/types';

interface VehicleCardProps {
  model: VehicleModel;
  index?: number;
  onClick?: () => void;
  isSelected?: boolean;
}

/**
 * VehicleCard — Card de modelo de veículo no catálogo
 */
export function VehicleCard({ model, index = 0, onClick, isSelected = false }: VehicleCardProps) {
  const content = (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.04 }}
      whileHover={{ scale: 1.02, y: -3 }}
      className={`
        group relative rounded-2xl border backdrop-blur-xl overflow-hidden cursor-pointer
        transition-all duration-300
        ${isSelected
          ? 'border-[#00D4FF]/50 shadow-[0_8px_40px_rgba(0,212,255,0.20)] bg-[rgba(0,212,255,0.06)]'
          : 'border-white/8 bg-[rgba(10,15,30,0.70)] hover:border-[#00D4FF]/30 hover:shadow-[0_8px_40px_rgba(0,212,255,0.10)]'
        }
      `}
      onClick={onClick}
    >
      {/* Linha neon superior */}
      {isSelected && (
        <div className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-transparent via-[#00D4FF] to-transparent" />
      )}
      <div className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-transparent via-[#00D4FF]/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Imagem */}
      <div className="relative h-40 overflow-hidden bg-gradient-to-b from-white/3 to-transparent">
        <img
          src={model.catalogImage || 'https://img.magnific.com/fotos-premium/o-carro-misterioso-uma-apresentacao-coberta-por-um-pano-escuro-criando-usando-ferramentas-generativas-de-ia_852340-1273.jpg'}
          alt={`${model.manufacturer?.name ?? ''} ${model.name} ${model.manufactureYear}`}
          className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        {/* Overlay gradiente na imagem */}
        <div className="absolute inset-0 bg-gradient-to-t from-[rgba(6,10,24,0.85)] via-[rgba(6,10,24,0.20)] to-transparent" />

        {/* Ano badge */}
        <div className="absolute top-3 right-3 flex items-center gap-1 bg-black/60 backdrop-blur-sm border border-white/10 rounded-lg px-2 py-1">
          <Calendar size={10} className="text-[#00D4FF]" />
          <span className="text-white text-[10px] font-medium">{model.manufactureYear}</span>
        </div>
      </div>

      {/* Conteúdo */}
      <div className="p-4">
        <p className="text-white/40 text-[10px] uppercase tracking-widest mb-1 font-medium">
          {model.manufacturer?.name}
        </p>
        <h3 className="text-white font-semibold text-sm leading-snug group-hover:text-[#00D4FF] transition-colors">
          {model.name}
        </h3>
        {model.vehicleType && (
          <div className="flex items-center gap-1 mt-2">
            <Tag size={10} className="text-white/20" />
            <span className="text-white/30 text-[10px]">
              {model.vehicleType.category?.name} · {model.vehicleType.name}
            </span>
          </div>
        )}
      </div>
    </motion.div>
  );

  if (onClick) return content;

  return (
    <Link href={`/models/${model.id}`} aria-label={`Ver ${model.manufacturer?.name ?? ''} ${model.name} ${model.manufactureYear}`}>
      {content}
    </Link>
  );
}

// ---- Placeholder de imagem elegante ----
function VehicleImagePlaceholder({ name }: { name: string }) {
  return (
    <div className="flex flex-col items-center gap-2 text-white/10">
      <svg viewBox="0 0 60 30" className="w-24 h-12 fill-current">
        <rect x="2" y="10" width="56" height="16" rx="3" />
        <rect x="10" y="4" width="30" height="12" rx="4" />
        <circle cx="14" cy="26" r="5" />
        <circle cx="46" cy="26" r="5" />
      </svg>
      <span className="text-[10px] font-medium truncate max-w-[120px]">{name}</span>
    </div>
  );
}
