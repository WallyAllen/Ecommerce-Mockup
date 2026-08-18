import { supabase } from './supabase';

export type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string; // Mapeado desde image_url
  isNew: boolean; // Mapeado desde is_new
  images: string[];
  sizes: { name: string; inStock: boolean }[];
};

function mapProductRecord(p: any): Product {
  return {
    id: p.id,
    name: p.name,
    description: p.description,
    price: Number(p.price),
    category: p.category,
    image: p.image_url,
    isNew: p.is_new,
    images: [p.image_url],
    sizes: p.product_sizes ? p.product_sizes.map((s: any) => ({
      name: s.size,
      inStock: s.stock_quantity > 0
    })) : []
  };
}

export async function getProductsByCategory(category?: string): Promise<Product[]> {
  let query = supabase.from('products').select('*, product_sizes(size, stock_quantity)');
  
  if (category && category !== 'todos') {
    query = query.eq('category', category);
  }
  
  const { data, error } = await query;
  
  if (error || !data) {
    console.error("Error fetching products:", error);
    return [];
  }
  
  return data.map(mapProductRecord);
}

export async function getProductById(id: string): Promise<Product | null> {
  const { data, error } = await supabase
    .from('products')
    .select('*, product_sizes(size, stock_quantity)')
    .eq('id', id)
    .single();
    
  if (error || !data) {
    console.error("Error fetching product:", error);
    return null;
  }
  
  return mapProductRecord(data);
}

export async function getNewArrivals(): Promise<Product[]> {
  const { data, error } = await supabase
    .from('products')
    .select('*, product_sizes(size, stock_quantity)')
    .eq('is_new', true)
    .limit(4);
    
  if (error || !data) return [];
  return data.map(mapProductRecord);
}

export const products: any[] = []; // Deprecated, kept just in case
