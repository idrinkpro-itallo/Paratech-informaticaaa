import Link from "next/link";
import CategoryIcon from "./icons/CategoryIcon";
import { CATEGORY_META } from "@/lib/products-data";
import styles from "./CategoryMegaMenu.module.css";

export default function CategoryMegaMenu() {
  return (
    <div className={styles.trigger}>
      <Link href="/#categorias" className={styles.triggerLink}>Categorias</Link>
      <div className={styles.panel}>
        {Object.entries(CATEGORY_META).map(([id, meta]) => (
          <Link key={id} href={`/catalogo#${id}`} className={styles.item}>
            <span className={styles.iconWrap} style={{ color: meta.accent }}>
              <CategoryIcon category={id} className={styles.icon} />
            </span>
            {meta.label}
          </Link>
        ))}
      </div>
    </div>
  );
}
