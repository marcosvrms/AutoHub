'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { GlassPanel } from '@/src/components/ui/GlassPanel';
import type { VehicleModel } from '@/src/types';
import type { Record as RRecord } from 'typescript';

interface TechnicalSpecsPanelProps {
  /** Atributos reais vindos da API: { [nome]: valor_string } */
  apiAttributes?: Record<string, string>;
  /**
   * !! DADOS MOCKADOS !!
   * Passados apenas quando os dados reais ainda não estão disponíveis.
   */
  mockAttributes?: Record<string, string>;
  model: VehicleModel;
}

/**
 * TechnicalSpecsPanel — Painel dinâmico de especificações técnicas.
 *
 * Renderiza QUALQUER conjunto de atributos retornado pelo backend.
 * NÃO assume campos fixos. Cada atributo é renderizado dinamicamente.
 *
 * Hierarquia de exibição:
 * 1. apiAttributes (dados reais do backend)
 * 2. mockAttributes (demonstração, apenas se apiAttributes estiver vazio)
 */
export function TechnicalSpecsPanel({
  apiAttributes,
  mockAttributes,
  model,
}: TechnicalSpecsPanelProps) {
  const isApiData = Boolean(apiAttributes && Object.keys(apiAttributes).length > 0);
  const specs = isApiData ? apiAttributes! : (mockAttributes ?? {});
  const entries = Object.entries(specs);

  return (
    <GlassPanel neon="blue" padding="p-5" className="h-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <p className="text-[#00D4FF] text-[9px] font-semibold uppercase tracking-[0.25em]">
            Technical Specs
          </p>
          {!isApiData && mockAttributes && (
            <p className="text-amber-500/60 text-[8px] uppercase tracking-widest mt-0.5">
              ⚠ Dados demonstração
            </p>
          )}
        </div>
        <div className="w-5 h-5 rounded-md bg-[#00D4FF]/10 border border-[#00D4FF]/20 flex items-center justify-center">
          <div className="w-1.5 h-1.5 rounded-full bg-[#00D4FF] animate-pulse" />
        </div>
      </div>

      {/* Specs */}
      {entries.length === 0 ? (
        <div className="flex items-center justify-center py-8">
          <p className="text-white/20 text-xs text-center">
            Nenhum atributo técnico cadastrado para este modelo.
          </p>
        </div>
      ) : (
        <div className="flex flex-col divide-y divide-white/4">
          {entries.map(([name, value], idx) => (
            <motion.div
              key={name}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.04 }}
              className="flex items-center justify-between py-2.5 group"
            >
              <span className="text-white/40 text-xs font-medium group-hover:text-white/60 transition-colors">
                {name}
              </span>
              <span className="text-white text-xs font-semibold text-right max-w-[55%] truncate">
                {value}
              </span>
            </motion.div>
          ))}
        </div>
      )}

      {/* Footer */}
      <div className="mt-4 pt-4 border-t border-white/5">
        <p className="text-white/15 text-[9px] text-center">
          {model.manufacturer?.name} · {model.name} · {model.manufactureYear}
        </p>
      </div>
    </GlassPanel>
  );
}
