# El Tío Sam Chifa — Guía del proyecto (CLAUDE.md)

App web para el restaurante **El Tío Sam Chifa** (*Wok, Fuego & Tradición Cantonesa*):
una pantalla con tres pestañas — Carta del Chifa, Comandas de Clientes (con registro
de pagos) y Resumen del Día. Todo en español.

## Stack

- TanStack Start v1 (React 19, TanStack Router, Vite 8, Tailwind CSS v4).
- Package manager: **bun** (`bun install`, `bun run dev`, `bun run build`).
- NO instalar ni usar `react-router-dom`. El enrutador es `@tanstack/react-router`.
- Iconos: `lucide-react`. Componentes shadcn/ui en `src/components/ui`.

## Estructura

- `src/routes/index.tsx` — TODA la app vive aquí: las tres pestañas y los datos de ejemplo.
- `src/routes/__root.tsx` — layout raíz.
- `src/routeTree.gen.ts` — generado automáticamente, NO editarlo a mano.

## Datos (de ejemplo, volátiles)

Todo está en `src/routes/index.tsx`:

- **Carta**: 20 platos con código `CHI-xx` (Comunes, Mixtos, Sopas, Guarniciones),
  precios en soles (S/).
- **Comandas**: 14 pedidos con código `P-2xx`, cliente, plato, modalidad
  (Mesa / Para llevar / Delivery), método de pago (Efectivo, Tarjeta, Yape/Plin)
  y **registro de pago por pedido**: monto, método y estado (pagado / pendiente).
- **Resumen del Día**: tablas calculadas automáticamente (recaudación por categoría,
  por método de pago, Mesa vs. Para llevar/Delivery).

Los nombres de clientes y algunos precios son de ejemplo; el dueño pasará los reales.

## Diseño SQL acordado (3 tablas)

```sql
menu_platos (id, codigo UNIQUE, nombre, descripcion, categoria, precio, ingredientes)
reservas    (id, cliente, telefono, personas, fecha_hora, estado: pendiente|confirmada|atendida)
pedidos     (id, cliente, plato_id FK, modalidad: mesa|llevar|delivery, metodo_pago, monto, estado_pago: pagado|pendiente)
```

Exportado también a Notion: página "Chifa del Tío Sam - Esquema SQL".
Aún NO hay base de datos en la app — cuando se active el backend, crear estas tablas.

## Pendientes

1. **Pagos**: confirmar país del negocio (¿Perú?) y habilitar proveedor de cobros.
2. **Función de IA con Claude**: el usuario aún elige entre recomendador de sopas,
   descripciones de platos, análisis de ventas o chat de atención.
3. Precios y nombres reales de la carta (los actuales son de ejemplo).

## Convenciones

- UI en español. Precios en soles (S/), formato `S/ 22.00`.
- Tema visual: carbón oscuro (`#0d0d11`, `#16161f`), rojo laca/wok y dorados cálidos.
