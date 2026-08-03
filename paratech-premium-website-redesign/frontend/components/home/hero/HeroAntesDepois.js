"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { WA_SALES, waLink } from "@/lib/products-data";
import { ANTES_DEPOIS_THEMES } from "@/lib/hero-themes";
import styles from "./HeroAntesDepois.module.css";

export default function HeroAntesDepois({ content, product }) {
  const theme = ANTES_DEPOIS_THEMES.find((t) => t.id === content.theme) || ANTES_DEPOIS_THEMES[0];
  const [pos, setPos] = useState(50);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t1 = setTimeout(() => setPos(68), 500);
    const t2 = setTimeout(() => setPos(50), 1500);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  return (
    <section className={styles.hero} style={{ "--accent": theme.accent, "--glow": theme.glow }}>
      <div className={styles.compare}>
        <div className={styles.side} aria-hidden="true">
          {product?.imageUrl && (
            <Image
              src={product.imageUrl}
              alt=""
              fill
              sizes="100vw"
              style={{ objectFit: "cover", filter: "grayscale(1) contrast(1.05) brightness(.7)" }}
              priority
            />
          )}
          <div className={`${styles.sideOverlay} ${styles.sideOverlayBefore}`} />
          <div className={styles.grain} />
          <div className={`${styles.sideLabel} ${styles.sideLabelBefore}`}>{content.beforeLabel}</div>
        </div>

        <div className={styles.side} style={{ clipPath: `inset(0 0 0 ${pos}%)` }} aria-hidden="true">
          {product?.imageUrl && (
            <Image
              src={product.imageUrl}
              alt=""
              fill
              sizes="100vw"
              style={{ objectFit: "cover" }}
              priority
            />
          )}
          <div className={`${styles.sideOverlay} ${styles.sideOverlayAfter}`} />
          <div className={`${styles.sideLabel} ${styles.sideLabelAfter}`}>{content.afterLabel}</div>
        </div>

        <input
          type="range"
          min={0}
          max={100}
          value={pos}
          onChange={(e) => setPos(Number(e.target.value))}
          className={styles.rangeInput}
          aria-label="Arraste para comparar antes e depois do upgrade"
        />
        <div className={styles.handleLine} style={{ left: `${pos}%` }} aria-hidden="true">
          <span className={styles.handleGrip}>⟨ ⟩</span>
        </div>
      </div>

      <div className={styles.copy}>
        <h1 className={styles.title}>
          <span className={styles.titleBefore}>{content.titleBefore}</span>{" "}
          <span className={styles.titleAfter}>{content.titleAfter}</span>
        </h1>
        {content.subtitle && <p className={styles.subtitle}>{content.subtitle}</p>}
        <a
          href={waLink(WA_SALES, content.ctaWhatsMessage)}
          target="_blank"
          rel="noopener noreferrer"
          className={styles.cta}
        >
          {content.ctaLabel}
        </a>
      </div>
    </section>
  );
}
