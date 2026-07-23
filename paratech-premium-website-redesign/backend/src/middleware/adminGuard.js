// Proteção opcional das rotas de escrita (POST/PUT/DELETE/upload).
// Se ADMIN_TOKEN não estiver definido no .env, o guard é um no-op (rotas
// abertas). Se estiver, exige o header  x-admin-token: <valor>.
import { HttpError } from "../utils/waLink.js";

export function adminGuard(req, res, next) {
  const expected = process.env.ADMIN_TOKEN;
  if (!expected) return next(); // sem token configurado → sem autenticação

  const provided = req.get("x-admin-token");
  if (provided && provided === expected) return next();

  throw new HttpError(401, "Não autorizado. Envie o header x-admin-token.");
}
