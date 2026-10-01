import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service.js';

@Injectable()
export class CategoriesService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return this.prisma.category.findMany({
      orderBy: {
        name: 'asc',
      },
    });
  }

  async findOne(id: string) {
    const category = await this.prisma.category.findUnique({
      where: {
        id,
      },
    });

    if (!category) {
      throw new NotFoundException('Categoria não encontrada.');
    }

    return category;
  }

  async create(name: string) {
    const normalizedName = name.trim();

    if (!normalizedName) {
      throw new ConflictException('O nome da categoria é obrigatório.');
    }

    return this.prisma.category.create({
      data: {
        name: normalizedName,
      },
    });
  }

  async update(id: string, name: string) {
    await this.findOne(id);

    const normalizedName = name.trim();

    if (!normalizedName) {
      throw new ConflictException('O nome da categoria é obrigatório.');
    }

    return this.prisma.category.update({
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

    return this.prisma.category.delete({
      where: {
        id,
      },
    });
  }
}