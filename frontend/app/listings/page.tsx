'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useSearchParams, useRouter } from 'next/navigation';
import { Breadcrumb } from '@/src/components/ui/Breadcrumb';
import { GlassPanel } from '@/src/components/ui/GlassPanel';
import { LoadingState, EmptyState } from '@/src/components/ui/States';
import { Input, Select } from '@/src/components/ui/FormElements';
import { MapPin, Calendar, ExternalLink, Search, SlidersHorizontal, X } from 'lucide-react';
import { listingService } from '@/src/services/listing.service';
import { manufacturerService } from '@/src/services/manufacturer.service';
import { formatCurrency } from '@/src/utils';
import type { Listing, Manufacturer } from '@/src/types';

const PLACEHOLDER_IMG = 'https://img.magnific.com/fotos-premium/o-carro-misterioso-uma-apresentacao-coberta-por-um-pano-escuro-criando-usando-ferramentas-generativas-de-ia_852340-1273.jpg';

export default function ListingsPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const vehicleModelId = searchParams.get('vehicleModelId');

  const [listings, setListings] = useState<Listing[]>([]);
  const [manufacturers, setManufacturers] = useState<Manufacturer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(true);

  // Filtros
  const [filters, setFilters] = useState({
    q: '',
    manufacturerId: '',
    minPrice: '',
    maxPrice: '',
    state: '',
    city: '',
    sortBy: 'createdAt' as 'price' | 'year' | 'createdAt',
    sortOrder: 'desc' as 'asc' | 'desc',
  });

  useEffect(() => {
    manufacturerService.findAll().then(setManufacturers).catch(() => {});
  }, []);

  const fetchListings = useCallback(async () => {
    setIsLoading(true);
    try {
      const params: Record<string, unknown> = {};

      if (vehicleModelId) params.vehicleModelId = vehicleModelId;
      if (filters.q.trim()) params.q = filters.q.trim();
      if (filters.manufacturerId) params.manufacturerId = filters.manufacturerId;
      if (filters.minPrice) params.minPrice = Number(filters.minPrice);
      if (filters.maxPrice) params.maxPrice = Number(filters.maxPrice);
      if (filters.state.trim()) params.state = filters.state.trim();
      if (filters.city.trim()) params.city = filters.city.trim();
      params.sortBy = filters.sortBy;
      params.sortOrder = filters.sortOrder;
      params.limit = 50;

      const response = await listingService.findAll(params);
      if (response.data) {
        setListings(response.data);
      }
    } catch (error) {
      console.error('Failed to fetch listings', error);
    } finally {
      setIsLoading(false);
    }
  }, [vehicleModelId, filters]);

  useEffect(() => {
    void fetchListings();
  }, [fetchListings]);

  const clearFilters = () => {
    setFilters({
      q: '', manufacturerId: '', minPrice: '', maxPrice: '',
      state: '', city: '', sortBy: 'createdAt', sortOrder: 'desc',
    });
  };

  const hasActiveFilters = filters.q || filters.manufacturerId || filters.minPrice || filters.maxPrice || filters.state || filters.city;

  return (
    <div className="max-w-[1600px] mx-auto px-8 py-12">
      <div className="mb-8">
        <Breadcrumb items={[
          { label: 'Marketplace', href: '/listings' },
          { label: 'Todos os Anúncios' }
        ]} />
        <div className="flex items-center justify-between mt-4 mb-2">
          <div>
            <h1 className="text-3xl font-bold">Comprar Veículos</h1>
            <p className="text-white/40 max-w-2xl">
              Encontre as melhores ofertas e conecte-se com vendedores no AutoHub.
            </p>
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 h-10 px-4 rounded-xl border text-sm transition-all ${
              showFilters
                ? 'border-[#00D4FF]/30 text-[#00D4FF] bg-[#00D4FF]/10'
                : 'border-white/10 text-white/50 hover:text-white hover:bg-white/5'
            }`}
          >
            <SlidersHorizontal size={14} />
            Filtros
          </button>
        </div>
      </div>

      {/* ══════ FILTROS ══════ */}
      {showFilters && (
        <GlassPanel padding="p-5" className="mb-8">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            <div className="col-span-2">
              <Input
                label="Buscar"
                value={filters.q}
                onChange={e => setFilters(p => ({ ...p, q: e.target.value }))}
                placeholder="Título, modelo, marca..."
                leftIcon={<Search size={14} />}
              />
            </div>
            <Select
              label="Fabricante"
              value={filters.manufacturerId}
              onChange={e => setFilters(p => ({ ...p, manufacturerId: e.target.value }))}
              options={manufacturers.map(m => ({ value: m.id, label: m.name }))}
              placeholder="Todos"
            />
            <Input
              label="Preço Mín."
              type="number"
              min="0"
              value={filters.minPrice}
              onChange={e => setFilters(p => ({ ...p, minPrice: e.target.value }))}
              placeholder="R$ 0"
            />
            <Input
              label="Preço Máx."
              type="number"
              min="0"
              value={filters.maxPrice}
              onChange={e => setFilters(p => ({ ...p, maxPrice: e.target.value }))}
              placeholder="R$ 999.999"
            />
            <Input
              label="Estado (UF)"
              maxLength={2}
              value={filters.state}
              onChange={e => setFilters(p => ({ ...p, state: e.target.value.toUpperCase() }))}
              placeholder="SC"
            />
          </div>

          <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/8">
            <div className="flex gap-3">
              <Select
                label="Ordenar por"
                value={filters.sortBy}
                onChange={e => setFilters(p => ({ ...p, sortBy: e.target.value as 'price' | 'year' | 'createdAt' }))}
                options={[
                  { value: 'createdAt', label: 'Mais Recentes' },
                  { value: 'price', label: 'Preço' },
                  { value: 'year', label: 'Ano' },
                ]}
              />
              <Select
                label="Ordem"
                value={filters.sortOrder}
                onChange={e => setFilters(p => ({ ...p, sortOrder: e.target.value as 'asc' | 'desc' }))}
                options={[
                  { value: 'desc', label: 'Decrescente' },
                  { value: 'asc', label: 'Crescente' },
                ]}
              />
            </div>
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="flex items-center gap-1.5 text-xs text-red-400 hover:text-red-300 transition-colors"
              >
                <X size={12} />
                Limpar filtros
              </button>
            )}
          </div>
        </GlassPanel>
      )}

      {/* ══════ RESULTADOS ══════ */}
      {isLoading ? (
        <LoadingState message="Buscando anúncios..." />
      ) : listings.length === 0 ? (
        <EmptyState
          title="Nenhum anúncio encontrado"
          message={hasActiveFilters ? 'Tente ajustar seus filtros de busca.' : 'Ainda não há anúncios publicados.'}
        />
      ) : (
        <>
          <p className="text-white/30 text-xs mb-4">{listings.length} anúncio(s) encontrado(s)</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {listings.map((listing, idx) => (
              <ListingCard key={listing.id} listing={listing} index={idx} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function ListingCard({ listing, index = 0 }: { listing: Listing; index?: number }) {
  const imageUrl = listing.images?.[0]?.url || listing.vehicleModel?.catalogImage || PLACEHOLDER_IMG;

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
            <img
              src={imageUrl}
              alt={listing.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
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
                  <span>{listing.vehicleModel.manufacturer?.name} · {listing.vehicleModel.manufactureYear}</span>
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
