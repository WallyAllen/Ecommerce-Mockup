"use client";

import { useState } from "react";
import { PackagePlus, Save, Trash2, Plus, X, Upload } from "lucide-react";
import { createClient } from "@/utils/supabase/client";

// Re-usamos las server actions exportadas desde admin/actions.ts pasadas por props o importadas directamente
import { updateStock, deleteSize, addSize, addProduct, editProductImage } from "@/app/admin/actions";

export default function InventoryManager({ products }: { products: any[] }) {
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const supabase = createClient();

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
        // Editando un producto existente
        const formData = new FormData();
        formData.append('productId', existingProductId);
        formData.append('imageUrl', data.publicUrl);
        await editProductImage(formData);
        
        // Actualizamos el estado visual temporalmente
        setSelectedProduct({ ...selectedProduct, image_url: data.publicUrl });
        alert("¡Imagen actualizada con éxito!");
      } else {
        // Estamos en el form de crear producto
        const inputUrl = document.getElementById('new-product-image-url') as HTMLInputElement;
        if (inputUrl) inputUrl.value = data.publicUrl;
      }
    } catch (error: any) {
      alert(`Error subiendo imagen: ${error.message}`);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Columna Izquierda: Formulario Rápido (Nuevo Producto) */}
      <div className="lg:col-span-1">
        <div className="bg-[#0a0a0a] border border-[#333] p-6 sticky top-24">
          <h2 className="font-montserrat font-black text-xl uppercase tracking-wider mb-6 flex items-center gap-2">
            <PackagePlus className="w-5 h-5 text-[#E60000]" /> Nuevo Producto
          </h2>
          <form action={addProduct} className="flex flex-col gap-4">
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
            
            {/* Input URL oculto o readonly, llenado por la subida */}
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
      
      {/* Columna Derecha: Grilla de Productos */}
      <div className="lg:col-span-2 grid grid-cols-2 md:grid-cols-3 gap-4">
        {products.map(product => (
          <div 
            key={product.id} 
            onClick={() => setSelectedProduct(product)}
            className="bg-[#0a0a0a] border border-[#333] hover:border-white transition-colors cursor-pointer group"
          >
            <div className="w-full aspect-square bg-[#111] relative overflow-hidden flex items-center justify-center">
              <img src={product.image_url} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
            </div>
            <div className="p-3">
              <h3 className="font-montserrat font-bold text-white uppercase tracking-wider text-xs line-clamp-1">{product.name}</h3>
              <p className="text-[#E60000] font-black text-sm">${product.price.toLocaleString('es-AR')}</p>
              <p className="text-xs text-neutral-500 mt-1">{product.product_sizes?.length || 0} Talles configurados</p>
            </div>
          </div>
        ))}
      </div>

      {/* Modal de Detalle / Edición */}
      {selectedProduct && (
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
                
                {/* Info Básica */}
                <div>
                  <h3 className="font-montserrat font-black text-xl uppercase text-white mb-1">{selectedProduct.name}</h3>
                  <p className="text-lg font-bold text-[#E60000]">${selectedProduct.price.toLocaleString('es-AR')} <span className="text-sm text-neutral-500 ml-2">[{selectedProduct.category}]</span></p>
                </div>

                {/* Gestor de Talles */}
                <div>
                  <h4 className="font-bold text-xs uppercase tracking-widest text-neutral-400 mb-3 border-b border-[#333] pb-2">Control de Stock por Talle</h4>
                  <div className="flex flex-col gap-2">
                    {selectedProduct.product_sizes?.map((ps: any) => (
                      <div key={ps.size} className="flex items-center bg-[#111] border border-[#333] justify-between">
                        <span className="font-bold text-sm uppercase px-4 py-2 border-r border-[#333] w-20 text-center">{ps.size}</span>
                        
                        <div className="flex flex-1">
                          <form action={updateStock} className="flex flex-1 items-center">
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
                          
                          <form action={deleteSize} className="flex items-center">
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
                  <form action={addSize} className="flex items-center bg-transparent border border-dashed border-[#666] mt-4">
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
