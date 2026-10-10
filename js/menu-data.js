/* =========================================================
   Datos de la carta — El Tío Sam Chifa
   Separado de main.js para mantener el contenido editable
   sin tocar la lógica de la página.

   MARCADOR: los 23 platos son espacios en blanco (placeholder).
   Para un plato real: poner name, desc, price y, si hay foto,
   img (ruta relativa a html/, p. ej. "../img/chaufa_pollo.jpg").
   ========================================================= */

const MENU_CATEGORIES = [
  { id: "chaufas",        label: "Chaufas" },
  { id: "sopas",          label: "Sopas y Entradas" },
  { id: "fondos",         label: "Platos de Fondo" },
  { id: "especialidades", label: "Especialidades" },
];

// Número que recibe los pedidos por WhatsApp (formato internacional, sin +)
const MENU_WHATSAPP = "51987654321";

const MENU_ITEMS = [
  // ---- Chaufas ----
  { cat: "chaufas", img: "", name: "Plato 01", desc: "Descripción por confirmar.", price: "S/ —" },
  { cat: "chaufas", img: "", name: "Plato 02", desc: "Descripción por confirmar.", price: "S/ —" },
  { cat: "chaufas", img: "", name: "Plato 03", desc: "Descripción por confirmar.", price: "S/ —" },
  { cat: "chaufas", img: "", name: "Plato 04", desc: "Descripción por confirmar.", price: "S/ —" },
  { cat: "chaufas", img: "", name: "Plato 05", desc: "Descripción por confirmar.", price: "S/ —" },
  { cat: "chaufas", img: "", name: "Plato 06", desc: "Descripción por confirmar.", price: "S/ —" },

  // ---- Sopas y Entradas ----
  { cat: "sopas", img: "", name: "Plato 07", desc: "Descripción por confirmar.", price: "S/ —" },
  { cat: "sopas", img: "", name: "Plato 08", desc: "Descripción por confirmar.", price: "S/ —" },
  { cat: "sopas", img: "", name: "Plato 09", desc: "Descripción por confirmar.", price: "S/ —" },
  { cat: "sopas", img: "", name: "Plato 10", desc: "Descripción por confirmar.", price: "S/ —" },
  { cat: "sopas", img: "", name: "Plato 11", desc: "Descripción por confirmar.", price: "S/ —" },

  // ---- Platos de Fondo ----
  { cat: "fondos", img: "", name: "Plato 12", desc: "Descripción por confirmar.", price: "S/ —" },
  { cat: "fondos", img: "", name: "Plato 13", desc: "Descripción por confirmar.", price: "S/ —" },
  { cat: "fondos", img: "", name: "Plato 14", desc: "Descripción por confirmar.", price: "S/ —" },
  { cat: "fondos", img: "", name: "Plato 15", desc: "Descripción por confirmar.", price: "S/ —" },
  { cat: "fondos", img: "", name: "Plato 16", desc: "Descripción por confirmar.", price: "S/ —" },
  { cat: "fondos", img: "", name: "Plato 17", desc: "Descripción por confirmar.", price: "S/ —" },
  { cat: "fondos", img: "", name: "Plato 18", desc: "Descripción por confirmar.", price: "S/ —" },

  // ---- Especialidades ----
  { cat: "especialidades", img: "", name: "Plato 19", desc: "Descripción por confirmar.", price: "S/ —" },
  { cat: "especialidades", img: "", name: "Plato 20", desc: "Descripción por confirmar.", price: "S/ —" },
  { cat: "especialidades", img: "", name: "Plato 21", desc: "Descripción por confirmar.", price: "S/ —" },
  { cat: "especialidades", img: "", name: "Plato 22", desc: "Descripción por confirmar.", price: "S/ —" },
  { cat: "especialidades", img: "", name: "Plato 23", desc: "Descripción por confirmar.", price: "S/ —" },
];
