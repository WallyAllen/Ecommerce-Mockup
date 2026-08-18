"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { CreditCard, Truck, ChevronLeft, ChevronRight, Check } from "lucide-react";
import { useParams } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { getProductById } from "@/lib/data";

export default function ProductoDetalle() {
  const { id } = useParams();
  const { addToCart } = useCart();
  
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const [product, setProduct] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const p = await getProductById(id as string);
      setProduct(p);
      setIsLoading(false);
    }
    load();
  }, [id]);

  if (isLoading) return <div className="container mx-auto px-4 py-20 text-center font-montserrat font-black uppercase text-2xl tracking-wider">Cargando producto...</div>;
  if (!product) return <div className="container mx-auto px-4 py-20 text-center font-montserrat font-black uppercase text-2xl tracking-wider">Producto no encontrado</div>;
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
    alert("Agregado al carrito!");
  };

  const handleAddCrossSell = (item: any) => {
    addToCart({
      id: item.id,
      name: item.name,
      price: item.price,
      size: "Único",
      image: item.image,
      quantity: 1
    });
    alert("Agregado al carrito!");
  };

  return (
    <div className="container mx-auto px-4 py-6 md:py-12">
      <div className="flex flex-col md:flex-row gap-8 lg:gap-12">
        
        {/* Galería de Imágenes */}
        <div className="w-full md:w-1/2 relative">
          <div className="relative aspect-[4/5] bg-[#0a0a0a] rounded-none overflow-hidden group border border-[#333]">
            <Image 
              src={product.images[currentImageIndex]} 
              alt={product.name} 
              fill
              priority
              className="object-cover"
            />
            
            {product.images.length > 1 && (
              <>
                <button onClick={prevImage} className="absolute left-4 top-1/2 -translate-y-1/2 bg-black text-white p-3 rounded-none border border-[#333] hover:border-white transition-colors min-h-[48px] min-w-[48px] flex items-center justify-center z-10">
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button onClick={nextImage} className="absolute right-4 top-1/2 -translate-y-1/2 bg-black text-white p-3 rounded-none border border-[#333] hover:border-white transition-colors min-h-[48px] min-w-[48px] flex items-center justify-center z-10">
                  <ChevronRight className="w-5 h-5" />
                </button>
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                  {product.images.map((_: any, idx: number) => (
                    <div key={idx} className={`w-8 h-1 transition-colors ${idx === currentImageIndex ? 'bg-[#E60000]' : 'bg-[#333]'}`} />
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
          
          <div className="bg-[#0a0a0a] rounded-none p-5 mb-8 border border-[#333] flex flex-col gap-4">
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
              <button className="text-xs text-neutral-400 font-bold hover:text-white transition-colors uppercase min-h-[48px]">Guía de talles</button>
            </div>
            <div className="grid grid-cols-5 gap-3">
              {product.sizes.map((size: any) => (
                <button 
                  key={size.name}
                  disabled={!size.inStock}
                  onClick={() => setSelectedSize(size.name)}
                  className={`relative py-4 min-h-[48px] rounded-none font-black text-lg transition-colors flex items-center justify-center border
                    ${!size.inStock 
                      ? 'bg-transparent border-[#333] text-[#333] cursor-not-allowed' 
                      : selectedSize === size.name 
                        ? 'bg-[#E60000] text-white border-[#E60000]' 
                        : 'bg-transparent border-[#333] hover:border-white text-white'
                    }
                  `}
                >
                  {size.name}
                  {!size.inStock && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-full h-[1px] bg-[#333] -rotate-45"></div>
                    </div>
                  )}
                </button>
              ))}
            </div>
            {selectedSize && <p className="text-[#E60000] text-xs mt-3 font-bold uppercase flex items-center gap-1 tracking-widest"><Check className="w-4 h-4"/> Talle {selectedSize} seleccionado</p>}
          </div>

          <button 
            disabled={!selectedSize}
            onClick={handleAddToCart}
            className={`w-full py-5 min-h-[48px] rounded-none font-black uppercase tracking-widest transition-all mb-10 border-2
              ${selectedSize 
                ? 'bg-white border-white text-black hover:bg-black hover:text-white' 
                : 'bg-transparent border-[#333] text-[#333] cursor-not-allowed'}
            `}
          >
            Agregar al Carrito
          </button>

          <div className="border-t border-[#333] pt-8">
            <h3 className="font-montserrat font-black text-lg uppercase mb-3 tracking-wider">Descripción</h3>
            <p className="text-neutral-400 text-sm leading-relaxed font-semibold">{product.description}</p>
          </div>

          {/* Cross-Selling */}
          <div className="mt-12 pt-8 border-t border-[#333]">
            <h3 className="font-montserrat font-black text-2xl tracking-wider mb-6">COMPLETÁ EL OUTFIT</h3>
            <div className="grid grid-cols-2 gap-4">
              {crossSelling.map(item => (
                <div key={item.id} className="bg-[#0a0a0a] rounded-none p-3 flex flex-col gap-3 border border-[#333] hover:border-[#666] transition-colors group">
                  <div className="relative aspect-square bg-black rounded-none overflow-hidden">
                    <Image src={item.image} alt={item.name} fill sizes="(max-width: 768px) 50vw, 33vw" className="object-cover group-hover:scale-105 transition-transform duration-700" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold line-clamp-1 uppercase text-neutral-400 group-hover:text-white transition-colors">{item.name}</h4>
                    <p className="text-base font-black mt-1">${item.price.toLocaleString('es-AR')}</p>
                  </div>
                  <button 
                    onClick={() => handleAddCrossSell(item)}
                    className="mt-auto w-full py-2 min-h-[48px] border border-[#333] rounded-none text-xs font-black hover:bg-white hover:text-black hover:border-white transition-colors uppercase tracking-wider"
                  >
                    + Sumar
                  </button>
                </div>
              ))}
            </div>
            <p className="text-xs text-neutral-500 mt-4 font-bold uppercase tracking-wider">Accesorios por @valen.imports2</p>
          </div>

        </div>
      </div>
    </div>
  );
}
