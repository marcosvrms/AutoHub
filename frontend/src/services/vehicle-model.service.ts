// ============================================================
// AUTOHUB — SERVICE: VehicleModels
// Endpoints: GET /api/vehicle-models, GET /api/vehicle-models/:id
// GET /api/vehicle-models/:id/attributes
// POST /api/vehicle-models, PATCH, DELETE
// ============================================================

import { apiRequest } from '@/src/lib/api-client';
import type {
  VehicleModel,
  ModelAttribute,
  CreateVehicleModelDto,
  UpdateVehicleModelDto,
} from '@/src/types';

export const vehicleModelService = {
  async findAll(): Promise<VehicleModel[]> {
    return apiRequest<VehicleModel[]>('/vehicle-models');
  },

  async findOne(id: string): Promise<VehicleModel> {
    return apiRequest<VehicleModel>(`/vehicle-models/${id}`);
  },

  async findAttributes(vehicleModelId: string): Promise<ModelAttribute[]> {
    return apiRequest<ModelAttribute[]>(`/vehicle-models/${vehicleModelId}/attributes`);
  },

  async create(dto: CreateVehicleModelDto): Promise<VehicleModel> {
    return apiRequest<VehicleModel>('/vehicle-models', {
      method: 'POST',
      body: JSON.stringify(dto),
      auth: true,
    });
  },

  async update(id: string, dto: UpdateVehicleModelDto): Promise<VehicleModel> {
    return apiRequest<VehicleModel>(`/vehicle-models/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(dto),
      auth: true,
    });
  },

  async remove(id: string): Promise<void> {
    return apiRequest<void>(`/vehicle-models/${id}`, {
      method: 'DELETE',
      auth: true,
    });
  },
};
