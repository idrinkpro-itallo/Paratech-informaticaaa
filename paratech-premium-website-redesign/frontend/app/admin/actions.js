"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { put } from "@vercel/blob";
import { prisma } from "@/lib/db";
import { verifySession } from "@/lib/dal";
import { productFormSchema } from "@/lib/validators";
import { deleteSession } from "@/lib/session";

const ALLOWED_IMAGE_TYPES = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"]);
const MAX_IMAGE_BYTES = 5 * 1024 * 1024;

function parseFormData(formData) {
  const result = productFormSchema.safeParse({
    name: formData.get("name"),
    description: formData.get("description"),
    categoryId: formData.get("categoryId"),
    stock: formData.get("stock"),
    price: formData.get("price"),
    oldPrice: formData.get("oldPrice"),
    installment: formData.get("installment"),
    tag: formData.get("tag"),
    brand: formData.get("brand"),
  });
  if (!result.success) {
    const message = result.error.issues[0]?.message || "Dados inválidos.";
    throw new Error(message);
  }
  return result.data;
}

async function maybeUploadImage(formData) {
  const file = formData.get("image");
  if (!file || typeof file === "string" || file.size === 0) return undefined;

  if (!ALLOWED_IMAGE_TYPES.has(file.type)) {
    throw new Error("Formato de imagem inválido. Envie JPEG, PNG, WEBP ou GIF.");
  }
  if (file.size > MAX_IMAGE_BYTES) {
    throw new Error("Imagem maior que 5 MB.");
  }

  const blob = await put(`produtos/${Date.now()}-${file.name}`, file, {
    access: "public",
    addRandomSuffix: true,
  });
  return blob.url;
}

function toProductData(parsed) {
  return {
    name: parsed.name,
    description: parsed.description,
    categoryId: parsed.categoryId,
    stock: parsed.stock,
    price: parsed.price,
    oldPrice: parsed.oldPrice ?? null,
    installment: parsed.installment,
    tag: parsed.tag ?? null,
    brand: parsed.brand || "Genérico",
  };
}

function revalidateProductPages() {
  revalidatePath("/admin");
  revalidatePath("/catalogo");
  revalidatePath("/");
}

export async function createProduct(prevState, formData) {
  await verifySession();
  try {
    const parsed = parseFormData(formData);
    const imageUrl = await maybeUploadImage(formData);
    await prisma.product.create({ data: { ...toProductData(parsed), imageUrl } });
  } catch (error) {
    return { error: error.message };
  }
  revalidateProductPages();
  redirect("/admin");
}

export async function updateProduct(id, prevState, formData) {
  await verifySession();
  try {
    const parsed = parseFormData(formData);
    const imageUrl = await maybeUploadImage(formData);
    await prisma.product.update({
      where: { id: Number(id) },
      data: { ...toProductData(parsed), ...(imageUrl ? { imageUrl } : {}) },
    });
  } catch (error) {
    return { error: error.message };
  }
  revalidateProductPages();
  redirect("/admin");
}

export async function deleteProduct(id) {
  await verifySession();
  await prisma.product.delete({ where: { id: Number(id) } });
  revalidateProductPages();
}

export async function logout() {
  await deleteSession();
  redirect("/admin/login");
}
