"use client";

import { useEffect, useState } from "react";
import styles from "@/app/page.module.css";

const TESTIMONIALS = [
  { text: "Comprei meu notebook e o atendimento foi excelente. Entrega rápida e produto original.", name: "Marcos Silva", role: "Cliente Paratech", initial: "MS" },
  { text: "A assistência técnica resolveu meu computador no mesmo dia. Recomendo demais!", name: "Fernanda Oliveira", role: "Cliente Paratech", initial: "FO" },
  { text: "Melhores preços da região em SSD e memórias. Já é a segunda compra que faço.", name: "Rafael Costa", role: "Cliente Paratech", initial: "RC" },
];

export default function TestimonialCarousel() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = setInterval(() => {
      setIndex((i) => (i + 1) % TESTIMONIALS.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const t = TESTIMONIALS[index];

  return (
    <section className={styles.testimonialsSection}>
      <div className={styles.sectionHead}>
        <div className={styles.eyebrow}>DEPOIMENTOS</div>
        <h2 className={styles.sectionTitle}>Quem confia na Paratech</h2>
      </div>
      <div className={styles.testimonialCard}>
        <div className={styles.stars} aria-hidden="true">★★★★★</div>
        <p className={styles.quote}>&ldquo;{t.text}&rdquo;</p>
        <div className={styles.personRow}>
          <div className={styles.avatar} aria-hidden="true">{t.initial}</div>
          <div className={styles.personInfo}>
            <div className={styles.personName}>{t.name}</div>
            <div className={styles.personRole}>{t.role}</div>
          </div>
        </div>
        <div className={styles.dotsRow} role="tablist" aria-label="Depoimentos">
          {TESTIMONIALS.map((item, i) => (
            <button
              key={item.name}
              type="button"
              role="tab"
              aria-selected={i === index}
              aria-label={`Depoimento de ${item.name}`}
              className={`${styles.dot} ${i === index ? styles.dotActive : ""}`}
              onClick={() => setIndex(i)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
