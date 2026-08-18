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
          <h3 className="font-anton text-xl text-white tracking-wider mb-4">IMPORTADOS BSSO</h3>
          <p className="mb-2">La mejor indumentaria urbana y deportiva.</p>
          <p>Envíos en moto a Berisso, Ensenada y La Plata.</p>
        </div>

        <div>
          <h4 className="font-bold text-white mb-4 uppercase">Redes Sociales</h4>
          <ul className="space-y-2">
            <li>
              <a href="https://instagram.com/importados.bsso2" target="_blank" rel="noreferrer" className="flex items-center gap-2 hover:text-red-500 transition-colors">
                <InstagramIcon className="w-4 h-4" /> @importados.bsso2
              </a>
            </li>
            <li>
              <a href="https://instagram.com/valen.imports2" target="_blank" rel="noreferrer" className="flex items-center gap-2 hover:text-red-500 transition-colors">
                <InstagramIcon className="w-4 h-4" /> @valen.imports2 (Accesorios)
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold text-white mb-4 uppercase">Local</h4>
          <ul className="space-y-2">
            <li className="flex items-start gap-2">
              <MapPin className="w-4 h-4 mt-0.5 shrink-0" />
              <span>16 e/ 166 y 167, Berisso</span>
            </li>
            <li>
              <p className="text-neutral-500 mt-2">Jueves o Sábados - Consultar horarios</p>
            </li>
            <li className="pt-2">
              <a href="https://www.google.com/maps?q=Importados+Berisso%F0%9F%91%95%F0%9F%A7%A2%F0%9F%A4%A9,+Edgar+Aschieri+4416,+B1923+Berisso,+Provincia+de+Buenos+Aires&ftid=0x95a2e5001710cdf7:0x146911eae1a6f180&entry=gps&lucs=,94242550,94224825,94227247,94227248,47071704,47069508,94218641,94233079,94203019,47084304,94208458,94208447&g_ep=CAISDTYuMTQyLjAuOTE5NzAYACDXggMqbCw5NDI0MjU1MCw5NDIyNDgyNSw5NDIyNzI0Nyw5NDIyNzI0OCw0NzA3MTcwNCw0NzA2OTUwOCw5NDIxODY0MSw5NDIzMzA3OSw5NDIwMzAxOSw0NzA4NDMwNCw5NDIwODQ1OCw5NDIwODQ0N0ICQVI%3D&g_st=com.google.maps.preview.copy" target="_blank" rel="noreferrer" className="inline-block px-4 py-2 border border-neutral-700 rounded-md hover:bg-neutral-800 transition-colors text-xs font-semibold">
                Ver en Google Maps
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="container mx-auto px-4 mt-8 pt-8 border-t border-neutral-800 text-center text-xs">
        <p>&copy; {new Date().getFullYear()} Importados Berisso. Todos los derechos reservados.</p>
      </div>
    </footer>
  );
}
