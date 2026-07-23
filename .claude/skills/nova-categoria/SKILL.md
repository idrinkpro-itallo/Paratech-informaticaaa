---
name: nova-categoria
description: Criar ou ajustar uma categoria de produtos da Paratech — identidade visual (gradiente, accent, glow), ícone SVG e integração com filtros do Catálogo e tiles da Home.
---

# Nova categoria no catálogo

Uma categoria tem 3 pontos de contato. Faça nesta ordem:

## 1. `products-data.js` → `CATEGORY_META`

Adicione a entrada com identidade visual completa:

```js
"minha-categoria": { label: "Nome em Português", c1: "#corEscura", c2: "#corMaisEscura", accent: "#corViva", glow: "rgba(R,G,B,.4)" }
```

Paleta segue um padrão: `c1` é um tom escuro saturado (~#1x2x3x), `c2` é ele ~50% mais escuro, `accent` é a versão viva/clara da mesma família, `glow` é o accent em rgba .4–.45. Compare com as 14 existentes e escolha uma família de cor **ainda não usada** para a categoria continuar reconhecível de longe.

A ordem das chaves em `CATEGORY_META` define a ordem dos chips de filtro — posicione com intenção.

## 2. `Catalogo.dc.html` → ícone SVG

Cada card mostra um ícone por categoria dentro de `.pv-icon-wrap`, gateado por flags `p.isXxx`:

- Adicione a flag no `renderVals()` (ex.: `isMinhaCategoria: p.category === "minha-categoria"`).
- Adicione o bloco `<sc-if value="{{ p.isMinhaCategoria }}">` com o SVG.
- **Estilo do ícone é sagrado**: `viewBox="0 0 24 24"`, `fill="none"`, `stroke="currentColor"`, `strokeWidth="1.6"`, linecap/linejoin `round`, traçado minimalista de linha única (olhe os 14 existentes como referência). A cor vem de `{{ p.catAccent }}` no wrapper — nunca hardcode cor no SVG.

## 3. `Home.dc.html` → tile de categoria (se aplicável)

A grade `#categorias` da Home tem tiles manuais por categoria (`.pv-card` com link `Catalogo.dc.html#id-da-categoria`). Se a categoria merece destaque na Home, adicione um tile copiando o padrão: mesmo gradiente `linear-gradient(160deg, c1, c2)`, mesmo accent no glow e no ícone, título + frase curta de benefício.

## Não faça

- Não adicione categoria só em `CATEGORIES` — ela é **derivada** (categorias com produto ≥ 1). Categoria sem produto fica invisível nos filtros por design.
- Não invente um segundo formato de card; tudo passa por `.pv-*` de `product-visuals.css`.