"use client"

import { Bell } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useAuth } from "@/hooks/use-auth" 

export function DashboardHeader() {
  const { user, permissions } = useAuth() 

  const isAdminView = permissions.includes("view_admin_dashboard");
  const title = isAdminView ?  "Gerenciamento de usuários" : "Painel do Usuário";
  const subtitle = isAdminView
    ? "Gerencie os membros da sua equipe e suas permissões de conta aqui."
    : "Bem-vindo ao seu painel.";

  const getInitials = (name: string = "") =>
    name
      .split(" ")
      .map((n) => n[0])
      .join("")

  return (
    <header className="bg-white border-b border-gray-200 px-8 py-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">
            {title}
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            {subtitle}
          </p>
        </div>

        <div className="flex items-center gap-4">
          <button className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>
          
          <div className="flex items-center gap-3">
            <Avatar className="w-9 h-9">
              <AvatarImage src={""} /> 
              <AvatarFallback>{getInitials(user?.nome)}</AvatarFallback>
            </Avatar>
            <div className="text-sm">
              <p className="font-medium text-gray-900">{user?.nome}</p>
              <p className="text-gray-500">{user?.email}</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}