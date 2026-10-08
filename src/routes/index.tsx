import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  Soup,
  Users,
  ShoppingBag,
  UtensilsCrossed,
  Banknote,
  CreditCard,
  Smartphone,
  ChartPie,
} from "lucide-react";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "El Tío Sam Chifa | Carta, comandas y ventas" },
      {
        name: "description",
        content:
          "Carta de platos chifa, registro de comandas de clientes y resumen de ventas del día de El Tío Sam Chifa.",
      },
      { property: "og:title", content: "El Tío Sam Chifa | Carta, comandas y ventas" },
      {
        property: "og:description",
        content: "Carta chifa, comandas de clientes y resumen de ventas del día.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
});

type Producto = {
  codigo: string;
  nombre: string;
  categoria: "Platos Comunes" | "Platos Mixtos" | "Sopas" | "Guarniciones" | "Dulces";
  descripcion: string;
  precio: number;
};

type Cliente = {
  codigo: string;
  nombre: string;
  compro: string;
  gasto: number;
  modalidad: "Mesa" | "Para llevar";
  pago: "Efectivo" | "Tarjeta" | "Yape/Plin";
  personas: number;
  estado: "Pagado" | "Pendiente";
};

const productos: Producto[] = [
  { codigo: "CHI-001", nombre: "Arroz Chaufa", categoria: "Platos Comunes", descripcion: "Arroz salteado al wok con cerdo, huevo, cebolla china y sillao.", precio: 22 },
  { codigo: "CHI-002", nombre: "Lomo Saltado", categoria: "Platos Comunes", descripcion: "Lomo fino salteado a fuego alto con cebolla, tomate y papas fritas.", precio: 26 },
  { codigo: "CHI-003", nombre: "Tallarín Saltado", categoria: "Platos Comunes", descripcion: "Fideo saltado con verduras crocantes y pollo o carne.", precio: 23 },
  { codigo: "CHI-004", nombre: "Pollo Chijaukay", categoria: "Platos Comunes", descripcion: "Pollo frito crocante bañado en salsa de ostión y ajonjolí.", precio: 24 },
  { codigo: "CHI-005", nombre: "Pollo Tipakay", categoria: "Platos Comunes", descripcion: "Pollo apanado en salsa agridulce con piña y pimiento.", precio: 24 },
  { codigo: "CHI-006", nombre: "Kam Lu Wantán", categoria: "Platos Comunes", descripcion: "Wantán frito con pollo, cerdo, langostinos y salsa tamarindo.", precio: 27 },
  { codigo: "CHI-007", nombre: "Chaufa Mixto Especial", categoria: "Platos Mixtos", descripcion: "Chaufa con pollo, chancho y langostinos.", precio: 28 },
  { codigo: "CHI-008", nombre: "Aeropuerto Especial", categoria: "Platos Mixtos", descripcion: "Chaufa y tallarín saltado juntos con tortilla de huevo.", precio: 25 },
  { codigo: "CHI-009", nombre: "Tallarín Sam Si", categoria: "Platos Mixtos", descripcion: "Tallarín con tres carnes: pollo, chancho y res.", precio: 26 },
  { codigo: "CHI-010", nombre: "Chaufa de Mariscos", categoria: "Platos Mixtos", descripcion: "Arroz al wok con langostinos, calamar y conchitas.", precio: 30 },
  { codigo: "CHI-011", nombre: "Chancho con Piña", categoria: "Platos Mixtos", descripcion: "Chancho asado salteado con piña y salsa agridulce.", precio: 25 },
  { codigo: "CHI-012", nombre: "Sopa Wantán Especial", categoria: "Sopas", descripcion: "Caldo con wantanes, pollo, chancho, verduras y huevo de codorniz.", precio: 20 },
  { codigo: "CHI-013", nombre: "Sopa Fuchifú", categoria: "Sopas", descripcion: "Caldo de pollo con huevo batido, fideo y cebolla china.", precio: 18 },
  { codigo: "CHI-014", nombre: "Sopa Pac Pow", categoria: "Sopas", descripcion: "Sopa con fideos fritos, pollo y verduras chinas.", precio: 19 },
  { codigo: "CHI-015", nombre: "Wantán Frito (6 und)", categoria: "Guarniciones", descripcion: "Wantanes crocantes rellenos con salsa de tamarindo.", precio: 14 },
  { codigo: "CHI-016", nombre: "Siu Mai al Vapor", categoria: "Guarniciones", descripcion: "Bocaditos de cerdo y langostino cocidos al vapor.", precio: 16 },
  { codigo: "CHI-017", nombre: "Enrollado Primavera", categoria: "Guarniciones", descripcion: "Rollitos fritos de verduras y pollo.", precio: 15 },
  { codigo: "CHI-018", nombre: "Arroz Blanco", categoria: "Guarniciones", descripcion: "Porción de arroz graneado al estilo chifa.", precio: 6 },
  { codigo: "CHI-019", nombre: "Min Pao Dulce", categoria: "Dulces", descripcion: "Pan al vapor relleno de frejol dulce.", precio: 8 },
  { codigo: "CHI-020", nombre: "Lychee en Almíbar", categoria: "Dulces", descripcion: "Lychees frescos servidos fríos en almíbar.", precio: 10 },
];

const clientes: Cliente[] = [
  { codigo: "T-201", nombre: "María Quispe Flores", compro: "Arroz Chaufa (x2) + Wantán Frito", gasto: 58, modalidad: "Mesa", pago: "Efectivo", personas: 2, estado: "Pagado" },
  { codigo: "T-202", nombre: "Jorge Huamán Ríos", compro: "Aeropuerto Especial", gasto: 25, modalidad: "Para llevar", pago: "Yape/Plin", personas: 1, estado: "Pagado" },
  { codigo: "T-203", nombre: "Rosa Delgado Paredes", compro: "Chaufa de Mariscos + Sopa Wantán + Siu Mai", gasto: 66, modalidad: "Mesa", pago: "Tarjeta", personas: 3, estado: "Pagado" },
  { codigo: "T-204", nombre: "Carlos Mendoza Vera", compro: "Pollo Chijaukay (x4)", gasto: 96, modalidad: "Mesa", pago: "Tarjeta", personas: 4, estado: "Pagado" },
  { codigo: "T-205", nombre: "Lucía Torres Campos", compro: "Tallarín Saltado", gasto: 23, modalidad: "Para llevar", pago: "Yape/Plin", personas: 1, estado: "Pendiente" },
  { codigo: "T-206", nombre: "Pedro Salas Gutiérrez", compro: "Kam Lu Wantán + Chancho con Piña", gasto: 52, modalidad: "Mesa", pago: "Efectivo", personas: 3, estado: "Pagado" },
  { codigo: "T-207", nombre: "Ana Castillo León", compro: "Sopa Fuchifú (x2)", gasto: 36, modalidad: "Mesa", pago: "Yape/Plin", personas: 2, estado: "Pagado" },
  { codigo: "T-208", nombre: "Miguel Ramos Ortiz", compro: "Chaufa Mixto Especial (x3)", gasto: 84, modalidad: "Para llevar", pago: "Tarjeta", personas: 3, estado: "Pagado" },
  { codigo: "T-209", nombre: "Elena Vargas Soto", compro: "Lomo Saltado + Min Pao Dulce", gasto: 34, modalidad: "Mesa", pago: "Efectivo", personas: 2, estado: "Pagado" },
  { codigo: "T-210", nombre: "Raúl Paredes Luna", compro: "Tallarín Sam Si (x2) + Enrollado Primavera", gasto: 67, modalidad: "Mesa", pago: "Tarjeta", personas: 4, estado: "Pagado" },
  { codigo: "T-211", nombre: "Sofía Aguilar Chávez", compro: "Pollo Tipakay", gasto: 24, modalidad: "Para llevar", pago: "Yape/Plin", personas: 1, estado: "Pendiente" },
  { codigo: "T-212", nombre: "Fernando Díaz Molina", compro: "Chaufa de Mariscos (x2) + Sopa Pac Pow + Lychee", gasto: 89, modalidad: "Mesa", pago: "Tarjeta", personas: 5, estado: "Pagado" },
  { codigo: "T-213", nombre: "Carmen Rojas Vega", compro: "Arroz Chaufa + Arroz Blanco", gasto: 28, modalidad: "Para llevar", pago: "Efectivo", personas: 1, estado: "Pagado" },
  { codigo: "T-214", nombre: "Luis Espinoza Tapia", compro: "Aeropuerto Especial + Sopa Wantán", gasto: 45, modalidad: "Mesa", pago: "Yape/Plin", personas: 2, estado: "Pendiente" },
];

const formatoSoles = (n: number) =>
  `S/ ${n.toLocaleString("es-PE", { minimumFractionDigits: 2 })}`;

function PagoIcono({ pago }: { pago: Cliente["pago"] }) {
  if (pago === "Efectivo") return <Banknote className="size-4" />;
  if (pago === "Tarjeta") return <CreditCard className="size-4" />;
  return <Smartphone className="size-4" />;
}

function ResumenDia({
  productos,
  clientes,
}: {
  productos: Producto[];
  clientes: Cliente[];
}) {
  const categorias = ["Platos Comunes", "Platos Mixtos", "Sopas", "Guarniciones", "Dulces"] as const;
  const pagos = ["Efectivo", "Tarjeta", "Yape/Plin"] as const;
  const modalidades = ["Mesa", "Para llevar"] as const;

  const porCategoria = categorias.map((cat) => {
    const items = productos.filter((p) => p.categoria === cat);
    const promedio =
      items.reduce((acc, p) => acc + p.precio, 0) / (items.length || 1);
    return { etiqueta: cat, cantidad: items.length, promedio };
  });

  const porPago = pagos.map((pago) => {
    const filas = clientes.filter((c) => c.pago === pago);
    return {
      etiqueta: pago,
      cantidad: filas.length,
      total: filas.reduce((acc, c) => acc + c.gasto, 0),
    };
  });

  const porModalidad = modalidades.map((modalidad) => {
    const filas = clientes.filter((c) => c.modalidad === modalidad);
    return {
      etiqueta: modalidad,
      clientes: filas.length,
      personas: filas.reduce((acc, c) => acc + c.personas, 0),
      total: filas.reduce((acc, c) => acc + c.gasto, 0),
    };
  });

  return (
    <section className="space-y-6">
      {/* Ventas por categoría */}
      <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
        <div className="border-b border-border bg-muted px-4 py-3">
          <h3 className="font-semibold text-foreground">Menú por categoría</h3>
          <p className="text-xs text-muted-foreground">
            Cantidad de platos y precio promedio de cada categoría
          </p>
        </div>
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-border">
              <th className="px-4 py-3 font-semibold text-foreground">Categoría</th>
              <th className="px-4 py-3 text-center font-semibold text-foreground">Platos</th>
              <th className="px-4 py-3 text-right font-semibold text-foreground">Precio promedio</th>
            </tr>
          </thead>
          <tbody>
            {porCategoria.map((f) => (
              <tr
                key={f.etiqueta}
                className="border-b border-border last:border-0 hover:bg-muted/50"
              >
                <td className="px-4 py-3 font-medium text-foreground">{f.etiqueta}</td>
                <td className="px-4 py-3 text-center text-foreground">{f.cantidad}</td>
                <td className="px-4 py-3 text-right font-semibold text-foreground">
                  {formatoSoles(f.promedio)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Recaudación por método de pago */}
      <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
        <div className="border-b border-border bg-muted px-4 py-3">
          <h3 className="font-semibold text-foreground">Recaudación por método de pago</h3>
          <p className="text-xs text-muted-foreground">
            Cuántos clientes pagaron con cada método y cuánto se recaudó
          </p>
        </div>
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-border">
              <th className="px-4 py-3 font-semibold text-foreground">Método de pago</th>
              <th className="px-4 py-3 text-center font-semibold text-foreground">Clientes</th>
              <th className="px-4 py-3 text-right font-semibold text-foreground">Recaudado</th>
            </tr>
          </thead>
          <tbody>
            {porPago.map((f) => (
              <tr
                key={f.etiqueta}
                className="border-b border-border last:border-0 hover:bg-muted/50"
              >
                <td className="px-4 py-3">
                  <span className="inline-flex items-center gap-1.5 text-foreground">
                    <PagoIcono pago={f.etiqueta} />
                    {f.etiqueta}
                  </span>
                </td>
                <td className="px-4 py-3 text-center text-foreground">{f.cantidad}</td>
                <td className="px-4 py-3 text-right font-semibold text-foreground">
                  {formatoSoles(f.total)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mesa vs para llevar */}
      <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
        <div className="border-b border-border bg-muted px-4 py-3">
          <h3 className="font-semibold text-foreground">Mesa vs. para llevar</h3>
          <p className="text-xs text-muted-foreground">
            Comparación de clientes, personas atendidas y recaudación
          </p>
        </div>
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-border">
              <th className="px-4 py-3 font-semibold text-foreground">Modalidad</th>
              <th className="px-4 py-3 text-center font-semibold text-foreground">Clientes</th>
              <th className="px-4 py-3 text-center font-semibold text-foreground">Personas</th>
              <th className="px-4 py-3 text-right font-semibold text-foreground">Recaudado</th>
            </tr>
          </thead>
          <tbody>
            {porModalidad.map((f) => (
              <tr
                key={f.etiqueta}
                className="border-b border-border last:border-0 hover:bg-muted/50"
              >
                <td className="px-4 py-3">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-secondary px-2.5 py-0.5 text-xs font-medium text-secondary-foreground">
                    {f.etiqueta === "Mesa" ? (
                      <UtensilsCrossed className="size-3.5" />
                    ) : (
                      <ShoppingBag className="size-3.5" />
                    )}
                    {f.etiqueta}
                  </span>
                </td>
                <td className="px-4 py-3 text-center text-foreground">{f.clientes}</td>
                <td className="px-4 py-3 text-center text-foreground">{f.personas}</td>
                <td className="px-4 py-3 text-right font-semibold text-foreground">
                  {formatoSoles(f.total)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function RegistrarPago({
  clientes,
  onGuardar,
}: {
  clientes: Cliente[];
  onGuardar: (codigo: string, gasto: number, pago: Cliente["pago"], estado: Cliente["estado"]) => void;
}) {
  const [codigo, setCodigo] = useState(clientes[0]?.codigo ?? "");
  const actual = clientes.find((c) => c.codigo === codigo);
  const [monto, setMonto] = useState(String(actual?.gasto ?? ""));
  const [pago, setPago] = useState<Cliente["pago"]>(actual?.pago ?? "Efectivo");
  const [estado, setEstado] = useState<Cliente["estado"]>(actual?.estado ?? "Pagado");
  const [aviso, setAviso] = useState("");

  const elegir = (cod: string) => {
    setCodigo(cod);
    const c = clientes.find((x) => x.codigo === cod);
    if (c) {
      setMonto(String(c.gasto));
      setPago(c.pago);
      setEstado(c.estado);
    }
    setAviso("");
  };

  const guardar = (e: React.FormEvent) => {
    e.preventDefault();
    const valor = Number(monto);
    if (!codigo || !Number.isFinite(valor) || valor <= 0) {
      setAviso("Ingresa un monto válido mayor a 0.");
      return;
    }
    onGuardar(codigo, Math.round(valor * 100) / 100, pago, estado);
    setAviso(`Pago del pedido ${codigo} guardado.`);
  };

  const campo = "w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground";

  return (
    <form onSubmit={guardar} className="mb-6 rounded-xl border border-border bg-card p-5 shadow-sm">
      <h3 className="mb-1 font-semibold text-foreground">Registrar pago de un pedido</h3>
      <p className="mb-4 text-xs text-muted-foreground">
        Elige el pedido, escribe el monto, el método y el estado del pago.
      </p>
      <div className="grid gap-3 sm:grid-cols-5">
        <label className="text-xs text-muted-foreground sm:col-span-2">
          Pedido
          <select className={campo} value={codigo} onChange={(e) => elegir(e.target.value)}>
            {clientes.map((c) => (
              <option key={c.codigo} value={c.codigo}>
                {c.codigo} · {c.nombre}
              </option>
            ))}
          </select>
        </label>
        <label className="text-xs text-muted-foreground">
          Monto (S/)
          <input type="number" min="0" step="0.5" className={campo} value={monto} onChange={(e) => setMonto(e.target.value)} />
        </label>
        <label className="text-xs text-muted-foreground">
          Método
          <select className={campo} value={pago} onChange={(e) => setPago(e.target.value as Cliente["pago"])}>
            <option>Efectivo</option>
            <option>Tarjeta</option>
            <option>Yape/Plin</option>
          </select>
        </label>
        <label className="text-xs text-muted-foreground">
          Estado
          <select className={campo} value={estado} onChange={(e) => setEstado(e.target.value as Cliente["estado"])}>
            <option>Pagado</option>
            <option>Pendiente</option>
          </select>
        </label>
      </div>
      <div className="mt-4 flex items-center gap-3">
        <button type="submit" className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90">
          Guardar pago
        </button>
        {aviso && <span className="text-sm text-muted-foreground">{aviso}</span>}
      </div>
    </form>
  );
}

function Index() {
  const [vista, setVista] = useState<"productos" | "clientes" | "resumen">(
    "productos",
  );

  const [lista, setLista] = useState<Cliente[]>(clientes);
  const clientes_ = lista;
  const totalVentas = clientes_.filter((c) => c.estado === "Pagado").reduce((acc, c) => acc + c.gasto, 0);
  const totalPersonas = clientes_.reduce((acc, c) => acc + c.personas, 0);

  return (
    <div className="min-h-screen bg-background">
      {/* Encabezado */}
      <header className="border-b border-border bg-card">
        <div className="mx-auto flex max-w-6xl items-center gap-3 px-6 py-6">
          <span className="flex size-12 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
            <Soup className="size-6" />
          </span>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              El Tío Sam Chifa
            </h1>
            <p className="text-sm text-muted-foreground">
              Wok, fuego y tradición cantonesa en Lima
            </p>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-8">
        {/* Pestañas */}
        <div className="mb-8 inline-flex rounded-xl border border-border bg-muted p-1">
          <button
            onClick={() => setVista("productos")}
            className={`flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-medium transition-colors ${
              vista === "productos"
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Soup className="size-4" />
            Carta del Chifa
          </button>
          <button
            onClick={() => setVista("clientes")}
            className={`flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-medium transition-colors ${
              vista === "clientes"
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Users className="size-4" />
            Comandas de Clientes
          </button>
          <button
            onClick={() => setVista("resumen")}
            className={`flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-medium transition-colors ${
              vista === "resumen"
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <ChartPie className="size-4" />
            Resumen del Día
          </button>
        </div>

        {vista === "resumen" ? (
          <ResumenDia productos={productos} clientes={clientes_} />
        ) : vista === "productos" ? (
          <section>
            <div className="mb-4 flex items-end justify-between">
              <div>
                <h2 className="text-lg font-semibold text-foreground">
                  Productos disponibles
                </h2>
                <p className="text-sm text-muted-foreground">
                  {productos.length} platos en el menú
                </p>
              </div>
            </div>

            <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted">
                    <th className="px-4 py-3 font-semibold text-foreground">Código</th>
                    <th className="px-4 py-3 font-semibold text-foreground">Producto</th>
                    <th className="hidden px-4 py-3 font-semibold text-foreground md:table-cell">
                      Descripción
                    </th>
                    <th className="px-4 py-3 font-semibold text-foreground">Categoría</th>
                    <th className="px-4 py-3 text-right font-semibold text-foreground">Precio</th>
                  </tr>
                </thead>
                <tbody>
                  {productos.map((p) => (
                    <tr
                      key={p.codigo}
                      className="border-b border-border last:border-0 hover:bg-muted/50"
                    >
                      <td className="px-4 py-3 font-mono text-xs text-muted-foreground">
                        {p.codigo}
                      </td>
                      <td className="px-4 py-3 font-medium text-foreground">{p.nombre}</td>
                      <td className="hidden max-w-xs px-4 py-3 text-muted-foreground md:table-cell">
                        {p.descripcion}
                      </td>
                      <td className="px-4 py-3">
                        <span className="inline-flex rounded-full bg-secondary px-2.5 py-0.5 text-xs font-medium text-secondary-foreground">
                          {p.categoria}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right font-semibold text-foreground">
                        {formatoSoles(p.precio)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        ) : (
          <section>
            {/* Resumen */}
            <div className="mb-6 grid gap-4 sm:grid-cols-3">
              <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
                <p className="text-sm text-muted-foreground">Cobrado del día</p>
                <p className="mt-1 text-2xl font-bold text-foreground">
                  {formatoSoles(totalVentas)}
                </p>
              </div>
              <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
                <p className="text-sm text-muted-foreground">Clientes atendidos</p>
                <p className="mt-1 text-2xl font-bold text-foreground">{clientes_.length}</p>
              </div>
              <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
                <p className="text-sm text-muted-foreground">Personas en total</p>
                <p className="mt-1 text-2xl font-bold text-foreground">{totalPersonas}</p>
              </div>
            </div>

            <RegistrarPago
              clientes={clientes_}
              onGuardar={(codigo, gasto, pago, estado) =>
                setLista((prev) =>
                  prev.map((c) => (c.codigo === codigo ? { ...c, gasto, pago, estado } : c)),
                )
              }
            />

            <div className="overflow-x-auto rounded-xl border border-border bg-card shadow-sm">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted">
                    <th className="px-4 py-3 font-semibold text-foreground">Código</th>
                    <th className="px-4 py-3 font-semibold text-foreground">Cliente</th>
                    <th className="px-4 py-3 font-semibold text-foreground">Qué compró</th>
                    <th className="px-4 py-3 font-semibold text-foreground">Modalidad</th>
                    <th className="px-4 py-3 font-semibold text-foreground">Pago</th>
                    <th className="px-4 py-3 text-center font-semibold text-foreground">Personas</th>
                    <th className="px-4 py-3 font-semibold text-foreground">Estado</th>
                    <th className="px-4 py-3 text-right font-semibold text-foreground">Gastó</th>
                  </tr>
                </thead>
                <tbody>
                  {clientes_.map((c) => (
                    <tr
                      key={c.codigo}
                      className="border-b border-border last:border-0 hover:bg-muted/50"
                    >
                      <td className="px-4 py-3 font-mono text-xs text-muted-foreground">
                        {c.codigo}
                      </td>
                      <td className="px-4 py-3 font-medium text-foreground">{c.nombre}</td>
                      <td className="max-w-52 px-4 py-3 text-muted-foreground">{c.compro}</td>
                      <td className="px-4 py-3">
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-secondary px-2.5 py-0.5 text-xs font-medium text-secondary-foreground">
                          {c.modalidad === "Mesa" ? (
                            <UtensilsCrossed className="size-3.5" />
                          ) : (
                            <ShoppingBag className="size-3.5" />
                          )}
                          {c.modalidad}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="inline-flex items-center gap-1.5 text-foreground">
                          <PagoIcono pago={c.pago} />
                          {c.pago}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center text-foreground">{c.personas}</td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${
                            c.estado === "Pagado"
                              ? "bg-primary text-primary-foreground"
                              : "bg-destructive text-destructive-foreground"
                          }`}
                        >
                          {c.estado}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right font-semibold text-foreground">
                        {formatoSoles(c.gasto)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
