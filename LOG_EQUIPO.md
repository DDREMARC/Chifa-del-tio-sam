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
| Imágenes rotas en la portada: `chaufa_carne.jpg`, `chaufa_pollo.jpg`, `chaufa_chancho.jpg` (borradas en `main`) | Claude 2 | Resuelto en la rama `claude/stoic-archimedes-y1rvtt` (PR 1 a `main`); falta unir |
| Asignar `mostrito.jpeg` y `orjita_china.jpeg` a platos de la carta | Claude 2 / dueño | Pendiente: el cliente debe confirmar el plato |
| `MENU_WHATSAPP = "51987654321"` es un número de prueba | Lead QA | Pendiente: número real |
| Precios (`S/ —`) y descripciones de 38 platos | Claude 2 / dueño | Pendiente: datos reales |
| Animaciones GSAP sin verificar: el CDN no carga en el entorno de prueba | Claude 3, Claude 4 | Pendiente: prueba con CDN |
| Merge de la rama de trabajo a `main` | Lead QA | Pendiente de autorización |

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

### 2026-10-11

Rama de trabajo propia: `claude/stoic-archimedes-y1rvtt` (PR 1 hacia `main`: https://github.com/DDREMARC/Chifa-del-tio-sam/pull/1). No se escribió en `main`.

- **Sincronización:** `git checkout main` y `git pull origin main` (ya estaba en `fd058d8`). `LOG_EQUIPO.md` no existe en `main`; lo copié desde `origin/claude/vibrant-wright-0n45bh`.
- **`ac2c2f0`:** portada con fotos reales.
  - Archivos: `html/index.html` (sección "clásicos": `chaufa_especial.jpeg`, `lomo_saltado.jpeg`, `aeropuerto_especial.jpeg`; título "Tres clásicos de la casa"), `CLAUDE.md`, `PRODUCT.md`.
- **`2e778d1`:** logo oficial en todas partes.
  - Archivos: `html/index.html`, `html/carta.html`, `html/contacto.html`, `index.html`, `js/staggered-menu.js`, `video/CLAUDE.md` (de `logo.jpg` a `logo_tio_sam.jpeg`); `js/menu-data.js` (solo un comentario de ejemplo).
- **`94bcde0`:** Maps y estado de la carta.
  - Archivos: `html/index.html`, `html/carta.html`, `html/contacto.html` (5 enlaces a `https://maps.app.goo.gl/sFH6uKQQWRxwaUtH8` con `rel="noopener noreferrer"`), `CLAUDE.md`, `PRODUCT.md`.
- **Documentación vigente** (`CLAUDE.md`, `PRODUCT.md`): logo oficial `img/logo_tio_sam.jpeg`, ubicación de Maps, imágenes en reserva `mostrito.jpeg` y `orjita_china.jpeg`, y estado de la carta (38 platos en 5 secciones, no 6).
- **Funciones:** ninguna añadida ni cambiada (solo HTML y documentación).
- **Para el lead QA:** esta rama y `claude/vibrant-wright-0n45bh` cambian las mismas líneas de logo y Maps en los HTML. Al unirlas habrá conflictos menores; el resultado debe quedarse con `logo_tio_sam.jpeg` y la URL `sFH6uKQQWRxwaUtH8`. Mi rama no tiene los 38 platos ni el escape de texto: vienen de la otra.
- **No verificado:** no se probó en navegador; solo se comprobó que cada ruta de imagen apunte a un archivo existente.
- **Commit de esta entrada:** ver `git log` (queda después de este archivo).

## Claude 3 — UI/UX

_Sin entradas todavía._

## Claude 4 — lead QA

_Sin entradas todavía._
