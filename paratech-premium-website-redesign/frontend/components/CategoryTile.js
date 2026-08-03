import Link from "next/link";
import CategoryIcon from "./icons/CategoryIcon";
import styles from "./CategoryTile.module.css";
import { CATEGORY_META } from "@/lib/products-data";

export default function CategoryTile({ category }) {
  // Categorias fora das 14 originais (criadas pelo admin) não têm entrada em
  // CATEGORY_META — nesse caso a própria `category` já carrega c1/c2/accent/
  // glow/tagline (ver getActiveCategories em lib/products.js).
  const meta = CATEGORY_META[category.id] || category;
  const gradient = `linear-gradient(160deg, ${meta.c1}, ${meta.c2})`;

  return (
    <Link href={`/catalogo#${category.id}`} className="pv-card">
      {category.coverImage ? (
        <div
          className={`pv-visual ${styles.visual}`}
          style={{
            backgroundImage: `url(${category.coverImage})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
      ) : (
        <div className={`pv-visual ${styles.visual}`} style={{ background: gradient }}>
          <div className="pv-particles"><span></span><span></span><span></span><span></span><span></span></div>
          <div className="pv-icon-glow" style={{ background: meta.accent, boxShadow: `0 0 60px 26px ${meta.glow}` }} />
          <div className="pv-icon-wrap" style={{ color: meta.accent }}>
            <CategoryIcon category={category.id} />
          </div>
        </div>
      )}
      <div className={styles.body}>
        <div className={styles.title}>{category.label}</div>
        <div className={styles.desc}>{meta.tagline}</div>
      </div>
    </Link>
  );
}
