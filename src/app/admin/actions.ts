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

  const { data: currentOrder } = await supabaseAdmin.from('orders').select('status').eq('id', orderId).single()
  if (!currentOrder) throw new Error('Order not found')

  if (status === 'cancelled' && currentOrder.status !== 'cancelled') {
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

export async function editProductImage(formData: FormData) {
  const supabase = await createServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user || user.email !== 'fjborrazas3@gmail.com') throw new Error('Unauthorized')

  const supabaseAdmin = createAdminClient(process.env.NEXT_PUBLIC_SUPABASE_URL || '', process.env.SUPABASE_SERVICE_ROLE_KEY || '')
  
  const productId = formData.get('productId') as string
  const imageUrl = formData.get('imageUrl') as string

  await supabaseAdmin.from('products').update({ image_url: imageUrl }).eq('id', productId)
  
  revalidatePath('/admin')
  revalidatePath('/catalogo')
}

export async function deleteProducts(formData: FormData) {
  const supabase = await createServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user || user.email !== 'fjborrazas3@gmail.com') throw new Error('Unauthorized')

  const supabaseAdmin = createAdminClient(process.env.NEXT_PUBLIC_SUPABASE_URL || '', process.env.SUPABASE_SERVICE_ROLE_KEY || '')
  
  const idsString = formData.get('productIds') as string
  if (!idsString) return

  const ids = idsString.split(',')
  
  // Primero borramos los talles para evitar errores de Foreign Key (si no hay CASCADE)
  await supabaseAdmin.from('product_sizes').delete().in('product_id', ids)
  
  // Luego borramos el producto
  await supabaseAdmin.from('products').delete().in('id', ids)
  
  revalidatePath('/admin')
  revalidatePath('/catalogo')
}

export async function editProductDetails(formData: FormData) {
  const supabase = await createServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user || user.email !== 'fjborrazas3@gmail.com') throw new Error('Unauthorized')

  const supabaseAdmin = createAdminClient(process.env.NEXT_PUBLIC_SUPABASE_URL || '', process.env.SUPABASE_SERVICE_ROLE_KEY || '')
  
  const productId = formData.get('productId') as string
  const name = formData.get('name') as string
  const price = parseFloat(formData.get('price') as string)
  const category = formData.get('category') as string

  if (!productId || !name || !price || !category) return

  await supabaseAdmin.from('products').update({ name, price, category }).eq('id', productId)
  
  revalidatePath('/admin')
  revalidatePath('/catalogo')
}

export async function updateFullProduct(formData: FormData) {
  const supabase = await createServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user || user.email !== 'fjborrazas3@gmail.com') throw new Error('Unauthorized')

  const supabaseAdmin = createAdminClient(process.env.NEXT_PUBLIC_SUPABASE_URL || '', process.env.SUPABASE_SERVICE_ROLE_KEY || '')
  
  const productId = formData.get('productId') as string
  const name = formData.get('name') as string
  const price = parseFloat(formData.get('price') as string)
  const category = formData.get('category') as string
  
  // Array of sizes in JSON format
  const sizesJson = formData.get('sizesJson') as string
  let sizes = []
  try {
    sizes = JSON.parse(sizesJson || '[]')
  } catch(e) {}

  if (!productId) return

  // Update product info
  await supabaseAdmin.from('products').update({ name, price, category }).eq('id', productId)
  
  // Update sizes stock
  for (const sizeObj of sizes) {
    if (sizeObj.action === 'delete') {
      await supabaseAdmin.from('product_sizes').delete().eq('product_id', productId).eq('size', sizeObj.size)
    } else {
      await supabaseAdmin.from('product_sizes').update({ stock_quantity: sizeObj.stock_quantity }).eq('product_id', productId).eq('size', sizeObj.size)
    }
  }

  // Check if there is a new size to add
  const newSize = (formData.get('newSize') as string || '').trim()
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
