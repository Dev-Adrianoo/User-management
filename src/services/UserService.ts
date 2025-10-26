import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { toPublicUser } from '@/lib/utils';
import { User } from '@prisma/client';
import { signupSchema } from '@/lib/schemas/auth.schema';
import { useCallback } from 'react';
import { updateUserSchema } from '@/lib/schemas/user.schema';


export const getAllUsers = async () => {
  const users = await prisma.user.findMany({
    orderBy: {
      createdAt: 'desc',
    }
  });

  return users.map(toPublicUser);
};

export const getUserById = async (id: string) => {
  const user = await prisma.user.findUnique({
    where: { id: id },
  })

  if (!user) {
    return null;
  }

  return toPublicUser(user)
}

export const updateUser = async (id: string, body: unknown) => {

  const validatedData = updateUserSchema.parse(body);

  const updateUser = await prisma.user.update({
    where: { id: id },
    data: {
      nome: validatedData.name,
      email: validatedData.email,
    }
  })

  return toPublicUser(updateUser);
}

export async function createUser(body: unknown) {

  const validatedData = signupSchema.parse(body)

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(validatedData.password, salt);

  const newUser = await prisma.user.create({
    data: {
      nome: validatedData.name,
      email: validatedData.email,
      senhaHash: hashedPassword,
      cep: validatedData.cep,
      estado: validatedData.estado,
      cidade: validatedData.cidade,
      role: 'USER',
    },
  });

  return toPublicUser(newUser);
}

export const deleteUser = async (id: string) => {
  const user = await prisma.user.delete({
    where: { id: id },
  });
};
