// Paletas alternativas dos 3 modelos de Hero da Home (painel /admin/site).
// Cada modelo tem sua própria lista de temas de cor — o admin escolhe o
// modelo (hero.variant) e, dentro dele, qual tema aplicar. O verde do
// WhatsApp nunca entra aqui: é cor de ação fixa, não decorativa.

export const PRODUTO_THEMES = [
  { id: "vermelho", name: "Vermelho Clássico", accent: "#E30613", glow: "rgba(227,6,19,.4)" },
  { id: "ambar", name: "Ouro Tech", accent: "#FFB020", glow: "rgba(255,176,32,.38)" },
  { id: "gelo", name: "Performance Fria", accent: "#4FD1E8", glow: "rgba(79,209,232,.38)" },
  { id: "violeta", name: "Premium Gamer", accent: "#9B6BFF", glow: "rgba(155,107,255,.38)" },
];

export const BENCHMARK_THEMES = [
  { id: "ambar", name: "Odômetro Âmbar", digit: "#FFD400", digitGlow: "rgba(255,212,0,.55)", trace: "rgba(255,212,0,.12)", gain: "#FF5A5A" },
  { id: "alerta", name: "Alerta Vermelho", digit: "#FF5A5A", digitGlow: "rgba(255,90,90,.5)", trace: "rgba(255,90,90,.12)", gain: "#FFD400" },
  { id: "lima", name: "Terminal Lima", digit: "#B6FF3C", digitGlow: "rgba(182,255,60,.5)", trace: "rgba(182,255,60,.12)", gain: "#ffffff" },
  { id: "roxo", name: "Neon Roxo", digit: "#C77DFF", digitGlow: "rgba(199,125,255,.5)", trace: "rgba(199,125,255,.12)", gain: "#FFD400" },
];

export const ANTES_DEPOIS_THEMES = [
  { id: "classico", name: "Vermelho Clássico", accent: "#E30613", glow: "rgba(227,6,19,.45)" },
  { id: "ambar", name: "Ouro Tech", accent: "#FFB020", glow: "rgba(255,176,32,.4)" },
  { id: "ciano", name: "Ciano Digital", accent: "#22D3EE", glow: "rgba(34,211,238,.4)" },
  { id: "magenta", name: "Magenta Vívido", accent: "#FF3D9A", glow: "rgba(255,61,154,.4)" },
];

export const HERO_THEME_SETS = {
  produto: PRODUTO_THEMES,
  benchmark: BENCHMARK_THEMES,
  antesDepois: ANTES_DEPOIS_THEMES,
};

export function findTheme(variant, themeId) {
  const set = HERO_THEME_SETS[variant] || [];
  return set.find((t) => t.id === themeId) || set[0];
}
