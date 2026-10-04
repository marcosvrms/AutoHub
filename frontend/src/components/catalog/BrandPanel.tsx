'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Tag, Layers } from 'lucide-react';
import { GlassPanel } from '@/src/components/ui/GlassPanel';
import type { VehicleModel } from '@/src/types';

interface BrandPanelProps {
  model: VehicleModel;
}

/**
 * BrandPanel — Painel esquerdo do catálogo com fabricante, tipo e categoria
 */
export function BrandPanel({ model }: BrandPanelProps) {
  const tags = buildTags(model);

  return (
    <GlassPanel padding="p-5" className="h-full flex flex-col justify-between">
      {/* Top: Fabricante */}
      <div>
        {/* Logo placeholder */}
        <div className="w-14 h-14 rounded-2xl border border-white/10 bg-white/4 flex items-center justify-center mb-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]">
          <span className="text-2xl font-black text-white/40 tracking-tight">
            {model.manufacturer?.name?.charAt(0) ?? '?'}
          </span>
        </div>

        <p className="text-white/30 text-[10px] uppercase tracking-[0.2em] mb-1">
          {model.manufacturer?.name ?? 'Fabricante'}
        </p>

        <motion.h2
          key={model.id}
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-white font-bold text-xl leading-tight mb-0.5"
        >
          {model.name}
        </motion.h2>

        <p className="text-white/30 text-sm">{model.manufactureYear}</p>

        {/* Descrição */}
        {model.description && (
          <p className="text-white/40 text-xs leading-relaxed mt-4 line-clamp-4">
            {model.description}
          </p>
        )}

        {/* Tipo / Categoria */}
        <div className="mt-5 flex flex-col gap-2">
          {model.vehicleType?.category && (
            <div className="flex items-center gap-2">
              <Layers size={11} className="text-white/20" />
              <span className="text-white/35 text-xs">{model.vehicleType.category.name}</span>
            </div>
          )}
          {model.vehicleType && (
            <div className="flex items-center gap-2">
              <Tag size={11} className="text-white/20" />
              <span className="text-white/35 text-xs">{model.vehicleType.name}</span>
            </div>
          )}
        </div>
      </div>

      {/* Tags */}
      {tags.length > 0 && (
        <div className="mt-6">
          <p className="text-white/20 text-[9px] uppercase tracking-widest mb-2">Tags</p>
          <div className="flex flex-wrap gap-1.5">
            {tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center h-5 px-2 rounded-md bg-white/4 border border-white/8 text-white/30 text-[9px] font-semibold uppercase tracking-wide"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>
      )}
    </GlassPanel>
  );
}

/**
 * Gera tags a partir dos dados reais do modelo.
 * NÃO inventa tags sem suporte no backend.
 */
function buildTags(model: VehicleModel): string[] {
  const tags: string[] = [];
  if (model.vehicleType?.name) tags.push(model.vehicleType.name.toUpperCase());
  if (model.vehicleType?.category?.name) tags.push(model.vehicleType.category.name.toUpperCase());
  if (model.manufacturer?.name) tags.push(model.manufacturer.name.toUpperCase().replace(/\s+/g, ''));
  return tags;
}
