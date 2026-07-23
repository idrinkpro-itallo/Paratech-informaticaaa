---
name: implementar-producao
description: Converter os protótipos .dc.html da Paratech em código de produção (React, Next.js, Vue ou HTML/CSS puro) com fidelidade pixel-perfect. Use quando o usuário pedir para "implementar", "construir o site de verdade" ou migrar o design.
---

# Implementar os protótipos em produção

O protótipo é o **contrato visual**, não o código-fonte. Recrie o resultado na stack escolhida; jogue fora a mecânica interna do protótipo.

## Antes de escrever código

1. Confirme com o usuário: **stack de destino** (React/Next? Vite? HTML puro?) e **escopo** (só Catálogo? as 3 páginas?). O README do handoff manda perguntar quando ambíguo.
2. Leia por inteiro a(s) página(s) do escopo + `products-data.js` + `product-visuals.css`. Os valores exatos (px, cores, sombras, timings de animação) estão todos no fonte — não estime.

## Tradução do dialeto do protótipo

| No protótipo | Na produção |
|---|---|
| `{{ binding }}` + classe `DCLogic` | estado do framework (useState etc.) |
| `<sc-for list as>` / `<sc-if>` | `.map()` / renderização condicional |
| `style-hover="..."` | classes CSS com `:hover` real |
| estilos inline gigantes | extrair para CSS/módulos/Tailwind — mantendo os MESMOS valores |
| `<image-slot placeholder="...">` | `<img>` real; peça as fotos ao usuário ou use os visuais `.pv-visual` (gradiente+ícone) como fallback |
| `<script src="./support.js">` / `image-slot.js` | **descartar** — é runtime do editor de design |
| `data-props` no script x-dc | ignorar — metadados do editor |

## O que é obrigatório preservar

- **Tokens**: cores (#E30613, #FFD400, #25D366, #0B0D10, #16181B, #F7F7F5, #5B6168, #23262B), fontes Sora/Manrope com os pesos exatos, raios de borda, sombras.
- **`products-data.js` porta quase intacto** — é ES module puro (dados + helper `waLink`). `CATEGORY_META`/`STOCK_META`/`CATEGORIES` derivada.
- **`product-visuals.css` porta quase intacto** — classes `.pv-*` e keyframes; manter o bloco `prefers-reduced-motion`.
- Comportamentos: header que escurece após `scrollY > 40`; filtro por hash de URL no catálogo (`#printers`); filtros compostos + ordenação + estado vazio; favoritos; formulário de contato que abre WhatsApp com mensagem montada.
- Links WhatsApp: vendas `5537999681192`, suporte `5537991222578`, sempre com `encodeURIComponent` na mensagem.
- Rodapé legal: `© 2026 ARJ Informática e Acessórios LTDA — CNPJ 27.379.480/0001-08`.
- Todo texto em pt-BR; preços via `toLocaleString("pt-BR")`.

## O que melhorar na passagem (o protótipo não cobre)

- **Responsividade**: os protótipos assumem 1440px (grids fixos `repeat(4,1fr)`, padding 48px). Crie breakpoints sensatos (4→2→1 colunas; nav mobile) mantendo a estética.
- Semântica/a11y: `<main>`, `<nav>`, labels nos inputs, `aria-label` no botão de favorito e no FAB do WhatsApp, foco visível.
- SEO básico: `<title>`, meta description, lang="pt-BR", OG tags.
- O ícone do FAB do WhatsApp no protótipo é um círculo genérico — na produção use o glifo real do WhatsApp.

## Definição de pronto

Compare seção por seção contra o fonte do protótipo (não de memória): header, hero, categorias, cards, CTA, footer, FAB. Cada cor, fonte, espaçamento e animação deve ter origem rastreável no protótipo ou ser uma melhoria de responsividade/a11y deliberada.