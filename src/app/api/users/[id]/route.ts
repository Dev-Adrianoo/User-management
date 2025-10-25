import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';
import { ZodError } from 'zod';
import * as userService from "@/services/UserService"
import { url } from 'inspector';

type Context = {
  params: {
    id: string;
  }
}

export async function GET(request: NextRequest) {
  try {

    const url = new URL(request.url);
    const id = url.pathname.split('/').pop();
    if (!id) {
      return NextResponse.json({ error: 'User ID not provided' }, { status: 400 });
    }

    const user = await userService.getUserById(id);

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    return NextResponse.json(user);


  } catch (error) {
    console.error("Failed to fetch user: ", error);
    return NextResponse.json({ error: 'Failed to fetch user ' }, { status: 500 })
  }
}


export async function PUT(request: NextRequest) {
  try {

    const url = new URL(request.url);
    const id = url.pathname.split('/').pop();

    if (!id) {
      return NextResponse.json({ error: 'User ID not provided' }, { status: 400 });
    }
    const body = await request.json();
    const updatedUser = await userService.updateUser(id, body);
    return NextResponse.json(updatedUser);

  } catch (error) {

    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: 'Invalid input', details: error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2025") {
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
      }
    }
    return NextResponse.json({ error: 'Failed to update user' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const url = new URL(request.url);

    const id = url.pathname.split('/').pop();

    if (!id) {
      return NextResponse.json({ error: "User ID not provided" }, { status: 400 });
    }

    await userService.deleteUser(id);

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
