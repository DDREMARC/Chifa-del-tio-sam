# LOG_EQUIPO.md

Registro compartido del equipo de agentes. Leer antes de actuar.
Al terminar cada tarea, añadir una entrada en tu sección: archivos modificados, funciones añadidas o cambiadas, y el commit.

**Roles**
- Claude 1: DOM y seguridad
- Claude 2: assets y documentación
- Claude 3: UI/UX
- Claude 4: lead QA

**Rama de trabajo:** `claude/vibrant-wright-0n45bh`. No se escribe directamente en `main`.

## Estado general (2026-10-11)

- La rama de trabajo tiene: escape de texto en las tarjetas de la carta, los 38 platos reales, el logo nuevo, los enlaces de Google Maps y el área táctil de 48px. Está sincronizada con `main` (merge `7e98936`).
- `main` (`fd058d8`) **no** tiene el escape de texto ni los 38 platos: sigue con 23 platos de marcador. Pasar estos cambios a `main` requiere autorización.

## Pendientes

| Tema | Responsable sugerido | Estado |
|---|---|---|
| Imágenes rotas en la portada: `chaufa_carne.jpg`, `chaufa_pollo.jpg`, `chaufa_chancho.jpg` (borradas en `main`) | Claude 2 | Pendiente: elegir foto nueva para cada tarjeta |
| `MENU_WHATSAPP = "51987654321"` es un número de prueba | Lead QA | Pendiente: número real |
| Precios (`S/ —`) y descripciones de 38 platos | Claude 2 / dueño | Pendiente: datos reales |
| Animaciones GSAP sin verificar: el CDN no carga en el entorno de prueba | Claude 3, Claude 4 | Pendiente: prueba con CDN |
| Merge de la rama de trabajo a `main` | Lead QA | Pendiente de autorización |
| Si el CDN de GSAP no carga, el panel del menú lateral (`.staggered-menu-panel`) queda encima de la página en el móvil y bloquea los toques. Solo GSAP lo oculta (`js/staggered-menu.js`, línea 107) | Claude 1 | Pendiente: ocultarlo por CSS por defecto |
| Claude 2 (`claude/stoic-archimedes-y1rvtt`) cambió en paralelo el logo, Maps y las fotos de la portada: chocará con la rama de trabajo y con el PR #2 | Lead QA | Pendiente: decidir qué versión queda |

## Claude 1 — DOM y seguridad

### 2026-10-11

- **Sincronización con `main`:** `git checkout main` y `git pull origin main` (avance rápido a `fd058d8`). No hubo cambios en archivos. Después volví a la rama de trabajo.
- **Verificación de `escapeHtml`:** en la rama de trabajo, `buildItemCard` escapa `item.name`, `item.desc` y `item.price` (`js/main.js`, líneas 171 a 173). En `main` no existe.
- **`ab9412b`:** área táctil de 48px.
  - Archivos: `css/style.css`, `css/option-wheel.css`, `css/staggered-menu.css`.
  - Funciones: ninguna (solo CSS).
- **`c961617`:** escape en tarjetas, enlaces de Maps.
  - Archivos: `js/main.js`, `html/index.html`, `html/carta.html`, `html/contacto.html`, `css/style.css`.
  - Funciones: `buildItemCard` (modificada); helper `escapeHtml` (creado en `main.js`, luego movido).
- **`5209cce`:** escape compartido.
  - Archivos: `js/sitio.js`, `js/main.js`, `js/experiencia.js`.
  - Funciones: `escapeHtml` añadida en `js/sitio.js` y expuesta como `TioSam.escapeHtml`; `renderFlowing` modificada en `js/experiencia.js`.
- **`7e98936`:** merge de `origin/main` en la rama de trabajo, sin conflictos.
- **`c3abe1d`:** 38 platos y logo nuevo.
  - Archivos: `js/menu-data.js` (38 platos, 5 categorías), `html/carta.html` (descripción y subtítulo), `html/index.html`, `html/contacto.html`, `index.html`, `js/staggered-menu.js` (logo `img/logo_tio_sam.jpeg`).
  - Funciones: ninguna.
- **Verificación:** sintaxis correcta en los archivos JS. Prueba en navegador a 375px: sin scroll horizontal, 38 platos renderizados con nombres exactos (16 con `+`), ningún botón visible menor de 48px, enlaces de Maps correctos.
- **Commit de esta entrada:** ver `git log` (queda después de este archivo).

## Claude 2 — assets y documentación

_Sin entradas todavía._

## Claude 3 — UI/UX

### 2026-10-11

- **Rama:** `claude/vigilant-fermat-k32czj` → PR #2 hacia `main` (https://github.com/DDREMARC/Chifa-del-tio-sam/pull/2). Ya incluye la rama del equipo (merge `268bc28`).
- **Sincronización:** `git checkout main` y `git pull origin main`: sin cambios (`fd058d8`). Merge de `origin/claude/vibrant-wright-0n45bh` en mi rama.
  - Conflictos resueltos: se quedan los 38 platos del equipo, mi diseño y `rel="noopener noreferrer"`.
- **`6aade96`:** carta nocturna, respuesta táctil y tarjeta de Maps.
  - Tokens nuevos en `css/style.css`: `--night: #0D0D0D`, `--gold-line: #E5A93B`, `--ease-tactil: cubic-bezier(0.16, 1, 0.3, 1)`.
  - `html/carta.html`: `<body class="carta-noche">`, con fondo de noche y resplandor de farolillos. Títulos de categoría en dorado, con filete.
  - `.menu-item`: cristal oscuro `rgba(13,13,13,.8)`, borde `rgba(229,169,59,.25)`, `backdrop-filter: blur(12px)`.
  - `.menu-item__order`: dorado, 48px, alineado al pie de la tarjeta.
  - `:active` → `scale(0.96)` con `transform .15s var(--ease-tactil)` en `.btn`, `.menu-item__order`, `.maps-card`, `.foot-maps`, `.wheel-trigger`, `.sm-toggle`, `.clasicos__more` y `.foot-social a`. Solo anima `transform`.
  - `html/contacto.html`: `.maps-card`, tarjeta táctil de 64px con la dirección.
  - Corrige imágenes rotas en la portada: "Los clásicos" usa `chaufa_especial`, `aeropuerto_especial` y `lomo_saltado`. Esto resuelve la fila de la tabla de pendientes.
- **`752ef37`:** viñeta radial en las fotos (`.menu-item__icon::after`).
  - "Cómo llegar" del pie pasa a `.foot-maps`, botón de 48px en las 3 páginas.
  - Contraste AA en el texto del pie.
- **`268bc28`:** merge con los 38 platos.
  - Fotos reales asignadas: Sopa o wantan especial, Chaufa especial, Aeropuerto especial, Tallarín saltado mixto, Lomo saltado + chaufa, Chancho con piña + chaufa.
  - Sus descripciones parten del texto de la carta y añaden kion, sillao, cebolla china y wok a fuego vivo. Los otros 32 platos siguen con "Descripción por confirmar.".
  - `a[href*="maps.app.goo.gl"]` ahora excluye `.maps-card` y `.foot-maps`, para no pisar su layout.
- **Verificación en Chromium (390px y 1280px):**
  - Los 38 `.menu-item` tienen `rgba(13,13,13,0.8)`, borde `rgba(229,169,59,0.25)` 1px y `blur(12px)`.
  - Los 38 botones de pedido miden 48px.
  - Al pulsar, `transform: matrix(0.96…)`.
  - Sin scroll horizontal ni errores 404.
- **Fotos sin plato:** `mostrito.jpeg` y `orjita_china.jpeg`, porque esos platos no figuran en la carta del local.

## Claude 4 — lead QA

_Sin entradas todavía._
