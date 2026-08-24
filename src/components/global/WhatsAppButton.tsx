import { MessageCircle } from "lucide-react";

export default function WhatsAppButton() {
  const waLink = "https://wa.me/5491123456789?text=Hola,%20tengo%20una%20duda%20sobre%20sus%20productos.";

  return (
    <a
      href={waLink}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-20 md:bottom-6 right-4 z-50 bg-[#25D366] hover:bg-white hover:text-[#25D366] text-white p-4 rounded-full shadow-[0_0_20px_rgba(37,211,102,0.5)] transition-all hover:scale-110 flex items-center justify-center border-2 border-[#25D366] hover:border-white group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black"
      aria-label="Contactar por WhatsApp"
    >
      <MessageCircle className="w-7 h-7" />
      <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-300 ease-in-out whitespace-nowrap font-montserrat font-black uppercase text-xs tracking-wider ml-0 group-hover:ml-3">
        WhatsApp
      </span>
    </a>
  );
}
