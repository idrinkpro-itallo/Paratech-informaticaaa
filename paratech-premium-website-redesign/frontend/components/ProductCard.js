import Image from "next/image";
import CategoryIcon from "./icons/CategoryIcon";
import { CATEGORY_META, STOCK_META, WA_SALES, waLink, tagStyle } from "@/lib/products-data";

export default function ProductCard({ product, showFavorite = false, isFavorite = false, onToggleFavorite }) {
  const meta = CATEGORY_META[product.category];
  const stock = STOCK_META[product.stock];
  const tag = tagStyle(product.tag);
  const gradient = `linear-gradient(160deg, ${meta.c1}, ${meta.c2})`;

  return (
    <div className="pv-card">
      <div className="pv-visual" style={{ background: gradient }}>
        <div className="pv-particles"><span></span><span></span><span></span><span></span><span></span></div>
        <div className="pv-cat-pill">{meta.label}</div>
        {tag && (
          <div className="pv-tag" style={{ background: tag.bg, color: tag.color }}>{product.tag}</div>
        )}
        {showFavorite && (
          <button
            type="button"
            onClick={onToggleFavorite}
            className="pv-fav"
            style={{ color: isFavorite ? "#E30613" : "#c7c9cc" }}
            aria-label={isFavorite ? `Remover ${product.name} dos favoritos` : `Adicionar ${product.name} aos favoritos`}
            aria-pressed={isFavorite}
          >
            ♥
          </button>
        )}
        {product.imageUrl ? (
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 50vw, 280px"
            style={{ objectFit: "cover", zIndex: 1 }}
          />
        ) : (
          <>
            <div className="pv-icon-glow" style={{ background: meta.accent, boxShadow: `0 0 60px 26px ${meta.glow}` }} />
            <div className="pv-icon-wrap" style={{ color: meta.accent }}>
              <CategoryIcon category={product.category} />
            </div>
          </>
        )}
      </div>
      <div className="pv-body">
        <div className="pv-name">{product.name}</div>
        <div className="pv-desc">{product.description}</div>
        <div className="pv-stock">
          <span className="pv-stock-dot" style={{ color: stock.color, background: stock.color }} />
          {stock.label}
        </div>
        <div className="pv-code">Código: PT-{String(product.id).padStart(4, "0")}</div>
        <div className="pv-price-cta">Preço sob consulta</div>
        <div className="pv-actions">
          <a
            href={waLink(WA_SALES, `Quero um orçamento para: ${product.name}`)}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-quote"
          >
            Solicitar Orçamento
          </a>
          <a
            href={waLink(WA_SALES, `Olá! Tenho uma dúvida sobre: ${product.name}`)}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-whatsapp"
          >
            Falar no WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
}
