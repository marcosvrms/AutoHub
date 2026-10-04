import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import {
  Prisma,
  WalletTransactionType,
} from '../generated/prisma/client.js';

import { PrismaService } from '../prisma/prisma.service.js';

@Injectable()
export class PurchaseService {
  constructor(
    private readonly prisma: PrismaService,
  ) {}

  async purchase(
    buyerId: string,
    listingId: string,
  ) {
    for (let attempt = 0; attempt < 3; attempt++) {
      try {
        return await this.prisma.$transaction(
          async (tx) => {
            const listing =
              await tx.listing.findUnique({
                where: {
                  id: listingId,
                },
                select: {
                  id: true,
                  price: true,
                  status: true,
                  sellerId: true,

                  vehicleModel: {
                    select: {
                      id: true,
                      name: true,
                      manufactureYear: true,

                      manufacturer: {
                        select: {
                          id: true,
                          name: true,
                        },
                      },
                    },
                  },
                },
              });

            if (!listing) {
              throw new NotFoundException(
                'Anúncio não encontrado.',
              );
            }

            if (listing.status !== 'PUBLISHED') {
              throw new ConflictException(
                'Este anúncio não está disponível para compra.',
              );
            }

            if (!listing.sellerId) {
              throw new ConflictException(
                'Este anúncio não possui vendedor válido.',
              );
            }

            if (listing.sellerId === buyerId) {
              throw new BadRequestException(
                'Você não pode comprar o próprio anúncio.',
              );
            }

            const buyer =
              await tx.user.findUnique({
                where: {
                  id: buyerId,
                },
                select: {
                  id: true,
                  balance: true,
                },
              });

            if (!buyer) {
              throw new NotFoundException(
                'Comprador não encontrado.',
              );
            }

            /*
             * Debita somente se o saldo ainda for suficiente.
             */
            const debited =
              await tx.user.updateMany({
                where: {
                  id: buyerId,
                  balance: {
                    gte: listing.price,
                  },
                },
                data: {
                  balance: {
                    decrement: listing.price,
                  },
                },
              });

            if (debited.count !== 1) {
              throw new BadRequestException(
                'Saldo insuficiente para realizar a compra.',
              );
            }

            /*
             * Alteramos o anúncio somente se ele
             * ainda estiver publicado.
             */
            const sold =
              await tx.listing.updateMany({
                where: {
                  id: listingId,
                  status: 'PUBLISHED',
                  sellerId: listing.sellerId,
                },
                data: {
                  status: 'SOLD',
                  soldAt: new Date(),
                },
              });

            if (sold.count !== 1) {
              throw new ConflictException(
                'O anúncio acabou de ser vendido ou não está mais disponível.',
              );
            }

            /*
             * Credita o vendedor.
             */
            await tx.user.update({
              where: {
                id: listing.sellerId,
              },
              data: {
                balance: {
                  increment: listing.price,
                },
              },
            });

            /*
             * Registra a compra.
             */
            const purchase =
              await tx.purchase.create({
                data: {
                  listingId,
                  buyerId,
                  sellerId: listing.sellerId,
                  amount: listing.price,
                },
              });

            /*
             * Histórico do comprador.
             */
            await tx.walletTransaction.create({
              data: {
                userId: buyerId,
                type: WalletTransactionType.PURCHASE,
                amount: listing.price,
                description: `Compra do anúncio ${listingId}.`,
                purchaseId: purchase.id,
              },
            });

            /*
             * Histórico do vendedor.
             */
            await tx.walletTransaction.create({
              data: {
                userId: listing.sellerId,
                type: WalletTransactionType.SALE,
                amount: listing.price,
                description: `Venda do anúncio ${listingId}.`,
                purchaseId: purchase.id,
              },
            });

            return purchase;
          },
          {
            isolationLevel:
              Prisma.TransactionIsolationLevel.Serializable,
            maxWait: 5000,
            timeout: 10000,
          },
        );
      } catch (error) {
        if (
          error instanceof
            Prisma.PrismaClientKnownRequestError &&
          error.code === 'P2034' &&
          attempt < 2
        ) {
          continue;
        }

        throw error;
      }
    }

    throw new ConflictException(
      'Não foi possível concluir a compra.',
    );
  }

  async findMine(buyerId: string) {
    return this.prisma.purchase.findMany({
      where: {
        buyerId,
      },
      orderBy: {
        purchasedAt: 'desc',
      },
      include: {
        listing: {
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
        },
      },
    });
  }

  async findAllForAdmin() {
    return this.prisma.purchase.findMany({
      orderBy: {
        purchasedAt: 'desc',
      },
      include: {
        listing: true,
        buyer: {
          select: {
            id: true,
            name: true,
            email: true,
            city: true,
            state: true,
          },
        },
        seller: {
          select: {
            id: true,
            name: true,
            email: true,
            city: true,
            state: true,
          },
        },
      },
    });
  }
}