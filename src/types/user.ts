export enum UserRole {
  USER = "USER",
  ADMIN = "ADMIN",
}

export interface User {
  id: string
  name: string
  email: string
  // nunca expor password no front-end.
  password: string
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
  name: string
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
  name?: string
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