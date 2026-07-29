"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import styles from "./SiteHeader.module.css";
import { WA_SUPPORT } from "@/lib/products-data";
import CategoryMegaMenu from "./CategoryMegaMenu";

const NAV_LINKS = [
  { key: "home", href: "/", label: "Início" },
  { key: "categorias", href: "/#categorias", label: "Categorias" },
  { key: "catalogo", href: "/catalogo", label: "Catálogo" },
  { key: "promocoes", href: "/#promocoes", label: "Promoções" },
  { key: "contato", href: "/contato", label: "Contato" },
];

export default function SiteHeader({ active = null }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const headerStyle = {
    background: scrolled ? "rgba(11,13,16,0.78)" : "transparent",
    backdropFilter: scrolled ? "blur(16px)" : "none",
    borderBottom: scrolled ? "1px solid rgba(255,255,255,0.08)" : "none",
  };

  return (
    <header className={styles.header} style={headerStyle}>
      <Link href="/" className={styles.logo}>
        <Image src="/images/logo.jpg" alt="Paratech" width={46} height={46} className={styles.logoImg} priority />
        <span className={styles.brand}>PARATECH<span className={styles.dot}>.</span></span>
      </Link>

      <nav className={styles.nav} aria-label="Navegação principal">
        {NAV_LINKS.map((link) =>
          link.key === "categorias" ? (
            <CategoryMegaMenu key={link.key} />
          ) : (
            <Link
              key={link.key}
              href={link.href}
              className={link.key === active ? styles.navLinkActive : styles.navLink}
            >
              {link.label}
            </Link>
          )
        )}
      </nav>

      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <a
          href={`https://wa.me/${WA_SUPPORT}`}
          target="_blank"
          rel="noopener noreferrer"
          className={styles.cta}
        >
          Falar no WhatsApp
        </a>
        <button
          type="button"
          className={styles.menuButton}
          aria-label={menuOpen ? "Fechar menu" : "Abrir menu"}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((v) => !v)}
        >
          {menuOpen ? "✕" : "☰"}
        </button>
      </div>

      {menuOpen && (
        <nav className={styles.mobileNav} aria-label="Navegação mobile">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.key}
              href={link.href}
              className={link.key === active ? styles.mobileNavLinkActive : styles.mobileNavLink}
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
