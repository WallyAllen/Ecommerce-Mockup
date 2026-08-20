export const MAIN_CATEGORIES = [
  { id: 'remeras', name: 'Remeras' },
  { id: 'buzos', name: 'Buzos' },
  { id: 'pantalones', name: 'Pantalones' },
  { id: 'calzado', name: 'Calzado' },
  { id: 'accesorios', name: 'Accesorios' },
  { id: 'perfumes', name: 'Perfumes' },
  { id: 'gorras', name: 'Gorras' },
];

export const SUB_CATEGORIES: Record<string, { id: string, name: string }[]> = {
  remeras: [
    { id: 'oversize', name: 'Oversize' },
    { id: 'boxyfit', name: 'Boxy Fit' },
    { id: 'futbol', name: 'Fútbol' },
    { id: 'basket', name: 'Basket' },
    { id: 'basicas', name: 'Básicas' }
  ],
  buzos: [
    { id: 'hoodies', name: 'Hoodies' },
    { id: 'crewneck', name: 'Cuello Redondo' },
    { id: 'baggy', name: 'Baggys' },
    { id: 'boxyfit', name: 'Boxy Fit' },
    { id: 'deportivos', name: 'Deportivos' }
  ],
  pantalones: [
    { id: 'joggers', name: 'Joggers' },
    { id: 'jeans', name: 'Jeans' },
    { id: 'cargos', name: 'Cargos' },
    { id: 'shorts', name: 'Shorts' },
    { id: 'parachute', name: 'Parachute' }
  ],
  calzado: [
    { id: 'deportivas', name: 'Deportivas' },
    { id: 'chunkies', name: 'Chunkies' },
    { id: 'chanclas', name: 'Chanclas / Slides' }
  ],
  accesorios: [
    { id: 'relojes', name: 'Relojes' },
    { id: 'pulseras', name: 'Pulseras' },
    { id: 'cadenas', name: 'Cadenas' },
    { id: 'termos', name: 'Termos' },
    { id: 'mochilas', name: 'Mochilas' }
  ],
  perfumes: [
    { id: 'arabes', name: 'Árabes' },
    { id: 'disenador', name: 'Diseñador' }
  ],
  gorras: [
    { id: 'curvas', name: 'Curvas' },
    { id: 'planas', name: 'Planas' },
    { id: 'trucker', name: 'Trucker' }
  ]
};
