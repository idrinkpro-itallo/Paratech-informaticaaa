---
name: identidade-paratech
description: Guia da marca Paratech — cores, tipografia, componentes e tom de voz. Use ao criar qualquer seção, página, banner ou texto novo, ou para revisar se algo está "on-brand".
---

# Identidade Paratech

Loja de informática de bairro com cara de marca premium. O design vive do contraste **fundo escuro dramático × acentos vermelho/amarelo × cards claros limpos**.

## Cores (nunca invente fora disso)

| Token | Hex | Uso |
|---|---|---|
| Vermelho Paratech | `#E30613` | Ação primária, links, destaques no título, chip ativo |
| Amarelo | `#FFD400` | Acento, hover de link, o "." do logo, kickers de seção, números de stats |
| Verde WhatsApp | `#25D366` | EXCLUSIVO para CTAs de conversa (hover `#1fb857`) |
| Preto base | `#0B0D10` | Hero/footer; radial com `#1c2128`, fundo profundo `#050607` |
| Grafite | `#23262B` | Seções CTA intermediárias, botão `.btn-quote` usa `#16181B` |
| Off-white | `#F7F7F5` | Fundo das áreas claras |
| Tinta | `#16181B` | Texto principal |
| Cinza texto | `#5B6168` | Texto secundário (e `#9aa0a6` para terciário) |

Cores por categoria de produto: sempre de `CATEGORY_META` em `products-data.js` (gradiente 160deg c1→c2 + accent + glow). Nunca crie um gradiente de categoria ad hoc.

## Tipografia

- **Sora** 700/800 — títulos, preços, logo, números. Títulos de seção: 38–44px; hero: clamp(40px, 5.2vw, 68px).
- **Manrope** 400–700 — todo o resto. Corpo 14px, secundário 12–13px.
- Kickers de seção: 13px, weight 700, `letter-spacing: 2px`, MAIÚSCULAS, em vermelho (seções claras) ou amarelo (seções escuras).

## Padrões de componente

- Raios: cards 18–20px, botões 10–12px, pills/chips `999px`.
- Cards claros: fundo `#fff`, borda `rgba(0,0,0,.06)`, sombra `0 8px 24px rgba(0,0,0,.05)`; hover levanta (`translateY(-8px)` + sombra maior).
- Vidro sobre escuro: `rgba(255,255,255,.08)` + borda `rgba(255,255,255,.15)` (inputs) ou `.14/.28` + blur (chips).
- Botões CTA têm sombra colorida da própria cor (ex.: verde `rgba(37,211,102,.35)`) e hover que levanta 2–3px intensificando a sombra.
- Movimento: floats suaves 4–6s ease-in-out, glow pulsante, shimmer no hover — sempre com fallback `prefers-reduced-motion`.

## Tom de voz (pt-BR)

- Vendedor consultivo e caloroso, direto ao benefício: "Dê um novo fôlego ao seu PC", "Tudo que você precisa em um só lugar".
- Sem tecniquês gratuito, sem inglês desnecessário; specs aparecem no NOME do produto, benefício na descrição.
- CTAs sempre em ação: "Falar no WhatsApp", "Solicitar Orçamento", "Ver Catálogo".
- A empresa fala como gente de Pará de Minas/MG que entende de tecnologia — próxima, não corporativa.

## Checklist de revisão on-brand

1. Alguma cor fora da tabela acima (ou de `CATEGORY_META`)? → trocar.
2. Verde `#25D366` usado para algo que não é WhatsApp? → trocar.
3. Título sem Sora, ou peso < 700? → corrigir.
4. CTA sem sombra colorida/hover de elevação? → adicionar.
5. Texto em inglês ou tom corporativo frio? → reescrever.
6. Animação sem `prefers-reduced-motion`? → cobrir.