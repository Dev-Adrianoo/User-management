import { Role as PrismaRole } from "@prisma/client";

export type UserRole = PrismaRole;

export interface User {
  id: string
  nome: string
  email: string
  // nunca expor password no front-end.
  senhaHash: string
  role:  UserRole
  cep?: string | null
  estado?: string | null 
  cidade?: string | null
  createdAt: Date;
  updatedAt: Date;
}

// usuario publico ( não possue senha )

// ( usado para retornar dados ao front )

export interface PublicUser {
  id: string
  nome: string
  email: string
  role: UserRole
  cep?: string | null
  estado?: string | null 
  cidade?: string | null
  createdAt: Date;
  updatedAt: Date;
}

// Dados para atualizar um usuário (admin)

export interface UpdateUserDTO {
  nome?: string
  email?: string
  cep?: string
  estado?: string
  cidade?: string
}

export interface UpdatePasswordDTO {
  currentPassword: string
  newPassword: string
}

// Lista de usuarios para admin

export interface UserListResponse {
  users: PublicUser[]
  total: number
  page: number
  limit: number
}