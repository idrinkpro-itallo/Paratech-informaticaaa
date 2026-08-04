import Link from "next/link";
import Image from "next/image";
import CategoryIcon from "./icons/CategoryIcon";
import styles from "./CategoryTile.module.css";
import { CATEGORY_META } from "@/lib/products-data";

// Sistema de fundo "premium mesh" para a área visual dos cards de categoria —
// 5 variações fixas (não geradas em runtime), giram pelo índice do card na
// grade. Cada variação é uma família de cor já presente na identidade visual
// da Paratech (azul, violeta, vermelho, amarelo, verde), então qualquer PNG
// sem fundo que for subida depois flutua sobre um glow que nunca destoa da
// marca. Ver CATEGORY_META em lib/products-data.js para o sistema antigo
// (um gradiente por categoria) — este é deliberadamente mais enxuto.
const CATEGORY_BG_PALETTE = [
  { name: "artico", from: "#0d2338", to: "#060f1a", glowA: "rgba(77,163,255,.40)", glowB: "rgba(56,189,248,.22)", accent: "#4da3ff" },
  { name: "ametista", from: "#211235", to: "#0e0819", glowA: "rgba(163,116,255,.38)", glowB: "rgba(192,132,252,.20)", accent: "#a374ff" },
  { name: "rubi", from: "#31101f", to: "#160810", glowA: "rgba(255,77,126,.36)", glowB: "rgba(227,6,19,.24)", accent: "#ff4d7e" },
  { name: "ambar", from: "#2c1d09", to: "#160f04", glowA: "rgba(255,180,40,.38)", glowB: "rgba(255,212,0,.18)", accent: "#ffb020" },
  { name: "esmeralda", from: "#0c2a22", to: "#06140f", glowA: "rgba(45,212,191,.34)", glowB: "rgba(74,222,128,.20)", accent: "#34d399" },
];

function paletteFor(index) {
  return CATEGORY_BG_PALETTE[((index % CATEGORY_BG_PALETTE.length) + CATEGORY_BG_PALETTE.length) % CATEGORY_BG_PALETTE.length];
}

export default function CategoryTile({ category, index = 0 }) {
  // Categorias fora das 14 originais (criadas pelo admin) não têm entrada em
  // CATEGORY_META — nesse caso a própria `category` já carrega tagline (ver
  // getActiveCategories em lib/products.js). O fundo, porém, sempre vem da
  // paleta fixa acima — não do meta por-categoria.
  const meta = CATEGORY_META[category.id] || category;
  const bg = paletteFor(index);
  const bgVars = {
    "--bg-from": bg.from,
    "--bg-to": bg.to,
    "--glow-a": bg.glowA,
    "--glow-b": bg.glowB,
  };

  return (
    <Link href={`/catalogo#${category.id}`} className="pv-card">
      <div className={styles.visual} style={bgVars}>
        <span className={styles.sheen} />
        {category.coverImage ? (
          <div className={styles.photoStage}>
            <Image
              src={category.coverImage}
              alt={category.label}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 960px) 50vw, 25vw"
              className={styles.photo}
              style={{ objectFit: "contain" }}
            />
          </div>
        ) : (
          <div className={styles.iconStage}>
            <div className="pv-particles"><span></span><span></span><span></span><span></span><span></span></div>
            <div className="pv-icon-glow" style={{ background: bg.accent, boxShadow: `0 0 60px 26px ${bg.glowA}` }} />
            <div className="pv-icon-wrap" style={{ color: bg.accent }}>
              <CategoryIcon category={category.id} />
            </div>
          </div>
        )}
      </div>
      <div className={styles.body}>
        <div className={styles.title}>{category.label}</div>
        <div className={styles.desc}>{meta.tagline}</div>
      </div>
    </Link>
  );
}
