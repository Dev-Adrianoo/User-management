"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { isAxiosError } from "axios"
import { toast } from "sonner"
import { UserPlus, UserRound, Mail, Lock, MapPin, Map } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog"

import { useUsers } from "@/hooks/use-users"
import { useCep } from "@/hooks/use-cep"
import { SignupData, signupSchema } from "@/lib/schemas/auth.schema"

export function AddUserModal() {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const { createUser } = useUsers();
  const { fetchCep, isLoading: isCepLoading } = useCep();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setValue,
  } = useForm<SignupData>({
    resolver: zodResolver(signupSchema) as any, 
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      cep: '',
      estado: '',
      cidade: '',
    },
    mode: 'onBlur',
  });

  const handleCepBlur = async (e: React.FocusEvent<HTMLInputElement>) => {
    const cep = e.target.value;
    const data = await fetchCep(cep);
    if (data) {
      setValue("estado", data.uf);
      setValue("cidade", data.localidade);
    }
  };

  const handleCreateSubmit = async (data: SignupData) => {
    try {
      await createUser(data);
      toast.success(`Usuário "${data.name}" criado com sucesso!`);
      reset();
      setIsAddDialogOpen(false);
    } catch (err) {
      if (isAxiosError(err) && err.response?.data?.error) {
        toast.error(`Erro: ${err.response.data.error}`);
      } else {
        toast.error("Erro ao criar usuário. Tente novamente.");
      }
    }
  };

  return (
    <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
      <DialogTrigger asChild>
        <Button className="bg-indigo-600 hover:bg-indigo-700">
          <UserPlus className="w-4 h-4 mr-2" />
          Adicionar usuário
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Criar Novo Usuário</DialogTitle>
          <DialogDescription>
            Preencha os dados abaixo para criar um novo usuário.
          </DialogDescription>
        </DialogHeader>

        <form
          id="add-user-form"
          onSubmit={handleSubmit(handleCreateSubmit)}
          className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4"
        >
          <Input
            id="add-name"
            label="Nome Completo"
            icon={<UserRound className='h-5 w-5 text-gray-400' />}
            disabled={isSubmitting}
            error={errors.name?.message}
            {...register("name")}
            className="md:col-span-2"
          />
          <Input
            id="add-email"
            label="Email"
            type="email"
            icon={<Mail className='h-5 w-5 text-gray-400' />}
            disabled={isSubmitting}
            error={errors.email?.message}
            {...register("email")}
            className="md:col-span-2"
          />
          <Input
            id="add-password"
            label="Senha"
            type="password"
            icon={<Lock className='h-5 w-5 text-gray-400' />}
            disabled={isSubmitting}
            error={errors.password?.message}
            {...register("password")}
          />
          <Input
            id="add-confirmPassword"
            label="Confirmar Senha"
            type="password"
            icon={<Lock className='h-5 w-5 text-gray-400' />}
            disabled={isSubmitting}
            error={errors.confirmPassword?.message}
            {...register("confirmPassword")}
          />
          <Input
            id="add-cep"
            label="CEP (Opcional)"
            icon={<MapPin className='h-5 w-5 text-gray-400' />}
            disabled={isSubmitting || isCepLoading}
            error={errors.cep?.message}
            {...register("cep")}
            onBlur={handleCepBlur}
            className="md:col-span-2"
          />
          <Input
            id="add-estado"
            label="Estado (UF)"
            icon={<Map className='h-5 w-5 text-gray-400' />}
            disabled={isSubmitting || isCepLoading}
            error={errors.estado?.message}
            {...register("estado")}
          />
          <Input
            id="add-cidade"
            label="Cidade"
            icon={<Map className='h-5 w-5 text-gray-400' />}
            disabled={isSubmitting || isCepLoading}
            error={errors.cidade?.message}
            {...register("cidade")}
          />
        </form>

        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="outline" disabled={isSubmitting}>Cancelar</Button>
          </DialogClose>
          <Button
            type="submit"
            form="add-user-form"
            isLoading={isSubmitting}
            loadingText="Criando..."
          >
            Criar Usuário
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}