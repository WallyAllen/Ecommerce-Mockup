"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Trash2, MapPin, Truck, CreditCard, Banknote, ArrowRight, AlertCircle } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function Checkout() {
  const { cart, removeFromCart, updateQuantity, total, isLoaded } = useCart();
  const [deliveryMethod, setDeliveryMethod] = useState<"retiro" | "envio" | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<"tarjeta" | "efectivo" | null>(null);
  const [customerInfo, setCustomerInfo] = useState({ name: '', email: '', phone: '', address: '' });
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);

  useEffect(() => {
    if (!isLoaded || cart.length === 0) return;
    const timeoutId = setTimeout(() => {
      if (customerInfo.name && customerInfo.email && customerInfo.phone.length >= 8 && !sessionId) {
        fetch('/api/checkout-sessions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ customerInfo, cart })
        })
        .then(res => res.json())
        .then(data => {
          if (data.sessionId) setSessionId(data.sessionId);
        })
        .catch(err => console.error('Error saving session:', err));
      }
    }, 2000); 
    return () => clearTimeout(timeoutId);
  }, [customerInfo, cart, sessionId, isLoaded]);

  const handleCheckoutSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setError(null);
    if (!customerInfo.name || !customerInfo.email || !customerInfo.phone) {
      setError("Por favor, completa tus datos personales.");
      return;
    }
    if (deliveryMethod === 'envio' && !customerInfo.address.trim()) {
      setError("Por favor, ingresa tu dirección completa para el envío.");
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
          customerInfo,
          sessionId
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

  if (!isLoaded) {
    return (
      <div className="container mx-auto px-4 py-20 flex flex-col items-center text-center">
        <h1 className="font-montserrat font-black text-3xl uppercase tracking-wider mb-4 text-neutral-500">Cargando carrito...</h1>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="container mx-auto px-4 py-20 flex flex-col items-center text-center">
        <h1 className="font-montserrat font-black text-3xl uppercase tracking-wider mb-4">Tu carrito está vacío</h1>
        <Link href="/catalogo" className="bg-[#E60000] text-white font-black py-4 px-8 uppercase tracking-widest border border-[#E60000] hover:bg-white hover:text-black hover:border-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white">
          Volver a la Tienda
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <h1 className="font-montserrat font-black text-3xl md:text-5xl uppercase tracking-wider mb-8">Finalizar Compra</h1>

      <form onSubmit={handleCheckoutSubmit} className="flex flex-col lg:flex-row gap-8">
        <div className="w-full lg:w-2/3 space-y-6">
          
          {error && (
            <div className="bg-red-950/50 border border-[#E60000] p-4 text-white flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-[#E60000]" />
              <span className="font-semibold text-sm">{error}</span>
            </div>
          )}

          {/* Paso 1 */}
          <div className="bg-neutral-900 p-6 border border-neutral-800">
            <h2 className="font-montserrat font-black uppercase mb-6 flex items-center gap-3 tracking-wider text-xl">
              <span className="w-8 h-8 flex items-center justify-center text-sm border bg-[#E60000] border-[#E60000] text-white">1</span> 
              Tus Datos
            </h2>
            <div className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-bold text-neutral-400">Nombre completo</label>
                <Input 
                  id="name"
                  name="name"
                  type="text" 
                  placeholder="Ej: Juan Pérez" 
                  autoComplete="name"
                  value={customerInfo.name} 
                  onChange={e => setCustomerInfo({...customerInfo, name: e.target.value})}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-bold text-neutral-400">Email</label>
                  <Input 
                    id="email"
                    name="email"
                    type="email" 
                    placeholder="ejemplo@correo.com" 
                    autoComplete="email"
                    value={customerInfo.email} 
                    onChange={e => setCustomerInfo({...customerInfo, email: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="phone" className="text-sm font-bold text-neutral-400">WhatsApp</label>
                  <Input 
                    id="phone"
                    name="phone"
                    type="tel" 
                    placeholder="Ej: 1123456789 sin el 15" 
                    autoComplete="tel"
                    value={customerInfo.phone} 
                    onChange={e => setCustomerInfo({...customerInfo, phone: e.target.value})}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Paso 2 */}
          <div className="bg-neutral-900 p-6 border border-neutral-800">
            <h2 className="font-montserrat font-black uppercase mb-6 flex items-center gap-3 tracking-wider text-xl">
              <span className="w-8 h-8 flex items-center justify-center text-sm border border-neutral-800">2</span> 
              Entrega
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <button 
                type="button"
                aria-pressed={deliveryMethod === "retiro"}
                onClick={() => { setDeliveryMethod("retiro"); setError(null); }}
                className={`p-5 min-h-[48px] border-2 text-left flex flex-col gap-3 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white ${deliveryMethod === "retiro" ? 'border-white bg-neutral-800' : 'border-neutral-800 bg-transparent hover:border-neutral-600'}`}
              >
                <MapPin className="w-6 h-6 text-white" />
                <span className="font-montserrat font-black text-sm uppercase tracking-wider">Retiro por Local</span>
                <span className="text-xs text-neutral-400 font-semibold leading-relaxed">Jueves o Sábados - 16 e/ 166 y 167 (Berisso)</span>
              </button>
              
              <button 
                type="button"
                aria-pressed={deliveryMethod === "envio"}
                onClick={() => { setDeliveryMethod("envio"); setError(null); }}
                className={`p-5 min-h-[48px] border-2 text-left flex flex-col gap-3 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white ${deliveryMethod === "envio" ? 'border-white bg-neutral-800' : 'border-neutral-800 bg-transparent hover:border-neutral-600'}`}
              >
                <Truck className="w-6 h-6 text-white" />
                <span className="font-montserrat font-black text-sm uppercase tracking-wider">Envío en Moto</span>
                <span className="text-xs text-neutral-400 font-semibold leading-relaxed">Berisso, Ensenada, La Plata. Costo a convenir.</span>
              </button>
            </div>
            
            {deliveryMethod === 'envio' && (
              <div className="space-y-2 pt-4 border-t border-neutral-800">
                <label htmlFor="address" className="text-sm font-bold text-neutral-400">Dirección completa (Calle, Altura, Piso, Depto, Localidad)</label>
                <Input 
                  id="address"
                  name="address"
                  type="text" 
                  placeholder="Ej: Montevideo 1234, Depto 2, Berisso" 
                  autoComplete="street-address"
                  value={customerInfo.address} 
                  onChange={e => setCustomerInfo({...customerInfo, address: e.target.value})}
                />
              </div>
            )}
          </div>

          {/* Paso 3 */}
          <div className="bg-neutral-900 p-6 border border-neutral-800">
            <h2 className="font-montserrat font-black uppercase mb-6 flex items-center gap-3 tracking-wider text-xl">
              <span className="w-8 h-8 flex items-center justify-center text-sm border border-neutral-800">3</span> 
              Pago
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button 
                type="button"
                aria-pressed={paymentMethod === "tarjeta"}
                onClick={() => { setPaymentMethod("tarjeta"); setError(null); }}
                className={`p-5 min-h-[48px] border-2 text-left flex flex-col gap-3 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white ${paymentMethod === "tarjeta" ? 'border-white bg-neutral-800' : 'border-neutral-800 bg-transparent hover:border-neutral-600'}`}
              >
                <CreditCard className="w-6 h-6 text-white" />
                <span className="font-montserrat font-black text-sm uppercase tracking-wider">Tarjeta / MercadoPago</span>
                <span className="text-xs text-neutral-400 font-semibold leading-relaxed">Hasta 3 y 6 cuotas sin interés.</span>
              </button>
              
              <button 
                type="button"
                aria-pressed={paymentMethod === "efectivo"}
                onClick={() => { setPaymentMethod("efectivo"); setError(null); }}
                className={`p-5 min-h-[48px] border-2 text-left flex flex-col gap-3 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white ${paymentMethod === "efectivo" ? 'border-white bg-neutral-800' : 'border-neutral-800 bg-transparent hover:border-neutral-600'}`}
              >
                <Banknote className="w-6 h-6 text-white" />
                <span className="font-montserrat font-black text-sm uppercase tracking-wider">Reservar (Transf / Efectivo)</span>
                <span className="text-xs text-neutral-400 font-semibold leading-relaxed">Reserva sin seña por 24hs o con seña por 10 días. Coordiná por WhatsApp.</span>
              </button>
            </div>
          </div>

        </div>

        {/* Columna Derecha - Resumen */}
        <div className="w-full lg:w-1/3">
          <div className="bg-neutral-900 p-6 border border-neutral-800 sticky top-20">
            <h2 className="font-montserrat font-black text-xl uppercase tracking-wider mb-6">Tu Pedido</h2>
            
            <div className="flex flex-col gap-4 mb-6 border-b border-neutral-800 pb-6">
              {cart.map(item => (
                <div key={`${item.id}-${item.size}`} className="flex gap-4">
                  <div className="relative w-20 h-20 bg-neutral-950 border border-neutral-800 shrink-0">
                    <Image src={item.image} alt={item.name} fill className="object-cover" />
                  </div>
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <h4 className="text-sm font-bold leading-tight uppercase line-clamp-2">{item.name}</h4>
                      <span className="text-xs font-black text-neutral-400 uppercase tracking-widest mt-1 block">Talle: {item.size}</span>
                    </div>
                    <div className="flex justify-between items-end mt-2">
                      <p className="text-base font-black">${(item.price * item.quantity).toLocaleString('es-AR')}</p>
                      <div className="flex items-center gap-2">
                        <div className="flex items-center border border-neutral-800 bg-black">
                          <button type="button" onClick={() => updateQuantity(item.id, item.size, -1)} className="px-2 py-1 hover:text-white text-neutral-500 font-bold">-</button>
                          <span className="text-xs font-bold px-2">{item.quantity}</span>
                          <button type="button" onClick={() => updateQuantity(item.id, item.size, 1)} className="px-2 py-1 hover:text-white text-neutral-500 font-bold">+</button>
                        </div>
                        <button type="button" aria-label="Eliminar del carrito" onClick={() => removeFromCart(item.id, item.size)} className="text-neutral-500 hover:text-[#E60000] p-1 ml-1 min-h-[32px] min-w-[32px] flex items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-between items-center mb-8">
              <span className="font-montserrat font-black uppercase text-neutral-400 tracking-wider">Total</span>
              <span className="font-montserrat font-black text-2xl tracking-wider">${total.toLocaleString('es-AR')}</span>
            </div>

            <Button 
              type="submit"
              disabled={isProcessing}
              className="w-full uppercase tracking-widest"
              variant="default"
            >
              {isProcessing ? 'Procesando...' : paymentMethod === 'tarjeta' ? 'Pagar con MercadoPago' : 'Confirmar Pedido'}
            </Button>

            <p className="text-xs text-neutral-500 text-center mt-6 font-semibold uppercase tracking-widest">
              Al finalizar, aceptás nuestras políticas.
            </p>
          </div>
        </div>

      </form>
    </div>
  );
}
