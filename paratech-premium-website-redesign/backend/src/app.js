// Monta a aplicação Express: middlewares, arquivos estáticos, rotas e
// tratamento de erros. O bootstrap (listen) fica em server.js.
import express from "express";
import "express-async-errors"; // faz erros de handlers async chegarem ao errorHandler
import cors from "cors";
import morgan from "morgan";

import { UPLOAD_DIR } from "./middleware/upload.js";
import { notFound, errorHandler } from "./middleware/errorHandler.js";
import { productsRouter } from "./routes/products.js";
import { categoriesRouter } from "./routes/categories.js";
import { stockRouter } from "./routes/stock.js";
import { leadsRouter } from "./routes/leads.js";
import { metaRouter } from "./routes/meta.js";

export function createApp() {
  const app = express();

  app.use(cors({ origin: process.env.CORS_ORIGIN || "*" }));
  app.use(express.json());
  app.use(morgan("dev"));

  // Fotos de produto enviadas via upload
  app.use("/uploads", express.static(UPLOAD_DIR));

  // Health check
  app.get("/api/health", (req, res) => res.json({ status: "ok" }));

  // Rotas da API
  app.use("/api/products", productsRouter);
  app.use("/api/categories", categoriesRouter);
  app.use("/api/stock-status", stockRouter);
  app.use("/api/leads", leadsRouter);
  app.use("/api/meta", metaRouter);

  app.use(notFound);
  app.use(errorHandler);

  return app;
}
