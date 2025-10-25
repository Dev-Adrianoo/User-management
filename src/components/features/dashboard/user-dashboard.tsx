"use client"

import { motion, Variants } from "framer-motion"
import { Mail, Clock, CheckCircle2, User as UserIcon } from "lucide-react" 
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { PublicUser } from '@/types/user'; 

interface DashBoardUserProps {
  user: PublicUser | null;
}

const now = new Date();
const formattedDateTime = now.toLocaleString('pt-BR', { 
  day: '2-digit', 
  month: '2-digit', 
  year: 'numeric', 
  hour: '2-digit', 
  minute: '2-digit' 
});

const activityCards = [
  { 
    title: "Atividades recentes", 
    description: `Último acesso: ${formattedDateTime}`, 
    icon: Clock, 
    color: "text-blue-600", 
    bgColor: "bg-blue-50" 
  },
  { title: "Mensagens", description: "Nenhuma nova mensagem", icon: Mail, color: "text-purple-600", bgColor: "bg-purple-50" },
  { title: "Status da conta", description: "Ativa", icon: CheckCircle2, color: "text-green-600", bgColor: "bg-green-50", badge: true },
]

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
}

const itemVariants: Variants = { 
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { 
      duration: 0.5, 
      ease: "easeOut" 
    } 
  },
}

export default function DashBoardUser({ user }: DashBoardUserProps) {

  if (!user) {
    return <div className="p-8 text-center text-red-600">Erro ao carregar dados do usuário.</div>;
  }
  
  const getInitials = (name: string = "") => name.split(" ").map((n) => n[0]).join("");

  return (
    <div className="p-8"> 
      <motion.div 
        className="max-w-4xl mx-auto" 
        variants={containerVariants} 
        initial="hidden" 
        animate="visible"
      >
        <motion.div
          variants={itemVariants}
          className="bg-white rounded-2xl border border-gray-200 p-8 mb-8 shadow-sm hover:shadow-md transition-shadow"
        >
          <h3 className="text-3xl font-bold text-gray-900 mb-2"> 
            Bem-vindo de volta, {user.nome.split(" ")[0]}!
          </h3>
          <p className="text-gray-600 mb-6">É ótimo ter você aqui novamente.</p>

          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-indigo-50 flex items-center justify-center">
                <UserIcon className="w-5 h-5 text-indigo-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Nome</p>
                <p className="text-base font-semibold text-gray-900">{user.nome}</p> 
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-purple-50 flex items-center justify-center">
                <Mail className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Email</p>
                <p className="text-base font-semibold text-gray-900">{user.email}</p> 
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Função</p>
                <Badge className={
                  user.role === 'ADMIN' 
                  ? "bg-purple-100 text-purple-700 hover:bg-purple-100 font-semibold" 
                  : "bg-green-100 text-green-700 hover:bg-green-100 font-semibold"
                }>
                  {user.role}
                </Badge>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div 
          variants={containerVariants} 
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {activityCards.map((card, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover={{ scale: 1.02 }}
              className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-all"
            >
              <div className={`w-12 h-12 rounded-lg ${card.bgColor} flex items-center justify-center mb-4`}>
                <card.icon className={`w-6 h-6 ${card.color}`} />
              </div>
              <h4 className="text-sm font-semibold text-gray-900 mb-2">{card.title}</h4>
              {card.badge ? (
                <Badge className="bg-green-100 text-green-700 hover:bg-green-100 font-semibold">
                  {card.description}
                </Badge>
              ) : (
                <p className="text-sm text-gray-600">{card.description}</p>
              )}
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </div>
  )
}