'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Breadcrumb } from '@/src/components/ui/Breadcrumb';
import { TopStatusBar } from '@/src/components/catalog/TopStatusBar';
import { BrandPanel } from '@/src/components/catalog/BrandPanel';
import { TechnicalSpecsPanel } from '@/src/components/catalog/TechnicalSpecsPanel';
import { GlassPanel } from '@/src/components/ui/GlassPanel';
import { LoadingState, EmptyState } from '@/src/components/ui/States';
import { Button } from '@/src/components/ui/FormElements';
import { vehicleModelService } from '@/src/services/vehicle-model.service';
import { useAuth } from '@/src/contexts/AuthContext';
import type { VehicleModel } from '@/src/types';
import Link from 'next/link';

export default function ModelDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { user } = useAuth();
  
  const [model, setModel] = useState<VehicleModel | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchModel() {
      try {
        const data = await vehicleModelService.findOne(id);
        setModel(data);
      } catch (err) {
        console.error('Failed to fetch model', err);
      } finally {
        setIsLoading(false);
      }
    }
    
    if (id) {
      void fetchModel();
    }
  }, [id]);

  if (isLoading) {
    return (
      <div className="h-[calc(100vh-4rem)] flex items-center justify-center">
        <LoadingState message="Carregando detalhes do veículo..." />
      </div>
    );
  }

  if (!model) {
    return (
      <div className="h-[calc(100vh-4rem)] flex items-center justify-center">
        <EmptyState title="Veículo não encontrado" message="Este modelo pode ter sido removido ou não existe." />
      </div>
    );
  }

  const apiSpecs = model.attributes?.length
    ? Object.fromEntries(
        model.attributes
          .filter((a) => a.type === 'TEXT')
          .map((a) => [a.name, a.options?.[0]?.value ?? '—'])
      )
    : undefined;

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] overflow-hidden">
      <TopStatusBar model={model} user={user} />

      <div className="flex-1 flex overflow-hidden">
        {/* LEFT: Info & Breadcrumbs */}
        <div className="w-[300px] shrink-0 p-6 border-r border-white/6 flex flex-col gap-6 overflow-y-auto">
          <Breadcrumb items={[
            { label: 'Marcas', href: '/brands' },
            { label: model.manufacturer?.name || 'Marca', href: `/brands/${model.manufacturerId}` },
            { label: model.name }
          ]} />
          
          <BrandPanel model={model} />
        </div>

        {/* CENTER: Image */}
        <div className="flex-1 relative flex flex-col items-center justify-center bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[rgba(0,212,255,0.05)] via-transparent to-transparent">
          <img
              src={model.catalogImage || 'https://img.magnific.com/fotos-premium/o-carro-misterioso-uma-apresentacao-coberta-por-um-pano-escuro-criando-usando-ferramentas-generativas-de-ia_852340-1273.jpg'}
              alt={model.name}
              className="w-4/5 h-auto max-h-[70%] object-contain drop-shadow-[0_20px_50px_rgba(0,212,255,0.2)]"
            />
          
          <div className="absolute bottom-10 flex gap-4">
            <Link href={`/listings?vehicleModelId=${model.id}`}>
              <Button variant="primary" size="lg">Ver Anúncios Deste Veículo</Button>
            </Link>
            <Button variant="secondary" size="lg" onClick={() => router.push('/')}>Voltar ao Catálogo</Button>
          </div>
        </div>

        {/* RIGHT: Specs */}
        <div className="w-[300px] shrink-0 p-6 border-l border-white/6 overflow-y-auto">
          <TechnicalSpecsPanel
            model={model}
            apiAttributes={apiSpecs}
          />
        </div>
      </div>
    </div>
  );
}
