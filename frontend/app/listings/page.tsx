'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useSearchParams } from 'next/navigation';
import { Breadcrumb } from '@/src/components/ui/Breadcrumb';
import { GlassPanel } from '@/src/components/ui/GlassPanel';
import { LoadingState, EmptyState } from '@/src/components/ui/States';
import { Button } from '@/src/components/ui/FormElements';
import { MapPin, Calendar, ExternalLink } from 'lucide-react';
import { listingService } from '@/src/services/listing.service';
import { formatCurrency } from '@/src/utils';
import type { Listing } from '@/src/types';

export default function ListingsPage() {
  const searchParams = useSearchParams();
  const vehicleModelId = searchParams.get('vehicleModelId');

  const [listings, setListings] = useState<Listing[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchListings() {
      try {
        const query = vehicleModelId ? { vehicleModelId } : {};
        const response = await listingService.findAll(query);
        
        if (response.data) {
          setListings(response.data);
        }
      } catch (error) {
        console.error('Failed to fetch listings', error);
      } finally {
        setIsLoading(false);
      }
    }

    void fetchListings();
  }, [vehicleModelId]);

  if (isLoading) {
    return (
      <div className="max-w-[1600px] mx-auto px-8 py-12">
        <LoadingState message="Buscando anúncios..." />
      </div>
    );
  }

  return (
    <div className="max-w-[1600px] mx-auto px-8 py-12">
      <div className="mb-8">
        <Breadcrumb items={[
          { label: 'Marketplace', href: '/listings' },
          { label: 'Todos os Anúncios' }
        ]} />
        <h1 className="text-3xl font-bold mt-4 mb-2">Comprar Veículos</h1>
        <p className="text-white/40 max-w-2xl">
          Encontre as melhores ofertas e conecte-se com vendedores verificados no AutoHub.
        </p>
      </div>

      {/* Filtros (Futuro) */}
      <div className="flex gap-4 mb-8">
        <div className="px-4 py-2 rounded-lg border border-white/10 bg-white/5 text-sm text-white/50">
          Filtros de pesquisa serão implementados aqui...
        </div>
      </div>

      {listings.length === 0 ? (
        <EmptyState title="Nenhum anúncio encontrado" message="Tente ajustar seus filtros de busca." />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {listings.map((listing, idx) => (
            <ListingCard key={listing.id} listing={listing} index={idx} />
          ))}
        </div>
      )}
    </div>
  );
}

function ListingCard({ listing, index = 0 }: { listing: Listing; index?: number }) {
  const imageUrl = listing.images?.[0]?.url || listing.vehicleModel?.catalogImage;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.05 }}
      whileHover={{ y: -4 }}
    >
      <Link href={`/listings/${listing.id}`} className="block h-full">
        <GlassPanel hover padding="p-0" className="h-full flex flex-col overflow-hidden group">
          {/* Imagem */}
          <div className="relative h-48 bg-black/40 overflow-hidden">
            {imageUrl ? (
              <img
                src={imageUrl}
                alt={listing.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-white/20">
                Sem foto
              </div>
            )}
            <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-md px-2 py-1 rounded border border-white/10">
              <span className="text-xs font-bold text-[#00D4FF]">{formatCurrency(listing.price)}</span>
            </div>
          </div>

          {/* Info */}
          <div className="p-5 flex flex-col flex-1">
            <h3 className="text-white font-semibold text-lg line-clamp-2 mb-2 group-hover:text-[#00D4FF] transition-colors">
              {listing.title}
            </h3>
            
            <div className="flex flex-col gap-2 mt-auto">
              {listing.vehicleModel && (
                <div className="flex items-center gap-2 text-white/40 text-xs">
                  <Calendar size={12} />
                  <span>{listing.vehicleModel.manufactureYear}</span>
                </div>
              )}
              <div className="flex items-center gap-2 text-white/40 text-xs">
                <MapPin size={12} />
                <span>{listing.city}, {listing.state}</span>
              </div>
            </div>

            <div className="mt-5 pt-4 border-t border-white/10 flex items-center justify-between">
              <span className="text-white/30 text-[10px] uppercase tracking-widest">
                {listing.acceptsProposals ? 'Aceita proposta' : 'Apenas venda'}
              </span>
              <ExternalLink size={14} className="text-[#00D4FF] opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          </div>
        </GlassPanel>
      </Link>
    </motion.div>
  );
}
