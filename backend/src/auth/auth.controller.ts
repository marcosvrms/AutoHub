import {
  Body,
  Controller,
  Post,
} from '@nestjs/common';

import {
  AuthService,
} from './auth.service.js';

import {
  LoginDto,
} from './dto/login.dto.js';

import {
  Public,
} from './decorators/public.decorator.js';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
  ) {}

  @Public()
  @Post('login')
  login(
    @Body() dto: LoginDto,
  ) {
    return this.authService.login(dto);
  }
}