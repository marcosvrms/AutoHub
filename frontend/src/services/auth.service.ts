// ============================================================
// AUTOHUB — SERVICE: Auth
// POST /api/auth/login (public)
// POST /api/users (public - registro)
// GET /api/users/me (auth)
// ============================================================

import { apiRequest } from '@/src/lib/api-client';
import type { LoginDto, LoginResponse, CreateUserDto, UserPublic } from '@/src/types';

export const authService = {
  async login(dto: LoginDto): Promise<LoginResponse> {
    return apiRequest<LoginResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(dto),
    });
  },

  async register(dto: CreateUserDto): Promise<UserPublic> {
    return apiRequest<UserPublic>('/users', {
      method: 'POST',
      body: JSON.stringify(dto),
    });
  },

  async getMe(): Promise<UserPublic> {
    return apiRequest<UserPublic>('/users/me', { auth: true });
  },
};
