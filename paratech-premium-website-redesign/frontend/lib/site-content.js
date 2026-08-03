// Conteúdo editável da Home e do Contato (painel /admin/site). Uma linha
// SiteContent por seção ("home" / "contato"); os defaults abaixo cobrem
// banco novo (antes de qualquer save) e preenchem campos que faltarem numa
// linha salva antiga, então adicionar um campo novo aqui nunca quebra o save
// anterior.
import { prisma } from "@/lib/db";

export const HOME_CONTENT_DEFAULT = {
  heroKicker: "TECNOLOGIA · PARÁ DE MINAS/MG",
  heroTitleBefore: "A Tecnologia que",
  heroTitleRed: "Move",
  heroTitleMiddle: "o seu",
  heroTitleYellow: "Negócio",
  heroTitleAfter: ".",
  heroLead:
    "Notebooks, computadores, periféricos, impressoras e acessórios com atendimento especializado e entrega rápida. Peça pelo WhatsApp e receba sem sair de casa.",
  ctaWhatsMessage: "Olá! Quero falar sobre produtos da Paratech.",
  ctaCatalogLabel: "Ver Catálogo",
  bannerMessages: [
    "Entrega rápida em Pará de Minas e região",
    "Atendimento direto pelo WhatsApp, sem robô",
    "+15 anos de experiência em tecnologia",
  ],
  heroStats: [
    { value: "+15 anos", label: "de mercado" },
    { value: "+10.000", label: "clientes atendidos" },
    { value: "98%", label: "satisfação" },
  ],
  countersTargets: { clientes: 10000, anos: 15, vendidos: 50000, satisfacao: 98 },
  promoBadge: "OFERTA POR TEMPO LIMITADO",
  promoTitle: "Semana da Tecnologia Paratech",
  promoText: "Até 25% OFF em notebooks, SSDs, memórias e impressoras selecionadas. Estoque limitado.",
  promoCtaLabel: "Aproveitar agora",
  testimonials: [
    { text: "Comprei meu notebook e o atendimento foi excelente. Entrega rápida e produto original.", name: "Marcos Silva", role: "Cliente Paratech", initial: "MS" },
    { text: "A assistência técnica resolveu meu computador no mesmo dia. Recomendo demais!", name: "Fernanda Oliveira", role: "Cliente Paratech", initial: "FO" },
    { text: "Melhores preços da região em SSD e memórias. Já é a segunda compra que faço.", name: "Rafael Costa", role: "Cliente Paratech", initial: "RC" },
  ],
  visitTitle: "Vem tomar um café e ver de perto",
  visitSubtitle: "R. Nova Serrana, 31, Loja — Nossa Sra. de Lourdes, Pará de Minas/MG",
  featuredProductIds: [1, 3, 10, 6],
  features: [
    { title: "Atendimento Especializado", desc: "Equipe técnica pronta para ajudar" },
    { title: "Produtos Originais", desc: "Qualidade garantida em cada item" },
    { title: "Garantia", desc: "Em todos os produtos e serviços" },
    { title: "Entrega Rápida", desc: "Receba no conforto da sua casa" },
    { title: "Melhores Preços", desc: "Custo-benefício em toda a linha" },
    { title: "Suporte Técnico", desc: "Sempre que você precisar" },
    { title: "Parcelamento Facilitado", desc: "Em até 10x no cartão" },
    { title: "+15 Anos de Mercado", desc: "Tradição e confiança em Pará de Minas" },
  ],
  gallery: [
    { url: "", caption: "foto: fachada da loja" },
    { url: "", caption: "foto: equipe técnica" },
    { url: "", caption: "foto: bancada de reparos" },
    { url: "", caption: "foto: showroom" },
    { url: "", caption: "foto: atendimento" },
    { url: "", caption: "foto: estoque" },
  ],
  // Liga/desliga seções inteiras da Home sem apagar o conteúdo — o título,
  // texto e CTA do hero e o rodapé são estruturais e não entram aqui (sempre
  // visíveis); a faixa rotativa e os números logo abaixo do CTA já são
  // blocos independentes e podem ser desligados.
  sections: {
    banner: true,
    categorias: true,
    destaque: true,
    numeros: true,
    diferenciais: true,
    contadores: true,
    promocao: true,
    depoimentos: true,
    galeria: true,
    visite: true,
  },
};

export const CONTATO_CONTENT_DEFAULT = {
  heroEyebrow: "FALE COM A PARATECH",
  heroTitle: "Estamos prontos para te atender",
  address: "R. Nova Serrana, 31, Loja — N. Sra. de Lourdes\nPará de Minas/MG — CEP 35.660-178",
  phone: "(37) 3237-2355",
  phoneHref: "+553732372355",
  email: "arjtech@hotmail.com",
  hours: "Segunda a Sábado — 8h às 18h",
  mapEmbedUrl: "https://www.google.com/maps?q=R.+Nova+Serrana,31,Para+de+Minas,MG&output=embed",
  // Título e mapa são estruturais (sempre visíveis); o card de endereço/
  // telefone/e-mail pode ser desligado sem quebrar o layout (o mapa e o
  // formulário continuam na página).
  sections: {
    informacoes: true,
  },
};

const DEFAULTS = { home: HOME_CONTENT_DEFAULT, contato: CONTATO_CONTENT_DEFAULT };

export async function getSiteContent(section) {
  const fallback = DEFAULTS[section];
  if (!fallback) throw new Error(`Seção de conteúdo desconhecida: ${section}`);

  const row = await prisma.siteContent.findUnique({ where: { section } });
  if (!row) return structuredClone(fallback);
  return { ...structuredClone(fallback), ...row.data };
}

export async function saveSiteContent(section, data) {
  if (!DEFAULTS[section]) throw new Error(`Seção de conteúdo desconhecida: ${section}`);
  await prisma.siteContent.upsert({
    where: { section },
    create: { section, data },
    update: { data },
  });
}
