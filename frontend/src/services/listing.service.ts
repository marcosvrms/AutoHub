// ============================================================
// AUTOHUB — SERVICE: Listings
// Endpoints: GET /api/listings (public), GET /api/listings/:id
// POST /api/listings (auth), PATCH /api/listings/:id (auth)
// POST /api/listings/:id/publish, /deactivate, /sell
// GET /api/listings/mine, GET /api/listings/admin/all (ADMIN)
// GET /api/listings/:id/images, POST /api/listings/:id/images
// POST /api/listings/:id/images/upload
// DELETE /api/listings/:listingId/images/:imageId
// GET /api/listings/:id/attributes, PATCH /api/listings/:id/attributes
// DELETE /api/listings/:id (ADMIN)
// ============================================================

import { apiRequest, buildQueryString } from '@/src/lib/api-client';
import type {
  Listing,
  ListingImage,
  ListingAttributeValue,
  CreateListingDto,
  UpdateListingDto,
  ListingSearchParams,
} from '@/src/types';

export interface PaginatedListings {
  data: Listing[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export const listingService = {
  async findAll(params: ListingSearchParams = {}): Promise<PaginatedListings> {
    const qs = buildQueryString(params as Record<string, unknown>);
    return apiRequest<PaginatedListings>(`/listings${qs}`);
  },

  async findOne(id: string): Promise<Listing> {
    return apiRequest<Listing>(`/listings/${id}`, { auth: true });
  },

  async findMine(): Promise<Listing[]> {
    return apiRequest<Listing[]>('/listings/mine', { auth: true });
  },

  async findAllForAdmin(): Promise<Listing[]> {
    return apiRequest<Listing[]>('/listings/admin/all', { auth: true });
  },

  async create(dto: CreateListingDto): Promise<Listing> {
    return apiRequest<Listing>('/listings', {
      method: 'POST',
      body: JSON.stringify(dto),
      auth: true,
    });
  },

  async update(id: string, dto: UpdateListingDto): Promise<Listing> {
    return apiRequest<Listing>(`/listings/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(dto),
      auth: true,
    });
  },

  async publish(id: string): Promise<Listing> {
    return apiRequest<Listing>(`/listings/${id}/publish`, {
      method: 'POST',
      auth: true,
    });
  },

  async deactivate(id: string): Promise<Listing> {
    return apiRequest<Listing>(`/listings/${id}/deactivate`, {
      method: 'POST',
      auth: true,
    });
  },

  async markAsSold(id: string): Promise<Listing> {
    return apiRequest<Listing>(`/listings/${id}/sell`, {
      method: 'POST',
      auth: true,
    });
  },

  async remove(id: string): Promise<void> {
    return apiRequest<void>(`/listings/${id}`, {
      method: 'DELETE',
      auth: true,
    });
  },

  async findImages(id: string): Promise<ListingImage[]> {
    return apiRequest<ListingImage[]>(`/listings/${id}/images`, { auth: true });
  },

  async addImage(
    id: string,
    dto: { url: string; displayOrder: number },
  ): Promise<ListingImage> {
    return apiRequest<ListingImage>(`/listings/${id}/images`, {
      method: 'POST',
      body: JSON.stringify(dto),
      auth: true,
    });
  },

  async uploadImage(
    id: string,
    file: File,
    displayOrder: number,
  ): Promise<ListingImage> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('displayOrder', String(displayOrder));

    const token = typeof window !== 'undefined' ? localStorage.getItem('autohub_token') : null;
    const headers: Record<string, string> = {};
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001/api'}/listings/${id}/images/upload`,
      { method: 'POST', body: formData, headers },
    );

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error((err as { message?: string }).message ?? `Erro ${response.status}`);
    }

    return response.json() as Promise<ListingImage>;
  },

  async removeImage(listingId: string, imageId: string): Promise<void> {
    return apiRequest<void>(`/listings/${listingId}/images/${imageId}`, {
      method: 'DELETE',
      auth: true,
    });
  },

  async findAttributes(id: string): Promise<ListingAttributeValue[]> {
    return apiRequest<ListingAttributeValue[]>(`/listings/${id}/attributes`, { auth: true });
  },

  async updateAttributes(
    id: string,
    values: Array<{
      modelAttributeId: string;
      textValue?: string;
      integerValue?: number;
      decimalValue?: number;
      booleanValue?: boolean;
      selectedOptionIds?: string[];
    }>,
  ): Promise<ListingAttributeValue[]> {
    return apiRequest<ListingAttributeValue[]>(`/listings/${id}/attributes`, {
      method: 'PATCH',
      body: JSON.stringify({ values }),
      auth: true,
    });
  },
};
