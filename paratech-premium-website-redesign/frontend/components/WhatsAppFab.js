import Link from "next/link";
import styles from "./WhatsAppFab.module.css";
import { WA_SUPPORT } from "@/lib/products-data";

function WhatsAppGlyph() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="#fff" aria-hidden="true">
      <path d="M12.02 2c-5.5 0-9.97 4.46-9.97 9.96 0 1.76.46 3.45 1.33 4.95L2 22l5.25-1.38a9.96 9.96 0 0 0 4.77 1.21h.01c5.5 0 9.97-4.46 9.97-9.96C21.99 6.46 17.52 2 12.02 2Zm0 18.2h-.01a8.2 8.2 0 0 1-4.2-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.18 8.18 0 0 1-1.26-4.38c0-4.53 3.7-8.22 8.26-8.22 2.2 0 4.27.86 5.83 2.41a8.16 8.16 0 0 1 2.42 5.82c0 4.53-3.7 8.23-8.25 8.23Zm4.52-6.16c-.25-.12-1.47-.72-1.7-.8-.23-.09-.4-.12-.56.12-.17.25-.65.8-.79.96-.15.17-.29.19-.54.06-.25-.12-1.04-.38-1.98-1.22-.73-.65-1.23-1.45-1.37-1.7-.15-.24-.02-.37.11-.5.11-.11.25-.29.37-.43.12-.15.16-.25.24-.41.08-.17.04-.31-.02-.44-.06-.12-.56-1.35-.77-1.85-.2-.48-.41-.42-.56-.42h-.48c-.17 0-.44.06-.67.31-.23.25-.87.85-.87 2.08 0 1.22.89 2.41 1.02 2.57.12.17 1.75 2.67 4.24 3.74.59.26 1.05.41 1.41.52.59.19 1.13.16 1.56.1.48-.07 1.47-.6 1.68-1.19.21-.58.21-1.08.15-1.19-.06-.1-.23-.17-.48-.29Z" />
    </svg>
  );
}

export default function WhatsAppFab({ showCatalogLink = false }) {
  return (
    <div className={styles.wrap}>
      {showCatalogLink && (
        <Link href="/catalogo" className={styles.catalogPill}>
          <span className={styles.catalogDot} />
          Catálogo
        </Link>
      )}
      <a
        href={`https://wa.me/${WA_SUPPORT}`}
        target="_blank"
        rel="noopener noreferrer"
        className={styles.fab}
        aria-label="Falar com um especialista no WhatsApp"
        title="Fale com um Especialista"
      >
        <WhatsAppGlyph />
      </a>
    </div>
  );
}
