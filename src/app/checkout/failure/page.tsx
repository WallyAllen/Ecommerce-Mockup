"use client";

import Link from "next/link";
import { XCircle } from "lucide-react";
import { Suspense } from "react";

function FailureContent() {
  return (
    <div className="container mx-auto px-4 py-20 flex flex-col items-center text-center max-w-2xl">
      <XCircle className="w-20 h-20 text-red-500 mb-6" />
      <h1 className="font-montserrat font-black text-3xl md:text-5xl uppercase tracking-wider mb-4">
        Pago Rechazado
      </h1>
      <p className="text-neutral-400 font-semibold mb-8 text-lg">
        Hubo un problema procesando tu pago en Mercado Pago. Tu tarjeta pudo haber sido rechazada o los fondos son insuficientes.
      </p>

      <Link 
        href="/checkout" 
        className="block w-full bg-[#E60000] text-white font-black py-4 uppercase tracking-widest hover:bg-white hover:text-black transition-colors mb-4"
      >
        Volver a intentar
      </Link>
      
      <Link 
        href="/catalogo" 
        className="font-montserrat font-black text-sm uppercase tracking-widest text-neutral-400 hover:text-white transition-colors"
      >
        Volver a la tienda
      </Link>
    </div>
  );
}

export default function FailurePage() {
  return (
    <Suspense fallback={<div className="container mx-auto px-4 py-20 text-center font-montserrat font-black uppercase text-2xl tracking-wider text-white">Cargando...</div>}>
      <FailureContent />
    </Suspense>
  );
}
