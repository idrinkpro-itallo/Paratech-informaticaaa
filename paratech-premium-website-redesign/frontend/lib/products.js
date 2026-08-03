// Camada de dados do site — lê produtos e categorias ativas do Postgres.
// Devolve o mesmo formato de objeto que o antigo array estático PRODUCTS
// tinha ({ id, name, category, ... }), pra não precisar reescrever
// ProductCard/CatalogClient.
import "server-only";
import { prisma } from "./db";
import { CATEGORY_META } from "./products-data";

function serialize(p) {
  return {
    id: p.id,
    name: p.name,
    category: p.categoryId,
    description: p.description,
    stock: p.stock,
    price: p.price,
    oldPrice: p.oldPrice,
    installment: p.installment,
    tag: p.tag,
    brand: p.brand,
    imageUrl: p.imageUrl,
  };
}

export async function getAllProducts() {
  const products = await prisma.product.findMany({ orderBy: { id: "asc" } });
  return products.map(serialize);
}

export async function getProductById(id) {
  const product = await prisma.product.findUnique({ where: { id: Number(id) } });
  return product ? serialize(product) : null;
}

// Ordem de exibição: primeiro as 14 categorias originais (ordem declarada em
// CATEGORY_META), depois qualquer categoria criada pelo admin que não esteja
// lá (ver lib/category-presets.js) — essas usam suas próprias colunas
// c1/c2/accent/glow/tagline em vez de CATEGORY_META.
function orderCategoryIds(ids) {
  const set = new Set(ids);
  const known = Object.keys(CATEGORY_META).filter((id) => set.has(id));
  const custom = ids.filter((id) => !CATEGORY_META[id]);
  return [...known, ...custom];
}

// Categorias com pelo menos um produto e não ocultadas pelo admin — chips do
// Catálogo, grade da Home e links do rodapé usam isso.
export async function getActiveCategories() {
  const categories = await prisma.category.findMany({
    where: { visible: true, products: { some: {} } },
    select: { id: true, label: true, tagline: true, c1: true, c2: true, accent: true, glow: true, coverImage: true },
  });
  const byId = new Map(categories.map((c) => [c.id, c]));
  return orderCategoryIds([...byId.keys()]).map((id) => {
    const row = byId.get(id);
    const meta = CATEGORY_META[id];
    return {
      id,
      label: meta?.label || row.label,
      tagline: meta?.tagline || row.tagline,
      c1: meta?.c1 || row.c1,
      c2: meta?.c2 || row.c2,
      accent: meta?.accent || row.accent,
      glow: meta?.glow || row.glow,
      coverImage: row.coverImage,
    };
  });
}

// Todas as categorias cadastradas (com ou sem produto, visíveis ou não), pra
// tela de admin decidir o que mostrar/ocultar e permitir criar categorias
// antes mesmo de cadastrar produtos nelas.
export async function getAllCategoriesForAdmin() {
  const categories = await prisma.category.findMany({
    select: { id: true, label: true, visible: true, coverImage: true },
  });
  const byId = new Map(categories.map((c) => [c.id, c]));
  return orderCategoryIds([...byId.keys()]).map((id) => {
    const row = byId.get(id);
    return {
      id,
      label: CATEGORY_META[id]?.label || row.label,
      visible: row.visible,
      coverImage: row.coverImage,
    };
  });
}
