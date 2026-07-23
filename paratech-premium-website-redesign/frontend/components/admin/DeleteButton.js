"use client";

import { useTransition } from "react";
import { deleteProduct } from "@/app/admin/actions";

export default function DeleteButton({ productId, productName }) {
  const [isPending, startTransition] = useTransition();

  function handleClick() {
    if (!window.confirm(`Apagar "${productName}"? Essa ação não pode ser desfeita.`)) return;
    startTransition(() => deleteProduct(productId));
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={isPending}
      style={{
        background: "none",
        border: "none",
        color: isPending ? "#5b6168" : "#ff8a8a",
        fontWeight: 600,
        fontSize: 13,
        cursor: isPending ? "default" : "pointer",
        fontFamily: "var(--font-manrope), sans-serif",
      }}
    >
      {isPending ? "Apagando..." : "Apagar"}
    </button>
  );
}
