import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service.js';
import { DepositDto } from './dto/deposit.dto.js';

@Injectable()
export class WalletService {
  constructor(private readonly prisma: PrismaService) {}

  async getBalance(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        id: true,
        balance: true,
      },
    });

    if (!user) {
      throw new NotFoundException('Usuário não encontrado.');
    }

    return user;
  }

  async getTransactions(userId: string) {
    return this.prisma.walletTransaction.findMany({
      where: {
        userId,
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 100,
    });
  }

  async deposit(
    userId: string,
    dto: DepositDto,
  ) {
    const user = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        id: true,
      },
    });

    if (!user) {
      throw new NotFoundException('Usuário não encontrado.');
    }

    if (dto.amount <= 0) {
      throw new BadRequestException(
        'O valor do depósito deve ser maior que zero.',
      );
    }

    return this.prisma.$transaction(async (tx) => {
      const updatedUser = await tx.user.update({
        where: {
          id: userId,
        },
        data: {
          balance: {
            increment: dto.amount,
          },
        },
        select: {
          id: true,
          balance: true,
        },
      });

      await tx.walletTransaction.create({
        data: {
          userId,
          type: 'DEPOSIT',
          amount: dto.amount,
          description:
            dto.description ?? 'Depósito de saldo virtual.',
        },
      });

      return updatedUser;
    });
  }
}