// Popula a base a partir da fonte de verdade dos protótipos.
// Importa PRODUCTS, CATEGORY_META e STOCK_META de project/products-data.js
// (mesmo array que o Catálogo consome hoje) e faz upsert idempotente.
import { PrismaClient } from "@prisma/client";
import {
  PRODUCTS,
  CATEGORY_META,
  STOCK_META,
} from "../../project/products-data.js";

const prisma = new PrismaClient();

async function main() {
  // Categorias (14) — id = slug
  for (const [id, meta] of Object.entries(CATEGORY_META)) {
    await prisma.category.upsert({
      where: { id },
      update: { label: meta.label, c1: meta.c1, c2: meta.c2, accent: meta.accent, glow: meta.glow },
      create: { id, label: meta.label, c1: meta.c1, c2: meta.c2, accent: meta.accent, glow: meta.glow },
    });
  }
  console.log(`Categorias: ${Object.keys(CATEGORY_META).length}`);

  // Estados de estoque (3)
  for (const [key, meta] of Object.entries(STOCK_META)) {
    await prisma.stockStatus.upsert({
      where: { key },
      update: { label: meta.label, color: meta.color },
      create: { key, label: meta.label, color: meta.color },
    });
  }
  console.log(`Estados de estoque: ${Object.keys(STOCK_META).length}`);

  // Produtos (16) — preserva o id do protótipo
  for (const p of PRODUCTS) {
    const data = {
      name: p.name,
      description: p.description,
      price: p.price,
      oldPrice: p.oldPrice ?? null,
      installment: p.installment,
      tag: p.tag ?? null,
      brand: p.brand ?? "Genérico",
      categoryId: p.category,
      stock: p.stock,
    };
    await prisma.product.upsert({
      where: { id: p.id },
      update: data,
      create: { id: p.id, ...data },
    });
  }
  console.log(`Produtos: ${PRODUCTS.length}`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
    console.log("Seed concluído.");
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
