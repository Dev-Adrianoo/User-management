"use client"

import { createContext, useContext, useState, ReactNode, useEffect } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { api } from "@/lib/api"
import { UserRole } from "@/types/user"
import { Permission } from "@/lib/permissions"


interface User {
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

interface AuthContextType {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  permissions: Permission[]
  login(email: string, password: string): Promise<void>
  logout(): Promise<void>
  refreshUser(): Promise<void>
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function Authprovider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [permissions, setPermissions] = useState<Permission[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const router = useRouter()

  const isAuthenticated = !!user

  useEffect(() => {
    refreshUser()
  }, [])

  const refreshUser = async () => {
    const token = localStorage.getItem("token")
    if (!token) {
      setIsLoading(false)
      return
    }

    try {
      const [userResponse, permissionsResponse] = await Promise.all([
        api.get("/api/auth/me"),
        api.get("/api/auth/permissions"),
      ]);

      setUser(userResponse.data.user);
      setPermissions(permissionsResponse.data.data || []);

    } catch (error: any) {
      console.error("Error refreshing user session:", error)
      localStorage.removeItem("token")
      setUser(null)
      setPermissions([])
    } finally {
      setIsLoading(false)
    }
  }

  const login = async (email: string, password: string) => {
    try {
      const { data: loginData } = await api.post("/api/auth/login", { email, password });

      localStorage.setItem("token", loginData.token)
      setUser(loginData.user)

      const { data: permissionsData } = await api.get("/api/auth/permissions");
      setPermissions(permissionsData.data || []);

      toast.success("Login realizado com sucesso!");

      router.push("/dashboard")
    }catch (error: any) {
      const message = error.response?.data?.error || "Erro ao fazer login"
      toast.error(message)
      throw error
    }
  }

  const logout = async () => {
    try {
      await api.post("/api/auth/logout")
      localStorage.removeItem("token")
      setUser(null)
      setPermissions([])
      toast.success("Logout realizado com sucesso!")
      router.push("/singin")
    } catch (error: any) {
      const message = error.response?.data?.error || "Erro ao fazer logout"
      toast.error(message)
      throw error
    }
  }

  return (
    <AuthContext.Provider
    value={{
      user,
      isLoading,
      isAuthenticated,
      permissions,
      login,
      logout,
      refreshUser,
    }}
    >
      {children}
    </AuthContext.Provider>
  )
}