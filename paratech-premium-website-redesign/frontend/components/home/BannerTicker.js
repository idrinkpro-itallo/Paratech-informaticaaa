import styles from "./BannerTicker.module.css";

// Faixa rotativa de destaques, acima do Hero (qualquer um dos 3 modelos) —
// independente da variante escolhida, controlada por sections.banner.
export default function BannerTicker({ messages }) {
  return (
    <div className={styles.wrap}>
      <div className={styles.strip}>
        {messages.map((msg, i) => (
          <span key={i} className={styles.slide} style={{ animationDelay: `${i * 3}s` }}>
            {msg}
          </span>
        ))}
      </div>
    </div>
  );
}
