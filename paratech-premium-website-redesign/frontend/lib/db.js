// Instância única do PrismaClient. Guard em globalThis para o hot-reload do
// `next dev` não abrir uma conexão nova a cada recarga de módulo.
import "server-only";
import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis;

export const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
