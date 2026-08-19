"use client";

import { useState, useMemo, useRef } from "react";
import { PackagePlus, Save, Trash2, Plus, X, Upload, Search, Filter, Grid2X2, Grid3X3, Grid, CheckSquare, Square } from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";

// Re-usamos las server actions exportadas desde admin/actions.ts
import { updateStock, deleteSize, addSize, addProduct, editProductImage, deleteProducts, editProductDetails } from "@/app/admin/actions";

export default function InventoryManager({ products }: { products: any[] }) {
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [gridSize, setGridSize] = useState<"small" | "medium" | "large">("medium");
  
  // Modo Selección Múltiple
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [selectedProductIds, setSelectedProductIds] = useState<string[]>([]);

  const supabase = createClient();
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);

  // Filtrado y búsqueda
  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = categoryFilter === "all" || p.category === categoryFilter;
      return matchesSearch && matchesCategory;
    });
  }, [products, searchQuery, categoryFilter]);

  // Clases dinámicas para el tamaño de la grilla
  const gridColsClass = {
    small: "grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6",
    medium: "grid-cols-2 md:grid-cols-3 lg:grid-cols-4",
    large: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
  }[gridSize];

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, existingProductId?: string) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    
    setIsUploading(true);
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `${fileName}`;

    try {
      const { error: uploadError } = await supabase.storage
        .from('products')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from('products').getPublicUrl(filePath);
      
      if (existingProductId) {
        const formData = new FormData();
        formData.append('productId', existingProductId);
        formData.append('imageUrl', data.publicUrl);
        await editProductImage(formData);
        
        setSelectedProduct({ ...selectedProduct, image_url: data.publicUrl });
        router.refresh();
      } else {
        const inputUrl = document.getElementById('new-product-image-url') as HTMLInputElement;
        if (inputUrl) inputUrl.value = data.publicUrl;
      }
    } catch (error: any) {
      alert(`Error subiendo imagen: ${error.message}`);
    } finally {
      setIsUploading(false);
    }
  };

  const handleProductClick = (product: any) => {
    if (isSelectionMode) {
      if (selectedProductIds.includes(product.id)) {
        setSelectedProductIds(selectedProductIds.filter(id => id !== product.id));
      } else {
        setSelectedProductIds([...selectedProductIds, product.id]);
      }
    } else {
      setSelectedProduct(product);
    }
  };

  const handleAddProduct = async (formData: FormData) => {
    await addProduct(formData);
    formRef.current?.reset();
    const inputUrl = document.getElementById('new-product-image-url') as HTMLInputElement;
    if (inputUrl) inputUrl.value = "";
    router.refresh();
  };

  const handleDeleteSelected = async () => {
    if (selectedProductIds.length === 0) return;
    if (!confirm(`¿Estás seguro de que quieres eliminar ${selectedProductIds.length} productos? Esto no se puede deshacer.`)) return;

    const formData = new FormData();
    formData.append('productIds', selectedProductIds.join(','));
    await deleteProducts(formData);
    
    setSelectedProductIds([]);
    setIsSelectionMode(false);
    router.refresh();
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 relative">
      {/* Columna Izquierda: Formulario Rápido (Nuevo Producto) */}
      <div className="lg:col-span-1">
        <div className="bg-[#0a0a0a] border border-[#333] p-6 sticky top-24">
          <h2 className="font-montserrat font-black text-xl uppercase tracking-wider mb-6 flex items-center gap-2">
            <PackagePlus className="w-5 h-5 text-[#E60000]" /> Nuevo Producto
          </h2>
          <form ref={formRef} action={handleAddProduct} className="flex flex-col gap-4">
            <input type="text" name="name" placeholder="Nombre (Ej: Buzo Jordan)" required className="w-full bg-[#111] border border-[#333] p-3 text-white focus:border-white focus:outline-none" />
            <input type="number" name="price" placeholder="Precio ($)" required className="w-full bg-[#111] border border-[#333] p-3 text-white focus:border-white focus:outline-none" />
            <select name="category" required className="w-full bg-[#111] border border-[#333] p-3 text-white focus:border-white focus:outline-none">
              <option value="buzos">Buzos</option>
              <option value="pantalones">Pantalones</option>
              <option value="calzado">Calzado</option>
              <option value="accesorios">Accesorios</option>
              <option value="perfumes">Perfumes</option>
              <option value="gorras">Gorras</option>
            </select>
            
            <input type="text" id="new-product-image-url" name="image_url" placeholder="URL de la imagen" required className="w-full bg-[#111] border border-[#333] p-3 text-white focus:border-white focus:outline-none text-xs text-neutral-500" readOnly />
            
            <div className="relative overflow-hidden w-full bg-[#111] border border-[#333] hover:border-white transition-colors cursor-pointer p-3 flex justify-center items-center gap-2">
              <input type="file" accept="image/*" onChange={handleImageUpload} className="absolute inset-0 opacity-0 cursor-pointer" />
              <Upload className="w-4 h-4 text-[#E60000]" />
              <span className="font-bold text-sm uppercase text-white">{isUploading ? 'Subiendo...' : 'Subir Imagen desde PC'}</span>
            </div>

            <input type="text" name="sizes" placeholder="Talles (Opcional, defecto: Único)" className="w-full bg-[#111] border border-[#333] p-3 text-white focus:border-white focus:outline-none" />
            <button type="submit" className="w-full bg-[#E60000] text-white font-black py-4 uppercase tracking-widest border border-[#E60000] hover:bg-white hover:text-black hover:border-white transition-colors mt-2">
              Crear Producto
            </button>
          </form>
        </div>
      </div>
      
      {/* Columna Derecha: Grilla de Productos y Controles */}
      <div className="lg:col-span-2 flex flex-col gap-6">
        
        {/* Barra de Búsqueda y Filtros */}
        <div className="bg-[#0a0a0a] border border-[#333] p-4 flex flex-col md:flex-row gap-4 items-center justify-between sticky top-24 z-10">
          
          <div className="flex w-full md:w-auto gap-2 flex-1">
            <div className="relative w-full max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
              <input 
                type="text" 
                placeholder="Buscar producto..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#111] border border-[#333] pl-10 pr-3 py-2 text-sm text-white focus:border-white focus:outline-none transition-colors"
              />
            </div>
            
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
              <select 
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="bg-[#111] border border-[#333] pl-10 pr-8 py-2 text-sm text-white focus:border-white focus:outline-none appearance-none cursor-pointer transition-colors"
              >
                <option value="all">Todas las Categorías</option>
                <option value="buzos">Buzos</option>
                <option value="pantalones">Pantalones</option>
                <option value="calzado">Calzado</option>
                <option value="accesorios">Accesorios</option>
                <option value="perfumes">Perfumes</option>
                <option value="gorras">Gorras</option>
              </select>
            </div>
          </div>

          <div className="flex gap-2">
            <button 
              onClick={() => {
                setIsSelectionMode(!isSelectionMode);
                if (isSelectionMode) setSelectedProductIds([]);
              }} 
              title="Modo Selección Múltiple"
              className={`p-2 border transition-colors flex items-center gap-2 ${isSelectionMode ? 'bg-[#E60000] text-white border-[#E60000]' : 'bg-[#111] text-neutral-500 border-[#333] hover:text-white'}`}
            >
              <CheckSquare className="w-4 h-4" />
              <span className="hidden md:inline font-bold text-xs uppercase tracking-widest">Selec.</span>
            </button>
            <div className="w-px h-8 bg-[#333] mx-1"></div>
            <button onClick={() => setGridSize('large')} title="Vista Grande" className={`p-2 border transition-colors ${gridSize === 'large' ? 'bg-white text-black border-white' : 'bg-[#111] text-neutral-500 border-[#333] hover:text-white'}`}>
              <Grid className="w-4 h-4" />
            </button>
            <button onClick={() => setGridSize('medium')} title="Vista Mediana" className={`p-2 border transition-colors ${gridSize === 'medium' ? 'bg-white text-black border-white' : 'bg-[#111] text-neutral-500 border-[#333] hover:text-white'}`}>
              <Grid2X2 className="w-4 h-4" />
            </button>
            <button onClick={() => setGridSize('small')} title="Vista Pequeña" className={`p-2 border transition-colors ${gridSize === 'small' ? 'bg-white text-black border-white' : 'bg-[#111] text-neutral-500 border-[#333] hover:text-white'}`}>
              <Grid3X3 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Floating Action Bar (Eliminar Múltiple) */}
        {isSelectionMode && selectedProductIds.length > 0 && (
          <div className="bg-[#E60000] text-white p-4 sticky top-44 z-20 flex justify-between items-center shadow-xl border border-red-500 animate-in fade-in slide-in-from-top-4">
            <span className="font-montserrat font-black uppercase tracking-wider">{selectedProductIds.length} Productos Seleccionados</span>
            <button 
              onClick={handleDeleteSelected}
              className="bg-black text-white hover:bg-white hover:text-black transition-colors px-4 py-2 font-bold text-xs uppercase tracking-widest flex items-center gap-2"
            >
              <Trash2 className="w-4 h-4" /> Eliminar Permanentemente
            </button>
          </div>
        )}

        {/* Grilla */}
        <div className={`grid gap-4 ${gridColsClass}`}>
          {filteredProducts.map(product => {
            const isSelected = selectedProductIds.includes(product.id);
            return (
              <div 
                key={product.id} 
                onClick={() => handleProductClick(product)}
                className={`bg-[#0a0a0a] border transition-all cursor-pointer group flex flex-col relative
                  ${isSelected ? 'border-[#E60000] ring-1 ring-[#E60000]' : 'border-[#333] hover:border-white'}
                `}
              >
                {/* Indicador de Selección */}
                {isSelectionMode && (
                  <div className="absolute top-2 right-2 z-10 bg-black/50 rounded-full p-1">
                    {isSelected ? <CheckSquare className="w-5 h-5 text-[#E60000]" /> : <Square className="w-5 h-5 text-white/50" />}
                  </div>
                )}

                <div className="w-full aspect-square bg-[#111] relative overflow-hidden flex items-center justify-center">
                  <img src={product.image_url} alt={product.name} className={`w-full h-full object-cover transition-transform ${isSelectionMode ? '' : 'group-hover:scale-105'}`} />
                </div>
                <div className="p-3 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-montserrat font-bold text-white uppercase tracking-wider text-xs line-clamp-2">{product.name}</h3>
                    <p className="text-[#E60000] font-black text-sm mt-1">${product.price.toLocaleString('es-AR')}</p>
                  </div>
                  <p className="text-xs text-neutral-500 mt-2 font-semibold">{product.product_sizes?.length || 0} Talles</p>
                </div>
              </div>
            );
          })}
          {filteredProducts.length === 0 && (
            <div className="col-span-full py-10 text-center text-neutral-500 font-bold uppercase tracking-widest border border-dashed border-[#333]">
              No se encontraron productos.
            </div>
          )}
        </div>
      </div>

      {/* Modal de Detalle / Edición */}
      {selectedProduct && !isSelectionMode && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-[#0a0a0a] border border-[#333] w-full max-w-2xl max-h-[90vh] overflow-y-auto flex flex-col relative shadow-2xl">
            
            {/* Header del Modal */}
            <div className="flex justify-between items-center p-4 border-b border-[#333] sticky top-0 bg-[#0a0a0a] z-10">
              <h2 className="font-montserrat font-black text-lg uppercase tracking-wider text-white">Editar Producto</h2>
              <button onClick={() => setSelectedProduct(null)} className="text-neutral-500 hover:text-[#E60000] transition-colors p-1">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 flex flex-col md:flex-row gap-6">
              {/* Lado Izquierdo: Imagen */}
              <div className="w-full md:w-1/3 flex flex-col gap-3">
                <div className="aspect-square bg-[#111] border border-[#333] relative overflow-hidden group">
                  <img src={selectedProduct.image_url} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center cursor-pointer">
                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={(e) => handleImageUpload(e, selectedProduct.id)} 
                      className="absolute inset-0 opacity-0 cursor-pointer" 
                    />
                    <Upload className="w-8 h-8 text-white mb-2" />
                    <span className="text-white font-bold text-xs uppercase tracking-widest text-center px-4">
                      {isUploading ? 'Subiendo...' : 'Cambiar Imagen'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Lado Derecho: Datos y Stock */}
              <div className="w-full md:w-2/3 flex flex-col gap-6">
                
                {/* Info Básica (Editable) */}
                <form 
                  action={async (formData) => { 
                    await editProductDetails(formData); 
                    setSelectedProduct({
                      ...selectedProduct,
                      name: formData.get('name'),
                      price: parseFloat(formData.get('price') as string),
                      category: formData.get('category')
                    });
                    router.refresh(); 
                  }} 
                  className="flex flex-col gap-3"
                >
                  <input type="hidden" name="productId" value={selectedProduct.id} />
                  <div className="flex justify-between items-start gap-4">
                    <div className="flex-1">
                      <input 
                        type="text" 
                        name="name" 
                        defaultValue={selectedProduct.name} 
                        className="w-full font-montserrat font-black text-xl uppercase text-white bg-transparent border-b border-transparent hover:border-[#333] focus:border-white focus:outline-none transition-colors mb-1" 
                        required 
                        title="Modificar Nombre"
                      />
                      <div className="flex items-center gap-2">
                        <span className="text-lg font-bold text-[#E60000]">$</span>
                        <input 
                          type="number" 
                          name="price" 
                          defaultValue={selectedProduct.price} 
                          className="w-24 text-lg font-bold text-[#E60000] bg-transparent border-b border-transparent hover:border-[#333] focus:border-white focus:outline-none transition-colors" 
                          required 
                          title="Modificar Precio"
                        />
                        <select 
                          name="category" 
                          defaultValue={selectedProduct.category} 
                          className="text-sm text-neutral-500 bg-transparent border-b border-transparent hover:border-[#333] focus:border-white focus:outline-none transition-colors ml-2 cursor-pointer"
                          required
                          title="Modificar Categoría"
                        >
                          <option value="buzos">Buzos</option>
                          <option value="pantalones">Pantalones</option>
                          <option value="calzado">Calzado</option>
                          <option value="accesorios">Accesorios</option>
                          <option value="perfumes">Perfumes</option>
                          <option value="gorras">Gorras</option>
                        </select>
                      </div>
                    </div>
                    
                    <div className="flex flex-col gap-2 shrink-0">
                      <button type="submit" title="Guardar Cambios de Info Básica" className="p-2 border border-green-500 text-green-500 hover:bg-green-500 hover:text-white transition-colors">
                        <Save className="w-5 h-5" />
                      </button>
                      <button 
                        type="button"
                        onClick={async () => {
                          if (confirm('¿Eliminar este producto permanentemente?')) {
                            const formData = new FormData();
                            formData.append('productIds', selectedProduct.id);
                            await deleteProducts(formData);
                            setSelectedProduct(null);
                            router.refresh();
                          }
                        }}
                        title="Eliminar Producto" 
                        className="p-2 border border-[#333] text-neutral-500 hover:border-red-500 hover:text-red-500 hover:bg-red-500/10 transition-colors"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </form>

                {/* Gestor de Talles */}
                <div>
                  <h4 className="font-bold text-xs uppercase tracking-widest text-neutral-400 mb-3 border-b border-[#333] pb-2">Control de Stock por Talle</h4>
                  <div className="flex flex-col gap-2">
                    {selectedProduct.product_sizes?.map((ps: any) => (
                      <div key={ps.size} className="flex items-center bg-[#111] border border-[#333] justify-between">
                        <span className="font-bold text-sm uppercase px-4 py-2 border-r border-[#333] w-20 text-center">{ps.size}</span>
                        
                        <div className="flex flex-1">
                          <form action={async (formData) => { await updateStock(formData); router.refresh(); }} className="flex flex-1 items-center">
                            <input type="hidden" name="productId" value={selectedProduct.id} />
                            <input type="hidden" name="size" value={ps.size} />
                            <input 
                              type="number" 
                              name="stock" 
                              defaultValue={ps.stock_quantity} 
                              className="w-full bg-transparent text-white text-center text-sm focus:outline-none px-2"
                              min="0"
                            />
                            <button type="submit" title="Guardar Stock" className="px-4 py-2 text-green-500 hover:bg-green-500 hover:text-white transition-colors border-l border-[#333]">
                              <Save className="w-4 h-4" />
                            </button>
                          </form>
                          
                          <form action={async (formData) => { await deleteSize(formData); router.refresh(); }} className="flex items-center">
                            <input type="hidden" name="productId" value={selectedProduct.id} />
                            <input type="hidden" name="size" value={ps.size} />
                            <button type="submit" title="Eliminar Talle" className="px-4 py-2 text-red-500 hover:bg-red-500 hover:text-white transition-colors border-l border-[#333]">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </form>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Agregar Nuevo Talle */}
                  <form action={async (formData) => { await addSize(formData); router.refresh(); }} className="flex items-center bg-transparent border border-dashed border-[#666] mt-4">
                    <input type="hidden" name="productId" value={selectedProduct.id} />
                    <input 
                      type="text" 
                      name="newSize" 
                      placeholder="NUEVO TALLE" 
                      required 
                      className="w-full bg-transparent text-white text-center text-sm font-bold uppercase focus:outline-none p-2"
                    />
                    <button type="submit" title="Agregar Talle" className="px-4 py-2 bg-[#111] text-white hover:bg-white hover:text-black font-bold uppercase text-xs tracking-widest transition-colors border-l border-dashed border-[#666]">
                      Crear
                    </button>
                  </form>
                </div>

              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
