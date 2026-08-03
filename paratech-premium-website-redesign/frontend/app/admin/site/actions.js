"use server";

import { revalidatePath } from "next/cache";
import { put } from "@vercel/blob";
import { verifySession } from "@/lib/dal";
import { prisma } from "@/lib/db";
import { saveSiteContent } from "@/lib/site-content";
import { homeContentSchema, contatoContentSchema } from "@/lib/validators";

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
