"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Trash2, MapPin, Truck, CreditCard, Banknote, ArrowRight, AlertCircle } from "lucide-react";
import { useCart } from "@/context/CartContext";

export default function Checkout() {
  const { cart, removeFromCart, total } = useCart();
  const [deliveryMethod, setDeliveryMethod] = useState<"retiro" | "envio" | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<"tarjeta" | "efectivo" | null>(null);
  const [customerInfo, setCustomerInfo] = useState({ name: '', email: '', phone: '' });
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCheckoutSubmit = async () => {
    setError(null);
    if (!customerInfo.name || !customerInfo.email || !customerInfo.phone) {
      setError("Por favor, completa tus datos personales.");
      return;
    }
    if (!deliveryMethod || !paymentMethod) {
      setError("Por favor, selecciona método de entrega y pago.");
      return;
    }

    setIsProcessing(true);
    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cart,
          deliveryMethod,
          paymentMethod,
          customerInfo
        })
      });
      
      const data = await response.json();
      
      if (!response.ok) throw new Error(data.error);
      
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (err: any) {
      setError(err.message || "Ocurrió un error al procesar tu pedido.");
      setIsProcessing(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="container mx-auto px-4 py-20 flex flex-col items-center text-center">
        <h1 className="font-montserrat font-black text-3xl uppercase tracking-wider mb-4">Tu carrito está vacío</h1>
        <Link href="/catalogo" className="bg-[#E60000] text-white font-black py-4 px-8 uppercase tracking-widest border border-[#E60000] hover:bg-white hover:text-black hover:border-white transition-colors">
          Volver a la Tienda
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <h1 className="font-montserrat font-black text-3xl md:text-5xl uppercase tracking-wider mb-8">Finalizar Compra</h1>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Columna Izquierda - Flujo de Checkout */}
        <div className="w-full lg:w-2/3 space-y-6">
          
          {error && (
            <div className="bg-red-950/50 border border-[#E60000] p-4 text-white flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-[#E60000]" />
              <span className="font-semibold text-sm">{error}</span>
            </div>
          )}

          {/* Paso 1: Tus Datos */}
          <div className="bg-[#0a0a0a] p-6 border border-[#333]">
            <h2 className="font-montserrat font-black uppercase mb-6 flex items-center gap-3 tracking-wider text-xl">
              <span className="w-8 h-8 flex items-center justify-center text-sm border bg-[#E60000] border-[#E60000] text-white">1</span> 
              Tus Datos
            </h2>
            <div className="space-y-4">
              <input 
                type="text" placeholder="Nombre completo" 
                value={customerInfo.name} onChange={e => setCustomerInfo({...customerInfo, name: e.target.value})}
                className="w-full bg-[#111] border border-[#333] p-3 text-white focus:border-white focus:outline-none"
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input 
                  type="email" placeholder="Email" 
                  value={customerInfo.email} onChange={e => setCustomerInfo({...customerInfo, email: e.target.value})}
                  className="w-full bg-[#111] border border-[#333] p-3 text-white focus:border-white focus:outline-none"
                />
                <input 
                  type="tel" placeholder="WhatsApp (Ej: 1123456789)" 
                  value={customerInfo.phone} onChange={e => setCustomerInfo({...customerInfo, phone: e.target.value})}
                  className="w-full bg-[#111] border border-[#333] p-3 text-white focus:border-white focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Paso 2: Entrega */}
          <div className={`bg-[#0a0a0a] p-6 border border-[#333] transition-opacity ${(!customerInfo.name || !customerInfo.email || !customerInfo.phone) ? 'opacity-50 pointer-events-none' : ''}`}>
            <h2 className="font-montserrat font-black uppercase mb-6 flex items-center gap-3 tracking-wider text-xl">
              <span className={`w-8 h-8 flex items-center justify-center text-sm border ${deliveryMethod ? 'bg-green-600 border-green-600 text-white' : 'bg-[#E60000] text-white border-[#E60000]'}`}>2</span> 
              Entrega
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button 
                onClick={() => { setDeliveryMethod("retiro"); setError(null); }}
                className={`p-5 min-h-[48px] border-2 text-left flex flex-col gap-3 transition-colors ${deliveryMethod === "retiro" ? 'border-white bg-[#111]' : 'border-[#333] bg-transparent hover:border-[#666]'}`}
              >
                <MapPin className="w-6 h-6 text-white" />
                <span className="font-montserrat font-black text-sm uppercase tracking-wider">Retiro por Local</span>
                <span className="text-xs text-neutral-400 font-semibold leading-relaxed">Jueves o Sábados - 16 e/ 166 y 167 (Berisso)</span>
              </button>
              
              <button 
                onClick={() => { setDeliveryMethod("envio"); setError(null); }}
                className={`p-5 min-h-[48px] border-2 text-left flex flex-col gap-3 transition-colors ${deliveryMethod === "envio" ? 'border-white bg-[#111]' : 'border-[#333] bg-transparent hover:border-[#666]'}`}
              >
                <Truck className="w-6 h-6 text-white" />
                <span className="font-montserrat font-black text-sm uppercase tracking-wider">Envío en Moto</span>
                <span className="text-xs text-neutral-400 font-semibold leading-relaxed">Berisso, Ensenada, La Plata. Costo a convenir.</span>
              </button>
            </div>
          </div>

          {/* Paso 3: Pago */}
          <div className={`bg-[#0a0a0a] p-6 border border-[#333] transition-opacity ${!deliveryMethod ? 'opacity-50 pointer-events-none' : ''}`}>
            <h2 className="font-montserrat font-black uppercase mb-6 flex items-center gap-3 tracking-wider text-xl">
              <span className={`w-8 h-8 flex items-center justify-center text-sm border ${paymentMethod ? 'bg-green-600 border-green-600 text-white' : 'bg-[#E60000] text-white border-[#E60000]'}`}>3</span> 
              Pago
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button 
                onClick={() => { setPaymentMethod("tarjeta"); setError(null); }}
                className={`p-5 min-h-[48px] border-2 text-left flex flex-col gap-3 transition-colors ${paymentMethod === "tarjeta" ? 'border-white bg-[#111]' : 'border-[#333] bg-transparent hover:border-[#666]'}`}
              >
                <CreditCard className="w-6 h-6 text-white" />
                <span className="font-montserrat font-black text-sm uppercase tracking-wider">Tarjeta / MercadoPago</span>
                <span className="text-xs text-neutral-400 font-semibold leading-relaxed">Hasta 3 y 6 cuotas sin interés.</span>
              </button>
              
              <button 
                onClick={() => { setPaymentMethod("efectivo"); setError(null); }}
                className={`p-5 min-h-[48px] border-2 text-left flex flex-col gap-3 transition-colors ${paymentMethod === "efectivo" ? 'border-white bg-[#111]' : 'border-[#333] bg-transparent hover:border-[#666]'}`}
              >
                <Banknote className="w-6 h-6 text-white" />
                <span className="font-montserrat font-black text-sm uppercase tracking-wider">Transferencia / Cash</span>
                <span className="text-xs text-neutral-400 font-semibold leading-relaxed">Coordinar pago por WhatsApp.</span>
              </button>
            </div>
          </div>

        </div>

        {/* Columna Derecha - Resumen */}
        <div className="w-full lg:w-1/3">
          <div className="bg-[#0a0a0a] p-6 border border-[#333] sticky top-20">
            <h2 className="font-montserrat font-black text-xl uppercase tracking-wider mb-6">Tu Pedido</h2>
            
            <div className="flex flex-col gap-4 mb-6 border-b border-[#333] pb-6">
              {cart.map(item => (
                <div key={`${item.id}-${item.size}`} className="flex gap-4">
                  <div className="relative w-20 h-20 bg-[#111] border border-[#333] shrink-0">
                    <Image src={item.image} alt={item.name} fill className="object-cover" />
                  </div>
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <h4 className="text-sm font-bold leading-tight uppercase line-clamp-2">{item.name}</h4>
                      <span className="text-xs font-black text-neutral-400 uppercase tracking-widest mt-1 block">Talle: {item.size} x{item.quantity}</span>
                    </div>
                    <div className="flex justify-between items-end mt-2">
                      <p className="text-base font-black">${(item.price * item.quantity).toLocaleString('es-AR')}</p>
                      <button onClick={() => removeFromCart(item.id, item.size)} className="text-neutral-500 hover:text-[#E60000] p-1 min-h-[32px] min-w-[32px] flex items-center justify-center">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-between items-center mb-8">
              <span className="font-montserrat font-black uppercase text-neutral-400 tracking-wider">Total</span>
              <span className="font-montserrat font-black text-2xl tracking-wider">${total.toLocaleString('es-AR')}</span>
            </div>

            <button 
              onClick={handleCheckoutSubmit}
              disabled={isProcessing || !customerInfo.name || !customerInfo.email || !customerInfo.phone || !deliveryMethod || !paymentMethod}
              className={`w-full py-5 border transition-colors flex items-center justify-center gap-2 uppercase tracking-widest min-h-[48px] font-black
                ${(!customerInfo.name || !customerInfo.email || !customerInfo.phone || !deliveryMethod || !paymentMethod)
                  ? 'bg-transparent border-[#333] text-[#333] cursor-not-allowed' 
                  : paymentMethod === 'tarjeta'
                    ? 'bg-blue-600 hover:bg-blue-500 text-white border-blue-600'
                    : 'bg-[#E60000] hover:bg-white hover:text-black hover:border-white border-[#E60000] text-white'
                }
              `}
            >
              {isProcessing ? 'Procesando...' : paymentMethod === 'tarjeta' ? 'Pagar con MercadoPago' : 'Confirmar Pedido'}
            </button>

            <p className="text-xs text-neutral-500 text-center mt-6 font-semibold uppercase tracking-widest">
              Al finalizar, aceptás nuestras políticas.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
