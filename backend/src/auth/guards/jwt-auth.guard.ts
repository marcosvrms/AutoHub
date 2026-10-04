import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

import { Reflector } from '@nestjs/core';

import { JwtService } from '@nestjs/jwt';

import { UsersService } from '../../users/users.service.js';

import {
  IS_PUBLIC_KEY,
} from '../decorators/public.decorator.js';

import {
  AuthenticatedUser,
} from '../types/authenticated-user.js';

@Injectable()
export class JwtAuthGuard
  implements CanActivate
{
  constructor(
    private readonly reflector: Reflector,
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
  ) {}

  async canActivate(
    context: ExecutionContext,
  ): Promise<boolean> {
    const isPublic =
      this.reflector.getAllAndOverride<boolean>(
        IS_PUBLIC_KEY,
        [
          context.getHandler(),
          context.getClass(),
        ],
      );

    if (isPublic) {
      return true;
    }

    const request =
      context.switchToHttp().getRequest();

    const authorization =
      request.headers.authorization;

    if (
      !authorization ||
      !authorization.startsWith('Bearer ')
    ) {
      throw new UnauthorizedException(
        'Token de autenticação não informado.',
      );
    }

    const token =
      authorization.substring(7);

    let payload: {
      sub?: string;
    };

    try {
      payload =
        await this.jwtService.verifyAsync(
          token,
        );
    } catch {
      throw new UnauthorizedException(
        'Token de autenticação inválido ou expirado.',
      );
    }

    if (!payload.sub) {
      throw new UnauthorizedException(
        'Token de autenticação inválido.',
      );
    }

    const user =
      await this.usersService.findByIdForAuth(
        payload.sub,
      );

    if (!user) {
      throw new UnauthorizedException(
        'Usuário não encontrado.',
      );
    }

    request.user = user;

    const authenticatedUser:
      AuthenticatedUser = {
      sub: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      accountType: user.accountType,
    };

    request.user =
      authenticatedUser;

    return true;
  }
}