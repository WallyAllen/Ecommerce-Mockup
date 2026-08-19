"use client";

import { useState, useMemo, useEffect, useTransition } from "react";
import { Search, Check, XCircle, Clock, CheckCircle2, Ban, Eye } from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { updateOrderStatus } from "@/app/admin/actions";
import { useRouter } from "next/navigation";

export default function OrdersManager({ initialOrders }: { initialOrders: any[] }) {
  const [orders, setOrders] = useState(initialOrders);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusTab, setStatusTab] = useState<"pending" | "paid" | "cancelled">("pending");
  const supabase = createClient();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  // Actualizar estado local cuando llegan props nuevas (por refresh)
  useEffect(() => {
    setOrders(initialOrders);
  }, [initialOrders]);

  // Suscribirse a cambios en tiempo real
  useEffect(() => {
    const channel = supabase
      .channel("orders_changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "orders" },
        () => {
          // Cuando hay un cambio (ej. cliente hace un pedido), recargamos los datos desde el servidor
          // Esto asegura que obtenemos las relaciones (order_items) correctamente.
          startTransition(() => {
            router.refresh();
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase, router]);

  const filteredOrders = useMemo(() => {
    return orders.filter(order => {
      const matchStatus = order.status === statusTab;
      
      const searchLower = searchQuery.toLowerCase();
      const orderId = order.id.split('-')[0].toLowerCase();
      const date = new Date(order.created_at).toLocaleString('es-AR').toLowerCase();
      const name = order.customer_name?.toLowerCase() || '';
      const email = order.customer_email?.toLowerCase() || '';
      const phone = order.customer_phone?.toLowerCase() || '';
      
      const matchSearch = 
        !searchQuery ||
        orderId.includes(searchLower) || 
        date.includes(searchLower) || 
        name.includes(searchLower) ||
        email.includes(searchLower) ||
        phone.includes(searchLower);

      return matchStatus && matchSearch;
    });
  }, [orders, statusTab, searchQuery]);

  const handleUpdateStatus = async (orderId: string, newStatus: string) => {
    // 1. Optimistic update (se siente instantáneo)
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
    
    // 2. Call Server Action
    const formData = new FormData();
    formData.append("orderId", orderId);
    formData.append("status", newStatus);
    
    try {
      await updateOrderStatus(formData);
    } catch (e) {
      // Revert if error
      setOrders(initialOrders);
      alert("Error al actualizar la orden.");
    }
  };

  const counts = {
    pending: orders.filter(o => o.status === 'pending').length,
    paid: orders.filter(o => o.status === 'paid').length,
    cancelled: orders.filter(o => o.status === 'cancelled').length,
  };

  return (
    <div className="flex flex-col gap-6">
      
      {/* Barra de Filtros y Búsqueda */}
      <div className="bg-[#0a0a0a] border border-[#333] p-4 flex flex-col md:flex-row gap-4 items-center justify-between sticky top-24 z-10">
        
        {/* Tabs de Estado */}
        <div className="flex gap-2 w-full md:w-auto">
          <button 
            onClick={() => setStatusTab('pending')}
            className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 border transition-colors font-bold text-xs uppercase tracking-widest ${statusTab === 'pending' ? 'bg-yellow-500/20 text-yellow-500 border-yellow-500' : 'bg-[#111] text-neutral-500 border-[#333] hover:text-white'}`}
          >
            <Clock className="w-4 h-4" />
            Pendientes ({counts.pending})
          </button>
          <button 
            onClick={() => setStatusTab('paid')}
            className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 border transition-colors font-bold text-xs uppercase tracking-widest ${statusTab === 'paid' ? 'bg-green-500/20 text-green-500 border-green-500' : 'bg-[#111] text-neutral-500 border-[#333] hover:text-white'}`}
          >
            <CheckCircle2 className="w-4 h-4" />
            Aprobadas ({counts.paid})
          </button>
          <button 
            onClick={() => setStatusTab('cancelled')}
            className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 border transition-colors font-bold text-xs uppercase tracking-widest ${statusTab === 'cancelled' ? 'bg-red-500/20 text-red-500 border-red-500' : 'bg-[#111] text-neutral-500 border-[#333] hover:text-white'}`}
          >
            <Ban className="w-4 h-4" />
            Desaprobadas ({counts.cancelled})
          </button>
        </div>

        {/* Búsqueda */}
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
          <input 
            type="text" 
            placeholder="Buscar por #, nombre, email o fecha..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#111] border border-[#333] pl-10 pr-3 py-2 text-sm text-white focus:border-white focus:outline-none transition-colors"
          />
        </div>
      </div>

      {/* Tabla de Órdenes */}
      <div className={`bg-[#0a0a0a] border border-[#333] overflow-x-auto transition-opacity duration-200 ${isPending ? 'opacity-50' : 'opacity-100'}`}>
        <table className="w-full text-left border-collapse min-w-[800px]">
          <thead>
            <tr className="bg-[#111] border-b border-[#333]">
              <th className="p-4 font-montserrat font-black uppercase text-xs tracking-widest text-neutral-400">ID / Fecha</th>
              <th className="p-4 font-montserrat font-black uppercase text-xs tracking-widest text-neutral-400">Cliente</th>
              <th className="p-4 font-montserrat font-black uppercase text-xs tracking-widest text-neutral-400">Total / Método</th>
              <th className="p-4 font-montserrat font-black uppercase text-xs tracking-widest text-neutral-400">Detalle</th>
              <th className="p-4 font-montserrat font-black uppercase text-xs tracking-widest text-neutral-400 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders && filteredOrders.length > 0 ? (
              filteredOrders.map((order) => (
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
                    <div className="flex flex-col gap-1 max-h-24 overflow-y-auto pr-2">
                      {order.order_items?.map((item: any) => (
                        <div key={item.id} className="text-xs text-neutral-400 flex items-center justify-between border-b border-[#333] last:border-0 pb-1 last:pb-0">
                          <span className="truncate w-32">{item.product_name}</span>
                          <span className="font-bold text-white ml-2">x{item.quantity} (Talle: {item.size})</span>
                        </div>
                      ))}
                    </div>
                  </td>
                  <td className="p-4 text-right align-middle">
                    {order.status === 'pending' ? (
                      <div className="flex justify-end gap-2">
                        <button 
                          onClick={() => handleUpdateStatus(order.id, 'paid')}
                          title="Aprobar Orden" 
                          className="p-2 border border-green-500 text-green-500 hover:bg-green-500 hover:text-white transition-colors"
                        >
                          <Check className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => {
                            if(confirm("¿Estás seguro de cancelar esta orden? El stock será devuelto al inventario.")) {
                              handleUpdateStatus(order.id, 'cancelled');
                            }
                          }}
                          title="Desaprobar Orden / Cancelar" 
                          className="p-2 border border-red-500 text-red-500 hover:bg-red-500 hover:text-white transition-colors"
                        >
                          <XCircle className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <span className={`text-xs font-black uppercase tracking-widest px-3 py-1 border inline-block ${
                        order.status === 'paid' ? 'border-green-500 text-green-500 bg-green-500/10' : 'border-red-500 text-red-500 bg-red-500/10'
                      }`}>
                        {order.status === 'paid' ? 'Aprobado' : 'Desaprobado'}
                      </span>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="p-8 text-center text-neutral-500 font-bold uppercase tracking-widest">
                  No hay órdenes {statusTab === 'pending' ? 'pendientes' : statusTab === 'paid' ? 'aprobadas' : 'desaprobadas'} que coincidan con tu búsqueda.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

    </div>
  );
}
