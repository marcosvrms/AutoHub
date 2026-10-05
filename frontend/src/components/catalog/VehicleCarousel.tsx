'use client';

import React, { useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react';
import type { VehicleModel } from '@/src/types';

interface VehicleCarouselProps {
  models: VehicleModel[];
  selectedId?: string;
  onSelect: (model: VehicleModel) => void;
  isVisible: boolean;
}

/**
 * VehicleCarousel — Carrossel horizontal inferior do catálogo (inspiração GT7)
 */
export function VehicleCarousel({
  models,
  selectedId,
  onSelect,
  isVisible,
}: VehicleCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollBy = (dir: 'left' | 'right') => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollBy({ left: dir === 'left' ? -320 : 320, behavior: 'smooth' });
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 80 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 80 }}
          transition={{ duration: 0.45, ease: [0.25, 1, 0.5, 1] }}
          className="relative"
        >
          {/* Header do carrossel */}
          <div className="flex items-center justify-between mb-4 px-1">
            <p className="text-white/40 text-[10px] font-semibold uppercase tracking-[0.2em]">
              Catálogo — {models.length} {models.length === 1 ? 'modelo' : 'modelos'}
            </p>
            <div className="flex gap-2">
              <button
                aria-label="Rolar para a esquerda"
                onClick={() => scrollBy('left')}
                className="w-7 h-7 rounded-lg border border-white/10 flex items-center justify-center text-white/40 hover:text-white hover:border-white/20 hover:bg-white/5 transition-all"
              >
                <ChevronLeft size={14} />
              </button>
              <button
                aria-label="Rolar para a direita"
                onClick={() => scrollBy('right')}
                className="w-7 h-7 rounded-lg border border-white/10 flex items-center justify-center text-white/40 hover:text-white hover:border-white/20 hover:bg-white/5 transition-all"
              >
                <ChevronRight size={14} />
              </button>
            </div>
          </div>

          {/* Scrollable area */}
          <div
            ref={scrollRef}
            className="flex gap-3 overflow-x-auto pb-2 scroll-smooth"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {models.map((model) => {
              const isSelected = model.id === selectedId;
              return (
                <motion.button
                  key={model.id}
                  whileHover={{ scale: 1.03, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => onSelect(model)}
                  aria-label={`Selecionar ${model.manufacturer?.name ?? ''} ${model.name} ${model.manufactureYear}`}
                  aria-pressed={isSelected}
                  className={`
                    flex-none w-[160px] rounded-xl border overflow-hidden text-left transition-all duration-300
                    ${isSelected
                      ? 'border-[#00D4FF]/60 shadow-[0_0_20px_rgba(0,212,255,0.25)] bg-[rgba(0,212,255,0.06)]'
                      : 'border-white/8 bg-[rgba(10,15,30,0.80)] hover:border-white/20'
                    }
                  `}
                >
                  {/* Thumb imagem */}
                  <div className="h-[88px] relative overflow-hidden bg-white/3">
                    <img
                      src={model.catalogImage || 'https://img.magnific.com/fotos-premium/o-carro-misterioso-uma-apresentacao-coberta-por-um-pano-escuro-criando-usando-ferramentas-generativas-de-ia_852340-1273.jpg'}
                      alt={model.name}
                      className="w-full h-full object-cover object-center"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[rgba(6,10,24,0.8)] to-transparent" />
                    {isSelected && (
                      <div className="absolute inset-x-0 top-0 h-0.5 bg-[#00D4FF]" />
                    )}
                  </div>

                  {/* Info */}
                  <div className="px-3 py-2.5">
                    <p className="text-white/30 text-[9px] uppercase tracking-widest font-medium truncate">
                      {model.manufacturer?.name}
                    </p>
                    <p className={`text-xs font-semibold truncate mt-0.5 ${isSelected ? 'text-[#00D4FF]' : 'text-white/80'}`}>
                      {model.name}
                    </p>
                    <div className="flex items-center gap-1 mt-1">
                      <Calendar size={9} className="text-white/20" />
                      <span className="text-white/30 text-[9px]">{model.manufactureYear}</span>
                    </div>
                  </div>
                </motion.button>
              );
            })}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
