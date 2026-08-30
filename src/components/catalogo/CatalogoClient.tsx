"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { Filter, ChevronDown, X } from "lucide-react";
import { MAIN_CATEGORIES, SUB_CATEGORIES } from "@/lib/categories";
import { Product } from "@/lib/data";

type Size = { name: string; inStock: boolean };

export default function CatalogoClient({ 
  initialProducts, 
  categoryParam, 
  subcategoryParam 
}: { 
  initialProducts: Product[], 
  categoryParam?: string, 
  subcategoryParam?: string 
}) {
  const [showFilters, setShowFilters] = useState(false);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);

  const [sortBy, setSortBy] = useState<string>('newest');

  // Reset filters when category changes
  useEffect(() => {
    setSelectedBrands([]);
    setSelectedSizes([]);
    setSortBy('newest');
  }, [categoryParam, subcategoryParam]);

  const filteredProducts = useMemo(() => {
    let result = [...initialProducts];

    if (selectedBrands.length > 0) {
      result = result.filter(p => 
        selectedBrands.some(brand => p.name.toLowerCase().includes(brand.toLowerCase()))
      );
    }

    if (selectedSizes.length > 0) {
      result = result.filter(p => 
        p.sizes.some((s) => selectedSizes.includes(s.name) && s.inStock)
      );
    }

    if (sortBy === 'price_asc') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price_desc') {
      result.sort((a, b) => b.price - a.price);
    }

    return result;
  }, [initialProducts, selectedBrands, selectedSizes, sortBy]);

  const toggleBrand = (brand: string) => {
    setSelectedBrands(prev => prev.includes(brand) ? prev.filter(b => b !== brand) : [...prev, brand]);
  };

  const toggleSize = (size: string) => {
    setSelectedSizes(prev => prev.includes(size) ? prev.filter(s => s !== size) : [...prev, size]);
  };

  // Derivar Marcas disponibles (Hardcoded detection base)
  const knownBrands = ["Nike", "Jordan", "DC", "Lattafa", "Lacoste", "New Era"];
  const availableBrands = knownBrands.filter(brand => 
    initialProducts.some(p => p.name.toLowerCase().includes(brand.toLowerCase()))
  );

  // Derivar Talles disponibles
  const availableSizesMap = new Map<string, boolean>();
  initialProducts.forEach(p => {
    p.sizes.forEach((s) => {
      availableSizesMap.set(s.name, (availableSizesMap.get(s.name) || false) || s.inStock);
    });
  });
  const sizeOrder = ['XXS', 'XS', 'S', 'M', 'L', 'XL', 'XXL'];
  const availableSizes = Array.from(availableSizesMap.keys()).sort((a, b) => {
    const numA = parseFloat(a);
    const numB = parseFloat(b);
    
    if (!isNaN(numA) && !isNaN(numB)) return numA - numB;
    
    const idxA = sizeOrder.indexOf(a.toUpperCase());
    const idxB = sizeOrder.indexOf(b.toUpperCase());
    
    if (idxA !== -1 && idxB !== -1) return idxA - idxB;
    if (idxA !== -1) return -1;
    if (idxB !== -1) return 1;
    
    return a.localeCompare(b);
  });

  const ropaSizes = availableSizes.filter(s => isNaN(Number(s)) && s !== 'Único');
  const calzadoSizes = availableSizes.filter(s => !isNaN(Number(s)));
  
  const renderSizeGroup = (sizes: string[], title: string) => {
    if (sizes.length === 0) return null;
    return (
      <div className="mt-6">
        <h3 className="font-montserrat font-black tracking-wider text-lg mb-3 uppercase">{title}</h3>
        <div className="grid grid-cols-4 gap-2">
          {sizes.map(size => {
            const hasStock = availableSizesMap.get(size);
            const isSelected = selectedSizes.includes(size);
            return (
              <button 
                key={size} 
                disabled={!hasStock}
                onClick={() => toggleSize(size)}
                className={`relative border rounded-none py-1.5 font-bold text-sm transition-colors 
                  ${!hasStock ? 'border-[#333] text-[#333] cursor-not-allowed bg-transparent' : 
                    isSelected ? 'bg-[#E60000] text-white border-[#E60000]' : 'border-[#333] hover:bg-white hover:text-black hover:border-white text-white bg-transparent'
                  }
                `}
              >
                {size}
                {!hasStock && (
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="w-full h-[1px] bg-[#333] -rotate-45"></div>
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col md:flex-row gap-6 relative">
      
      {/* Filtros Mobile Header */}
      <div className="md:hidden flex items-center justify-between border-b border-[#333] pb-4">
        <button 
          onClick={() => setShowFilters(true)}
          className="flex items-center gap-2 font-montserrat font-black text-sm uppercase bg-[#0a0a0a] border border-[#333] px-4 py-2 rounded-none"
        >
          <Filter className="w-4 h-4" /> Filtros
        </button>
        <div className="flex items-center gap-2 text-sm font-semibold text-neutral-400">
          <span>Ordenar</span>
          <ChevronDown className="w-4 h-4" />
        </div>
      </div>

      {/* Sidebar Filtros */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-[80vw] max-w-sm bg-[#0a0a0a] border-r border-[#333] transform transition-transform duration-300 ease-in-out overflow-y-auto
        md:sticky md:top-24 md:h-[calc(100vh-120px)] md:z-10 md:w-64 md:transform-none md:bg-transparent md:border-r-0
        ${showFilters ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        <div className="p-5 md:bg-[#0a0a0a] md:rounded-none md:border md:border-[#333] h-full">
          <div className="flex items-center justify-between md:hidden mb-6 border-b border-[#333] pb-4">
            <h2 className="font-montserrat font-black text-xl uppercase">Filtros</h2>
            <button onClick={() => setShowFilters(false)} className="p-2 border border-[#333]">
              <X className="w-5 h-5 text-white" />
            </button>
          </div>

          <div className="mb-6">
            <h3 className="font-montserrat font-black tracking-wider text-lg mb-3 uppercase">Categoría</h3>
            <div className="space-y-4 flex flex-col items-start">
              <Link replace onClick={() => setShowFilters(false)} href="/catalogo" className={`block hover:text-[#E60000] font-bold transition-colors ${!categoryParam ? 'text-[#E60000]' : 'text-neutral-300'}`}>
                Todos los productos
              </Link>
              
              {MAIN_CATEGORIES.map(cat => (
                <div key={cat.id} className="w-full">
                  <Link replace onClick={() => setShowFilters(false)} href={`/catalogo?categoria=${cat.id}`} className={`block hover:text-[#E60000] font-bold transition-colors ${categoryParam === cat.id && !subcategoryParam ? 'text-[#E60000]' : (categoryParam === cat.id ? 'text-white' : 'text-neutral-300')}`}>
                    {cat.name}
                  </Link>
                  
                  {categoryParam === cat.id && SUB_CATEGORIES[cat.id] && (
                    <div className="ml-1 mt-2 mb-2 space-y-2.5 flex flex-col border-l-2 border-[#E60000]/30 pl-4 py-1">
                      {SUB_CATEGORIES[cat.id].map(sub => (
                        <Link 
                          key={sub.id} 
                          replace 
                          onClick={() => setShowFilters(false)} 
                          href={`/catalogo?categoria=${cat.id}&subcategoria=${sub.id}`} 
                          className={`block text-sm transition-all hover:text-white hover:translate-x-1 ${subcategoryParam === sub.id ? 'text-white font-black translate-x-1' : 'text-neutral-500 font-medium'}`}
                        >
                          {sub.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
          
          {availableBrands.length > 0 && (
            <div className="mb-6">
              <h3 className="font-montserrat font-black tracking-wider text-lg mb-3 uppercase">Marca</h3>
              <div className="space-y-2 text-sm font-semibold text-neutral-400">
                {availableBrands.map(brand => (
                  <label key={brand} className="flex items-center gap-2 cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={selectedBrands.includes(brand)}
                      onChange={() => toggleBrand(brand)}
                      className="rounded-none border-neutral-600 bg-neutral-900 accent-[#E60000] w-4 h-4 cursor-pointer" 
                    /> 
                    {brand}
                  </label>
                ))}
              </div>
            </div>
          )}

          {categoryParam !== 'gorras' && categoryParam !== 'accesorios' && (
            <>
              {renderSizeGroup(ropaSizes, categoryParam === 'perfumes' ? 'Tamaño (Ropa/Perfume)' : 'Talle (Ropa)')}
              {renderSizeGroup(calzadoSizes, 'Talle (Calzado)')}
            </>
          )}
        </div>
      </aside>

      {/* Overlay para Mobile */}
      {showFilters && (
        <div 
          className="fixed inset-0 bg-black/60 z-40 md:hidden backdrop-blur-sm"
          onClick={() => setShowFilters(false)}
        />
      )}

      {/* Grilla de Productos */}
      <main className="flex-1">
        <div className="hidden md:flex justify-between items-center mb-6 border-b border-[#333] pb-4">
          <h1 className="font-montserrat font-black text-3xl uppercase tracking-wider text-white">Catálogo</h1>
          <select 
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-[#0a0a0a] border border-[#333] rounded-none px-3 py-2 text-sm font-semibold focus:outline-none focus:border-white text-neutral-300"
          >
            <option value="newest">Más nuevos</option>
            <option value="price_asc">Menor precio</option>
            <option value="price_desc">Mayor precio</option>
          </select>
        </div>

        {filteredProducts.length === 0 ? (
          <div className="text-center py-20 font-montserrat font-black uppercase text-xl text-neutral-500 tracking-wider">
            No se encontraron productos con estos filtros.
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {filteredProducts.map((product, idx) => (
              <Link href={`/producto/${product.id}`} key={product.id} className="group flex flex-col gap-3 relative focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E60000]">
                <div className="relative aspect-[4/5] bg-[#0a0a0a] rounded-none overflow-hidden border border-[#333] hover:border-[#666] transition-colors">
                  {!product.sizes.some((s: Size) => s.inStock) && (
                    <div className="absolute inset-0 bg-black/80 z-20 flex items-center justify-center backdrop-blur-sm">
                      <div className="bg-[#E60000] text-white font-montserrat font-black uppercase px-6 py-2 border-y-2 border-[#E60000] tracking-widest text-lg rotate-12 shadow-2xl shadow-red-900/50">
                        Agotado
                      </div>
                    </div>
                  )}
                  <Image 
                    src={product.image} 
                    alt={product.name} 
                    fill
                    sizes="(max-width: 768px) 50vw, 33vw"
                    className={`object-cover transition-transform duration-700 ${product.sizes.some((s: Size) => s.inStock) ? 'group-hover:scale-110' : 'grayscale opacity-50'}`} 
                  />
                  {/* Hover Overlay */}
                  {product.sizes.some((s: Size) => s.inStock) && (
                    <div className="absolute inset-0 bg-brand-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-sm z-10 pointer-events-none">
                      <span className="border border-white text-white font-montserrat font-bold text-sm tracking-widest uppercase py-3 px-6 shadow-xl">
                        Ver Detalles
                      </span>
                    </div>
                  )}
                </div>
                <div className={!product.sizes.some((s: Size) => s.inStock) ? 'opacity-50' : ''}>
                  <h3 className="font-montserrat font-bold text-sm md:text-base text-neutral-400 line-clamp-2 leading-tight mb-1 group-hover:text-white transition-colors uppercase">{product.name}</h3>
                  <p className="font-anton text-2xl text-white tracking-wider">${product.price.toLocaleString('es-AR')}</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
