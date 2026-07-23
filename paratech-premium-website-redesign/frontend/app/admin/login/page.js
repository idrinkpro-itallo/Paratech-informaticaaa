"use client";

import { useActionState } from "react";
import { login } from "./actions";
import styles from "./Login.module.css";

export default function AdminLoginPage() {
  const [state, action, pending] = useActionState(login, undefined);

  return (
    <main className={styles.wrap}>
      <form action={action} className={styles.card}>
        <div className={styles.logo}>
          Para<span style={{ color: "#FFD400" }}>tech</span>
        </div>
        <h1 className={styles.title}>Painel administrativo</h1>
        <p className={styles.subtitle}>Entre com a senha de administrador para gerenciar o catálogo.</p>

        <label htmlFor="password" className={styles.label}>Senha</label>
        <input
          id="password"
          name="password"
          type="password"
          required
          autoFocus
          className={styles.input}
        />

        {state?.error && <p className={styles.error}>{state.error}</p>}

        <button type="submit" disabled={pending} className={styles.button}>
          {pending ? "Entrando..." : "Entrar"}
        </button>
      </form>
    </main>
  );
}
