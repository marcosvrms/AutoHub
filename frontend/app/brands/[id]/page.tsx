'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Breadcrumb } from '@/src/components/ui/Breadcrumb';
import { VehicleCard } from '@/src/components/catalog/VehicleCard';
import { LoadingState, EmptyState } from '@/src/components/ui/States';
import { vehicleModelService } from '@/src/services/vehicle-model.service';
import type { VehicleModel, Manufacturer } from '@/src/types';

export default function BrandDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const [manufacturer, setManufacturer] = useState<Manufacturer | null>(null);
  const [models, setModels] = useState<VehicleModel[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchBrandAndModels() {
      try {
        const allModels = await vehicleModelService.findAll();
        const brandModels = allModels.filter(m => m.manufacturerId === id);
        
        if (brandModels.length > 0) {
          setModels(brandModels);
          setManufacturer(brandModels[0].manufacturer || null);
        }
      } catch (error) {
        console.error('Failed to fetch brand models', error);
      } finally {
        setIsLoading(false);
      }
    }

    if (id) {
      void fetchBrandAndModels();
    }
  }, [id]);

  if (isLoading) {
    return (
      <div className="max-w-[1600px] mx-auto px-8 py-12">
        <LoadingState message="Carregando modelos..." />
      </div>
    );
  }

  if (!manufacturer) {
    return (
      <div className="max-w-[1600px] mx-auto px-8 py-12">
        <EmptyState title="Fabricante não encontrado" message="Não foi possível localizar este fabricante." />
      </div>
    );
  }

  return (
    <div className="max-w-[1600px] mx-auto px-8 py-12">
      <div className="mb-8">
        <Breadcrumb items={[
          { label: 'Marcas', href: '/brands' },
          { label: manufacturer.name, href: `/brands/${id}` }
        ]} />
        <div className="flex items-center gap-6 mt-4 mb-2">
          <div className="w-16 h-16 rounded-2xl border border-white/10 bg-[rgba(10,15,30,0.6)] backdrop-blur-xl flex items-center justify-center">
            <span className="text-3xl font-black text-white/60">{manufacturer.name.charAt(0)}</span>
          </div>
          <div>
            <h1 className="text-3xl font-bold">{manufacturer.name}</h1>
            <p className="text-white/40 mt-1">Modelos disponíveis: {models.length}</p>
          </div>
        </div>
      </div>

      {models.length === 0 ? (
        <EmptyState title="Nenhum modelo encontrado" message={`Não há modelos cadastrados para a marca ${manufacturer.name}.`} />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {models.map((m, idx) => (
            <VehicleCard key={m.id} model={m} index={idx} />
          ))}
        </div>
      )}
    </div>
  );
}
