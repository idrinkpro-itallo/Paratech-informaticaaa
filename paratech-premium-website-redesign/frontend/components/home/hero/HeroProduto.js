"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { WA_SALES, waLink } from "@/lib/products-data";
import { PRODUTO_THEMES } from "@/lib/hero-themes";
import styles from "./HeroProduto.module.css";

export default function HeroProduto({ content, product }) {
  const theme = PRODUTO_THEMES.find((t) => t.id === content.theme) || PRODUTO_THEMES[0];
  const stageRef = useRef(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const el = stageRef.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const handleMove = (e) => {
      const rect = el.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width - 0.5;
      const py = (e.clientY - rect.top) / rect.height - 0.5;
      setTilt({ x: py * -6, y: px * 6 });
    };
    const reset = () => setTilt({ x: 0, y: 0 });

    el.addEventListener("mousemove", handleMove);
    el.addEventListener("mouseleave", reset);
    return () => {
      el.removeEventListener("mousemove", handleMove);
      el.removeEventListener("mouseleave", reset);
    };
  }, []);

  return (
    <section className={styles.hero} style={{ "--accent": theme.accent, "--glow": theme.glow }}>
      <div className={styles.grid} aria-hidden="true" />
      <div className={styles.inner}>
        <div className={styles.copy}>
          <div className={styles.kicker}>{content.kicker}</div>
          <h1 className={styles.title}>
            {content.titleBefore}{" "}
            <span className={styles.swap}>
              <span className={styles.strike}>{content.titleStrike}</span>
              <span className={styles.reveal}>{content.titleAfter}</span>
            </span>
          </h1>
          <p className={styles.lead}>{content.lead}</p>
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
          {content.showStats && (
            <div className={styles.statsRow}>
              {content.stats.map((s, i) => (
                <div key={i}>
                  <div className={styles.statNum}>{s.value}</div>
                  <div className={styles.statLabel}>{s.label}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className={styles.stage} ref={stageRef}>
          <div className={styles.glow} aria-hidden="true" />
          {content.badgeText && <div className={styles.badge}>{content.badgeText}</div>}
          <div className={styles.tilt} style={{ transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)` }}>
            <div className={styles.floatWrap}>
              <div className={styles.imageWrap}>
                {product?.imageUrl && (
                  <Image
                    src={product.imageUrl}
                    alt={product.name}
                    fill
                    sizes="(max-width: 960px) 70vw, 420px"
                    style={{ objectFit: "contain" }}
                    priority
                  />
                )}
              </div>
              <div className={styles.shadow} aria-hidden="true" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
