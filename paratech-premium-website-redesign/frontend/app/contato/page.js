import ContatoClient from "@/components/contato/ContatoClient";
import { getSiteContent } from "@/lib/site-content";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Contato",
  description:
    "Endereço, telefone, e-mail e horário de atendimento da Paratech em Pará de Minas/MG. Envie sua mensagem e fale direto no WhatsApp.",
};

export default async function ContatoPage() {
  const contato = await getSiteContent("contato");
  return <ContatoClient content={contato} />;
}
