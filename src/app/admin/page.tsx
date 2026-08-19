import { createClient as createServerClient } from "@/utils/supabase/server";
import { createClient as createAdminClient } from "@supabase/supabase-js";
import { redirect } from "next/navigation";
import { Shield } from "lucide-react";
import Link from "next/link";
import InventoryManager from "@/components/admin/InventoryManager";
import OrdersManager from "@/components/admin/OrdersManager";

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
        <OrdersManager initialOrders={orders} />
      ) : (
        <InventoryManager products={products} />
      )}
    </div>
  );
}

