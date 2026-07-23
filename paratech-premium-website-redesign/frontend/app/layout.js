import { Sora, Manrope } from "next/font/google";
import "./globals.css";
import "./product-visuals.css";

const sora = Sora({
  variable: "--font-sora",
  weight: ["400", "600", "700", "800"],
  subsets: ["latin"],
  display: "swap",
});

const manrope = Manrope({
  variable: "--font-manrope",
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  display: "swap",
});

export const metadata = {
  // TODO: set metadataBase to the real production domain once comprado (Passo 4 do plano de finalização).
  title: {
    default: "Paratech Informática e Acessórios | Pará de Minas/MG",
    template: "%s | Paratech",
  },
  description:
    "Notebooks, computadores, periféricos, impressoras e acessórios com atendimento especializado em Pará de Minas/MG. Peça pelo WhatsApp e receba sem sair de casa.",
  openGraph: {
    type: "website",
    locale: "pt_BR",
    siteName: "Paratech Informática e Acessórios",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR" className={`${sora.variable} ${manrope.variable}`}>
      <body>{children}</body>
    </html>
  );
}
