"use server";

import { timingSafeEqual } from "node:crypto";
import { redirect } from "next/navigation";
import { createSession } from "@/lib/session";

function passwordsMatch(a, b) {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) return false;
  return timingSafeEqual(bufA, bufB);
}

export async function login(prevState, formData) {
  const password = String(formData.get("password") || "");
  const expected = process.env.ADMIN_PASSWORD;

  if (!expected) {
    return { error: "ADMIN_PASSWORD não configurada no ambiente." };
  }
  if (!password || !passwordsMatch(password, expected)) {
    return { error: "Senha incorreta." };
  }

  await createSession();
  redirect("/admin");
}
