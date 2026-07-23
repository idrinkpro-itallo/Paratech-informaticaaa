// Rotas de produtos: listagem com filtros (categoria, preço máx, busca,
// ordenação — espelhando o Catálogo), CRUD e upload de imagem.
import { Router } from "express";
import { prisma } from "../db.js";
import { adminGuard } from "../middleware/adminGuard.js";
import { upload } from "../middleware/upload.js";
import { productCreateSchema, productUpdateSchema } from "../validators/schemas.js";
import { HttpError } from "../utils/waLink.js";

export const productsRouter = Router();

// Achata os metadados da categoria e do estoque no produto, para o card não
// precisar de uma segunda chamada.
function serialize(p) {
  const { category, stockStatus, categoryId, stock, ...rest } = p;
  return {
    ...rest,
    category: categoryId,
    categoryLabel: category?.label ?? null,
    categoryMeta: category
      ? { c1: category.c1, c2: category.c2, accent: category.accent, glow: category.glow }
      : null,
    stock,
    stockMeta: stockStatus ? { label: stockStatus.label, color: stockStatus.color } : null,
  };
}

const INCLUDE = { category: true, stockStatus: true };

const SORT = {
  relevancia: [{ id: "asc" }],
  "preco-asc": [{ price: "asc" }],
  "preco-desc": [{ price: "desc" }],
  nome: [{ name: "asc" }],
};

// GET /api/products?category=&maxPrice=&q=&sort=
productsRouter.get("/", async (req, res) => {
  const { category, maxPrice, q, sort } = req.query;

  const where = {};
  if (category && category !== "all") where.categoryId = String(category);
  if (maxPrice !== undefined && maxPrice !== "") {
    const max = Number(maxPrice);
    if (!Number.isNaN(max)) where.price = { lte: max };
  }
  if (q) where.name = { contains: String(q) };

  const orderBy = SORT[sort] ?? SORT.relevancia;

  const products = await prisma.product.findMany({ where, orderBy, include: INCLUDE });
  res.json({ count: products.length, products: products.map(serialize) });
});

// GET /api/products/:id
productsRouter.get("/:id", async (req, res) => {
  const product = await prisma.product.findUnique({
    where: { id: Number(req.params.id) },
    include: INCLUDE,
  });
  if (!product) throw new HttpError(404, "Produto não encontrado.");
  res.json(serialize(product));
});

// POST /api/products
productsRouter.post("/", adminGuard, async (req, res) => {
  const data = productCreateSchema.parse(req.body);
  const product = await prisma.product.create({ data, include: INCLUDE });
  res.status(201).json(serialize(product));
});

// PUT /api/products/:id
productsRouter.put("/:id", adminGuard, async (req, res) => {
  const data = productUpdateSchema.parse(req.body);
  const product = await prisma.product.update({
    where: { id: Number(req.params.id) },
    data,
    include: INCLUDE,
  });
  res.json(serialize(product));
});

// DELETE /api/products/:id
productsRouter.delete("/:id", adminGuard, async (req, res) => {
  await prisma.product.delete({ where: { id: Number(req.params.id) } });
  res.status(204).end();
});

// POST /api/products/:id/image  (multipart, campo "image")
productsRouter.post("/:id/image", adminGuard, upload.single("image"), async (req, res) => {
  if (!req.file) throw new HttpError(400, "Envie um arquivo no campo 'image'.");
  const base = process.env.PUBLIC_BASE_URL || "";
  const imageUrl = `${base}/uploads/${req.file.filename}`;
  const product = await prisma.product.update({
    where: { id: Number(req.params.id) },
    data: { imageUrl },
    include: INCLUDE,
  });
  res.status(201).json(serialize(product));
});
