---
name: nova-categoria
description: Criar ou ajustar uma categoria de produtos da Paratech — identidade visual (gradiente, accent, glow), ícone SVG e integração com filtros do Catálogo e tiles da Home.
---

# Nova categoria no catálogo

Categoria nova (ou ajuste de identidade de uma existente) normalmente precisa tocar **duas
camadas**: o protótipo (`project/`, referência de design) e o site em produção
(`frontend/`, o que o cliente vê). Confirme com o usuário se o pedido é só design, só
produção, ou os dois — o mais comum é os dois, para não ficarem dessincronizados.

Hoje **não existe** um `/admin/categorias` funcional (mesmo o schema Prisma comentando essa
rota como destino futuro) — categoria ainda é trabalho de código dos dois lados. Se
`frontend/app/admin/` já tiver ganhado uma tela de categorias quando você ler isto,
confirme e prefira ela em vez dos passos manuais abaixo para a camada de produção.

## No protótipo (`project/`) — 3 pontos de contato, nesta ordem:

### 1. `products-data.js` → `CATEGORY_META`

Adicione a entrada com identidade visual completa:

```js
"minha-categoria": { label: "Nome em Português", c1: "#corEscura", c2: "#corMaisEscura", accent: "#corViva", glow: "rgba(R,G,B,.4)" }
```

Paleta segue um padrão: `c1` é um tom escuro saturado (~#1x2x3x), `c2` é ele ~50% mais escuro, `accent` é a versão viva/clara da mesma família, `glow` é o accent em rgba .4–.45. Compare com as 14 existentes e escolha uma família de cor **ainda não usada** para a categoria continuar reconhecível de longe.

A ordem das chaves em `CATEGORY_META` define a ordem dos chips de filtro — posicione com intenção.

### 2. `Catalogo.dc.html` → ícone SVG

Cada card mostra um ícone por categoria dentro de `.pv-icon-wrap`, gateado por flags `p.isXxx`:

- Adicione a flag no `renderVals()` (ex.: `isMinhaCategoria: p.category === "minha-categoria"`).
- Adicione o bloco `<sc-if value="{{ p.isMinhaCategoria }}">` com o SVG.
- **Estilo do ícone é sagrado**: `viewBox="0 0 24 24"`, `fill="none"`, `stroke="currentColor"`, `strokeWidth="1.6"`, linecap/linejoin `round`, traçado minimalista de linha única (olhe os 14 existentes como referência). A cor vem de `{{ p.catAccent }}` no wrapper — nunca hardcode cor no SVG.

### 3. `Home.dc.html` → tile de categoria (se aplicável)

A grade `#categorias` da Home tem tiles manuais por categoria (`.pv-card` com link `Catalogo.dc.html#id-da-categoria`). Se a categoria merece destaque na Home, adicione um tile copiando o padrão: mesmo gradiente `linear-gradient(160deg, c1, c2)`, mesmo accent no glow e no ícone, título + frase curta de benefício.

## Em produção (`frontend/`) — se o pedido cobrir a camada de produção

O mesmo par gradiente/accent/glow existe de novo em `frontend/lib/products-data.js` →
`CATEGORY_META`, com um campo a mais: `tagline` (frase curta de benefício, mostrada no
Catálogo/Home de produção). Copie a mesma entrada de lá, com a mesma paleta escolhida no
protótipo — as duas listas devem ficar idênticas para a categoria não parecer diferente
entre design e site real.

- **Ícone**: adicione a mesma entrada em `ICON_PATHS` de `frontend/components/icons/CategoryIcon.js`
  (mesmas regras de estilo do item 2, é o mesmo traçado — só migrado de `<sc-if>` para JSX puro).
  Hoje esse componente **não tem fallback genérico**: uma categoria sem entrada em
  `ICON_PATHS` renderiza sem ícone nenhum (o componente retorna `null`), apesar do
  comentário em `schema.prisma` mencionar um `iconKey`/ícone genérico como destino futuro —
  não conte com isso até existir de fato.
- **Banco**: `Category` é uma tabela Prisma (`prisma/schema.prisma`), não um array — o
  seed (`prisma/seed.js`) só popula a partir de `lib/products-data.js` **na primeira
  migration**. Se o banco já foi semeado, adicionar a categoria só no arquivo não a faz
  aparecer no site; é preciso inserir a linha em `Category` (script Prisma pontual, Prisma
  Studio, ou nova migration/seed incremental — confirme qual caminho o usuário prefere e se
  você tem acesso ao banco de produção antes de agir).

## Não faça

- Não adicione categoria só em `CATEGORIES` — ela é **derivada** (categorias com produto ≥ 1). Categoria sem produto fica invisível nos filtros por design. Vale tanto no protótipo quanto em produção (lá, uma `Category` sem `Product` associado não aparece nos chips).
- Não invente um segundo formato de card; tudo passa por `.pv-*` de `product-visuals.css` (protótipo) ou pelos componentes equivalentes em `frontend/components/` (produção).