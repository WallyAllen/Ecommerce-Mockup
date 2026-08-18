import Link from "next/link";
import { User, Package, LogOut, Shield } from "lucide-react";
import { createClient as createServerClient } from "@/utils/supabase/server";
import { createClient as createAdminClient } from "@supabase/supabase-js";
import { redirect } from "next/navigation";
import { logout } from "./actions";

export default async function Perfil() {
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  const supabaseAdmin = createAdminClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    process.env.SUPABASE_SERVICE_ROLE_KEY || ''
  );

  // Cargar historial de compras usando el email
  const { data: orders } = await supabaseAdmin
    .from('orders')
    .select('*')
    .eq('customer_email', user.email)
    .order('created_at', { ascending: false });

  // Verificar si es un admin
  const isAdmin = user.email === 'fjborrazas3@gmail.com';

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <h1 className="font-montserrat font-black text-3xl uppercase tracking-wider mb-8">Mi Perfil</h1>

      <div className="bg-[#0a0a0a] border border-[#333] p-6 mb-8 flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-6">
          <div className="w-20 h-20 bg-[#111] rounded-full border border-[#333] flex items-center justify-center">
            <User className="w-8 h-8 text-neutral-400" />
          </div>
          <div>
            <h2 className="font-montserrat font-black text-xl uppercase tracking-wider">Cliente Registrado</h2>
            <p className="text-sm font-semibold text-neutral-400 mt-1">{user.email}</p>
          </div>
        </div>
        
        <form action={logout}>
          <button className="flex items-center gap-2 text-neutral-400 hover:text-white transition-colors border border-[#333] px-4 py-2 text-sm font-bold uppercase tracking-widest">
            <LogOut className="w-4 h-4" /> Salir
          </button>
        </form>
      </div>

      <div className="space-y-4">
        {isAdmin && (
          <Link href="/admin" className="bg-[#E60000] border border-[#E60000] hover:bg-white hover:text-black hover:border-white p-6 flex items-center gap-4 transition-colors text-left text-white mb-8">
            <Shield className="w-6 h-6" />
            <div>
              <h3 className="font-montserrat font-black uppercase tracking-wider">Panel de Administración</h3>
              <p className="text-xs font-semibold mt-1 opacity-80">Gestión de órdenes y catálogo (Acceso Restringido)</p>
            </div>
          </Link>
        )}

        <div className="bg-[#0a0a0a] border border-[#333] p-6">
          <div className="flex items-center gap-3 mb-6">
            <Package className="w-6 h-6 text-[#E60000]" />
            <h3 className="font-montserrat font-black uppercase tracking-wider text-xl">Mis Pedidos</h3>
          </div>
          
          {orders && orders.length > 0 ? (
            <div className="space-y-4">
              {orders.map(order => (
                <div key={order.id} className="border border-[#333] bg-[#111] p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <span className="text-xs font-bold text-neutral-500 uppercase tracking-widest block mb-1">
                      {new Date(order.created_at).toLocaleDateString()}
                    </span>
                    <span className="font-montserrat font-black uppercase text-sm">
                      Orden #{order.id.split('-')[0]}
                    </span>
                  </div>
                  <div>
                    <span className={`text-xs font-black uppercase tracking-widest px-3 py-1 border ${
                      order.status === 'paid' ? 'border-green-500 text-green-500' : 
                      order.status === 'pending' ? 'border-yellow-500 text-yellow-500' : 
                      'border-red-500 text-red-500'
                    }`}>
                      {order.status === 'paid' ? 'Pagado' : order.status === 'pending' ? 'Pendiente' : 'Cancelado'}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="font-montserrat font-black">${order.total.toLocaleString('es-AR')}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm font-semibold text-neutral-400">Aún no tienes pedidos registrados.</p>
          )}
        </div>
      </div>
    </div>
  );
}
