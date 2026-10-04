import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import {
  AttributeType,
  ListingStatus,
  UserRole
} from '../generated/prisma/client.js';
import { Prisma } from '../generated/prisma/client.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { ForbiddenException } from '@nestjs/common';
import type { AuthenticatedUser } from '../auth/types/authenticated-user.js';
import { CreateListingDto } from './dto/create-listing.dto.js';
import { UpdateListingDto } from './dto/update-listing.dto.js';
import { SetListingAttributesDto } from './dto/set-listing-attributes.dto.js';
import { ListingAttributeValueDto } from './dto/listing-attribute-value.dto.js';
import { CreateListingImageDto } from './dto/create-listing-image.dto.js';
import { ListingSearchDto } from './dto/listing-search.dto.js';

type AttributeFilter = {
  attributeId: string;
  value?: unknown;
  min?: unknown;
  max?: unknown;
  contains?: string;
  optionIds?: string[];
  match?: 'ANY' | 'ALL';
};

@Injectable()
export class ListingsService {
  private readonly publicSellerSelect = {
    id: true,
    name: true,
    accountType: true,
    photo: true,
    description: true,
    city: true,
    state: true,
    country: true,
  } as const;
  
private ensureOwnerOrAdmin(
  sellerId: string | null,
  currentUser: AuthenticatedUser,
  ) {
    const isAdmin =
      currentUser.role === 'ADMIN';

     const isOwner = 
      sellerId !== null && currentUser.sub === sellerId;

    if (!isAdmin && !isOwner) {
      throw new ForbiddenException(
        'Você não possui permissão para modificar este anúncio.',
      );
    }
  }

  private async buildAttributeFilters(
  attributesJson: string,
): Promise<Prisma.ListingWhereInput[]> {
  let filters: AttributeFilter[];

  try {
    filters = JSON.parse(attributesJson);
  } catch {
    throw new BadRequestException(
      'O parâmetro attributes deve ser um JSON válido.',
    );
  }

  if (!Array.isArray(filters)) {
    throw new BadRequestException(
      'O parâmetro attributes deve ser uma lista de filtros.',
    );
  }

  if (filters.length === 0) {
    return [];
  }

  const attributeIds = [
    ...new Set(
      filters.map((filter) => {
        if (!filter?.attributeId) {
          throw new BadRequestException(
            'Todo filtro de atributo deve possuir attributeId.',
          );
        }

        return filter.attributeId;
      }),
    ),
  ];

  const modelAttributes = await this.prisma.modelAttribute.findMany({
    where: {
      id: {
        in: attributeIds,
      },
    },
    select: {
      id: true,
      type: true,
    },
  });

  const attributeMap = new Map(
    modelAttributes.map((attribute) => [attribute.id, attribute]),
  );

  const conditions: Prisma.ListingWhereInput[] = [];

  for (const filter of filters) {
    const attribute = attributeMap.get(filter.attributeId);

    if (!attribute) {
      throw new BadRequestException(
        `Atributo ${filter.attributeId} não foi encontrado.`,
      );
    }

    switch (attribute.type) {
      case 'BOOLEAN': {
        if (typeof filter.value !== 'boolean') {
          throw new BadRequestException(
            `O atributo ${filter.attributeId} espera um valor booleano.`,
          );
        }

        conditions.push({
          attributeValues: {
            some: {
              modelAttributeId: filter.attributeId,
              booleanValue: filter.value,
            },
          },
        });

        break;
      }

      case 'INTEGER': {
        const valueFilter: Prisma.IntNullableFilter = {};

        if (filter.value !== undefined) {
          valueFilter.equals = this.parseInteger(filter.value);
        }

        if (filter.min !== undefined) {
          valueFilter.gte = this.parseInteger(filter.min);
        }

        if (filter.max !== undefined) {
          valueFilter.lte = this.parseInteger(filter.max);
        }

        conditions.push({
          attributeValues: {
            some: {
              modelAttributeId: filter.attributeId,
              integerValue: valueFilter,
            },
          },
        });

        break;
      }

      case 'DECIMAL': {
        const valueFilter: Prisma.DecimalNullableFilter = {};

        if (filter.value !== undefined) {
          valueFilter.equals = this.parseDecimal(filter.value);
        }

        if (filter.min !== undefined) {
          valueFilter.gte = this.parseDecimal(filter.min);
        }

        if (filter.max !== undefined) {
          valueFilter.lte = this.parseDecimal(filter.max);
        }

        conditions.push({
          attributeValues: {
            some: {
              modelAttributeId: filter.attributeId,
              decimalValue: valueFilter,
            },
          },
        });

        break;
      }

      case 'TEXT': {
        const textFilter: Prisma.StringNullableFilter = {};

        if (filter.value !== undefined) {
          textFilter.equals = String(filter.value);
        }

        if (filter.contains !== undefined) {
          textFilter.contains = filter.contains;
        }

        conditions.push({
          attributeValues: {
            some: {
              modelAttributeId: filter.attributeId,
              textValue: textFilter,
            },
          },
        });

        break;
      }

      case 'SELECT':
      case 'MULTI_SELECT': {
        if (
          !Array.isArray(filter.optionIds) ||
          filter.optionIds.length === 0
        ) {
          throw new BadRequestException(
            `O atributo ${filter.attributeId} exige optionIds.`,
          );
        }

        const match = filter.match ?? 'ANY';

        if (match === 'ANY') {
          conditions.push({
            attributeValues: {
              some: {
                modelAttributeId: filter.attributeId,
                selectedOptions: {
                  some: {
                    modelAttributeOptionId: {
                      in: filter.optionIds,
                    },
                  },
                },
              },
            },
          });
        } else {
          for (const optionId of filter.optionIds) {
            conditions.push({
              attributeValues: {
                some: {
                  modelAttributeId: filter.attributeId,
                  selectedOptions: {
                    some: {
                      modelAttributeOptionId: optionId,
                    },
                  },
                },
              },
            });
          }
        }

        break;
      }

      default:
        throw new BadRequestException(
          `Tipo de atributo não suportado: ${attribute.type}`,
        );
    }
  }

  return conditions;
}

private parseInteger(value: unknown): number {
  const parsed = Number(value);

  if (!Number.isInteger(parsed)) {
    throw new BadRequestException(
      `O valor ${String(value)} precisa ser um número inteiro.`,
    );
  }

  return parsed;
}

private parseDecimal(value: unknown): number {
  const parsed = Number(value);

  if (!Number.isFinite(parsed)) {
    throw new BadRequestException(
      `O valor ${String(value)} precisa ser numérico.`,
    );
  }

  return parsed;
}

private async findListingInternal(
  id: string,
) {
  const listing =
    await this.prisma.listing.findUnique({
      where: {
        id,
      },

      include: {
        seller: {
          select: this.publicSellerSelect,
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

        attributeValues: {
          include: {
            modelAttribute: true,

            selectedOptions: {
              include: {
                modelAttributeOption: true,
              },
            },
          },
        },

        images: {
          orderBy: {
            displayOrder: 'asc',
          },
        },
      },
    });

  if (!listing) {
    throw new NotFoundException(
      'Anúncio não encontrado.',
    );
  }

  return listing;
}
  
  constructor(private readonly prisma: PrismaService) {}

  async findAll(query: ListingSearchDto) {
  const {
    q,
    categoryId,
    vehicleTypeId,
    manufacturerId,
    vehicleModelId,
    minPrice,
    maxPrice,
    minYear,
    maxYear,
    state,
    city,
    acceptsProposals,
    page = 1,
    limit = 12,
    sortBy = 'createdAt',
    sortOrder = 'desc',
    attributes,
  } = query;

  const where: Prisma.ListingWhereInput = {
    status: ListingStatus.PUBLISHED,
  };

  const andConditions: Prisma.ListingWhereInput[] = [];

  /*
   * Busca por texto livre.
   */
  if (q?.trim()) {
    const search = q.trim();

    andConditions.push({
      OR: [
        {
          title: {
            contains: search,
            mode: 'insensitive',
          },
        },
        {
          description: {
            contains: search,
            mode: 'insensitive',
          },
        },
        {
          city: {
            contains: search,
            mode: 'insensitive',
          },
        },
        {
          state: {
            contains: search,
            mode: 'insensitive',
          },
        },
        {
          vehicleModel: {
            name: {
              contains: search,
              mode: 'insensitive',
            },
          },
        },
        {
          vehicleModel: {
            manufacturer: {
              name: {
                contains: search,
                mode: 'insensitive',
              },
            },
          },
        },
        {
          vehicleModel: {
            vehicleType: {
              name: {
                contains: search,
                mode: 'insensitive',
              },
            },
          },
        },
        {
          vehicleModel: {
            vehicleType: {
              category: {
                name: {
                  contains: search,
                  mode: 'insensitive',
                },
              },
            },
          },
        },
      ],
    });
  }

  /*
   * Filtros diretamente ligados ao anúncio.
   */
  if (minPrice !== undefined || maxPrice !== undefined) {
    where.price = {};

    if (minPrice !== undefined) {
      where.price.gte = minPrice;
    }

    if (maxPrice !== undefined) {
      where.price.lte = maxPrice;
    }
  }

  if (state?.trim()) {
    andConditions.push({
      state: {
        equals: state.trim(),
        mode: 'insensitive',
      },
    });
  }

  if (city?.trim()) {
    andConditions.push({
      city: {
        equals: city.trim(),
        mode: 'insensitive',
      },
    });
  }

  if (acceptsProposals !== undefined) {
    andConditions.push({
      acceptsProposals,
    });
  }

  /*
   * Filtros do modelo do veículo.
   */
  const vehicleModelWhere: Prisma.VehicleModelWhereInput = {};

  if (vehicleModelId) {
    vehicleModelWhere.id = vehicleModelId;
  }

  if (minYear !== undefined || maxYear !== undefined) {
    vehicleModelWhere.manufactureYear = {};

    if (minYear !== undefined) {
      vehicleModelWhere.manufactureYear.gte = minYear;
    }

    if (maxYear !== undefined) {
      vehicleModelWhere.manufactureYear.lte = maxYear;
    }
  }

  if (manufacturerId) {
    vehicleModelWhere.manufacturerId = manufacturerId;
  }

  if (vehicleTypeId || categoryId) {
    vehicleModelWhere.vehicleType = {};

    if (vehicleTypeId) {
      vehicleModelWhere.vehicleType.id = vehicleTypeId;
    }

    if (categoryId) {
      vehicleModelWhere.vehicleType.categoryId = categoryId;
    }
  }

  if (Object.keys(vehicleModelWhere).length > 0) {
    andConditions.push({
      vehicleModel: vehicleModelWhere,
    });
  }

  /*
   * Filtros dos atributos dinâmicos.
   */
  if (attributes) {
    const attributeConditions =
      await this.buildAttributeFilters(attributes);

    andConditions.push(...attributeConditions);
  }

  if (andConditions.length > 0) {
    where.AND = andConditions;
  }

  /*
   * Ordenação.
   */
  let orderBy: Prisma.ListingOrderByWithRelationInput;

  switch (sortBy) {
    case 'price':
      orderBy = {
        price: sortOrder,
      };
      break;

    case 'year':
      orderBy = {
        vehicleModel: {
          manufactureYear: sortOrder,
        },
      };
      break;

    case 'createdAt':
    default:
      orderBy = {
        createdAt: sortOrder,
      };
      break;
  }

  /*
   * Paginação.
   */
  const skip = (page - 1) * limit;

  const [total, listings] = await this.prisma.$transaction([
    this.prisma.listing.count({
      where,
    }),

    this.prisma.listing.findMany({
      where,
      skip,
      take: limit,
      orderBy,

      include: {
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

        images: {
          orderBy: {
            displayOrder: 'asc',
          },
        },

        seller: true,
      },
    }),
  ]);

  return {
    data: listings,
    meta: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
}

  async findOne(id: string) {
    const listing = await this.prisma.listing.findUnique({
      where: {
        id,
      },

      include: {
        seller: {
          select: this.publicSellerSelect,
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

        attributeValues: {
          include: {
            modelAttribute: true,

            selectedOptions: {
              include: {
                modelAttributeOption: true,
              },
            },
          },
        },

        images: {
          orderBy: {
            displayOrder: 'asc',
          },
        },
      },
    });

    if (!listing) {
      throw new NotFoundException(
        'Anúncio não encontrado.',
      );
    }

    return listing;
  }

  async create( sellerId: string, dto: CreateListingDto,
) {
    await this.ensureSellerExists(sellerId);
    await this.ensureVehicleModelExists(
      dto.vehicleModelId,
    );

    const state = dto.state.trim().toUpperCase();
    const city = dto.city.trim();

    if (state.length !== 2) {
      throw new BadRequestException(
        'O estado deve possuir a sigla de duas letras.',
      );
    }

    return this.prisma.listing.create({
      data: {
        sellerId: sellerId,

        vehicleModelId: dto.vehicleModelId,

        title: dto.title.trim(),

        description: dto.description?.trim(),

        price: dto.price,

        acceptsProposals:
          dto.acceptsProposals ?? false,

        status: ListingStatus.DRAFT,

        country: 'Brasil',

        state,

        city,
      },

      include: {
        seller: {
          select: this.publicSellerSelect,
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
  }

  async update(
  id: string,
  dto: UpdateListingDto,
  currentUser: AuthenticatedUser,
  ) {
    const listing =
    await this.findListingInternal(id);
    this.ensureOwnerOrAdmin(
      listing.sellerId,
      currentUser,
    );

    this.ensureEditableStatus(listing.status);

    let state: string | undefined;

    if (dto.state !== undefined) {
      state = dto.state.trim().toUpperCase();

      if (state.length !== 2) {
        throw new BadRequestException(
          'O estado deve possuir a sigla de duas letras.',
        );
      }
    }

    return this.prisma.listing.update({
      where: {
        id,
      },

      data: {
        title: dto.title?.trim(),

        description: dto.description?.trim(),

        price: dto.price,

        acceptsProposals:
          dto.acceptsProposals,

        state,

        city: dto.city?.trim(),
      },

      include: {
        seller: {
          select: this.publicSellerSelect,
        },

        vehicleModel: {
          include: {
            manufacturer: true,
            vehicleType: true,
          },
        },
      },
    });
  }

  async publish(id: string, currentUser: AuthenticatedUser) {
    const listing = await this.findOne(id);

    if (
      listing.status !== ListingStatus.DRAFT &&
      listing.status !== ListingStatus.INACTIVE
    ) {
      throw new BadRequestException(
        'Somente anúncios em rascunho ou inativos podem ser publicados.',
      );
    }

    this.ensureOwnerOrAdmin(listing.sellerId, currentUser);
    await this.ensureReadyToPublish(id);

    return this.prisma.listing.update({
      where: {
        id,
      },

      data: {
        status: ListingStatus.PUBLISHED,
      },
    });
  }

  async deactivate(id: string, currentUser: AuthenticatedUser) {
    const listing = await this.findOne(id);

    if (listing.status !== ListingStatus.PUBLISHED) {
      throw new BadRequestException(
        'Somente anúncios publicados podem ser inativados.',
      );
    }

    this.ensureOwnerOrAdmin(listing.sellerId, currentUser);
    return this.prisma.listing.update({
      where: {
        id,
      },

      data: {
        status: ListingStatus.INACTIVE,
      },
    });
  }

  async markAsSold(id: string, currentUser:AuthenticatedUser) {
    const listing = await this.findOne(id);

    if (listing.status !== ListingStatus.PUBLISHED) {
      throw new BadRequestException(
        'Somente anúncios publicados podem ser vendidos.',
      );
    }

    this.ensureOwnerOrAdmin(listing.sellerId, currentUser);
    return this.prisma.listing.update({
      where: {
        id,
      },

      data: {
        status: ListingStatus.SOLD,
        soldAt: new Date(),
      },
    });
  }

  // =========================================================
  // ATRIBUTOS DO ANÚNCIO
  // =========================================================

  async findAttributes(listingId: string) {
    await this.ensureListingExists(listingId);

    return this.prisma.listingAttributeValue.findMany({
      where: {
        listingId,
      },

      include: {
        modelAttribute: {
          include: {
            options: {
              orderBy: {
                displayOrder: 'asc',
              },
            },
          },
        },

        selectedOptions: {
          include: {
            modelAttributeOption: true,
          },
        },
      },

      orderBy: {
        modelAttribute: {
          displayOrder: 'asc',
        },
      },
    });
  }

  async findAllForAdmin() {
  return this.prisma.listing.findMany({
    include: {
      seller: {
        select: this.publicSellerSelect,
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

      images: {
        orderBy: {
          displayOrder: 'asc',
        },
      },
    },

    orderBy: {
      createdAt: 'desc',
    },
  });
}

  async updateAttributes(
    listingId: string,
    dto: SetListingAttributesDto,
    currentUser: AuthenticatedUser
  ) {
    const listing = await this.prisma.listing.findUnique({ where: { id: listingId }});
    
    if (!listing) {
      throw new NotFoundException(
        'Anúncio não encontrado.',
      );
    }
    this.ensureOwnerOrAdmin(listing.sellerId, currentUser);
    this.ensureEditableStatus(listing.status);

    const modelAttributes =
      await this.prisma.modelAttribute.findMany({
        where: {
          vehicleModelId: listing.vehicleModelId,
        },

        include: {
          options: true,
        },
      });

    const attributesById = new Map(
      modelAttributes.map((attribute) => [
        attribute.id,
        attribute,
      ]),
    );

    const receivedAttributeIds =
      new Set<string>();

    for (const value of dto.values) {
      if (
        receivedAttributeIds.has(
          value.modelAttributeId,
        )
      ) {
        throw new ConflictException(
          'O mesmo atributo não pode ser enviado mais de uma vez.',
        );
      }

      receivedAttributeIds.add(
        value.modelAttributeId,
      );

      const attribute = attributesById.get(
        value.modelAttributeId,
      );

      if (!attribute) {
        throw new BadRequestException(
          `O atributo ${value.modelAttributeId} não pertence ao modelo deste anúncio.`,
        );
      }

      this.validateIncomingAttributeValue(
        attribute,
        value,
      );
    }

    
    await this.prisma.$transaction(
      async (tx) => {
        for (const value of dto.values) {
          const savedValue =
            await tx.listingAttributeValue.upsert({
              where: {
                listingId_modelAttributeId: {
                  listingId,
                  modelAttributeId:
                    value.modelAttributeId,
                },
              },

              update: {
                textValue:
                  value.textValue,

                integerValue:
                  value.integerValue,

                decimalValue:
                  value.decimalValue,

                booleanValue:
                  value.booleanValue,
              },

              create: {
                listingId,

                modelAttributeId:
                  value.modelAttributeId,

                textValue:
                  value.textValue,

                integerValue:
                  value.integerValue,

                decimalValue:
                  value.decimalValue,

                booleanValue:
                  value.booleanValue,
              },
            });

          await tx.listingAttributeValueOption.deleteMany({
            where: {
              listingAttributeValueId:
                savedValue.id,
            },
          });

          if (
            value.optionIds &&
            value.optionIds.length > 0
          ) {
            await tx.listingAttributeValueOption.createMany({
              data: value.optionIds.map(
                (optionId) => ({
                  listingAttributeValueId:
                    savedValue.id,

                  modelAttributeOptionId:
                    optionId,
                }),
              ),
            });
          }
        }
      },
    );

    return this.findAttributes(listingId);
  }

  async findMine(
  userId: string,
) {
  return this.prisma.listing.findMany({
    where: {
      sellerId: userId,
    },

    include: {
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

      images: {
        orderBy: {
          displayOrder: 'asc',
        },
      },
    },

    orderBy: {
      createdAt: 'desc',
    },
  });
}

  // =========================================================
  // IMAGENS DO ANÚNCIO
  // =========================================================

  async findImages(listingId: string) {
    await this.ensureListingExists(listingId);

    return this.prisma.listingImage.findMany({
      where: {
        listingId,
      },

      orderBy: {
        displayOrder: 'asc',
      },
    });
  }

  async addImage(
    listingId: string,
    dto: CreateListingImageDto,
    currentUser: AuthenticatedUser
  ) {
    const listing = await this.prisma.listing.findUnique({
      where: {
        id: listingId,
      },
    });
    

    if (!listing) {
      throw new NotFoundException(
        'Anúncio não encontrado.',
      );
    }

    this.ensureOwnerOrAdmin(listing.sellerId, currentUser);
    this.ensureEditableStatus(listing.status);

    const imageCount =
      await this.prisma.listingImage.count({
        where: {
          listingId,
        },
      });

    if (imageCount >= 20) {
      throw new BadRequestException(
        'O anúncio pode possuir no máximo 20 fotos.',
      );
    }

    let displayOrder =
      dto.displayOrder;

    if (displayOrder === undefined) {
      const existingImages =
        await this.prisma.listingImage.findMany({
          where: {
            listingId,
          },

          select: {
            displayOrder: true,
          },

          orderBy: {
            displayOrder: 'asc',
          },
        });

      const existingOrders = new Set(
        existingImages.map(
          (image) => image.displayOrder,
        ),
      );

      displayOrder = 1;

      while (
        existingOrders.has(displayOrder) &&
        displayOrder <= 20
      ) {
        displayOrder++;
      }
    }

    if (displayOrder < 1 || displayOrder > 20) {
      throw new BadRequestException(
        'A posição da imagem deve estar entre 1 e 20.',
      );
    }

    const existingImage =
      await this.prisma.listingImage.findFirst({
        where: {
          listingId,
          displayOrder,
        },
      });

    if (existingImage) {
      throw new ConflictException(
        'Já existe uma imagem nessa posição.',
      );
    }

    return this.prisma.listingImage.create({
      data: {
        listingId,

        url: dto.url.trim(),

        displayOrder,
      },
    });
  }

  async remove(id: string) {
    await this.findListingInternal(id);

    return this.prisma.listing.delete({
      where: {
        id,
      },
    });
  }

  async removeImage(
    listingId: string,
    imageId: string,
    currentUser: AuthenticatedUser
  ) {
    const listing = await this.prisma.listing.findUnique({
      where: {
        id: listingId,
      },
    });

    if (!listing) {
      throw new NotFoundException(
        'Anúncio não encontrado.',
      );
    }

    this.ensureOwnerOrAdmin(listing.sellerId, currentUser);
    this.ensureEditableStatus(listing.status);

    const image =
      await this.prisma.listingImage.findFirst({
        where: {
          id: imageId,
          listingId,
        },
      });

    if (!image) {
      throw new NotFoundException(
        'Imagem não encontrada neste anúncio.',
      );
    }

    return this.prisma.listingImage.delete({
      where: {
        id: imageId,
      },
    });
  }

  // =========================================================
  // VALIDAÇÕES
  // =========================================================

  private async ensureSellerExists(
    sellerId: string,
  ) {
    const seller = await this.prisma.user.findUnique({
      where: {
        id: sellerId,
      },

      select: {
        id: true,
      },
    });

    if (!seller) {
      throw new NotFoundException(
        'Usuário vendedor não encontrado.',
      );
    }
  }

  private async ensureVehicleModelExists(
    vehicleModelId: string,
  ) {
    const vehicleModel =
      await this.prisma.vehicleModel.findUnique({
        where: {
          id: vehicleModelId,
        },

        select: {
          id: true,
        },
      });

    if (!vehicleModel) {
      throw new NotFoundException(
        'Modelo de veículo não encontrado.',
      );
    }
  }

  private async ensureListingExists(
    listingId: string,
  ) {
    const listing =
      await this.prisma.listing.findUnique({
        where: {
          id: listingId,
        },

        select: {
          id: true,
        },
      });

    if (!listing) {
      throw new NotFoundException(
        'Anúncio não encontrado.',
      );
    }
  }

  private ensureEditableStatus(
    status: ListingStatus,
  ) {
    if (
      status !== ListingStatus.DRAFT &&
      status !== ListingStatus.INACTIVE
    ) {
      throw new BadRequestException(
        'O anúncio só pode ser editado quando estiver em rascunho ou inativo.',
      );
    }
  }

  private validateIncomingAttributeValue(
    attribute: {
      type: AttributeType;
      options: {
        id: string;
      }[];
    },
    value: ListingAttributeValueDto,
  ) {
    const optionIds =
      value.optionIds ?? [];

    const scalarValues = [
      value.textValue,
      value.integerValue,
      value.decimalValue,
      value.booleanValue,
    ].filter(
      (item) => item !== undefined,
    );

    const scalarCount =
      scalarValues.length;

    const validOptionIds =
      new Set(
        attribute.options.map(
          (option) => option.id,
        ),
      );

    for (const optionId of optionIds) {
      if (!validOptionIds.has(optionId)) {
        throw new BadRequestException(
          `A opção ${optionId} não pertence ao atributo informado.`,
        );
      }
    }

    switch (attribute.type) {
      case AttributeType.BOOLEAN:
        if (
          value.booleanValue === undefined ||
          scalarCount !== 1 ||
          optionIds.length > 0
        ) {
          throw new BadRequestException(
            'O atributo BOOLEAN deve receber somente booleanValue.',
          );
        }

        break;

      case AttributeType.INTEGER:
        if (
          value.integerValue === undefined ||
          scalarCount !== 1 ||
          optionIds.length > 0
        ) {
          throw new BadRequestException(
            'O atributo INTEGER deve receber somente integerValue.',
          );
        }

        break;

      case AttributeType.DECIMAL:
        if (
          value.decimalValue === undefined ||
          scalarCount !== 1 ||
          optionIds.length > 0
        ) {
          throw new BadRequestException(
            'O atributo DECIMAL deve receber somente decimalValue.',
          );
        }

        break;

      case AttributeType.TEXT:
        if (
          value.textValue === undefined ||
          value.textValue.trim().length === 0 ||
          scalarCount !== 1 ||
          optionIds.length > 0
        ) {
          throw new BadRequestException(
            'O atributo TEXT deve receber somente textValue.',
          );
        }

        break;

      case AttributeType.SELECT:
        if (
          scalarCount !== 0 ||
          optionIds.length !== 1
        ) {
          throw new BadRequestException(
            'O atributo SELECT deve receber exatamente uma opção.',
          );
        }

        break;

      case AttributeType.MULTI_SELECT:
        if (
          scalarCount !== 0 ||
          optionIds.length === 0
        ) {
          throw new BadRequestException(
            'O atributo MULTI_SELECT deve receber pelo menos uma opção.',
          );
        }

        break;

      default:
        throw new BadRequestException(
          'Tipo de atributo não suportado.',
        );
    }
  }

  private validateStoredAttributeValue(
    attribute: {
      type: AttributeType;
      options: {
        id: string;
      }[];
    },
    value: {
      textValue: string | null;
      integerValue: number | null;
      decimalValue: unknown;
      booleanValue: boolean | null;
      selectedOptions: {
        modelAttributeOptionId: string;
      }[];
    },
  ) {
    this.validateIncomingAttributeValue(
      attribute,
      {
        modelAttributeId: '',
        textValue:
          value.textValue ?? undefined,

        integerValue:
          value.integerValue ?? undefined,

        decimalValue:
          value.decimalValue
            ? Number(value.decimalValue)
            : undefined,

        booleanValue:
          value.booleanValue ??
          undefined,

        optionIds:
          value.selectedOptions.map(
            (option) =>
              option.modelAttributeOptionId,
          ),
      },
    );
  }

  private async ensureReadyToPublish(
    listingId: string,
  ) {
    const listing =
      await this.prisma.listing.findUnique({
        where: {
          id: listingId,
        },

        include: {
          images: true,
        },
      });

    if (!listing) {
      throw new NotFoundException(
        'Anúncio não encontrado.',
      );
    }

    // -------------------------------------------------------
    // FOTOS
    // -------------------------------------------------------

    if (listing.images.length < 5) {
      throw new BadRequestException(
        'O anúncio precisa possuir pelo menos 5 fotos.',
      );
    }

    if (listing.images.length > 20) {
      throw new BadRequestException(
        'O anúncio pode possuir no máximo 20 fotos.',
      );
    }

    // -------------------------------------------------------
    // ATRIBUTOS
    // -------------------------------------------------------

    const modelAttributes =
      await this.prisma.modelAttribute.findMany({
        where: {
          vehicleModelId:
            listing.vehicleModelId,
        },

        include: {
          options: true,
        },
      });

    const listingValues =
      await this.prisma.listingAttributeValue.findMany({
        where: {
          listingId,
        },

        include: {
          selectedOptions: true,
        },
      });

    const attributesById =
      new Map(
        modelAttributes.map(
          (attribute) => [
            attribute.id,
            attribute,
          ],
        ),
      );

    const valuesByAttributeId =
      new Map(
        listingValues.map(
          (value) => [
            value.modelAttributeId,
            value,
          ],
        ),
      );

    // -------------------------------------------------------
    // VERIFICA VALORES QUE NÃO PERTENCEM AO MODELO
    // -------------------------------------------------------

    for (const value of listingValues) {
      const attribute =
        attributesById.get(
          value.modelAttributeId,
        );

      if (!attribute) {
        throw new BadRequestException(
          'O anúncio possui um atributo que não pertence ao modelo selecionado.',
        );
      }

      this.validateStoredAttributeValue(
        attribute,
        value,
      );
    }

    // -------------------------------------------------------
    // VERIFICA ATRIBUTOS OBRIGATÓRIOS
    // -------------------------------------------------------

    const missingAttributes =
      modelAttributes.filter(
        (attribute) =>
          attribute.required &&
          !valuesByAttributeId.has(
            attribute.id,
          ),
      );

    if (
      missingAttributes.length > 0
    ) {
      const names =
        missingAttributes
          .map(
            (attribute) =>
              attribute.name,
          )
          .join(', ');

      throw new BadRequestException(
        `O anúncio ainda não possui todos os atributos obrigatórios preenchidos. Faltando: ${names}`,
      );
    }
  }
}