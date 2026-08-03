"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import styles from "@/app/page.module.css";
import { CATEGORY_META, WA_SALES, waLink, tagStyle } from "@/lib/products-data";

const BANNER_COPY = {
  1: { kicker: "Campeão de vendas na Paratech", headline: "Rápido no trabalho. Leve na mochila. Sem travar nunca." },
  3: { kicker: "Oferta que não volta", headline: "Tela grande, imagem perfeita, preço que ninguém segura." },
  10: { kicker: "Seu PC pedindo esse upgrade", headline: "Adeus, tela de carregando. Bem-vindo, SSD." },
  6: { kicker: "A que nunca para de imprimir", headline: "Impressão rápida todo santo dia, sem pesar no bolso." },
};

const AUTOPLAY_MS = 6000;

export default function HeroProductBanner({ products }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused || products.length < 2) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = setInterval(() => {
      setIndex((i) => (i + 1) % products.length);
    }, AUTOPLAY_MS);
    return () => clearInterval(timer);
  }, [paused, products.length]);

  if (!products.length) return null;

  return (
    <div
      className={styles.heroBanner}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      {products.map((p, i) => {
        const meta = CATEGORY_META[p.category];
        const copy = BANNER_COPY[p.id] || { kicker: meta.label, headline: meta.tagline };
        const tag = tagStyle(p.tag);
        const active = i === index;
        return (
          <div
            key={p.id}
            className={styles.heroBannerSlide}
            style={{ opacity: active ? 1 : 0, pointerEvents: active ? "auto" : "none" }}
            aria-hidden={active ? undefined : true}
          >
            <div
              className={styles.heroBannerCard}
              style={{
                background: `linear-gradient(160deg, ${meta.c1}, ${meta.c2})`,
                borderColor: `${meta.accent}40`,
              }}
            >
              <div
                className={styles.heroBannerGlow}
                style={{ background: meta.accent, boxShadow: `0 0 140px 70px ${meta.glow}` }}
                aria-hidden="true"
              />
              {tag && (
                <div className={styles.heroBannerTag} style={{ background: tag.bg, color: tag.color }}>
                  {p.tag}
                </div>
              )}
              <div className={styles.heroBannerImageWrap}>
                {p.imageUrl && (
                  <Image
                    src={p.imageUrl}
                    alt={p.name}
                    fill
                    sizes="(max-width: 960px) 70vw, 360px"
                    style={{ objectFit: "contain" }}
                    priority={i === 0}
                  />
                )}
              </div>
              <div className={styles.heroBannerKicker} style={{ color: meta.accent }}>{copy.kicker}</div>
              <h3 className={styles.heroBannerHeadline}>{copy.headline}</h3>
              <div className={styles.heroBannerPrice}>Preço sob consulta</div>
              <div className={styles.heroBannerCtaRow}>
                <a
                  href={waLink(WA_SALES, `Quero um orçamento para: ${p.name}`)}
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
        {products.map((p, i) => (
          <button
            key={p.id}
            type="button"
            role="tab"
            aria-selected={i === index}
            aria-label={`Ver ${p.name}`}
            className={`${styles.dot} ${i === index ? styles.dotActive : ""}`}
            onClick={() => setIndex(i)}
          />
        ))}
      </div>
    </div>
  );
}
