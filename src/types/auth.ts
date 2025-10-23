import { UserRole, PublicUser } from "./user";

// dados de Login

export interface LoginCredentials {
  email: string
  password: string
}

export interface SingupData {
  name: string
  email: string
  password: string
  confirmPassword: string
  cep?: string
  estado: string
  cidade: string
}

export interface AuthResponse {
  success: boolean
  message: string
  user?: PublicUser
  token?: string
}

export interface JWTPayload {
  userId: string
  email: string
  role: UserRole
  iat?: number // issued at (JWT PATTERN!)
  exp?: number // EXPIRATION (JTW PATTERN!)
}

export interface AuthContextType {
  user: PublicUser | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (credentials: LoginCredentials) => Promise<void>
  logout: () => Promise<void>
  register: (data: SingupData) => Promise<void>
  refreshUser: () => Promise<void>
}

export interface AuthState {
  user: PublicUser | null
  isLoading: boolean
  isAuthenticated: boolean;
}