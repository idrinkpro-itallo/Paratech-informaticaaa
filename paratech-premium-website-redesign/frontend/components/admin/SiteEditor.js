"use client";

import { useMemo, useState, useTransition } from "react";
import {
  saveSiteContentAction,
  uploadGalleryPhotoAction,
  toggleCategoryVisibilityAction,
  updateCategoryCoverImageAction,
  createCategoryAction,
} from "@/app/admin/site/actions";
import BannerTicker from "@/components/home/BannerTicker";
import HeroSwitch from "@/components/home/hero/HeroSwitch";
import { PRODUTO_THEMES, BENCHMARK_THEMES, ANTES_DEPOIS_THEMES } from "@/lib/hero-themes";
import { CATEGORY_COLOR_PRESETS } from "@/lib/category-presets";
import { FEATURE_ICONS } from "@/components/home/FeatureIcons";
import ProductCard from "@/components/ProductCard";
import CategoryTile from "@/components/CategoryTile";
import { SiteFooterFull } from "@/components/SiteFooter";
import pageStyles from "@/app/page.module.css";
import contatoStyles from "@/components/contato/Contato.module.css";
import styles from "./SiteEditor.module.css";

const HERO_VARIANTS = [
  { id: "produto", label: "Peça em Destaque" },
  { id: "benchmark", label: "Benchmark ao Vivo" },
  { id: "antesDepois", label: "Antes/Depois" },
  { id: "classico", label: "Clássico" },
];

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

  const handleCategoryCreated = (category) => {
    setCategoryList((list) => [...list, category]);
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
              onCategoryCreated={handleCategoryCreated}
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

function CategoryVisibilityList({ categories, pending, errors, onToggle, onUploadImage, onCategoryCreated }) {
  const handleFileChange = (id) => (e) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (file) onUploadImage(id, file);
  };

  return (
    <>
      <AddCategoryForm onCreated={onCategoryCreated} />
      {!categories.length && <p className={styles.helpText}>Nenhuma categoria cadastrada ainda.</p>}
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
    </>
  );
}

function AddCategoryForm({ onCreated }) {
  const [label, setLabel] = useState("");
  const [preset, setPreset] = useState(CATEGORY_COLOR_PRESETS[0].id);
  const [error, setError] = useState(null);
  const [pending, startTransition] = useTransition();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!label.trim()) {
      setError("Informe o nome da categoria.");
      return;
    }
    setError(null);
    const formData = new FormData();
    formData.set("label", label.trim());
    formData.set("preset", preset);
    startTransition(async () => {
      const result = await createCategoryAction(formData);
      if (result?.error) {
        setError(result.error);
        return;
      }
      onCreated(result.category);
      setLabel("");
    });
  };

  return (
    <form className={styles.addCategoryForm} onSubmit={handleSubmit}>
      <input
        className={styles.input}
        placeholder="Nome da nova categoria (ex.: Cadeiras Gamer)"
        value={label}
        onChange={(e) => setLabel(e.target.value)}
        disabled={pending}
      />
      <div className={styles.swatchRow}>
        {CATEGORY_COLOR_PRESETS.map((p) => (
          <button
            key={p.id}
            type="button"
            className={`${styles.swatchBtn} ${preset === p.id ? styles.swatchBtnActive : ""}`}
            onClick={() => setPreset(p.id)}
            title={p.name}
          >
            <span className={styles.swatchDot} style={{ background: p.accent }} aria-hidden="true" />
            {p.name}
          </button>
        ))}
      </div>
      <button type="submit" className={styles.addBtn} disabled={pending}>
        {pending ? "Criando..." : "+ Adicionar categoria"}
      </button>
      {error && <span className={styles.statusError}>{error}</span>}
    </form>
  );
}

function HomeForm({
  home,
  setHome,
  products,
  categories,
  onToggleCategory,
  onUploadCategoryImage,
  onCategoryCreated,
  categoryPending,
  categoryErrors,
}) {
  const set = (key) => (e) => setHome((h) => ({ ...h, [key]: e.target.value }));

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

  return (
    <>
      <HeroEditor hero={home.hero} setHome={setHome} products={products} />

      <Section title="Categorias" visible={home.sections.categorias} onToggleVisible={toggleSection("categorias")}>
        <p className={styles.helpText}>
          Grade gerada automaticamente a partir das categorias cadastradas. Desligue a chave acima pra tirar a
          seção inteira da Home, ou oculte categorias específicas abaixo — vale pra Home, Catálogo e rodapé ao
          mesmo tempo. Use "Trocar imagem" pra substituir o gradiente do tile por uma foto de capa. Categorias
          novas só aparecem no site depois de ter pelo menos um produto cadastrado nelas.
        </p>
        <CategoryVisibilityList
          categories={categories}
          pending={categoryPending}
          errors={categoryErrors}
          onToggle={onToggleCategory}
          onUploadImage={onUploadCategoryImage}
          onCategoryCreated={onCategoryCreated}
        />
      </Section>

      <Section
        title="Produtos em destaque (Os mais procurados)"
        visible={home.sections.destaque}
        onToggleVisible={toggleSection("destaque")}
      >
        <p className={styles.helpText}>
          Escolha quais produtos aparecem na grade &ldquo;Os mais procurados&rdquo;, abaixo do hero. Clique para
          selecionar; a ordem de seleção define a ordem de exibição — use as setas para reordenar. O produto
          exibido dentro do hero em si é escolhido separadamente, na seção &ldquo;Hero da Home&rdquo; acima.
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

// Editor do Hero da Home: os 4 modelos ficam sempre configurados ao mesmo
// tempo (hero.produto/benchmark/antesDepois/classico); as abas abaixo só
// escolhem qual está sendo editado no momento — trocar de modelo na Home é
// o botão "Usar este modelo na Home", que grava hero.variant.
function HeroEditor({ hero, setHome, products }) {
  const [tab, setTab] = useState(hero.variant);

  const setVariantContent = (variant) => (updater) =>
    setHome((h) => ({ ...h, hero: { ...h.hero, [variant]: updater(h.hero[variant]) } }));

  const activateVariant = (variant) => setHome((h) => ({ ...h, hero: { ...h.hero, variant } }));

  return (
    <Section title="Hero da Home">
      <p className={styles.helpText}>
        Os 4 modelos ficam sempre salvos — escolha uma aba para editar o conteúdo dela e use o botão para decidir
        qual aparece na Home.
      </p>
      <div className={styles.heroThemeToggle} role="tablist" aria-label="Modelo de hero a editar">
        {HERO_VARIANTS.map((v) => (
          <button
            key={v.id}
            type="button"
            role="tab"
            aria-selected={tab === v.id}
            className={`${styles.heroThemeBtn} ${tab === v.id ? styles.heroThemeBtnActive : ""}`}
            onClick={() => setTab(v.id)}
          >
            {v.label}
          </button>
        ))}
      </div>

      <div className={styles.heroActiveRow}>
        {hero.variant === tab ? (
          <span className={styles.heroActiveBadge}>✓ Ativo na Home agora</span>
        ) : (
          <button type="button" className={styles.addBtn} onClick={() => activateVariant(tab)}>
            Usar este modelo na Home
          </button>
        )}
      </div>

      {tab === "produto" && (
        <ProdutoFields content={hero.produto} setContent={setVariantContent("produto")} products={products} />
      )}
      {tab === "benchmark" && (
        <BenchmarkFields content={hero.benchmark} setContent={setVariantContent("benchmark")} />
      )}
      {tab === "antesDepois" && (
        <AntesDepoisFields content={hero.antesDepois} setContent={setVariantContent("antesDepois")} products={products} />
      )}
      {tab === "classico" && (
        <ClassicoFields content={hero.classico} setContent={setVariantContent("classico")} products={products} />
      )}
    </Section>
  );
}

function ThemeSwatches({ themes, value, onChange, colorKey = "accent" }) {
  return (
    <div className={styles.swatchRow} role="radiogroup" aria-label="Tema de cor">
      {themes.map((t) => (
        <button
          key={t.id}
          type="button"
          role="radio"
          aria-checked={value === t.id}
          className={`${styles.swatchBtn} ${value === t.id ? styles.swatchBtnActive : ""}`}
          onClick={() => onChange(t.id)}
          title={t.name}
        >
          <span className={styles.swatchDot} style={{ background: t[colorKey] }} aria-hidden="true" />
          {t.name}
        </button>
      ))}
    </div>
  );
}

function SingleProductPicker({ products, value, onChange }) {
  if (!products.length) {
    return <p className={styles.helpText}>Nenhum produto cadastrado ainda.</p>;
  }
  return (
    <div className={styles.productsPickerGrid}>
      {products.map((p) => {
        const selected = value === p.id;
        return (
          <div key={p.id} className={`${styles.productPickCard} ${selected ? styles.productPickActive : ""}`}>
            <button type="button" className={styles.productPickToggle} onClick={() => onChange(p.id)}>
              <span className={styles.productPickThumb}>
                {p.imageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={p.imageUrl} alt="" className={styles.productPickImg} />
                ) : (
                  p.name.slice(0, 1)
                )}
              </span>
              <span className={styles.productPickName}>{p.name}</span>
            </button>
          </div>
        );
      })}
    </div>
  );
}

function ProdutoFields({ content, setContent, products }) {
  const set = (key) => (e) => setContent((c) => ({ ...c, [key]: e.target.value }));
  const setBool = (key) => (e) => setContent((c) => ({ ...c, [key]: e.target.checked }));
  const setStat = (index, key) => (e) =>
    setContent((c) => ({ ...c, stats: c.stats.map((s, i) => (i === index ? { ...s, [key]: e.target.value } : s)) }));

  return (
    <>
      <Field label="Tema de cor">
        <ThemeSwatches themes={PRODUTO_THEMES} value={content.theme} onChange={(id) => setContent((c) => ({ ...c, theme: id }))} />
      </Field>
      <Field label="Produto em destaque">
        <SingleProductPicker
          products={products}
          value={content.featuredProductId}
          onChange={(id) => setContent((c) => ({ ...c, featuredProductId: id }))}
        />
      </Field>
      <Field label="Selo (acima do título)">
        <input className={styles.input} value={content.kicker} onChange={set("kicker")} />
      </Field>
      <div className={styles.row3}>
        <Field label="Texto antes">
          <input className={styles.input} value={content.titleBefore} onChange={set("titleBefore")} />
        </Field>
        <Field label="Palavra riscada">
          <input className={styles.input} value={content.titleStrike} onChange={set("titleStrike")} />
        </Field>
        <Field label="Palavra revelada (cor do tema)">
          <input className={styles.input} value={content.titleAfter} onChange={set("titleAfter")} />
        </Field>
      </div>
      <Field label="Texto de apoio (parágrafo)">
        <textarea className={styles.input} rows={3} value={content.lead} onChange={set("lead")} />
      </Field>
      <Field label="Selo flutuante (ex.: oferta)">
        <input className={styles.input} value={content.badgeText} onChange={set("badgeText")} />
      </Field>
      <div className={styles.row2}>
        <Field label="Mensagem do botão WhatsApp">
          <input className={styles.input} value={content.ctaWhatsMessage} onChange={set("ctaWhatsMessage")} />
        </Field>
        <Field label="Texto do botão Catálogo">
          <input className={styles.input} value={content.ctaCatalogLabel} onChange={set("ctaCatalogLabel")} />
        </Field>
      </div>
      <label className={styles.visToggle}>
        <input type="checkbox" checked={content.showStats} onChange={setBool("showStats")} />
        <span className={styles.visSwitch} aria-hidden="true" />
        <span className={styles.visLabel}>Mostrar números (+15 anos, etc.)</span>
      </label>
      {content.showStats && (
        <div className={styles.row3}>
          {content.stats.map((s, i) => (
            <div key={i} className={styles.statPair}>
              <input className={styles.input} placeholder="Valor" value={s.value} onChange={setStat(i, "value")} />
              <input className={styles.input} placeholder="Legenda" value={s.label} onChange={setStat(i, "label")} />
            </div>
          ))}
        </div>
      )}
    </>
  );
}

function BenchmarkFields({ content, setContent }) {
  const set = (key) => (e) => setContent((c) => ({ ...c, [key]: e.target.value }));

  return (
    <>
      <Field label="Tema de cor">
        <ThemeSwatches themes={BENCHMARK_THEMES} value={content.theme} onChange={(id) => setContent((c) => ({ ...c, theme: id }))} colorKey="digit" />
      </Field>
      <Field label="Selo (acima do título)">
        <input className={styles.input} value={content.kicker} onChange={set("kicker")} />
      </Field>
      <Field label="Título">
        <input className={styles.input} value={content.title} onChange={set("title")} />
      </Field>
      <Field label="Texto de apoio (parágrafo)">
        <textarea className={styles.input} rows={3} value={content.lead} onChange={set("lead")} />
      </Field>
      <div className={styles.row2}>
        <Field label="Mensagem do botão WhatsApp">
          <input className={styles.input} value={content.ctaWhatsMessage} onChange={set("ctaWhatsMessage")} />
        </Field>
        <Field label="Texto do botão">
          <input className={styles.input} value={content.ctaLabel} onChange={set("ctaLabel")} />
        </Field>
      </div>
      <div className={styles.row2}>
        <Field label="Rótulo da métrica">
          <input className={styles.input} value={content.metricLabel} onChange={set("metricLabel")} />
        </Field>
        <Field label="Unidade">
          <input className={styles.input} value={content.metricUnit} onChange={set("metricUnit")} />
        </Field>
      </div>
      <Field label="Valor da métrica (número que sobe no odômetro)">
        <input type="number" className={styles.input} value={content.metricValue} onChange={set("metricValue")} />
      </Field>
      <div className={styles.row2}>
        <Field label="Rótulo comparativo (ex.: HD antigo)">
          <input className={styles.input} value={content.compareLabel} onChange={set("compareLabel")} />
        </Field>
        <Field label="Barra comparativa (% do valor principal)">
          <input type="number" min={0} max={100} className={styles.input} value={content.comparePercent} onChange={set("comparePercent")} />
        </Field>
      </div>
      <Field label="Texto de ganho (ex.: +34x mais rápido)">
        <input className={styles.input} value={content.gainLabel} onChange={set("gainLabel")} />
      </Field>
    </>
  );
}

function AntesDepoisFields({ content, setContent, products }) {
  const set = (key) => (e) => setContent((c) => ({ ...c, [key]: e.target.value }));

  return (
    <>
      <Field label="Tema de cor (lado 'depois')">
        <ThemeSwatches themes={ANTES_DEPOIS_THEMES} value={content.theme} onChange={(id) => setContent((c) => ({ ...c, theme: id }))} />
      </Field>
      <Field label="Produto em destaque (aparece nos dois lados: cinza e colorido)">
        <SingleProductPicker
          products={products}
          value={content.featuredProductId}
          onChange={(id) => setContent((c) => ({ ...c, featuredProductId: id }))}
        />
      </Field>
      <div className={styles.row2}>
        <Field label="Título (lado cinza)">
          <input className={styles.input} value={content.titleBefore} onChange={set("titleBefore")} />
        </Field>
        <Field label="Título (lado colorido)">
          <input className={styles.input} value={content.titleAfter} onChange={set("titleAfter")} />
        </Field>
      </div>
      <Field label="Subtítulo (opcional)">
        <input className={styles.input} value={content.subtitle} onChange={set("subtitle")} />
      </Field>
      <div className={styles.row2}>
        <Field label="Rótulo do lado esquerdo">
          <input className={styles.input} value={content.beforeLabel} onChange={set("beforeLabel")} />
        </Field>
        <Field label="Rótulo do lado direito">
          <input className={styles.input} value={content.afterLabel} onChange={set("afterLabel")} />
        </Field>
      </div>
      <div className={styles.row2}>
        <Field label="Mensagem do botão WhatsApp">
          <input className={styles.input} value={content.ctaWhatsMessage} onChange={set("ctaWhatsMessage")} />
        </Field>
        <Field label="Texto do botão">
          <input className={styles.input} value={content.ctaLabel} onChange={set("ctaLabel")} />
        </Field>
      </div>
    </>
  );
}

function ClassicoFields({ content, setContent, products }) {
  const set = (key) => (e) => setContent((c) => ({ ...c, [key]: e.target.value }));
  const setStat = (index, key) => (e) =>
    setContent((c) => ({ ...c, stats: c.stats.map((s, i) => (i === index ? { ...s, [key]: e.target.value } : s)) }));
  const setSlide = (index, key) => (e) =>
    setContent((c) => ({ ...c, slides: c.slides.map((s, i) => (i === index ? { ...s, [key]: e.target.value } : s)) }));
  const setSlideProduct = (index) => (e) =>
    setContent((c) => ({
      ...c,
      slides: c.slides.map((s, i) => (i === index ? { ...s, productId: Number(e.target.value) } : s)),
    }));

  return (
    <>
      <label className={styles.visToggle}>
        <input
          type="checkbox"
          checked={content.theme === "escuro"}
          onChange={(e) => setContent((c) => ({ ...c, theme: e.target.checked ? "escuro" : "claro" }))}
        />
        <span className={styles.visSwitch} aria-hidden="true" />
        <span className={styles.visLabel}>Tema escuro (desligado = fundo claro, texto preto)</span>
      </label>
      <Field label="Selo (acima do título)">
        <input className={styles.input} value={content.kicker} onChange={set("kicker")} />
      </Field>
      <div className={styles.row3}>
        <Field label="Texto antes">
          <input className={styles.input} value={content.titleBefore} onChange={set("titleBefore")} />
        </Field>
        <Field label="Palavra em vermelho/preto">
          <input className={styles.input} value={content.titleRed} onChange={set("titleRed")} />
        </Field>
        <Field label="Texto do meio">
          <input className={styles.input} value={content.titleMiddle} onChange={set("titleMiddle")} />
        </Field>
      </div>
      <div className={styles.row2}>
        <Field label="Palavra em amarelo/cinza">
          <input className={styles.input} value={content.titleYellow} onChange={set("titleYellow")} />
        </Field>
        <Field label="Texto depois (pontuação, etc.)">
          <input className={styles.input} value={content.titleAfter} onChange={set("titleAfter")} />
        </Field>
      </div>
      <Field label="Texto de apoio (parágrafo)">
        <textarea className={styles.input} rows={3} value={content.lead} onChange={set("lead")} />
      </Field>
      <div className={styles.row2}>
        <Field label="Mensagem do botão WhatsApp">
          <input className={styles.input} value={content.ctaWhatsMessage} onChange={set("ctaWhatsMessage")} />
        </Field>
        <Field label="Texto do botão Catálogo">
          <input className={styles.input} value={content.ctaCatalogLabel} onChange={set("ctaCatalogLabel")} />
        </Field>
      </div>
      <div className={styles.row3}>
        {content.stats.map((s, i) => (
          <div key={i} className={styles.statPair}>
            <input className={styles.input} placeholder="Valor" value={s.value} onChange={setStat(i, "value")} />
            <input className={styles.input} placeholder="Legenda" value={s.label} onChange={setStat(i, "label")} />
          </div>
        ))}
      </div>
      <Field label="Card lateral: produtos em rotação (4 slides)">
        <div className={styles.helpText}>Cada slide mostra um produto com uma frase de destaque própria.</div>
        {content.slides.map((s, i) => (
          <div key={i} className={styles.row3} style={{ marginBottom: 10 }}>
            <select className={styles.input} value={s.productId} onChange={setSlideProduct(i)}>
              {products.map((p) => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
            <input className={styles.input} placeholder="Selo do slide" value={s.kicker} onChange={setSlide(i, "kicker")} />
            <input className={styles.input} placeholder="Frase de destaque" value={s.headline} onChange={setSlide(i, "headline")} />
          </div>
        ))}
      </Field>
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

  return (
    <div className={pageStyles.pageContainer} style={{ borderRadius: 16, overflow: "hidden" }}>
      {sections.banner && <BannerTicker messages={home.bannerMessages} />}
      <HeroSwitch hero={home.hero} products={products} />

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
