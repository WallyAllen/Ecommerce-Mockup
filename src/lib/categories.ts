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
    { id: 'basket', name: 'Basket' },
    { id: 'basicas', name: 'Básicas' },
    { id: 'boxyfit', name: 'Boxy Fit' },
    { id: 'futbol', name: 'Fútbol' },
    { id: 'oversize', name: 'Oversize' }
  ],
  buzos: [
    { id: 'baggy', name: 'Baggys' },
    { id: 'boxyfit', name: 'Boxy Fit' },
    { id: 'crewneck', name: 'Cuello Redondo' },
    { id: 'deportivos', name: 'Deportivos' },
    { id: 'hoodies', name: 'Hoodies' }
  ],
  pantalones: [
    { id: 'cargos', name: 'Cargos' },
    { id: 'jeans', name: 'Jeans' },
    { id: 'joggers', name: 'Joggers' },
    { id: 'parachute', name: 'Parachute' },
    { id: 'shorts', name: 'Shorts' }
  ],
  calzado: [
    { id: 'chanclas', name: 'Chanclas / Slides' },
    { id: 'chunkies', name: 'Chunkies' },
    { id: 'deportivas', name: 'Deportivas' }
  ],
  accesorios: [
    { id: 'cadenas', name: 'Cadenas' },
    { id: 'mochilas', name: 'Mochilas' },
    { id: 'pulseras', name: 'Pulseras' },
    { id: 'relojes', name: 'Relojes' },
    { id: 'termos', name: 'Termos' }
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
