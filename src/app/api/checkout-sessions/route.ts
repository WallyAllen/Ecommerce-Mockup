import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '', 
  process.env.SUPABASE_SERVICE_ROLE_KEY || ''
);

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { customerInfo, cart } = body;

    if (!customerInfo?.email || !customerInfo?.phone) {
      return NextResponse.json({ error: 'Missing required customer info' }, { status: 400 });
    }

    const { data, error } = await supabaseAdmin.from('checkout_sessions').insert({
      customer_name: customerInfo.name || 'Desconocido',
      customer_email: customerInfo.email,
      customer_phone: customerInfo.phone,
      cart_data: cart,
      status: 'abandoned'
    }).select('id').single();

    if (error) {
      throw error;
    }

    return NextResponse.json({ success: true, sessionId: data.id });
  } catch (error: any) {
    console.error('Error saving checkout session:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
