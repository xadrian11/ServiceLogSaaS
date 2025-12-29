
// Używamy ścieżki pasującej do struktury plików w środowisku przeglądarkowym
import { PrismaClient } from "../../generated/prisma.ts";

declare global {
  var prisma: PrismaClient | undefined;
}

export const prisma = (globalThis as any).prisma || new PrismaClient();

if (process.env.NODE_ENV !== 'production') {
  (globalThis as any).prisma = prisma;
}
