'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, Car, Tag, Zap, Building2, List, Plus, Pencil, Trash2,
  X, ChevronRight, Loader2, Users, ShoppingBag, BarChart3, RefreshCw,
} from 'lucide-react';
import { GlassPanel } from '@/src/components/ui/GlassPanel';
import { Button, Input, Select } from '@/src/components/ui/FormElements';
import { Badge, ConfirmDialog, LoadingState } from '@/src/components/ui/States';
import { useAuth } from '@/src/contexts/AuthContext';
import { useToast } from '@/src/contexts/ToastContext';
import { manufacturerService } from '@/src/services/manufacturer.service';
import { vehicleModelService } from '@/src/services/vehicle-model.service';
import { vehicleTypeService } from '@/src/services/vehicle-type.service';
import { categoryService } from '@/src/services/category.service';
import { listingService } from '@/src/services/listing.service';
import { formatCurrency, formatListingStatus } from '@/src/utils';
import type { Manufacturer, VehicleModel, VehicleType, Category, Listing } from '@/src/types';

// ─────────── types ───────────
type AdminTab = 'overview' | 'manufacturers' | 'vehicletypes' | 'models' | 'listings';

// ─────────── helpers ───────────
const VEHICLE_PLACEHOLDER = 'https://img.magnific.com/fotos-premium/o-carro-misterioso-uma-apresentacao-coberta-por-um-pano-escuro-criando-usando-ferramentas-generativas-de-ia_852340-1273.jpg';

export default function AdminPage() {
  const router = useRouter();
  const { isAuthenticated, isAdmin, isLoading: authLoading } = useAuth();
  const { success, error } = useToast();

  const [activeTab, setActiveTab] = useState<AdminTab>('overview');

  useEffect(() => {
    if (!authLoading && (!isAuthenticated || !isAdmin)) {
      router.push('/');
    }
  }, [authLoading, isAuthenticated, isAdmin, router]);

  if (authLoading || !isAuthenticated || !isAdmin) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
        <LoadingState message="Verificando permissões..." />
      </div>
    );
  }

  const TABS = [
    { id: 'overview' as AdminTab, label: 'Visão Geral', icon: <LayoutDashboard size={16} /> },
    { id: 'manufacturers' as AdminTab, label: 'Fabricantes', icon: <Building2 size={16} /> },
    { id: 'vehicletypes' as AdminTab, label: 'Tipos', icon: <Tag size={16} /> },
    { id: 'models' as AdminTab, label: 'Modelos', icon: <Car size={16} /> },
    { id: 'listings' as AdminTab, label: 'Anúncios', icon: <ShoppingBag size={16} /> },
  ];

  return (
    <div className="max-w-[1400px] mx-auto px-8 py-10">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#00D4FF] to-[#B500FF] flex items-center justify-center shadow-[0_0_20px_rgba(0,212,255,0.3)]">
            <LayoutDashboard size={18} className="text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Painel Administrativo</h1>
            <p className="text-white/40 text-sm">Gerencie fabricantes, modelos e anúncios do AutoHub.</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-8 p-1 rounded-xl border border-white/8 bg-white/3 w-fit">
        {TABS.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
              activeTab === tab.id
                ? 'bg-[#00D4FF]/15 text-[#00D4FF] border border-[#00D4FF]/30'
                : 'text-white/40 hover:text-white/70 hover:bg-white/5'
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
        >
          {activeTab === 'overview' && <OverviewTab />}
          {activeTab === 'manufacturers' && <ManufacturersTab />}
          {activeTab === 'vehicletypes' && <VehicleTypesTab />}
          {activeTab === 'models' && <ModelsTab />}
          {activeTab === 'listings' && <ListingsTab />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

// ══════════════════════════════════════════════════
// OVERVIEW TAB
// ══════════════════════════════════════════════════
function OverviewTab() {
  const [counts, setCounts] = useState({ manufacturers: 0, models: 0, listings: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      manufacturerService.findAll(),
      vehicleModelService.findAll(),
      listingService.findAllForAdmin(),
    ]).then(([m, v, l]) => {
      setCounts({ manufacturers: m.length, models: v.length, listings: l.length });
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const stats = [
    { label: 'Fabricantes', value: counts.manufacturers, icon: <Building2 size={22} />, color: '#00D4FF' },
    { label: 'Modelos', value: counts.models, icon: <Car size={22} />, color: '#B500FF' },
    { label: 'Anúncios', value: counts.listings, icon: <ShoppingBag size={22} />, color: '#00D4FF' },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map(s => (
          <GlassPanel key={s.label} neon="blue" padding="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/40 text-xs uppercase tracking-widest mb-2">{s.label}</p>
                {loading ? (
                  <div className="h-8 w-16 bg-white/10 rounded animate-pulse" />
                ) : (
                  <p className="text-3xl font-black text-white">{s.value}</p>
                )}
              </div>
              <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: `${s.color}15`, border: `1px solid ${s.color}25`, color: s.color }}>
                {s.icon}
              </div>
            </div>
          </GlassPanel>
        ))}
      </div>
      <GlassPanel padding="p-6">
        <h2 className="text-white font-semibold mb-4 flex items-center gap-2">
          <BarChart3 size={18} className="text-[#00D4FF]" />
          Acesso rápido
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: 'Gerenciar Fabricantes', icon: <Building2 size={16} />, action: 'manufacturers' },
            { label: 'Gerenciar Modelos', icon: <Car size={16} />, action: 'models' },
            { label: 'Ver Todos os Anúncios', icon: <ShoppingBag size={16} />, action: 'listings' },
          ].map(item => (
            <button
              key={item.label}
              className="flex items-center gap-2 px-4 py-3 rounded-xl border border-white/10 text-white/60 hover:text-white hover:border-[#00D4FF]/30 hover:bg-[#00D4FF]/5 transition-all text-sm text-left"
            >
              <span className="text-[#00D4FF]">{item.icon}</span>
              {item.label}
            </button>
          ))}
        </div>
      </GlassPanel>
    </div>
  );
}

// ══════════════════════════════════════════════════
// MANUFACTURERS TAB
// ══════════════════════════════════════════════════
function ManufacturersTab() {
  const { success, error } = useToast();
  const [items, setItems] = useState<Manufacturer[]>([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try { setItems(await manufacturerService.findAll()); }
    catch { error('Erro ao carregar fabricantes.'); }
    finally { setLoading(false); }
  }, [error]);

  useEffect(() => { void load(); }, [load]);

  const handleSave = async () => {
    if (!name.trim()) return;
    setSaving(true);
    try {
      if (editingId) {
        const updated = await manufacturerService.update(editingId, { name: name.trim() });
        setItems(p => p.map(i => i.id === editingId ? updated : i));
        success('Fabricante atualizado!');
      } else {
        const created = await manufacturerService.create({ name: name.trim() });
        setItems(p => [...p, created]);
        success('Fabricante criado!');
      }
      setName(''); setEditingId(null);
    } catch (err: unknown) {
      error(err instanceof Error ? err.message : 'Erro ao salvar.');
    } finally { setSaving(false); }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    try {
      await manufacturerService.remove(deleteId);
      setItems(p => p.filter(i => i.id !== deleteId));
      success('Fabricante removido.');
      setDeleteId(null);
    } catch (err: unknown) {
      error(err instanceof Error ? err.message : 'Erro ao remover.');
    } finally { setDeleting(false); }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Form */}
      <GlassPanel neon="blue" padding="p-5">
        <h2 className="text-white font-semibold mb-4 flex items-center gap-2">
          <Plus size={16} className="text-[#00D4FF]" />
          {editingId ? 'Editar Fabricante' : 'Novo Fabricante'}
        </h2>
        <div className="flex gap-3">
          <Input
            label="Nome do Fabricante"
            value={name}
            onChange={e => setName(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSave()}
            placeholder="Ex: Toyota, BMW, Embraer..."
            className="flex-1"
          />
          <div className="flex gap-2 items-end">
            <Button onClick={handleSave} isLoading={saving} leftIcon={editingId ? <Pencil size={14} /> : <Plus size={14} />}>
              {editingId ? 'Salvar' : 'Criar'}
            </Button>
            {editingId && (
              <Button variant="ghost" onClick={() => { setName(''); setEditingId(null); }} leftIcon={<X size={14} />}>
                Cancelar
              </Button>
            )}
          </div>
        </div>
      </GlassPanel>

      {/* List */}
      <GlassPanel padding="p-0" className="overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/8">
          <h2 className="text-white font-semibold flex items-center gap-2">
            <Building2 size={16} className="text-[#00D4FF]" />
            Fabricantes ({items.length})
          </h2>
          <button onClick={load} className="text-white/30 hover:text-white transition-colors">
            <RefreshCw size={14} />
          </button>
        </div>
        {loading ? <LoadingState /> : (
          <div className="divide-y divide-white/6">
            {items.map(item => (
              <div key={item.id} className="flex items-center justify-between px-5 py-3 hover:bg-white/3 transition-colors group">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#00D4FF]/10 border border-[#00D4FF]/20 flex items-center justify-center text-[#00D4FF] font-bold text-sm">
                    {item.name[0]}
                  </div>
                  <span className="text-white/80 text-sm font-medium">{item.name}</span>
                </div>
                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => { setEditingId(item.id); setName(item.name); }}
                    className="w-8 h-8 rounded-lg border border-white/10 flex items-center justify-center text-white/40 hover:text-[#00D4FF] hover:border-[#00D4FF]/30 transition-all"
                  ><Pencil size={13} /></button>
                  <button
                    onClick={() => setDeleteId(item.id)}
                    className="w-8 h-8 rounded-lg border border-white/10 flex items-center justify-center text-white/40 hover:text-red-400 hover:border-red-500/30 transition-all"
                  ><Trash2 size={13} /></button>
                </div>
              </div>
            ))}
            {items.length === 0 && (
              <p className="text-white/30 text-sm text-center py-10">Nenhum fabricante cadastrado.</p>
            )}
          </div>
        )}
      </GlassPanel>

      <ConfirmDialog
        isOpen={!!deleteId}
        title="Remover Fabricante"
        message="Tem certeza que deseja remover este fabricante? Isso pode afetar modelos associados."
        danger
        confirmLabel="Remover"
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
        isLoading={deleting}
      />
    </div>
  );
}

// ══════════════════════════════════════════════════
// VEHICLE TYPES TAB
// ══════════════════════════════════════════════════
function VehicleTypesTab() {
  const { success, error } = useToast();
  const [types, setTypes] = useState<VehicleType[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [t, c] = await Promise.all([vehicleTypeService.findAll(), categoryService.findAll()]);
      setTypes(t);
      setCategories(c);
    } catch { error('Erro ao carregar tipos de veículos.'); }
    finally { setLoading(false); }
  }, [error]);

  useEffect(() => { void load(); }, [load]);

  const handleSave = async () => {
    if (!name.trim() || !categoryId) return;
    setSaving(true);
    try {
      if (editingId) {
        const updated = await vehicleTypeService.update(editingId, { name: name.trim(), categoryId });
        setTypes(p => p.map(i => i.id === editingId ? updated : i));
        success('Tipo atualizado!');
      } else {
        const created = await vehicleTypeService.create({ name: name.trim(), categoryId });
        setTypes(p => [...p, created]);
        success('Tipo criado!');
      }
      setName(''); setCategoryId(''); setEditingId(null);
    } catch (err: unknown) {
      error(err instanceof Error ? err.message : 'Erro ao salvar.');
    } finally { setSaving(false); }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    try {
      await vehicleTypeService.remove(deleteId);
      setTypes(p => p.filter(i => i.id !== deleteId));
      success('Tipo removido.');
      setDeleteId(null);
    } catch (err: unknown) {
      error(err instanceof Error ? err.message : 'Erro ao remover.');
    } finally { setDeleting(false); }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Form */}
      <GlassPanel neon="purple" padding="p-5">
        <h2 className="text-white font-semibold mb-4 flex items-center gap-2">
          <Plus size={16} className="text-[#B500FF]" />
          {editingId ? 'Editar Tipo de Veículo' : 'Novo Tipo de Veículo'}
        </h2>
        <div className="flex gap-3 items-end">
          <Select
            label="Categoria"
            value={categoryId}
            onChange={e => setCategoryId(e.target.value)}
            options={categories.map(c => ({ value: c.id, label: c.name }))}
            placeholder="Selecione..."
            className="w-48"
          />
          <Input
            label="Nome (ex: Carro, Moto)"
            value={name}
            onChange={e => setName(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSave()}
            placeholder="Nome do tipo..."
            className="flex-1"
          />
          <div className="flex gap-2 mb-1">
            <Button onClick={handleSave} isLoading={saving} leftIcon={editingId ? <Pencil size={14} /> : <Plus size={14} />}>
              {editingId ? 'Salvar' : 'Criar'}
            </Button>
            {editingId && (
              <Button variant="ghost" onClick={() => { setName(''); setCategoryId(''); setEditingId(null); }} leftIcon={<X size={14} />}>
                Cancelar
              </Button>
            )}
          </div>
        </div>
      </GlassPanel>

      {/* List */}
      <GlassPanel padding="p-0" className="overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/8">
          <h2 className="text-white font-semibold flex items-center gap-2">
            <Tag size={16} className="text-[#B500FF]" />
            Tipos de Veículos ({types.length})
          </h2>
          <button onClick={load} className="text-white/30 hover:text-white transition-colors">
            <RefreshCw size={14} />
          </button>
        </div>
        {loading ? <LoadingState /> : (
          <div className="divide-y divide-white/6">
            {types.map(item => (
              <div key={item.id} className="flex items-center justify-between px-5 py-3 hover:bg-white/3 transition-colors group">
                <div className="flex flex-col">
                  <span className="text-white/80 text-sm font-medium">{item.name}</span>
                  <span className="text-white/40 text-xs">Categoria: {item.category?.name || '---'}</span>
                </div>
                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => { setEditingId(item.id); setName(item.name); setCategoryId(item.categoryId); }}
                    className="w-8 h-8 rounded-lg border border-white/10 flex items-center justify-center text-white/40 hover:text-[#00D4FF] hover:border-[#00D4FF]/30 transition-all"
                  ><Pencil size={13} /></button>
                  <button
                    onClick={() => setDeleteId(item.id)}
                    className="w-8 h-8 rounded-lg border border-white/10 flex items-center justify-center text-white/40 hover:text-red-400 hover:border-red-500/30 transition-all"
                  ><Trash2 size={13} /></button>
                </div>
              </div>
            ))}
            {types.length === 0 && (
              <p className="text-white/30 text-sm text-center py-10">Nenhum tipo cadastrado.</p>
            )}
          </div>
        )}
      </GlassPanel>

      <ConfirmDialog
        isOpen={!!deleteId}
        title="Remover Tipo"
        message="Tem certeza que deseja remover este tipo de veículo? Isso pode afetar modelos associados."
        danger
        confirmLabel="Remover"
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
        isLoading={deleting}
      />
    </div>
  );
}

// ══════════════════════════════════════════════════
// MODELS TAB
// ══════════════════════════════════════════════════
function ModelsTab() {
  const { success, error } = useToast();
  const [models, setModels] = useState<VehicleModel[]>([]);
  const [manufacturers, setManufacturers] = useState<Manufacturer[]>([]);
  const [vehicleTypes, setVehicleTypes] = useState<VehicleType[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingModel, setEditingModel] = useState<VehicleModel | null>(null);

  const [form, setForm] = useState({
    manufacturerId: '',
    vehicleTypeId: '',
    name: '',
    manufactureYear: new Date().getFullYear().toString(),
    description: '',
    catalogImage: '',
  });

  const [selectedCategoryId, setSelectedCategoryId] = useState('');
  const [filteredTypes, setFilteredTypes] = useState<VehicleType[]>([]);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [m, v, c, t] = await Promise.all([
        vehicleModelService.findAll(),
        manufacturerService.findAll(),
        categoryService.findAll(),
        vehicleTypeService.findAll(),
      ]);
      setModels(m);
      setManufacturers(v);
      setCategories(c);
      setVehicleTypes(t);
    } catch { error('Erro ao carregar dados.'); }
    finally { setLoading(false); }
  }, [error]);

  useEffect(() => { void load(); }, [load]);

  useEffect(() => {
    if (selectedCategoryId) {
      setFilteredTypes(vehicleTypes.filter(t => t.categoryId === selectedCategoryId));
    } else {
      setFilteredTypes(vehicleTypes);
    }
    setForm(p => ({ ...p, vehicleTypeId: '' }));
  }, [selectedCategoryId, vehicleTypes]);

  const handleEdit = (m: VehicleModel) => {
    setEditingModel(m);
    setForm({
      manufacturerId: m.manufacturerId,
      vehicleTypeId: m.vehicleTypeId,
      name: m.name,
      manufactureYear: m.manufactureYear.toString(),
      description: m.description ?? '',
      catalogImage: m.catalogImage ?? '',
    });
    setSelectedCategoryId(m.vehicleType?.categoryId ?? '');
    setShowForm(true);
  };

  const resetForm = () => {
    setEditingModel(null);
    setForm({ manufacturerId: '', vehicleTypeId: '', name: '', manufactureYear: new Date().getFullYear().toString(), description: '', catalogImage: '' });
    setSelectedCategoryId('');
    setShowForm(false);
  };

  const handleSave = async () => {
    if (!form.manufacturerId || !form.vehicleTypeId || !form.name) {
      error('Preencha todos os campos obrigatórios.'); return;
    }
    setSaving(true);
    try {
      const dto = {
        manufacturerId: form.manufacturerId,
        vehicleTypeId: form.vehicleTypeId,
        name: form.name.trim(),
        manufactureYear: parseInt(form.manufactureYear),
        description: form.description.trim() || undefined,
        catalogImage: form.catalogImage.trim() || undefined,
      };
      if (editingModel) {
        const updated = await vehicleModelService.update(editingModel.id, dto);
        setModels(p => p.map(m => m.id === editingModel.id ? { ...m, ...updated } : m));
        success('Modelo atualizado!');
      } else {
        const created = await vehicleModelService.create(dto);
        setModels(p => [...p, created]);
        success('Modelo criado!');
      }
      resetForm();
    } catch (err: unknown) {
      error(err instanceof Error ? err.message : 'Erro ao salvar modelo.');
    } finally { setSaving(false); }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    try {
      await vehicleModelService.remove(deleteId);
      setModels(p => p.filter(m => m.id !== deleteId));
      success('Modelo removido.');
      setDeleteId(null);
    } catch (err: unknown) {
      error(err instanceof Error ? err.message : 'Erro ao remover.');
    } finally { setDeleting(false); }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Form toggle */}
      {!showForm ? (
        <div className="flex justify-end">
          <Button onClick={() => setShowForm(true)} leftIcon={<Plus size={14} />}>
            Novo Modelo
          </Button>
        </div>
      ) : (
        <GlassPanel neon="blue" padding="p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-white font-semibold flex items-center gap-2">
              <Car size={16} className="text-[#00D4FF]" />
              {editingModel ? 'Editar Modelo' : 'Novo Modelo de Veículo'}
            </h2>
            <button onClick={resetForm} className="text-white/30 hover:text-white transition-colors"><X size={16} /></button>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Fabricante *"
              value={form.manufacturerId}
              onChange={e => setForm(p => ({ ...p, manufacturerId: e.target.value }))}
              options={manufacturers.map(m => ({ value: m.id, label: m.name }))}
              placeholder="Selecione..."
            />
            <Select
              label="Categoria"
              value={selectedCategoryId}
              onChange={e => setSelectedCategoryId(e.target.value)}
              options={categories.map(c => ({ value: c.id, label: c.name }))}
              placeholder="Selecione uma categoria..."
            />
            <Select
              label="Tipo de Veículo *"
              value={form.vehicleTypeId}
              onChange={e => setForm(p => ({ ...p, vehicleTypeId: e.target.value }))}
              options={filteredTypes.map(t => ({ value: t.id, label: t.name }))}
              placeholder="Selecione..."
            />
            <Input
              label="Nome do Modelo *"
              value={form.name}
              onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
              placeholder="Ex: Civic, Corolla, A320..."
            />
            <Input
              label="Ano de Fabricação *"
              type="number"
              min="1900"
              max="2100"
              value={form.manufactureYear}
              onChange={e => setForm(p => ({ ...p, manufactureYear: e.target.value }))}
            />
            <Input
              label="URL da Imagem (opcional)"
              value={form.catalogImage}
              onChange={e => setForm(p => ({ ...p, catalogImage: e.target.value }))}
              placeholder="https://..."
            />
            <div className="col-span-2">
              <Input
                label="Descrição (opcional)"
                value={form.description}
                onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
                placeholder="Breve descrição do modelo..."
              />
            </div>
          </div>

          <div className="flex gap-3 mt-5 justify-end">
            <Button variant="ghost" onClick={resetForm}>Cancelar</Button>
            <Button isLoading={saving} onClick={handleSave} leftIcon={editingModel ? <Pencil size={14} /> : <Plus size={14} />}>
              {editingModel ? 'Salvar Alterações' : 'Criar Modelo'}
            </Button>
          </div>
        </GlassPanel>
      )}

      {/* List */}
      <GlassPanel padding="p-0" className="overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/8">
          <h2 className="text-white font-semibold flex items-center gap-2">
            <Car size={16} className="text-[#00D4FF]" />
            Modelos Cadastrados ({models.length})
          </h2>
          <button onClick={load} className="text-white/30 hover:text-white transition-colors"><RefreshCw size={14} /></button>
        </div>
        {loading ? <LoadingState /> : (
          <div className="divide-y divide-white/6">
            {models.map(model => (
              <div key={model.id} className="flex items-center gap-4 px-5 py-3 hover:bg-white/3 transition-colors group">
                <img
                  src={model.catalogImage || VEHICLE_PLACEHOLDER}
                  alt={model.name}
                  className="w-16 h-10 object-cover rounded-lg border border-white/10 bg-white/5 shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-white font-medium text-sm truncate">{model.manufacturer?.name} {model.name}</p>
                  <p className="text-white/30 text-xs">{model.manufactureYear} · {model.vehicleType?.category?.name} › {model.vehicleType?.name}</p>
                </div>
                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                  <button onClick={() => handleEdit(model)} className="w-8 h-8 rounded-lg border border-white/10 flex items-center justify-center text-white/40 hover:text-[#00D4FF] hover:border-[#00D4FF]/30 transition-all">
                    <Pencil size={13} />
                  </button>
                  <button onClick={() => setDeleteId(model.id)} className="w-8 h-8 rounded-lg border border-white/10 flex items-center justify-center text-white/40 hover:text-red-400 hover:border-red-500/30 transition-all">
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            ))}
            {models.length === 0 && <p className="text-white/30 text-sm text-center py-10">Nenhum modelo cadastrado.</p>}
          </div>
        )}
      </GlassPanel>

      <ConfirmDialog
        isOpen={!!deleteId}
        title="Remover Modelo"
        message="Tem certeza? Esta ação remove o modelo permanentemente e pode afetar anúncios existentes."
        danger confirmLabel="Remover"
        onConfirm={handleDelete} onCancel={() => setDeleteId(null)} isLoading={deleting}
      />
    </div>
  );
}

// ══════════════════════════════════════════════════
// LISTINGS TAB
// ══════════════════════════════════════════════════
function ListingsTab() {
  const { success, error } = useToast();
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try { setListings(await listingService.findAllForAdmin()); }
    catch { error('Erro ao carregar anúncios.'); }
    finally { setLoading(false); }
  }, [error]);

  useEffect(() => { void load(); }, [load]);

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    try {
      await listingService.remove(deleteId);
      setListings(p => p.filter(l => l.id !== deleteId));
      success('Anúncio removido.');
      setDeleteId(null);
    } catch (err: unknown) {
      error(err instanceof Error ? err.message : 'Erro ao remover anúncio.');
    } finally { setDeleting(false); }
  };

  const statusVariant: Record<string, 'green' | 'amber' | 'gray' | 'red' | 'blue'> = {
    PUBLISHED: 'green', DRAFT: 'amber', SOLD: 'blue', INACTIVE: 'gray',
  };

  return (
    <div className="flex flex-col gap-6">
      <GlassPanel padding="p-0" className="overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/8">
          <h2 className="text-white font-semibold flex items-center gap-2">
            <ShoppingBag size={16} className="text-[#00D4FF]" />
            Todos os Anúncios ({listings.length})
          </h2>
          <button onClick={load} className="text-white/30 hover:text-white transition-colors"><RefreshCw size={14} /></button>
        </div>
        {loading ? <LoadingState /> : (
          <div className="divide-y divide-white/6">
            {listings.map(listing => {
              const img = listing.images?.[0]?.url || listing.vehicleModel?.catalogImage || VEHICLE_PLACEHOLDER;
              return (
                <div key={listing.id} className="flex items-center gap-4 px-5 py-3 hover:bg-white/3 transition-colors group">
                  <img src={img} alt={listing.title} className="w-16 h-10 object-cover rounded-lg border border-white/10 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-medium text-sm truncate">{listing.title}</p>
                    <p className="text-white/30 text-xs">{listing.city}, {listing.state}</p>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <span className="text-[#00D4FF] font-bold text-sm">{formatCurrency(listing.price)}</span>
                    <Badge label={formatListingStatus(listing.status)} variant={statusVariant[listing.status] ?? 'gray'} />
                    <button onClick={() => setDeleteId(listing.id)} className="w-8 h-8 rounded-lg border border-white/10 flex items-center justify-center text-white/40 hover:text-red-400 hover:border-red-500/30 transition-all opacity-0 group-hover:opacity-100">
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              );
            })}
            {listings.length === 0 && <p className="text-white/30 text-sm text-center py-10">Nenhum anúncio encontrado.</p>}
          </div>
        )}
      </GlassPanel>

      <ConfirmDialog
        isOpen={!!deleteId}
        title="Remover Anúncio"
        message="Tem certeza que deseja remover este anúncio permanentemente?"
        danger confirmLabel="Remover"
        onConfirm={handleDelete} onCancel={() => setDeleteId(null)} isLoading={deleting}
      />
    </div>
  );
}
