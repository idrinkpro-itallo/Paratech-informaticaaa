// Rotas de categorias. GET all (14) ou ?active=true (só as com produtos,
// espelhando o derivado CATEGORIES do protótipo) + CRUD.
import { Router } from "express";
import { prisma } from "../db.js";
import { adminGuard } from "../middleware/adminGuard.js";
import { categoryCreateSchema, categoryUpdateSchema } from "../validators/schemas.js";
import { HttpError } from "../utils/waLink.js";

export const categoriesRouter = Router();

// GET /api/categories  |  GET /api/categories?active=true
categoriesRouter.get("/", async (req, res) => {
  const categories = await prisma.category.findMany({
    include: { _count: { select: { products: true } } },
  });
  let list = categories;
  if (req.query.active === "true") list = list.filter((c) => c._count.products > 0);
  res.json({
    count: list.length,
    categories: list.map((c) => ({
      id: c.id,
      label: c.label,
      c1: c.c1,
      c2: c.c2,
      accent: c.accent,
      glow: c.glow,
      productCount: c._count.products,
    })),
  });
});

// GET /api/categories/:id
categoriesRouter.get("/:id", async (req, res) => {
  const c = await prisma.category.findUnique({ where: { id: req.params.id } });
  if (!c) throw new HttpError(404, "Categoria não encontrada.");
  res.json(c);
});

// POST /api/categories
categoriesRouter.post("/", adminGuard, async (req, res) => {
  const data = categoryCreateSchema.parse(req.body);
  const c = await prisma.category.create({ data });
  res.status(201).json(c);
});

// PUT /api/categories/:id
categoriesRouter.put("/:id", adminGuard, async (req, res) => {
  const data = categoryUpdateSchema.parse(req.body);
  const c = await prisma.category.update({ where: { id: req.params.id }, data });
  res.json(c);
});

// DELETE /api/categories/:id — bloqueado se houver produtos vinculados.
categoriesRouter.delete("/:id", adminGuard, async (req, res) => {
  const count = await prisma.product.count({ where: { categoryId: req.params.id } });
  if (count > 0) throw new HttpError(409, `Categoria tem ${count} produto(s) vinculado(s).`);
  await prisma.category.delete({ where: { id: req.params.id } });
  res.status(204).end();
});
