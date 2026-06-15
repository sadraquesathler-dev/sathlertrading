import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Trade Performance Dashboard",
  description: "Dashboard financeiro profissional para acompanhamento de performance de trader.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR" className="dark">
      <body>{children}</body>
    </html>
  );
}
