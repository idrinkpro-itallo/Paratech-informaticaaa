import Link from "next/link";
import Image from "next/image";
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
import { FEATURE_ICONS } from "@/components/home/FeatureIcons";
import { WA_SALES, WA_SUPPORT, waLink } from "@/lib/products-data";
import { getActiveCategories, getAllProducts } from "@/lib/products";
import { getSiteContent } from "@/lib/site-content";

// Catálogo e conteúdo editável são gerenciados pelo /admin — mantém sempre a
// data mais recente do banco em vez de congelar no build.
export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [categories, products, home] = await Promise.all([
    getActiveCategories(),
    getAllProducts(),
    getSiteContent("home"),
  ]);
  const featuredProducts = home.featuredProductIds
    .map((id) => products.find((p) => p.id === id))
    .filter(Boolean);

  const sections = home.sections;
  const mono = home.heroTheme === "grayscale";

  return (
    <>
      <SiteHeader active="home" forceDark={mono} />

      <div className={styles.pageContainer}>
      <section className={`${styles.hero} ${mono ? styles.heroMono : ""}`}>
        <div className={styles.heroGrid} aria-hidden="true" />
        <div className={styles.blurRed} aria-hidden="true" />
        <div className={styles.blurYellow} aria-hidden="true" />

        <div className={styles.heroInner}>
          {sections.banner && (
            <div className={styles.bannerStrip}>
              {home.bannerMessages.map((msg, i) => (
                <span key={i} className={styles.bannerSlide} style={{ animationDelay: `${i * 3}s` }}>{msg}</span>
              ))}
            </div>
          )}
          <div>
            <div className={styles.badge}>{home.heroKicker}</div>
            <h1 className={styles.heroTitle}>
              {home.heroTitleBefore} <span style={{ color: mono ? "#16181B" : "#E30613" }}>{home.heroTitleRed}</span> {home.heroTitleMiddle}{" "}
              <span style={{ color: mono ? "#5B6168" : "#FFD400" }}>{home.heroTitleYellow}</span>
              {home.heroTitleAfter}
            </h1>
            <p className={styles.heroLead}>{home.heroLead}</p>
            <div className={styles.ctaRow}>
              <a
                href={waLink(WA_SALES, home.ctaWhatsMessage)}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.ctaWhats}
              >
                Falar no WhatsApp
              </a>
              <Link href="/catalogo" className={styles.ctaCatalog}>{home.ctaCatalogLabel}</Link>
            </div>
            {sections.numeros && (
              <div className={styles.statsRow}>
                {home.heroStats.map((s, i) => (
                  <div key={i}>
                    <div className={styles.statNum}>{s.value}</div>
                    <div className={styles.statLabel}>{s.label}</div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <HeroProductBanner products={featuredProducts} mono={mono} />
        </div>
      </section>

      {sections.categorias && (
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
      )}

      {sections.destaque && (
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
      )}

      {sections.diferenciais && (
        <section className={styles.featuresSection}>
          <div className={styles.sectionHead}>
            <div className={styles.eyebrow}>POR QUE A PARATECH</div>
            <h2 className={styles.sectionTitle}>Diferenciais que fazem a diferença</h2>
          </div>
          <div className={styles.featuresGrid}>
            {home.features.map((f, i) => (
              <div key={i} className={styles.featureCard}>
                <div className={styles.featureIconWrap} style={{ background: FEATURE_ICONS[i].iconBg }}>
                  {FEATURE_ICONS[i].icon}
                </div>
                <div className={styles.featureTitle}>{f.title}</div>
                <div className={styles.featureDesc}>{f.desc}</div>
              </div>
            ))}
          </div>
        </section>
      )}

      {sections.contadores && <StatsCounters targets={home.countersTargets} />}

      {sections.promocao && (
        <PromoCountdown
          badge={home.promoBadge}
          title={home.promoTitle}
          text={home.promoText}
          ctaLabel={home.promoCtaLabel}
        />
      )}

      {sections.depoimentos && <TestimonialCarousel testimonials={home.testimonials} />}

      {sections.galeria && (
        <section className={styles.gallerySection}>
          <div className={styles.sectionHead}>
            <div className={styles.eyebrow}>GALERIA</div>
            <h2 className={styles.sectionTitle}>Nossa loja e equipe</h2>
          </div>
          <div className={styles.galleryGrid}>
            {home.gallery.map((photo, i) =>
              photo.url ? (
                <div key={i} className={styles.galleryPhoto}>
                  <Image
                    src={photo.url}
                    alt={photo.caption}
                    fill
                    sizes="(max-width: 640px) 50vw, 33vw"
                    style={{ objectFit: "cover" }}
                  />
                  <span className={styles.galleryCaption}>{photo.caption}</span>
                </div>
              ) : (
                <div key={i} className={styles.galleryPlaceholder}>{photo.caption}</div>
              )
            )}
          </div>
        </section>
      )}

      {sections.visite && (
        <section className={styles.visitSection}>
          <div className={styles.visitRow}>
            <div>
              <h3 className={styles.visitTitle}>{home.visitTitle}</h3>
              <p className={styles.visitSubtitle}>{home.visitSubtitle}</p>
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
      )}

      <SiteFooterFull categories={categories} />
      </div>
      <WhatsAppFab showCatalogLink />
    </>
  );
}
