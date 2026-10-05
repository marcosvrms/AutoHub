import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';

import { Public } from '../auth/decorators/public.decorator.js';
import { ManufacturersService } from './manufacturers.service.js';

@Controller('manufacturers')
export class ManufacturersController {
  constructor(
    private readonly manufacturersService: ManufacturersService,
  ) {}

  @Public()
  @Get()
  findAll() {
    return this.manufacturersService.findAll();
  }

  @Public()
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.manufacturersService.findOne(id);
  }

  @Post()
  create(@Body('name') name: string) {
    return this.manufacturersService.create(name);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body('name') name: string,
  ) {
    return this.manufacturersService.update(id, name);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.manufacturersService.remove(id);
  }
}