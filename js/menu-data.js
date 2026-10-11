/* =========================================================
   Datos de la carta — El Tío Sam Chifa
   Separado de main.js para mantener el contenido editable
   sin tocar la lógica de la página.

   Los platos con nombre salen de la carta del local
   (img/carta_tio_sam.jpeg) y tienen foto real en img/.
   El resto ("Plato NN") sigue siendo un espacio por llenar: su
   descripción es un texto de muestra por categoría.
   Precios: sin confirmar, se quedan en "S/ —".
   Para completar un plato: poner name, desc, price y, si hay foto,
   img (ruta relativa a html/, p. ej. "../img/lomo_saltado.jpeg").
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
  { cat: "chaufas", img: "../img/chaufa_especial.jpeg", name: "Chaufa especial", desc: "Chancho, pollo y langostino salteados al wok a fuego vivo, con sillao, kion y cebolla china.", price: "S/ —" },
  { cat: "chaufas", img: "../img/aeropuerto_especial.jpeg", name: "Aeropuerto especial", desc: "Chaufa y tallarín revueltos en el wok, con chancho, pollo y langostino.", price: "S/ —" },
  { cat: "chaufas", img: "", name: "Plato 03", desc: "Arroz al wok a fuego vivo con sillao, kion y cebolla china. Detalle por confirmar.", price: "S/ —" },
  { cat: "chaufas", img: "", name: "Plato 04", desc: "Arroz al wok a fuego vivo con sillao, kion y cebolla china. Detalle por confirmar.", price: "S/ —" },
  { cat: "chaufas", img: "", name: "Plato 05", desc: "Arroz al wok a fuego vivo con sillao, kion y cebolla china. Detalle por confirmar.", price: "S/ —" },
  { cat: "chaufas", img: "", name: "Plato 06", desc: "Arroz al wok a fuego vivo con sillao, kion y cebolla china. Detalle por confirmar.", price: "S/ —" },

  // ---- Sopas y Entradas ----
  { cat: "sopas", img: "../img/sopa_especial.jpeg", name: "Sopa o wantán especial", desc: "Caldo de la casa con chancho, pollo o langostinos, kion y cebolla china.", price: "S/ —" },
  { cat: "sopas", img: "", name: "Plato 08", desc: "Caldo de la casa con kion y cebolla china. Detalle por confirmar.", price: "S/ —" },
  { cat: "sopas", img: "", name: "Plato 09", desc: "Caldo de la casa con kion y cebolla china. Detalle por confirmar.", price: "S/ —" },
  { cat: "sopas", img: "", name: "Plato 10", desc: "Caldo de la casa con kion y cebolla china. Detalle por confirmar.", price: "S/ —" },
  { cat: "sopas", img: "", name: "Plato 11", desc: "Caldo de la casa con kion y cebolla china. Detalle por confirmar.", price: "S/ —" },

  // ---- Platos de Fondo ----
  { cat: "fondos", img: "../img/lomo_saltado.jpeg", name: "Lomo saltado + chaufa", desc: "Lomo salteado al wok a fuego vivo con sillao, servido con su chaufa.", price: "S/ —" },
  { cat: "fondos", img: "../img/tallarin_saltado.jpeg", name: "Tallarín saltado", desc: "De pollo, de chancho o mixto: fideos al wok con sillao y cebolla china.", price: "S/ —" },
  { cat: "fondos", img: "", name: "Plato 14", desc: "Salteado al wok a fuego vivo con sillao y cebolla china. Detalle por confirmar.", price: "S/ —" },
  { cat: "fondos", img: "", name: "Plato 15", desc: "Salteado al wok a fuego vivo con sillao y cebolla china. Detalle por confirmar.", price: "S/ —" },
  { cat: "fondos", img: "", name: "Plato 16", desc: "Salteado al wok a fuego vivo con sillao y cebolla china. Detalle por confirmar.", price: "S/ —" },
  { cat: "fondos", img: "", name: "Plato 17", desc: "Salteado al wok a fuego vivo con sillao y cebolla china. Detalle por confirmar.", price: "S/ —" },
  { cat: "fondos", img: "", name: "Plato 18", desc: "Salteado al wok a fuego vivo con sillao y cebolla china. Detalle por confirmar.", price: "S/ —" },

  // ---- Especialidades ----
  { cat: "especialidades", img: "../img/chancho_piña.jpeg", name: "Chancho con piña + chaufa", desc: "Chancho dorado en salsa agridulce de piña, servido con chaufa.", price: "S/ —" },
  { cat: "especialidades", img: "", name: "Plato 20", desc: "Receta de la casa, al wok a fuego vivo. Detalle por confirmar.", price: "S/ —" },
  { cat: "especialidades", img: "", name: "Plato 21", desc: "Receta de la casa, al wok a fuego vivo. Detalle por confirmar.", price: "S/ —" },
  { cat: "especialidades", img: "", name: "Plato 22", desc: "Receta de la casa, al wok a fuego vivo. Detalle por confirmar.", price: "S/ —" },
  { cat: "especialidades", img: "", name: "Plato 23", desc: "Receta de la casa, al wok a fuego vivo. Detalle por confirmar.", price: "S/ —" },
];
