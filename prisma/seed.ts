import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log("Iniciando o seeding do administrador...");

  const adminEmail = 'admin@gmail.com';
  const adminPassword = 'SenhaAdmin123';

  const hashedPassword = await bcrypt.hash(adminPassword, 10);

  const adminUser = await prisma.user.upsert({
    where: {
      email: adminEmail
    },
    update: {},
    create: {
      nome: 'Admin',
      email: adminEmail,
      senhaHash: hashedPassword,
      role: 'ADMIN',
    }
  })
  console.log(`Administrador criado/atualizado: ${adminUser.email}`);
}

main()
  .catch((e) =>{
    console.error(e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  })