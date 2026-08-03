import HeroProduto from "./HeroProduto";
import HeroBenchmark from "./HeroBenchmark";
import HeroAntesDepois from "./HeroAntesDepois";

// Escolhe qual dos 3 modelos de Hero renderizar a partir de hero.variant
// (editável na aba Site do /admin). Usado tanto na Home pública quanto no
// preview ao vivo do admin, pra garantir que os dois sempre renderizem
// exatamente o mesmo componente.
export default function HeroSwitch({ hero, products }) {
  const findProduct = (id) => products.find((p) => p.id === id) || null;

  if (hero.variant === "benchmark") {
    return <HeroBenchmark content={hero.benchmark} />;
  }
  if (hero.variant === "antesDepois") {
    return <HeroAntesDepois content={hero.antesDepois} product={findProduct(hero.antesDepois.featuredProductId)} />;
  }
  return <HeroProduto content={hero.produto} product={findProduct(hero.produto.featuredProductId)} />;
}
