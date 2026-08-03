"use client";

import { useEffect, useRef, useState } from "react";
import { WA_SALES, waLink } from "@/lib/products-data";
import { BENCHMARK_THEMES } from "@/lib/hero-themes";
import styles from "./HeroBenchmark.module.css";

function useCountUp(target, active, duration = 1400) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!active) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setValue(target);
      return;
    }
    let raf;
    const start = performance.now();
    const tick = (now) => {
      const progress = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(target * eased));
      if (progress < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [active, target, duration]);

  return value;
}

export default function HeroBenchmark({ content }) {
  const theme = BENCHMARK_THEMES.find((t) => t.id === content.theme) || BENCHMARK_THEMES[0];
  const sectionRef = useRef(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setActive(true);
          observer.disconnect();
        }
      },
      { threshold: 0.35 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const metric = useCountUp(Number(content.metricValue) || 0, active);
  const comparePercent = Math.min(100, Math.max(0, Number(content.comparePercent) || 0));

  return (
    <section
      ref={sectionRef}
      className={styles.hero}
      style={{ "--digit": theme.digit, "--digitGlow": theme.digitGlow, "--trace": theme.trace, "--gain": theme.gain }}
    >
      <svg className={styles.circuit} aria-hidden="true" viewBox="0 0 800 600" preserveAspectRatio="none">
        <path d="M0,80 H260 V220 H520 V60 H800" />
        <path d="M0,340 H180 V480 H460 V400 H800" />
        <path d="M0,540 H360 V560 H800" />
        <path d="M760,0 V160 H620 V300" />
      </svg>

      <div className={styles.inner}>
        <div className={styles.copy}>
          <div className={styles.kicker}>{content.kicker}</div>
          <h1 className={styles.title}>{content.title}</h1>
          <p className={styles.lead}>{content.lead}</p>
          <div className={styles.ctaRow}>
            <a
              href={waLink(WA_SALES, content.ctaWhatsMessage)}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.cta}
            >
              <span>{content.ctaLabel}</span>
            </a>
          </div>
        </div>

        <div className={styles.card}>
          <div className={styles.cardLabel}>{content.metricLabel}</div>
          <div className={styles.metric}>
            {metric.toLocaleString("pt-BR")}
            <span className={styles.unit}>{content.metricUnit}</span>
          </div>

          <div className={styles.bars}>
            <div className={styles.barRow}>
              <span className={styles.barTag}>SSD Paratech</span>
              <div className={styles.barTrack}>
                <div className={styles.barFillMain} style={{ width: active ? "100%" : "0%" }} />
              </div>
            </div>
            <div className={styles.barRow}>
              <span className={styles.barTag}>{content.compareLabel}</span>
              <div className={styles.barTrack}>
                <div className={styles.barFillCompare} style={{ width: active ? `${comparePercent}%` : "0%" }} />
              </div>
            </div>
          </div>

          <div className={styles.gain}>▲ {content.gainLabel}</div>
        </div>
      </div>
    </section>
  );
}
