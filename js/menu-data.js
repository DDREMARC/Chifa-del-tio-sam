/* =========================================================
   Datos de la carta — El Tío Sam Chifa
   Separado de main.js para mantener el contenido editable
   sin tocar la lógica de la página.

   Fuente: img/carta_tio_sam.jpeg (38 platos, mismas secciones).
   Precios: la carta no los muestra; quedan en "S/ —" hasta confirmarlos.
   Descripción: el texto que trae la carta entre paréntesis; los platos
   con foto lo amplían con el vocabulario de la casa (kion, sillao,
   cebolla china, wok a fuego vivo). El resto queda
   "Descripción por confirmar." hasta tenerla.
   Para poner una foto: img = ruta relativa a html/, p. ej. "../img/lomo_saltado.jpeg".
   ========================================================= */

const MENU_CATEGORIES = [
  { id: "sopas",       label: "Sopas" },
  { id: "chaufas",     label: "Chaufas" },
  { id: "combinados",  label: "Combinados y tallarines" },
  { id: "saltados",    label: "Platos saltados" },
  { id: "dulces",      label: "Platos dulces" },
];

// Número que recibe los pedidos por WhatsApp (formato internacional, sin +)
const MENU_WHATSAPP = "51987654321";

const MENU_ITEMS = [
  // ---- Sopas ----
  { cat: "sopas", img: "../img/sopa_especial.jpeg", name: "Sopa o wantan especial", desc: "Chancho, pollo o langostinos en caldo de la casa con kion y cebolla china.", price: "S/ —" },
  { cat: "sopas", img: "", name: "Sopa de pollo", desc: "Descripción por confirmar.", price: "S/ —" },
  { cat: "sopas", img: "", name: "Sopa de kion", desc: "Descripción por confirmar.", price: "S/ —" },

  // ---- Chaufas ----
  { cat: "chaufas", img: "", name: "Chaufa de pollo", desc: "Descripción por confirmar.", price: "S/ —" },
  { cat: "chaufas", img: "", name: "Chaufa de chancho", desc: "Descripción por confirmar.", price: "S/ —" },
  { cat: "chaufas", img: "", name: "Chaufa de carne", desc: "Descripción por confirmar.", price: "S/ —" },
  { cat: "chaufas", img: "", name: "Chaufa mixto", desc: "Pollo, chancho", price: "S/ —" },
  { cat: "chaufas", img: "../img/chaufa_especial.jpeg", name: "Chaufa especial", desc: "Chancho, pollo y langostino salteados al wok a fuego vivo, con sillao, kion y cebolla china.", price: "S/ —" },
  { cat: "chaufas", img: "", name: "Chaufa con pollo a la parrilla", desc: "Descripción por confirmar.", price: "S/ —" },
  { cat: "chaufas", img: "", name: "Chaufa con chuleta a la parrilla", desc: "Descripción por confirmar.", price: "S/ —" },
  { cat: "chaufas", img: "", name: "Chaufa con broaster", desc: "Descripción por confirmar.", price: "S/ —" },
  { cat: "chaufas", img: "", name: "Aeropuerto de pollo", desc: "Descripción por confirmar.", price: "S/ —" },
  { cat: "chaufas", img: "", name: "Aeropuerto de chancho", desc: "Descripción por confirmar.", price: "S/ —" },
  { cat: "chaufas", img: "../img/aeropuerto_especial.jpeg", name: "Aeropuerto especial", desc: "Chancho, pollo y langostino; chaufa y tallarín revueltos al wok a fuego vivo con sillao y cebolla china.", price: "S/ —" },

  // ---- Combinados y tallarines ----
  { cat: "combinados", img: "", name: "Combinado", desc: "Chaufa + tallarín saltado", price: "S/ —" },
  { cat: "combinados", img: "", name: "Combinado de chancho", desc: "Descripción por confirmar.", price: "S/ —" },
  { cat: "combinados", img: "", name: "Combinado especial", desc: "Pollo, chancho y langostino", price: "S/ —" },
  { cat: "combinados", img: "", name: "Tallarín Taypa", desc: "Pollo, chancho y langostino", price: "S/ —" },
  { cat: "combinados", img: "", name: "Tallarín saltado de pollo", desc: "Descripción por confirmar.", price: "S/ —" },
  { cat: "combinados", img: "", name: "Tallarín saltado de chancho", desc: "Descripción por confirmar.", price: "S/ —" },
  { cat: "combinados", img: "../img/tallarin_saltado.jpeg", name: "Tallarín saltado mixto", desc: "Pollo + chancho. Fideos al wok a fuego vivo con sillao y cebolla china.", price: "S/ —" },

  // ---- Platos saltados ----
  { cat: "saltados", img: "", name: "Chi jau kay + chaufa", desc: "Descripción por confirmar.", price: "S/ —" },
  { cat: "saltados", img: "", name: "Pollo con verdura + chaufa", desc: "Descripción por confirmar.", price: "S/ —" },
  { cat: "saltados", img: "", name: "Chancho con verdura + chaufa", desc: "Descripción por confirmar.", price: "S/ —" },
  { cat: "saltados", img: "", name: "Pollo con frijolito chino + chaufa", desc: "Descripción por confirmar.", price: "S/ —" },
  { cat: "saltados", img: "", name: "Pollo con champiñones + chaufa", desc: "Descripción por confirmar.", price: "S/ —" },
  { cat: "saltados", img: "", name: "Saltado de pollo + chaufa", desc: "Descripción por confirmar.", price: "S/ —" },
  { cat: "saltados", img: "../img/lomo_saltado.jpeg", name: "Lomo saltado + chaufa", desc: "Lomo salteado al wok a fuego vivo con sillao, servido con su chaufa.", price: "S/ —" },
  { cat: "saltados", img: "", name: "Taypa especial + chaufa", desc: "Descripción por confirmar.", price: "S/ —" },
  { cat: "saltados", img: "", name: "Pollo enrollado + chaufa", desc: "Descripción por confirmar.", price: "S/ —" },

  // ---- Platos dulces ----
  { cat: "dulces", img: "", name: "Kam lu wantan + chaufa", desc: "Descripción por confirmar.", price: "S/ —" },
  { cat: "dulces", img: "", name: "Tipa kay + chaufa", desc: "Descripción por confirmar.", price: "S/ —" },
  { cat: "dulces", img: "../img/chancho_piña.jpeg", name: "Chancho con piña + chaufa", desc: "Chancho dorado al wok a fuego vivo en salsa agridulce de piña con kion, servido con chaufa.", price: "S/ —" },
  { cat: "dulces", img: "", name: "Pollo con piña + chaufa", desc: "Descripción por confirmar.", price: "S/ —" },
  { cat: "dulces", img: "", name: "Chancho con tamarindo + chaufa", desc: "Descripción por confirmar.", price: "S/ —" },
  { cat: "dulces", img: "", name: "Pollo con tamarindo + chaufa", desc: "Descripción por confirmar.", price: "S/ —" },
  { cat: "dulces", img: "", name: "Limón kay + chaufa", desc: "Descripción por confirmar.", price: "S/ —" },
  { cat: "dulces", img: "", name: "Porción de wantan frito", desc: "Descripción por confirmar.", price: "S/ —" },
];
