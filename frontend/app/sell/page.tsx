'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Breadcrumb } from '@/src/components/ui/Breadcrumb';
import { GlassPanel } from '@/src/components/ui/GlassPanel';
import { Button, Input, Textarea, Select } from '@/src/components/ui/FormElements';
import { useAuth } from '@/src/contexts/AuthContext';
import { useToast } from '@/src/contexts/ToastContext';
import { vehicleModelService } from '@/src/services/vehicle-model.service';
import { listingService } from '@/src/services/listing.service';
import type { VehicleModel } from '@/src/types';

export default function SellPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const { success, error } = useToast();

  const [models, setModels] = useState<VehicleModel[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    vehicleModelId: '',
    title: '',
    description: '',
    price: '',
    acceptsProposals: false,
    state: '',
    city: '',
  });

  useEffect(() => {
    // Redirect if not authenticated? In a real app, yes.
    // For now, we'll just show a message if they try to submit without auth.
    vehicleModelService.findAll()
      .then(setModels)
      .catch(() => { /* ignora erro e mostra lista vazia */ });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      error('Você precisa estar logado para anunciar um veículo.');
      router.push('/auth/login');
      return;
    }

    try {
      setIsLoading(true);
      const newListing = await listingService.create({
        vehicleModelId: formData.vehicleModelId,
        title: formData.title,
        description: formData.description,
        price: Number(formData.price),
        acceptsProposals: formData.acceptsProposals,
        state: formData.state,
        city: formData.city,
      });

      success('Anúncio criado com sucesso!');
      router.push(`/listings/${newListing.id}`);
    } catch (err: any) {
      error(err.message || 'Erro ao criar anúncio.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-[800px] mx-auto px-8 py-12">
      <div className="mb-8">
        <Breadcrumb items={[{ label: 'Vender', href: '/sell' }]} />
        <h1 className="text-3xl font-bold mt-4 mb-2">Anunciar Veículo</h1>
        <p className="text-white/40">Preencha os dados abaixo para anunciar seu veículo no AutoHub.</p>
      </div>

      <GlassPanel>
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <Select
            label="Modelo do Veículo"
            required
            value={formData.vehicleModelId}
            onChange={(e) => setFormData(p => ({ ...p, vehicleModelId: e.target.value }))}
            options={models.map(m => ({ value: m.id, label: `${m.manufacturer?.name} ${m.name} (${m.manufactureYear})` }))}
            placeholder="Selecione um modelo..."
          />

          <Input
            label="Título do Anúncio"
            required
            maxLength={150}
            value={formData.title}
            onChange={(e) => setFormData(p => ({ ...p, title: e.target.value }))}
            placeholder="Ex: Porsche 911 GT3 Impecável"
          />

          <Textarea
            label="Descrição"
            rows={5}
            value={formData.description}
            onChange={(e) => setFormData(p => ({ ...p, description: e.target.value }))}
            placeholder="Descreva os detalhes, estado de conservação, opcionais..."
          />

          <div className="grid grid-cols-2 gap-6">
            <Input
              label="Preço (R$)"
              type="number"
              required
              min="0"
              step="0.01"
              value={formData.price}
              onChange={(e) => setFormData(p => ({ ...p, price: e.target.value }))}
              placeholder="0.00"
            />

            <div className="flex flex-col gap-1.5 justify-center mt-6">
              <label className="flex items-center gap-2 cursor-pointer text-sm text-white/80 hover:text-white">
                <input
                  type="checkbox"
                  checked={formData.acceptsProposals}
                  onChange={(e) => setFormData(p => ({ ...p, acceptsProposals: e.target.checked }))}
                  className="rounded border-white/20 bg-white/5 text-[#00D4FF] focus:ring-[#00D4FF]"
                />
                Aceita Propostas?
              </label>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <Input
              label="Estado (UF)"
              required
              maxLength={2}
              value={formData.state}
              onChange={(e) => setFormData(p => ({ ...p, state: e.target.value.toUpperCase() }))}
              placeholder="Ex: SP"
            />
            <Input
              label="Cidade"
              required
              value={formData.city}
              onChange={(e) => setFormData(p => ({ ...p, city: e.target.value }))}
              placeholder="Ex: São Paulo"
            />
          </div>

          <div className="pt-6 border-t border-white/10 flex justify-end">
            <Button type="submit" isLoading={isLoading} size="lg">
              Publicar Anúncio
            </Button>
          </div>
        </form>
      </GlassPanel>
    </div>
  );
}
