import { notFound } from "next/navigation";
import { verifySession } from "@/lib/dal";
import { getProductById } from "@/lib/products";
import ProductForm from "@/components/admin/ProductForm";
import { updateProduct } from "../../actions";
import styles from "../../Admin.module.css";

export const metadata = { title: "Editar produto | Admin" };

export default async function EditarProdutoPage({ params }) {
  await verifySession();
  const { id } = await params;
  const product = await getProductById(id);
  if (!product) notFound();

  const updateWithId = updateProduct.bind(null, product.id);

  return (
    <main className={styles.wrap}>
      <header className={styles.header}>
        <div className={styles.logo}>Editar produto</div>
      </header>
      <ProductForm action={updateWithId} product={product} submitLabel="Salvar alterações" />
    </main>
  );
}
