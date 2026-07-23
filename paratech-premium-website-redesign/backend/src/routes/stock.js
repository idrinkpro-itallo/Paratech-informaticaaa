// Rota de estados de estoque (label + cor).
import { Router } from "express";
import { prisma } from "../db.js";

export const stockRouter = Router();

// GET /api/stock-status
stockRouter.get("/", async (req, res) => {
  const list = await prisma.stockStatus.findMany();
  res.json({ count: list.length, stockStatus: list });
});
