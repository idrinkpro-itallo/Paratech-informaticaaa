# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## O que é este repositório

Este repositório tem **duas camadas** — não trate uma como se fosse a outra:

1. `paratech-premium-website-redesign/project/` — o **bundle de handoff do Claude Design** (claude.ai/design) original: protótipos HTML/CSS/JS estáticos, não código de produção. Um usuário desenhou o redesign do site da **Paratech** (ARJ Informática e Acessórios LTDA, loja de informática em Pará de Minas/MG) nesses protótipos. Eles continuam sendo o **contrato visual** (fonte da verdade de cor/tipografia/layout) e não são renderizados nem editados como se fossem o site real.
2. `paratech-premium-website-redesign/frontend/` — o site de produção **já implementado**: app Next.js com Home/Catálogo/Contato públicos, painel `/admin` e banco Postgres via Prisma. A migração do design "de verdade" (regra de ouro nº 2 abaixo) já aconteceu nessa pasta — ver `DOCUMENTACAO.md` para arquitetura completa e `COMO-FINALIZAR-RAPIDO.md` para o que falta até o lançamento. Antes de assumir que uma tarefa é "migrar protótipo do zero", confira se a página/comportamento já existe ali.

**Regras de ouro do handoff (do README), válidas para a camada `project/`:**

1. A página que o usuário tinha aberta ao exportar foi `project/Catalogo.dc.html` — é quase certamente o design principal a ser construído. Leia-a por inteiro, e siga todos os imports dela.
2. O trabalho é **recriar o visual pixel-perfect** na tecnologia de destino (React, Vue, etc.) — **não** copiar a estrutura interna do protótipo.
3. **Não renderize os arquivos no navegador nem tire screenshots** a menos que o usuário peça. Tudo (dimensões, cores, layout) está no código-fonte. Isso vale para os `.dc.html`; o app em `frontend/` é código de produção normal e pode/deve ser conferido no navegador quando fizer sentido.
4. Se algo for ambíguo, pergunte antes de implementar.

`project/` não tem build, lint ou testes — são protótipos estáticos, e o `package-lock.json` histórico na raiz do handoff é vazio/trivial. Já `frontend/` é um app Next.js real, com seu próprio `package.json`, build, lint e migrations Prisma — ver `frontend/README.md`.

## Anatomia dos protótipos (formato `.dc.html`, pasta `project/`)

Cada página é um HTML com um runtime próprio (`support.js`) que emula um mini-React:

- `<x-dc>` envolve o markup; `<helmet>` contém o que iria no `<head>` real (fontes, CSS).
- Bindings `{{ expressao }}` dentro de atributos/texto são resolvidos por uma classe `Component extends DCLogic` definida num `<script type="text/x-dc">` no fim do arquivo — com `state`, `componentDidMount`, `setState` e um `renderVals()` que devolve o mapa de valores dos bindings.
- `<sc-for list="{{ ... }}" as="x">` = loop; `<sc-if value="{{ ... }}">` = condicional.
- `style-hover="..."` = estilos de hover inline (converta para `:hover` real na implementação).
- `<image-slot>` (via `image-slot.js`) = placeholder de imagem preenchível pelo usuário; na produção vira `<img>` real com as fotos dos produtos.
- Quase todo o estilo é inline no HTML; o que é compartilhado vive em `product-visuals.css`.

## Mapa dos arquivos (protótipo, pasta `project/`)

Para o mapa de arquivos do app de produção (`frontend/app`, `frontend/lib`, `frontend/prisma`), ver a seção 2 de `DOCUMENTACAO.md` — não duplicado aqui porque muda com mais frequência que o protótipo.

| Arquivo | Papel |
|---|---|
| `project/Catalogo.dc.html` | **Página principal**: catálogo com busca, filtro por categoria (chips + hash da URL), slider de preço máx (0–3500), ordenação, favoritos, e cards de produto |
| `project/Home.dc.html` | Home: hero com tiles flutuantes de `<image-slot>`, grade de categorias, seção promoções, depoimentos |
| `project/Contato.dc.html` | Contato: infos da loja, mapa embed do Google, formulário que abre o WhatsApp com a mensagem montada |
| `project/products-data.js` | **Fonte única de verdade dos dados**: `PRODUCTS`, `CATEGORY_META` (14 categorias com gradiente/accent/glow), `STOCK_META`, `CATEGORIES` (derivada — só categorias com produtos), `WA_SUPPORT`, `WA_SALES`, `waLink()` |
| `project/product-visuals.css` | Sistema visual dos cards (`.pv-*`): tile com gradiente por categoria, ícone SVG flutuante com glow, partículas, shimmer no hover, chips glassmorphism, botões `.btn-quote`/`.btn-whatsapp`. Inclui `prefers-reduced-motion` |
| `project/support.js` / `image-slot.js` | Runtime do protótipo — **não portar para produção** |
| `project/Paratech - Home.html` | Export bundled standalone (495KB) — apenas referência, ignorar |
| `project/uploads/` | Materiais do cliente: logo/papel de parede, cartão CNPJ (PDF), fotos |

## Identidade visual (não invente cores novas)

- **Vermelho Paratech** `#E30613` (ação primária, destaques) · **Amarelo** `#FFD400` (acentos, hover de links, o "." do logo) · **WhatsApp verde** `#25D366` (todos os CTAs de conversa)
- Fundos escuros: `#0B0D10` (base), `#1c2128` (radial), `#23262B` (seções CTA), `#050607`
- Claro: fundo `#F7F7F5`, texto `#16181B`, texto secundário `#5B6168`
- Tipografia: **Sora** (títulos, weight 700–800) + **Manrope** (corpo, 400–700), via Google Fonts
- Cada categoria tem identidade própria (gradiente `c1→c2`, `accent`, `glow`) em `CATEGORY_META` — os ícones SVG por categoria estão inline em `Catalogo.dc.html` (linhas dos `sc-if p.isXxx`)
- Preços em `pt-BR`: `"R$ " + v.toLocaleString("pt-BR", { minimumFractionDigits: 2 })`

## Modelo de negócio embutido no design

Não há carrinho nem checkout — **tudo converte para WhatsApp**:

- Vendas/orçamentos: `5537999681192` (botões "Solicitar Orçamento" com mensagem pré-preenchida `Quero um orçamento para: <produto>`)
- Suporte/atendimento geral: `5537991222578` (header, botão flutuante, formulário de contato)
- Sempre use o helper `waLink(numero, mensagem)` de `products-data.js` — a mensagem é `encodeURIComponent`ada lá.
- O rodapé leva CNPJ e razão social reais — preservar: `© 2026 ARJ Informática e Acessórios LTDA — CNPJ 27.379.480/0001-08`.

## Comportamentos que precisam sobreviver à implementação

- Header fixo transparente que ganha fundo `rgba(11,13,16,.78)` + blur após `scrollY > 40`.
- Catálogo lê o hash da URL (`Catalogo.dc.html#printers`) para pré-selecionar a categoria — os tiles da Home linkam assim.
- Filtros compostos: categoria E preço máximo E busca por nome; ordenação por relevância/preço/nome; estado vazio "Nenhum produto encontrado para esses filtros."
- Tags de produto com estilo fixo: `Novo` (amarelo/preto), `Promoção` (vermelho/branco), `Mais vendido` (grafite/amarelo).
- Todo o conteúdo é **português brasileiro** — manter idioma em textos novos.
