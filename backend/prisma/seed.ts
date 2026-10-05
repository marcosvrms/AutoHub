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
  // ── Categorias ──────────────────────────────────────────
  const categories = ['Terrestre', 'Aquático', 'Aéreo'];

  for (const name of categories) {
    await prisma.category.upsert({
      where: { name },
      update: {},
      create: { name },
    });
  }
  console.log('✅ Categorias criadas/verificadas.');

  // ── Usuário de teste ────────────────────────────────────
  const testPassword = await hashPassword('AutoHub@12345678');

  await prisma.user.upsert({
    where: { email: 'teste@autohub.local' },
    update: { passwordHash: testPassword },
    create: {
      name: 'Usuário de Teste',
      email: 'teste@autohub.local',
      passwordHash: testPassword,
      accountType: AccountType.INDIVIDUAL,
      document: '52998224725',
      phone: '49999999999',
      birthDate: new Date('2000-01-01'),
      city: 'Videira',
      state: 'SC',
      country: 'Brasil',
    },
  });
  console.log('✅ Usuário de teste criado/atualizado.');

  // ── Usuário Admin ───────────────────────────────────────
  const adminPassword = await hashPassword('AutoHub@Admin123');

  await prisma.user.upsert({
    where: { email: 'admin@autohub.local' },
    update: {
      passwordHash: adminPassword,
      role: UserRole.ADMIN,
      accountType: AccountType.INDIVIDUAL,
    },
    create: {
      name: 'Administrador AutoHub',
      email: 'admin@autohub.local',
      passwordHash: adminPassword,
      accountType: AccountType.INDIVIDUAL,
      role: UserRole.ADMIN,
      document: '71428793860',
      phone: '49999998888',
      birthDate: new Date('1990-01-01'),
      city: 'Videira',
      state: 'SC',
      country: 'Brasil',
    },
  });
  console.log('✅ Usuário admin criado/atualizado.');

  console.log('\n🎉 Seed executado com sucesso!');
  console.log('─────────────────────────────────────────');
  console.log('Admin → admin@autohub.local / AutoHub@Admin123');
  console.log('Teste → teste@autohub.local / AutoHub@12345678');
  console.log('─────────────────────────────────────────');
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });