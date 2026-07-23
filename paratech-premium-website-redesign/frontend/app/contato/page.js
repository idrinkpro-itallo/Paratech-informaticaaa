import ContatoClient from "@/components/contato/ContatoClient";

export const metadata = {
  title: "Contato",
  description:
    "Endereço, telefone, e-mail e horário de atendimento da Paratech em Pará de Minas/MG. Envie sua mensagem e fale direto no WhatsApp.",
};

export default function ContatoPage() {
  return <ContatoClient />;
}
