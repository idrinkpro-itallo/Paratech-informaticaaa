// Schemas de validação (zod) para entradas da API.
import { z } from "zod";

const TAGS = ["Novo", "Promoção", "Mais vendido"];

export const productCreateSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório."),
  description: z.string().min(1, "Descrição é obrigatória."),
  categoryId: z.string().min(1, "Categoria é obrigatória."),
  stock: z.string().min(1, "Estoque é obrigatório."),
  price: z.number().nonnegative("Preço deve ser >= 0."),
  oldPrice: z.number().nonnegative().nullable().optional(),
  installment: z.string().min(1, "Parcelamento é obrigatório."),
  tag: z.enum(TAGS).nullable().optional(),
  brand: z.string().optional(),
});

// Update: todos os campos opcionais, mas ao menos um deve vir.
export const productUpdateSchema = productCreateSchema.partial().refine(
  (obj) => Object.keys(obj).length > 0,
  { message: "Informe ao menos um campo para atualizar." }
);

export const categoryCreateSchema = z.object({
  id: z.string().min(1, "Slug (id) é obrigatório.").regex(/^[a-z0-9-]+$/, "Use apenas minúsculas, números e hífens."),
  label: z.string().min(1, "Label é obrigatório."),
  c1: z.string().min(1),
  c2: z.string().min(1),
  accent: z.string().min(1),
  glow: z.string().min(1),
});

export const categoryUpdateSchema = categoryCreateSchema.omit({ id: true }).partial().refine(
  (obj) => Object.keys(obj).length > 0,
  { message: "Informe ao menos um campo para atualizar." }
);

export const leadCreateSchema = z.object({
  nome: z.string().min(1, "Nome é obrigatório."),
  telefone: z.string().min(1, "Telefone é obrigatório."),
  assunto: z.string().optional(),
  mensagem: z.string().optional(),
  source: z.enum(["contato", "orcamento"]).default("contato"),
  productId: z.number().int().positive().nullable().optional(),
});
