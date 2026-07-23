"use client";

import { useActionState } from "react";
import Link from "next/link";
import { CATEGORY_META, STOCK_META } from "@/lib/products-data";
import styles from "./ProductForm.module.css";

const TAGS = ["Novo", "Promoção", "Mais vendido"];

export default function ProductForm({ action, product, submitLabel }) {
  const [state, formAction, pending] = useActionState(action, undefined);

  return (
    <form action={formAction} className={styles.form}>
      <div className={styles.grid}>
        <label className={styles.field}>
          <span>Nome</span>
          <input name="name" defaultValue={product?.name} required className={styles.input} />
        </label>

        <label className={styles.field} style={{ gridColumn: "1 / -1" }}>
          <span>Descrição</span>
          <textarea name="description" defaultValue={product?.description} required rows={3} className={styles.input} />
        </label>

        <label className={styles.field}>
          <span>Categoria</span>
          <select name="categoryId" defaultValue={product?.category ?? ""} required className={styles.input}>
            <option value="" disabled>Selecione...</option>
            {Object.entries(CATEGORY_META).map(([id, meta]) => (
              <option key={id} value={id}>{meta.label}</option>
            ))}
          </select>
        </label>

        <label className={styles.field}>
          <span>Estoque</span>
          <select name="stock" defaultValue={product?.stock ?? "in-stock"} required className={styles.input}>
            {Object.entries(STOCK_META).map(([key, meta]) => (
              <option key={key} value={key}>{meta.label}</option>
            ))}
          </select>
        </label>

        <label className={styles.field}>
          <span>Preço (R$)</span>
          <input name="price" type="number" step="0.01" min="0" defaultValue={product?.price} required className={styles.input} />
        </label>

        <label className={styles.field}>
          <span>Preço antigo (R$, opcional)</span>
          <input name="oldPrice" type="number" step="0.01" min="0" defaultValue={product?.oldPrice ?? ""} className={styles.input} />
        </label>

        <label className={styles.field}>
          <span>Parcelamento</span>
          <input name="installment" defaultValue={product?.installment} placeholder='Ex.: "10x de R$ 129,99" ou "à vista"' required className={styles.input} />
        </label>

        <label className={styles.field}>
          <span>Tag</span>
          <select name="tag" defaultValue={product?.tag ?? ""} className={styles.input}>
            <option value="">Nenhuma</option>
            {TAGS.map((tag) => (
              <option key={tag} value={tag}>{tag}</option>
            ))}
          </select>
        </label>

        <label className={styles.field}>
          <span>Marca</span>
          <input name="brand" defaultValue={product?.brand ?? "Genérico"} className={styles.input} />
        </label>

        <label className={styles.field} style={{ gridColumn: "1 / -1" }}>
          <span>Foto do produto {product?.imageUrl ? "(enviar substitui a atual)" : "(opcional)"}</span>
          <input name="image" type="file" accept="image/jpeg,image/png,image/webp,image/gif" className={styles.input} />
        </label>
      </div>

      {state?.error && <p className={styles.error}>{state.error}</p>}

      <div className={styles.actions}>
        <Link href="/admin" className={styles.cancel}>Cancelar</Link>
        <button type="submit" disabled={pending} className={styles.submit}>
          {pending ? "Salvando..." : submitLabel}
        </button>
      </div>
    </form>
  );
}
