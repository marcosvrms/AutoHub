import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service.js';

@Injectable()
export class ManufacturersService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return this.prisma.manufacturer.findMany({
      orderBy: {
        name: 'asc',
      },
    });
  }

  async findOne(id: string) {
    const manufacturer = await this.prisma.manufacturer.findUnique({
      where: {
        id,
      },
    });

    if (!manufacturer) {
      throw new NotFoundException('Fabricante não encontrado.');
    }

    return manufacturer;
  }

  async create(name: string) {
    const normalizedName = name.trim();

    if (!normalizedName) {
      throw new ConflictException(
        'O nome do fabricante é obrigatório.',
      );
    }

    const existingManufacturer =
      await this.prisma.manufacturer.findUnique({
        where: {
          name: normalizedName,
        },
      });

    if (existingManufacturer) {
      throw new ConflictException(
        'Esse fabricante já está cadastrado.',
      );
    }

    return this.prisma.manufacturer.create({
      data: {
        name: normalizedName,
      },
    });
  }

  async update(id: string, name: string) {
    await this.findOne(id);

    const normalizedName = name.trim();

    if (!normalizedName) {
      throw new ConflictException(
        'O nome do fabricante é obrigatório.',
      );
    }

    const existingManufacturer =
      await this.prisma.manufacturer.findUnique({
        where: {
          name: normalizedName,
        },
      });

    if (
      existingManufacturer &&
      existingManufacturer.id !== id
    ) {
      throw new ConflictException(
        'Esse fabricante já está cadastrado.',
      );
    }

    return this.prisma.manufacturer.update({
      where: {
        id,
      },
      data: {
        name: normalizedName,
      },
    });
  }

  async remove(id: string) {
    await this.findOne(id);

    return this.prisma.manufacturer.delete({
      where: {
        id,
      },
    });
  }
}