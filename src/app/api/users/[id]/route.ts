import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';
import { ZodError } from 'zod';
import * as userService from "@/services/UserService"

type Context = {
  params: {
    id: string;
  }
}

export async function GET(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const resolvedParams = await context.params;
    const { id } = resolvedParams;

    const user = await prisma.user.findUnique({
      where: { id },
      select: { id: true, nome: true, email: true, role: true },
    });
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    return NextResponse.json(user);
  } catch (error) {
    console.error('Failed to fetch user:', error);
    return NextResponse.json({ error: 'Failed to fetch user' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const resolvedParams = await context.params;
    const { id } = resolvedParams;

    const body = await request.json();
    // TODO: Add validation with Zod using user.schema.ts
    const updatedUser = await prisma.user.update({
      where: { id },
      data: body,
    });
    const { senhaHash, ...userResponse } = updatedUser;
    return NextResponse.json(userResponse);
  } catch (error) {
    console.error('Failed to update user:', error);
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2025') {
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
      }
    }
    return NextResponse.json({ error: 'Failed to update user' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const resolvedParams = await context.params;
    const { id } = resolvedParams;

    await prisma.user.delete({
      where: { id },
    });
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error('Failed to delete user:', error);
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2025') {
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
      }
    }
    return NextResponse.json({ error: 'Failed to delete user' }, { status: 500 });
  }
}
