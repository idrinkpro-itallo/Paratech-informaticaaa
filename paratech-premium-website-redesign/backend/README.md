# Backend — Paratech

API do catálogo, captura de leads e upload de imagens para o site da **Paratech**
(ARJ Informática e Acessórios LTDA — Pará de Minas/MG).

Stack: **Node.js + Express + Prisma (SQLite)**. Os dados são semeados a partir de
`../project/products-data.js` — a mesma fonte de verdade que os protótipos usam.

## Como rodar

```bash
cd paratech-premium-website-redesign/backend
cp .env.example .env        # ajuste se quiser
npm install
npm run db:migrate          # cria o banco SQLite e as tabelas
npm run db:seed             # popula 14 categorias, 3 estoques, 16 produtos
npm run dev                 # sobe em http://localhost:3333
```

Health check: `GET http://localhost:3333/api/health`

## Variáveis de ambiente (`.env`)

| Var | Descrição |
|---|---|
| `PORT` | Porta HTTP (default 3333) |
| `DATABASE_URL` | Caminho do SQLite. Troque por uma URL Postgres para migrar depois |
| `CORS_ORIGIN` | Origem permitida no CORS (`*` em dev, URL do site em produção) |
| `ADMIN_TOKEN` | Se definido, exige `x-admin-token` nas rotas de escrita. Vazio = sem auth |
| `PUBLIC_BASE_URL` | Base usada para montar as URLs das imagens enviadas |

## Endpoints

| Método | Rota | Descrição |
|---|---|---|
| GET | `/api/products` | Lista com filtros `?category=&maxPrice=&q=&sort=` |
| GET | `/api/products/:id` | Um produto |
| POST | `/api/products` | Cria produto 🔒 |
| PUT | `/api/products/:id` | Atualiza produto 🔒 |
| DELETE | `/api/products/:id` | Remove produto 🔒 |
| POST | `/api/products/:id/image` | Upload da foto (multipart, campo `image`) 🔒 |
| GET | `/api/categories` | 14 categorias (`?active=true` → só as com produtos) |
| GET/POST/PUT/DELETE | `/api/categories/:id` | CRUD de categoria (🔒 nas de escrita) |
| GET | `/api/stock-status` | 3 estados de estoque (label + cor) |
| POST | `/api/leads` | Salva lead e devolve o link `wa.me` pronto |
| GET | `/api/leads` | Lista leads 🔒 |
| GET | `/api/meta` | Números de WhatsApp da loja |

🔒 = protegida quando `ADMIN_TOKEN` está definido.

`sort` aceita: `relevancia` (default), `preco-asc`, `preco-desc`, `nome`.

### Exemplos

```bash
# Impressoras até R$600, mais baratas primeiro
curl "http://localhost:3333/api/products?category=printers&maxPrice=600&sort=preco-asc"

# Categorias com produtos (as 8 ativas)
curl "http://localhost:3333/api/categories?active=true"

# Novo produto (com ADMIN_TOKEN definido)
curl -X POST http://localhost:3333/api/products \
  -H "Content-Type: application/json" -H "x-admin-token: SEU_TOKEN" \
  -d '{"name":"SSD 1TB","description":"...","categoryId":"ssd-storage","stock":"in-stock","price":399.9,"installment":"6x de R$ 66,65"}'

# Lead de orçamento de um produto
curl -X POST http://localhost:3333/api/leads \
  -H "Content-Type: application/json" \
  -d '{"nome":"João","telefone":"37999998888","source":"orcamento","productId":1}'

# Upload de foto do produto 1
curl -X POST http://localhost:3333/api/products/1/image -F "image=@foto.jpg"
```

## Segurança (recomendação)

As rotas de escrita ficam **abertas** por padrão (você optou por não ter login).
Para trancá-las sem instalar nada, defina `ADMIN_TOKEN` no `.env` — o painel/cliente
passa a precisar do header `x-admin-token`. Nunca comite o `.env` (já está no
`.gitignore`).

## Notas

- O banco (`prisma/dev.db`) e as imagens enviadas (`uploads/*`) **não** vão para o
  git — recrie com `db:migrate` + `db:seed`.
- Busca (`q`) usa `LIKE` do SQLite (case-insensitive para ASCII).
- Para migrar a Postgres: troque `provider`/`url` no `schema.prisma` e o `DATABASE_URL`.
