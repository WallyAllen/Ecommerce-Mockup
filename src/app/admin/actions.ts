'use server'

import { createClient as createServerClient } from '@/utils/supabase/server'
import { createClient as createAdminClient } from '@supabase/supabase-js'
import { revalidatePath } from 'next/cache'

export async function updateOrderStatus(formData: FormData) {
  const supabase = await createServerClient()
  const orderId = formData.get('orderId') as string
  const status = formData.get('status') as string

  const { data: { user } } = await supabase.auth.getUser()
  if (!user || user.email !== 'fjborrazas3@gmail.com') throw new Error('Unauthorized')

  const supabaseAdmin = createAdminClient(process.env.NEXT_PUBLIC_SUPABASE_URL || '', process.env.SUPABASE_SERVICE_ROLE_KEY || '')

  if (status === 'cancelled') {
    const { data: orderItems } = await supabaseAdmin.from('order_items').select('product_id, size, quantity').eq('order_id', orderId)
    if (orderItems) {
      for (const item of orderItems) {
        const { data: sizeData } = await supabaseAdmin.from('product_sizes').select('stock_quantity').eq('product_id', item.product_id).eq('size', item.size).single()
        if (sizeData) {
          await supabaseAdmin.from('product_sizes').update({ stock_quantity: sizeData.stock_quantity + item.quantity }).eq('product_id', item.product_id).eq('size', item.size)
        }
      }
    }
  }

  await supabaseAdmin.from('orders').update({ status }).eq('id', orderId)
  revalidatePath('/admin')
}

export async function updateStock(formData: FormData) {
  const supabase = await createServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user || user.email !== 'fjborrazas3@gmail.com') throw new Error('Unauthorized')

  const supabaseAdmin = createAdminClient(process.env.NEXT_PUBLIC_SUPABASE_URL || '', process.env.SUPABASE_SERVICE_ROLE_KEY || '')
  
  const productId = formData.get('productId') as string
  const size = formData.get('size') as string
  const newStock = parseInt(formData.get('stock') as string, 10)

  await supabaseAdmin.from('product_sizes').update({ stock_quantity: newStock }).eq('product_id', productId).eq('size', size)
  revalidatePath('/admin')
  revalidatePath('/catalogo')
}

export async function deleteSize(formData: FormData) {
  const supabase = await createServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user || user.email !== 'fjborrazas3@gmail.com') throw new Error('Unauthorized')

  const supabaseAdmin = createAdminClient(process.env.NEXT_PUBLIC_SUPABASE_URL || '', process.env.SUPABASE_SERVICE_ROLE_KEY || '')
  
  const productId = formData.get('productId') as string
  const size = formData.get('size') as string

  await supabaseAdmin.from('product_sizes').delete().eq('product_id', productId).eq('size', size)
  revalidatePath('/admin')
  revalidatePath('/catalogo')
}

export async function addSize(formData: FormData) {
  const supabase = await createServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user || user.email !== 'fjborrazas3@gmail.com') throw new Error('Unauthorized')

  const supabaseAdmin = createAdminClient(process.env.NEXT_PUBLIC_SUPABASE_URL || '', process.env.SUPABASE_SERVICE_ROLE_KEY || '')
  
  const productId = formData.get('productId') as string
  const newSize = (formData.get('newSize') as string).trim()

  if (newSize) {
    await supabaseAdmin.from('product_sizes').insert({
      product_id: productId,
      size: newSize,
      stock_quantity: 0
    })
  }
  revalidatePath('/admin')
  revalidatePath('/catalogo')
}

export async function addProduct(formData: FormData) {
  const supabase = await createServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user || user.email !== 'fjborrazas3@gmail.com') throw new Error('Unauthorized')

  const supabaseAdmin = createAdminClient(process.env.NEXT_PUBLIC_SUPABASE_URL || '', process.env.SUPABASE_SERVICE_ROLE_KEY || '')
  
  const name = formData.get('name') as string
  const price = parseFloat(formData.get('price') as string)
  const category = formData.get('category') as string
  const image_url = formData.get('image_url') as string
  const sizesString = formData.get('sizes') as string // ej: "S, M, L"

  const { data: newProduct, error } = await supabaseAdmin.from('products').insert({
    name, price, category, image_url, description: '', is_new: true
  }).select('id').single()

  if (newProduct) {
    const finalSizes = sizesString ? sizesString.split(',').map(s => s.trim()).filter(s => s) : ['Único']
    for (const size of finalSizes) {
      await supabaseAdmin.from('product_sizes').insert({
        product_id: newProduct.id,
        size: size,
        stock_quantity: 0 
      })
    }
  }

  revalidatePath('/admin')
  revalidatePath('/catalogo')
}
