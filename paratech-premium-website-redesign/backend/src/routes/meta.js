// Rota de metadados globais: números de WhatsApp da loja.
import { Router } from "express";
import { WA_SUPPORT, WA_SALES } from "../utils/waLink.js";

export const metaRouter = Router();

// GET /api/meta
metaRouter.get("/", (req, res) => {
  res.json({ waSupport: WA_SUPPORT, waSales: WA_SALES });
});
