# Paratech — frontend (Next.js)

App de produção do site da Paratech: páginas públicas (Home, Catálogo, Contato) + painel `/admin`, num único deploy Next.js. Sem API separada — Server Components/Actions falam direto com o Postgres via Prisma.

Documentação completa (arquitetura, plano de deploy, checklist de entrega) está na raiz do repositório: [`DOCUMENTACAO.md`](../../DOCUMENTACAO.md), [`COMO-FINALIZAR-RAPIDO.md`](../../COMO-FINALIZAR-RAPIDO.md).

## Rodando localmente

```bash
npm install                        # roda "prisma generate" via postinstall
# preencha .env.local com os valores reais (ver .env.example)
npx prisma migrate dev --name init # só na primeira vez, cria as tabelas
npm run db:seed                    # popula categorias/estoques/produtos iniciais
npm run dev                        # http://localhost:3000
```

## Variáveis de ambiente

Ver [`.env.example`](.env.example). Nenhuma delas é commitada — só o `.env.example` (documentação, sem valores reais) fica versionado.

## Deploy

Configurado para Vercel (`vercel.json`, região `gru1`/São Paulo). O script `vercel-build` roda `prisma migrate deploy` antes do build, então migrations pendentes são aplicadas a cada deploy automaticamente — só funciona depois que o Postgres (Neon) estiver provisionado e `DATABASE_URL` configurado no projeto Vercel.
