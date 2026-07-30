import { verifySession } from "@/lib/dal";
import { getSiteContent } from "@/lib/site-content";
import { logout } from "@/app/admin/actions";
import AdminNav from "@/components/admin/AdminNav";
import SiteEditor from "@/components/admin/SiteEditor";
import styles from "@/app/admin/Admin.module.css";

export const metadata = { title: "Site | Admin" };

export default async function AdminSitePage() {
  await verifySession();
  const [home, contato] = await Promise.all([
    getSiteContent("home"),
    getSiteContent("contato"),
  ]);

  return (
    <main className={styles.wrap}>
      <header className={styles.header}>
        <div className={styles.logo}>
          Para<span style={{ color: "#FFD400" }}>tech</span> <span className={styles.headerLabel}>admin</span>
        </div>
        <div className={styles.headerActions}>
          <form action={logout}>
            <button type="submit" className={styles.logoutBtn}>Sair</button>
          </form>
        </div>
      </header>

      <AdminNav active="site" />

      <SiteEditor initialHome={home} initialContato={contato} />
    </main>
  );
}
