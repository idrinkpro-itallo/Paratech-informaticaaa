// Tratamento centralizado de erros. Formato de resposta:
//   { error: { message, details? } }
import { ZodError } from "zod";
import { HttpError } from "../utils/waLink.js";

export function notFound(req, res) {
  res.status(404).json({ error: { message: "Rota não encontrada." } });
}

// eslint-disable-next-line no-unused-vars — Express exige os 4 argumentos
export function errorHandler(err, req, res, next) {
  if (err instanceof ZodError) {
    return res.status(400).json({
      error: {
        message: "Dados inválidos.",
        details: err.issues.map((i) => ({ campo: i.path.join("."), erro: i.message })),
      },
    });
  }

  if (err instanceof HttpError) {
    return res.status(err.status).json({
      error: { message: err.message, details: err.details },
    });
  }

  // Violação de chave estrangeira / registro inexistente do Prisma
  if (err.code === "P2003") {
    return res.status(400).json({ error: { message: "Referência inválida (categoria ou estoque inexistente)." } });
  }
  if (err.code === "P2025") {
    return res.status(404).json({ error: { message: "Registro não encontrado." } });
  }
  if (err.code === "P2002") {
    return res.status(409).json({ error: { message: "Registro duplicado." } });
  }

  console.error(err);
  res.status(500).json({ error: { message: "Erro interno do servidor." } });
}
