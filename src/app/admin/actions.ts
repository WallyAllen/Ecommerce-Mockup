'use server'

import { createClient as createServerClient } from '@/utils/supabase/server'
import { createClient as createAdminClient } from '@supabase/supabase-js'
import { revalidatePath } from 'next/cache'

export async function updateOrderStatus(formData: FormData) {
  const supabase = await createServerClient()
  const orderId = formData.get('orderId') as string
  const status = formData.get('status') as string

  // Capa de seguridad backend: Verificar admin
  const { data: { user } } = await supabase.auth.getUser()
  if (!user || user.email !== 'fjborrazas3@gmail.com') {
    throw new Error('Unauthorized')
  }

  const supabaseAdmin = createAdminClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    process.env.SUPABASE_SERVICE_ROLE_KEY || ''
  )

  if (status === 'cancelled') {
    // Si se cancela, debemos devolver el stock
    const { data: orderItems } = await supabaseAdmin
      .from('order_items')
      .select('product_id, size, quantity')
      .eq('order_id', orderId)

    if (orderItems) {
      for (const item of orderItems) {
        // Leer stock actual
        const { data: sizeData } = await supabaseAdmin
          .from('product_sizes')
          .select('stock_quantity')
          .eq('product_id', item.product_id)
          .eq('size', item.size)
          .single()

        if (sizeData) {
          await supabaseAdmin
            .from('product_sizes')
            .update({ stock_quantity: sizeData.stock_quantity + item.quantity })
            .eq('product_id', item.product_id)
            .eq('size', item.size)
        }
      }
    }
  }

  // Actualizar estado de la orden
  await supabaseAdmin
    .from('orders')
    .update({ status })
    .eq('id', orderId)

  revalidatePath('/admin')
}
