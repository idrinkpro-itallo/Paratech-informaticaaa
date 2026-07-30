import Link from "next/link";
import styles from "@/app/admin/Admin.module.css";

const TABS = [
  { href: "/admin", key: "produtos", label: "Produtos" },
  { href: "/admin/site", key: "site", label: "Site" },
];

export default function AdminNav({ active }) {
  return (
    <nav className={styles.tabs}>
      {TABS.map((tab) => (
        <Link
          key={tab.key}
          href={tab.href}
          className={`${styles.tab} ${active === tab.key ? styles.tabActive : ""}`}
        >
          {tab.label}
        </Link>
      ))}
    </nav>
  );
}
