"use client";

import { useMemo, useState, useTransition } from "react";
import {
  saveSiteContentAction,
  uploadGalleryPhotoAction,
  toggleCategoryVisibilityAction,
  updateCategoryCoverImageAction,
} from "@/app/admin/site/actions";
import HeroProductBanner from "@/components/home/HeroProductBanner";
import { FEATURE_ICONS } from "@/components/home/FeatureIcons";
import ProductCard from "@/components/ProductCard";
import CategoryTile from "@/components/CategoryTile";
import { SiteFooterFull } from "@/components/SiteFooter";
import pageStyles from "@/app/page.module.css";
import contatoStyles from "@/components/contato/Contato.module.css";
import styles from "./SiteEditor.module.css";

const emptyTestimonial = () => ({ text: "", name: "", role: "Cliente Paratech", initial: "" });

export default function SiteEditor({ initialHome, initialContato, products = [], categories = [] }) {
  const [section, setSection] = useState("home");
  const [home, setHome] = useState(initialHome);
  const [contato, setContato] = useState(initialContato);
  const [categoryList, setCategoryList] = useState(categories);
  const [categoryErrors, setCategoryErrors] = useState({});
  const [status, setStatus] = useState({ home: null, contato: null });
  const [device, setDevice] = useState("desktop");
  const [pending, startTransition] = useTransition();
  const [categoryPending, startCategoryTransition] = useTransition();

  const data = section === "home" ? home : contato;
  const setData = section === "home" ? setHome : setContato;
  const current = status[section];

  // Categorias ocultas somem da Home, do Catálogo e do rodapé ao mesmo tempo
  // — o preview usa a mesma lista filtrada pra refletir isso na hora.
  const visibleCategories = useMemo(() => categoryList.filter((c) => c.visible), [categoryList]);

  const handleSave = () => {
    startTransition(async () => {
      const result = await saveSiteContentAction(section, data);
      setStatus((s) => ({ ...s, [section]: result }));
    });
  };

  const handleToggleCategory = (id, nextVisible) => {
    setCategoryList((list) => list.map((c) => (c.id === id ? { ...c, visible: nextVisible } : c)));
    setCategoryErrors((e) => ({ ...e, [id]: null }));
    startCategoryTransition(async () => {
      const result = await toggleCategoryVisibilityAction(id, nextVisible);
      if (result?.error) {
        setCategoryList((list) => list.map((c) => (c.id === id ? { ...c, visible: !nextVisible } : c)));
        setCategoryErrors((e) => ({ ...e, [id]: result.error }));
      }
    });
  };

  const handleCategoryImageUpload = (id, file) => {
    setCategoryErrors((e) => ({ ...e, [id]: null }));
    startCategoryTransition(async () => {
      const formData = new FormData();
      formData.set("image", file);
      const result = await updateCategoryCoverImageAction(id, formData);
      if (result?.error) {
        setCategoryErrors((e) => ({ ...e, [id]: result.error }));
        return;
      }
      setCategoryList((list) => list.map((c) => (c.id === id ? { ...c, coverImage: result.url } : c)));
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
            <HomeForm
              home={home}
              setHome={setHome}
              products={products}
              categories={categoryList}
              onToggleCategory={handleToggleCategory}
              onUploadCategoryImage={handleCategoryImageUpload}
              categoryPending={categoryPending}
              categoryErrors={categoryErrors}
            />
          ) : (
            <ContatoForm contato={contato} setContato={setContato} />
          )}
        </div>
        <div className={styles.previewPane}>
          <div className={styles.previewLabel}>
            Pré-visualização em tempo real
            <div className={styles.deviceToggle}>
              <button
                type="button"
                className={`${styles.deviceBtn} ${device === "desktop" ? styles.deviceBtnActive : ""}`}
                onClick={() => setDevice("desktop")}
              >
                Desktop
              </button>
              <button
                type="button"
                className={`${styles.deviceBtn} ${device === "mobile" ? styles.deviceBtnActive : ""}`}
                onClick={() => setDevice("mobile")}
              >
                Mobile
              </button>
            </div>
          </div>
          <div className={device === "mobile" ? styles.phoneShell : undefined}>
            <div className={`${styles.previewFrame} ${device === "mobile" ? styles.previewFrameMobile : ""}`}>
              {section === "home" ? (
                <HomePreview home={home} products={products} categories={visibleCategories} />
              ) : (
                <ContatoPreview contato={contato} />
              )}
            </div>
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

function Section({ title, children, visible, onToggleVisible }) {
  const toggleable = typeof onToggleVisible === "function";
  return (
    <div className={`${styles.section} ${toggleable && !visible ? styles.sectionHidden : ""}`}>
      <div className={styles.sectionTitleRow}>
        <div className={styles.sectionTitle}>{title}</div>
        {toggleable && (
          <label className={styles.visToggle}>
            <input type="checkbox" checked={visible} onChange={onToggleVisible} />
            <span className={styles.visSwitch} aria-hidden="true" />
            <span className={styles.visLabel}>{visible ? "Visível no site" : "Oculta no site"}</span>
          </label>
        )}
      </div>
      {children}
    </div>
  );
}

function CategoryVisibilityList({ categories, pending, errors, onToggle, onUploadImage }) {
  if (!categories.length) {
    return <p className={styles.helpText}>Nenhuma categoria com produtos cadastrados ainda.</p>;
  }

  const handleFileChange = (id) => (e) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (file) onUploadImage(id, file);
  };

  return (
    <div className={styles.categoryToggleList}>
      {categories.map((c) => (
        <div key={c.id} className={styles.categoryToggleRow}>
          <div className={styles.categoryToggleInfo}>
            {c.coverImage ? (
              <img src={c.coverImage} alt="" className={styles.categoryToggleThumb} />
            ) : (
              <div className={styles.categoryToggleThumbEmpty} aria-hidden="true" />
            )}
            <span className={styles.categoryToggleName}>{c.label}</span>
          </div>
          <div className={styles.categoryToggleActions}>
            <label className={styles.categoryImageBtn}>
              {pending ? "Enviando..." : "Trocar imagem"}
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                disabled={pending}
                onChange={handleFileChange(c.id)}
                hidden
              />
            </label>
            <label className={styles.visToggle}>
              <input
                type="checkbox"
                checked={c.visible}
                disabled={pending}
                onChange={() => onToggle(c.id, !c.visible)}
              />
              <span className={styles.visSwitch} aria-hidden="true" />
              <span className={styles.visLabel}>{c.visible ? "Visível" : "Oculta"}</span>
            </label>
          </div>
          {errors?.[c.id] && <span className={styles.statusError}>{errors[c.id]}</span>}
        </div>
      ))}
    </div>
  );
}

function HomeForm({
  home,
  setHome,
  products,
  categories,
  onToggleCategory,
  onUploadCategoryImage,
  categoryPending,
  categoryErrors,
}) {
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

  const setFeature = (index, key) => (e) =>
    setHome((h) => ({
      ...h,
      features: h.features.map((f, i) => (i === index ? { ...f, [key]: e.target.value } : f)),
    }));

  const setTestimonial = (index, key) => (e) =>
    setHome((h) => ({
      ...h,
      testimonials: h.testimonials.map((t, i) => (i === index ? { ...t, [key]: e.target.value } : t)),
    }));
  const addTestimonial = () => setHome((h) => ({ ...h, testimonials: [...h.testimonials, emptyTestimonial()] }));
  const removeTestimonial = (index) =>
    setHome((h) => ({ ...h, testimonials: h.testimonials.filter((_, i) => i !== index) }));

  const toggleSection = (key) => () =>
    setHome((h) => ({ ...h, sections: { ...h.sections, [key]: !h.sections[key] } }));

  const setHeroTheme = (theme) => setHome((h) => ({ ...h, heroTheme: theme }));

  return (
    <>
      <Section title="Hero">
        <Field label="Estilo visual">
          <div className={styles.heroThemeToggle} role="radiogroup" aria-label="Estilo visual do hero">
            <button
              type="button"
              role="radio"
              aria-checked={home.heroTheme === "color"}
              className={`${styles.heroThemeBtn} ${home.heroTheme === "color" ? styles.heroThemeBtnActive : ""}`}
              onClick={() => setHeroTheme("color")}
            >
              Colorido (vermelho/amarelo)
            </button>
            <button
              type="button"
              role="radio"
              aria-checked={home.heroTheme === "grayscale"}
              className={`${styles.heroThemeBtn} ${home.heroTheme === "grayscale" ? styles.heroThemeBtnActive : ""}`}
              onClick={() => setHeroTheme("grayscale")}
            >
              Preto e branco
            </button>
          </div>
          <p className={styles.helpText}>
            Troca os acentos do hero e do banner rotativo de produtos para uma paleta em preto e branco. O botão do
            WhatsApp continua verde (cor de ação, não de marca).
          </p>
        </Field>
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

      <Section title="Categorias" visible={home.sections.categorias} onToggleVisible={toggleSection("categorias")}>
        <p className={styles.helpText}>
          Grade gerada automaticamente a partir das categorias com produtos cadastrados. Desligue a chave acima
          pra tirar a seção inteira da Home, ou oculte categorias específicas abaixo — vale pra Home, Catálogo e
          rodapé ao mesmo tempo (os produtos continuam cadastrados, só somem da navegação por categoria). Use
          "Trocar imagem" pra substituir o gradiente do tile por uma foto de capa.
        </p>
        <CategoryVisibilityList
          categories={categories}
          pending={categoryPending}
          errors={categoryErrors}
          onToggle={onToggleCategory}
          onUploadImage={onUploadCategoryImage}
        />
      </Section>

      <Section
        title="Produtos em destaque (banner do hero)"
        visible={home.sections.destaque}
        onToggleVisible={toggleSection("destaque")}
      >
        <p className={styles.helpText}>
          Escolha quais produtos giram nos cards do hero da Home. Clique para selecionar; a ordem de seleção define
          a ordem de exibição — use as setas para reordenar. A seção &ldquo;Os mais procurados&rdquo; abaixo do hero
          usa a mesma lista e pode ser desligada ao lado (os cards do hero continuam sempre visíveis).
        </p>
        <FeaturedProductsPicker
          products={products}
          featuredProductIds={home.featuredProductIds}
          setHome={setHome}
        />
      </Section>

      <Section
        title="Faixa de destaques (rotativa)"
        visible={home.sections.banner}
        onToggleVisible={toggleSection("banner")}
      >
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

      <Section title="Números do hero" visible={home.sections.numeros} onToggleVisible={toggleSection("numeros")}>
        <div className={styles.row3}>
          {home.heroStats.map((s, i) => (
            <div key={i} className={styles.statPair}>
              <input className={styles.input} placeholder="Valor" value={s.value} onChange={setStat(i, "value")} />
              <input className={styles.input} placeholder="Legenda" value={s.label} onChange={setStat(i, "label")} />
            </div>
          ))}
        </div>
      </Section>

      <Section title="Contadores animados" visible={home.sections.contadores} onToggleVisible={toggleSection("contadores")}>
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

      <Section title="Promoção" visible={home.sections.promocao} onToggleVisible={toggleSection("promocao")}>
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

      <Section title="Depoimentos" visible={home.sections.depoimentos} onToggleVisible={toggleSection("depoimentos")}>
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

      <Section
        title="Diferenciais (por que a Paratech)"
        visible={home.sections.diferenciais}
        onToggleVisible={toggleSection("diferenciais")}
      >
        <p className={styles.helpText}>Os 8 cards ficam na mesma ordem/ícone; só o texto é editável.</p>
        <div className={styles.featuresEditGrid}>
          {home.features.map((f, i) => (
            <div key={i} className={styles.featureEditCard}>
              <div className={styles.featureEditIcon} style={{ background: FEATURE_ICONS[i].iconBg }}>
                {FEATURE_ICONS[i].icon}
              </div>
              <input
                className={styles.input}
                placeholder="Título"
                value={f.title}
                onChange={setFeature(i, "title")}
              />
              <input
                className={styles.input}
                placeholder="Descrição"
                value={f.desc}
                onChange={setFeature(i, "desc")}
              />
            </div>
          ))}
        </div>
      </Section>

      <Section title="Galeria de fotos" visible={home.sections.galeria} onToggleVisible={toggleSection("galeria")}>
        <p className={styles.helpText}>Envie as fotos da loja/equipe. Sem foto, o slot mostra só a legenda.</p>
        <GalleryEditor gallery={home.gallery} setHome={setHome} />
      </Section>

      <Section title="Visite a loja" visible={home.sections.visite} onToggleVisible={toggleSection("visite")}>
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

function FeaturedProductsPicker({ products, featuredProductIds, setHome }) {
  const toggle = (id) =>
    setHome((h) => {
      const has = h.featuredProductIds.includes(id);
      return {
        ...h,
        featuredProductIds: has
          ? h.featuredProductIds.filter((x) => x !== id)
          : [...h.featuredProductIds, id],
      };
    });

  const move = (id, dir) =>
    setHome((h) => {
      const ids = [...h.featuredProductIds];
      const i = ids.indexOf(id);
      const j = i + dir;
      if (j < 0 || j >= ids.length) return h;
      [ids[i], ids[j]] = [ids[j], ids[i]];
      return { ...h, featuredProductIds: ids };
    });

  if (!products.length) {
    return <p className={styles.helpText}>Nenhum produto cadastrado ainda.</p>;
  }

  return (
    <div className={styles.productsPickerGrid}>
      {products.map((p) => {
        const order = featuredProductIds.indexOf(p.id);
        const selected = order !== -1;
        return (
          <div key={p.id} className={`${styles.productPickCard} ${selected ? styles.productPickActive : ""}`}>
            <button type="button" className={styles.productPickToggle} onClick={() => toggle(p.id)}>
              <span className={styles.productPickThumb}>
                {p.imageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={p.imageUrl} alt="" className={styles.productPickImg} />
                ) : (
                  p.name.slice(0, 1)
                )}
              </span>
              <span className={styles.productPickName}>{p.name}</span>
              {selected && <span className={styles.productPickBadge}>{order + 1}</span>}
            </button>
            {selected && (
              <div className={styles.productPickReorder}>
                <button type="button" onClick={() => move(p.id, -1)} disabled={order === 0}>↑</button>
                <button type="button" onClick={() => move(p.id, 1)} disabled={order === featuredProductIds.length - 1}>↓</button>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

function GalleryEditor({ gallery, setHome }) {
  const setCaption = (i) => (e) =>
    setHome((h) => ({ ...h, gallery: h.gallery.map((g, idx) => (idx === i ? { ...g, caption: e.target.value } : g)) }));
  const setUrl = (i, url) =>
    setHome((h) => ({ ...h, gallery: h.gallery.map((g, idx) => (idx === i ? { ...g, url } : g)) }));
  const addPhoto = () => setHome((h) => ({ ...h, gallery: [...h.gallery, { url: "", caption: "foto: nova imagem" }] }));
  const removePhoto = (i) => setHome((h) => ({ ...h, gallery: h.gallery.filter((_, idx) => idx !== i) }));

  return (
    <>
      <div className={styles.galleryEditGrid}>
        {gallery.map((photo, i) => (
          <GalleryUploadSlot
            key={i}
            photo={photo}
            onCaptionChange={setCaption(i)}
            onUploaded={(url) => setUrl(i, url)}
            onRemove={() => removePhoto(i)}
            disableRemove={gallery.length <= 1}
          />
        ))}
      </div>
      <button type="button" className={styles.addBtn} onClick={addPhoto}>+ Adicionar foto</button>
    </>
  );
}

function GalleryUploadSlot({ photo, onCaptionChange, onUploaded, onRemove, disableRemove }) {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState(null);

  const handleFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setError(null);
    const formData = new FormData();
    formData.set("photo", file);
    startTransition(async () => {
      const result = await uploadGalleryPhotoAction(formData);
      if (result.error) setError(result.error);
      else onUploaded(result.url);
    });
    e.target.value = "";
  };

  return (
    <div className={styles.galleryEditCard}>
      <div className={styles.galleryThumb}>
        {photo.url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={photo.url} alt="" className={styles.galleryThumbImg} />
        ) : (
          <span className={styles.galleryThumbEmpty}>Sem foto</span>
        )}
        {pending && <span className={styles.galleryThumbPending}>Enviando...</span>}
      </div>
      <label className={styles.uploadBtn}>
        {photo.url ? "Trocar foto" : "Enviar foto"}
        <input type="file" accept="image/jpeg,image/png,image/webp,image/gif" onChange={handleFile} hidden />
      </label>
      <input className={styles.input} placeholder="Legenda" value={photo.caption} onChange={onCaptionChange} />
      {error && <span className={styles.statusError}>{error}</span>}
      <button type="button" className={styles.removeBtn} onClick={onRemove} disabled={disableRemove}>
        Remover
      </button>
    </div>
  );
}

function ContatoForm({ contato, setContato }) {
  const set = (key) => (e) => setContato((c) => ({ ...c, [key]: e.target.value }));
  const toggleSection = (key) => () =>
    setContato((c) => ({ ...c, sections: { ...c.sections, [key]: !c.sections[key] } }));

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

      <Section
        title="Informações"
        visible={contato.sections.informacoes}
        onToggleVisible={toggleSection("informacoes")}
      >
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
      </Section>

      <Section title="Mapa">
        <Field label="URL do mapa (Google Maps embed)">
          <input className={styles.input} value={contato.mapEmbedUrl} onChange={set("mapEmbedUrl")} />
        </Field>
      </Section>
    </>
  );
}

function HomePreview({ home, products, categories }) {
  const featuredProducts = home.featuredProductIds
    .map((id) => products.find((p) => p.id === id))
    .filter(Boolean);
  const sections = home.sections;
  const mono = home.heroTheme === "grayscale";

  return (
    <div className={pageStyles.pageContainer} style={{ borderRadius: 16, overflow: "hidden" }}>
      {/* min-height do hero é em vh (viewport real) no site público; dentro do
          preview isso deixa uma faixa em branco enorme, então limitamos aqui. */}
      <section className={`${pageStyles.hero} ${mono ? pageStyles.heroMono : ""}`} style={{ minHeight: "auto" }}>
        <div className={pageStyles.heroGrid} aria-hidden="true" />
        <div className={pageStyles.blurRed} aria-hidden="true" />
        <div className={pageStyles.blurYellow} aria-hidden="true" />
        <div className={pageStyles.heroInner}>
          {sections.banner && (
            <div className={pageStyles.bannerStrip}>
              {home.bannerMessages.map((msg, i) => (
                <span key={i} className={pageStyles.bannerSlide} style={{ animationDelay: `${i * 3}s` }}>
                  {msg}
                </span>
              ))}
            </div>
          )}
          <div>
            <div className={pageStyles.badge}>{home.heroKicker}</div>
            <h1 className={pageStyles.heroTitle}>
              {home.heroTitleBefore} <span style={{ color: mono ? "#16181B" : "#E30613" }}>{home.heroTitleRed}</span> {home.heroTitleMiddle}{" "}
              <span style={{ color: mono ? "#5B6168" : "#FFD400" }}>{home.heroTitleYellow}</span>
              {home.heroTitleAfter}
            </h1>
            <p className={pageStyles.heroLead}>{home.heroLead}</p>
            <div className={pageStyles.ctaRow}>
              <span className={pageStyles.ctaWhats}>Falar no WhatsApp</span>
              <span className={pageStyles.ctaCatalog}>{home.ctaCatalogLabel}</span>
            </div>
            {sections.numeros && (
              <div className={pageStyles.statsRow}>
                {home.heroStats.map((s, i) => (
                  <div key={i}>
                    <div className={pageStyles.statNum}>{s.value}</div>
                    <div className={pageStyles.statLabel}>{s.label}</div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <HeroProductBanner products={featuredProducts} mono={mono} />
        </div>
      </section>

      {sections.categorias && categories.length > 0 && (
        <section className={pageStyles.categoriesSection}>
          <div className={pageStyles.sectionHead}>
            <div className={pageStyles.eyebrow}>CATEGORIAS</div>
            <h2 className={pageStyles.sectionTitle}>Encontre o que sua empresa precisa</h2>
          </div>
          <div className={pageStyles.categoriesGrid}>
            {categories.map((c) => (
              <CategoryTile key={c.id} category={c} />
            ))}
          </div>
        </section>
      )}

      {sections.destaque && featuredProducts.length > 0 && (
        <section className={pageStyles.featuredSection}>
          <div className={pageStyles.featuredInner}>
            <div className={pageStyles.featuredHead}>
              <div>
                <div className={pageStyles.eyebrow}>PRODUTOS EM DESTAQUE</div>
                <h2 className={pageStyles.sectionTitle}>Os mais procurados</h2>
              </div>
              <span className={pageStyles.viewAllLink}>Ver catálogo completo →</span>
            </div>
            <div className={pageStyles.productsGrid}>
              {featuredProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        </section>
      )}

      {sections.diferenciais && (
        <section className={pageStyles.featuresSection}>
          <div className={pageStyles.sectionHead}>
            <div className={pageStyles.eyebrow}>POR QUE A PARATECH</div>
            <h2 className={pageStyles.sectionTitle}>Diferenciais que fazem a diferença</h2>
          </div>
          <div className={pageStyles.featuresGrid}>
            {home.features.map((f, i) => (
              <div key={i} className={pageStyles.featureCard}>
                <div className={pageStyles.featureIconWrap} style={{ background: FEATURE_ICONS[i].iconBg }}>
                  {FEATURE_ICONS[i].icon}
                </div>
                <div className={pageStyles.featureTitle}>{f.title}</div>
                <div className={pageStyles.featureDesc}>{f.desc}</div>
              </div>
            ))}
          </div>
        </section>
      )}

      {sections.contadores && (
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
      )}

      {sections.promocao && (
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
      )}

      {sections.depoimentos && (
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
      )}

      {sections.galeria && (
        <section className={pageStyles.gallerySection}>
          <div className={pageStyles.sectionHead}>
            <div className={pageStyles.eyebrow}>GALERIA</div>
            <h2 className={pageStyles.sectionTitle}>Nossa loja e equipe</h2>
          </div>
          <div className={pageStyles.galleryGrid}>
            {home.gallery.map((photo, i) =>
              photo.url ? (
                <div key={i} className={pageStyles.galleryPhoto}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={photo.url}
                    alt={photo.caption}
                    style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
                  />
                  <span className={pageStyles.galleryCaption}>{photo.caption}</span>
                </div>
              ) : (
                <div key={i} className={pageStyles.galleryPlaceholder}>{photo.caption}</div>
              )
            )}
          </div>
        </section>
      )}

      {sections.visite && (
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
      )}

      <SiteFooterFull categories={categories} />
    </div>
  );
}

function ContatoPreview({ contato }) {
  return (
    <div className={contatoStyles.contatoContainer} style={{ borderRadius: 16, overflow: "hidden" }}>
      <section className={contatoStyles.hero}>
        <div className={contatoStyles.eyebrow}>{contato.heroEyebrow}</div>
        <h1 className={contatoStyles.title}>{contato.heroTitle}</h1>
      </section>
      <section className={contatoStyles.content}>
        {contato.sections.informacoes && (
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
        )}
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
