"use client";

import { useEffect, useState } from "react";
import styles from "@/app/page.module.css";

export default function TestimonialCarousel({ testimonials }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = setInterval(() => {
      setIndex((i) => (i + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [testimonials.length]);

  const t = testimonials[index];

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
          {testimonials.map((item, i) => (
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
