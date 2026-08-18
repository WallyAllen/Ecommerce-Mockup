import { createClient as createServerClient } from "@/utils/supabase/server";
import { createClient as createAdminClient } from "@supabase/supabase-js";
import { redirect } from "next/navigation";
import { Shield, Check, XCircle } from "lucide-react";
import { updateOrderStatus } from "./actions";

export const dynamic = 'force-dynamic';

export default async function AdminPage() {
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  // Capa de seguridad: Solo este email entra
  if (!user || user.email !== 'fjborrazas3@gmail.com') {
    redirect('/');
  }

  // Usamos Service Role para saltar cualquier restricción de RLS
  const supabaseAdmin = createAdminClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    process.env.SUPABASE_SERVICE_ROLE_KEY || ''
  );

  // Traer órdenes con sus items usando admin client
  const { data: orders, error } = await supabaseAdmin
    .from('orders')
    .select(`
      *,
      order_items (*)
    `)
    .order('created_at', { ascending: false });

  if (error) {
    console.error("Error fetching orders:", error);
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center gap-4 mb-8 border-b border-[#333] pb-6">
        <div className="bg-[#E60000] p-3">
          <Shield className="w-8 h-8 text-white" />
        </div>
        <div>
          <h1 className="font-montserrat font-black text-3xl uppercase tracking-wider text-white">Panel de Control</h1>
          <p className="text-sm font-semibold text-neutral-400">Acceso maestro: {user.email}</p>
        </div>
      </div>

      <div className="bg-[#0a0a0a] border border-[#333] overflow-x-auto">
        <table className="w-full text-left border-collapse">
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
                          <button 
                            type="submit"
                            title="Confirmar Pago"
                            className="p-2 border border-green-500 text-green-500 hover:bg-green-500 hover:text-white transition-colors"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                        </form>
                        <form action={updateOrderStatus}>
                          <input type="hidden" name="orderId" value={order.id} />
                          <input type="hidden" name="status" value="cancelled" />
                          <button 
                            type="submit"
                            title="Cancelar Orden y Devolver Stock"
                            className="p-2 border border-red-500 text-red-500 hover:bg-red-500 hover:text-white transition-colors"
                          >
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
    </div>
  );
}
