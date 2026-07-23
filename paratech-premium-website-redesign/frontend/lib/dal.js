// Data Access Layer: checagem "de verdade" da sessão do admin, usada em
// páginas e Server Actions de /admin (o proxy.js só faz a checagem otimista).
import "server-only";
import { cache } from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { decrypt, SESSION_COOKIE_NAME } from "./session";

export const verifySession = cache(async () => {
  const cookieStore = await cookies();
  const session = await decrypt(cookieStore.get(SESSION_COOKIE_NAME)?.value);

  if (!session?.admin) {
    redirect("/admin/login");
  }

  return { isAuth: true };
});
