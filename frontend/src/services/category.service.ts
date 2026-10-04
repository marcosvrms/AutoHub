// ============================================================
// AUTOHUB — SERVICE: Categories
// Endpoints: GET /api/categories, GET /api/categories/:id
// POST /api/categories (ADMIN), PATCH /api/categories/:id (ADMIN), DELETE /api/categories/:id (ADMIN)
// ============================================================

import { apiRequest } from '@/src/lib/api-client';
import type { Category } from '@/src/types';

export const categoryService = {
  async findAll(): Promise<Category[]> {
    return apiRequest<Category[]>('/categories');
  },

  async findOne(id: string): Promise<Category> {
    return apiRequest<Category>(`/categories/${id}`);
  },

  async create(name: string): Promise<Category> {
    return apiRequest<Category>('/categories', {
      method: 'POST',
      body: JSON.stringify({ name }),
      auth: true,
    });
  },

  async update(id: string, name: string): Promise<Category> {
    return apiRequest<Category>(`/categories/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({ name }),
      auth: true,
    });
  },

  async remove(id: string): Promise<void> {
    return apiRequest<void>(`/categories/${id}`, {
      method: 'DELETE',
      auth: true,
    });
  },
};
