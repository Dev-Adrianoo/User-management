import { z } from "zod"


const emailSchema = z
  .string()
  .min(1, "Email é obrigatório")
  .email("Email inválido")
  .toLowerCase()
  .trim()


const cepSchema = z
  .string()
  .regex(/^\d{5}-?\d{3}$/, "CEP inválido (formato: 00000-000)")
  .transform((val) => val.replace(/\D/g, ""))
  .optional()

export const updateUserSchema = z.object({
  name: z
    .string()
    .min(3, "Nome deve ter no mínimo 3 caracteres")
    .max(100, "Nome deve ter no máximo 100 caracteres")
    .trim()
    .optional(),
  email: emailSchema.optional(),
  cep: cepSchema,
  estado: z
    .string()
    .length(2, "Estado deve ter 2 caracteres (UF)")
    .toUpperCase()
    .optional(),
  cidade: z
    .string()
    .min(2, "Cidade deve ter no mínimo 2 caracteres")
    .max(100, "Cidade deve ter no máximo 100 caracteres")
    .optional(),
})


export const userIdSchema = z.object({
  id: z.string().uuid("ID de usuário inválido"),
})


export const userListQuerySchema = z.object({
  page: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val, 10) : 1))
    .pipe(z.number().min(1, "Página deve ser maior que 0")),
  limit: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val, 10) : 10))
    .pipe(z.number().min(1).max(100, "Limite máximo é 100")),
  search: z.string().optional(),
  sortBy: z.enum(["name", "email", "createdAt"]).optional(),
  order: z.enum(["asc", "desc"]).optional(),
})


export type UpdateUserInput = z.infer<typeof updateUserSchema>
export type UserIdInput = z.infer<typeof userIdSchema>
export type UserListQueryInput = z.infer<typeof userListQuerySchema>