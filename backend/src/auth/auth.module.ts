import { Module } from '@nestjs/common';
import {
  APP_GUARD,
} from '@nestjs/core';

import {
  ConfigService,
} from '@nestjs/config';

import {
  JwtModule,
} from '@nestjs/jwt';

import { UsersModule } from '../users/users.module.js';

import {
  AuthController,
} from './auth.controller.js';

import {
  AuthService,
} from './auth.service.js';

import {
  JwtAuthGuard,
} from './guards/jwt-auth.guard.js';

import {
  RolesGuard,
} from './guards/roles.guard.js';

@Module({
  imports: [
    UsersModule,

    JwtModule.registerAsync({
      inject: [ConfigService],

      useFactory: (
        configService: ConfigService,
      ) => {
        const secret =
          configService.get<string>(
            'JWT_SECRET',
          );

        if (
          !secret ||
          secret.length < 32
        ) {
          throw new Error(
            'JWT_SECRET precisa possuir pelo menos 32 caracteres.',
          );
        }

        return {
          secret,

          signOptions: {
            expiresIn: 3600,
          },
        };
      },
    }),
  ],

  controllers: [
    AuthController,
  ],

  providers: [
    AuthService,

    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },

    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AuthModule {}