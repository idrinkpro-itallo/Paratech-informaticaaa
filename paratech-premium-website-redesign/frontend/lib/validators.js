// Validação (zod) dos dados de produto vindos do formulário do admin.
import { z } from "zod";

const TAGS = ["Novo", "Promoção", "Mais vendido"];

const numberFromForm = (schema) =>
  z.preprocess((v) => (v === "" || v === null || v === undefined ? undefined : Number(v)), schema);

export const productFormSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório."),
  description: z.string().min(1, "Descrição é obrigatória."),
  categoryId: z.string().min(1, "Categoria é obrigatória."),
  stock: z.string().min(1, "Estoque é obrigatório."),
  price: numberFromForm(z.number().nonnegative("Preço deve ser >= 0.")),
  oldPrice: numberFromForm(z.number().nonnegative().nullable().optional()),
  installment: z.string().min(1, "Parcelamento é obrigatório."),
  tag: z.preprocess((v) => (v === "" ? null : v), z.enum(TAGS).nullable().optional()),
  brand: z.string().optional(),
});
