"use client";

import { useMemo, useState, useTransition } from "react";
import { saveSiteContentAction } from "@/app/admin/site/actions";
import pageStyles from "@/app/page.module.css";
import contatoStyles from "@/components/contato/Contato.module.css";
import styles from "./SiteEditor.module.css";

const emptyTestimonial = () => ({ text: "", name: "", role: "Cliente Paratech", initial: "" });

export default function SiteEditor({ initialHome, initialContato }) {
  const [section, setSection] = useState("home");
  const [home, setHome] = useState(initialHome);
  const [contato, setContato] = useState(initialContato);
  const [status, setStatus] = useState({ home: null, contato: null });
  const [pending, startTransition] = useTransition();

  const data = section === "home" ? home : contato;
  const setData = section === "home" ? setHome : setContato;
  const current = status[section];

  const handleSave = () => {
    startTransition(async () => {
      const result = await saveSiteContentAction(section, data);
      setStatus((s) => ({ ...s, [section]: result }));
    });
  };

  return (
    <div className={styles.wrap}>
      <div className={styles.toolbar}>
        <div className={styles.subtabs}>
          <button
            type="button"
            className={`${styles.subtab} ${section === "home" ? styles.subtabActive : ""}`}
            onClick={() => setSection("home")}
          >
            Home
          </button>
          <button
            type="button"
            className={`${styles.subtab} ${section === "contato" ? styles.subtabActive : ""}`}
            onClick={() => setSection("contato")}
          >
            Contato
          </button>
        </div>
        <div className={styles.toolbarRight}>
          {current?.error && <span className={styles.statusError}>{current.error}</span>}
          {current?.ok && !pending && (
            <span className={styles.statusOk}>
              Publicado às {new Date(current.savedAt).toLocaleTimeString("pt-BR")}
            </span>
          )}
          <button type="button" onClick={handleSave} disabled={pending} className={styles.saveBtn}>
            {pending ? "Publicando..." : "Publicar alterações"}
          </button>
        </div>
      </div>

      <div className={styles.split}>
        <div className={styles.formPane}>
          {section === "home" ? (
            <HomeForm home={home} setHome={setHome} />
          ) : (
            <ContatoForm contato={contato} setContato={setContato} />
          )}
        </div>
        <div className={styles.previewPane}>
          <div className={styles.previewLabel}>Pré-visualização em tempo real</div>
          <div className={styles.previewFrame}>
            {section === "home" ? <HomePreview home={home} /> : <ContatoPreview contato={contato} />}
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <label className={styles.field}>
      <span>{label}</span>
      {children}
    </label>
  );
}

function Section({ title, children }) {
  return (
    <div className={styles.section}>
      <div className={styles.sectionTitle}>{title}</div>
      {children}
    </div>
  );
}

function HomeForm({ home, setHome }) {
  const set = (key) => (e) => setHome((h) => ({ ...h, [key]: e.target.value }));

  const setStat = (index, key) => (e) =>
    setHome((h) => {
      const heroStats = h.heroStats.map((s, i) => (i === index ? { ...s, [key]: e.target.value } : s));
      return { ...h, heroStats };
    });

  const setTarget = (key) => (e) =>
    setHome((h) => ({ ...h, countersTargets: { ...h.countersTargets, [key]: e.target.value } }));

  const setBanner = (index) => (e) =>
    setHome((h) => ({ ...h, bannerMessages: h.bannerMessages.map((m, i) => (i === index ? e.target.value : m)) }));
  const addBanner = () => setHome((h) => ({ ...h, bannerMessages: [...h.bannerMessages, "Nova mensagem"] }));
  const removeBanner = (index) =>
    setHome((h) => ({ ...h, bannerMessages: h.bannerMessages.filter((_, i) => i !== index) }));

  const setTestimonial = (index, key) => (e) =>
    setHome((h) => ({
      ...h,
      testimonials: h.testimonials.map((t, i) => (i === index ? { ...t, [key]: e.target.value } : t)),
    }));
  const addTestimonial = () => setHome((h) => ({ ...h, testimonials: [...h.testimonials, emptyTestimonial()] }));
  const removeTestimonial = (index) =>
    setHome((h) => ({ ...h, testimonials: h.testimonials.filter((_, i) => i !== index) }));

  return (
    <>
      <Section title="Hero">
        <Field label="Selo (acima do título)">
          <input className={styles.input} value={home.heroKicker} onChange={set("heroKicker")} />
        </Field>
        <div className={styles.row4}>
          <Field label="Texto antes">
            <input className={styles.input} value={home.heroTitleBefore} onChange={set("heroTitleBefore")} />
          </Field>
          <Field label="Palavra em vermelho">
            <input className={styles.input} value={home.heroTitleRed} onChange={set("heroTitleRed")} />
          </Field>
          <Field label="Texto do meio">
            <input className={styles.input} value={home.heroTitleMiddle} onChange={set("heroTitleMiddle")} />
          </Field>
          <Field label="Palavra em amarelo">
            <input className={styles.input} value={home.heroTitleYellow} onChange={set("heroTitleYellow")} />
          </Field>
        </div>
        <Field label="Texto de apoio (parágrafo)">
          <textarea className={styles.input} rows={3} value={home.heroLead} onChange={set("heroLead")} />
        </Field>
        <div className={styles.row2}>
          <Field label="Mensagem do botão WhatsApp">
            <input className={styles.input} value={home.ctaWhatsMessage} onChange={set("ctaWhatsMessage")} />
          </Field>
          <Field label="Texto do botão Catálogo">
            <input className={styles.input} value={home.ctaCatalogLabel} onChange={set("ctaCatalogLabel")} />
          </Field>
        </div>
      </Section>

      <Section title="Faixa de destaques (rotativa)">
        {home.bannerMessages.map((msg, i) => (
          <div key={i} className={styles.listRow}>
            <input className={styles.input} value={msg} onChange={setBanner(i)} />
            <button type="button" className={styles.removeBtn} onClick={() => removeBanner(i)} disabled={home.bannerMessages.length <= 1}>
              Remover
            </button>
          </div>
        ))}
        <button type="button" className={styles.addBtn} onClick={addBanner}>+ Adicionar mensagem</button>
      </Section>

      <Section title="Números do hero">
        <div className={styles.row3}>
          {home.heroStats.map((s, i) => (
            <div key={i} className={styles.statPair}>
              <input className={styles.input} placeholder="Valor" value={s.value} onChange={setStat(i, "value")} />
              <input className={styles.input} placeholder="Legenda" value={s.label} onChange={setStat(i, "label")} />
            </div>
          ))}
        </div>
      </Section>

      <Section title="Contadores animados">
        <div className={styles.row4}>
          <Field label="Clientes atendidos">
            <input type="number" className={styles.input} value={home.countersTargets.clientes} onChange={setTarget("clientes")} />
          </Field>
          <Field label="Anos de experiência">
            <input type="number" className={styles.input} value={home.countersTargets.anos} onChange={setTarget("anos")} />
          </Field>
          <Field label="Produtos vendidos">
            <input type="number" className={styles.input} value={home.countersTargets.vendidos} onChange={setTarget("vendidos")} />
          </Field>
          <Field label="Satisfação (%)">
            <input type="number" className={styles.input} value={home.countersTargets.satisfacao} onChange={setTarget("satisfacao")} />
          </Field>
        </div>
      </Section>

      <Section title="Promoção">
        <div className={styles.row2}>
          <Field label="Selo">
            <input className={styles.input} value={home.promoBadge} onChange={set("promoBadge")} />
          </Field>
          <Field label="Título">
            <input className={styles.input} value={home.promoTitle} onChange={set("promoTitle")} />
          </Field>
        </div>
        <Field label="Texto">
          <textarea className={styles.input} rows={2} value={home.promoText} onChange={set("promoText")} />
        </Field>
        <Field label="Texto do botão">
          <input className={styles.input} value={home.promoCtaLabel} onChange={set("promoCtaLabel")} />
        </Field>
      </Section>

      <Section title="Depoimentos">
        {home.testimonials.map((t, i) => (
          <div key={i} className={styles.testimonialRow}>
            <textarea
              className={styles.input}
              rows={2}
              placeholder="Depoimento"
              value={t.text}
              onChange={setTestimonial(i, "text")}
            />
            <div className={styles.row3}>
              <input className={styles.input} placeholder="Nome" value={t.name} onChange={setTestimonial(i, "name")} />
              <input className={styles.input} placeholder="Cargo/relação" value={t.role} onChange={setTestimonial(i, "role")} />
              <input className={styles.input} placeholder="Iniciais" maxLength={3} value={t.initial} onChange={setTestimonial(i, "initial")} />
            </div>
            <button
              type="button"
              className={styles.removeBtn}
              onClick={() => removeTestimonial(i)}
              disabled={home.testimonials.length <= 1}
            >
              Remover depoimento
            </button>
          </div>
        ))}
        <button type="button" className={styles.addBtn} onClick={addTestimonial}>+ Adicionar depoimento</button>
      </Section>

      <Section title="Visite a loja">
        <Field label="Título">
          <input className={styles.input} value={home.visitTitle} onChange={set("visitTitle")} />
        </Field>
        <Field label="Endereço (subtítulo)">
          <input className={styles.input} value={home.visitSubtitle} onChange={set("visitSubtitle")} />
        </Field>
      </Section>
    </>
  );
}

function ContatoForm({ contato, setContato }) {
  const set = (key) => (e) => setContato((c) => ({ ...c, [key]: e.target.value }));

  return (
    <>
      <Section title="Hero">
        <div className={styles.row2}>
          <Field label="Selo">
            <input className={styles.input} value={contato.heroEyebrow} onChange={set("heroEyebrow")} />
          </Field>
          <Field label="Título">
            <input className={styles.input} value={contato.heroTitle} onChange={set("heroTitle")} />
          </Field>
        </div>
      </Section>

      <Section title="Informações">
        <Field label="Endereço">
          <textarea className={styles.input} rows={2} value={contato.address} onChange={set("address")} />
        </Field>
        <div className={styles.row2}>
          <Field label="Telefone (exibido)">
            <input className={styles.input} value={contato.phone} onChange={set("phone")} />
          </Field>
          <Field label="Telefone (link tel:, só números com +55)">
            <input className={styles.input} value={contato.phoneHref} onChange={set("phoneHref")} />
          </Field>
        </div>
        <div className={styles.row2}>
          <Field label="E-mail">
            <input className={styles.input} value={contato.email} onChange={set("email")} />
          </Field>
          <Field label="Horário de atendimento">
            <input className={styles.input} value={contato.hours} onChange={set("hours")} />
          </Field>
        </div>
        <Field label="URL do mapa (Google Maps embed)">
          <input className={styles.input} value={contato.mapEmbedUrl} onChange={set("mapEmbedUrl")} />
        </Field>
      </Section>
    </>
  );
}

function HomePreview({ home }) {
  return (
    <div className={pageStyles.hero} style={{ position: "relative", overflow: "hidden", borderRadius: 16 }}>
      <div className={pageStyles.heroGrid} aria-hidden="true" />
      <div className={pageStyles.blurRed} aria-hidden="true" />
      <div className={pageStyles.blurYellow} aria-hidden="true" />
      <div className={pageStyles.heroInner}>
        <div className={pageStyles.bannerStrip}>
          {home.bannerMessages.map((msg, i) => (
            <span key={i} className={pageStyles.bannerSlide} style={{ animationDelay: `${i * 3}s` }}>
              {msg}
            </span>
          ))}
        </div>
        <div>
          <div className={pageStyles.badge}>{home.heroKicker}</div>
          <h1 className={pageStyles.heroTitle}>
            {home.heroTitleBefore} <span style={{ color: "#E30613" }}>{home.heroTitleRed}</span> {home.heroTitleMiddle}{" "}
            <span style={{ color: "#FFD400" }}>{home.heroTitleYellow}</span>
            {home.heroTitleAfter}
          </h1>
          <p className={pageStyles.heroLead}>{home.heroLead}</p>
          <div className={pageStyles.ctaRow}>
            <span className={pageStyles.ctaWhats}>Falar no WhatsApp</span>
            <span className={pageStyles.ctaCatalog}>{home.ctaCatalogLabel}</span>
          </div>
          <div className={pageStyles.statsRow}>
            {home.heroStats.map((s, i) => (
              <div key={i}>
                <div className={pageStyles.statNum}>{s.value}</div>
                <div className={pageStyles.statLabel}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <section className={pageStyles.numbersSection}>
        <div className={pageStyles.numbersGrid}>
          <div>
            <div className={pageStyles.numberValue}>+{Number(home.countersTargets.clientes || 0).toLocaleString("pt-BR")}</div>
            <div className={pageStyles.numberLabel}>Clientes atendidos</div>
          </div>
          <div>
            <div className={pageStyles.numberValue}>+{home.countersTargets.anos}</div>
            <div className={pageStyles.numberLabel}>Anos de experiência</div>
          </div>
          <div>
            <div className={pageStyles.numberValue}>+{Number(home.countersTargets.vendidos || 0).toLocaleString("pt-BR")}</div>
            <div className={pageStyles.numberLabel}>Produtos vendidos</div>
          </div>
          <div>
            <div className={pageStyles.numberValue}>{home.countersTargets.satisfacao}%</div>
            <div className={pageStyles.numberLabel}>Clientes satisfeitos</div>
          </div>
        </div>
      </section>

      <section className={pageStyles.promoSection}>
        <div className={pageStyles.promoStripes} aria-hidden="true" />
        <div className={pageStyles.promoGrid}>
          <div>
            <div className={pageStyles.promoBadge}>{home.promoBadge}</div>
            <h2 className={pageStyles.promoTitle}>{home.promoTitle}</h2>
            <p className={pageStyles.promoText}>{home.promoText}</p>
            <span className={pageStyles.promoCta}>{home.promoCtaLabel}</span>
          </div>
          <div className={pageStyles.countdownRow}>
            {["DIAS", "HORAS", "MIN", "SEG"].map((label) => (
              <div key={label} className={pageStyles.countdownBox}>
                <div className={pageStyles.countdownNum}>--</div>
                <div className={pageStyles.countdownLabel}>{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className={pageStyles.testimonialsSection}>
        <div className={pageStyles.sectionHead}>
          <div className={pageStyles.eyebrow}>DEPOIMENTOS</div>
          <h2 className={pageStyles.sectionTitle}>Quem confia na Paratech</h2>
        </div>
        <div className={pageStyles.testimonialCard}>
          <div className={pageStyles.stars} aria-hidden="true">★★★★★</div>
          <p className={pageStyles.quote}>&ldquo;{home.testimonials[0]?.text}&rdquo;</p>
          <div className={pageStyles.personRow}>
            <div className={pageStyles.avatar} aria-hidden="true">{home.testimonials[0]?.initial}</div>
            <div className={pageStyles.personInfo}>
              <div className={pageStyles.personName}>{home.testimonials[0]?.name}</div>
              <div className={pageStyles.personRole}>{home.testimonials[0]?.role}</div>
            </div>
          </div>
          <div className={pageStyles.dotsRow}>
            {home.testimonials.map((t, i) => (
              <span key={i} className={`${pageStyles.dot} ${i === 0 ? pageStyles.dotActive : ""}`} />
            ))}
          </div>
        </div>
      </section>

      <section className={pageStyles.visitSection}>
        <div className={pageStyles.visitRow}>
          <div>
            <h3 className={pageStyles.visitTitle}>{home.visitTitle}</h3>
            <p className={pageStyles.visitSubtitle}>{home.visitSubtitle}</p>
          </div>
          <div className={pageStyles.visitButtons}>
            <span className={pageStyles.visitMapBtn}>Ver no mapa</span>
            <span className={pageStyles.visitWhatsBtn}>Falar no WhatsApp</span>
          </div>
        </div>
      </section>
    </div>
  );
}

function ContatoPreview({ contato }) {
  return (
    <div style={{ borderRadius: 16, overflow: "hidden" }}>
      <section className={contatoStyles.hero}>
        <div className={contatoStyles.eyebrow}>{contato.heroEyebrow}</div>
        <h1 className={contatoStyles.title}>{contato.heroTitle}</h1>
      </section>
      <section className={contatoStyles.content}>
        <div className={contatoStyles.card}>
          <div className={contatoStyles.cardTitle}>Informações</div>
          <div className={contatoStyles.infoList}>
            <div>
              <div className={contatoStyles.infoLabel}>Endereço</div>
              <div className={contatoStyles.infoValue}>
                {contato.address.split("\n").map((line, i) => (
                  <span key={i}>
                    {line}
                    <br />
                  </span>
                ))}
              </div>
            </div>
            <div>
              <div className={contatoStyles.infoLabel}>Telefone</div>
              <span className={contatoStyles.infoLink}>{contato.phone}</span>
            </div>
            <div>
              <div className={contatoStyles.infoLabel}>E-mail</div>
              <span className={contatoStyles.infoLink}>{contato.email}</span>
            </div>
            <div>
              <div className={contatoStyles.infoLabel}>Horário de atendimento</div>
              <div className={contatoStyles.infoValue}>{contato.hours}</div>
            </div>
          </div>
          <span className={contatoStyles.whatsBtn}>Falar no WhatsApp agora</span>
        </div>
        <div className={contatoStyles.mapCard}>
          {contato.mapEmbedUrl ? (
            <iframe title="Mapa" src={contato.mapEmbedUrl} loading="lazy" className={contatoStyles.mapFrame} />
          ) : (
            <div className={styles.mapPlaceholder}>Informe uma URL de mapa válida.</div>
          )}
        </div>
      </section>
    </div>
  );
}
