'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BrandCard } from '@/src/components/catalog/BrandCard';
import { Breadcrumb } from '@/src/components/ui/Breadcrumb';
import { LoadingState, ErrorState, EmptyState } from '@/src/components/ui/States';
import { manufacturerService } from '@/src/services/manufacturer.service';
import type { Manufacturer } from '@/src/types';

export default function BrandsPage() {
  const [manufacturers, setManufacturers] = useState<Manufacturer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchManufacturers() {
      try {
        const data = await manufacturerService.findAll();
        if (data) {
          setManufacturers(data);
        }
      } catch (error) {
        console.error('Failed to fetch manufacturers', error);
        setError('Falha ao carregar fabricantes');
      } finally {
        setIsLoading(false);
      }
    }
    void fetchManufacturers();
  }, []);

  if (isLoading) {
    return (
      <div className="max-w-[1600px] mx-auto px-8 py-12">
        <LoadingState message="Carregando fabricantes..." />
      </div>
    );
  }

  return (
    <div className="max-w-[1600px] mx-auto px-8 py-12">
      <div className="mb-8">
        <Breadcrumb items={[{ label: 'Marcas', href: '/brands' }]} />
        <h1 className="text-3xl font-bold mt-4 mb-2">Marcas</h1>
        <p className="text-white/40 max-w-2xl">
          Explore nossa vitrine de fabricantes. Dos grandes nomes da indústria aos mais exclusivos construtores de alta performance.
        </p>
      </div>

      {manufacturers.length === 0 ? (
        <EmptyState title="Nenhuma marca encontrada" message="Ainda não há fabricantes cadastrados no sistema." />
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
          {manufacturers.map((m, idx) => (
            <BrandCard key={m.id} manufacturer={m} index={idx} />
          ))}
        </div>
      )}
    </div>
  );
}
