"use client";

import Link from "next/link";
import { Clock } from "lucide-react";
import { Suspense } from "react";

function PendingContent() {
  return (
    <div className="container mx-auto px-4 py-20 flex flex-col items-center text-center max-w-2xl">
      <Clock className="w-20 h-20 text-yellow-500 mb-6" />
      <h1 className="font-montserrat font-black text-3xl md:text-5xl uppercase tracking-wider mb-4">
        Pago en Proceso
      </h1>
      <p className="text-neutral-400 font-semibold mb-8 text-lg">
        Tu pago está siendo procesado por Mercado Pago (por ejemplo, si elegiste Rapipago/Pago Fácil). 
        Te notificaremos en cuanto se acredite y prepararemos tu pedido.
      </p>

      <Link 
        href="/catalogo" 
        className="font-montserrat font-black text-sm uppercase tracking-widest text-neutral-400 hover:text-white transition-colors"
      >
        Volver a la tienda
      </Link>
    </div>
  );
}

export default function PendingPage() {
  return (
    <Suspense fallback={<div className="container mx-auto px-4 py-20 text-center font-montserrat font-black uppercase text-2xl tracking-wider text-white">Cargando...</div>}>
      <PendingContent />
    </Suspense>
  );
}
