"use server";

import { revalidatePath } from "next/cache";
import { verifySession } from "@/lib/dal";
import { saveSiteContent } from "@/lib/site-content";
import { homeContentSchema, contatoContentSchema } from "@/lib/validators";

const SCHEMAS = { home: homeContentSchema, contato: contatoContentSchema };
const REVALIDATE_PATHS = { home: ["/"], contato: ["/contato"] };

export async function saveSiteContentAction(section, payload) {
  await verifySession();

  const schema = SCHEMAS[section];
  if (!schema) return { error: "Seção desconhecida." };

  const result = schema.safeParse(payload);
  if (!result.success) {
    return { error: result.error.issues[0]?.message || "Dados inválidos." };
  }

  await saveSiteContent(section, result.data);
  for (const path of REVALIDATE_PATHS[section]) revalidatePath(path);

  return { ok: true, savedAt: new Date().toISOString() };
}
