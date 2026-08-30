"use client";

import { useState } from "react";
import Image from "next/image";
import { CreditCard, Truck, ChevronLeft, ChevronRight, Check } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Product } from "@/lib/data";

export default function ProductClient({ product }: { product: Product }) {
  const { addToCart } = useCart();
  
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showSizeGuide, setShowSizeGuide] = useState(false);

  const crossSelling = [
    { id: "cs1", name: "Reloj Lacoste White", price: 35000, image: "/images/reloj.png" },
    { id: "cs2", name: "Perfume Asad Lattafa", price: 95000, image: "/images/perfume.png" }
  ];

  const nextImage = () => setCurrentImageIndex((prev) => (prev + 1) % product.images.length);
  const prevImage = () => setCurrentImageIndex((prev) => (prev - 1 + product.images.length) % product.images.length);

  const handleAddToCart = () => {
    if (!selectedSize) return;
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      size: selectedSize,
      image: product.images[0],
      quantity: 1
    });
    toast.success("¡Agregado al carrito!");
  };

  const handleAddCrossSell = (item: typeof crossSelling[0]) => {
    addToCart({
      id: item.id,
      name: item.name,
      price: item.price,
      size: "Único",
      image: item.image,
      quantity: 1
    });
    toast.success("¡Accesorio sumado!");
  };

  return (
    <div className="flex flex-col md:flex-row gap-8 lg:gap-12">
      {/* Galería de Imágenes */}
      <div className="w-full md:w-1/2 relative">
        <div className="relative aspect-[4/5] bg-neutral-900 rounded-none overflow-hidden group border border-neutral-800">
          <Image 
            src={product.images[currentImageIndex]} 
            alt={product.name} 
            fill
            priority
            className="object-cover"
          />
          
          {product.images.length > 1 && (
            <>
              <button onClick={prevImage} aria-label="Imagen anterior" className="absolute left-4 top-1/2 -translate-y-1/2 bg-black text-white p-3 rounded-none border border-neutral-800 hover:border-white transition-colors min-h-[48px] min-w-[48px] flex items-center justify-center z-10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white">
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button onClick={nextImage} aria-label="Siguiente imagen" className="absolute right-4 top-1/2 -translate-y-1/2 bg-black text-white p-3 rounded-none border border-neutral-800 hover:border-white transition-colors min-h-[48px] min-w-[48px] flex items-center justify-center z-10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white">
                <ChevronRight className="w-5 h-5" />
              </button>
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                {product.images.map((_, idx: number) => (
                  <div key={idx} className={`w-8 h-1 transition-colors ${idx === currentImageIndex ? 'bg-white' : 'bg-neutral-600'}`} />
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Info del Producto */}
      <div className="w-full md:w-1/2 flex flex-col">
        <h1 className="font-montserrat font-black text-3xl md:text-5xl uppercase tracking-wider mb-2">{product.name}</h1>
        <p className="font-montserrat font-black text-2xl md:text-4xl text-white mb-6">${product.price.toLocaleString('es-AR')}</p>
        
        <div className="bg-neutral-900 rounded-none p-5 mb-8 border border-neutral-800 flex flex-col gap-4">
          <div className="flex items-center gap-3 text-sm font-semibold text-neutral-300 uppercase tracking-wider">
            <CreditCard className="w-5 h-5 text-white" />
            <span>3 y 6 cuotas sin interés</span>
          </div>
          <div className="flex items-center gap-3 text-sm font-semibold text-neutral-300 uppercase tracking-wider">
            <Truck className="w-5 h-5 text-white" />
            <span>Envíos rápidos a la zona</span>
          </div>
        </div>

        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-montserrat font-black uppercase text-lg tracking-wider">Seleccioná tu Talle</h3>
            <button 
              onClick={() => setShowSizeGuide(true)}
              className="text-xs text-neutral-400 font-bold hover:text-white transition-colors uppercase min-h-[48px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-950"
            >
              Guía de talles
            </button>
          </div>
          <div className="grid grid-cols-5 gap-3">
            {product.sizes.map((size) => (
              <button 
                key={size.name}
                disabled={!size.inStock}
                onClick={() => setSelectedSize(size.name)}
                aria-pressed={selectedSize === size.name}
                aria-disabled={!size.inStock}
                className={`relative py-4 min-h-[48px] rounded-none font-black text-lg transition-colors flex items-center justify-center border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-950
                  ${!size.inStock 
                    ? 'bg-transparent border-neutral-800 text-neutral-600 cursor-not-allowed' 
                    : selectedSize === size.name 
                      ? 'bg-white text-black border-white' 
                      : 'bg-transparent border-neutral-800 hover:border-white text-white'
                  }
                `}
              >
                {size.name}
                {!size.inStock && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-full h-[1px] bg-neutral-800 -rotate-45"></div>
                  </div>
                )}
              </button>
            ))}
          </div>
          {selectedSize && <p className="text-white text-xs mt-3 font-bold uppercase flex items-center gap-1 tracking-widest"><Check className="w-4 h-4"/> Talle {selectedSize} seleccionado</p>}
        </div>

        <Button 
          disabled={!selectedSize}
          onClick={handleAddToCart}
          variant={selectedSize ? "default" : "outline"}
          className="w-full mb-10 text-base"
        >
          Agregar al Carrito
        </Button>

        <div className="border-t border-neutral-800 pt-8">
          <h3 className="font-montserrat font-black text-lg uppercase mb-3 tracking-wider">Descripción</h3>
          <p className="text-neutral-400 text-sm leading-relaxed font-semibold">{product.description}</p>
        </div>

        {/* Cross-Selling */}
        <div className="mt-12 pt-8 border-t border-neutral-800">
          <h3 className="font-montserrat font-black text-2xl tracking-wider mb-6">COMPLETÁ EL OUTFIT</h3>
          <div className="grid grid-cols-2 gap-4">
            {crossSelling.map(item => (
              <div key={item.id} className="bg-neutral-900 rounded-none p-3 flex flex-col gap-3 border border-neutral-800 hover:border-neutral-600 transition-colors group">
                <div className="relative aspect-square bg-neutral-950 rounded-none overflow-hidden">
                  <Image src={item.image} alt={item.name} fill sizes="(max-width: 768px) 50vw, 33vw" className="object-cover group-hover:scale-105 transition-transform duration-700" />
                </div>
                <div>
                  <h4 className="text-xs font-bold line-clamp-1 uppercase text-neutral-400 group-hover:text-white transition-colors">{item.name}</h4>
                  <p className="text-base font-black mt-1">${item.price.toLocaleString('es-AR')}</p>
                </div>
                <Button 
                  onClick={() => handleAddCrossSell(item)}
                  variant="outline"
                  size="sm"
                  className="mt-auto w-full uppercase tracking-wider"
                >
                  + Sumar
                </Button>
              </div>
            ))}
          </div>
          <p className="text-xs text-neutral-500 mt-4 font-bold uppercase tracking-wider">Accesorios por @valen.imports2</p>
        </div>

      </div>

      {showSizeGuide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" onClick={() => setShowSizeGuide(false)}>
          <div className="bg-[#111] border border-[#333] p-6 max-w-md w-full" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-6 border-b border-[#333] pb-4">
              <h2 className="font-montserrat font-black text-xl uppercase">Guía de Talles</h2>
              <button onClick={() => setShowSizeGuide(false)} className="text-neutral-400 hover:text-white text-2xl leading-none">&times;</button>
            </div>
            <div className="space-y-4 text-sm text-neutral-300">
              <p>Recomendamos medir una prenda que te quede bien y compararla con estas medidas aproximadas (ancho x largo en cm):</p>
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-[#333]">
                    <th className="py-2">Talle</th>
                    <th className="py-2">Ancho</th>
                    <th className="py-2">Largo</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-[#333]">
                    <td className="py-2 font-bold text-white">S</td><td className="py-2">52 cm</td><td className="py-2">70 cm</td>
                  </tr>
                  <tr className="border-b border-[#333]">
                    <td className="py-2 font-bold text-white">M</td><td className="py-2">54 cm</td><td className="py-2">72 cm</td>
                  </tr>
                  <tr className="border-b border-[#333]">
                    <td className="py-2 font-bold text-white">L</td><td className="py-2">56 cm</td><td className="py-2">74 cm</td>
                  </tr>
                  <tr className="border-b border-[#333]">
                    <td className="py-2 font-bold text-white">XL</td><td className="py-2">58 cm</td><td className="py-2">76 cm</td>
                  </tr>
                  <tr className="border-b border-[#333]">
                    <td className="py-2 font-bold text-white">XXL</td><td className="py-2">60 cm</td><td className="py-2">78 cm</td>
                  </tr>
                </tbody>
              </table>
              <p className="text-xs text-neutral-500 mt-4 uppercase">Las medidas pueden variar +/- 1cm según la confección.</p>
            </div>
            <Button className="w-full mt-6" onClick={() => setShowSizeGuide(false)}>Cerrar</Button>
          </div>
        </div>
      )}
    </div>
  );
}
