import { MapPin } from "lucide-react";

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

export default function Footer() {
  return (
    <footer className="bg-black border-t border-neutral-800 pt-10 pb-20 md:pb-10">
      <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8 text-neutral-400 text-sm">
        <div>
          <h3 className="font-anton text-xl text-white tracking-wider mb-4">[COMPLETAR: MARCA]</h3>
          <p className="mb-2">[COMPLETAR: descripción breve del negocio]</p>
          <p>[COMPLETAR: modalidad y zona de envíos]</p>
        </div>

        <div>
          <h4 className="font-bold text-white mb-4 uppercase">Redes Sociales</h4>
          <ul className="space-y-2">
            <li>
              <span className="flex items-center gap-2"><InstagramIcon className="w-4 h-4" /> [COMPLETAR: Instagram]</span>
            </li>
            <li>
              <span className="flex items-center gap-2"><InstagramIcon className="w-4 h-4" /> [COMPLETAR: red secundaria]</span>
            </li>
          </ul>
        </div>

        <div>
          <h4 id="contacto" className="font-bold text-white mb-4 uppercase">Contacto</h4>
          <ul className="space-y-2">
            <li className="flex items-start gap-2">
              <MapPin className="w-4 h-4 mt-0.5 shrink-0" />
              <span>[COMPLETAR: dirección o modalidad de retiro]</span>
            </li>
            <li>
              <p className="text-neutral-500 mt-2">[COMPLETAR: días y horarios]</p>
            </li>
            <li className="pt-2">
              <span className="inline-block px-4 py-2 border border-neutral-700 rounded-md text-xs font-semibold">[COMPLETAR: enlace de ubicación]</span>
            </li>
          </ul>
        </div>
      </div>
      <div className="container mx-auto px-4 mt-8 pt-8 border-t border-neutral-800 text-center text-xs">
        <p>&copy; {new Date().getFullYear()} [COMPLETAR: marca]. Todos los derechos reservados.</p>
      </div>
    </footer>
  );
}
