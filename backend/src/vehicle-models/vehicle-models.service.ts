import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service.js';
import { CreateVehicleModelDto } from './dto/create-vehicle-model.dto.js';
import { UpdateVehicleModelDto } from './dto/update-vehicle-model.dto.js';

@Injectable()
export class VehicleModelsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return this.prisma.vehicleModel.findMany({
      include: {
        vehicleType: {
          include: {
            category: true,
          },
        },
        manufacturer: true,
      },
      orderBy: [
        {
          manufacturer: {
            name: 'asc',
          },
        },
        {
          name: 'asc',
        },
        {
          manufactureYear: 'asc',
        },
      ],
    });
  }

  async findOne(id: string) {
    const vehicleModel =
      await this.prisma.vehicleModel.findUnique({
        where: {
          id,
        },
        include: {
          vehicleType: {
            include: {
              category: true,
            },
          },
          manufacturer: true,
          attributes: {
            include: {
              options: true,
            },
            orderBy: {
              displayOrder: 'asc',
            },
          },
        },
      });

    if (!vehicleModel) {
      throw new NotFoundException(
        'Modelo de veículo não encontrado.',
      );
    }

    return vehicleModel;
  }

  private async deactivateListings(
    vehicleModelId: string,
  ) {
    await this.prisma.listing.updateMany({
      where: {
        vehicleModelId,
        status: {
          not: 'SOLD',
        },
      },
      data: {
        status: 'INACTIVE',
      },
    });
  }

  async create(dto: CreateVehicleModelDto) {
    await this.ensureVehicleTypeExists(dto.vehicleTypeId);
    await this.ensureManufacturerExists(dto.manufacturerId);

    const existingModel =
      await this.prisma.vehicleModel.findFirst({
        where: {
          vehicleTypeId: dto.vehicleTypeId,
          manufacturerId: dto.manufacturerId,
          name: dto.name.trim(),
          manufactureYear: dto.manufactureYear,
        },
      });

    if (existingModel) {
      throw new ConflictException(
        'Esse modelo de veículo já está cadastrado.',
      );
    }

    return this.prisma.vehicleModel.create({
      data: {
        vehicleTypeId: dto.vehicleTypeId,
        manufacturerId: dto.manufacturerId,
        name: dto.name.trim(),
        manufactureYear: dto.manufactureYear,
        description: dto.description?.trim(),
        catalogImage: dto.catalogImage?.trim(),
      },
      include: {
        vehicleType: true,
        manufacturer: true,
      },
    });
  }

  async update(
    id: string,
    dto: UpdateVehicleModelDto,
  ) {
    const currentModel = await this.findOne(id);

    const vehicleTypeId =
      dto.vehicleTypeId ?? currentModel.vehicleTypeId;

    const manufacturerId =
      dto.manufacturerId ?? currentModel.manufacturerId;

    const name =
      dto.name?.trim() ?? currentModel.name;

    const manufactureYear =
      dto.manufactureYear ?? currentModel.manufactureYear;

    await this.ensureVehicleTypeExists(vehicleTypeId);
    await this.ensureManufacturerExists(manufacturerId);

    const existingModel =
      await this.prisma.vehicleModel.findFirst({
        where: {
          vehicleTypeId,
          manufacturerId,
          name,
          manufactureYear,
          NOT: {
            id,
          },
        },
      });

    if (existingModel) {
      throw new ConflictException(
        'Esse modelo de veículo já está cadastrado.',
      );
    }

    await this.deactivateListings(id);

    return this.prisma.vehicleModel.update({
      where: {
        id,
      },
      data: {
        vehicleTypeId: dto.vehicleTypeId,
        manufacturerId: dto.manufacturerId,
        name: dto.name?.trim(),
        manufactureYear: dto.manufactureYear,
        description: dto.description?.trim(),
        catalogImage: dto.catalogImage?.trim(),
      },
      include: {
        vehicleType: true,
        manufacturer: true,
      },
    });
  }

  async remove(id: string) {
  await this.findOne(id);

  const listingsCount = await this.prisma.listing.count({
    where: {
      vehicleModelId: id,
    },
  });

  if (listingsCount > 0) {
    throw new ConflictException(
      'Não é possível excluir um modelo que possui anúncios ou histórico de vendas.',
    );
  }

  return this.prisma.vehicleModel.delete({
    where: {
      id,
    },
  });
}

  private async ensureVehicleTypeExists(
    vehicleTypeId: string,
  ) {
    const vehicleType =
      await this.prisma.vehicleType.findUnique({
        where: {
          id: vehicleTypeId,
        },
      });

    if (!vehicleType) {
      throw new NotFoundException(
        'Tipo de veículo não encontrado.',
      );
    }
  }
  
  private async ensureManufacturerExists(
    manufacturerId: string,
  ) {
    const manufacturer =
      await this.prisma.manufacturer.findUnique({
        where: {
          id: manufacturerId,
        },
      });

    if (!manufacturer) {
      throw new NotFoundException(
        'Fabricante não encontrado.',
      );
    }
  }
}