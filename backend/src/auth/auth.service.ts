import {
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

import {
  JwtService,
} from '@nestjs/jwt';

import {
  UsersService,
} from '../users/users.service.js';

import {
  verifyPassword,
} from '../users/password.utils.js';

import {
  LoginDto,
} from './dto/login.dto.js';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async login(
    dto: LoginDto,
  ) {
    const email =
      dto.email
        .trim()
        .toLowerCase();

    const user =
      await this.usersService.findByEmail(
        email,
      );

    if (!user) {
      throw new UnauthorizedException(
        'Email ou senha inválidos.',
      );
    }

    const validPassword =
      await verifyPassword(
        dto.password,
        user.passwordHash,
      );

    if (!validPassword) {
      throw new UnauthorizedException(
        'Email ou senha inválidos.',
      );
    }

    const accessToken =
      await this.jwtService.signAsync({
        sub: user.id,
      });

    return {
      accessToken,

      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        accountType: user.accountType,
        role: user.role,
        photo: user.photo,
        description: user.description,
        city: user.city,
        state: user.state,
        country: user.country,
      },
    };
  }
}