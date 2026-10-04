// ============================================================
// AUTOHUB — SERVICE: ModelAttributes
// GET /api/vehicle-models/:vehicleModelId/attributes
// GET /api/model-attributes/:id
// POST /api/vehicle-models/:vehicleModelId/attributes
// PATCH /api/model-attributes/:id
// DELETE /api/model-attributes/:id
// ============================================================

import { apiRequest } from '@/src/lib/api-client';
import type { ModelAttribute, CreateModelAttributeDto, UpdateModelAttributeDto } from '@/src/types';

export interface CreateModelAttributeDto {
  name: string;
  type: string;
  displayOrder?: number;
  options?: { value: string; displayOrder?: number }[];
}

export interface UpdateModelAttributeDto {
  name?: string;
  type?: string;
  displayOrder?: number;
}

export const modelAttributeService = {
  async findByVehicleModel(vehicleModelId: string): Promise<ModelAttribute[]> {
    return apiRequest<ModelAttribute[]>(`/vehicle-models/${vehicleModelId}/attributes`, {
      auth: true,
    });
  },

  async findOne(id: string): Promise<ModelAttribute> {
    return apiRequest<ModelAttribute>(`/model-attributes/${id}`, { auth: true });
  },

  async create(
    vehicleModelId: string,
    dto: CreateModelAttributeDto,
  ): Promise<ModelAttribute> {
    return apiRequest<ModelAttribute>(`/vehicle-models/${vehicleModelId}/attributes`, {
      method: 'POST',
      body: JSON.stringify(dto),
      auth: true,
    });
  },

  async update(id: string, dto: UpdateModelAttributeDto): Promise<ModelAttribute> {
    return apiRequest<ModelAttribute>(`/model-attributes/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(dto),
      auth: true,
    });
  },

  async remove(id: string): Promise<void> {
    return apiRequest<void>(`/model-attributes/${id}`, {
      method: 'DELETE',
      auth: true,
    });
  },
};
