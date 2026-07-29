// Visual identity (gradient + accent color + tagline) for every category the
// catalog supports. Products only use a subset today; the rest are ready as
// soon as new products are added — no card/template changes needed later.
export const CATEGORY_META = {
  "laptops": { label: "Notebooks", c1: "#12283f", c2: "#0a1622", accent: "#4da3ff", glow: "rgba(77,163,255,.45)", tagline: "Performance e mobilidade para o seu dia a dia" },
  "desktop-computers": { label: "Computadores Desktop", c1: "#241238", c2: "#140a20", accent: "#a374ff", glow: "rgba(163,116,255,.45)", tagline: "Potência de sobra para trabalho e criação" },
  "gaming": { label: "Gamer", c1: "#3a0f24", c2: "#1c0712", accent: "#ff4d7e", glow: "rgba(255,77,126,.45)", tagline: "Setup gamer completo com estilo" },
  "smartphones": { label: "Smartphones", c1: "#0b3535", c2: "#061c1c", accent: "#2dd4bf", glow: "rgba(45,212,191,.4)", tagline: "Conectividade e performance no bolso" },
  "printers": { label: "Impressoras", c1: "#3a2a0d", c2: "#1e1607", accent: "#ffb020", glow: "rgba(255,176,32,.4)", tagline: "Multifuncionais, laser, tintas e toners" },
  "networking": { label: "Redes", c1: "#0c3247", c2: "#061a26", accent: "#38bdf8", glow: "rgba(56,189,248,.4)", tagline: "Conexão estável para casa e empresa" },
  "ssd-storage": { label: "SSD & Armazenamento", c1: "#132a17", c2: "#0a160c", accent: "#4ade80", glow: "rgba(74,222,128,.4)", tagline: "Upgrade de velocidade para o seu equipamento" },
  "ram-memory": { label: "Memória RAM", c1: "#2c1338", c2: "#170a1e", accent: "#c084fc", glow: "rgba(192,132,252,.4)", tagline: "Mais memória, mais fluidez" },
  "monitors": { label: "Monitores", c1: "#132436", c2: "#0a131e", accent: "#60a5fa", glow: "rgba(96,165,250,.4)", tagline: "Imagem nítida em qualquer resolução" },
  "accessories": { label: "Acessórios", c1: "#332107", c2: "#1a1104", accent: "#fb923c", glow: "rgba(251,146,60,.4)", tagline: "Os complementos certos para o seu setup" },
  "audio": { label: "Áudio", c1: "#2a1332", c2: "#150a1a", accent: "#e879f9", glow: "rgba(232,121,249,.4)", tagline: "Som de qualidade para trabalho e lazer" },
  "security-cameras": { label: "Câmeras de Segurança", c1: "#0f2e1e", c2: "#08170f", accent: "#34d399", glow: "rgba(52,211,153,.4)", tagline: "Monitoramento e tranquilidade 24h" },
  "cables": { label: "Cabos", c1: "#302f0d", c2: "#181706", accent: "#facc15", glow: "rgba(250,204,21,.4)", tagline: "As conexões certas para cada equipamento" },
  "office-equipment": { label: "Escritório", c1: "#331414", c2: "#1a0a0a", accent: "#f87171", glow: "rgba(248,113,113,.4)", tagline: "Tudo para o escritório e a escola" }
};

export const STOCK_META = {
  "in-stock": { label: "Em estoque", color: "#22c55e" },
  "low-stock": { label: "Últimas unidades", color: "#f59e0b" },
  "backorder": { label: "Sob encomenda", color: "#60a5fa" }
};

// Fonte do seed inicial do banco (prisma/seed.js) — usada uma única vez pra
// popular o Postgres. Depois da migração pro banco, produtos são cadastrados
// e editados pelo painel /admin (lib/products.js), não por este array.
export const PRODUCTS = [
  { id: 1, name: "Notebook Intel Core i5 8GB 256GB SSD", category: "laptops", description: "Leve, rápido e ideal para trabalho e estudo no dia a dia.", stock: "in-stock", price: 2899.9, oldPrice: 3299.9, installment: "10x de R$ 289,99", tag: "Mais vendido", brand: "Genérico" },
  { id: 2, name: "Computador Desktop Ryzen 5 16GB 512GB SSD", category: "desktop-computers", description: "Alta performance para multitarefa, edição e produtividade.", stock: "in-stock", price: 3199.0, oldPrice: null, installment: "10x de R$ 319,90", tag: "Novo", brand: "Genérico" },
  { id: 3, name: "Monitor LED 24\" Full HD 75Hz", category: "monitors", description: "Imagem nítida com taxa de atualização suave para o dia a dia.", stock: "low-stock", price: 699.0, oldPrice: 849.0, installment: "8x de R$ 87,38", tag: "Promoção", brand: "Genérico" },
  { id: 4, name: "Teclado e Mouse Gamer RGB Combo", category: "gaming", description: "Combo com iluminação RGB e resposta rápida para jogos.", stock: "in-stock", price: 149.9, oldPrice: null, installment: "3x de R$ 49,97", tag: null, brand: "Genérico" },
  { id: 5, name: "Impressora Multifuncional Jato de Tinta Wi-Fi", category: "printers", description: "Imprime, copia e digitaliza direto do celular ou notebook.", stock: "in-stock", price: 549.0, oldPrice: 649.0, installment: "6x de R$ 91,50", tag: "Promoção", brand: "Genérico" },
  { id: 6, name: "Impressora Laser Monocromática USB/Rede", category: "printers", description: "Impressão rápida em preto e branco para o escritório.", stock: "in-stock", price: 899.0, oldPrice: null, installment: "10x de R$ 89,90", tag: "Mais vendido", brand: "Genérico" },
  { id: 7, name: "Cartucho de Tinta Colorido Original", category: "printers", description: "Cores vivas e rendimento garantido em cada impressão.", stock: "in-stock", price: 79.9, oldPrice: null, installment: "2x de R$ 39,95", tag: null, brand: "Genérico" },
  { id: 8, name: "Kit Recarga de Toner Compatível", category: "printers", description: "Economia inteligente sem perder qualidade de impressão.", stock: "backorder", price: 129.9, oldPrice: 159.9, installment: "3x de R$ 43,30", tag: "Promoção", brand: "Genérico" },
  { id: 9, name: "SSD 480GB SATA III", category: "ssd-storage", description: "Dê um novo fôlego ao seu PC com boot e abertura instantâneos.", stock: "in-stock", price: 199.9, oldPrice: null, installment: "4x de R$ 49,98", tag: "Novo", brand: "Genérico" },
  { id: 10, name: "SSD NVMe 1TB M.2", category: "ssd-storage", description: "Velocidade de leitura e gravação de última geração.", stock: "in-stock", price: 429.9, oldPrice: 499.9, installment: "6x de R$ 71,65", tag: "Promoção", brand: "Genérico" },
  { id: 11, name: "Memória RAM DDR4 8GB 3200MHz", category: "ram-memory", description: "Mais fluidez para multitarefa e jogos leves.", stock: "in-stock", price: 149.9, oldPrice: null, installment: "3x de R$ 49,97", tag: "Mais vendido", brand: "Genérico" },
  { id: 12, name: "Memória RAM DDR4 16GB 3200MHz", category: "ram-memory", description: "Desempenho extra para edição, jogos e multitarefa pesada.", stock: "low-stock", price: 279.9, oldPrice: null, installment: "5x de R$ 55,98", tag: "Novo", brand: "Genérico" },
  { id: 13, name: "Caderno Universitário Capa Dura 200 Folhas", category: "office-equipment", description: "Capa dura resistente para o dia a dia de estudos.", stock: "in-stock", price: 24.9, oldPrice: null, installment: "à vista", tag: null, brand: "Genérico" },
  { id: 14, name: "Kit Escolar Completo 12 Itens", category: "office-equipment", description: "Tudo que você precisa para o ano letivo em um só kit.", stock: "in-stock", price: 69.9, oldPrice: 89.9, installment: "2x de R$ 34,95", tag: "Promoção", brand: "Genérico" },
  { id: 15, name: "Resma de Papel A4 500 Folhas", category: "office-equipment", description: "Papel branco de alta qualidade para impressão e cópias.", stock: "in-stock", price: 27.9, oldPrice: null, installment: "à vista", tag: null, brand: "Genérico" },
  { id: 16, name: "Organizador de Mesa para Escritório", category: "office-equipment", description: "Mantenha sua mesa organizada com estilo e praticidade.", stock: "in-stock", price: 39.9, oldPrice: null, installment: "à vista", tag: "Novo", brand: "Genérico" },
  { id: 17, name: "Smartphone 128GB Tela 6.5\" Câmera Tripla", category: "smartphones", description: "Tela grande, bateria de longa duração e câmera tripla para o dia a dia.", stock: "in-stock", price: 899.9, oldPrice: null, installment: "8x de R$ 112,49", tag: "Novo", brand: "Genérico" },
  { id: 18, name: "Smartphone Entrada 64GB Dual Chip", category: "smartphones", description: "Compacto e ágil, ideal para quem busca o primeiro smartphone com bom custo-benefício.", stock: "in-stock", price: 649.9, oldPrice: 749.9, installment: "6x de R$ 108,32", tag: "Promoção", brand: "Genérico" },
  { id: 19, name: "Roteador Wi-Fi 6 Dual Band AX1800", category: "networking", description: "Cobertura estável em toda a casa ou empresa, com velocidade para vários dispositivos.", stock: "in-stock", price: 189.9, oldPrice: null, installment: "4x de R$ 47,48", tag: "Mais vendido", brand: "Genérico" },
  { id: 20, name: "Switch Gigabit 8 Portas", category: "networking", description: "Expanda sua rede local com portas gigabit para conexões rápidas e estáveis.", stock: "low-stock", price: 249.9, oldPrice: null, installment: "5x de R$ 49,98", tag: null, brand: "Genérico" },
  { id: 21, name: "Mochila para Notebook até 15.6\" Reforçada", category: "accessories", description: "Proteção e conforto para levar seu notebook com segurança todos os dias.", stock: "in-stock", price: 129.9, oldPrice: null, installment: "3x de R$ 43,30", tag: "Novo", brand: "Genérico" },
  { id: 22, name: "Suporte Articulado para Monitor", category: "accessories", description: "Ajuste altura e ângulo do monitor para mais conforto na mesa de trabalho.", stock: "in-stock", price: 89.9, oldPrice: 109.9, installment: "2x de R$ 44,95", tag: "Promoção", brand: "Genérico" },
  { id: 23, name: "Headset Gamer com Microfone Retrátil", category: "audio", description: "Som imersivo e microfone retrátil para jogos e reuniões.", stock: "in-stock", price: 179.9, oldPrice: null, installment: "4x de R$ 44,98", tag: "Mais vendido", brand: "Genérico" },
  { id: 24, name: "Caixa de Som Bluetooth Portátil", category: "audio", description: "Som potente e conexão sem fio para levar a música para qualquer lugar.", stock: "backorder", price: 149.9, oldPrice: null, installment: "3x de R$ 49,97", tag: null, brand: "Genérico" },
  { id: 25, name: "Câmera de Segurança Wi-Fi Full HD Interna", category: "security-cameras", description: "Monitore sua casa ou loja em tempo real direto do celular.", stock: "in-stock", price: 219.9, oldPrice: null, installment: "4x de R$ 54,98", tag: "Novo", brand: "Genérico" },
  { id: 26, name: "Kit CFTV 4 Câmeras com DVR", category: "security-cameras", description: "Sistema completo de monitoramento com gravação para casa ou empresa.", stock: "low-stock", price: 799.9, oldPrice: 899.9, installment: "10x de R$ 79,99", tag: "Promoção", brand: "Genérico" },
  { id: 27, name: "Cabo HDMI 2.0 4K 3 Metros", category: "cables", description: "Transmissão de imagem e som em alta definição sem perda de qualidade.", stock: "in-stock", price: 39.9, oldPrice: null, installment: "à vista", tag: null, brand: "Genérico" },
  { id: 28, name: "Cabo de Rede Cat6 Blindado 5 Metros", category: "cables", description: "Conexão estável e blindada para redes rápidas e confiáveis.", stock: "in-stock", price: 24.9, oldPrice: null, installment: "à vista", tag: null, brand: "Genérico" }
];

export const WA_SUPPORT = "5537991222578";
export const WA_SALES = "5537999681192";

export function waLink(number, message) {
  return "https://wa.me/" + number + "?text=" + encodeURIComponent(message);
}

export function formatPrice(v) {
  return "R$ " + v.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export function tagStyle(tag) {
  if (tag === "Novo") return { bg: "#FFD400", color: "#16181B" };
  if (tag === "Promoção") return { bg: "#E30613", color: "#fff" };
  if (tag === "Mais vendido") return { bg: "#23262B", color: "#FFD400" };
  return null;
}
