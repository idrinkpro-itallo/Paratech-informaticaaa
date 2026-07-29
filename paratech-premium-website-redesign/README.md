# CODING AGENTS: READ THIS FIRST

This is a **handoff bundle** from Claude Design (claude.ai/design).

A user mocked up designs in HTML/CSS/JS using an AI design tool, then exported this bundle so a coding agent can implement the designs for real.

## What you should do — IMPORTANT

**Read `paratech-premium-website-redesign/project/Catalogo.dc.html` in full.** The user had this file open when they triggered the handoff, so it's almost certainly the primary design they want built. Read it top to bottom — don't skim. Then **follow its imports**: open every file it pulls in (shared components, CSS, scripts) so you understand how the pieces fit together before you start implementing.

**If anything is ambiguous, ask the user to confirm before you start implementing.** It's much cheaper to clarify scope up front than to build the wrong thing.

## About the design files

The design medium is **HTML/CSS/JS** — these are prototypes, not production code. Your job is to **recreate them pixel-perfectly** in whatever technology makes sense for the target codebase (React, Vue, native, whatever fits). Match the visual output; don't copy the prototype's internal structure unless it happens to fit.

**Don't render these files in a browser or take screenshots unless the user asks you to.** Everything you need — dimensions, colors, layout rules — is spelled out in the source. Read the HTML and CSS directly; a screenshot won't tell you anything they don't.

## Bundle contents

- `paratech-premium-website-redesign/README.md` — this file
- `paratech-premium-website-redesign/project/` — the `Paratech Premium Website Redesign` project files (HTML prototypes, assets, components). Still the visual contract; not rendered or edited as if it were the live site.
- `paratech-premium-website-redesign/frontend/` — **o site de produção**: app Next.js único (páginas públicas + painel `/admin` + acesso ao banco via Prisma/Server Actions, sem API HTTP separada).

## Frontend de produção

A migração dos protótipos `.dc.html` para produção **já aconteceu** e vive inteira em
`frontend/`: Home, Catálogo e Contato pixel-perfect a partir dos protótipos, mais um
painel `/admin` (login + CRUD de produto com upload de foto) que grava direto no
Postgres via Prisma. Os dados iniciais são semeados a partir de
`frontend/lib/products-data.js` (espelho de `project/products-data.js`), então o
catálogo real nasce em paridade com os protótipos — depois do primeiro seed, produtos
são cadastrados/editados pelo `/admin`, não por esses arquivos.

```bash
cd paratech-premium-website-redesign/frontend
npm install && npx prisma migrate dev --name init && npm run db:seed && npm run dev
```

Detalhes de arquitetura, variáveis de ambiente e checklist de prontidão em
[`../DOCUMENTACAO.md`](../DOCUMENTACAO.md); passo a passo até o lançamento em
[`../COMO-FINALIZAR-RAPIDO.md`](../COMO-FINALIZAR-RAPIDO.md).

> Um `backend/` Node.js/Express/Prisma separado existiu neste repositório mas foi
> removido em 2026-07-22: sua lógica foi portada para dentro do próprio `frontend/`
> (Server Components + Server Actions), evitando manter duas implementações da
> mesma coisa.
