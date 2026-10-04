// ============================================================
// AUTOHUB — TIPOS TYPESCRIPT
// Refletem exatamente o contrato do backend (Prisma schema)
// ============================================================

// ------ Enums -----------------------------------------------

export type AccountType = 'INDIVIDUAL' | 'DEALERSHIP';
export type UserRole = 'USER' | 'ADMIN';
export type AttributeType = 'BOOLEAN' | 'INTEGER' | 'DECIMAL' | 'TEXT' | 'SELECT' | 'MULTI_SELECT';
export type ListingStatus = 'DRAFT' | 'PUBLISHED' | 'SOLD' | 'INACTIVE';
export type WalletTransactionType = 'DEPOSIT' | 'PURCHASE' | 'SALE';

// ------ Entidades -------------------------------------------

export interface Category {
  id: string;
  name: string;
}

export interface VehicleType {
  id: string;
  categoryId: string;
  name: string;
  category?: Category;
}

export interface Manufacturer {
  id: string;
  name: string;
}

export interface ModelAttributeOption {
  id: string;
  attributeId: string;
  value: string;
  displayOrder: number;
}

export interface ModelAttribute {
  id: string;
  vehicleModelId: string;
  name: string;
  type: AttributeType;
  required: boolean;
  displayOrder: number;
  options?: ModelAttributeOption[];
}

export interface VehicleModel {
  id: string;
  vehicleTypeId: string;
  manufacturerId: string;
  name: string;
  manufactureYear: number;
  description?: string | null;
  catalogImage?: string | null;
  vehicleType?: VehicleType;
  manufacturer?: Manufacturer;
  attributes?: ModelAttribute[];
}

export interface ListingImage {
  id: string;
  listingId: string;
  url: string;
  displayOrder: number;
  createdAt: string;
}

export interface ListingAttributeValueOption {
  listingAttributeValueId: string;
  modelAttributeOptionId: string;
}

export interface ListingAttributeValue {
  id: string;
  listingId: string;
  modelAttributeId: string;
  textValue?: string | null;
  integerValue?: number | null;
  decimalValue?: number | null;
  booleanValue?: boolean | null;
  modelAttribute?: ModelAttribute;
  selectedOptions?: ListingAttributeValueOption[];
}

export interface Listing {
  id: string;
  sellerId?: string | null;
  vehicleModelId: string;
  title: string;
  description?: string | null;
  price: number; // Decimal do Prisma serializado como number na API
  acceptsProposals: boolean;
  status: ListingStatus;
  country: string;
  state: string;
  city: string;
  createdAt: string;
  updatedAt: string;
  soldAt?: string | null;
  vehicleModel?: VehicleModel;
  images?: ListingImage[];
  attributeValues?: ListingAttributeValue[];
}

export interface UserPublic {
  id: string;
  name: string;
  email: string;
  accountType: AccountType;
  role: UserRole;
  photo?: string | null;
  description?: string | null;
  city: string;
  state: string;
  country: string;
}

// ------ DTOs de requisição ----------------------------------

export interface CreateCategoryDto {
  name: string;
}

export interface UpdateCategoryDto {
  name: string;
}

export interface CreateVehicleTypeDto {
  name: string;
  categoryId: string;
}

export interface UpdateVehicleTypeDto {
  name: string;
  categoryId: string;
}

export interface CreateManufacturerDto {
  name: string;
}

export interface UpdateManufacturerDto {
  name: string;
}

export interface CreateVehicleModelDto {
  vehicleTypeId: string;
  manufacturerId: string;
  name: string;
  manufactureYear: number;
  description?: string;
  catalogImage?: string;
}

export interface UpdateVehicleModelDto {
  vehicleTypeId?: string;
  manufacturerId?: string;
  name?: string;
  manufactureYear?: number;
  description?: string;
  catalogImage?: string;
}

export interface CreateListingDto {
  vehicleModelId: string;
  title: string;
  description?: string;
  price: number;
  acceptsProposals?: boolean;
  state: string;
  city: string;
}

export interface UpdateListingDto {
  title?: string;
  description?: string;
  price?: number;
  acceptsProposals?: boolean;
  state?: string;
  city?: string;
}

export interface ListingSearchParams {
  q?: string;
  categoryId?: string;
  vehicleTypeId?: string;
  manufacturerId?: string;
  vehicleModelId?: string;
  minPrice?: number;
  maxPrice?: number;
  minYear?: number;
  maxYear?: number;
  state?: string;
  city?: string;
  acceptsProposals?: boolean;
  page?: number;
  limit?: number;
  sortBy?: 'price' | 'year' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
  attributes?: string;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  user: UserPublic;
}

export interface CreateUserDto {
  name: string;
  email: string;
  password: string;
  accountType: AccountType;
  document: string;
  phone: string;
  birthDate?: string;
  foundationDate?: string;
  photo?: string;
  description?: string;
  city: string;
  state: string;
  address?: string;
  cep?: string;
  stateRegistration?: string;
}

// ------ Respostas paginadas ---------------------------------

export interface PaginatedListings {
  data: Listing[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// ------ Erros da API ----------------------------------------

export interface ApiError {
  statusCode: number;
  message: string | string[];
  error?: string;
}
