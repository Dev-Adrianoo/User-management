import { extractTokenFromHeader, generateToken, verifyToken } from "@/lib/jwt";
import { prisma } from "@/lib/prisma";
import { loginSchema, signupSchema } from "@/lib/schemas/auth.schema";
import { toPublicUser } from "@/lib/utils";
import { compare } from "bcrypt";
import { ZodError } from "zod";
import * as userService from "@/services/UserService"


export const registerUser = async (body: unknown) => {
  
  // já vem com validação, pois o userService valida e criptografa
  const user = await userService.createUser(body)

  const token = await generateToken({
    userId: user.id,
    email: user.email,
    role: user.role
  });

  return { user, token };
}


export const loginUser = async (body: unknown) => {
  const validatedData = loginSchema.parse(body);

  const user = await prisma.user.findUnique({
    where: { email: validatedData.email }
  })

  if(!user) {
    throw new Error("Email ou senha inválidos");
  }
  
  const isPasswordValid = await compare(validatedData.password, user.senhaHash)

  if(!isPasswordValid) {
    throw new Error("Email ou senha inválidos");
  }

  const token = await generateToken({
    userId: user.id,
    email: user.email,
    role: user.role
  });

  const publicUser = toPublicUser(user)
  return { user: publicUser, token }
}


export const validateUserToken = async (authHeader: string | null) => {

  const token = extractTokenFromHeader(authHeader);
  if(!token) {
    throw new Error("Token não fornecido")
  }

  const payload = await verifyToken(token);
  if(!payload) {
    throw new Error("Token inválido ou expirado!");
  }

  const user = await userService.getUserById(payload.userId)
  if(!user) {
    throw new Error("Usuário não encontrado!")
  }
  
  return user
}