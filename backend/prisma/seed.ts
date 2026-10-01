import 'dotenv/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../src/generated/prisma/client.js';

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error('DATABASE_URL não foi definida.');
}

const adapter = new PrismaPg({
  connectionString,
});

const prisma = new PrismaClient({
  adapter,
});

// Injetando categorias padrões/iniciais.
async function main() {
  const categories = [
    'Terrestre',
    'Aquático',
    'Aéreo',
  ];

  for (const name of categories) {
    await prisma.category.upsert({
      where: {
        name,
      },
      update: {},
      create: {
        name,
      },
    });
  }

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

  console.log(new URL(connectionString).username, new URL(connectionString).host);