// ============================================================
// AUTOHUB — DADOS MOCKADOS
// !! ATENÇÃO: ESTES DADOS SÃO APENAS PARA DEMONSTRAÇÃO !!
// Não existem no banco de dados real.
// Utilizados enquanto as seguintes funcionalidades ainda não
// possuem dados no ambiente de desenvolvimento:
// - VehicleModels com imagens (catalogImage)
// - Listings completos
// - Manufacturers populados
// ============================================================

import type { VehicleModel, Manufacturer, Listing, Category, VehicleType } from '@/src/types';

// ---- MOCK: Categories (aguardando dados no DB) ----
export const MOCK_CATEGORIES: Category[] = [
  { id: 'mock-cat-terrestre', name: 'Terrestre' },
  { id: 'mock-cat-aereo', name: 'Aéreo' },
  { id: 'mock-cat-aquatico', name: 'Aquático' },
];

// ---- MOCK: Vehicle Types (aguardando dados no DB) ----
export const MOCK_VEHICLE_TYPES: VehicleType[] = [
  { id: 'mock-vt-carro', categoryId: 'mock-cat-terrestre', name: 'Carro', category: MOCK_CATEGORIES[0] },
  { id: 'mock-vt-moto', categoryId: 'mock-cat-terrestre', name: 'Moto', category: MOCK_CATEGORIES[0] },
  { id: 'mock-vt-aviao', categoryId: 'mock-cat-aereo', name: 'Avião', category: MOCK_CATEGORIES[1] },
  { id: 'mock-vt-helicoptero', categoryId: 'mock-cat-aereo', name: 'Helicóptero', category: MOCK_CATEGORIES[1] },
  { id: 'mock-vt-barco', categoryId: 'mock-cat-aquatico', name: 'Barco', category: MOCK_CATEGORIES[2] },
  { id: 'mock-vt-jetski', categoryId: 'mock-cat-aquatico', name: 'Jet Ski', category: MOCK_CATEGORIES[2] },
];

// ---- MOCK: Manufacturers (aguardando dados no DB) ----
export const MOCK_MANUFACTURERS: Manufacturer[] = [
  { id: 'mock-mfr-alpine', name: 'Alpine' },
  { id: 'mock-mfr-porsche', name: 'Porsche' },
  { id: 'mock-mfr-ferrari', name: 'Ferrari' },
  { id: 'mock-mfr-lamborghini', name: 'Lamborghini' },
  { id: 'mock-mfr-bmw', name: 'BMW' },
  { id: 'mock-mfr-mercedes', name: 'Mercedes-Benz' },
  { id: 'mock-mfr-honda', name: 'Honda' },
  { id: 'mock-mfr-toyota', name: 'Toyota' },
];

// ---- MOCK: Vehicle Models (Alpine como no GT7) ----
export const MOCK_VEHICLE_MODELS: VehicleModel[] = [
  {
    id: 'mock-vm-a110-17',
    vehicleTypeId: 'mock-vt-carro',
    manufacturerId: 'mock-mfr-alpine',
    name: 'A110',
    manufactureYear: 2017,
    description: 'O Alpine A110 é um esportivo leve de tração traseira com motor turbo 1.8L de 252 HP.',
    catalogImage: 'https://images.unsplash.com/photo-1558981285-6f0c94958bb6?w=1200&q=80',
    vehicleType: MOCK_VEHICLE_TYPES[0],
    manufacturer: MOCK_MANUFACTURERS[0],
    attributes: [
      { id: 'attr-1', vehicleModelId: 'mock-vm-a110-17', name: 'Potência', type: 'TEXT', required: false, displayOrder: 0 },
      { id: 'attr-2', vehicleModelId: 'mock-vm-a110-17', name: 'Torque', type: 'TEXT', required: false, displayOrder: 1 },
      { id: 'attr-3', vehicleModelId: 'mock-vm-a110-17', name: 'Tração', type: 'TEXT', required: false, displayOrder: 2 },
      { id: 'attr-4', vehicleModelId: 'mock-vm-a110-17', name: 'Peso', type: 'TEXT', required: false, displayOrder: 3 },
      { id: 'attr-5', vehicleModelId: 'mock-vm-a110-17', name: 'Cilindrada', type: 'TEXT', required: false, displayOrder: 4 },
    ],
  },
  {
    id: 'mock-vm-a110s',
    vehicleTypeId: 'mock-vt-carro',
    manufacturerId: 'mock-mfr-alpine',
    name: 'A110 S',
    manufactureYear: 2019,
    description: 'Versão esportiva do A110 com 292 HP e chassis mais rígido.',
    catalogImage: 'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=1200&q=80',
    vehicleType: MOCK_VEHICLE_TYPES[0],
    manufacturer: MOCK_MANUFACTURERS[0],
    attributes: [],
  },
  {
    id: 'mock-vm-a110r',
    vehicleTypeId: 'mock-vt-carro',
    manufacturerId: 'mock-mfr-alpine',
    name: 'A110 R',
    manufactureYear: 2022,
    description: 'A versão mais radical do A110. 300 HP, aerodinâmica agressiva, focada em circuito.',
    catalogImage: 'https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?w=1200&q=80',
    vehicleType: MOCK_VEHICLE_TYPES[0],
    manufacturer: MOCK_MANUFACTURERS[0],
    attributes: [],
  },
  {
    id: 'mock-vm-911-gt3',
    vehicleTypeId: 'mock-vt-carro',
    manufacturerId: 'mock-mfr-porsche',
    name: '911 GT3',
    manufactureYear: 2022,
    description: 'O Porsche 911 GT3 é a expressão máxima da engenharia motorsport em uma via pública.',
    catalogImage: 'https://images.unsplash.com/photo-1614200187524-dc4b892acf16?w=1200&q=80',
    vehicleType: MOCK_VEHICLE_TYPES[0],
    manufacturer: MOCK_MANUFACTURERS[1],
    attributes: [],
  },
];

// ---- MOCK: Listings (aguardando implementação de compra/venda real) ----
export const MOCK_LISTINGS: Listing[] = [
  {
    id: 'mock-lst-001',
    sellerId: null,
    vehicleModelId: 'mock-vm-a110-17',
    title: 'Alpine A110 2017 — Estado Impecável',
    description: 'Veículo em perfeito estado, revisado, com histórico completo. Única dona.',
    price: 380000,
    acceptsProposals: true,
    status: 'PUBLISHED',
    country: 'Brasil',
    state: 'SP',
    city: 'São Paulo',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    vehicleModel: MOCK_VEHICLE_MODELS[0],
    images: [
      {
        id: 'img-1',
        listingId: 'mock-lst-001',
        url: 'https://images.unsplash.com/photo-1558981285-6f0c94958bb6?w=1200&q=80',
        displayOrder: 1,
        createdAt: new Date().toISOString(),
      },
    ],
  },
  {
    id: 'mock-lst-002',
    sellerId: null,
    vehicleModelId: 'mock-vm-a110r',
    title: 'Alpine A110 R 2022 — Edição Limitada',
    description: 'Raridade absoluta. Apenas 300 unidades no mundo. Cor exclusiva.',
    price: 780000,
    acceptsProposals: false,
    status: 'PUBLISHED',
    country: 'Brasil',
    state: 'RJ',
    city: 'Rio de Janeiro',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    vehicleModel: MOCK_VEHICLE_MODELS[2],
    images: [],
  },
  {
    id: 'mock-lst-003',
    sellerId: null,
    vehicleModelId: 'mock-vm-911-gt3',
    title: 'Porsche 911 GT3 2022 — Direto da Concessionária',
    description: 'Zero km, nota fiscal, pacote full. Entrega imediata.',
    price: 1580000,
    acceptsProposals: false,
    status: 'PUBLISHED',
    country: 'Brasil',
    state: 'SP',
    city: 'São Paulo',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    vehicleModel: MOCK_VEHICLE_MODELS[3],
    images: [],
  },
];

// ---- MOCK: Attribute Values (para demonstração de painel técnico) ----
export const MOCK_ATTRIBUTE_VALUES: Record<string, Record<string, string>> = {
  'mock-vm-a110-17': {
    Potência: '252 HP',
    Torque: '320 Nm',
    Tração: 'RWD',
    Peso: '1.103 kg',
    Cilindrada: '1.8 L',
    Aspiração: 'Turbo',
    Marchas: '7 — DCT',
    'Vel. Máxima': '250 km/h',
  },
  'mock-vm-a110s': {
    Potência: '292 HP',
    Torque: '320 Nm',
    Tração: 'RWD',
    Peso: '1.114 kg',
    Cilindrada: '1.8 L',
    Aspiração: 'Turbo',
    Marchas: '7 — DCT',
    'Vel. Máxima': '260 km/h',
  },
  'mock-vm-a110r': {
    Potência: '300 HP',
    Torque: '340 Nm',
    Tração: 'RWD',
    Peso: '1.082 kg',
    Cilindrada: '1.8 L',
    Aspiração: 'Turbo',
    Marchas: '7 — DCT',
    'Vel. Máxima': '285 km/h',
  },
  'mock-vm-911-gt3': {
    Potência: '510 HP',
    Torque: '470 Nm',
    Tração: 'RWD',
    Peso: '1.435 kg',
    Cilindrada: '4.0 L',
    Aspiração: 'Naturalmente Aspirado',
    Marchas: '7 — PDK',
    'Vel. Máxima': '318 km/h',
  },
};
