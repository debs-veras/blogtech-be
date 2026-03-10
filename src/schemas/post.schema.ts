import { z } from "zod";

export const registerPostSchema = z.object({
  title: z
    .string()
    .min(1, "Título é obrigatório")
    .max(200, "Título muito longo"),
  description: z.string().max(300, "Descrição muito longa").optional(),
  content: z.string().min(1, "Conteúdo é obrigatório"),
  slug: z
    .string()
    .min(1, "Slug é obrigatório")
    .max(100, "Slug muito longo")
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      "Slug deve conter apenas letras minúsculas, números e hífens",
    ),
  published: z.boolean().optional(),
  categoryId: z.string().uuid("ID de categoria inválido").optional(),
  authorId: z.string().uuid("ID de autor inválido").optional(),
});

export const updatePostSchema = z.object({
  title: z
    .string()
    .min(1, "Título é obrigatório")
    .max(200, "Título muito longo")
    .optional(),
  description: z.string().max(300, "Descrição muito longa").optional(),
  content: z.string().min(1, "Conteúdo é obrigatório").optional(),
  slug: z
    .string()
    .min(1, "Slug é obrigatório")
    .max(100, "Slug muito longo")
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      "Slug deve conter apenas letras minúsculas, números e hífens",
    )
    .optional(),
  published: z.boolean().optional(),
  categoryId: z.string().uuid("ID de categoria inválido").optional(),
});

export type RegisterPostInput = z.infer<typeof registerPostSchema>;
export type UpdatePostInput = z.infer<typeof updatePostSchema>;
