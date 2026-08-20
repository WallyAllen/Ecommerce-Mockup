import Link from "next/link";
import Image from "next/image";
import { Truck, MapPin, ArrowRight } from "lucide-react";
import { getNewArrivals } from "@/lib/data";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function Home() {
  const categories = [
    { name: "Remeras", image: "/images/buzo-new.png", url: "/catalogo?categoria=remeras" },
    { name: "Buzos", image: "/images/buzo-new.png", url: "/catalogo?categoria=buzos" },
    { name: "Joggers", image: "/images/jogger.png", url: "/catalogo?categoria=pantalones&subcategoria=joggers" },
    { name: "Calzado", image: "/images/calzado.png", url: "/catalogo?categoria=calzado" },
    { name: "Gorras", image: "/images/gorra-new.png", url: "/catalogo?categoria=gorras" },
    { name: "Perfumes", image: "/images/perfume.png", url: "/catalogo?categoria=perfumes" },
    { name: "Accesorios", image: "/images/reloj.png", url: "/catalogo?categoria=accesorios" },
  ];

  const newArrivals = await getNewArrivals();

  return (
    <div className="flex flex-col gap-12 pb-12 bg-black">
      {/* Hero Section */}
      <section className="relative h-[80vh] md:h-[85vh] w-full flex items-center justify-center bg-black overflow-hidden">
        <Image 
          src="https://images.unsplash.com/photo-1512374382149-233c42b6a83b?w=1600&q=80" 
          alt="Streetwear Hero Background" 
          fill
          priority
          className="object-cover z-0 opacity-40 grayscale"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent z-10" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-transparent z-10" />
        
        <div className="relative z-20 text-center px-4 flex flex-col items-center w-full max-w-5xl mt-12">
          <h1 className="font-anton text-[4.5rem] leading-[0.9] md:text-[8rem] text-white uppercase tracking-wider mb-2">
            LA MEJOR<br/>PILCHA
          </h1>
          <h2 className="font-anton text-[2.5rem] md:text-7xl text-[#E60000] uppercase tracking-wider mb-8 leading-none">
            A UN CLIC.
          </h2>
          <Link 
            href="/catalogo" 
            className="bg-[#E60000] hover:bg-white hover:text-black hover:border-white text-white font-black py-4 px-10 rounded-none uppercase tracking-widest transition-colors inline-block text-sm md:text-base border border-[#E60000]"
          >
            Ver Nuevos Ingresos
          </Link>
        </div>
      </section>

      {/* Trust Badges - Banner Width */}
      <section className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2">
          <div className="bg-[#0a0a0a] p-6 rounded-none flex items-center justify-center md:justify-start gap-4 border border-[#333] hover:border-[#666] transition-colors">
            <div className="text-[#E60000]">
              <Truck className="w-8 h-8" strokeWidth={1.5} />
            </div>
            <div>
              <h3 className="font-montserrat font-black text-lg text-white uppercase tracking-wider">Envíos Rápidos</h3>
              <p className="text-neutral-500 text-sm font-semibold">Moto a Berisso, Ensenada y La Plata</p>
            </div>
          </div>
          <div className="bg-[#0a0a0a] p-6 rounded-none flex items-center justify-center md:justify-start gap-4 border border-[#333] border-t-0 md:border-t md:border-l-0 hover:border-[#666] transition-colors">
            <div className="text-[#E60000]">
              <MapPin className="w-8 h-8" strokeWidth={1.5} />
            </div>
            <div>
              <h3 className="font-montserrat font-black text-lg text-white uppercase tracking-wider">Retiro por Local</h3>
              <p className="text-neutral-500 text-sm font-semibold">16 e/ 166 y 167 (Berisso)</p>
            </div>
          </div>
        </div>
      </section>

      {/* Categorías */}
      <section className="container mx-auto px-4">
        <h2 className="font-montserrat font-black text-3xl md:text-4xl mb-6 uppercase tracking-wider text-white">Categorías</h2>
        <div className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide -mx-4 px-4">
          {categories.map((cat) => (
            <Link 
              href={cat.url} 
              key={cat.name} 
              className="group relative w-40 md:w-56 aspect-[3/4] shrink-0 snap-start overflow-hidden rounded-none bg-[#0a0a0a] block border border-[#333] hover:border-[#666] transition-colors"
            >
              <Image
                src={cat.image}
                alt={cat.name}
                fill
                sizes="(max-width: 768px) 160px, 224px"
                className="object-cover transition-transform duration-700 group-hover:scale-105 opacity-90 group-hover:opacity-100"
              />
              <div 
                className="absolute inset-0 transition-opacity z-10" 
                style={{ background: 'linear-gradient(to top, rgba(0,0,0, 0.9) 0%, rgba(0,0,0, 0) 40%)' }}
              />
              <div className="absolute bottom-4 left-4 right-4 text-center z-20">
                <span className="font-montserrat font-black text-2xl uppercase tracking-wider text-white group-hover:text-[#E60000] transition-colors">{cat.name}</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Nuevos Ingresos */}
      <section className="container mx-auto px-4">
        <div className="flex items-end justify-between mb-6 border-b border-[#333] pb-4">
          <h2 className="font-montserrat font-black text-3xl md:text-4xl uppercase tracking-wider leading-none">Recién Llegados</h2>
          <Link href="/catalogo" className="text-white hover:underline flex items-center gap-1 text-sm font-black transition-colors group uppercase tracking-wider">
            Ver todo <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {newArrivals.map((product) => (
            <Link href={`/producto/${product.id}`} key={product.id} className="group flex flex-col gap-3">
              <div className="relative aspect-[4/5] bg-[#0a0a0a] rounded-none overflow-hidden border border-[#333] hover:border-[#666] transition-colors">
                {product.isNew && (
                  <span className="absolute top-0 left-0 bg-[#E60000] text-white text-[10px] font-black px-3 py-1.5 uppercase rounded-none z-20 tracking-widest border-b border-r border-[#E60000]">
                    NUEVO
                  </span>
                )}
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  sizes="(max-width: 768px) 50vw, 25vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>
              <div>
                <h3 className="font-montserrat font-bold text-sm md:text-base text-neutral-400 line-clamp-1 group-hover:text-white transition-colors uppercase">{product.name}</h3>
                <p className="font-montserrat font-black text-xl text-white tracking-wider mt-1">${product.price.toLocaleString('es-AR')}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
