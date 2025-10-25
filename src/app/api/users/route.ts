import { NextResponse } from 'next/server';
import { Prisma } from '@prisma/client';
import * as userService from '@/services/UserService';
import { ZodError } from 'zod';

export async function GET() {
  try {
    const users = await userService.getAllUsers()
    return NextResponse.json(users);
  } catch (error) {
    console.error("Failed to fetch users:", error);
    return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const newUser = await userService.createUser(body);

    return NextResponse.json(newUser, { status: 201 });


  } catch (error) {
    console.error("Failed to create user:", error);

    if (error instanceof ZodError) {
      return NextResponse.json({
        error: 'Invalid input',
        details: error.flatten().fieldErrors
      },
      { status: 400 }
    )
    }

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