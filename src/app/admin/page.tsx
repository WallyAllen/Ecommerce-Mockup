import { createClient as createServerClient } from "@/utils/supabase/server";
import { createClient as createAdminClient } from "@supabase/supabase-js";
import { redirect } from "next/navigation";
import { Shield, Check, XCircle, PackagePlus, Save } from "lucide-react";
import { updateOrderStatus, addProduct, updateStock } from "./actions";
import Link from "next/link";

export const dynamic = 'force-dynamic';

export default async function AdminPage({ searchParams }: { searchParams: Promise<{ tab?: string }> }) {
  const { tab = 'orders' } = await searchParams;
  
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user || user.email !== 'fjborrazas3@gmail.com') {
    redirect('/');
  }

  const supabaseAdmin = createAdminClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    process.env.SUPABASE_SERVICE_ROLE_KEY || ''
  );

  let orders: any[] = [];
  let products: any[] = [];

  if (tab === 'orders') {
    const { data } = await supabaseAdmin
      .from('orders')
      .select(`*, order_items (*)`)
      .order('created_at', { ascending: false });
    orders = data || [];
  } else {
    const { data } = await supabaseAdmin
      .from('products')
      .select(`*, product_sizes (*)`)
      .order('created_at', { ascending: false });
    products = data || [];
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center gap-4 mb-6 border-b border-[#333] pb-6">
        <div className="bg-[#E60000] p-3">
          <Shield className="w-8 h-8 text-white" />
        </div>
        <div>
          <h1 className="font-montserrat font-black text-3xl uppercase tracking-wider text-white">Panel de Control</h1>
          <p className="text-sm font-semibold text-neutral-400">Acceso maestro: {user.email}</p>
        </div>
      </div>

      <div className="flex gap-4 mb-6">
        <Link href="/admin?tab=orders" className={`font-montserrat font-black uppercase text-sm tracking-widest px-6 py-3 transition-colors border ${tab === 'orders' ? 'bg-white text-black border-white' : 'bg-[#0a0a0a] text-neutral-400 border-[#333] hover:border-white hover:text-white'}`}>
          Órdenes
        </Link>
        <Link href="/admin?tab=inventory" className={`font-montserrat font-black uppercase text-sm tracking-widest px-6 py-3 transition-colors border ${tab === 'inventory' ? 'bg-white text-black border-white' : 'bg-[#0a0a0a] text-neutral-400 border-[#333] hover:border-white hover:text-white'}`}>
          Catálogo / Inventario
        </Link>
      </div>

      {tab === 'orders' ? (
        <div className="bg-[#0a0a0a] border border-[#333] overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-[#111] border-b border-[#333]">
                <th className="p-4 font-montserrat font-black uppercase text-xs tracking-widest text-neutral-400">ID / Fecha</th>
                <th className="p-4 font-montserrat font-black uppercase text-xs tracking-widest text-neutral-400">Cliente</th>
                <th className="p-4 font-montserrat font-black uppercase text-xs tracking-widest text-neutral-400">Total / Método</th>
                <th className="p-4 font-montserrat font-black uppercase text-xs tracking-widest text-neutral-400">Estado</th>
                <th className="p-4 font-montserrat font-black uppercase text-xs tracking-widest text-neutral-400 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {orders && orders.length > 0 ? (
                orders.map((order) => (
                  <tr key={order.id} className="border-b border-[#333] hover:bg-[#111] transition-colors">
                    <td className="p-4">
                      <p className="font-bold text-sm text-white uppercase">{order.id.split('-')[0]}</p>
                      <p className="text-xs text-neutral-500 font-semibold">{new Date(order.created_at).toLocaleString('es-AR')}</p>
                    </td>
                    <td className="p-4">
                      <p className="font-bold text-sm text-white">{order.customer_name}</p>
                      <p className="text-xs text-neutral-500 font-semibold">{order.customer_phone}</p>
                      <p className="text-xs text-neutral-500 font-semibold">{order.customer_email}</p>
                    </td>
                    <td className="p-4">
                      <p className="font-black text-base text-[#E60000]">${order.total.toLocaleString('es-AR')}</p>
                      <p className="text-xs font-bold text-neutral-400 uppercase tracking-widest">{order.payment_method} - {order.delivery_method}</p>
                    </td>
                    <td className="p-4">
                      <span className={`text-xs font-black uppercase tracking-widest px-3 py-1 border ${
                        order.status === 'paid' ? 'border-green-500 text-green-500 bg-green-500/10' : 
                        order.status === 'pending' ? 'border-yellow-500 text-yellow-500 bg-yellow-500/10' : 
                        'border-red-500 text-red-500 bg-red-500/10'
                      }`}>
                        {order.status === 'paid' ? 'Pagado' : order.status === 'pending' ? 'Pendiente' : 'Cancelado'}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      {order.status === 'pending' && (
                        <div className="flex justify-end gap-2">
                          <form action={updateOrderStatus}>
                            <input type="hidden" name="orderId" value={order.id} />
                            <input type="hidden" name="status" value="paid" />
                            <button type="submit" title="Confirmar Pago" className="p-2 border border-green-500 text-green-500 hover:bg-green-500 hover:text-white transition-colors">
                              <Check className="w-4 h-4" />
                            </button>
                          </form>
                          <form action={updateOrderStatus}>
                            <input type="hidden" name="orderId" value={order.id} />
                            <input type="hidden" name="status" value="cancelled" />
                            <button type="submit" title="Cancelar Orden y Devolver Stock" className="p-2 border border-red-500 text-red-500 hover:bg-red-500 hover:text-white transition-colors">
                              <XCircle className="w-4 h-4" />
                            </button>
                          </form>
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-neutral-500 font-bold uppercase tracking-widest">
                    No hay órdenes registradas.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
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
                <input type="text" name="image_url" placeholder="URL Imagen (/images/...)" required className="w-full bg-[#111] border border-[#333] p-3 text-white focus:border-white focus:outline-none" />
                <input type="text" name="sizes" placeholder="Talles separados por coma (S, M, L)" required className="w-full bg-[#111] border border-[#333] p-3 text-white focus:border-white focus:outline-none" />
                <button type="submit" className="w-full bg-[#E60000] text-white font-black py-4 uppercase tracking-widest border border-[#E60000] hover:bg-white hover:text-black hover:border-white transition-colors mt-2">
                  Agregar a la tienda
                </button>
              </form>
            </div>
          </div>
          
          <div className="lg:col-span-2 space-y-4">
            {products.map(product => (
              <div key={product.id} className="bg-[#0a0a0a] border border-[#333] p-4 flex flex-col md:flex-row gap-4">
                <div className="w-20 h-20 bg-[#111] border border-[#333] shrink-0 relative overflow-hidden flex items-center justify-center">
                  <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1">
                  <h3 className="font-montserrat font-bold text-white uppercase tracking-wider text-sm">{product.name}</h3>
                  <p className="text-[#E60000] font-black">${product.price.toLocaleString('es-AR')} <span className="text-xs text-neutral-500 font-semibold ml-2">[{product.category}]</span></p>
                  
                  <div className="mt-4 flex flex-wrap gap-2">
                    {product.product_sizes?.map((ps: any) => (
                      <form key={ps.size} action={updateStock} className="flex items-center bg-[#111] border border-[#333]">
                        <span className="font-bold text-xs uppercase px-3 py-1 border-r border-[#333]">{ps.size}</span>
                        <input type="hidden" name="productId" value={product.id} />
                        <input type="hidden" name="size" value={ps.size} />
                        <input 
                          type="number" 
                          name="stock" 
                          defaultValue={ps.stock_quantity} 
                          className="w-16 bg-transparent text-white text-center text-sm focus:outline-none"
                          min="0"
                        />
                        <button type="submit" className="px-2 py-1 hover:bg-[#E60000] transition-colors border-l border-[#333]">
                          <Save className="w-4 h-4" />
                        </button>
                      </form>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
