import CatalogClient from "@/components/catalogo/CatalogClient";
import { getActiveCategories, getAllProducts } from "@/lib/products";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Catálogo",
  description:
    "Notebooks, computadores, periféricos, impressoras, redes e acessórios. Filtre por categoria e preço e peça pelo WhatsApp.",
};

export default async function CatalogoPage() {
  const [categories, products] = await Promise.all([getActiveCategories(), getAllProducts()]);
  return <CatalogClient categories={categories} products={products} />;
}
