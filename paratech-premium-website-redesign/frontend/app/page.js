import Link from "next/link";
import styles from "./page.module.css";
import SiteHeader from "@/components/SiteHeader";
import { SiteFooterFull } from "@/components/SiteFooter";
import WhatsAppFab from "@/components/WhatsAppFab";
import ProductCard from "@/components/ProductCard";
import CategoryTile from "@/components/CategoryTile";
import StatsCounters from "@/components/home/StatsCounters";
import TestimonialCarousel from "@/components/home/TestimonialCarousel";
import PromoCountdown from "@/components/home/PromoCountdown";
import HeroProductBanner from "@/components/home/HeroProductBanner";
import { WA_SALES, WA_SUPPORT, waLink } from "@/lib/products-data";
import { getActiveCategories, getAllProducts } from "@/lib/products";

// Catálogo é gerenciado pelo /admin — mantém sempre a data mais recente do
// banco em vez de congelar no build.
export const dynamic = "force-dynamic";

const FEATURED_PRODUCT_IDS = [1, 3, 10, 6];

const FEATURES = [
  { title: "Atendimento Especializado", desc: "Equipe técnica pronta para ajudar", iconBg: "rgba(227,6,19,.1)", icon: <div style={{ width: 18, height: 18, borderRadius: "50%", border: "3px solid #E30613" }} /> },
  { title: "Produtos Originais", desc: "Qualidade garantida em cada item", iconBg: "rgba(255,212,0,.14)", icon: <div style={{ width: 18, height: 18, borderRadius: 4, background: "#FFD400" }} /> },
  { title: "Garantia", desc: "Em todos os produtos e serviços", iconBg: "rgba(35,38,43,.08)", icon: <div style={{ width: 18, height: 18, border: "3px solid #23262B", borderRadius: "50%", borderTopColor: "transparent" }} /> },
  { title: "Entrega Rápida", desc: "Receba no conforto da sua casa", iconBg: "rgba(227,6,19,.1)", icon: <div style={{ width: 0, height: 0, borderLeft: "10px solid transparent", borderRight: "10px solid transparent", borderBottom: "16px solid #E30613" }} /> },
  { title: "Melhores Preços", desc: "Custo-benefício em toda a linha", iconBg: "rgba(255,212,0,.14)", icon: <div style={{ width: 20, height: 14, borderRadius: 3, border: "3px solid #FFD400" }} /> },
  { title: "Suporte Técnico", desc: "Sempre que você precisar", iconBg: "rgba(35,38,43,.08)", icon: <div style={{ width: 16, height: 16, background: "#23262B", transform: "rotate(45deg)" }} /> },
  { title: "Parcelamento Facilitado", desc: "Em até 10x no cartão", iconBg: "rgba(227,6,19,.1)", icon: <div style={{ width: 20, height: 14, borderRadius: 2, border: "3px solid #E30613" }} /> },
  { title: "+15 Anos de Mercado", desc: "Tradição e confiança em Pará de Minas", iconBg: "rgba(255,212,0,.14)", icon: <div style={{ width: 18, height: 18, borderRadius: "50%", background: "#FFD400" }} /> },
];

const GALLERY_CAPTIONS = [
  "foto: fachada da loja",
  "foto: equipe técnica",
  "foto: bancada de reparos",
  "foto: showroom",
  "foto: atendimento",
  "foto: estoque",
];

export default async function HomePage() {
  const [categories, products] = await Promise.all([getActiveCategories(), getAllProducts()]);
  const featuredProducts = FEATURED_PRODUCT_IDS
    .map((id) => products.find((p) => p.id === id))
    .filter(Boolean);

  return (
    <>
      <SiteHeader active="home" />

      <section className={styles.hero}>
        <div className={styles.heroGrid} aria-hidden="true" />
        <div className={styles.blurRed} aria-hidden="true" />
        <div className={styles.blurYellow} aria-hidden="true" />

        <div className={styles.heroInner}>
          <div className={styles.bannerStrip}>
            <span className={styles.bannerSlide} style={{ animationDelay: "0s" }}>Entrega rápida em Pará de Minas e região</span>
            <span className={styles.bannerSlide} style={{ animationDelay: "3s" }}>Atendimento direto pelo WhatsApp, sem robô</span>
            <span className={styles.bannerSlide} style={{ animationDelay: "6s" }}>+15 anos de experiência em tecnologia</span>
          </div>
          <div>
            <div className={styles.badge}>TECNOLOGIA · PARÁ DE MINAS/MG</div>
            <h1 className={styles.heroTitle}>
              A Tecnologia que <span style={{ color: "#E30613" }}>Move</span> o seu <span style={{ color: "#FFD400" }}>Negócio</span>.
            </h1>
            <p className={styles.heroLead}>
              Notebooks, computadores, periféricos, impressoras e acessórios com atendimento especializado e entrega rápida. Peça pelo WhatsApp e receba sem sair de casa.
            </p>
            <div className={styles.ctaRow}>
              <a
                href={waLink(WA_SALES, "Olá! Quero falar sobre produtos da Paratech.")}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.ctaWhats}
              >
                Falar no WhatsApp
              </a>
              <Link href="/catalogo" className={styles.ctaCatalog}>Ver Catálogo</Link>
            </div>
            <div className={styles.statsRow}>
              <div>
                <div className={styles.statNum}>+15 anos</div>
                <div className={styles.statLabel}>de mercado</div>
              </div>
              <div>
                <div className={styles.statNum}>+10.000</div>
                <div className={styles.statLabel}>clientes atendidos</div>
              </div>
              <div>
                <div className={styles.statNum}>98%</div>
                <div className={styles.statLabel}>satisfação</div>
              </div>
            </div>
          </div>

          <HeroProductBanner products={featuredProducts} />
        </div>
      </section>

      <section id="categorias" className={styles.categoriesSection}>
        <div className={styles.sectionHead}>
          <div className={styles.eyebrow}>CATEGORIAS</div>
          <h2 className={styles.sectionTitle}>Encontre o que sua empresa precisa</h2>
        </div>
        <div className={styles.categoriesGrid}>
          {categories.map((c) => (
            <CategoryTile key={c.id} category={c} />
          ))}
        </div>
      </section>

      <section className={styles.featuredSection}>
        <div className={styles.featuredInner}>
          <div className={styles.featuredHead}>
            <div>
              <div className={styles.eyebrow}>PRODUTOS EM DESTAQUE</div>
              <h2 className={styles.sectionTitle}>Os mais procurados</h2>
            </div>
            <Link href="/catalogo" className={styles.viewAllLink}>Ver catálogo completo →</Link>
          </div>
          <div className={styles.productsGrid}>
            {featuredProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      </section>

      <section className={styles.featuresSection}>
        <div className={styles.sectionHead}>
          <div className={styles.eyebrow}>POR QUE A PARATECH</div>
          <h2 className={styles.sectionTitle}>Diferenciais que fazem a diferença</h2>
        </div>
        <div className={styles.featuresGrid}>
          {FEATURES.map((f) => (
            <div key={f.title} className={styles.featureCard}>
              <div className={styles.featureIconWrap} style={{ background: f.iconBg }}>{f.icon}</div>
              <div className={styles.featureTitle}>{f.title}</div>
              <div className={styles.featureDesc}>{f.desc}</div>
            </div>
          ))}
        </div>
      </section>

      <StatsCounters />

      <PromoCountdown />

      <TestimonialCarousel />

      <section className={styles.gallerySection}>
        <div className={styles.sectionHead}>
          <div className={styles.eyebrow}>GALERIA</div>
          <h2 className={styles.sectionTitle}>Nossa loja e equipe</h2>
        </div>
        <div className={styles.galleryGrid}>
          {GALLERY_CAPTIONS.map((caption) => (
            <div key={caption} className={styles.galleryPlaceholder}>{caption}</div>
          ))}
        </div>
      </section>

      <section className={styles.visitSection}>
        <div className={styles.visitRow}>
          <div>
            <h3 className={styles.visitTitle}>Vem tomar um café e ver de perto</h3>
            <p className={styles.visitSubtitle}>R. Nova Serrana, 31, Loja — Nossa Sra. de Lourdes, Pará de Minas/MG</p>
          </div>
          <div className={styles.visitButtons}>
            <Link href="/contato" className={styles.visitMapBtn}>Ver no mapa</Link>
            <a
              href={`https://wa.me/${WA_SUPPORT}`}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.visitWhatsBtn}
            >
              Falar no WhatsApp
            </a>
          </div>
        </div>
      </section>

      <SiteFooterFull categories={categories} />
      <WhatsAppFab showCatalogLink />
    </>
  );
}
