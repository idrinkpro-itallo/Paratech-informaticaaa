import CatalogClient from "@/components/catalogo/CatalogClient";

export const metadata = {
  title: "Catálogo",
  description:
    "Notebooks, computadores, periféricos, impressoras, redes e acessórios. Filtre por categoria e preço e peça pelo WhatsApp.",
};

export default function CatalogoPage() {
  return <CatalogClient />;
}
