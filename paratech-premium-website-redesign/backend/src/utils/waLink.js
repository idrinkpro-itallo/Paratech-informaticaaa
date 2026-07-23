// Porta do helper waLink() de project/products-data.js + os números de WhatsApp
// da Paratech. WA_SALES: vendas/orçamentos. WA_SUPPORT: suporte/atendimento.
export const WA_SUPPORT = "5537991222578";
export const WA_SALES = "5537999681192";

export function waLink(number, message) {
  return "https://wa.me/" + number + "?text=" + encodeURIComponent(message);
}

// Erro HTTP com status, lançado pelas rotas e tratado no errorHandler.
export class HttpError extends Error {
  constructor(status, message, details) {
    super(message);
    this.status = status;
    this.details = details;
  }
}
