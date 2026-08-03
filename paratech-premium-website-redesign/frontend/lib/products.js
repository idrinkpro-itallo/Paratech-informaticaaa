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

// Categorias com pelo menos um produto e não ocultadas pelo admin, na ordem
// declarada em CATEGORY_META — mesma regra que o CATEGORIES derivado antigo
// seguia (chips do Catálogo, grade da Home e links do rodapé usam isso).
export async function getActiveCategories() {
  const categories = await prisma.category.findMany({
    where: { visible: true, products: { some: {} } },
    select: { id: true, coverImage: true },
  });
  const byId = new Map(categories.map((c) => [c.id, c.coverImage]));
  return Object.keys(CATEGORY_META)
    .filter((id) => byId.has(id))
    .map((id) => ({ id, label: CATEGORY_META[id].label, coverImage: byId.get(id) }));
}

// Todas as categorias com produtos (visíveis ou não), pra tela de admin
// decidir o que mostrar/ocultar no site — mesma ordem de CATEGORY_META.
export async function getAllCategoriesForAdmin() {
  const categories = await prisma.category.findMany({
    where: { products: { some: {} } },
    select: { id: true, visible: true, coverImage: true },
  });
  const byId = new Map(categories.map((c) => [c.id, c]));
  return Object.keys(CATEGORY_META)
    .filter((id) => byId.has(id))
    .map((id) => ({
      id,
      label: CATEGORY_META[id].label,
      visible: byId.get(id).visible,
      coverImage: byId.get(id).coverImage,
    }));
}
