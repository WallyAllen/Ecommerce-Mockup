import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { MercadoPagoConfig, Preference } from 'mercadopago';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '', 
  process.env.SUPABASE_SERVICE_ROLE_KEY || ''
);

// MercadoPago Config
const client = new MercadoPagoConfig({ accessToken: process.env.MP_ACCESS_TOKEN || '' });

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { cart, deliveryMethod, paymentMethod, customerInfo } = body;

    // Calcular el total
    const total = cart.reduce((acc: number, item: any) => acc + (item.price * item.quantity), 0);
    
    // Insertar Orden
    const { data: order, error: orderError } = await supabaseAdmin.from('orders').insert({
      customer_name: customerInfo?.name || 'Cliente',
      customer_email: customerInfo?.email || 'email@placeholder.com',
      customer_phone: customerInfo?.phone || '000',
      delivery_method: deliveryMethod,
      payment_method: paymentMethod,
      total: total,
      status: 'pending'
    }).select('id').single();

    if (orderError || !order) {
      throw new Error(orderError?.message || 'Error al crear la orden.');
    }

    // Insertar Items y Descontar Stock
    for (const item of cart) {
      await supabaseAdmin.from('order_items').insert({
        order_id: order.id,
        product_id: item.id,
        size: item.size,
        quantity: item.quantity,
        price_at_purchase: item.price
      });

      // Leer stock actual
      const { data: sizeData } = await supabaseAdmin
        .from('product_sizes')
        .select('stock_quantity')
        .eq('product_id', item.id)
        .eq('size', item.size)
        .single();
        
      if (sizeData) {
        await supabaseAdmin
          .from('product_sizes')
          .update({ stock_quantity: Math.max(0, sizeData.stock_quantity - item.quantity) })
          .eq('product_id', item.id)
          .eq('size', item.size);
      }
    }

    // MercadoPago Preference
    if (paymentMethod === 'tarjeta') {
      const preference = new Preference(client);
      const prefData = await preference.create({
        body: {
          items: cart.map((item: any) => ({
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
            items: cart.map((i: any) => `${i.quantity}x ${i.name} (Talle: ${i.size})`).join(', ')
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
