import { z } from "zod";

// Schema de registro/criação de usuário
export const registerSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "Senha deve ter pelo menos 6 caracteres"),
  role: z.enum(["ADMIN", "AUTHOR"]).optional(),
});

// Schema de login
export const loginSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(1, "Senha é obrigatória"),
});

// Schema de atualização de usuário (sem senha)
export const updateUserSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório").optional(),
  email: z.string().email("Email inválido").optional(),
  role: z.enum(["ADMIN", "AUTHOR"]).optional(),
});

// Schema de filtros de usuário
export const userFilterSchema = z.object({
  name: z.string().optional(),
  email: z.string().optional(),
  role: z.enum(["ADMIN", "AUTHOR"]).optional(),
});

// Tipos inferidos automaticamente dos schemas
export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;
export type UserFilterInput = z.infer<typeof userFilterSchema>;
