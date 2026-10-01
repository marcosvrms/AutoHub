import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service.js';

@Injectable()
export class VehicleTypesService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return this.prisma.vehicleType.findMany({
      include: {
        category: true,
      },
      orderBy: {
        name: 'asc',
      },
    });
  }

  async findByCategory(categoryId: string) {
    await this.ensureCategoryExists(categoryId);

    return this.prisma.vehicleType.findMany({
      where: {
        categoryId,
      },
      orderBy: {
        name: 'asc',
      },
    });
  }

  async findOne(id: string) {
    const vehicleType = await this.prisma.vehicleType.findUnique({
      where: {
        id,
      },
      include: {
        category: true,
      },
    });

    if (!vehicleType) {
      throw new NotFoundException('Tipo de veículo não encontrado.');
    }

    return vehicleType;
  }

  async create(name: string, categoryId: string) {
    const normalizedName = name.trim();

    if (!normalizedName) {
      throw new ConflictException(
        'O nome do tipo de veículo é obrigatório.',
      );
    }

    await this.ensureCategoryExists(categoryId);

    const existingVehicleType =
      await this.prisma.vehicleType.findFirst({
        where: {
          name: normalizedName,
          categoryId,
        },
      });

    if (existingVehicleType) {
      throw new ConflictException(
        'Esse tipo de veículo já existe nessa categoria.',
      );
    }

    return this.prisma.vehicleType.create({
      data: {
        name: normalizedName,
        categoryId,
      },
      include: {
        category: true,
      },
    });
  }

  async update(
    id: string,
    name: string,
    categoryId: string,
  ) {
    await this.findOne(id);

    const normalizedName = name.trim();

    if (!normalizedName) {
      throw new ConflictException(
        'O nome do tipo de veículo é obrigatório.',
      );
    }

    await this.ensureCategoryExists(categoryId);

    const existingVehicleType =
      await this.prisma.vehicleType.findFirst({
        where: {
          name: normalizedName,
          categoryId,
          NOT: {
            id,
          },
        },
      });

    if (existingVehicleType) {
      throw new ConflictException(
        'Esse tipo de veículo já existe nessa categoria.',
      );
    }

    return this.prisma.vehicleType.update({
      where: {
        id,
      },
      data: {
        name: normalizedName,
        categoryId,
      },
      include: {
        category: true,
      },
    });
  }

  async remove(id: string) {
    await this.findOne(id);

    return this.prisma.vehicleType.delete({
      where: {
        id,
      },
    });
  }

  private async ensureCategoryExists(categoryId: string) {
    const category = await this.prisma.category.findUnique({
      where: {
        id: categoryId,
      },
    });

    if (!category) {
      throw new NotFoundException('Categoria não encontrada.');
    }
  }
}