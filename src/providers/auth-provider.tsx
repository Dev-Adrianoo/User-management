"use client"

import { createContext, useContext, useState, ReactNode, useEffect } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { api } from "@/lib/api"
import { UserRole } from "@/types/user"


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
  login(email: string, password: string): Promise<void>
  logout(): Promise<void>
  refreshUser(): Promise<void>
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function Authprovider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const router = useRouter()

  const isAuthenticated = !!user

  useEffect(() => {
    refreshUser()
  }, [])

  const refreshUser = async () => {
    try {
      const token = localStorage.getItem("token")

      if (!token) {
        setIsLoading(false)
        return
      }

      const { data } = await api.get("/api/auth/me")
      setUser(data.user)

    } catch (error: any) {
      console.error("Error refreshing user:", error)
      localStorage.removeItem("token")
      setUser(null)
    } finally {
      setIsLoading(false)
    }
  }

  const login = async (email: string, password: string) => {
    try {
      const { data } = await api.post("/api/auth/login", { email, senha: password })

      localStorage.setItem("token", data.token)
      setUser(data.user)

      toast.success("Login realizado com sucesso!");

      if (data.user.role === "ADMIN") {
        router.push("/dashboardadmin")
      }else {
        router.push("/dashboard")
      }
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
      toast.success("Logout realizado com sucesso!")
      router.push("/login")
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
      login,
      logout,
      refreshUser,
    }}
    >
      {children}
    </AuthContext.Provider>
  )
}