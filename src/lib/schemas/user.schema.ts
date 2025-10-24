import { z } from 'zod';

export const updateUserSchema = z.object({
  nome: z
    .string()
    .min(3, "O nome deve ter no mínimo 3 caracteres")
    .max(100, "O nome deve ter no máximo 100 caracteres")
    .trim()
    .optional(),
  email: z
    .string()
    .email("Email inválido")
    .toLowerCase()
    .trim()
    .optional(),
});

export type UpdateUserInput = z.infer<typeof updateUserSchema>;
