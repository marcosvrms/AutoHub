import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { AccountType, ListingStatus, UserRole } from '../generated/prisma/client.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateUserDto } from './dto/create-user.dto.js';
import { UpdateUserDto } from './dto/update-user.dto.js';
import { hashPassword } from './password.utils.js';
import type { AuthenticatedUser } from '../auth/types/authenticated-user.js';
import { ForbiddenException } from '@nestjs/common';

@Injectable()
export class UsersService {
  private readonly publicUserSelect = {
    id: true,
    name: true,
    accountType: true,
    photo: true,
    description: true,
    city: true,
    state: true,
    country: true,
    createdAt: true,
    updatedAt: true,
  } as const;

  constructor(
    private readonly prisma: PrismaService,
  ) {}

  private ensureOwnerOrAdmin(
  targetUserId: string,
  currentUser: AuthenticatedUser,
) {
  const isAdmin = currentUser.role === UserRole.ADMIN;
  const isOwner = currentUser.sub === targetUserId;

  if (!isAdmin && !isOwner) {
    throw new ForbiddenException(
      'Você não possui permissão para alterar este usuário.',
    );
  }
}
  // =========================================================
  // CONSULTAS PÚBLICAS
  // =========================================================

  async findAll() {
    return this.prisma.user.findMany({
      select: this.publicUserSelect,

      orderBy: {
        name: 'asc',
      },
    });
  }

  async findOne(id: string) {
    const user =
      await this.prisma.user.findUnique({
        where: {
          id,
        },

        select: this.publicUserSelect,
      });

    if (!user) {
      throw new NotFoundException(
        'Usuário não encontrado.',
      );
    }

    return user;
  }

  // =========================================================
  // CRIAÇÃO
  // =========================================================

  async create(
    dto: CreateUserDto,
  ) {
    const email =
      this.normalizeEmail(dto.email);

    const document =
      this.normalizeDocument(
        dto.document,
      );

    const phone =
      this.normalizePhone(
        dto.phone,
      );

    const state =
      this.normalizeState(
        dto.state,
      );

    const cep =
      dto.cep
        ? this.normalizeCep(dto.cep)
        : undefined;

    this.validateDocument(
      document,
      dto.accountType,
    );

    this.validateAccountDates(
      dto.accountType,
      dto.birthDate,
      dto.foundationDate,
    );

    await this.ensureEmailIsAvailable(
      email,
    );

    await this.ensureDocumentIsAvailable(
      document,
    );

    const passwordHash =
      await hashPassword(dto.password);

    return this.prisma.user.create({
      data: {
        name: dto.name.trim(),

        email,

        passwordHash,

        accountType:
          dto.accountType,

        role: 'USER',

        document,

        phone,

        birthDate:
          dto.accountType ===
          AccountType.INDIVIDUAL
            ? new Date(dto.birthDate!)
            : null,

        foundationDate:
          dto.accountType ===
          AccountType.DEALERSHIP
            ? new Date(
                dto.foundationDate!,
              )
            : null,

        photo:
          dto.photo?.trim(),

        description:
          dto.description?.trim(),

        city: dto.city.trim(),

        state,

        country: 'Brasil',

        address:
          dto.address?.trim(),

        cep,

        stateRegistration:
          dto.stateRegistration?.trim(),
      },

      select:
        this.publicUserSelect,
    });
  }

  // =========================================================
  // ATUALIZAÇÃO
  // =========================================================

  async update(
  id: string,
  dto: UpdateUserDto,
  currentUser: AuthenticatedUser,
) {
    this.ensureOwnerOrAdmin(id, currentUser);
    const current =
      await this.findPrivateUser(
        id,
      );

    const email =
      dto.email !== undefined
        ? this.normalizeEmail(
            dto.email,
          )
        : current.email;

    const accountType =
      dto.accountType ??
      current.accountType;

    const document =
      dto.document !== undefined
        ? this.normalizeDocument(
            dto.document,
          )
        : current.document;

    const phone =
      dto.phone !== undefined
        ? this.normalizePhone(
            dto.phone,
          )
        : current.phone;

    const state =
      dto.state !== undefined
        ? this.normalizeState(
            dto.state,
          )
        : current.state;

    const cep =
      dto.cep !== undefined
        ? this.normalizeCep(dto.cep)
        : current.cep;

    const birthDate =
      dto.birthDate !== undefined
        ? new Date(dto.birthDate)
        : current.birthDate;

    const foundationDate =
      dto.foundationDate !== undefined
        ? new Date(
            dto.foundationDate,
          )
        : current.foundationDate;

    this.validateDocument(
      document,
      accountType,
    );

    this.validateAccountDatesForUpdate(
      accountType,
      birthDate,
      foundationDate,
    );

    if (
      email !== current.email
    ) {
      await this.ensureEmailIsAvailable(
        email,
        id,
      );
    }

    if (
      document !== current.document
    ) {
      await this.ensureDocumentIsAvailable(
        document,
        id,
      );
    }

    const passwordHash =
      dto.password !== undefined
        ? await hashPassword(
            dto.password,
          )
        : undefined;

    return this.prisma.user.update({
      where: {
        id,
      },

      data: {
        name:
          dto.name !== undefined
            ? dto.name.trim()
            : undefined,

        email,

        passwordHash,

        accountType,

        document,

        phone,

        birthDate:
          accountType ===
          AccountType.INDIVIDUAL
            ? birthDate
            : null,

        foundationDate:
          accountType ===
          AccountType.DEALERSHIP
            ? foundationDate
            : null,

        photo:
          dto.photo !== undefined
            ? dto.photo.trim()
            : undefined,

        description:
          dto.description !== undefined
            ? dto.description.trim()
            : undefined,

        city:
          dto.city !== undefined
            ? dto.city.trim()
            : undefined,

        state,

        country: 'Brasil',

        address:
          dto.address !== undefined
            ? dto.address.trim()
            : undefined,

        cep,

        stateRegistration:
          dto.stateRegistration !==
          undefined
            ? dto.stateRegistration.trim()
            : undefined,
      },

      select:
        this.publicUserSelect,
    });
  }

  // =========================================================
  // EXCLUSÃO
  // =========================================================

  async remove(id: string, currentUser: AuthenticatedUser) {
    this.ensureOwnerOrAdmin(id, currentUser);
    await this.findPrivateUser(
      id,
    );

    await this.prisma.$transaction(
      async (tx) => {
        /*
         * SOLD representa nosso histórico de venda.
         *
         * Todos os outros anúncios pertencentes
         * ao usuário deixam de existir com a conta.
         */
        await tx.listing.deleteMany({
          where: {
            sellerId: id,
            status: {
              not: ListingStatus.SOLD,
            },
          },
        });

        /*
         * Os anúncios SOLD permanecem.
         * O sellerId será colocado como null
         * pelo onDelete: SetNull da relação.
         */
        await tx.user.delete({ where: { id } });

        return { message: 'Usuário excluído com sucesso.' };
      });
    }

  // =========================================================
  // CONSULTAS INTERNAS
  // =========================================================

  async findByIdForAuth(id: string) {
  return this.prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      accountType: true,
    },
  });
}
  
  async findByEmail(
    email: string,
  ) {
    return this.prisma.user.findUnique({
      where: {
        email:
          this.normalizeEmail(email),
      },
    });
  }

  private async findPrivateUser(
    id: string,
  ) {
    const user =
      await this.prisma.user.findUnique({
        where: {
          id,
        },
      });

    if (!user) {
      throw new NotFoundException(
        'Usuário não encontrado.',
      );
    }

    return user;
  }

  // =========================================================
  // VALIDAÇÕES
  // =========================================================

  private normalizeEmail(
    email: string,
  ) {
    return email
      .trim()
      .toLowerCase();
  }

  private normalizeDocument(
    document: string,
  ) {
    return document.replace(
      /\D/g,
      '',
    );
  }

  private normalizePhone(
    phone: string,
  ) {
    const normalized =
      phone.replace(
        /\D/g,
        '',
      );

    if (
      normalized.length !== 10 &&
      normalized.length !== 11
    ) {
      throw new BadRequestException(
        'O telefone deve possuir 10 ou 11 dígitos.',
      );
    }

    return normalized;
  }

  private normalizeCep(
    cep: string,
  ) {
    const normalized =
      cep.replace(
        /\D/g,
        '',
      );

    if (
      normalized.length !== 8
    ) {
      throw new BadRequestException(
        'O CEP deve possuir 8 dígitos.',
      );
    }

    return normalized;
  }

  private normalizeState(
    state: string,
  ) {
    const normalized =
      state.trim().toUpperCase();

    if (
      !/^[A-Z]{2}$/.test(
        normalized,
      )
    ) {
      throw new BadRequestException(
        'O estado deve ser informado pela sigla de duas letras.',
      );
    }

    return normalized;
  }

  private validateDocument(
    document: string,
    accountType: AccountType,
  ) {
    if (
      accountType ===
      AccountType.INDIVIDUAL
    ) {
      if (
        document.length !== 11 ||
        !this.isValidCpf(document)
      ) {
        throw new BadRequestException(
          'O CPF informado é inválido.',
        );
      }

      return;
    }

    if (
      document.length !== 14 ||
      !this.isValidCnpj(document)
    ) {
      throw new BadRequestException(
        'O CNPJ informado é inválido.',
      );
    }
  }

  private validateAccountDates(
    accountType: AccountType,
    birthDate?: string,
    foundationDate?: string,
  ) {
    if (
      accountType ===
      AccountType.INDIVIDUAL
    ) {
      if (
        !birthDate ||
        foundationDate
      ) {
        throw new BadRequestException(
          'Pessoa física deve informar somente a data de nascimento.',
        );
      }

      return;
    }

    if (
      !foundationDate ||
      birthDate
    ) {
      throw new BadRequestException(
        'Concessionária deve informar somente a data de fundação.',
      );
    }
  }

  private validateAccountDatesForUpdate(
    accountType: AccountType,
    birthDate: Date | null,
    foundationDate: Date | null,
  ) {
    if (
      accountType ===
      AccountType.INDIVIDUAL
    ) {
      if (
        !birthDate ||
        foundationDate
      ) {
        throw new BadRequestException(
          'Pessoa física deve possuir data de nascimento e não deve possuir data de fundação.',
        );
      }

      return;
    }

    if (
      !foundationDate ||
      birthDate
    ) {
      throw new BadRequestException(
        'Concessionária deve possuir data de fundação e não deve possuir data de nascimento.',
      );
    }
  }

  private async ensureEmailIsAvailable(
    email: string,
    ignoredUserId?: string,
  ) {
    const existing =
      await this.prisma.user.findUnique(
        {
          where: {
            email,
          },
        },
      );

    if (
      existing &&
      existing.id !== ignoredUserId
    ) {
      throw new ConflictException(
        'Esse email já está cadastrado.',
      );
    }
  }

  private async ensureDocumentIsAvailable(
    document: string,
    ignoredUserId?: string,
  ) {
    const existing =
      await this.prisma.user.findUnique(
        {
          where: {
            document,
          },
        },
      );

    if (
      existing &&
      existing.id !== ignoredUserId
    ) {
      throw new ConflictException(
        'Esse documento já está cadastrado.',
      );
    }
  }

  private isValidCpf(
    cpf: string,
  ) {
    if (
      cpf.length !== 11
    ) {
      return false;
    }

    if (
      /^(\d)\1{10}$/.test(cpf)
    ) {
      return false;
    }

    let sum = 0;

    for (
      let i = 0;
      i < 9;
      i++
    ) {
      sum +=
        Number(cpf[i]) *
        (10 - i);
    }

    let digit =
      (sum * 10) % 11;

    if (digit === 10) {
      digit = 0;
    }

    if (
      digit !==
      Number(cpf[9])
    ) {
      return false;
    }

    sum = 0;

    for (
      let i = 0;
      i < 10;
      i++
    ) {
      sum +=
        Number(cpf[i]) *
        (11 - i);
    }

    digit =
      (sum * 10) % 11;

    if (digit === 10) {
      digit = 0;
    }

    return (
      digit ===
      Number(cpf[10])
    );
  }

  private isValidCnpj(
    cnpj: string,
  ) {
    if (
      cnpj.length !== 14
    ) {
      return false;
    }

    if (
      /^(\d)\1{13}$/.test(cnpj)
    ) {
      return false;
    }

    const firstWeights = [
      5, 4, 3, 2,
      9, 8, 7, 6,
      5, 4, 3, 2,
    ];

    const secondWeights = [
      6, 5, 4, 3, 2,
      9, 8, 7, 6, 5,
      4, 3, 2,
    ];

    let sum = 0;

    for (
      let i = 0;
      i < 12;
      i++
    ) {
      sum +=
        Number(cnpj[i]) *
        firstWeights[i];
    }

    let remainder =
      sum % 11;

    let digit =
      remainder < 2
        ? 0
        : 11 - remainder;

    if (
      digit !==
      Number(cnpj[12])
    ) {
      return false;
    }

    sum = 0;

    for (
      let i = 0;
      i < 13;
      i++
    ) {
      sum +=
        Number(cnpj[i]) *
        secondWeights[i];
    }

    remainder =
      sum % 11;

    digit =
      remainder < 2
        ? 0
        : 11 - remainder;

    return (
      digit ===
      Number(cnpj[13])
    );
  }
}