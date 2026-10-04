import 'dotenv/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../src/generated/prisma/client.js';
import { AccountType, UserRole } from '../src/generated/prisma/client.js';
import { hashPassword } from '../src/users/password.utils.js';

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error('DATABASE_URL não foi definida.');
}

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

async function main() {
  const categories = ['Terrestre', 'Aquático', 'Aéreo'];

  for (const name of categories) {
    await prisma.category.upsert({
      where: { name },
      update: {},
      create: { name },
    });
  }

  await prisma.user.upsert({
    where: { email: 'teste@autohub.local' },
    update: {},
    create: {
      name: 'Usuário de Teste',
      email: 'teste@autohub.local',
      passwordHash: 'hash-temporario-nao-usar-em-producao',
      document: '00000000000',
      phone: '49999999999',
      city: 'Videira',
      state: 'SC',
    },
  });

  console.log('Seed executado com sucesso.');
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
  const adminPassword =
  await hashPassword(
    'AutoHub@123456',
  );

await prisma.user.upsert({
  where: {
    email: 'admin@autohub.local',
  },

  update: {
    passwordHash: adminPassword,
    role: UserRole.ADMIN,
    accountType:
      AccountType.INDIVIDUAL,
  },

  create: {
    name: 'Administrador AutoHub',

    email: 'admin@autohub.local',

    passwordHash: adminPassword,

    accountType:
      AccountType.INDIVIDUAL,

    role: UserRole.ADMIN,

    document: '52998224725',

    phone: '49999999999',

    birthDate:
      new Date('2000-01-01'),

    city: 'Videira',

    state: 'SC',

    country: 'Brasil',
  },
});