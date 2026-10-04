// ============================================================
// AUTOHUB — SERVICE: VehicleTypes
// Endpoints: GET /api/vehicle-types, GET /api/vehicle-types/category/:categoryId
// GET /api/vehicle-types/:id, POST /api/vehicle-types, PATCH, DELETE
// ============================================================

import { apiRequest } from '@/src/lib/api-client';
import type { CreateVehicleTypeDto, UpdateVehicleTypeDto, VehicleType } from '@/src/types';

export const vehicleTypeService = {
  async findAll(): Promise<VehicleType[]> {
    return apiRequest<VehicleType[]>('/vehicle-types');
  },

  async findByCategory(categoryId: string): Promise<VehicleType[]> {
    return apiRequest<VehicleType[]>(`/vehicle-types/category/${categoryId}`);
  },

  async findOne(id: string): Promise<VehicleType> {
    return apiRequest<VehicleType>(`/vehicle-types/${id}`);
  },

  async create(dto: CreateVehicleTypeDto): Promise<VehicleType> {
    return apiRequest<VehicleType>('/vehicle-types', {
      method: 'POST',
      body: JSON.stringify(dto),
      auth: true,
    });
  },

  async update(id: string, dto: UpdateVehicleTypeDto): Promise<VehicleType> {
    return apiRequest<VehicleType>(`/vehicle-types/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(dto),
      auth: true,
    });
  },

  async remove(id: string): Promise<void> {
    return apiRequest<void>(`/vehicle-types/${id}`, {
      method: 'DELETE',
      auth: true,
    });
  },
};
