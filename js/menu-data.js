/* =========================================================
   Datos de la carta — El Tío Sam Chifa
   Nombres y notas tomados de la carta impresa (img/carta_tio_sam.jpeg).
   Los precios no figuran en esa carta: quedan como "S/ —" hasta confirmarlos.
   Para poner un precio o una foto: editar price / img (ruta relativa a html/).
   ========================================================= */

const MENU_CATEGORIES = [
  { id: "sopas", label: "Sopas" },
  { id: "chaufas", label: "Chaufas" },
  { id: "aeropuertos", label: "Aeropuertos" },
  { id: "combinados", label: "Combinados y Tallarines" },
  { id: "saltados", label: "Platos Saltados" },
  { id: "dulces", label: "Platos Dulces" },
];

// Número que recibe los pedidos por WhatsApp (formato internacional, sin +)
const MENU_WHATSAPP = "51987654321";

const MENU_ITEMS = [
  // ---- Sopas ----
  { cat: "sopas", img: "../img/sopa_especial.jpeg", name: "Sopa o wantan especial", desc: "Chancho, pollo o langostinos.", price: "S/ —" },
  { cat: "sopas", img: "", name: "Sopa de pollo", desc: "", price: "S/ —" },
  { cat: "sopas", img: "", name: "Sopa de kion", desc: "", price: "S/ —" },
  // ---- Chaufas ----
  { cat: "chaufas", img: "", name: "Chaufa de pollo", desc: "Con sopa o wantan frito.", price: "S/ —" },
  { cat: "chaufas", img: "", name: "Chaufa de chancho", desc: "Con sopa o wantan frito.", price: "S/ —" },
  { cat: "chaufas", img: "", name: "Chaufa de carne", desc: "Con sopa o wantan frito.", price: "S/ —" },
  { cat: "chaufas", img: "", name: "Chaufa mixto", desc: "Pollo y chancho. Con sopa o wantan frito.", price: "S/ —" },
  { cat: "chaufas", img: "../img/chaufa_especial.jpeg", name: "Chaufa especial", desc: "Chancho, pollo y langostinos. Con sopa o wantan frito.", price: "S/ —" },
  { cat: "chaufas", img: "", name: "Chaufa con pollo a la parrilla", desc: "Con sopa o wantan frito.", price: "S/ —" },
  { cat: "chaufas", img: "", name: "Chaufa con chuleta a la parrilla", desc: "Con sopa o wantan frito.", price: "S/ —" },
  { cat: "chaufas", img: "../img/mostrito.jpeg", name: "Chaufa con broaster", desc: "Con sopa o wantan frito.", price: "S/ —" },
  // ---- Aeropuertos ----
  { cat: "aeropuertos", img: "", name: "Aeropuerto de pollo", desc: "Con sopa o wantan frito.", price: "S/ —" },
  { cat: "aeropuertos", img: "", name: "Aeropuerto de chancho", desc: "Con sopa o wantan frito.", price: "S/ —" },
  { cat: "aeropuertos", img: "../img/aeropuerto_especial.jpeg", name: "Aeropuerto especial", desc: "Chancho, pollo y langostinos. Con sopa o wantan frito.", price: "S/ —" },
  // ---- Combinados y Tallarines ----
  { cat: "combinados", img: "", name: "Combinado", desc: "Chaufa + tallarín saltado.", price: "S/ —" },
  { cat: "combinados", img: "", name: "Combinado de chancho", desc: "", price: "S/ —" },
  { cat: "combinados", img: "", name: "Combinado especial", desc: "Pollo, chancho y langostinos.", price: "S/ —" },
  { cat: "combinados", img: "../img/tallarin_saltado.jpeg", name: "Tallarín Taypa", desc: "Pollo, chancho y langostinos.", price: "S/ —" },
  { cat: "combinados", img: "", name: "Tallarín saltado de pollo", desc: "", price: "S/ —" },
  { cat: "combinados", img: "", name: "Tallarín saltado de chancho", desc: "", price: "S/ —" },
  { cat: "combinados", img: "", name: "Tallarín saltado mixto", desc: "Pollo y chancho.", price: "S/ —" },
  // ---- Platos Saltados ----
  { cat: "saltados", img: "", name: "Chi jau kay + chaufa", desc: "", price: "S/ —" },
  { cat: "saltados", img: "", name: "Pollo con verdura + chaufa", desc: "", price: "S/ —" },
  { cat: "saltados", img: "", name: "Chancho con verdura + chaufa", desc: "", price: "S/ —" },
  { cat: "saltados", img: "", name: "Pollo con frijolito chino + chaufa", desc: "", price: "S/ —" },
  { cat: "saltados", img: "", name: "Pollo con champiñones + chaufa", desc: "", price: "S/ —" },
  { cat: "saltados", img: "", name: "Saltado de pollo + chaufa", desc: "", price: "S/ —" },
  { cat: "saltados", img: "../img/lomo_saltado.jpeg", name: "Lomo saltado + chaufa", desc: "", price: "S/ —" },
  { cat: "saltados", img: "", name: "Taypa especial + chaufa", desc: "", price: "S/ —" },
  { cat: "saltados", img: "", name: "Pollo enrollado + chaufa", desc: "", price: "S/ —" },
  // ---- Platos Dulces ----
  { cat: "dulces", img: "", name: "Kam lu wantan + chaufa", desc: "", price: "S/ —" },
  { cat: "dulces", img: "", name: "Tipa kay + chaufa", desc: "", price: "S/ —" },
  { cat: "dulces", img: "../img/chancho_piña.jpeg", name: "Chancho con piña + chaufa", desc: "", price: "S/ —" },
  { cat: "dulces", img: "", name: "Pollo con piña + chaufa", desc: "", price: "S/ —" },
  { cat: "dulces", img: "", name: "Chancho con tamarindo + chaufa", desc: "", price: "S/ —" },
  { cat: "dulces", img: "", name: "Pollo con tamarindo + chaufa", desc: "", price: "S/ —" },
  { cat: "dulces", img: "", name: "Limón kay + chaufa", desc: "", price: "S/ —" },
  { cat: "dulces", img: "", name: "Porción de wantan frito", desc: "", price: "S/ —" },
];
