import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';
import bcrypt from 'bcryptjs'; 

export async function GET() {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        nome: true,
        email: true,
        role: true,
      },
      orderBy: {
        createdAt: 'desc',
      }
    });
    return NextResponse.json(users);
  } catch (error) {
    console.error("Failed to fetch users:", error);
    return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    // TODO: Add validation with Zod using user.schema.ts
     const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(body.password, salt);

    const newUser = await prisma.user.create({
      data: {
        nome: body.nome,
        email: body.email,
        // senhaHash: hashedPassword,
        senhaHash: body.password, 
      },
    });
    const { senhaHash, ...userResponse } = newUser;
    return NextResponse.json(userResponse, { status: 201 });
  } catch (error) {
    console.error("Failed to create user:", error);
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2002') {
        const target = (error.meta?.target as string[]) || [];
        if (target.includes('email')) {
          return NextResponse.json({ error: 'Email already exists' }, { status: 409 });
        }
      }
    }
    return NextResponse.json({ error: 'Failed to create user' }, { status: 500 });
  }
}
