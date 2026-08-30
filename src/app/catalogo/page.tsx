import { getProductsByCategory } from "@/lib/data";
import CatalogoClient from "@/components/catalogo/CatalogoClient";

export const dynamic = 'force-dynamic';

export default async function Catalogo({
  searchParams,
}: {
  searchParams: Promise<{ categoria?: string; subcategoria?: string }>;
}) {
  const { categoria, subcategoria } = await searchParams;
  
  // Data fetching in server
  const products = await getProductsByCategory(categoria, subcategoria);

  return (
    <div className="container mx-auto px-4 py-8">
      <CatalogoClient 
        initialProducts={products} 
        categoryParam={categoria} 
        subcategoryParam={subcategoria} 
      />
    </div>
  );
}
