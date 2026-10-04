import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Providers } from "@/src/components/Providers";
import { Header } from "@/src/components/layout/Header";
import { Footer } from "@/src/components/layout/Footer";
import { GlobalBackground } from "@/src/components/layout/GlobalBackground";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AutoHub | O seu hub definitivo para veículos",
  description: "Conecte-se, descubra, compre e venda veículos de todos os tipos em uma única plataforma.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#060A18] text-white">
        <Providers>
          <GlobalBackground />
          <Header />
          <main className="flex-1 relative z-10 pt-16">
            {children}
          </main>
          {/* <Footer /> será adicionado apenas nas páginas que precisarem ou podemos deixar global. No caso da página principal ser o catálogo (GT7 style), um footer atrapalharia o scroll ou a visão fixa. Vamos deixar o Footer para as páginas de conteúdo estático, ou usar um wrapper nelas. */}
        </Providers>
      </body>
    </html>
  );
}
