import { z } from "zod"

const emailSchema = z
  .string()
  .min(1, "Email é obrigatório")
  .email("Email inválido")
  .toLowerCase()
  .trim()

const passwordSchema = z
  .string()
  .trim()
  .min(8, "Senha deve ter no mínimo 8 caracteres")
  .regex(/[A-Z]/, "Senha deve conter pelo menos uma letra maiúscula")
  .regex(/[a-z]/, "Senha deve conter pelo menos uma letra minúscula")
  .regex(/[0-9]/, "Senha deve conter pelo menos um número")
  .regex(/[^A-Za-z0-9]/, "Senha deve conter pelo menos um caractere especial")

const cepSchema = z
  .string()
  .transform((val) => val.replace(/\D/g, "")) 
  .refine((val) => val === "" || val.length === 8, "CEP deve ter 8 dígitos")
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
    confirmPassword: z.preprocess(
      (val) => String(val ?? ''),
      z.string().trim().min(1, "Confirmação de senha é obrigatória")
    ),
    cep: cepSchema,
    estado: z
      .string()
      .transform((val) => val?.trim().toUpperCase() || "")
      .refine((val) => val === "" || val.length === 2, "Estado deve ter 2 caracteres (UF)")
      .optional(),
    cidade: z
      .string()
      .trim()
      .refine((val) => val === "" || (val.length >= 2 && val.length <= 100), "Cidade deve ter entre 2 e 100 caracteres")
      .optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "As senhas não coincidem",
    path: ["confirmPassword"],
  })
  .refine(
    (data) => {
      if (data.cep && data.cep !== "") {
        return !!data.estado && data.estado !== "" && !!data.cidade && data.cidade !== ""
      }
      return true
    },
    {
      message: "Estado e cidade são obrigatórios quando CEP é informado",
      path: ["estado"],
    }
  )

export const updatePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Senha atual é obrigatória"),
    newPassword: passwordSchema,
    confirmNewPassword: z.string().min(1, "Confirmação de senha é obrigatória"),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: "As senhas não coincidem",
    path: ["confirmNewPassword"],
  })
  .refine((data) => data.currentPassword !== data.newPassword, {
    message: "Nova senha deve ser diferente da senha atual",
    path: ["newPassword"],
  })

export type LoginInput = z.infer<typeof loginSchema>
export type SignupData = z.infer<typeof signupSchema>
export type UpdatePasswordInput = z.infer<typeof updatePasswordSchema>