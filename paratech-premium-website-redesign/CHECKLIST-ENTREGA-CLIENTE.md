# Checklist de entrega — site Paratech

Checklist final para repassar ao cliente (ARJ Informática e Acessórios / Paratech) quando o site estiver no ar. Marque cada item conforme for concluído — os primeiros dependem do `COMO-FINALIZAR-RAPIDO.md`.

## Antes de entregar

- [ ] Banco Postgres e storage de fotos provisionados e populados (`COMO-FINALIZAR-RAPIDO.md`, Passo 1)
- [ ] Site revisado no navegador — Home, Catálogo, Contato conferidos (Passo 2)
- [ ] Painel `/admin` testado: login, cadastrar produto com foto, editar, apagar
- [ ] Merge `teste` → `main` aprovado e feito
- [ ] Deploy de produção na Vercel aprovado e no ar
- [ ] Domínio próprio comprado e apontado (se aplicável nesta entrega)
- [ ] Números de WhatsApp confirmados com o cliente: suporte `(37) 99122-2578`, vendas `(37) 99968-1192`
- [ ] Endereço e horário de funcionamento no rodapé e na página de Contato conferidos com o cliente

## O que entregar ao cliente

1. **Link do site** (domínio próprio, ou a URL `.vercel.app` enquanto o domínio não sai).
2. **Acesso ao painel admin**: link `/admin` + a senha (`ADMIN_PASSWORD`) — combinar um canal seguro pra passar a senha (não por e-mail em texto puro).
3. **Como usar o painel** (roteiro curto pro cliente):
   - Acessar `<site>/admin` e logar com a senha.
   - "+ Novo produto" para cadastrar; preencher nome, descrição, categoria, estoque, preço, parcelamento, tag (opcional) e enviar a foto.
   - Na listagem, "Editar" pra mudar preço/estoque/foto de um produto existente, "Apagar" pra remover (pede confirmação).
   - Mudanças aparecem no site na hora, sem precisar de ninguém técnico.
   - Categoria nova (ex.: uma linha de produto que a loja passa a vender e ainda não existe no site) **não** é feita pelo formulário — precisa ser pedida pra equipe técnica, porque cada categoria tem um ícone e uma identidade visual próprios.
4. **O que o site NÃO faz** (pra alinhar expectativa): não tem carrinho nem pagamento online — todo pedido é fechado por WhatsApp, como já era o funcionamento da loja.

## Depois da entrega (fica documentado, não bloqueia)

- [ ] Perfil da empresa no Google (Google Meu Negócio) cadastrado e verificado (`COMO-FINALIZAR-RAPIDO.md`, Passo 6) — ação do cliente, fora do alcance técnico deste projeto.
- [ ] Combinar com o cliente quem aciona a equipe técnica se precisar de: categoria nova, mudança de identidade visual, campo novo no cadastro de produto, ou qualquer coisa fora do dia a dia de cadastrar/editar produto.
