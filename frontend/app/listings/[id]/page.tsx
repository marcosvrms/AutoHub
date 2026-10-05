'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Breadcrumb } from '@/src/components/ui/Breadcrumb';
import { GlassPanel } from '@/src/components/ui/GlassPanel';
import { LoadingState, EmptyState } from '@/src/components/ui/States';
import { Button } from '@/src/components/ui/FormElements';
import { MapPin, Calendar, MessageCircle, ShieldCheck } from 'lucide-react';
import { listingService } from '@/src/services/listing.service';
import { formatCurrency, formatDate } from '@/src/utils';
import type { Listing } from '@/src/types';

export default function ListingDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const [listing, setListing] = useState<Listing | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchListing() {
      try {
        const data = await listingService.findOne(id);
        setListing(data);
      } catch (err) {
        console.error('Failed to fetch listing', err);
      } finally {
        setIsLoading(false);
      }
    }
    
    if (id) void fetchListing();
  }, [id]);

  if (isLoading) {
    return (
      <div className="max-w-[1200px] mx-auto px-8 py-12">
        <LoadingState message="Carregando anúncio..." />
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="max-w-[1200px] mx-auto px-8 py-12">
        <EmptyState title="Anúncio não encontrado" message="Este anúncio foi removido ou está inativo." />
      </div>
    );
  }

  const imageUrl = listing.images?.[0]?.url || listing.vehicleModel?.catalogImage;

  return (
    <div className="max-w-[1200px] mx-auto px-8 py-12">
      <div className="mb-6">
        <Breadcrumb items={[
          { label: 'Marketplace', href: '/listings' },
          { label: listing.vehicleModel?.name || 'Anúncio' }
        ]} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Esquerda: Fotos e Descrição */}
        <div className="lg:col-span-2 flex flex-col gap-8">
          <GlassPanel padding="p-0" className="overflow-hidden">
            <div className="relative aspect-video bg-black/50">
              <img
                src={imageUrl || 'https://img.magnific.com/fotos-premium/o-carro-misterioso-uma-apresentacao-coberta-por-um-pano-escuro-criando-usando-ferramentas-generativas-de-ia_852340-1273.jpg'}
                alt={listing.title}
                className="w-full h-full object-cover"
              />
            </div>
          </GlassPanel>

          <GlassPanel>
            <h2 className="text-xl font-bold mb-4">Descrição do Veículo</h2>
            <p className="text-white/60 leading-relaxed whitespace-pre-wrap">
              {listing.description || 'O vendedor não adicionou uma descrição.'}
            </p>
          </GlassPanel>
        </div>

        {/* Direita: Preço, Infos e Ações */}
        <div className="flex flex-col gap-6">
          <GlassPanel neon="blue" className="sticky top-24">
            <h1 className="text-2xl font-bold mb-2 leading-tight">{listing.title}</h1>
            
            <div className="my-6">
              <p className="text-white/40 text-xs uppercase tracking-widest mb-1">Preço Anunciado</p>
              <p className="text-4xl font-black text-[#00D4FF]">{formatCurrency(listing.price)}</p>
            </div>

            <div className="flex flex-col gap-3 mb-8">
              <div className="flex items-center gap-3 text-white/60">
                <MapPin size={16} className="text-[#00D4FF]" />
                <span className="text-sm">{listing.city}, {listing.state} ({listing.country})</span>
              </div>
              {listing.vehicleModel && (
                <div className="flex items-center gap-3 text-white/60">
                  <Calendar size={16} className="text-[#00D4FF]" />
                  <span className="text-sm">Ano/Modelo: {listing.vehicleModel.manufactureYear}</span>
                </div>
              )}
              <div className="flex items-center gap-3 text-white/60">
                <ShieldCheck size={16} className="text-[#00D4FF]" />
                <span className="text-sm">Publicado em {formatDate(listing.createdAt)}</span>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <Button size="lg" className="w-full" leftIcon={<MessageCircle size={18} />}>
                Contatar Vendedor
              </Button>
              {listing.acceptsProposals && (
                <Button variant="secondary" size="lg" className="w-full">
                  Fazer uma Proposta
                </Button>
              )}
            </div>
          </GlassPanel>
        </div>
      </div>
    </div>
  );
}
