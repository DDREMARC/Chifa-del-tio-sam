/* =========================================================
   Datos de la carta — El Tío Sam Chifa
   Separado de main.js para mantener el contenido editable
   sin tocar la lógica de la página.
   ========================================================= */

const MENU_CATEGORIES = [
  { id: "comunes",     label: "Platos Comunes" },
  { id: "mixtos",      label: "Platos Mixtos" },
  { id: "guarniciones",label: "Guarniciones" },
  { id: "dulces",      label: "Dulces" },
];

const MENU_ITEMS = [
  // ---- Platos Comunes ----
  {
    cat: "comunes",
    img: "../img/chaufa_carne.jpg",
    name: "Arroz Chaufa",
    desc: "Arroz salteado al wok con cerdo, huevo, cebolla china y sillao.",
    price: "S/ 22",
    detail: "Arroz, cerdo, huevo, cebolla china, sillao, aceite de sésamo, kion, ajo.",
  },
  {
    cat: "comunes",
    img: "../img/imagen_cambiar.jpg",
    name: "Lomo Saltado",
    desc: "Lomo fino salteado a fuego alto con cebolla, tomate y papas fritas.",
    price: "S/ 26",
    detail: "Lomo fino, cebolla, tomate, papas fritas, vinagre, sillao, ají amarillo.",
  },
  {
    cat: "comunes",
    img: "../img/imagen_cambiar.jpg",
    name: "Tallarín Saltado",
    desc: "Fideo saltado con verduras crocantes y tu elección de pollo o carne.",
    price: "S/ 23",
    detail: "Tallarín amarillo, pollo o carne, cebolla, tomate, sillao, ajo.",
  },

  // ---- Platos Mixtos ----
  {
    cat: "mixtos",
    img: "../img/chaufa_pollo.jpg",
    name: "Chaufa Mixto",
    desc: "Chaufa clásico con pollo, carne y camarones en una sola porción.",
    price: "S/ 29",
    detail: "Arroz, pollo, carne, camarones, huevo, cebolla china, sillao, kion.",
  },
  {
    cat: "mixtos",
    img: "../img/imagen_cambiar.jpg",
    name: "Aeropuerto",
    desc: "Fusión de chaufa y tallarín saltado, el clásico plato de dos mundos.",
    price: "S/ 27",
    detail: "Arroz chaufa, tallarín saltado, pollo, carne, huevo, cebolla, sillao.",
  },
  {
    cat: "mixtos",
    img: "../img/imagen_cambiar.jpg",
    name: "Kam Lu Wantán",
    desc: "Wantanes crocantes bañados en salsa agridulce con mariscos y verduras.",
    price: "S/ 32",
    detail: "Wantanes, camarones, calamar, cebolla, zanahoria, salsa agridulce, ajo.",
  },

  // ---- Guarniciones ----
  {
    cat: "guarniciones",
    img: "../img/imagen_cambiar.jpg",
    name: "Wantán Frito",
    desc: "Seis unidades crocantes servidas con salsa de tamarindo.",
    price: "S/ 12",
    detail: "Masa de wantán, carne molida, ajo, cebolla, salsa de tamarindo.",
  },
  {
    cat: "guarniciones",
    img: "../img/imagen_cambiar.jpg",
    name: "Papas Fritas",
    desc: "Corte clásico, doradas y crocantes por fuera.",
    price: "S/ 9",
    detail: "Papa, aceite, sal.",
  },
  {
    cat: "guarniciones",
    img: "../img/imagen_cambiar.jpg",
    name: "Arroz Blanco",
    desc: "Porción adicional de arroz al vapor.",
    price: "S/ 6",
    detail: "Arroz, agua, sal.",
  },

  // ---- Dulces ----
  {
    cat: "dulces",
    img: "../img/imagen_cambiar.jpg",
    name: "Duraznos en Almíbar",
    desc: "El infaltable cierre dulce de todo chifa limeño.",
    price: "S/ 8",
    detail: "Duraznos en almíbar, cereza, leche condensada.",
  },
  {
    cat: "dulces",
    img: "../img/imagen_cambiar.jpg",
    name: "Helado de Lúcuma",
    desc: "Dos bolas de lúcuma cremosa con barquillo.",
    price: "S/ 10",
    detail: "Lúcuma, leche, azúcar, barquillo.",
  },
  {
    cat: "dulces",
    img: "../img/imagen_cambiar.jpg",
    name: "Alfajor Chino",
    desc: "Galleta rellena de manjar blanco, receta de la casa.",
    price: "S/ 6",
    detail: "Harina, manjar blanco, azúcar glas, coco rallado.",
  },
];
