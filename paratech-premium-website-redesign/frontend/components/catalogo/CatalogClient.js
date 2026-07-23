"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import styles from "./Catalog.module.css";
import SiteHeader from "@/components/SiteHeader";
import { SiteFooterSimple } from "@/components/SiteFooter";
import WhatsAppFab from "@/components/WhatsAppFab";
import ProductCard from "@/components/ProductCard";
import { CATEGORIES, PRODUCTS, WA_SALES, waLink } from "@/lib/products-data";

export default function CatalogClient() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [maxPrice, setMaxPrice] = useState(3500);
  const [sortKey, setSortKey] = useState("relevancia");
  const [favorites, setFavorites] = useState({});

  useEffect(() => {
    const hash = (window.location.hash || "").replace("#", "");
    if (CATEGORIES.some((c) => c.id === hash)) {
      setActiveCategory(hash);
    }
  }, []);

  const filteredProducts = useMemo(() => {
    let list = PRODUCTS.filter(
      (p) =>
        (activeCategory === "all" || p.category === activeCategory) &&
        p.price <= maxPrice &&
        p.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    if (sortKey === "preco-asc") list = [...list].sort((a, b) => a.price - b.price);
    if (sortKey === "preco-desc") list = [...list].sort((a, b) => b.price - a.price);
    if (sortKey === "nome") list = [...list].sort((a, b) => a.name.localeCompare(b.name));
    return list;
  }, [activeCategory, maxPrice, searchQuery, sortKey]);

  const noResults = filteredProducts.length === 0;
  const resultsLabel = `${filteredProducts.length} produto${filteredProducts.length === 1 ? "" : "s"} encontrado${filteredProducts.length === 1 ? "" : "s"}`;

  const chips = [{ id: "all", label: "Todas" }, ...CATEGORIES];

  return (
    <>
      <SiteHeader active="catalogo" />

      <section className={styles.hero}>
        <div className={styles.heroInner}>
          <div className={styles.eyebrow}>CATÁLOGO PARATECH</div>
          <h1 className={styles.title}>Tudo o que você precisa em um só lugar</h1>

          <div className={styles.filtersRow}>
            <label htmlFor="catalog-search" className={styles.visuallyHidden}>Buscar produto por nome</label>
            <input
              id="catalog-search"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar produto por nome..."
              className={styles.searchInput}
            />
            <label htmlFor="catalog-sort" className={styles.visuallyHidden}>Ordenar por</label>
            <select
              id="catalog-sort"
              value={sortKey}
              onChange={(e) => setSortKey(e.target.value)}
              className={styles.sortSelect}
            >
              <option value="relevancia">Relevância</option>
              <option value="preco-asc">Menor preço</option>
              <option value="preco-desc">Maior preço</option>
              <option value="nome">Nome A-Z</option>
            </select>
          </div>

          <div className={styles.chipsRow} role="group" aria-label="Filtrar por categoria">
            {chips.map((chip) => {
              const active = activeCategory === chip.id;
              return (
                <button
                  key={chip.id}
                  type="button"
                  onClick={() => setActiveCategory(chip.id)}
                  aria-pressed={active}
                  className={styles.chip}
                  style={{
                    background: active ? "#E30613" : "rgba(255,255,255,.08)",
                    color: active ? "#fff" : "rgba(255,255,255,.75)",
                    border: `1px solid ${active ? "#E30613" : "rgba(255,255,255,.15)"}`,
                  }}
                >
                  {chip.label}
                </button>
              );
            })}
          </div>

          <div className={styles.priceRow}>
            <label htmlFor="catalog-price">Preço até R$ {maxPrice.toLocaleString("pt-BR")}</label>
            <input
              id="catalog-price"
              type="range"
              min="0"
              max="3500"
              step="50"
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className={styles.priceRange}
            />
          </div>
        </div>
      </section>

      <section className={styles.resultsSection}>
        <div className={styles.resultsHead}>
          <div className={styles.resultsLabel}>{resultsLabel}</div>
        </div>

        <div className={styles.grid}>
          {filteredProducts.map((p) => (
            <ProductCard
              key={p.id}
              product={p}
              showFavorite
              isFavorite={!!favorites[p.id]}
              onToggleFavorite={() => setFavorites((f) => ({ ...f, [p.id]: !f[p.id] }))}
            />
          ))}
        </div>

        {noResults && (
          <div className={styles.emptyState}>Nenhum produto encontrado para esses filtros.</div>
        )}
      </section>

      <section className={styles.ctaSection}>
        <div className={styles.ctaRow}>
          <div>
            <h3 className={styles.ctaTitle}>Não achou o que precisa?</h3>
            <p className={styles.ctaText}>Fale direto com um especialista e monte o orçamento ideal.</p>
          </div>
          <a
            href={waLink(WA_SALES, "Olá! Quero um orçamento personalizado.")}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.ctaBtn}
          >
            Solicitar orçamento
          </a>
        </div>
      </section>

      <SiteFooterSimple links={[{ href: "/", label: "Início" }, { href: "/contato", label: "Contato" }]} />
      <WhatsAppFab />
    </>
  );
}
