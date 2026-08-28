"use client";

import Link from "next/link";
import Image from "next/image";
import { Truck, MapPin, ArrowRight, Zap, ShieldCheck } from "lucide-react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  isNew: boolean;
}

interface HomePageClientProps {
  newArrivals: Product[];
}

export default function HomePageClient({ newArrivals }: HomePageClientProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  const heroOpacity = useTransform(scrollYProgress, [0, 1], [1, 0]);
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 200]);

  const categories = [
    { name: "Buzos", image: "/images/buzo-new.png", url: "/catalogo?categoria=buzos", span: "col-span-1 md:col-span-2 row-span-2" },
    { name: "Remeras", image: "/images/buzo-new.png", url: "/catalogo?categoria=remeras", span: "col-span-1 md:col-span-1 row-span-1" },
    { name: "Calzado", image: "/images/calzado.png", url: "/catalogo?categoria=calzado", span: "col-span-1 md:col-span-1 row-span-1" },
    { name: "Joggers", image: "/images/jogger.png", url: "/catalogo?categoria=pantalones&subcategoria=joggers", span: "col-span-1 md:col-span-2 row-span-1" },
  ];

  return (
    <div className="flex flex-col bg-brand-black min-h-screen selection:bg-brand-red selection:text-white" ref={containerRef}>
      {/* Hero Section */}
      <section className="relative h-[95vh] w-full flex flex-col justify-center overflow-hidden">
        {/* Parallax Background */}
        <motion.div style={{ opacity: heroOpacity, y: heroY }} className="absolute inset-0 z-0">
          <Image 
            src="https://images.unsplash.com/photo-1512374382149-233c42b6a83b?w=1600&q=80" 
            alt="Streetwear Hero" 
            fill
            priority
            className="object-cover opacity-30 grayscale mix-blend-luminosity"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-brand-black via-brand-black/40 to-transparent" />
        </motion.div>
        
        {/* Hero Content */}
        <div className="relative z-20 px-6 w-full max-w-7xl mx-auto flex flex-col items-start mt-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <span className="text-brand-red font-montserrat font-black tracking-[0.2em] text-sm md:text-base uppercase mb-4 flex items-center gap-2">
              <Zap className="w-5 h-5" /> Experiencia Cero Fricción
            </span>
            <h1 className="font-anton text-6xl md:text-[8rem] text-white uppercase tracking-wider mb-2 leading-[0.85]">
              LA MEJOR PILCHA.<br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-neutral-300 to-neutral-600">SIN ESPERAS.</span>
            </h1>
            <p className="text-neutral-400 font-montserrat font-medium text-lg md:text-xl max-w-xl mt-6 mb-10 leading-relaxed">
              Catálogo ultra-rápido. Atención instantánea 24/7. Elegís, comprás y te lo mandamos hoy mismo. 
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
              <Link 
                href="/catalogo" 
                className="group relative bg-brand-red text-white font-black py-4 px-12 uppercase tracking-widest text-center overflow-hidden flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-[0.98] transition-transform duration-300"
              >
                <div className="absolute inset-0 bg-white translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out z-0" />
                <span className="relative z-10 group-hover:text-black transition-colors duration-300">Explorar Drop</span>
                <ArrowRight className="w-5 h-5 relative z-10 group-hover:text-black group-hover:translate-x-1 transition-all duration-300" />
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Floating Trust Indicators */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="absolute bottom-10 left-0 right-0 px-6"
        >
          <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex items-center gap-3 text-neutral-300">
              <div className="bg-neutral-900/50 p-2 rounded-full border border-neutral-800 backdrop-blur-sm">
                <Zap className="w-4 h-4 text-brand-red" />
              </div>
              <span className="font-montserrat text-xs font-bold uppercase tracking-wider">Atención IA Instantánea</span>
            </div>
            <div className="flex items-center gap-3 text-neutral-300">
              <div className="bg-neutral-900/50 p-2 rounded-full border border-neutral-800 backdrop-blur-sm">
                <Truck className="w-4 h-4 text-brand-red" />
              </div>
              <span className="font-montserrat text-xs font-bold uppercase tracking-wider">Envíos en el día</span>
            </div>
            <div className="hidden md:flex items-center gap-3 text-neutral-300">
              <div className="bg-neutral-900/50 p-2 rounded-full border border-neutral-800 backdrop-blur-sm">
                <ShieldCheck className="w-4 h-4 text-brand-red" />
              </div>
              <span className="font-montserrat text-xs font-bold uppercase tracking-wider">Pago Seguro</span>
            </div>
            <div className="hidden md:flex items-center gap-3 text-neutral-300">
              <div className="bg-neutral-900/50 p-2 rounded-full border border-neutral-800 backdrop-blur-sm">
                <MapPin className="w-4 h-4 text-brand-red" />
              </div>
              <span className="font-montserrat text-xs font-bold uppercase tracking-wider">Retiro por Berisso</span>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Marquee Banner */}
      <div className="w-full bg-brand-red py-3 overflow-hidden border-y border-neutral-800 relative z-20 shadow-2xl">
        <div className="flex w-max animate-marquee">
          <div className="flex gap-12 pr-12 text-black font-anton text-2xl uppercase tracking-widest">
            <span>ATENCIÓN IA 24/7</span>
            <span>•</span>
            <span>STOCK EN TIEMPO REAL</span>
            <span>•</span>
            <span>ENVÍOS EN EL DÍA</span>
            <span>•</span>
            <span>PAGOS SEGUROS</span>
            <span>•</span>
            <span>ATENCIÓN IA 24/7</span>
            <span>•</span>
            <span>STOCK EN TIEMPO REAL</span>
            <span>•</span>
            <span>ENVÍOS EN EL DÍA</span>
            <span>•</span>
          </div>
          <div className="flex gap-12 pr-12 text-black font-anton text-2xl uppercase tracking-widest">
            <span>ATENCIÓN IA 24/7</span>
            <span>•</span>
            <span>STOCK EN TIEMPO REAL</span>
            <span>•</span>
            <span>ENVÍOS EN EL DÍA</span>
            <span>•</span>
            <span>PAGOS SEGUROS</span>
            <span>•</span>
            <span>ATENCIÓN IA 24/7</span>
            <span>•</span>
            <span>STOCK EN TIEMPO REAL</span>
            <span>•</span>
            <span>ENVÍOS EN EL DÍA</span>
            <span>•</span>
          </div>
        </div>
      </div>

      {/* Bento Grid Categories Section */}
      <section className="py-24 px-6 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="mb-12">
            <h2 className="font-anton text-5xl md:text-6xl uppercase tracking-wider text-white">Equipate</h2>
            <p className="text-neutral-400 font-montserrat font-medium mt-2 text-lg">Las mejores marcas, listas para despachar.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 grid-rows-none md:grid-rows-2 gap-4 h-auto md:h-[600px]">
            {categories.map((cat, idx) => (
              <motion.div
                key={cat.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1, duration: 0.6 }}
                className={`${cat.span} group relative overflow-hidden bg-neutral-900 block border border-neutral-800 hover:border-neutral-600 transition-colors aspect-square md:aspect-auto cursor-pointer`}
              >
                <Link href={cat.url} className="absolute inset-0 z-30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-red">
                  <span className="sr-only">{cat.name}</span>
                </Link>
                <Image
                  src={cat.image}
                  alt={cat.name}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-105 opacity-80 group-hover:opacity-100 mix-blend-luminosity group-hover:mix-blend-normal"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-brand-black via-brand-black/20 to-transparent opacity-80" />
                <div className="absolute bottom-6 left-6 z-20 flex flex-col">
                  <span className="font-anton text-3xl md:text-4xl uppercase tracking-wider text-white group-hover:text-brand-red transition-colors">{cat.name}</span>
                  <div className="flex items-center gap-2 mt-2 text-white font-montserrat font-bold text-sm tracking-widest uppercase opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                    <span>Ver más</span>
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Hot Drops / New Arrivals Section */}
      <section className="py-24 px-6 bg-neutral-950 relative z-10 border-t border-neutral-900">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="w-2 h-2 rounded-full bg-brand-red animate-pulse" />
                <span className="text-brand-red font-montserrat font-bold text-sm tracking-widest uppercase">Recién Llegados</span>
              </div>
              <h2 className="font-anton text-5xl md:text-6xl uppercase tracking-wider text-white">Hot Drops</h2>
            </div>
            <Link 
              href="/catalogo" 
              className="text-white border-b border-brand-red pb-1 hover:text-brand-red transition-colors flex items-center gap-2 text-sm font-montserrat font-black uppercase tracking-widest w-fit focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-red"
            >
              Ver Catálogo Completo <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {newArrivals.map((product, idx) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1, duration: 0.5 }}
              >
                <Link href={`/producto/${product.id}`} className="group flex flex-col gap-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-red">
                  <div className="relative aspect-[3/4] bg-neutral-900 overflow-hidden border border-neutral-800 group-hover:border-neutral-500 transition-colors">
                    {product.isNew && (
                      <span className="absolute top-3 left-3 bg-brand-red text-white text-[10px] font-black px-3 py-1.5 uppercase tracking-widest z-20 backdrop-blur-md">
                        NEW
                      </span>
                    )}
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      sizes="(max-width: 768px) 50vw, 25vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-110 opacity-90 group-hover:opacity-100"
                    />
                    <div className="absolute inset-0 bg-brand-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-sm">
                      <span className="border border-white text-white font-montserrat font-bold text-sm tracking-widest uppercase py-3 px-6 hover:bg-white hover:text-black transition-colors">
                        Ver Detalles
                      </span>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-montserrat font-bold text-sm md:text-base text-neutral-400 group-hover:text-white transition-colors uppercase line-clamp-1">{product.name}</h3>
                    <p className="font-anton text-2xl text-white tracking-wider mt-1">${product.price.toLocaleString('es-AR')}</p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Value Proposition / System Intro */}
      <section className="py-32 px-6 bg-brand-black relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <Zap className="w-12 h-12 text-brand-red mx-auto mb-6" />
          <h2 className="font-anton text-4xl md:text-6xl uppercase tracking-wider text-white mb-6">El fin de las demoras.</h2>
          <p className="text-neutral-400 font-montserrat text-lg md:text-xl font-medium leading-relaxed mb-10">
            Reimaginamos la forma en que comprás ropa. Nuestro Ecosistema Autónomo atiende tus consultas mediante IA en 0 segundos, verifica el stock al instante y asegura tu reserva sin fricción. No más "te respondo cuando puedo".
          </p>
          <Link 
            href="/catalogo" 
            className="inline-block bg-white text-black font-black font-montserrat py-4 px-12 uppercase tracking-widest hover:bg-brand-red hover:text-white transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-red focus-visible:ring-offset-2 focus-visible:ring-offset-brand-black"
          >
            Vivir la Experiencia
          </Link>
        </div>
      </section>
    </div>
  );
}
