'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ExternalLink, MapPin, Clock, CheckCircle } from 'lucide-react';
import { TopStatusBar } from '@/src/components/catalog/TopStatusBar';
import { BrandPanel } from '@/src/components/catalog/BrandPanel';
import { TechnicalSpecsPanel } from '@/src/components/catalog/TechnicalSpecsPanel';
import { VehicleCarousel } from '@/src/components/catalog/VehicleCarousel';
import { GlassPanel } from '@/src/components/ui/GlassPanel';
import { Button } from '@/src/components/ui/FormElements';
import { LoadingState, ErrorState, EmptyState } from '@/src/components/ui/States';
import { vehicleModelService } from '@/src/services/vehicle-model.service';
import { useAuth } from '@/src/contexts/AuthContext';
import { formatCurrency, extractErrorMessage } from '@/src/utils';
import type { VehicleModel } from '@/src/types';
import Link from 'next/link';

/**
 * CatalogView — Tela principal do catálogo de veículos (inspiração GT7)
 *
 * Estrutura:
 * ┌─────────────────────────────────────────────────────┐
 * │  TopStatusBar                                        │
 * ├────────────┬─────────────────────────┬──────────────┤
 * │ BrandPanel │  VehicleImage (centro)  │  TechSpecs   │
 * ├────────────┴─────────────────────────┴──────────────┤
 * │  VehicleCarousel (aparece ao interagir)             │
 * └─────────────────────────────────────────────────────┘
 */
export function CatalogView() {
  const { user } = useAuth();
  const [models, setModels] = useState<VehicleModel[]>([]);
  const [selected, setSelected] = useState<VehicleModel | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [carouselVisible, setCarouselVisible] = useState(false);

  const load = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await vehicleModelService.findAll();
      if (data.length > 0) {
        setModels(data);
        setSelected(data[0]);
      }
    } catch (err) {
      console.error('Failed to load catalog', err);
      setError('Falha ao carregar o catálogo.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const handleSelect = (model: VehicleModel) => {
    setSelected(model);
  };

  const toggleCarousel = () => {
    setCarouselVisible((v) => !v);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
        <LoadingState message="Carregando catálogo..." />
      </div>
    );
  }

  if (models.length === 0) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
        <EmptyState
          title="Catálogo vazio"
          message="Nenhum modelo de veículo foi cadastrado ainda."
        />
      </div>
    );
  }

  // Especificações para o modelo selecionado
  const apiSpecs: Record<string, string> | undefined = selected?.attributes?.length
    ? Object.fromEntries(
        selected.attributes
          .filter((a) => a.type === 'TEXT')
          .map((a) => [a.name, a.options?.[0]?.value ?? '—'])
      )
    : undefined;

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] overflow-hidden">

      {/* ---- TOP STATUS BAR ---- */}
      <TopStatusBar model={selected} user={user} />

      {/* ---- ÁREA PRINCIPAL ---- */}
      <div className="flex-1 flex overflow-hidden">

        {/* ---- LEFT: Brand Panel ---- */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
          className="w-[220px] shrink-0 p-4 border-r border-white/6"
        >
          {selected && <BrandPanel model={selected} />}
        </motion.div>

        {/* ---- CENTER: Vehicle Image ---- */}
        <div className="flex-1 flex flex-col relative overflow-hidden">
          {/* Vehicle image area */}
          <AnimatePresence mode="wait">
            <motion.div
              key={selected?.id ?? 'empty'}
              initial={{ opacity: 0, scale: 1.03 }}
              animate={{
                opacity: 1,
                scale: carouselVisible ? 0.85 : 1,
                y: carouselVisible ? -20 : 0,
              }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5, ease: [0.25, 1, 0.5, 1] }}
              className="flex-1 relative"
            >
              <img
                  src={selected?.catalogImage || 'https://img.magnific.com/fotos-premium/o-carro-misterioso-uma-apresentacao-coberta-por-um-pano-escuro-criando-usando-ferramentas-generativas-de-ia_852340-1273.jpg'}
                  alt={`${selected?.manufacturer?.name ?? ''} ${selected?.name ?? ''} ${selected?.manufactureYear ?? ''}`}
                  className="w-full h-full object-contain object-center drop-shadow-2xl"
                  style={{ filter: 'drop-shadow(0 20px 60px rgba(0,212,255,0.15))' }}
                />

              {/* Gradiente inferior */}
              <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[rgba(6,10,24,1)] to-transparent" />
            </motion.div>
          </AnimatePresence>

          {/* ---- Botão para abrir catálogo ---- */}
          <div className="pb-4 flex flex-col items-center gap-3 relative z-10">
            {selected && (
              <div className="flex items-center gap-3">
                <Link href={`/models/${selected.id}`}>
                  <Button variant="secondary" size="sm" rightIcon={<ExternalLink size={12} />}>
                    Ver detalhes
                  </Button>
                </Link>
                <Link href={`/listings?vehicleModelId=${selected.id}`}>
                  <Button variant="primary" size="sm">
                    Ver anúncios
                  </Button>
                </Link>
              </div>
            )}

            <button
              onClick={toggleCarousel}
              aria-expanded={carouselVisible}
              aria-label={carouselVisible ? 'Fechar catálogo' : 'Abrir catálogo de modelos'}
              className="flex items-center gap-1.5 text-white/30 hover:text-white/60 transition-colors text-xs"
            >
              <motion.div animate={{ rotate: carouselVisible ? 180 : 0 }} transition={{ duration: 0.3 }}>
                <ChevronDown size={14} />
              </motion.div>
              {carouselVisible ? 'Fechar catálogo' : 'Catálogo de modelos'}
            </button>
          </div>

          {/* ---- CARROSSEL INFERIOR ---- */}
          <div className="px-4 pb-4">
            <VehicleCarousel
              models={models}
              selectedId={selected?.id}
              onSelect={handleSelect}
              isVisible={carouselVisible}
            />
          </div>
        </div>

        {/* ---- RIGHT: Technical Specs ---- */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
          className="w-[240px] shrink-0 p-4 border-l border-white/6 flex flex-col gap-4"
        >
          {selected && (
            <>
              <TechnicalSpecsPanel
                model={selected}
                apiAttributes={apiSpecs}
              />

              {/* Price Panel — preparado para integração real com Listings */}
              <PricePanel model={selected} />
            </>
          )}
        </motion.div>
      </div>
    </div>
  );
}

// ---- Price Panel ----
// NOTA: O preço real é de um Listing, não do VehicleModel.
// Aqui exibimos um placeholder preparado para futura integração.
function PricePanel({ model }: { model: VehicleModel }) {
  return (
    <GlassPanel neon="purple" padding="p-4">
      <p className="text-[#B500FF] text-[9px] font-semibold uppercase tracking-[0.25em] mb-3">
        Market
      </p>
      <div className="flex flex-col gap-2">
        <Link
          href={`/listings?vehicleModelId=${model.id}`}
          className="group flex items-center justify-between py-2 px-3 rounded-lg bg-white/3 border border-white/6 hover:border-[#B500FF]/20 hover:bg-[#B500FF]/5 transition-all"
        >
          <div>
            <p className="text-white/40 text-[9px] uppercase tracking-widest">Anúncios</p>
            <p className="text-white text-sm font-semibold mt-0.5">Ver ofertas</p>
          </div>
          <ExternalLink size={12} className="text-white/20 group-hover:text-[#B500FF] transition-colors" />
        </Link>

        <Link
          href="/sell"
          className="group flex items-center justify-center gap-2 h-9 rounded-lg border border-[#B500FF]/30 text-[#B500FF] text-xs font-medium hover:bg-[#B500FF]/10 transition-all"
        >
          Anunciar veículo
        </Link>
      </div>
    </GlassPanel>
  );
}
