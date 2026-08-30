import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { MercadoPagoConfig, Preference } from 'mercadopago';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '', 
  process.env.SUPABASE_SERVICE_ROLE_KEY || ''
);

// MercadoPago Config
const client = new MercadoPagoConfig({ accessToken: process.env.MP_ACCESS_TOKEN || '' });

interface CartItemReq {
  id: string;
  size: string;
  quantity: number;
}

interface OrderRequest {
  cart: CartItemReq[];
  deliveryMethod: string;
  paymentMethod: string;
  customerInfo: {
    name: string;
    email: string;
    phone: string;
  };
}

export async function POST(req: Request) {
  try {
    const body = await req.json() as OrderRequest;
    const { cart, deliveryMethod, paymentMethod, customerInfo } = body;

type SecureCartItem = CartItemReq & { name: string; price: number };

    // Obtener precios reales de la BD para prevenir fraude
    const productIds = cart.map((item) => item.id);
    const { data: realProducts, error: productsError } = await supabaseAdmin
      .from('products')
      .select('id, name, price')
      .in('id', productIds);

    if (productsError || !realProducts) {
      throw new Error('Error al validar los productos en la base de datos.');
    }

    // Construir carrito seguro
    const secureCart: SecureCartItem[] = cart.map((item) => {
      const realProduct = realProducts.find(p => p.id === item.id);
      if (!realProduct) throw new Error(`Producto inválido: ${item.id}`);
      return {
        ...item,
        name: realProduct.name,
        price: realProduct.price
      };
    });

    // Calcular el total real
    const total = secureCart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();

    // Insertar Orden, Items y Descontar Stock de forma Atómica
    const { data: orderResponse, error: rpcError } = await supabaseAdmin.rpc('create_order_atomic', {
      p_customer_name: customerInfo?.name || 'Cliente',
      p_customer_email: customerInfo?.email || 'email@placeholder.com',
      p_customer_phone: customerInfo?.phone || '000',
      p_delivery_method: deliveryMethod,
      p_payment_method: paymentMethod,
      p_total: total,
      p_status: 'pending',
      p_expires_at: expiresAt,
      p_items: secureCart.map((item) => ({
        product_id: item.id,
        size: item.size,
        quantity: item.quantity,
        price: item.price
      }))
    });

    if (rpcError || !orderResponse) {
      throw new Error(rpcError?.message || 'Error al procesar la orden o stock insuficiente.');
    }

    const order = { id: orderResponse.order_id };

    // MercadoPago Preference
    if (paymentMethod === 'tarjeta') {
      const preference = new Preference(client);
      const prefData = await preference.create({
        body: {
          items: secureCart.map((item) => ({
            id: item.id,
            title: item.name,
            quantity: item.quantity,
            unit_price: item.price,
            currency_id: 'ARS',
          })),
          back_urls: {
            success: `${process.env.NEXT_PUBLIC_URL}/checkout/success?order=${order.id}`,
            failure: `${process.env.NEXT_PUBLIC_URL}/checkout/failure`,
            pending: `${process.env.NEXT_PUBLIC_URL}/checkout/pending`,
          },
          auto_return: 'approved',
          external_reference: order.id,
        }
      });

      await supabaseAdmin.from('orders').update({ mercadopago_preference_id: prefData.id }).eq('id', order.id);

      return NextResponse.json({ url: prefData.init_point });
    } else {
      // EVENTO: Reserva/Transferencia Pendiente (Hito 1.4)
      // Disparamos el webhook a n8n de forma asíncrona para que la IA lo contacte por WhatsApp.
      if (process.env.N8N_WEBHOOK_URL) {
        await fetch(process.env.N8N_WEBHOOK_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            event: 'transfer_pending',
            order_id: order.id,
            customer_name: customerInfo?.name || 'Cliente',
            customer_email: customerInfo?.email || '',
            customer_phone: customerInfo?.phone || '',
            total: total,
            items: secureCart.map((i) => `${i.quantity}x ${i.name} (Talle: ${i.size})`).join(', ')
          })
        }).catch(err => console.error("Error disparando webhook a n8n:", err));
      }

      return NextResponse.json({ url: `/checkout/success?order=${order.id}&method=efectivo` });
    }

  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
