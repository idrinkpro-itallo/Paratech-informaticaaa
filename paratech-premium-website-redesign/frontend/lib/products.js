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

// Categorias com pelo menos um produto, na ordem declarada em CATEGORY_META
// — mesma regra que o CATEGORIES derivado antigo seguia (chips do Catálogo,
// grade da Home e links do rodapé usam isso).
export async function getActiveCategories() {
  const categories = await prisma.category.findMany({
    where: { products: { some: {} } },
    select: { id: true },
  });
  const activeIds = new Set(categories.map((c) => c.id));
  return Object.keys(CATEGORY_META)
    .filter((id) => activeIds.has(id))
    .map((id) => ({ id, label: CATEGORY_META[id].label }));
}
