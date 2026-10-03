import {
  ConflictException,
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service.js';

import { AttributeType } from '../generated/prisma/client.js';

import { CreateModelAttributeDto } from './dto/create-model-attribute.dto.js';
import { UpdateModelAttributeDto } from './dto/update-model-attribute.dto.js';

@Injectable()
export class ModelAttributesService {
  constructor(private readonly prisma: PrismaService) {}

  async findByVehicleModel(vehicleModelId: string) {
    await this.ensureVehicleModelExists(vehicleModelId);

    return this.prisma.modelAttribute.findMany({
      where: {
        vehicleModelId,
      },
      include: {
        options: {
          orderBy: {
            displayOrder: 'asc',
          },
        },
      },
      orderBy: {
        displayOrder: 'asc',
      },
    });
  }

  async findOne(id: string) {
    const attribute =
      await this.prisma.modelAttribute.findUnique({
        where: {
          id,
        },
        include: {
          options: {
            orderBy: {
              displayOrder: 'asc',
            },
          },
          vehicleModel: {
            include: {
              manufacturer: true,
              vehicleType: {
                include: {
                  category: true,
                },
              },
            },
          },
        },
      });

    if (!attribute) {
      throw new NotFoundException(
        'Atributo do modelo não encontrado.',
      );
    }

    return attribute;
  }

  async create(
    vehicleModelId: string,
    dto: CreateModelAttributeDto,
  ) {
    await this.ensureVehicleModelExists(vehicleModelId);

    const name = dto.name.trim();

    if (!name) {
      throw new BadRequestException(
        'O nome do atributo é obrigatório.',
      );
    }

    await this.ensureAttributeDoesNotExist(
      vehicleModelId,
      name,
    );

    const options = this.normalizeOptions(
      dto.options ?? [],
    );

    this.validateOptions(dto.type, options);

    return this.prisma.modelAttribute.create({
      data: {
        vehicleModelId,
        name,
        type: dto.type,
        required: true,
        displayOrder: dto.displayOrder ?? 0,
        options: {
          create: options,
        },
      },
      include: {
        options: {
          orderBy: {
            displayOrder: 'asc',
          },
        },
      },
    });
  }

  async update(
    id: string,
    dto: UpdateModelAttributeDto,
  ) {
    const currentAttribute = await this.findOne(id);

    const name =
      dto.name?.trim() ?? currentAttribute.name;

    const type =
      dto.type ?? currentAttribute.type;

    await this.ensureAttributeDoesNotExist(
      currentAttribute.vehicleModelId,
      name,
      id,
    );

    let options = currentAttribute.options.map(
      (option) => ({
        value: option.value,
        displayOrder: option.displayOrder,
      }),
    );

    if (dto.options !== undefined) {
      options = this.normalizeOptions(dto.options);
    }

    this.validateOptions(type, options);

    return this.prisma.$transaction(async (tx) => {
      const updatedAttribute =
        await tx.modelAttribute.update({
          where: {
            id,
          },
          data: {
            name,
            type,
            required: true,
            displayOrder:
              dto.displayOrder ??
              currentAttribute.displayOrder,
          },
        });

      if (dto.options !== undefined) {
        await tx.modelAttributeOption.deleteMany({
          where: {
            attributeId: id,
          },
        });

        if (options.length > 0) {
          await tx.modelAttributeOption.createMany({
            data: options.map((option) => ({
              attributeId: id,
              value: option.value,
              displayOrder: option.displayOrder,
            })),
          });
        }
      }

      return tx.modelAttribute.findUnique({
        where: {
          id: updatedAttribute.id,
        },
        include: {
          options: {
            orderBy: {
              displayOrder: 'asc',
            },
          },
        },
      });
    });
  }

  async remove(id: string) {
    await this.findOne(id);

    return this.prisma.modelAttribute.delete({
      where: {
        id,
      },
    });
  }

  private async ensureVehicleModelExists(
    vehicleModelId: string,
  ) {
    const vehicleModel =
      await this.prisma.vehicleModel.findUnique({
        where: {
          id: vehicleModelId,
        },
      });

    if (!vehicleModel) {
      throw new NotFoundException(
        'Modelo de veículo não encontrado.',
      );
    }
  }

  private async ensureAttributeDoesNotExist(
    vehicleModelId: string,
    name: string,
    ignoredId?: string,
  ) {
    const existingAttribute =
      await this.prisma.modelAttribute.findFirst({
        where: {
          vehicleModelId,
          name,
          ...(ignoredId
            ? {
                NOT: {
                  id: ignoredId,
                },
              }
            : {}),
        },
      });

    if (existingAttribute) {
      throw new ConflictException(
        'Esse atributo já existe neste modelo.',
      );
    }
  }

  private normalizeOptions(
    options: {
      value: string;
      displayOrder?: number;
    }[],
  ) {
    const normalizedOptions = options.map((option) => ({
      value: option.value.trim(),
      displayOrder: option.displayOrder ?? 0,
    }));

    if (
      normalizedOptions.some(
        (option) => option.value.length === 0,
      )
    ) {
      throw new BadRequestException(
        'As opções não podem possuir valores vazios.',
      );
    }

    const values = normalizedOptions.map(
      (option) => option.value.toLowerCase(),
    );

    const uniqueValues = new Set(values);

    if (values.length !== uniqueValues.size) {
      throw new ConflictException(
        'Não podem existir opções repetidas no mesmo atributo.',
      );
    }

    return normalizedOptions;
  }

  private validateOptions(
    type: AttributeType,
    options: {
      value: string;
      displayOrder: number;
    }[],
  ) {
    const typesThatRequireOptions: AttributeType[] = [
      AttributeType.SELECT,
      AttributeType.MULTI_SELECT,
    ];

    const requiresOptions =
      typesThatRequireOptions.includes(type);

    if (requiresOptions && options.length === 0) {
      throw new BadRequestException(
        'Atributos SELECT ou MULTI_SELECT precisam possuir pelo menos uma opção.',
      );
    }

    if (!requiresOptions && options.length > 0) {
      throw new BadRequestException(
        `O tipo ${type} não pode possuir opções cadastradas.`,
      );
    }
  }
}