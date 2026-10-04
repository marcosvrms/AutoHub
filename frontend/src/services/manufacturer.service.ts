// ============================================================
// AUTOHUB — SERVICE: Manufacturers
// Endpoints: GET /api/manufacturers, GET /api/manufacturers/:id
// POST /api/manufacturers, PATCH /api/manufacturers/:id, DELETE /api/manufacturers/:id
// ============================================================

import { apiRequest } from '@/src/lib/api-client';
import type { Manufacturer, CreateManufacturerDto, UpdateManufacturerDto } from '@/src/types';

export const manufacturerService = {
  async findAll(): Promise<Manufacturer[]> {
    return apiRequest<Manufacturer[]>('/manufacturers');
  },

  async findOne(id: string): Promise<Manufacturer> {
    return apiRequest<Manufacturer>(`/manufacturers/${id}`);
  },

  async create(dto: CreateManufacturerDto): Promise<Manufacturer> {
    return apiRequest<Manufacturer>('/manufacturers', {
      method: 'POST',
      body: JSON.stringify(dto),
      auth: true,
    });
  },

  async update(id: string, dto: UpdateManufacturerDto): Promise<Manufacturer> {
    return apiRequest<Manufacturer>(`/manufacturers/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(dto),
      auth: true,
    });
  },

  async remove(id: string): Promise<void> {
    return apiRequest<void>(`/manufacturers/${id}`, {
      method: 'DELETE',
      auth: true,
    });
  },
};
