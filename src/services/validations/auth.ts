import { z } from   "zod"


const emailSchema = z
      .string()
      .min(1, "Email é obrigatório")
      .email("Email inválido")
      .toLowerCase()
      .trim()

const passwordSchema = z
      .string()
      .min(8, "Senha deve ter no mínimo 8 caracteres")
      .regex(/[A-Z]/, "Senha deve conter pelo menos uma letra maiúscula")
      .regex(/[a-z]/, "Senha deve conter pelo menos uma letra minúscula")
      .regex(/[0-9]/, "Senha deve conter pelo menos um número")
      .regex(/[^A-Za-z0-9]/, "Senha deve conter pelo menos um caractere especial")

const cepSchema = z
      .string()
      .regex(/^\d{5}-?\d{3}$/, "CEP inválido (formato: 00000-000)")
      .transform((val) => val.replace(/\D/g, ""))
      .optional()


export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, "Senha é obrigatória"),
})

export const signupSchema = z
  .object({
    name: z
    .string()
    .min(3, "Nome deve ter no mínimo 3 caracteres")
    .max(100, "Nome deve ter no máximo 100 caracteres")
    .trim(),
  email: emailSchema,
  password: passwordSchema,
  confirmPassword: z.string().min(1, "Confirmação de senha é obrigatória"),
  cep: cepSchema,
  estado: z
    .string()
    .length(2, "Estado deve ter 2 caracteres (UF)")
    .toUpperCase()
    .optional(),
  cidade: z
    .string()
    .min(2, "Cidade de ter no mínimo 2 caracteres")
    .max(100, "Cidade deve ter no máximo 100 caracteres")
    .optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "As senhas não conicidem",
    path: ["confirmPassword"],
  })
  .refine(
    (data) => {
      if(data.cep) {
        return !!data.estado && !!data.cidade
      }
      return true
    },
    {
      message: "Estado e cidade são obrigatórios quando CEP é informado",
      path: ["estado"],
    }
  )

  //TODO caso de tempo colocar feature para nova senha.

export const updatePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Senha atual é obrigatória"),
    newPassword: passwordSchema,
    confirmNewPassword: z.string().min(1, "Confirmação de senha é obrigatória"),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: "As senhas não coicidem",
    path: ["confirmNewPassword"],
  })
  .refine((data) => data.currentPassword == data.newPassword, {
    message: "Nova senha deve ser diferente da senha atual",
    path: ["newPassword"],
  })


export type LoginInput = z.infer<typeof loginSchema>
export type SignupData = z.infer<typeof signupSchema>
export type UpdatePasswordInput = z.infer<typeof updatePasswordSchema>
