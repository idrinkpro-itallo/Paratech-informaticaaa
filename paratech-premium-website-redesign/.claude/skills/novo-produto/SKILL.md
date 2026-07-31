---
name: novo-produto
description: Adicionar, editar ou remover produtos do catálogo Paratech (products-data.js). Use quando o usuário pedir para cadastrar produto, mudar preço, marcar promoção, alterar estoque ou tag.
---

# Novo produto no catálogo

Primeiro identifique **qual camada** o pedido afeta — o repositório tem duas fontes de produto que não se sincronizam sozinhas:

- **Protótipo** (`paratech-premium-website-redesign/project/products-data.js`, array `PRODUCTS`) — a referência de design. Editar aqui não afeta o site no ar.
- **Produção** (`paratech-premium-website-redesign/frontend/`) — o site que os clientes veem. Produtos vivem no Postgres (modelo `Product` em `prisma/schema.prisma`), e o jeito correto de cadastrar/editar/apagar é pelo **painel `/admin`** (login com `ADMIN_PASSWORD` → "+ Novo produto" ou "Editar"/"Apagar" na listagem) — que já cuida de upload de foto (Vercel Blob) e validação (Zod). `frontend/lib/products-data.js` tem seu próprio array `PRODUCTS`, mas ele só é usado **uma vez**, pelo `prisma/seed.js`, para popular o banco na primeira migration — editá-lo depois disso não muda nada no site.

Se o pedido for algo como "cadastra esse produto" sem deixar claro a camada, pergunte se é para o protótipo (design), para produção (aí é o `/admin`, ou você mesmo rodando uma alteração via Prisma se tiver acesso ao banco) ou para os dois.

Em qualquer camada, os cards do Catálogo e da Home se montam sozinhos a partir dos dados — **nunca** edite HTML para adicionar produto.

## Formato de um produto

```js
{ id: 17, name: "Nome comercial do produto", category: "laptops",
  description: "Uma frase de venda curta (máx ~70 chars — o card corta em 2 linhas).",
  stock: "in-stock", price: 1299.9, oldPrice: 1499.9,
  installment: "10x de R$ 129,99", tag: "Promoção", brand: "Genérico" }
```

## Regras de preenchimento

1. **id**: próximo inteiro livre (olhe o maior id existente).
2. **category**: deve ser uma chave de `CATEGORY_META` (14 disponíveis: laptops, desktop-computers, gaming, smartphones, printers, networking, ssd-storage, ram-memory, monitors, accessories, audio, security-cameras, cables, office-equipment). Se a categoria ainda não tem produtos, ela passa a aparecer automaticamente nos chips de filtro (`CATEGORIES` é derivada) — mas confira se `Catalogo.dc.html` tem o ícone SVG dela (todos os 14 têm).
3. **stock**: `"in-stock"` | `"low-stock"` | `"backorder"` (ver `STOCK_META`).
4. **price/oldPrice**: números JS (ponto decimal). `oldPrice: null` se não há desconto; se houver `oldPrice`, normalmente a `tag` é `"Promoção"`.
5. **installment**: string pronta em pt-BR. Padrão da casa: até ~R$ 50 é `"à vista"`; acima, `"Nx de R$ Y,YY"` com N ≤ 10 e Y = price/N com vírgula decimal. Confira a conta.
6. **tag**: `"Novo"` | `"Promoção"` | `"Mais vendido"` | `null`. Só esses três têm estilo definido (função `tagStyle` em Catalogo.dc.html) — qualquer outro valor renderiza invisível.
7. **description**: tom de vendedor consultivo, benefício direto, sem jargão técnico pesado. Espelhe o estilo das existentes.

## Depois de editar

- Editando só o protótipo (`project/products-data.js`): não é preciso mexer em mais nenhum arquivo.
- Editando produção: prefira orientar o uso do painel `/admin` em vez de editar dados direto. Se você mesmo estiver alterando o banco (ex.: script Prisma, correção pontual), lembre que `categoryId` deve existir em `Category` e `stock` em `StockStatus` antes de gravar o produto.