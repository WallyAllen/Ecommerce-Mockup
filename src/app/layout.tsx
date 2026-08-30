import type { Metadata } from "next";
import { Inter, Montserrat, Anton } from "next/font/google";
import "./globals.css";
import Header from "@/components/global/Header";
import Footer from "@/components/global/Footer";
import MobileMenu from "@/components/global/MobileMenu";
import WhatsAppButton from "@/components/global/WhatsAppButton";
import { CartProvider } from "@/context/CartContext";
import { Toaster } from "sonner";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const montserrat = Montserrat({ subsets: ["latin"], variable: "--font-montserrat" });
const anton = Anton({ weight: "400", subsets: ["latin"], variable: "--font-anton" });

export const metadata: Metadata = {
  title: "Importados Bsso",
  description: "La mejor indumentaria streetwear en Berisso",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={`${inter.variable} ${montserrat.variable} ${anton.variable} font-inter bg-black text-white antialiased min-h-screen flex flex-col`}>
        <CartProvider>
          <Header />
          <main className="flex-1">
            {children}
          </main>
          <Footer />
          <WhatsAppButton />
          <MobileMenu />
          <Toaster theme="dark" position="bottom-left" />
        </CartProvider>
      </body>
    </html>
  );
}
