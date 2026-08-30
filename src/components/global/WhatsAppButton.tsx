import { Mail } from "lucide-react";

export default function WhatsAppButton() {
  const mailLink = "mailto:fjborrazas3@gmail.com?subject=Consulta%20sobre%20productos";

  return (
    <a
      href={mailLink}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-20 md:bottom-6 right-4 z-50 bg-[#E60000] hover:bg-white hover:text-[#E60000] text-white p-4 rounded-full shadow-[0_0_20px_rgba(230,0,0,0.5)] transition-all hover:scale-110 flex items-center justify-center border-2 border-[#E60000] hover:border-white group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black"
      aria-label="Contactar por Email"
    >
      <Mail className="w-7 h-7" />
      <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-300 ease-in-out whitespace-nowrap font-montserrat font-black uppercase text-xs tracking-wider ml-0 group-hover:ml-3">
        Contacto
      </span>
    </a>
  );
}
