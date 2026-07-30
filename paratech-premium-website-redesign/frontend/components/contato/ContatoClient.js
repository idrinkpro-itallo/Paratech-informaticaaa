"use client";

import { useState } from "react";
import styles from "./Contato.module.css";
import SiteHeader from "@/components/SiteHeader";
import { SiteFooterSimple } from "@/components/SiteFooter";
import WhatsAppFab from "@/components/WhatsAppFab";
import { WA_SUPPORT } from "@/lib/products-data";

const ASSUNTOS = ["Orçamento", "Assistência", "Dúvida", "Outro"];

export default function ContatoClient({ content }) {
  const [nome, setNome] = useState("");
  const [telefone, setTelefone] = useState("");
  const [assunto, setAssunto] = useState("Orçamento");
  const [mensagem, setMensagem] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    const msg = `Olá! Meu nome é ${nome || "-"}.\nTelefone: ${telefone || "-"}\nAssunto: ${assunto}\nMensagem: ${mensagem || "-"}`;
    window.open(`https://wa.me/${WA_SUPPORT}?text=${encodeURIComponent(msg)}`, "_blank");
  };

  return (
    <>
      <SiteHeader active="contato" />

      <section className={styles.hero}>
        <div className={styles.eyebrow}>{content.heroEyebrow}</div>
        <h1 className={styles.title}>{content.heroTitle}</h1>
      </section>

      <section className={styles.content}>
        <div className={styles.grid}>
          <div className={styles.leftCol}>
            <div className={styles.card}>
              <div className={styles.cardTitle}>Informações</div>
              <div className={styles.infoList}>
                <div>
                  <div className={styles.infoLabel}>Endereço</div>
                  <div className={styles.infoValue}>
                    {content.address.split("\n").map((line, i) => (
                      <span key={i}>
                        {line}
                        {i < content.address.split("\n").length - 1 && <br />}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <div className={styles.infoLabel}>Telefone</div>
                  <a href={`tel:${content.phoneHref}`} className={styles.infoLink}>{content.phone}</a>
                </div>
                <div>
                  <div className={styles.infoLabel}>E-mail</div>
                  <a href={`mailto:${content.email}`} className={styles.infoLink}>{content.email}</a>
                </div>
                <div>
                  <div className={styles.infoLabel}>Horário de atendimento</div>
                  <div className={styles.infoValue}>{content.hours}</div>
                </div>
              </div>
              <a
                href={`https://wa.me/${WA_SUPPORT}`}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.whatsBtn}
              >
                Falar no WhatsApp agora
              </a>
            </div>
            <div className={styles.mapCard}>
              <iframe
                title="Mapa Paratech"
                src={content.mapEmbedUrl}
                loading="lazy"
                className={styles.mapFrame}
              />
            </div>
          </div>

          <div className={styles.formCard}>
            <div className={styles.cardTitle}>Envie uma mensagem</div>
            <form className={styles.form} onSubmit={handleSubmit}>
              <label htmlFor="contato-nome" className={styles.visuallyHidden}>Seu nome</label>
              <input
                id="contato-nome"
                type="text"
                placeholder="Seu nome"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                className={styles.input}
                required
              />
              <label htmlFor="contato-telefone" className={styles.visuallyHidden}>Seu telefone/WhatsApp</label>
              <input
                id="contato-telefone"
                type="text"
                placeholder="Seu telefone/WhatsApp"
                value={telefone}
                onChange={(e) => setTelefone(e.target.value)}
                className={styles.input}
                required
              />
              <label htmlFor="contato-assunto" className={styles.visuallyHidden}>Assunto</label>
              <select
                id="contato-assunto"
                value={assunto}
                onChange={(e) => setAssunto(e.target.value)}
                className={styles.select}
              >
                {ASSUNTOS.map((a) => (
                  <option key={a} value={a}>
                    {a === "Orçamento" ? "Orçamento de produto"
                      : a === "Assistência" ? "Assistência técnica"
                      : a === "Dúvida" ? "Dúvida geral"
                      : "Outro assunto"}
                  </option>
                ))}
              </select>
              <label htmlFor="contato-mensagem" className={styles.visuallyHidden}>Sua mensagem</label>
              <textarea
                id="contato-mensagem"
                placeholder="Sua mensagem"
                rows={5}
                value={mensagem}
                onChange={(e) => setMensagem(e.target.value)}
                className={styles.textarea}
                required
              />
              <button type="submit" className={styles.submitBtn}>Enviar mensagem</button>
              <div className={styles.formNote}>Ao enviar, sua mensagem será aberta no WhatsApp com um especialista.</div>
            </form>
          </div>
        </div>
      </section>

      <SiteFooterSimple links={[{ href: "/", label: "Início" }, { href: "/catalogo", label: "Catálogo" }]} />
      <WhatsAppFab showCatalogLink />
    </>
  );
}
