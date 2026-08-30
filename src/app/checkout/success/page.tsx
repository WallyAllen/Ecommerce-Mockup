"use client";

import Link from "next/link";
import { CheckCircle } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useEffect, Suspense } from "react";
import { useCart } from "@/context/CartContext";

function SuccessContent() {
  const searchParams = useSearchParams();
  const method = searchParams.get("method");
  const orderId = searchParams.get("order");
  const { clearCart } = useCart();

  useEffect(() => {
    // Clear cart on success
    clearCart();
  }, [clearCart]);

  return (
    <div className="container mx-auto px-4 py-20 flex flex-col items-center text-center max-w-2xl">
      <CheckCircle className="w-20 h-20 text-green-500 mb-6" />
      <h1 className="font-montserrat font-black text-3xl md:text-5xl uppercase tracking-wider mb-4">
        ¡Pedido Confirmado!
      </h1>
      <p className="text-neutral-400 font-semibold mb-8 text-lg">
        Tu número de orden es: <span className="text-white font-bold">{orderId}</span>
      </p>

      {method === "efectivo" ? (
        <div className="bg-[#111] p-6 border border-[#333] mb-8 w-full">
          <h2 className="font-montserrat font-black text-xl uppercase mb-3 text-[#E60000]">Paso Final</h2>
          <p className="text-neutral-300 font-semibold mb-6">
            Elegiste abonar en efectivo o transferencia. Haz clic abajo para enviarnos tu comprobante o coordinar el pago por Correo. Tu stock está reservado por 24hs.
          </p>
          <a 
            href={`mailto:fjborrazas3@gmail.com?subject=Pago%20de%20pedido%20${orderId}&body=Hola!%20Acabo%20de%20hacer%20el%20pedido%20${orderId}.%20Quiero%20coordinar%20el%20pago.`}
            target="_blank"
            rel="noreferrer"
            className="block w-full bg-[#E60000] text-white font-black py-4 uppercase tracking-widest hover:bg-white hover:text-black transition-colors"
          >
            Enviar Comprobante
          </a>
        </div>
      ) : (
        <div className="bg-[#111] p-6 border border-[#333] mb-8 w-full">
          <p className="text-neutral-300 font-semibold">
            Tu pago fue procesado con éxito a través de MercadoPago. Te enviaremos un email con el detalle.
          </p>
        </div>
      )}

      <Link 
        href="/catalogo" 
        className="font-montserrat font-black text-sm uppercase tracking-widest text-neutral-400 hover:text-white transition-colors"
      >
        Volver a la tienda
      </Link>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense fallback={<div className="container mx-auto px-4 py-20 text-center font-montserrat font-black uppercase text-2xl tracking-wider text-white">Cargando...</div>}>
      <SuccessContent />
    </Suspense>
  );
}
