"use client"

import { use, useState } from "react"
import { motion, Variants } from "framer-motion"
import {
  Users,
  UserCheck,
  UserPlus,
  Shield,
  Search,
  MoreVertical,
  Edit,
  Trash2,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { useAuth } from "@/hooks/use-auth"
import { useUsers } from "@/hooks/use-users"
import { PublicUser } from "@/types/user"
import { toast } from "sonner"
import { containerVariantsStagger, itemVariantsFadeInUp } from '@/lib/animation';




export default function DashBoardAdmin() {
  const [searchQuery, setSearchQuery] = useState("")
  const { permissions } = useAuth()


  const {
    users: usersData = [],
    isLoading,
    error,
    deleteUser,
  } = useUsers()


  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<PublicUser | null>(null);


  const totalUsers = usersData.length;

  const newThisMonth = usersData.filter(user => {
    const createdAt = new Date(user.createdAt);
    const today = new Date();

    return createdAt.getMonth() == today.getMonth() && createdAt.getFullYear() == today.getFullYear();
  }).length

  const stats = [
    {
      label: "Total de Usuários",
      value: totalUsers.toString(),
      icon: Users,
      color: "text-blue-600"
    },
    {
      label: "Novos esse Mês",
      value: newThisMonth.toString(),
      icon: Users,
      color: "text-purple-600"
    }
  ]

  const filteredUsers = usersData.filter(
    (user) =>
      user.nome.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const handleDeleteConfirm = async () => {
    if (!userToDelete) return;

    try {
      await deleteUser(userToDelete.id);
      toast.success(`Usuário "${userToDelete.nome}" delete com sucesso!`)
    } catch (err) {
      console.error("Erro ao deleter usuário. Tente novamente.");
    } finally {
      setIsDeleteDialogOpen(false);
      setUserToDelete(null);
    }
  }

  return (
    <motion.div className="p-8"
    variants={containerVariantsStagger}
    initial="hidden"
    animate="visible">

      { /* Card de stats */}
      <motion.div 
      variants={containerVariantsStagger}
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {stats.map((stat) => (
          <motion.div
            key={stat.label}
            variants={itemVariantsFadeInUp}
            whileHover={{scale: 1.02}}
            className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {stat.value}
                </p>
              </div>
              <div className={`p-3 rounded-lg bg-gray-50 ${stat.color}`}>
                <stat.icon className="w-6 h-6" />
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Tabela de users */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">

        {/* add e busca users */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                placeholder="Buscar usuários..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {permissions.includes("manage_users") && (
              <Button className="bg-indigo-600 hover:bg-indigo-700">
                <UserPlus className="w-4 h-4 mr-2" />
                Adicionar usuário
              </Button>
            )}

          </div>
        </div>

        {isLoading && (
          <div className="text-center py-12">Carregando usuários...</div>
        )}

        {error && (
          <div className="text-center py-12 text-red-600">
            Erro ao carregar usuários.
          </div>
        )}

        {!isLoading && !error && (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredUsers.map((user: PublicUser) => (
                    <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <Avatar className="w-10 h-10">
                            <AvatarImage src={"/placeholder.svg"} />
                            <AvatarFallback>
                              {user.nome.split(" ").map((n) => n[0]).join("")}
                            </AvatarFallback>
                          </Avatar>
                          <span className="font-medium text-gray-900">{user.nome}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{user.email}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Badge
                          variant={user.role === "ADMIN" ? "default" : "secondary"}
                          className={
                            user.role === "ADMIN"
                              ? "bg-purple-100 text-purple-700 hover:bg-purple-100"
                              : "bg-green-100 text-green-700 hover:bg-green-100"
                          }
                        >
                          {user.role}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">

                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <div className="flex items-center justify-end gap-2">

                          {permissions.includes("manage_users") && (
                            <Button variant="ghost" size="sm" className="text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50">
                              <Edit className="w-4 h-4 mr-1" />
                              Edit
                            </Button>
                          )}
                          {permissions.includes("manage_users") && (
                            <Button
                              onClick={() => {
                                console.log("Botão Delete clicado para:", user.nome);
                                setUserToDelete(user);
                                console.log("userToDelete definido como:", user);
                                setIsDeleteDialogOpen(true);
                                console.log("isDeleteDialogOpen definido como: true");
                              }}
                              variant="ghost" size="sm" className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            >
                              <Trash2 className="w-4 h-4 mr-1" /> Delete
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Esta ação não pode ser desfeita. Isso excluirá permanentemente o usuário
                    <span className="font-semibold"> {userToDelete?.nome}</span> ({userToDelete?.email}).
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel onClick={() => setUserToDelete(null)}>Cancelar</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleDeleteConfirm}
                    className="bg-red-600 hover:bg-red-700"
                  >
                    Confirmar Exclusão
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>


            {filteredUsers.length === 0 && (
              <div className="text-center py-12">
                <Users className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-600">Nenhum usuário encontrado</p>
              </div>
            )}
          </>
        )}
      </div>
    </motion.div>
  )
}