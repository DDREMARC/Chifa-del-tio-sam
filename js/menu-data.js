/* =========================================================
   Datos de la carta — El Tío Sam Chifa
   Separado de main.js para mantener el contenido editable
   sin tocar la lógica de la página.

   Fuente: foto de la carta impresa (img/carta_tio_sam.jpeg).
   PRECIOS: la carta impresa no los muestra; quedan "S/ —".
   DESCRIPCIONES: por confirmar.
   Para un plato con foto: poner img (ruta relativa a html/,
   p. ej. "../img/chaufa_especial.jpeg").
   ========================================================= */

const MENU_CATEGORIES = [
  { id: "sopas",          label: "Sopas" },
  { id: "chaufas",        label: "Chaufas" },
  { id: "combinados",     label: "Combinados y Tallarines" },
  { id: "salteados",      label: "Platos Salteados" },
  { id: "dulces",         label: "Platos Dulces" },
];

// Número que recibe los pedidos por WhatsApp (formato internacional, sin +)
const MENU_WHATSAPP = "51987654321";

const MENU_ITEMS = [
  // ---- Sopas ----
  { cat: "sopas", img: "../img/sopa_especial.jpeg", name: "Sopa o wantan especial", desc: "Chancho, pollo o langostinos. Descripción por confirmar.", price: "S/ —" },
  { cat: "sopas", img: "", name: "Sopa de pollo", desc: "Descripción por confirmar.", price: "S/ —" },
  { cat: "sopas", img: "", name: "Sopa de kion", desc: "Descripción por confirmar.", price: "S/ —" },

  // ---- Chaufas ----
  { cat: "chaufas", img: "", name: "Chaufa de pollo", desc: "Descripción por confirmar.", price: "S/ —" },
  { cat: "chaufas", img: "", name: "Chaufa de chancho", desc: "Descripción por confirmar.", price: "S/ —" },
  { cat: "chaufas", img: "", name: "Chaufa de carne", desc: "Descripción por confirmar.", price: "S/ —" },
  { cat: "chaufas", img: "", name: "Chaufa mixto", desc: "Pollo y chancho. Descripción por confirmar.", price: "S/ —" },
  { cat: "chaufas", img: "../img/chaufa_especial.jpeg", name: "Chaufa especial", desc: "Chancho, pollo y langostinos. Descripción por confirmar.", price: "S/ —" },
  { cat: "chaufas", img: "", name: "Chaufa con pollo a la parrilla", desc: "Descripción por confirmar.", price: "S/ —" },
  { cat: "chaufas", img: "", name: "Chaufa con chuleta a la parrilla", desc: "Descripción por confirmar.", price: "S/ —" },
  { cat: "chaufas", img: "", name: "Chaufa con broaster", desc: "Descripción por confirmar.", price: "S/ —" },
  { cat: "chaufas", img: "", name: "Aeropuerto de pollo", desc: "Descripción por confirmar.", price: "S/ —" },
  { cat: "chaufas", img: "", name: "Aeropuerto de chancho", desc: "Descripción por confirmar.", price: "S/ —" },
  { cat: "chaufas", img: "../img/aeropuerto_especial.jpeg", name: "Aeropuerto especial", desc: "Chancho, pollo y langostinos. Descripción por confirmar.", price: "S/ —" },

  // ---- Combinados y Tallarines ----
  { cat: "combinados", img: "", name: "Combinado", desc: "Chaufa + tallarín saltado. Descripción por confirmar.", price: "S/ —" },
  { cat: "combinados", img: "", name: "Combinado de chancho", desc: "Descripción por confirmar.", price: "S/ —" },
  { cat: "combinados", img: "", name: "Combinado especial", desc: "Pollo, chancho y langostinos. Descripción por confirmar.", price: "S/ —" },
  { cat: "combinados", img: "", name: "Tallarín Taypa", desc: "Pollo, chancho y langostino. Descripción por confirmar.", price: "S/ —" },
  { cat: "combinados", img: "../img/tallarin_saltado.jpeg", name: "Tallarín saltado de pollo", desc: "Descripción por confirmar.", price: "S/ —" },
  { cat: "combinados", img: "", name: "Tallarín saltado de chancho", desc: "Descripción por confirmar.", price: "S/ —" },
  { cat: "combinados", img: "", name: "Tallarín saltado mixto", desc: "Pollo y chancho. Descripción por confirmar.", price: "S/ —" },

  // ---- Platos Salteados (todos con chaufa) ----
  { cat: "salteados", img: "", name: "Chi jau kay + chaufa", desc: "Descripción por confirmar.", price: "S/ —" },
  { cat: "salteados", img: "", name: "Pollo con verdura + chaufa", desc: "Descripción por confirmar.", price: "S/ —" },
  { cat: "salteados", img: "", name: "Chancho con verdura + chaufa", desc: "Descripción por confirmar.", price: "S/ —" },
  { cat: "salteados", img: "", name: "Pollo con frijolito chino + chaufa", desc: "Descripción por confirmar.", price: "S/ —" },
  { cat: "salteados", img: "", name: "Pollo con champiñones + chaufa", desc: "Descripción por confirmar.", price: "S/ —" },
  { cat: "salteados", img: "", name: "Saltado de pollo + chaufa", desc: "Descripción por confirmar.", price: "S/ —" },
  { cat: "salteados", img: "../img/lomo_saltado.jpeg", name: "Lomo saltado + chaufa", desc: "Descripción por confirmar.", price: "S/ —" },
  { cat: "salteados", img: "", name: "Taypa especial + chaufa", desc: "Descripción por confirmar.", price: "S/ —" },
  { cat: "salteados", img: "", name: "Pollo enrollado + chaufa", desc: "Descripción por confirmar.", price: "S/ —" },

  // ---- Platos Dulces (todos con chaufa, salvo el wantan frito) ----
  { cat: "dulces", img: "", name: "Kam lu wantan + chaufa", desc: "Descripción por confirmar.", price: "S/ —" },
  { cat: "dulces", img: "", name: "Tipa kay + chaufa", desc: "Descripción por confirmar.", price: "S/ —" },
  { cat: "dulces", img: "../img/chancho_piña.jpeg", name: "Chancho con piña + chaufa", desc: "Descripción por confirmar.", price: "S/ —" },
  { cat: "dulces", img: "", name: "Pollo con piña + chaufa", desc: "Descripción por confirmar.", price: "S/ —" },
  { cat: "dulces", img: "", name: "Chancho con tamarindo + chaufa", desc: "Descripción por confirmar.", price: "S/ —" },
  { cat: "dulces", img: "", name: "Pollo con tamarindo + chaufa", desc: "Descripción por confirmar.", price: "S/ —" },
  { cat: "dulces", img: "", name: "Limón kay + chaufa", desc: "Descripción por confirmar.", price: "S/ —" },
  { cat: "dulces", img: "", name: "Porción de wantan frito", desc: "Descripción por confirmar.", price: "S/ —" },
];
