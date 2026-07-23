# Documentação — Projeto Paratech

Auditoria e documentação de referência do repositório `paratechinfo`. Última atualização: 2026-07-22 (reativação do backend com painel admin).

> Resumo executivo: o site é um **app Next.js único** — frontend público + painel `/admin` + acesso ao banco — hospedado na Vercel, com Postgres (Neon, via integração Vercel) e fotos de produto no Vercel Blob. Não há mais uma API Express separada: o que existia em `backend/` foi portado para dentro do próprio Next.js (Server Components + Server Actions) e o diretório foi removido do repositório. Falta provisionar o banco/storage reais e fazer o primeiro deploy — veja o checklist na seção 5.

---

## 1. Visão geral do negócio

**Paratech** é a marca da **ARJ Informática e Acessórios LTDA** (CNPJ 27.379.480/0001-08), loja de informática em Pará de Minas/MG.

- **Sem carrinho/checkout** — todo o funil converte para **WhatsApp**:
  - Vendas/orçamentos: `5537999681192` (mensagem pré-preenchida `Quero um orçamento para: <produto>`)
  - Suporte/atendimento: `5537991222578`
- Identidade visual: Vermelho `#E30613`, Amarelo `#FFD400`, Verde WhatsApp `#25D366`; tipografia Sora (títulos) + Manrope (corpo); fundo escuro `#0B0D10` / claro `#F7F7F5`. Detalhes completos na skill `identidade-paratech`.
- Catálogo tem 14 categorias com identidade visual própria (gradiente, accent, glow, ícone SVG) e produtos com preço, estoque (`in-stock`/`low-stock`/`backorder`) e tag (`Novo`, `Promoção`, `Mais vendido`).
- Todo o conteúdo é em português brasileiro.

---

## 2. Arquitetura atual do repositório

```
paratechinfo/                              (raiz do git — remote único, ver seção 6)
├── README.md
├── DOCUMENTACAO.md                        ← este arquivo
├── COMO-FINALIZAR-RAPIDO.md               plano de execução até o lançamento
├── CHECKLIST-ENTREGA-CLIENTE.md           checklist final pro cliente
├── CLAUDE.md, PROMPT.md                   instruções para agentes de código
└── paratech-premium-website-redesign/
    ├── README.md                          instruções originais do handoff
    ├── project/                           protótipos Claude Design (NÃO produção — referência visual)
    │   ├── Catalogo.dc.html, Home.dc.html, Contato.dc.html
    │   ├── products-data.js               fonte de verdade ORIGINAL do handoff (protótipo)
    │   ├── product-visuals.css, uploads/, assets/
    │   └── support.js / image-slot.js     runtime do protótipo (não portado)
    └── frontend/                          app Next.js de produção — site + admin + acesso ao banco
        ├── app/
        │   ├── page.js, catalogo/, contato/          páginas públicas
        │   └── admin/                                painel admin (protegido por login)
        │       ├── page.js                           listagem de produtos
        │       ├── produtos/novo/, produtos/[id]/     formulário de criar/editar
        │       ├── login/                             login (senha única)
        │       └── actions.js                        Server Actions: create/update/delete + upload de foto
        ├── components/                    componentes de UI (inclui components/admin/)
        ├── lib/
        │   ├── products-data.js           CATEGORY_META, STOCK_META (identidade visual fixa) + seed inicial
        │   ├── products.js                consultas ao banco (Prisma) usadas pelas páginas públicas
        │   ├── db.js                      singleton do PrismaClient
        │   ├── session.js, dal.js         sessão do admin (cookie assinado via jose)
        │   └── validators.js              validação Zod do formulário de produto
        ├── prisma/
        │   ├── schema.prisma              modelos: Category, StockStatus, Product, Lead (Postgres)
        │   └── seed.js                    popula a partir de lib/products-data.js — só a primeira vez
        ├── proxy.js                       protege /admin/* (checagem otimista de sessão)
        └── .env.example                   variáveis necessárias (ver seção 4)
```

**Um bloco só, com dois papéis:**

1. **`project/`** — protótipos `.dc.html` do Claude Design. Continuam sendo só referência visual (o handoff pede pra não renderizar no navegador nem tirar screenshot a menos que solicitado); `project/products-data.js` é a fonte de verdade **original** do design, mas o site em produção lê os produtos do banco, não deste arquivo.
2. **`frontend/`** — o app de produção completo: páginas públicas (Home, Catálogo, Contato) e o painel `/admin`, ambos no mesmo deploy Next.js/Vercel, sem uma API HTTP separada — Server Components consultam o Postgres direto via Prisma, e mutações do admin (criar/editar/apagar produto, upload de foto) são Server Actions.

O antigo `backend/` (Express + Prisma + SQLite) foi **removido do repositório** em 2026-07-22: sua lógica (schema, validação Zod, seed) foi portada para dentro do `frontend/`, evitando manter duas implementações da mesma coisa.

---

## 3. Como rodar localmente

```bash
cd paratech-premium-website-redesign/frontend
npm install                        # roda "prisma generate" automaticamente (postinstall)
# preencha frontend/.env.local com os valores reais (ver seção 4 e .env.example)
npx prisma migrate dev --name init # cria as tabelas no Postgres apontado por DATABASE_URL
npm run db:seed                    # popula 14 categorias, 3 estoques, 16 produtos
npm run dev                        # sobe em http://localhost:3000
```

Login do admin: `http://localhost:3000/admin/login`, com a senha em `ADMIN_PASSWORD`.

Os arquivos `.dc.html` em `project/` continuam sendo só para leitura de referência de design — por instrução do handoff, não renderizar no navegador nem tirar screenshot a menos que solicitado.

---

## 4. Variáveis de ambiente (`frontend/.env.local`)

| Var | Descrição |
|---|---|
| `DATABASE_URL` | Connection string do Postgres. Gerada automaticamente ao rodar `vercel install neon` e conectada ao projeto — confirme o nome exato da variável depois de provisionar (pode não ser literalmente `DATABASE_URL`; ver `COMO-FINALIZAR-RAPIDO.md`). |
| `BLOB_READ_WRITE_TOKEN` | Token do Vercel Blob, gerado ao criar o store (`vercel blob create-store`) e conectado automaticamente ao projeto. |
| `ADMIN_PASSWORD` | Senha única de acesso ao `/admin`. Sem cadastro de usuário — é um único administrador. |
| `SESSION_SECRET` | Chave usada para assinar o cookie de sessão do admin (`openssl rand -base64 32`). |

Nenhuma dessas variáveis é commitada — só `.env.example` (documentação, sem valores reais) fica versionado.

---

## 5. Checklist de prontidão para produção

| Item | Status | Observação |
|---|---|---|
| Frontend de produção (Home, Catálogo, Contato) | ✅ Pronto | Next.js, pixel-perfect a partir dos protótipos |
| Painel admin (login + CRUD de produto + upload de foto) | ✅ Código pronto | Falta testar contra um banco/storage reais |
| Banco de dados compatível com serverless | ⚠️ Schema pronto, não provisionado | `schema.prisma` já aponta pra `postgresql`; falta criar o Postgres (Neon via Vercel) e rodar a migration |
| Storage de upload | ⚠️ Código pronto, não provisionado | Upload já usa Vercel Blob (`@vercel/blob`); falta criar o store |
| Config de build/deploy | ✅ Não precisa de nada extra | Next.js é auto-detectado pela Vercel; `postinstall: prisma generate` já configurado |
| Variáveis de ambiente de produção | ❌ Não definidas | Precisam ser criadas no projeto Vercel (seção 4) |
| Autenticação do admin | ✅ Implementada | Sessão via cookie assinado (JWT/`jose`), senha única em `ADMIN_PASSWORD` |
| Revisão visual no navegador | ⏳ Pendente | Código de produção pode e deve ser conferido no navegador (diferente dos protótipos `.dc.html`) |
| Merge `teste` → `main` | ⏳ Pendente | Só depois da revisão, com sua confirmação |
| Deploy Vercel + domínio próprio | ⏳ Pendente | Ver `COMO-FINALIZAR-RAPIDO.md` |
| Testes automatizados / CI | ❌ Não existe | Fora do escopo atual |

Passo a passo completo (o que eu faço, o que precisa de você) está em `COMO-FINALIZAR-RAPIDO.md`.

---

## 6. Confirmação: repositório isolado

Verificado diretamente no git:

- Único diretório `.git`, na raiz `paratech-premium-website-redesign-handoff/` (sem `.git` aninhado em `project/` ou `frontend/`, nem submódulos).
- Único remote configurado:
  ```
  origin  git@github.com:IDRINKPRO/paratechinfo.git
  ```
- Branches locais/remotas: `main` e `teste`.

**Confirmado: este repositório é dedicado à Paratech, sem mistura com outros projetos.**
