import { verifySession } from "@/lib/dal";
import ProductForm from "@/components/admin/ProductForm";
import AdminNav from "@/components/admin/AdminNav";
import { createProduct } from "../../actions";
import styles from "../../Admin.module.css";

export const metadata = { title: "Novo produto | Admin" };

export default async function NovoProdutoPage() {
  await verifySession();

  return (
    <main className={styles.wrap}>
      <header className={styles.header}>
        <div className={styles.logo}>Novo produto</div>
      </header>
      <AdminNav active="produtos" />
      <ProductForm action={createProduct} submitLabel="Cadastrar produto" />
    </main>
  );
}
