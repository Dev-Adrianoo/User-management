import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Iniciando o seeding...");

  await prisma.user.deleteMany();

  const adminPassword = 'SenhaAdmin123@';
  const userPassword = 'SenhaUser123@';

  const hashedAdminPassword = await bcrypt.hash(adminPassword, 10);
  const hashedUserPassword = await bcrypt.hash(userPassword, 10);

  // 1. Admin
  const admin = await prisma.user.create({
    data: {
      nome: 'Admin Sistema',
      email: 'admin@gmail.com',
      senhaHash: hashedAdminPassword,
      role: 'ADMIN',
      cep: '01310-100',
      estado: 'SP',
      cidade: 'São Paulo',
    }
  });
  console.log(`✅ Admin criado: ${admin.email}`);

  const users = await prisma.user.createMany({
    data: [
      {
        nome: 'Adriano Souza',
        email: 'adrianosouzaa733@gmail.com',
        senhaHash: hashedUserPassword,
        role: 'USER',
        cep: '31741-105',
        estado: 'MG',
        cidade: 'Belo Horizonte',
      },
      {
        nome: 'Amélie Laurent',
        email: 'amelie@untitledui.com',
        senhaHash: hashedUserPassword,
        role: 'USER',
        cep: '30130-100',
        estado: 'MG',
        cidade: 'Belo Horizonte',
      },
      {
        nome: 'Ammar Foley',
        email: 'ammar@untitledui.com',
        senhaHash: hashedUserPassword,
        role: 'USER',
        cep: '40020-000',
        estado: 'BA',
        cidade: 'Salvador',
      },
      {
        nome: 'Caitlyn King',
        email: 'caitlyn@untitledui.com',
        senhaHash: hashedUserPassword,
        role: 'USER',
        cep: '80010-000',
        estado: 'PR',
        cidade: 'Curitiba',
      },
      {
        nome: 'Sienna Hewitt',
        email: 'sienna@untitledui.com',
        senhaHash: hashedUserPassword,
        role: 'USER',
        cep: '90010-000',
        estado: 'RS',
        cidade: 'Porto Alegre',
      },
      {
        nome: 'Olly Schroeder',
        email: 'olly@untitledui.com',
        senhaHash: hashedUserPassword,
        role: 'USER',
        cep: '60010-000',
        estado: 'CE',
        cidade: 'Fortaleza',
      },
      {
        nome: 'Mathilde Lewis',
        email: 'mathilde@untitledui.com',
        senhaHash: hashedUserPassword,
        role: 'USER',
        cep: '50010-000',
        estado: 'PE',
        cidade: 'Recife',
      },
      {
        nome: 'Jaya Willis',
        email: 'jaya@untitledui.com',
        senhaHash: hashedUserPassword,
        role: 'USER',
        cep: '70010-000',
        estado: 'DF',
        cidade: 'Brasília',
      },
    ]
  });

  console.log(`✅ ${users.count} usuários criados`);
  console.log(`\n🔐 Credenciais:`);
  console.log(`   Admin: admin@gmail.com / SenhaAdmin123@`);
}

main()
  .catch((e) => {
    console.error('Erro no seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });