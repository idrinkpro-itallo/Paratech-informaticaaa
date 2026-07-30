"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import styles from "@/app/page.module.css";

const pad = (n) => String(n).padStart(2, "0");

export default function PromoCountdown({ badge, title, text, ctaLabel }) {
  const targetRef = useRef(null);
  const [countdown, setCountdown] = useState({ d: 0, h: 0, m: 0, s: 0 });

  useEffect(() => {
    targetRef.current = Date.now() + 4 * 86400000 + 6 * 3600000;

    const update = () => {
      const diff = Math.max(0, targetRef.current - Date.now());
      setCountdown({
        d: Math.floor(diff / 86400000),
        h: Math.floor((diff % 86400000) / 3600000),
        m: Math.floor((diff % 3600000) / 60000),
        s: Math.floor((diff % 60000) / 1000),
      });
    };

    update();
    const timer = setInterval(update, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section id="promocoes" className={styles.promoSection}>
      <div className={styles.promoStripes} aria-hidden="true" />
      <div className={styles.promoGrid}>
        <div>
          <div className={styles.promoBadge}>{badge}</div>
          <h2 className={styles.promoTitle}>{title}</h2>
          <p className={styles.promoText}>{text}</p>
          <Link href="/catalogo" className={styles.promoCta}>{ctaLabel}</Link>
        </div>
        <div className={styles.countdownRow}>
          <div className={styles.countdownBox}>
            <div className={styles.countdownNum}>{pad(countdown.d)}</div>
            <div className={styles.countdownLabel}>DIAS</div>
          </div>
          <div className={styles.countdownBox}>
            <div className={styles.countdownNum}>{pad(countdown.h)}</div>
            <div className={styles.countdownLabel}>HORAS</div>
          </div>
          <div className={styles.countdownBox}>
            <div className={styles.countdownNum}>{pad(countdown.m)}</div>
            <div className={styles.countdownLabel}>MIN</div>
          </div>
          <div className={styles.countdownBox}>
            <div className={styles.countdownNum}>{pad(countdown.s)}</div>
            <div className={styles.countdownLabel}>SEG</div>
          </div>
        </div>
      </div>
    </section>
  );
}
