"use server";

import { revalidatePath } from "next/cache";
import { put } from "@vercel/blob";
import { verifySession } from "@/lib/dal";
import { prisma } from "@/lib/db";
import { saveSiteContent } from "@/lib/site-content";
import { homeContentSchema, contatoContentSchema } from "@/lib/validators";
import { CATEGORY_COLOR_PRESETS } from "@/lib/category-presets";

const SCHEMAS = { home: homeContentSchema, contato: contatoContentSchema };
const REVALIDATE_PATHS = { home: ["/"], contato: ["/contato"] };

const ALLOWED_IMAGE_TYPES = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"]);
const MAX_IMAGE_BYTES = 5 * 1024 * 1024;

// Upload isolado (fora do save de conteúdo, que trafega JSON): a foto sobe
// pro Blob assim que escolhida, e a URL fica só no estado do formulário até
// "Publicar alterações" gravar o conteúdo inteiro.
export async function uploadGalleryPhotoAction(formData) {
  await verifySession();

  const file = formData.get("photo");
  if (!file || typeof file === "string" || file.size === 0) {
    return { error: "Selecione uma imagem." };
  }
  if (!ALLOWED_IMAGE_TYPES.has(file.type)) {
    return { error: "Formato de imagem inválido. Envie JPEG, PNG, WEBP ou GIF." };
  }
  if (file.size > MAX_IMAGE_BYTES) {
    return { error: "Imagem maior que 5 MB." };
  }

  const blob = await put(`site/galeria/${Date.now()}-${file.name}`, file, {
    access: "public",
    addRandomSuffix: true,
  });
  return { ok: true, url: blob.url };
}

// Visibilidade de categoria é gravada direto na tabela Category (afeta Home,
// Catálogo e rodapé ao mesmo tempo), fora do fluxo de rascunho + "Publicar
// alterações" do conteúdo de Home/Contato — por isso aplica na hora.
export async function toggleCategoryVisibilityAction(categoryId, visible) {
  await verifySession();

  await prisma.category.update({
    where: { id: categoryId },
    data: { visible: Boolean(visible) },
  });

  revalidatePath("/");
  revalidatePath("/catalogo");
  revalidatePath("/admin/site");

  return { ok: true };
}

// Imagem de capa da categoria substitui o gradiente/ícone na grade da Home
// — grava direto na tabela Category, mesmo fluxo "aplica na hora" da
// visibilidade acima (fora do rascunho + "Publicar alterações" do conteúdo).
export async function updateCategoryCoverImageAction(categoryId, formData) {
  await verifySession();

  const file = formData.get("image");
  if (!file || typeof file === "string" || file.size === 0) {
    return { error: "Selecione uma imagem." };
  }
  if (!ALLOWED_IMAGE_TYPES.has(file.type)) {
    return { error: "Formato de imagem inválido. Envie JPEG, PNG, WEBP ou GIF." };
  }
  if (file.size > MAX_IMAGE_BYTES) {
    return { error: "Imagem maior que 5 MB." };
  }

  const blob = await put(`site/categorias/${categoryId}-${Date.now()}-${file.name}`, file, {
    access: "public",
    addRandomSuffix: true,
  });

  await prisma.category.update({
    where: { id: categoryId },
    data: { coverImage: blob.url },
  });

  revalidatePath("/");
  revalidatePath("/catalogo");
  revalidatePath("/admin/site");

  return { ok: true, url: blob.url };
}

function slugify(label) {
  return label
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// Cria uma categoria nova a partir do botão "+ Adicionar categoria" (aba
// Site do /admin). As 14 categorias originais têm identidade desenhada à
// mão em CATEGORY_META; uma categoria criada aqui usa a paleta escolhida
// (CATEGORY_COLOR_PRESETS) direto nas colunas c1/c2/accent/glow da tabela —
// getActiveCategories cai nesses valores quando o id não está em
// CATEGORY_META. Fica oculta da Home/Catálogo até ter produto (mesma regra
// de qualquer categoria vazia).
export async function createCategoryAction(formData) {
  await verifySession();

  const label = String(formData.get("label") || "").trim();
  if (!label) return { error: "Informe o nome da categoria." };

  const preset =
    CATEGORY_COLOR_PRESETS.find((p) => p.id === String(formData.get("preset"))) || CATEGORY_COLOR_PRESETS[0];

  let id = slugify(label);
  if (!id) return { error: "Nome inválido — use letras ou números." };

  const existing = await prisma.category.findUnique({ where: { id } });
  if (existing) id = `${id}-${Date.now().toString(36)}`;

  const category = await prisma.category.create({
    data: {
      id,
      label,
      tagline: "",
      iconKey: "generic-box",
      c1: preset.c1,
      c2: preset.c2,
      accent: preset.accent,
      glow: preset.glow,
      visible: true,
    },
  });

  revalidatePath("/");
  revalidatePath("/catalogo");
  revalidatePath("/admin/site");

  return {
    ok: true,
    category: { id: category.id, label: category.label, visible: category.visible, coverImage: null },
  };
}

export async function saveSiteContentAction(section, payload) {
  await verifySession();

  const schema = SCHEMAS[section];
  if (!schema) return { error: "Seção desconhecida." };

  const result = schema.safeParse(payload);
  if (!result.success) {
    return { error: result.error.issues[0]?.message || "Dados inválidos." };
  }

  await saveSiteContent(section, result.data);
  for (const path of REVALIDATE_PATHS[section]) revalidatePath(path);

  return { ok: true, savedAt: new Date().toISOString() };
}
