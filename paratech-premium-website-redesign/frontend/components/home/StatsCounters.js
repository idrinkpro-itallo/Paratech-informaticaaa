"use client";

import { useEffect, useRef, useState } from "react";
import styles from "@/app/page.module.css";

const TARGETS = { clientes: 10000, anos: 15, vendidos: 50000, satisfacao: 98 };

export default function StatsCounters() {
  const ref = useRef(null);
  const rafRef = useRef(null);
  const startedRef = useRef(false);
  const [counters, setCounters] = useState({ clientes: 0, anos: 0, vendidos: 0, satisfacao: 0 });

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const animate = () => {
      const start = performance.now();
      const duration = 1600;
      const tick = (now) => {
        const t = Math.min(1, (now - start) / duration);
        const ease = 1 - Math.pow(1 - t, 3);
        setCounters({
          clientes: Math.round(TARGETS.clientes * ease),
          anos: Math.round(TARGETS.anos * ease),
          vendidos: Math.round(TARGETS.vendidos * ease),
          satisfacao: Math.round(TARGETS.satisfacao * ease),
        });
        if (t < 1) rafRef.current = requestAnimationFrame(tick);
      };
      rafRef.current = requestAnimationFrame(tick);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !startedRef.current) {
          startedRef.current = true;
          animate();
        }
      },
      { threshold: 0.3 }
    );
    observer.observe(el);

    return () => {
      observer.disconnect();
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <section ref={ref} className={styles.numbersSection}>
      <div className={styles.numbersGrid}>
        <div>
          <div className={styles.numberValue}>+{counters.clientes.toLocaleString("pt-BR")}</div>
          <div className={styles.numberLabel}>Clientes atendidos</div>
        </div>
        <div>
          <div className={styles.numberValue}>+{counters.anos}</div>
          <div className={styles.numberLabel}>Anos de experiência</div>
        </div>
        <div>
          <div className={styles.numberValue}>+{counters.vendidos.toLocaleString("pt-BR")}</div>
          <div className={styles.numberLabel}>Produtos vendidos</div>
        </div>
        <div>
          <div className={styles.numberValue}>{counters.satisfacao}%</div>
          <div className={styles.numberLabel}>Clientes satisfeitos</div>
        </div>
      </div>
    </section>
  );
}
