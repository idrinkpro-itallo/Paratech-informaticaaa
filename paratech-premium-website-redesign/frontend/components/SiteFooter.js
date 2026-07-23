import Image from "next/image";
import Link from "next/link";
import styles from "./SiteFooter.module.css";
import { WA_SUPPORT } from "@/lib/products-data";

const LEGAL_LINE = "© 2026 ARJ Informática e Acessórios LTDA — CNPJ 27.379.480/0001-08";

export function SiteFooterSimple({ links }) {
  return (
    <footer className={styles.footer}>
      <div className={styles.simpleTop}>
        <div className={styles.brandRow}>
          <Image src="/images/logo.jpg" alt="Paratech" width={38} height={38} className={styles.logoImg} />
          <span className={styles.brandName}>PARATECH</span>
        </div>
        <nav className={styles.simpleLinks} aria-label="Links do rodapé">
          {links.map((l) => (
            <Link key={l.href} href={l.href}>{l.label}</Link>
          ))}
        </nav>
      </div>
      <div className={styles.bottomBar}>{LEGAL_LINE}</div>
    </footer>
  );
}

export function SiteFooterFull({ categories = [] }) {
  const quickCategories = categories.slice(0, 4);
  return (
    <footer className={`${styles.footer} ${styles.footerFull}`}>
      <div className={styles.fullGrid}>
        <div>
          <div className={styles.fullBrandRow}>
            <Image src="/images/logo.jpg" alt="Paratech" width={44} height={44} className={styles.fullLogoImg} />
            <span className={styles.fullBrandName}>PARATECH</span>
          </div>
          <p className={styles.about}>
            Informática e acessórios com atendimento especializado em Pará de Minas/MG.
          </p>
          <div className={styles.social}>
            <a href="#" className={styles.socialLink} aria-label="Instagram da Paratech">ig</a>
            <a href="#" className={styles.socialLink} aria-label="Facebook da Paratech">fb</a>
            <a
              href={`https://wa.me/${WA_SUPPORT}`}
              target="_blank"
              rel="noopener noreferrer"
              className={`${styles.socialLink} ${styles.whatsapp}`}
              aria-label="WhatsApp da Paratech"
            >
              wa
            </a>
          </div>
        </div>

        <div>
          <div className={styles.colTitle}>CATEGORIAS</div>
          <nav className={styles.colLinks} aria-label="Categorias">
            {quickCategories.map((c) => (
              <Link key={c.id} href={`/catalogo#${c.id}`}>{c.label}</Link>
            ))}
          </nav>
        </div>

        <div>
          <div className={styles.colTitle}>LINKS RÁPIDOS</div>
          <nav className={styles.colLinks} aria-label="Links rápidos">
            <Link href="/">Início</Link>
            <Link href="/catalogo">Catálogo</Link>
            <Link href="/#promocoes">Promoções</Link>
            <Link href="/contato">Contato</Link>
          </nav>
        </div>

        <div>
          <div className={styles.colTitle}>CONTATO</div>
          <div className={styles.contactCol}>
            <div>R. Nova Serrana, 31, Loja<br />N. Sra. de Lourdes, Pará de Minas/MG</div>
            <a href="tel:+553732372355">(37) 3237-2355</a>
            <a href="mailto:arjtech@hotmail.com">arjtech@hotmail.com</a>
            <div>Seg–Sáb: 8h às 18h</div>
          </div>
        </div>
      </div>
      <div className={styles.fullBottom}>
        <div>{LEGAL_LINE.replace("ARJ Informática e Acessórios LTDA", "ARJ Informática e Acessórios LTDA — Paratech Informática e Acessórios")}</div>
        <div>Todos os direitos reservados.</div>
      </div>
    </footer>
  );
}
