import Link from "next/link";
import Image from "next/image";
import { verifySession } from "@/lib/dal";
import { getAllProducts } from "@/lib/products";
import { CATEGORY_META, formatPrice } from "@/lib/products-data";
import { logout } from "./actions";
import DeleteButton from "@/components/admin/DeleteButton";
import AdminNav from "@/components/admin/AdminNav";
import styles from "./Admin.module.css";

export const metadata = { title: "Admin" };

export default async function AdminPage() {
  await verifySession();
  const products = await getAllProducts();

  return (
    <main className={styles.wrap}>
      <header className={styles.header}>
        <div className={styles.logo}>
          Para<span style={{ color: "#FFD400" }}>tech</span> <span className={styles.headerLabel}>admin</span>
        </div>
        <div className={styles.headerActions}>
          <Link href="/admin/produtos/novo" className={styles.newBtn}>+ Novo produto</Link>
          <form action={logout}>
            <button type="submit" className={styles.logoutBtn}>Sair</button>
          </form>
        </div>
      </header>

      <AdminNav active="produtos" />

      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th></th>
              <th>Nome</th>
              <th>Categoria</th>
              <th>Preço</th>
              <th>Estoque</th>
              <th>Tag</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id}>
                <td>
                  {p.imageUrl ? (
                    <Image src={p.imageUrl} alt={p.name} width={40} height={40} style={{ objectFit: "cover", borderRadius: 8 }} />
                  ) : (
                    <div className={styles.thumbFallback} style={{ background: CATEGORY_META[p.category]?.accent }} />
                  )}
                </td>
                <td>{p.name}</td>
                <td>{CATEGORY_META[p.category]?.label ?? p.category}</td>
                <td>{formatPrice(p.price)}</td>
                <td>{p.stock}</td>
                <td>{p.tag ?? "—"}</td>
                <td className={styles.rowActions}>
                  <Link href={`/admin/produtos/${p.id}`} className={styles.editLink}>Editar</Link>
                  <DeleteButton productId={p.id} productName={p.name} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {products.length === 0 && <p className={styles.empty}>Nenhum produto cadastrado ainda.</p>}
      </div>
    </main>
  );
}
