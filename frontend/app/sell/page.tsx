'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Breadcrumb } from '@/src/components/ui/Breadcrumb';
import { GlassPanel } from '@/src/components/ui/GlassPanel';
import { Button, Input, Textarea, Select } from '@/src/components/ui/FormElements';
import { useAuth } from '@/src/contexts/AuthContext';
import { useToast } from '@/src/contexts/ToastContext';
import { vehicleModelService } from '@/src/services/vehicle-model.service';
import { listingService } from '@/src/services/listing.service';
import type { VehicleModel } from '@/src/types';
import Link from 'next/link';
import { ArrowLeft, Car, CheckCircle, ImagePlus, X, Upload, Loader2 } from 'lucide-react';

const PLACEHOLDER_IMG = 'https://img.magnific.com/fotos-premium/o-carro-misterioso-uma-apresentacao-coberta-por-um-pano-escuro-criando-usando-ferramentas-generativas-de-ia_852340-1273.jpg';

export default function SellPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const { success, error } = useToast();

  const [models, setModels] = useState<VehicleModel[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingModels, setLoadingModels] = useState(true);

  // Fotos
  const [photoFiles, setPhotoFiles] = useState<File[]>([]);
  const [photoPreviews, setPhotoPreviews] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
    vehicleModelService.findAll()
      .then(setModels)
      .catch(() => { /* ignora */ })
      .finally(() => setLoadingModels(false));
  }, []);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/auth/login');
    }
  }, [authLoading, isAuthenticated, router]);

  const handleAddPhotos = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (photoFiles.length + files.length > 20) {
      error('Máximo de 20 fotos permitidas.');
      return;
    }
    const newFiles = [...photoFiles, ...files];
    setPhotoFiles(newFiles);
    const newPreviews = files.map(f => URL.createObjectURL(f));
    setPhotoPreviews(p => [...p, ...newPreviews]);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleRemovePhoto = (index: number) => {
    URL.revokeObjectURL(photoPreviews[index]);
    setPhotoFiles(p => p.filter((_, i) => i !== index));
    setPhotoPreviews(p => p.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.vehicleModelId) { error('Selecione um modelo de veículo.'); return; }
    if (!formData.title.trim()) { error('Informe o título do anúncio.'); return; }
    if (!formData.price || Number(formData.price) <= 0) { error('Informe um preço válido.'); return; }
    if (!formData.state.trim()) { error('Informe o estado (UF).'); return; }
    if (!formData.city.trim()) { error('Informe a cidade.'); return; }
    if (photoFiles.length < 1) { error('Adicione pelo menos 1 foto do veículo.'); return; }

    try {
      setIsLoading(true);

      // 1. Cria o anúncio (status: DRAFT)
      const newListing = await listingService.create({
        vehicleModelId: formData.vehicleModelId,
        title: formData.title.trim(),
        description: formData.description.trim(),
        price: Number(formData.price),
        acceptsProposals: formData.acceptsProposals,
        state: formData.state.trim(),
        city: formData.city.trim(),
      });

      // 2. Faz upload de cada foto
      for (let i = 0; i < photoFiles.length; i++) {
        await listingService.uploadImage(newListing.id, photoFiles[i], i + 1);
      }

      // 3. Publica (DRAFT → PUBLISHED)
      await listingService.publish(newListing.id);

      success('Anúncio criado e publicado com sucesso!');
      router.push(`/listings/${newListing.id}`);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Erro ao criar anúncio.';
      error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  if (authLoading || !isAuthenticated) return null;

  return (
    <div className="max-w-[900px] mx-auto px-8 py-12">
      <div className="mb-8">
        <Breadcrumb items={[{ label: 'Vender', href: '/sell' }]} />
        <div className="flex items-center gap-3 mt-4 mb-2">
          <div className="w-10 h-10 rounded-xl bg-[#00D4FF]/10 border border-[#00D4FF]/20 flex items-center justify-center text-[#00D4FF]">
            <Car size={20} />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Anunciar Veículo</h1>
            <p className="text-white/40 text-sm">Preencha os dados, adicione fotos e publique seu anúncio.</p>
          </div>
        </div>
      </div>

      <GlassPanel neon="blue">
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          {/* Modelo */}
          {loadingModels ? (
            <div className="h-10 rounded-xl bg-white/5 animate-pulse" />
          ) : (
            <Select
              label="Modelo do Veículo"
              required
              value={formData.vehicleModelId}
              onChange={(e) => setFormData(p => ({ ...p, vehicleModelId: e.target.value }))}
              options={models.map(m => ({
                value: m.id,
                label: `${m.manufacturer?.name ?? ''} ${m.name} (${m.manufactureYear})`,
              }))}
              placeholder="Selecione um modelo..."
            />
          )}

          {/* Título */}
          <Input
            label="Título do Anúncio"
            required
            maxLength={150}
            value={formData.title}
            onChange={(e) => setFormData(p => ({ ...p, title: e.target.value }))}
            placeholder="Ex: Honda Civic EXL 2023 — Único Dono"
          />

          {/* Descrição */}
          <Textarea
            label="Descrição"
            rows={4}
            value={formData.description}
            onChange={(e) => setFormData(p => ({ ...p, description: e.target.value }))}
            placeholder="Descreva o estado de conservação, opcionais, histórico de manutenção..."
          />

          {/* Preço + Aceita Propostas */}
          <div className="grid grid-cols-2 gap-6">
            <Input
              label="Preço (R$)"
              type="number"
              required
              min="1"
              step="0.01"
              value={formData.price}
              onChange={(e) => setFormData(p => ({ ...p, price: e.target.value }))}
              placeholder="0.00"
            />
            <div className="flex flex-col gap-1.5 justify-center mt-5">
              <label className="flex items-center gap-3 cursor-pointer group">
                <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                  formData.acceptsProposals
                    ? 'bg-[#00D4FF] border-[#00D4FF]'
                    : 'border-white/20 bg-white/5 group-hover:border-white/40'
                }`}>
                  {formData.acceptsProposals && <CheckCircle size={12} className="text-black" />}
                </div>
                <input
                  type="checkbox"
                  hidden
                  checked={formData.acceptsProposals}
                  onChange={(e) => setFormData(p => ({ ...p, acceptsProposals: e.target.checked }))}
                />
                <span className="text-sm text-white/70 group-hover:text-white transition-colors">
                  Aceita propostas
                </span>
              </label>
            </div>
          </div>

          {/* Localização */}
          <div className="grid grid-cols-2 gap-6">
            <Input
              label="Estado (UF)"
              required
              maxLength={2}
              value={formData.state}
              onChange={(e) => setFormData(p => ({ ...p, state: e.target.value.toUpperCase() }))}
              placeholder="Ex: SC"
            />
            <Input
              label="Cidade"
              required
              value={formData.city}
              onChange={(e) => setFormData(p => ({ ...p, city: e.target.value }))}
              placeholder="Ex: Videira"
            />
          </div>

          {/* ══════ UPLOAD DE FOTOS ══════ */}
          <div className="flex flex-col gap-3">
            <label className="text-xs font-medium text-white/50 uppercase tracking-wider">
              Fotos do Veículo (mín. 1, máx. 20)
            </label>

            {/* Grid de previews */}
            <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 gap-3">
              {photoPreviews.map((src, idx) => (
                <div key={idx} className="relative aspect-square rounded-xl overflow-hidden border border-white/10 group">
                  <img src={src} alt={`Foto ${idx + 1}`} className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => handleRemovePhoto(idx)}
                    className="absolute top-1 right-1 w-6 h-6 rounded-full bg-black/70 border border-white/20 flex items-center justify-center text-white/60 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X size={12} />
                  </button>
                  <div className="absolute bottom-0 inset-x-0 h-5 bg-gradient-to-t from-black/60 to-transparent flex items-end justify-center pb-0.5">
                    <span className="text-[9px] text-white/50">{idx + 1}</span>
                  </div>
                </div>
              ))}

              {/* Botão de adicionar */}
              {photoFiles.length < 20 && (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="aspect-square rounded-xl border-2 border-dashed border-white/15 hover:border-[#00D4FF]/40 flex flex-col items-center justify-center gap-1 text-white/30 hover:text-[#00D4FF] transition-all hover:bg-[#00D4FF]/5"
                >
                  <ImagePlus size={20} />
                  <span className="text-[9px] font-medium">Adicionar</span>
                </button>
              )}
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              multiple
              hidden
              onChange={handleAddPhotos}
            />

            <p className="text-white/30 text-xs">
              {photoFiles.length}/20 fotos adicionadas. Formatos aceitos: JPG, PNG, WebP (máx. 5MB cada).
            </p>
          </div>

          {/* Actions */}
          <div className="pt-4 border-t border-white/10 flex items-center justify-between">
            <Link href="/listings">
              <Button variant="ghost" size="md" leftIcon={<ArrowLeft size={14} />}>
                Cancelar
              </Button>
            </Link>
            <Button type="submit" isLoading={isLoading} size="lg" leftIcon={<Upload size={16} />}>
              {isLoading ? 'Publicando...' : 'Publicar Anúncio'}
            </Button>
          </div>
        </form>
      </GlassPanel>
    </div>
  );
}
