import { Metadata } from "next";
import { getProductById } from "@/lib/data";
import ProductClient from "@/components/producto/ProductClient";

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const product = await getProductById(id);

  if (!product) {
    return { title: 'Producto no encontrado | Importados Berisso' };
  }

  return {
    title: `${product.name} | Importados Berisso`,
    description: product.description,
    openGraph: {
      title: product.name,
      description: product.description,
      images: [product.image],
    },
  };
}

export default async function ProductoDetalle({ params }: Props) {
  const { id } = await params;
  const product = await getProductById(id);

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-20 text-center font-montserrat font-black uppercase text-2xl tracking-wider">
        Producto no encontrado
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6 md:py-12">
      <ProductClient product={product} />
    </div>
  );
}
