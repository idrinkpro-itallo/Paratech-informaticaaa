"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { CATEGORY_META, WA_SALES, waLink, tagStyle } from "@/lib/products-data";
import styles from "./HeroClassico.module.css";

const AUTOPLAY_MS = 6000;

// Paleta fixa usada no lugar de CATEGORY_META quando o hero está no tema
// claro — card claro com contorno e sombra em tinta, mesmo tratamento pra
// todo slide, independente da categoria do produto em destaque.
const MONO_PALETTE = { c1: "#ffffff", c2: "#f1f1ef", accent: "#16181B", glow: "rgba(22, 24, 27, .14)" };

export default function HeroClassico({ content, products }) {
  const claro = content.theme === "claro";
  const slides = content.slides
    .map((s) => ({ ...s, product: products.find((p) => p.id === s.productId) }))
    .filter((s) => s.product);

  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused || slides.length < 2) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = setInterval(() => {
      setIndex((i) => (i + 1) % slides.length);
    }, AUTOPLAY_MS);
    return () => clearInterval(timer);
  }, [paused, slides.length]);

  return (
    <section className={`${styles.hero} ${claro ? styles.heroClaro : ""}`}>
      <div className={styles.heroGrid} aria-hidden="true" />
      <div className={styles.blurRed} aria-hidden="true" />
      <div className={styles.blurYellow} aria-hidden="true" />

      <div className={styles.heroInner}>
        <div>
          <div className={styles.badge}>{content.kicker}</div>
          <h1 className={styles.heroTitle}>
            {content.titleBefore}{" "}
            <span style={{ color: claro ? "#16181B" : "#E30613" }}>{content.titleRed}</span> {content.titleMiddle}{" "}
            <span style={{ color: claro ? "#5B6168" : "#FFD400" }}>{content.titleYellow}</span>
            {content.titleAfter}
          </h1>
          <p className={styles.heroLead}>{content.lead}</p>
          <div className={styles.ctaRow}>
            <a
              href={waLink(WA_SALES, content.ctaWhatsMessage)}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.ctaWhats}
            >
              Falar no WhatsApp
            </a>
            <Link href="/catalogo" className={styles.ctaCatalog}>
              {content.ctaCatalogLabel}
            </Link>
          </div>
          <div className={styles.statsRow}>
            {content.stats.map((s, i) => (
              <div key={i}>
                <div className={styles.statNum}>{s.value}</div>
                <div className={styles.statLabel}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {slides.length > 0 && (
          <div
            className={styles.heroBanner}
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
            onFocus={() => setPaused(true)}
            onBlur={() => setPaused(false)}
          >
            {slides.map((s, i) => {
              const meta = CATEGORY_META[s.product.category];
              const palette = claro ? MONO_PALETTE : meta;
              const tag = tagStyle(s.product.tag);
              const active = i === index;
              return (
                <div
                  key={s.product.id}
                  className={styles.heroBannerSlide}
                  style={{ opacity: active ? 1 : 0, pointerEvents: active ? "auto" : "none" }}
                  aria-hidden={active ? undefined : true}
                >
                  <div
                    className={styles.heroBannerCard}
                    style={{
                      background: `linear-gradient(160deg, ${palette.c1}, ${palette.c2})`,
                      borderColor: `${palette.accent}40`,
                    }}
                  >
                    <div
                      className={styles.heroBannerGlow}
                      style={{ background: palette.accent, boxShadow: `0 0 140px 70px ${palette.glow}` }}
                      aria-hidden="true"
                    />
                    {tag && (
                      <div className={styles.heroBannerTag} style={{ background: tag.bg, color: tag.color }}>
                        {s.product.tag}
                      </div>
                    )}
                    <div className={styles.heroBannerImageWrap}>
                      {s.product.imageUrl && (
                        <Image
                          src={s.product.imageUrl}
                          alt={s.product.name}
                          fill
                          sizes="(max-width: 960px) 70vw, 360px"
                          style={{ objectFit: "contain", filter: claro ? "grayscale(1) contrast(1.05)" : undefined }}
                          priority={i === 0}
                        />
                      )}
                    </div>
                    <div className={styles.heroBannerKicker} style={{ color: palette.accent }}>
                      {s.kicker}
                    </div>
                    <h3 className={styles.heroBannerHeadline}>{s.headline}</h3>
                    <div className={styles.heroBannerPrice}>Preço sob consulta</div>
                    <div className={styles.heroBannerCtaRow}>
                      <a
                        href={waLink(WA_SALES, `Quero um orçamento para: ${s.product.name}`)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-quote"
                        tabIndex={active ? 0 : -1}
                      >
                        Solicitar Orçamento
                      </a>
                    </div>
                  </div>
                </div>
              );
            })}
            <div className={styles.heroBannerDots} role="tablist" aria-label="Produtos em destaque">
              {slides.map((s, i) => (
                <button
                  key={s.product.id}
                  type="button"
                  role="tab"
                  aria-selected={i === index}
                  aria-label={`Ver ${s.product.name}`}
                  className={`${styles.dot} ${i === index ? styles.dotActive : ""}`}
                  onClick={() => setIndex(i)}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
