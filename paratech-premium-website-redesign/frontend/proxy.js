// Checagem otimista de sessão nas rotas /admin — só lê o cookie (sem tocar
// no banco). A checagem "de verdade" acontece na DAL (lib/dal.js) dentro de
// cada página/Server Action. Em Next.js 16 "middleware" virou "proxy".
import { NextResponse } from "next/server";
import { decrypt, SESSION_COOKIE_NAME } from "@/lib/session";

export async function proxy(req) {
  const path = req.nextUrl.pathname;
  if (path === "/admin/login") return NextResponse.next();

  const session = await decrypt(req.cookies.get(SESSION_COOKIE_NAME)?.value);
  if (!session?.admin) {
    return NextResponse.redirect(new URL("/admin/login", req.nextUrl));
  }

  return NextResponse.next();
}

export const config = {
  matcher: "/admin/:path*",
};
