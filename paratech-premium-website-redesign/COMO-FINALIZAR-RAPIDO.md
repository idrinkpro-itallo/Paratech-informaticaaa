# Como finalizar o projeto — plano de execução

> Complementa o [`DOCUMENTACAO.md`](DOCUMENTACAO.md) (auditoria técnica). Este arquivo é o **plano de ação**: o que fazer, em que ordem, o que eu faço por você e o que só você pode fazer.

**Decisão atualizada (2026-07-22):** o caminho estático (sem banco, sugerido mais cedo hoje) foi revertido — o site tem um **painel admin de verdade**, com banco Postgres e upload de foto reais. Tudo unificado num único app Next.js: nada de API separada, nada de segundo serviço pra hospedar. Postgres via **Neon** (integração nativa da Vercel) e fotos no **Vercel Blob**.

---

## 1. Visão geral

```
Protótipos (.dc.html)  →  Next.js (site público + /admin)  →  GitHub  →  Vercel
                                      ↑                            ↓
                              Prisma (Server Actions)      Postgres (Neon) + Blob
```

- **Sem carrinho, sem login de cliente** — continua tudo pelo WhatsApp, como o design prevê. Só existe um login: o do administrador da loja, pra gerenciar o catálogo.
- **Cadastrar produto = logar em `/admin`, preencher o formulário, enviar a foto.** Nada de editar arquivo de código.
- O código já está pronto (Home, Catálogo, Contato, painel admin completo com upload de foto). O que falta é **provisionar a infraestrutura real** (banco, storage, projeto Vercel) — isso precisa da sua conta Vercel, então tem passos que só você consegue fazer.

---

## 2. Passo a passo

### Passo 1 — Provisionar Postgres e Blob na Vercel (você precisa fazer isso)

Não existe, nas ferramentas que tenho aqui, um jeito de criar banco/storage na Vercel remotamente — isso só existe via CLI da Vercel ou pelo painel web, e a CLI exige login interativo (navegador), que não roda numa sessão automatizada minha. Rode isto no seu terminal, dentro da pasta do projeto:

```bash
npm i -g vercel
vercel login
cd paratech-premium-website-redesign/frontend
vercel link                                                  # conecta esta pasta a um projeto Vercel (cria se não existir)
vercel install neon --yes                                    # provisiona o Postgres, conecta a variável ao projeto
vercel blob create-store paratech --access public --yes      # provisiona o storage de fotos
vercel env add ADMIN_PASSWORD                                # a senha de acesso ao /admin
vercel env add SESSION_SECRET                                # gere com: openssl rand -base64 32
vercel env pull .env.local                                   # baixa as variáveis reais pra rodar local
```

Depois disso, me avisa — eu confirmo os nomes exatos das variáveis que a integração do Neon gerou (podem não ser literalmente `DATABASE_URL`), ajusto o `schema.prisma` se precisar, rodo a primeira migration (`npx prisma migrate dev`) e o seed (`npm run db:seed`) pra popular os 16 produtos iniciais.

### Passo 2 — Revisão visual (você olhando, eu rodando)

Depois que o banco estiver populado, eu subo `npm run dev` local e te aviso a URL — diferente dos protótipos `.dc.html`, o **código de produção pode e deve ser conferido no navegador**. Nessa revisão dá pra testar o fluxo completo: ver os produtos no Catálogo, entrar no `/admin`, cadastrar um produto de teste com foto, editar, apagar.

### Passo 3 — Como cadastrar/editar produto daqui pra frente

Login em `/admin` com a senha (`ADMIN_PASSWORD`). De lá:
- **Novo produto**: botão "+ Novo produto" → formulário (nome, descrição, categoria, estoque, preço, preço antigo, parcelamento, tag, marca, foto) → salvar.
- **Editar/apagar**: na listagem, "Editar" ou "Apagar" (com confirmação) em cada linha.
- Categoria e estoque são escolhidos de listas fixas — as 14 categorias e os 3 estados de estoque continuam sendo identidade visual definida em código (cada categoria tem um ícone SVG desenhado à mão), então **categoria nova continua sendo um pedido pra mim** (uso a skill `nova-categoria`), não algo que se cadastra pelo formulário.
- Mudanças aparecem no site na hora — não precisa esperar um novo deploy.

### Passo 4 — Deploy na Vercel

1. Repo já existe em `github.com/IDRINKPRO/paratechinfo` (branches `main`/`teste`) — sigo commitando na `teste` e você aprova o merge pra `main`.
2. Se ainda não conectou o repositório do GitHub ao projeto Vercel durante o `vercel link` do Passo 1, isso dá pra fazer pelo painel Vercel ("Import Git Repository") — assim cada push na `main` vira deploy automático, e branches de preview ganham URL própria pra revisar antes de aprovar.
3. Variáveis de ambiente de produção: as mesmas do Passo 1 (`DATABASE_URL`/equivalente, `BLOB_READ_WRITE_TOKEN`, `ADMIN_PASSWORD`, `SESSION_SECRET`) precisam existir no projeto Vercel — o `vercel env add` do Passo 1 já cuida disso se você rodou de dentro da pasta linkada. Sem `DATABASE_URL` válida o build falha de propósito (o script `vercel-build` roda `prisma migrate deploy` antes do `next build`), então este passo é bloqueante.
4. `frontend/vercel.json` já fixa a região (`gru1`/São Paulo); framework é auto-detectado. Nenhuma configuração extra necessária no painel além das env vars.
5. Primeiro deploy público eu só faço com sua confirmação na hora.

### Passo 5 — Domínio próprio

1. Definir o nome do domínio (ex.: `paratech.com.br`, `paratechinfo.com.br`).
2. Verificar disponibilidade e preço — posso checar isso diretamente.
3. **Comprar é uma ação real com custo financeiro** — vou sempre confirmar com você o nome exato e o preço antes de fechar a compra, nunca decido isso sozinho.
4. Depois de comprado, apontar o domínio pro projeto Vercel (DNS/nameservers) — a Vercel guia esse passo automaticamente após adicionar o domínio no projeto.

### Passo 6 — Google Meu Negócio (Perfil da Empresa no Google)

Isso é **100% fora do meu alcance de ferramentas** — precisa ser feito por vocês diretamente, porque exige login na conta Google da empresa e verificação de identidade do negócio (vídeo/foto do local, ou cartão postal com código enviado ao endereço físico).

Passo a passo pra vocês fazerem:

1. Acessar `business.google.com` com a conta Google que vai administrar o perfil.
2. Cadastrar: nome **Paratech** (ARJ Informática e Acessórios LTDA), categoria "Loja de informática", endereço completo em Pará de Minas/MG, telefone de suporte (`(37) 99122-2578`), horário de funcionamento.
3. Assim que tiver o domínio (Passo 5) e o site no ar (Passo 4), adicionar a URL do site no perfil.
4. Verificar o negócio pelo método que o Google oferecer.
5. Depois de verificado, o perfil aparece no Google Search/Maps já linkando pro site novo.

Se quiser, posso redigir a descrição do negócio e os textos do perfil pra vocês colarem lá, no mesmo tom de voz da marca.

---

## 3. Ordem recomendada

1. **Passo 1** (provisionar banco/storage) — nada anda sem isso.
2. **Passo 2** (revisão) logo em seguida, local, antes de qualquer deploy público.
3. **Passo 4** (deploy Vercel) depois da revisão aprovada e do merge `teste → main`.
4. **Passo 5** (domínio) depois que o site já está estável no ar.
5. **Passo 6** (Google Meu Negócio) por último — mas o cadastro em si pode começar em paralelo a qualquer momento.

## 4. O que fica pra depois (não bloqueia o lançamento)

- CRUD de categorias/estoque no admin (hoje são listas fixas — coerente com o fato de cada categoria ter um ícone SVG próprio, desenhado à mão).
- Persistir os leads do formulário de Contato num banco (hoje ele só abre o WhatsApp direto, como o protótipo original fazia — o modelo `Lead` existe no schema mas não é usado ainda).
- Testes automatizados / CI.

## 5. Resumo do que preciso de você em cada etapa

| Etapa | Quem faz | O que preciso de você |
|---|---|---|
| Provisionar Postgres/Blob na Vercel | Você (CLI, login interativo) | Rodar os comandos do Passo 1 e me passar o sinal verde |
| Revisão do site | Eu rodo, você revisa | Olhar no navegador e aprovar (ou pedir ajuste) |
| Cadastrar/editar produto | Você, direto no `/admin` | Nada — é autoatendimento agora |
| Merge `teste` → `main` | Eu, com sua confirmação | Aprovar o merge |
| Deploy Vercel | Eu, com sua confirmação | Aprovar o primeiro deploy público |
| Domínio | Eu verifico disponibilidade/preço, você aprova a compra | Confirmar nome do domínio e autorizar o pagamento |
| Google Meu Negócio | Você (ou o responsável pela empresa) | Fazer o cadastro e a verificação — eu posso escrever os textos |
