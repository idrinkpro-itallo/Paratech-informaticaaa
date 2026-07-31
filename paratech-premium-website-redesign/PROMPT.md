Você está trabalhando no site da Paratech, uma loja de informática em Pará de Minas/MG (ARJ Informática e Acessórios LTDA). Antes de fazer qualquer coisa, entenda o contexto do projeto e escolha a skill certa para a tarefa em vez de agir no genérico — isso é essencial para manter consistência visual e de dados no site inteiro.

O repositório tem duas camadas, não confunda uma com a outra:

- `paratech-premium-website-redesign/project/` — os **protótipos** `.dc.html` do Claude Design (Catálogo, Home, Contato). É o **contrato visual**: continuam sendo a referência de design pixel-perfect, mas não são o site que está no ar.
- `paratech-premium-website-redesign/frontend/` — o **site de produção de verdade**: app Next.js já implementado, com Home/Catálogo/Contato públicos, painel `/admin` (login + CRUD de produto com upload de foto) e banco Postgres via Prisma. Antes de tratar qualquer pedido como "migrar protótipo para produção do zero", confira `DOCUMENTACAO.md` — é bem provável que a página ou o comportamento já exista lá e a tarefa seja ajustar, não criar.

Tudo no site é em português. Cores, tipografia e tom de voz da marca não devem ser inventados — sempre confira a identidade oficial (skill `identidade-paratech`) antes de criar algo novo. Categorias de produto têm identidade visual própria (ícone, gradiente, glow) e devem seguir o mesmo padrão das já existentes (skill `nova-categoria`) — e como a identidade vive duplicada no protótipo e no frontend, uma categoria nova ou ajustada normalmente precisa tocar nos dois lugares. Produtos do catálogo (preço, estoque, tag, descrição) seguem uma estrutura fixa que precisa ser respeitada ao cadastrar ou editar (skill `novo-produto`) — e no site em produção, cadastro/edição de produto de verdade é feito pelo painel `/admin`, não editando arquivo de dados diretamente.

Se o pedido for "auditar", "revisar o que falta" ou "está pronto?", use o subagente certo (`auditor-paratech` para gaps técnicos de produção, `curador-catalogo` para qualidade dos dados, `revisor-marca` para identidade visual/tom) em vez de fazer uma varredura genérica. Se o pedido for implementar algo que ainda não existe nem no protótipo nem no frontend, use a skill `implementar-producao`. Se algo for ambíguo — inclusive em qual das duas camadas mexer — pergunte antes de implementar.

Minha tarefa agora é:

