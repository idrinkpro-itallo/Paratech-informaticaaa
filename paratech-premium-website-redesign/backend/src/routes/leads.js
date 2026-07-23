// Rotas de leads. POST salva o lead E devolve o link wa.me pronto (número de
// suporte para "contato", de vendas para "orcamento"). GET lista para a loja.
import { Router } from "express";
import { prisma } from "../db.js";
import { adminGuard } from "../middleware/adminGuard.js";
import { leadCreateSchema } from "../validators/schemas.js";
import { waLink, WA_SUPPORT, WA_SALES, HttpError } from "../utils/waLink.js";

export const leadsRouter = Router();

// POST /api/leads
leadsRouter.post("/", async (req, res) => {
  const data = leadCreateSchema.parse(req.body);

  // Se veio de um produto, valida a referência e enriquece a mensagem.
  let productName = null;
  if (data.productId) {
    const product = await prisma.product.findUnique({ where: { id: data.productId } });
    if (!product) throw new HttpError(400, "Produto informado não existe.");
    productName = product.name;
  }

  const lead = await prisma.lead.create({ data });

  // Monta a mensagem de WhatsApp equivalente à dos protótipos.
  const isOrcamento = data.source === "orcamento";
  const number = isOrcamento ? WA_SALES : WA_SUPPORT;
  const message = isOrcamento
    ? `Quero um orçamento para: ${productName ?? data.mensagem ?? "-"}`
    : `Olá! Meu nome é ${data.nome}.\nTelefone: ${data.telefone}\nAssunto: ${data.assunto ?? "-"}\nMensagem: ${data.mensagem ?? "-"}`;

  res.status(201).json({ lead, whatsapp: { number, link: waLink(number, message) } });
});

// GET /api/leads — mais recentes primeiro
leadsRouter.get("/", adminGuard, async (req, res) => {
  const leads = await prisma.lead.findMany({ orderBy: { createdAt: "desc" } });
  res.json({ count: leads.length, leads });
});
