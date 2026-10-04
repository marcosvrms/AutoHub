import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

import { Reflector } from '@nestjs/core';

import {
  UserRole,
} from '../../generated/prisma/client.js';

import {
  ROLES_KEY,
} from '../decorators/roles.decorator.js';

import {
  AuthenticatedUser,
} from '../types/authenticated-user.js';

@Injectable()
export class RolesGuard
  implements CanActivate
{
  constructor(
    private readonly reflector: Reflector,
  ) {}

  canActivate(
    context: ExecutionContext,
  ): boolean {
    const requiredRoles =
      this.reflector.getAllAndOverride<
        UserRole[]
      >(
        ROLES_KEY,
        [
          context.getHandler(),
          context.getClass(),
        ],
      );

    if (!requiredRoles) {
      return true;
    }

    const request =
      context.switchToHttp().getRequest();

    const user:
      AuthenticatedUser =
      request.user;

    if (!user) {
      throw new UnauthorizedException();
    }

    if (
      requiredRoles.includes(
        user.role,
      )
    ) {
      return true;
    }

    throw new ForbiddenException(
      'Você não possui permissão para realizar esta operação.',
    );
  }
}