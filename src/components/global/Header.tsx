"use client";

import Link from "next/link";
import { ShoppingCart, SlidersHorizontal, User } from "lucide-react";
import { useCart } from "@/context/CartContext";

export default function Header() {
  const { cart } = useCart();
  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <header className="sticky top-0 z-50 w-full bg-neutral-900 border-b border-neutral-800">
      <div className="container mx-auto px-4 h-20 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 relative z-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white">
          <img 
            src="/images/logo-transparent.png" 
            alt="Importados Berisso Logo" 
            className="h-12 md:h-16 w-auto object-contain scale-150 md:scale-[2] origin-left" 
          />
        </Link>

        <div className="flex items-center gap-2 md:gap-4">
          <Link href="/perfil" className="hidden md:flex text-neutral-400 hover:text-white transition-colors items-center justify-center h-[48px] w-[48px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white" aria-label="Mi Perfil">
            <User className="w-6 h-6" />
          </Link>
          <Link href="/catalogo" className="text-neutral-400 hover:text-white transition-colors flex items-center justify-center h-[48px] w-[48px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white" aria-label="Ver Catálogo">
            <SlidersHorizontal className="w-6 h-6 md:w-7 md:h-7" />
          </Link>
          <Link href="/checkout" className="relative text-neutral-400 hover:text-white transition-colors flex items-center justify-center h-[48px] w-[48px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white" aria-label="Ver Carrito">
            <ShoppingCart className="w-6 h-6 md:w-7 md:h-7" />
            {totalItems > 0 && (
              <span className="absolute top-1 right-1 bg-[#CC0000] text-white text-[10px] font-black w-5 h-5 rounded-none flex items-center justify-center border border-[#CC0000]">
                {totalItems}
              </span>
            )}
          </Link>
        </div>
      </div>
    </header>
  );
}
