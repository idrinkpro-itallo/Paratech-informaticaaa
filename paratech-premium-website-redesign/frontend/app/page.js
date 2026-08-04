import Link from "next/link";
import Image from "next/image";
import styles from "./page.module.css";
import Reveal from "@/components/Reveal";
import SiteHeader from "@/components/SiteHeader";
import { SiteFooterFull } from "@/components/SiteFooter";
import WhatsAppFab from "@/components/WhatsAppFab";
import ProductCard from "@/components/ProductCard";
import CategoryTile from "@/components/CategoryTile";
import StatsCounters from "@/components/home/StatsCounters";
import TestimonialCarousel from "@/components/home/TestimonialCarousel";
import PromoCountdown from "@/components/home/PromoCountdown";
import BannerTicker from "@/components/home/BannerTicker";
import HeroSwitch from "@/components/home/hero/HeroSwitch";
import { FEATURE_ICONS } from "@/components/home/FeatureIcons";
import { WA_SUPPORT } from "@/lib/products-data";
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

  return (
    <>
      <SiteHeader active="home" />

      <div className={styles.pageContainer}>
      {sections.banner && <BannerTicker messages={home.bannerMessages} />}
      <HeroSwitch hero={home.hero} products={products} />

      {sections.categorias && (
        <section id="categorias" className={styles.categoriesSection}>
          <Reveal as="div" className={styles.sectionHead}>
            <div className={styles.eyebrow}>CATEGORIAS</div>
            <h2 className={styles.sectionTitle}>Encontre o que sua empresa precisa</h2>
          </Reveal>
          <div className={styles.categoriesGrid}>
            {categories.map((c, i) => (
              <Reveal as="div" key={c.id} delay={i * 60}>
                <CategoryTile category={c} index={i} />
              </Reveal>
            ))}
          </div>
        </section>
      )}

      {sections.destaque && (
        <section className={styles.featuredSection}>
          <div className={styles.featuredInner}>
            <Reveal as="div" className={styles.featuredHead}>
              <div>
                <div className={styles.eyebrow}>PRODUTOS EM DESTAQUE</div>
                <h2 className={styles.sectionTitle}>Os mais procurados</h2>
              </div>
              <Link href="/catalogo" className={styles.viewAllLink}>Ver catálogo completo →</Link>
            </Reveal>
            <div className={styles.productsGrid}>
              {featuredProducts.map((p, i) => (
                <Reveal as="div" key={p.id} delay={i * 60}>
                  <ProductCard product={p} />
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {sections.diferenciais && (
        <section className={styles.featuresSection}>
          <Reveal as="div" className={styles.sectionHead}>
            <div className={styles.eyebrow}>POR QUE A PARATECH</div>
            <h2 className={styles.sectionTitle}>Diferenciais que fazem a diferença</h2>
          </Reveal>
          <div className={styles.featuresGrid}>
            {home.features.map((f, i) => (
              <Reveal as="div" key={i} delay={i * 60} className={styles.featureCard}>
                <div className={styles.featureIconWrap} style={{ background: FEATURE_ICONS[i].iconBg }}>
                  {FEATURE_ICONS[i].icon}
                </div>
                <div className={styles.featureTitle}>{f.title}</div>
                <div className={styles.featureDesc}>{f.desc}</div>
              </Reveal>
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
          <Reveal as="div" className={styles.sectionHead}>
            <div className={styles.eyebrow}>GALERIA</div>
            <h2 className={styles.sectionTitle}>Nossa loja e equipe</h2>
          </Reveal>
          <div className={styles.galleryGrid}>
            {home.gallery.map((photo, i) =>
              photo.url ? (
                <Reveal as="div" key={i} delay={i * 60} className={styles.galleryPhoto}>
                  <Image
                    src={photo.url}
                    alt={photo.caption}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 960px) 50vw, 33vw"
                    style={{ objectFit: "cover" }}
                  />
                  <span className={styles.galleryCaption}>{photo.caption}</span>
                </Reveal>
              ) : (
                <div key={i} className={styles.galleryPlaceholder}>{photo.caption}</div>
              )
            )}
          </div>
        </section>
      )}

      {sections.visite && (
        <section className={styles.visitSection}>
          <Reveal as="div" className={styles.visitRow}>
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
                Fale agora com um especialista
              </a>
            </div>
          </Reveal>
        </section>
      )}

      <SiteFooterFull categories={categories} />
      </div>
      <WhatsAppFab showCatalogLink />
    </>
  );
}
