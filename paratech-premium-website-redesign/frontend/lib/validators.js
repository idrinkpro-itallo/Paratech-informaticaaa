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

// Validação do conteúdo editável de Home/Contato (painel /admin/site).
const requiredText = z.string().trim().min(1, "Campo obrigatório.");

export const homeContentSchema = z.object({
  hero: z.object({
    variant: z.enum(["produto", "benchmark", "antesDepois", "classico"]),
    classico: z.object({
      theme: z.enum(["claro", "escuro"]),
      kicker: requiredText,
      titleBefore: requiredText,
      titleRed: requiredText,
      titleMiddle: requiredText,
      titleYellow: requiredText,
      titleAfter: z.string().trim(),
      lead: requiredText,
      ctaWhatsMessage: requiredText,
      ctaCatalogLabel: requiredText,
      stats: z
        .array(z.object({ value: requiredText, label: requiredText }))
        .length(3, "São 3 blocos de estatística."),
      slides: z
        .array(z.object({ productId: numberFromForm(z.number()), kicker: requiredText, headline: requiredText }))
        .length(4, "São 4 produtos no card rotativo."),
    }),
    produto: z.object({
      theme: z.enum(["vermelho", "ambar", "gelo", "violeta"]),
      kicker: requiredText,
      titleBefore: requiredText,
      titleStrike: requiredText,
      titleAfter: requiredText,
      lead: requiredText,
      badgeText: z.string().trim(),
      ctaWhatsMessage: requiredText,
      ctaCatalogLabel: requiredText,
      featuredProductId: numberFromForm(z.number()),
      showStats: z.boolean(),
      stats: z
        .array(z.object({ value: requiredText, label: requiredText }))
        .length(3, "São 3 blocos de estatística."),
    }),
    benchmark: z.object({
      theme: z.enum(["ambar", "alerta", "lima", "roxo"]),
      kicker: requiredText,
      title: requiredText,
      lead: requiredText,
      ctaLabel: requiredText,
      ctaWhatsMessage: requiredText,
      metricLabel: requiredText,
      metricValue: numberFromForm(z.number().positive()),
      metricUnit: requiredText,
      compareLabel: requiredText,
      comparePercent: numberFromForm(z.number().min(0).max(100)),
      gainLabel: requiredText,
    }),
    antesDepois: z.object({
      theme: z.enum(["classico", "ambar", "ciano", "magenta"]),
      titleBefore: requiredText,
      titleAfter: requiredText,
      subtitle: z.string().trim(),
      ctaLabel: requiredText,
      ctaWhatsMessage: requiredText,
      featuredProductId: numberFromForm(z.number()),
      beforeLabel: requiredText,
      afterLabel: requiredText,
    }),
  }),
  bannerMessages: z.array(requiredText).min(1, "Adicione ao menos uma mensagem."),
  countersTargets: z.object({
    clientes: numberFromForm(z.number().nonnegative()),
    anos: numberFromForm(z.number().nonnegative()),
    vendidos: numberFromForm(z.number().nonnegative()),
    satisfacao: numberFromForm(z.number().nonnegative()),
  }),
  promoBadge: requiredText,
  promoTitle: requiredText,
  promoText: requiredText,
  promoCtaLabel: requiredText,
  testimonials: z
    .array(
      z.object({
        text: requiredText,
        name: requiredText,
        role: requiredText,
        initial: z.string().trim().min(1).max(3),
      })
    )
    .min(1, "Adicione ao menos um depoimento."),
  visitTitle: requiredText,
  visitSubtitle: requiredText,
  featuredProductIds: z.array(z.number()).min(1, "Selecione ao menos um produto em destaque."),
  features: z
    .array(z.object({ title: requiredText, desc: requiredText }))
    .length(8, "São 8 cards de diferenciais."),
  gallery: z
    .array(z.object({ url: z.string().trim(), caption: requiredText }))
    .min(1, "Adicione ao menos uma foto na galeria."),
  sections: z.object({
    banner: z.boolean(),
    categorias: z.boolean(),
    destaque: z.boolean(),
    diferenciais: z.boolean(),
    contadores: z.boolean(),
    promocao: z.boolean(),
    depoimentos: z.boolean(),
    galeria: z.boolean(),
    visite: z.boolean(),
  }),
});

export const contatoContentSchema = z.object({
  heroEyebrow: requiredText,
  heroTitle: requiredText,
  address: requiredText,
  phone: requiredText,
  phoneHref: requiredText,
  email: z.string().trim().email("E-mail inválido."),
  hours: requiredText,
  mapEmbedUrl: z.string().trim().url("URL do mapa inválida."),
  sections: z.object({
    informacoes: z.boolean(),
  }),
});
